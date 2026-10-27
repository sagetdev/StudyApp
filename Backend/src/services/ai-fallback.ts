import { ApiError } from "@google/genai";

/**
 * Chaîne de modèles, du préféré au dernier recours.
 * Surchargeable via AI_MODELS (noms séparés par des virgules).
 */
const DEFAULT_MODELS = ["gemini-3.8-flash", "gemini-3.8-flash-lite", "gemini-3.5-flash"];

export const MODELS: string[] = (() => {
  const configured = (process.env.AI_MODELS ?? "").split(",").map((m) => m.trim()).filter(Boolean);
  return configured.length ? configured : DEFAULT_MODELS;
})();

const TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 60_000);
const RETRY_DELAY_MS = 600;

/** Erreurs qui ne dépendent pas du modèle : inutile d'essayer les suivants. */
const FAIL_FAST_STATUSES = new Set([400, 401, 403]);

/** Durée pendant laquelle un modèle en échec est mis de côté (évite de re-tester un modèle saturé). */
const COOLDOWN_MS: Record<string, number> = { "429": 60_000, "404": 10 * 60_000, default: 30_000 };
const cooldownUntil = new Map<string, number>();

export class AllModelsFailedError extends Error {
  readonly status = 503;
  constructor(public readonly attempts: Array<{ model: string; reason: string }>) {
    super(`Tous les modèles ont échoué : ${attempts.map((a) => `${a.model} (${a.reason})`).join(", ")}`);
    this.name = "AllModelsFailedError";
  }
}

export class EmptyModelResponseError extends Error {
  constructor() {
    super("Réponse vide du modèle");
    this.name = "EmptyModelResponseError";
  }
}

function statusOf(error: unknown): number | undefined {
  if (error instanceof ApiError) return error.status;
  const status = (error as { status?: unknown } | null)?.status;
  return typeof status === "number" ? status : undefined;
}

function describe(error: unknown): string {
  const status = statusOf(error);
  if (status) return String(status);
  return error instanceof Error ? error.name : "erreur inconnue";
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Une surcharge passagère (5xx, réseau, timeout) mérite un 2e essai rapide sur le même modèle ; un quota (429) ou un modèle absent (404) non. */
function worthQuickRetry(error: unknown): boolean {
  const status = statusOf(error);
  return status === undefined || status >= 500;
}

function putOnCooldown(model: string, error: unknown) {
  const status = statusOf(error);
  cooldownUntil.set(model, Date.now() + (COOLDOWN_MS[String(status)] ?? COOLDOWN_MS.default));
}

/** Modèles disponibles d'abord ; ceux en pause passent en fin de liste (jamais exclus : dernier recours). */
function orderedModels(): string[] {
  const now = Date.now();
  const healthy = MODELS.filter((m) => (cooldownUntil.get(m) ?? 0) <= now);
  const paused = MODELS.filter((m) => (cooldownUntil.get(m) ?? 0) > now);
  return [...healthy, ...paused];
}

/**
 * Exécute `call` avec le premier modèle disponible ; en cas de surcharge, quota, modèle introuvable,
 * timeout ou réponse invalide, bascule sur le suivant. Les erreurs indépendantes du modèle
 * (requête invalide, clé API refusée) sont relancées immédiatement.
 */
export async function withModelFallback<T>(call: (model: string, signal: AbortSignal) => Promise<T>): Promise<T> {
  const attempts: Array<{ model: string; reason: string }> = [];

  for (const model of orderedModels()) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const result = await call(model, AbortSignal.timeout(TIMEOUT_MS));
        cooldownUntil.delete(model);
        if (attempts.length) console.warn(`[ai] Réponse obtenue avec le modèle de secours "${model}".`);
        return result;
      } catch (error) {
        const status = statusOf(error);
        if (status !== undefined && FAIL_FAST_STATUSES.has(status)) throw error;

        const reason = describe(error);
        if (attempt === 1 && worthQuickRetry(error)) {
          console.warn(`[ai] "${model}" a échoué (${reason}), nouvel essai.`);
          await sleep(RETRY_DELAY_MS + Math.random() * 400);
          continue;
        }
        console.warn(`[ai] "${model}" indisponible (${reason}), bascule sur le modèle suivant.`);
        attempts.push({ model, reason });
        putOnCooldown(model, error);
        break;
      }
    }
  }

  throw new AllModelsFailedError(attempts);
}

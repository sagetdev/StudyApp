import { PrismaClient } from "../generated/client/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;

// Initialisation du pool de connexion natif (pg)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Connexion via le Driver Adapter requis par Prisma 7
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
import express from "express";

import authRoutes from "./routes/auth.routes.ts";
import aiRoutes from "./routes/ai.routes.ts"

import { authenticateToken } from "./middleware/auth.middleware";

const PORT = process.env.PORT ?? 4000;
const app = express();

app.use(express.json());

app.get('/api', (req, res) => {
    res.json({
        message: "Welcome to the StudyApp server",
        status: "Server is running perfectly"
    })
})

app.use('/api/auth', authRoutes);
app.use('/api/ai', authenticateToken, aiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
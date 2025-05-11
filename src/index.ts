import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { zoneRouter } from "./routes/zoneRoutes";
import { userRoutes } from "./routes/userRoutes";
//const prisma = new PrismaClient();
import deviceRoutes from "./routes/deviceRoutes";
import saleRouter from "./routes/saleRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import reportRoutes from "./routes/reportRoutes";
import commercialRoutes from "./routes/commercialRoutes";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

// Configuration des variables d'environnement
dotenv.config();

export const app = express();
const PORT = process.env.NODE_ENV === "test" ? 0 : 5001;
// Middlewares
app.use(express.json());
app.use(cors());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use("/", dashboardRoutes);

app.use("/users", userRoutes);

// User profile routes

//Routes of devices service
app.use("/devices", deviceRoutes);

//Routes of zones service
app.use("/zones", zoneRouter);

app.use("/sales", saleRouter);

// Report routes
app.use("/reports", reportRoutes);

// Commercial module routes
app.use("/commercial", commercialRoutes);

// Route de test
app.get("/getSales", (req, res) => {
  res.json({
    sales: 15000,
    message: "Données de vente stables",
  });
});

// Démarrage contrôlé du serveur
export const server = app.listen(PORT, () => {
  console.log(`Stats service actif sur http://localhost:${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});

//export { app, server };
// Gestion propre de l'arrêt
process.on("SIGINT", () => {
  server.close(() => {
    console.log("\nSer veur arrêté proprement");
    process.exit(0);
  });
});

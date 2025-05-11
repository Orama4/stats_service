import express from "express";
import * as commercialController from "../controllers/commercialController";
import { authMiddleware } from "../middlewares/authMiddleware";

/**
 * @swagger
 * tags:
 *   name: Commercial
 *   description: Commercial module API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Response:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *         message:
 *           type: string
 *         errors:
 *           type: object
 */

const router = express.Router();

/* // Apply authentication middleware to all commercial routes
router.use(authMiddleware); */

/**
 * @swagger
 * /commercial/dashboard/stats:
 *   get:
 *     summary: Get dashboard summary statistics
 *     tags: [Commercial]
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 */
router.get("/dashboard/stats", commercialController.getCommercialDashboardStats);

/**
 * @swagger
 * /commercial/dashboard/sales-chart:
 *   get:
 *     summary: Get sales chart data
 *     tags: [Commercial]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *         description: Time period for chart data
 *     responses:
 *       200:
 *         description: Sales chart data retrieved successfully
 */
router.get("/dashboard/sales-chart", commercialController.getCommercialSalesChart);

/**
 * @swagger
 * /commercial/dashboard/top-products:
 *   get:
 *     summary: Get top selling products
 *     tags: [Commercial]
 *     responses:
 *       200:
 *         description: Top products retrieved successfully
 */
router.get("/dashboard/top-products", commercialController.getCommercialTopProducts);

/**
 * @swagger
 * /commercial/clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Commercial]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Results per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Clients retrieved successfully
 */
router.get("/clients", commercialController.getAllClients);

/**
 * @swagger
 * /commercial/clients/{id}:
 *   get:
 *     summary: Get client details
 *     tags: [Commercial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client details retrieved successfully
 *       404:
 *         description: Client not found
 */
router.get("/clients/:id", commercialController.getClientDetails);

/**
 * @swagger
 * /commercial/clients:
 *   post:
 *     summary: Create new client
 *     tags: [Commercial]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               phonenumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client created successfully
 */
router.post("/clients", commercialController.createClient);

// Sales endpoints section - continued documentation pattern
// Order matters! Define specific routes BEFORE parameterized routes to avoid conflicts
router.get("/sales/stats", commercialController.getSalesStats); // Specific route first
router.get("/sales", commercialController.getAllSales);
router.post("/sales", commercialController.createSale);
// Parameterized routes last
router.get("/sales/:id", commercialController.getSaleDetails);
router.delete("/sales/:id", commercialController.deleteSale);

// Product endpoints section
// Order matters! Define specific routes BEFORE parameterized routes to avoid conflicts
router.get("/products/types", commercialController.getProductTypes); // Specific route first
router.get("/products/stats", commercialController.getProductStats); // Specific route first
router.get("/products", commercialController.getAllProducts);
// Parameterized routes last
router.get("/products/:id", commercialController.getProductDetails);

// Remaining client endpoints
router.put("/clients/:id", commercialController.updateClient);
router.delete("/clients/:id", commercialController.deleteClient);
router.get("/clients/:id/contacts", commercialController.getClientContacts);
router.post("/clients/:id/contacts", commercialController.addClientContact);
router.delete("/clients/:id/contacts/:contactId", commercialController.removeClientContact);

export default router; 
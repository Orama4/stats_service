import express from "express";
import * as commercialController from "../controllers/commercial";
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
 *     ClientCreateRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstname
 *         - lastname
 *         - phonenumber
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         phonenumber:
 *           type: string
 *         address:
 *           type: string
 *     ClientUpdateRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         phonenumber:
 *           type: string
 *         address:
 *           type: string
 *     Client:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [endUser]
 *         Profile:
 *           type: object
 *           properties:
 *             firstname:
 *               type: string
 *             lastname:
 *               type: string
 *             phonenumber:
 *               type: string
 *             address:
 *               type: string
 *         EndUser:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             status:
 *               type: string
 *     Contact:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nom:
 *           type: string
 *         telephone:
 *           type: string
 *         endUserId:
 *           type: integer
 *     ContactCreateRequest:
 *       type: object
 *       required:
 *         - nom
 *         - telephone
 *       properties:
 *         nom:
 *           type: string
 *         telephone:
 *           type: string
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         type:
 *           type: string
 *         nom:
 *           type: string
 *           description: Product description/name
 *         price:
 *           type: number
 *         status:
 *           type: string
 *           enum: [connected, disconnected]
 *         macAdresse:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     ProductCreateRequest:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         type:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         status:
 *           type: string
 *           enum: [connected, disconnected]
 *     Sale:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         deviceId:
 *           type: integer
 *         buyerId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         Device:
 *           $ref: '#/components/schemas/Product'
 *         EndUser:
 *           type: object
 *           properties:
 *             User:
 *               $ref: '#/components/schemas/Client'
 *     SaleCreateRequest:
 *       type: object
 *       required:
 *         - deviceId
 *         - userId
 *       properties:
 *         deviceId:
 *           type: integer
 *         userId:
 *           type: integer
 *         price:
 *           type: number
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             pagination:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *         message:
 *           type: string
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
 *             $ref: '#/components/schemas/ClientCreateRequest'
 *     responses:
 *       201:
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Response'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Client'
 *       400:
 *         description: Invalid input or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       500:
 *         description: Server error
 */
router.post("/clients", commercialController.createClient);


/**
 * @swagger
 * /commercial/clients/{id}:
 *   put:
 *     summary: Update client information
 *     tags: [Commercial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientUpdateRequest'
 *     responses:
 *       200:
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: Invalid input or client ID
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /commercial/clients/{id}:
 *   delete:
 *     summary: Deactivate client (mark as inactive)
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
 *         description: Client marked as inactive successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: Invalid client ID or user is not a client
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /commercial/clients/{id}/contacts:
 *   get:
 *     summary: Get client emergency contacts
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
 *         description: Client contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Response'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid client ID
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /commercial/clients/{id}/contacts:
 *   post:
 *     summary: Add emergency contact to client
 *     tags: [Commercial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactCreateRequest'
 *     responses:
 *       201:
 *         description: Contact added successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Response'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid input or client ID
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /commercial/clients/{id}/contacts/{contactId}:
 *   delete:
 *     summary: Remove emergency contact from client
 *     tags: [Commercial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Client or contact not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /commercial/products:
 *   get:
 *     summary: Get all products with filtering and pagination
 *     tags: [Commercial]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in product type or description
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by product type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [connected, disconnected]
 *         description: Filter by product status
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         devices:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /commercial/products/{id}:
 *   get:
 *     summary: Get product details
 *     tags: [Commercial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Response'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product ID format
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /commercial/products/types:
 *   get:
 *     summary: Get all distinct product types
 *     tags: [Commercial]
 *     responses:
 *       200:
 *         description: Product types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Response'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /commercial/products/stats:
 *   get:
 *     summary: Get product statistics
 *     tags: [Commercial]
 *     responses:
 *       200:
 *         description: Product statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /commercial/products:
 *   post:
 *     summary: Create new product
 *     tags: [Commercial]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Response'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

router.post("/products", commercialController.createProduct);

/**
 * @swagger
 * /commercial/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Commercial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [connected, disconnected]
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Response'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input or product ID format
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put("/products/:id", commercialController.updateProduct);

/**
 * @swagger
 * /commercial/products/{id}:
 *   delete:
 *     summary: Delete or deactivate product
 *     description: If product has sales history, it will be marked as disconnected. Otherwise, it will be deleted permanently.
 *     tags: [Commercial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted/deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: Invalid product ID format
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete("/products/:id", commercialController.deleteProduct);

/**
 * @swagger
 * /commercial/sales:
 *   get:
 *     summary: Get all sales with filtering and pagination
 *     tags: [Commercial]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter sales from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter sales until this date
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: integer
 *         description: Filter by client ID
 *       - in: query
 *         name: deviceType
 *         schema:
 *           type: string
 *         description: Filter by device type
 *     responses:
 *       200:
 *         description: Sales retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         sales:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Sale'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /commercial/sales/{id}:
 *   get:
 *     summary: Get sale details
 *     tags: [Commercial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sale ID
 *     responses:
 *       200:
 *         description: Sale details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Response'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Invalid sale ID format
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /commercial/sales:
 *   post:
 *     summary: Create new sale
 *     tags: [Commercial]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleCreateRequest'
 *     responses:
 *       201:
 *         description: Sale created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Response'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Invalid input, device not found, or user is not a client
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /commercial/sales/{id}:
 *   delete:
 *     summary: Delete sale and revert device status
 *     description: Deletes the sale record and reverts the device status back to connected
 *     tags: [Commercial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sale ID
 *     responses:
 *       200:
 *         description: Sale deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: Invalid sale ID format
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /commercial/sales/stats:
 *   get:
 *     summary: Get sales statistics
 *     tags: [Commercial]
 *     responses:
 *       200:
 *         description: Sales statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       500:
 *         description: Server error
 */

// Sales endpoints section - Order matters! Define specific routes BEFORE parameterized routes to avoid conflicts
router.get("/sales/stats", commercialController.getSalesStats); // Specific route first
router.get("/sales", commercialController.getAllSales);
router.post("/sales", commercialController.createSale);
// Parameterized routes last
router.get("/sales/:id", commercialController.getSaleDetails);
router.delete("/sales/:id", commercialController.deleteSale);

// Product endpoints section - Order matters! Define specific routes BEFORE parameterized routes to avoid conflicts
router.get("/products/types", commercialController.getProductTypes); // Specific route first
router.get("/products/stats", commercialController.getProductStats); // Specific route first
router.get("/products", commercialController.getAllProducts);
// Parameterized routes last
router.get("/products/:id", commercialController.getProductDetails);
router.put("/products/:id", commercialController.updateProduct);
router.delete("/products/:id", commercialController.deleteProduct);

// Client endpoints
router.put("/clients/:id", commercialController.updateClient);

/**
 * @swagger
 * /commercial/clients/{id}/password:
 *   put:
 *     summary: Update client password
 *     tags: [Commercial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: New password
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid input or client ID
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.put("/clients/:id/password", commercialController.updateClientPassword);

router.delete("/clients/:id", commercialController.deleteClient);
router.get("/clients/:id/contacts", commercialController.getClientContacts);
router.post("/clients/:id/contacts", commercialController.addClientContact);
router.delete("/clients/:id/contacts/:contactId", commercialController.removeClientContact);

export default router; 
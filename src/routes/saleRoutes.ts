import express from 'express';
import { getTotalSales, getTotalRevenue, getSalesList, getSalesStatistics } from '../controllers/saleController';

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sales management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Sale:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Sale ID
 *         deviceId:
 *           type: integer
 *           description: Device ID
 *         buyerId:
 *           type: integer
 *           description: Buyer ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Sale creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Sale last update date
 *       required:
 *         - deviceId
 *         - buyerId
 */

const router = express.Router();

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Get all sales
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of sales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sales:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sale'
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get('/', getSalesList);

/**
 * @swagger
 * /sales/total-sales:
 *   get:
 *     summary: Get total number of sales
 *     tags: [Sales]
 *     responses:
 *       200:
 *         description: Total sales count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSales:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get('/total-sales', getTotalSales);

/**
 * @swagger
 * /sales/total-revenue:
 *   get:
 *     summary: Get total revenue from sales
 *     tags: [Sales]
 *     responses:
 *       200:
 *         description: Total revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   format: float
 *       500:
 *         description: Server error
 */
router.get('/total-revenue', getTotalRevenue);

/**
 * @swagger
 * /sales/progress-stats:
 *   get:
 *     summary: Get sales progress statistics
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statistics
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, month, year]
 *         description: Group statistics by time period
 *     responses:
 *       200:
 *         description: Sales statistics
 *       500:
 *         description: Server error
 */
router.get('/progress-stats', getSalesStatistics);

export default router;
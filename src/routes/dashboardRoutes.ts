import express from "express";
import {
  getSalesKPIs,
  getTopProducts,
  getRevenueGrowth,
  getProfitMargins,
  getActiveUserMetrics,
  getSecurityMetrics,
  getPeriodProjections,
} from "../controllers/dashboardController";

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard KPIs and analytics endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SalesKPI:
 *       type: object
 *       properties:
 *         totalSales:
 *           type: integer
 *           description: Total number of sales
 *         totalRevenue:
 *           type: number
 *           format: float
 *           description: Total revenue from all sales
 *         totalUsers:
 *           type: integer
 *           description: Total number of users
 */

const router = express.Router();

/**
 * @swagger
 * /get-sales:
 *   get:
 *     summary: Get basic sales KPIs
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Basic sales statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SalesKPI'
 *       500:
 *         description: Server error
 */
router.get("/get-sales", getSalesKPIs);

/**
 * @swagger
 * /bestsellers:
 *   get:
 *     summary: Get top selling products
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: List of top selling products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productName:
 *                         type: string
 *                       deviceCount:
 *                         type: integer
 *                       devicePercentage:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.get("/bestsellers", getTopProducts);

/**
 * @swagger
 * /revenue-growth:
 *   get:
 *     summary: Get revenue growth statistics
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statistics
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for statistics
 *     responses:
 *       200:
 *         description: Revenue growth metrics
 *       500:
 *         description: Server error
 */
router.get("/revenue-growth", getRevenueGrowth);

/**
 * @swagger
 * /profit-margins:
 *   get:
 *     summary: Get profit margin metrics
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statistics
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for statistics
 *     responses:
 *       200:
 *         description: Profit margin metrics
 *       500:
 *         description: Server error
 */
router.get("/profit-margins", getProfitMargins);

/**
 * @swagger
 * /period-projections:
 *   get:
 *     summary: Get end of period projections
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [month, quarter]
 *         description: Period type for projections
 *     responses:
 *       200:
 *         description: Period-end projections
 *       500:
 *         description: Server error
 */
router.get("/period-projections", getPeriodProjections);

/**
 * @swagger
 * /active-users:
 *   get:
 *     summary: Get monthly active users analysis
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *         description: Number of months to analyze
 *     responses:
 *       200:
 *         description: Active user metrics
 *       500:
 *         description: Server error
 */
router.get("/active-users", getActiveUserMetrics);

/**
 * @swagger
 * /security-incidents:
 *   get:
 *     summary: Get security incident metrics
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statistics
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for statistics
 *     responses:
 *       200:
 *         description: Security metrics
 *       500:
 *         description: Server error
 */
router.get("/security-incidents", getSecurityMetrics);

export default router;

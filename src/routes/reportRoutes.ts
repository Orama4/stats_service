// reportRoutes.ts file is used to define the routes for the report generation endpoints. It uses the reportController to handle the requests and generate the reports.
import express from "express";
import {
  generateUsageReport,
  generateSalesReport,
  generateZoneReport,
  generateMonthlyActiveUsersReport,
} from "../controllers/reportController";

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report generation endpoints
 */

const router = express.Router();

/**
 * @swagger
 * /reports/usage:
 *   get:
 *     summary: Generate device usage report
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for report
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for report
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, pdf]
 *         description: Report output format
 *     responses:
 *       200:
 *         description: Device usage report
 *       500:
 *         description: Server error
 */
router.get("/usage", /* authMiddleware, */ generateUsageReport);

/**
 * @swagger
 * /reports/sales:
 *   get:
 *     summary: Generate sales report
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for report
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for report
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, pdf]
 *         description: Report output format
 *     responses:
 *       200:
 *         description: Sales report
 *       500:
 *         description: Server error
 */
router.get("/sales", /* authMiddleware, */ generateSalesReport);

/**
 * @swagger
 * /reports/zones:
 *   get:
 *     summary: Generate zone activity report
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for report
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for report
 *       - in: query
 *         name: zoneId
 *         schema:
 *           type: integer
 *         description: Optional zone ID to filter by
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, pdf]
 *         description: Report output format
 *     responses:
 *       200:
 *         description: Zone activity report
 *       500:
 *         description: Server error
 */
router.get("/zones", /* authMiddleware, */ generateZoneReport);

/**
 * @swagger
 * /reports/active-users:
 *   get:
 *     summary: Generate monthly active users report
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Number of months to include (default 6)
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, pdf]
 *         description: Report output format
 *     responses:
 *       200:
 *         description: Monthly active users report
 *       500:
 *         description: Server error
 */
router.get(
  "/active-users",
  /* authMiddleware, */ generateMonthlyActiveUsersReport
);

export default router;

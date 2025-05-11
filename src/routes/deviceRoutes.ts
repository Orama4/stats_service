import express from "express";
import { getAllDevices,getDeviceStatistics,getDevicesMonth,getDevicesByFilters} from "../controllers/deviceController";
import { authMiddleware } from "../middlewares/authMiddleware";

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: Device management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Device ID
 *         type:
 *           type: string
 *           description: Device type
 *         status:
 *           type: string
 *           enum: [connected, disconnected]
 *           description: Device connection status
 *         price:
 *           type: number
 *           format: float
 *           description: Device price
 *         userId:
 *           type: integer
 *           description: User ID associated with the device
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

const router = express.Router();

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Get all devices
 *     tags: [Devices]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of devices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 devices:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Device'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get("/",/*authMiddleware, */ getAllDevices);

/**
 * @swagger
 * /devices/stats:
 *   get:
 *     summary: Get device statistics
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: Device statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDevices:
 *                   type: integer
 *                 byStatus:
 *                   type: object
 *                 byType:
 *                   type: object
 *       500:
 *         description: Server error
 */
router.get("/stats",/* authMiddleware,*/ getDeviceStatistics);

/**
 * @swagger
 * /devices/monthly-stats:
 *   get:
 *     summary: Get monthly device statistics
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: Monthly device statistics
 *       500:
 *         description: Server error
 */
router.get("/monthly-stats",/* authMiddleware, */getDevicesMonth);

/**
 * @swagger
 * /devices/search:
 *   get:
 *     summary: Search devices by status or type
 *     tags: [Devices]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [connected, disconnected]
 *         description: Filter by device status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by device type
 *     responses:
 *       200:
 *         description: Filtered list of devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 *       500:
 *         description: Server error
 */
router.get("/search", /*authMiddleware,*/ getDevicesByFilters); 
//http://localhost:5001/api/devices/search?status=connected for status or 
//http://localhost:5001/api/devices/search?type=ceinture for type   
//This will be used both in recherche (search by advice type) and filtering (filter by status)            
                                                                    
export default router;
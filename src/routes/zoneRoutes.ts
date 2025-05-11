import express from "express";
import { getAllZones, getTotalZones, getTotalZonesByDate } from '../controllers/zoneController';
import { authMiddleware } from "../middlewares/authMiddleware";

/**
 * @swagger
 * tags:
 *   name: Zones
 *   description: Zone management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Zone:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Zone ID
 *         name:
 *           type: string
 *           description: Zone name
 *         description:
 *           type: string
 *           description: Zone description
 *         location:
 *           type: string
 *           description: Zone location
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

export const zoneRouter = express.Router();

/**
 * @swagger
 * /zones:
 *   get:
 *     summary: Get all zones
 *     tags: [Zones]
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
 *     responses:
 *       200:
 *         description: List of zones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 zones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Zone'
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Server error
 */
zoneRouter.get("/",/*authMiddleware,*/ getAllZones); //Récupérer la liste des zones . exemple url : /api/zones?page=1&pageSize=10

/**
 * @swagger
 * /zones/kpi:
 *   get:
 *     summary: Get total zone count
 *     tags: [Zones]
 *     responses:
 *       200:
 *         description: Total number of zones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalZones:
 *                   type: integer
 *       500:
 *         description: Server error
 */
zoneRouter.get("/kpi",/* authMiddleware,*/ getTotalZones);//Récupérer les données pour le nombre total de zones.

/**
 * @swagger
 * /zones/count-by-date:
 *   get:
 *     summary: Get zone count by date
 *     tags: [Zones]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year to filter by
 *     responses:
 *       200:
 *         description: Monthly cumulative zone count for a year
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                   count:
 *                     type: integer
 *       500:
 *         description: Server error
 */
//zoneRouter.get("/count-by-date",/*authMiddleware,*/ getTotalZonesByDate);//Récupérer une liste du cumulé des zones par moi dans une anné exemple url : /api/zones/count-by-date?year=2025

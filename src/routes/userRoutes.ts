import { Router } from "express";
import * as userController from "../controllers/userController";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: User ID
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         role:
 *           type: string
 *           enum: [admin, decider, commercial, endUser]
 *           description: User role
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

export const userRoutes = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all blind (end) users
 *     tags: [Users]
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
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: integer
 *                 pageCount:
 *                   type: integer
 *       500:
 *         description: Server error
 */
userRoutes.get("/", userController.getBlindUsers);

/**
 * @swagger
 * /users/active-users/count:
 *   get:
 *     summary: Get count of active users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Count of active users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activeUsers:
 *                   type: integer
 *       500:
 *         description: Server error
 */
userRoutes.get("/active-users/count", userController.getActiveUsersCount);

/**
 * @swagger
 * /users/inactive-users/count:
 *   get:
 *     summary: Get count of inactive users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Count of inactive users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inactiveUsers:
 *                   type: integer
 *       500:
 *         description: Server error
 */
userRoutes.get("/inactive-users/count", userController.getInactiveUsersCount);

/**
 * @swagger
 * /users/user-progress:
 *   get:
 *     summary: Get user growth statistics
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User growth over time
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userCounts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       period:
 *                         type: string
 *                       count:
 *                         type: integer
 *       500:
 *         description: Server error
 */
userRoutes.get("/user-progress", userController.getUserProgress);

/**
 * @swagger
 * /users/endUser/add:
 *   post:
 *     summary: Add a new end user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               phonenumber:
 *                 type: string
 *               address:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: End user created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
userRoutes.post("/endUser/add", userController.addEndUser);



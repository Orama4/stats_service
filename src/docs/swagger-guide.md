# Swagger Documentation Guide

This guide explains how to document your API endpoints using Swagger JSDoc annotations.

## Basic Structure

Swagger documentation is added using JSDoc comments with special `@swagger` tags. The basic structure looks like this:

```js
/**
 * @swagger
 * /path/to/endpoint:
 *   method:
 *     summary: Short description
 *     tags: [Category]
 *     description: Longer description
 *     parameters: []
 *     responses: {}
 */
```

## Step-by-Step Process for Documenting an Endpoint

1. **Create a tag section** at the top of your route file:

```js
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */
```

2. **Define schemas** for your data models:

```js
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID
 *         name:
 *           type: string
 *           description: The user name
 *       required:
 *         - name
 */
```

3. **Document each endpoint** right above its route handler:

```js
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
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
 */
router.get('/users', userController.getUsers);
```

## Common Components

### Path Parameters

For endpoints with URL parameters:

```js
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 */
```

### Query Parameters

For endpoints with query string parameters:

```js
/**
 * @swagger
 * parameters:
 *   - in: query
 *     name: search
 *     schema:
 *       type: string
 *     description: Search term
 */
```

### Request Body

For POST/PUT endpoints:

```js
/**
 * @swagger
 * requestBody:
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *         required:
 *           - name
 */
```

### Response Objects

Document your response formats:

```js
/**
 * @swagger
 * responses:
 *   200:
 *     description: Success
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/User'
 *   400:
 *     description: Bad request
 */
```

## Best Practices

1. **Document all parameters** - Even if they seem obvious, document all path, query, and body parameters.
2. **Include examples** - Add examples for complex request bodies.
3. **Document errors** - Include all possible error responses.
4. **Keep schemas DRY** - Define schemas once and reference them with `$ref`.
5. **Group related endpoints** - Use the same tag for related endpoints.
6. **Be consistent** - Use the same pattern for similar endpoints.

## Example: Complete Endpoint Documentation

Here's a complete example for a user creation endpoint:

```js
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Creates a new user with the provided information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: The user's role
 *             required:
 *               - name
 *               - email
 *           example:
 *             name: John Doe
 *             email: john@example.com
 *             role: user
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post('/users', userController.createUser);
```

## How to Test Documentation

After adding documentation:

1. Start your server
2. Visit http://localhost:5001/api-docs
3. Verify your endpoints appear correctly
4. Test the endpoints directly from the Swagger UI 
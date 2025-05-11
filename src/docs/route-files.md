# Route Files to Document

Here is a list of all route files that need Swagger documentation:

## How to Document Each Route File

1. For each route file, add a **tags** definition at the top:
   ```js
   /**
    * @swagger
    * tags:
    *   name: RouteName
    *   description: Description of this route category
    */
   ```

2. For each endpoint, add documentation above the route handler:
   ```js
   /**
    * @swagger
    * /path/to/endpoint:
    *   method:
    *     summary: Short description
    *     tags: [TagName]
    *     parameters: []
    *     responses: {}
    */
   router.method('/path', controllerFunction);
   ```

3. See the example in `src/routes/commercialRoutes.ts` and `src/routes/saleRoutes.ts`

## Route Files

All route files have been documented:

- src/routes/commercialRoutes.ts (DONE)
- src/routes/saleRoutes.ts (DONE)
- src/routes/dashboardRoutes.ts (DONE)
- src/routes/deviceRoutes.ts (DONE)
- src/routes/reportRoutes.ts (DONE)
- src/routes/userRoutes.ts (DONE)
- src/routes/zoneRoutes.ts (DONE)

Once you've documented all routes, check the Swagger UI at http://localhost:5001/api-docs to make sure everything looks correct. 
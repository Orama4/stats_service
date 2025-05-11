/**
 * Route Documentation Helper
 * 
 * This script scans your project for routes and helps you document them with Swagger.
 * To use:
 * 1. Run `npx ts-node src/scripts/document-routes.ts`
 * 2. Copy the generated JSDoc comments into your route files
 */

import fs from 'fs';
import path from 'path';
import glob from 'glob';

// Path to routes directory
const ROUTES_DIR = path.join(__dirname, '../routes');
const OUTPUT_FILE = path.join(__dirname, '../../route-documentation.md');

// Read all route files
// @ts-ignore
const routeFiles = glob.sync(`${ROUTES_DIR}/*.ts`);

let output = `# API Routes Documentation Templates\n\n`;
output += `This file contains Swagger documentation templates for all routes in your project.\n`;
output += `Copy and paste these template comments above each route in your route files.\n\n`;

// Extract route patterns from each file
routeFiles.forEach(filePath => {
  const fileName = path.basename(filePath);
  const routeModule = fileName.replace('.ts', '');
  const routePrefix = routeModule.replace('Routes', '').toLowerCase();
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Add section for this route file
  output += `## ${routeModule}\n\n`;
  
  // Extract router.METHOD patterns
  const routeRegex = /router\.(get|post|put|delete)\(\s*['"]([^'"]*)['"]/g;
  let match;
  
  const routes: Array<{method: string; path: string}> = [];
  
  // Extract all routes
  while ((match = routeRegex.exec(fileContent)) !== null) {
    const method = match[1];
    const routePath = match[2];
    routes.push({ method, path: routePath });
  }
  
  // Sort routes to ensure consistent ordering
  routes.sort((a, b) => {
    if (a.path === b.path) {
      return a.method.localeCompare(b.method);
    }
    return a.path.localeCompare(b.path);
  });
  
  // Generate template for each route
  routes.forEach(route => {
    const { method, path } = route;
    
    // Build full path with prefix
    const fullPath = path === '/' ? `/${routePrefix}` : `/${routePrefix}${path}`;
    
    // Extract path parameters
    const pathParams = path.match(/:[^\/]+/g) || [];
    const formattedParams = pathParams.map(param => {
      const paramName = param.replace(':', '');
      return `*       - in: path
*         name: ${paramName}
*         required: true
*         schema:
*           type: string
*         description: The ${paramName} parameter`;
    }).join('\n');
    
    // Create template
    let template = `/**
* @swagger
* ${fullPath}:
*   ${method}:
*     summary: TODO: Add summary
*     tags: [${routePrefix.charAt(0).toUpperCase() + routePrefix.slice(1)}]
*     description: TODO: Add description`;
    
    // Add parameters section if we have path parameters
    if (pathParams.length > 0) {
      template += `
*     parameters:
${formattedParams}`;
    }
    
    // Add query parameters section for GET
    if (method === 'get') {
      template += `
*     parameters:
*       - in: query
*         name: example
*         schema:
*           type: string
*         description: Example query parameter`;
    }
    
    // Add request body for POST, PUT, PATCH
    if (['post', 'put', 'patch'].includes(method)) {
      template += `
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               # TODO: Add properties
*               property1:
*                 type: string
*                 description: Description of property1`;
    }
    
    // Add responses
    template += `
*     responses:
*       200:
*         description: Successful operation
*       400:
*         description: Bad request
*       401:
*         description: Unauthorized
*       500:
*         description: Server error
*/
router.${method}('${path}', /* ... */);

`;
    
    output += template;
  });
  
  output += '\n\n';
});

// Write output to file
fs.writeFileSync(OUTPUT_FILE, output);

console.log(`Documentation templates generated in ${OUTPUT_FILE}`);
console.log(`Copy and paste these templates into your route files.`); 
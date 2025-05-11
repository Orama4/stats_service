import fs from 'fs';
import path from 'path';
import express from 'express';
import { app } from '../index';

// Function to generate Swagger template for a route
const generateSwaggerTemplate = (route: any, basePath: string) => {
  const method = Object.keys(route.methods)
    .filter(method => method !== '_all')
    .map(method => method.toLowerCase())[0];
  
  if (!method) return '';
  
  const path = route.path.replace(/:[^/]+/g, '{$&}').replace(/:/g, '');
  const fullPath = basePath + path;
  const routeName = fullPath.split('/').filter(Boolean).join('/');
  
  // Generate parameter templates for path parameters
  const pathParams = route.path.match(/:([^/]+)/g) || [];
  const paramsTemplate = pathParams.map(param => {
    const paramName = param.replace(':', '');
    return `*       - in: path
*         name: ${paramName}
*         required: true
*         schema:
*           type: string
*         description: The ${paramName.replace(/([A-Z])/g, ' $1').toLowerCase()} parameter`;
  }).join('\n');
  
  // Generate Swagger JSDoc template
  let template = `/**
* @swagger
* ${fullPath}:
*   ${method}:
*     summary: TODO: Add summary
*     tags: [TODO: Add tag]
*     description: TODO: Add description`;
  
  // Add parameters section if we have path parameters
  if (pathParams.length > 0) {
    template += `
*     parameters:
${paramsTemplate}`;
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
*         description: Internal server error
*/`;
  
  return template;
};

// Function to discover all routes in the Express app
const discoverRoutes = (app: any) => {
  const routes: any[] = [];
  const stack = app._router.stack;
  
  const parseLayer = (layer: any, basePath: string = '') => {
    if (layer.route) {
      // This is a route
      routes.push({
        path: basePath + layer.route.path,
        methods: layer.route.methods,
        middleware: layer.route.stack.map((handler: any) => handler.name)
      });
    } else if (layer.name === 'router' && layer.handle.stack) {
      // This is a router middleware
      const routerPath = layer.regexp.toString().match(/^\/\^(\\\/[^?]*)/)?.[1]?.replace(/\\\//g, '/') || '';
      layer.handle.stack.forEach((stackItem: any) => {
        parseLayer(stackItem, basePath + routerPath);
      });
    }
  };
  
  stack.forEach((layer: any) => parseLayer(layer));
  return routes;
};

// Main function
const main = () => {
  const routes = discoverRoutes(app);
  const routesByFile: Record<string, any[]> = {};
  
  // Group routes by their base path
  routes.forEach(route => {
    const basePath = '/' + route.path.split('/')[1];
    if (!routesByFile[basePath]) {
      routesByFile[basePath] = [];
    }
    routesByFile[basePath].push(route);
  });
  
  // Create a markdown file with templates
  let markdown = '# Swagger Documentation Templates\n\n';
  markdown += 'Copy and paste these templates into your route files.\n\n';
  
  for (const [basePath, routes] of Object.entries(routesByFile)) {
    markdown += `## ${basePath} Routes\n\n`;
    
    routes.forEach(route => {
      const template = generateSwaggerTemplate(route, basePath);
      if (template) {
        markdown += '```js\n' + template + '\n```\n\n';
      }
    });
  }
  
  // Write to file
  const outputPath = path.join(__dirname, '../../swagger-templates.md');
  fs.writeFileSync(outputPath, markdown);
  
  console.log(`Swagger templates generated at ${outputPath}`);
};

main(); 
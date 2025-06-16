# Commercial Controllers

This directory contains the refactored commercial controllers, split from the original large `commercialController.ts` file for better maintainability and organization.

## Structure

### Files:
- **`utils.ts`** - Shared utilities and common response formatting
- **`dashboardController.ts`** - Dashboard related endpoints (3 functions)
- **`clientController.ts`** - Client management endpoints (9 functions)
- **`salesController.ts`** - Sales management endpoints (5 functions) 
- **`productController.ts`** - Product management endpoints (7 functions)
- **`index.ts`** - Exports all controllers for easy importing

## Usage

The controllers are imported through the index file in routes:

```typescript
import * as commercialController from "../controllers/commercial";
```

This maintains the same interface as the original single file, so no changes are needed in the routes file except for the import path.

## Controllers Overview

### Dashboard Controller
- `getCommercialDashboardStats` - Get dashboard summary statistics
- `getCommercialSalesChart` - Get sales chart data  
- `getCommercialTopProducts` - Get top selling products

### Client Controller  
- `getAllClients` - Get paginated client list
- `getClientDetails` - Get specific client details
- `createClient` - Create new client
- `updateClient` - Update client information
- `deleteClient` - Deactivate client
- `getClientContacts` - Get client contacts
- `addClientContact` - Add contact to client
- `removeClientContact` - Remove client contact
- `updateClientPassword` - Update client password

### Sales Controller
- `getAllSales` - Get paginated sales list with filters
- `getSaleDetails` - Get specific sale details
- `createSale` - Create new sale record
- `deleteSale` - Delete sale record
- `getSalesStats` - Get sales statistics

### Product Controller
- `getAllProducts` - Get paginated products with filters
- `getProductDetails` - Get specific product details
- `getProductTypes` - Get distinct product types
- `getProductStats` - Get product statistics
- `createProduct` - Create new product
- `updateProduct` - Update product information
- `deleteProduct` - Delete/deactivate product 
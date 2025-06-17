# Commercial Services

This directory contains the refactored commercial services, split from the original large `commercialService.ts` file for better maintainability and organization.

## Structure

### Files:
- **`utils.ts`** - Shared utilities and common imports (Prisma, bcrypt, enums)
- **`dashboardService.ts`** - Dashboard related functions (2 functions)
- **`clientService.ts`** - Client management functions (10 functions)
- **`salesService.ts`** - Sales management functions (4 functions) 
- **`productService.ts`** - Product management functions (7 functions)
- **`index.ts`** - Exports all services for easy importing

## Usage

The services are imported through the index file in controllers:

```typescript
import * as commercialService from "../../services/commercial";
```

This maintains the same interface as the original single file, so no changes are needed in the controller files except for the import path.

## Services Overview

### Dashboard Service
- `getDashboardStats()` - Get dashboard summary statistics (sales, revenue, clients, growth)
- `getSalesChartData(period)` - Get sales chart data for specified time period

### Client Service  
- `getClients(page, limit, search, sortBy, sortOrder)` - Get paginated client list with search
- `getClientById(clientId)` - Get specific client with full details
- `createClient(email, password, firstname, lastname, phonenumber, address)` - Create new client
- `updateClientData(clientId, email, firstname, lastname, phonenumber, address)` - Update client info
- `deactivateClient(clientId)` - Mark client as inactive
- `getClientContacts(endUserId)` - Get client emergency contacts
- `createClientContact(endUserId, nom, telephone)` - Add emergency contact
- `deleteClientContact(contactId)` - Remove emergency contact
- `updateUserPassword(userId, newPassword)` - Update client password

### Sales Service
- `getSales(page, limit, startDate, endDate, clientId, deviceType)` - Get paginated sales with filters
- `getSaleById(saleId)` - Get specific sale details
- `createSaleRecord(deviceId, userId, price)` - Create new sale record
- `deleteSaleRecord(saleId)` - Delete sale record and revert device status

### Product Service
- `getProducts(page, limit, search, type, status)` - Get paginated products with filters
- `getProductById(deviceId)` - Get specific product details
- `getDistinctProductTypes()` - Get list of all unique product types
- `createProduct(type, description, price, status)` - Create new product
- `updateProduct(deviceId, type, description, price, status)` - Update product info
- `deleteProduct(deviceId)` - Delete/deactivate product
- `getProductTypes()` - Get available product types

## Database Operations

All services use Prisma for database operations and include:
- **Transaction support** for complex operations
- **Error handling** with descriptive messages
- **Data validation** and sanitization
- **Relationship management** (users, profiles, devices, sales)
- **Pagination** support where applicable

## Security Features

- **Password hashing** using bcrypt with salt rounds
- **Input validation** for all user inputs
- **Role-based access** (endUser role validation)
- **Transaction safety** for data consistency 
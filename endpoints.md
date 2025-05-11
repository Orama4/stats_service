# Backend Endpoints for Commercial Module Integration

This document outlines all the required endpoints to integrate the backend with the frontend commercial module.


## Dashboard Endpoints

```
GET /commercial/dashboard/stats - Get dashboard summary statistics
  - Returns: totalSales, revenue, clients count, monthly growth percentages
  - Similar to: GET /get-sales ✓ (DONE - partially implemented in getSalesKPIs)

GET /commercial/dashboard/sales-chart - Get sales chart data
  - Query params: period (day, week, month, year)
  - Returns: time-series data for sales charts
  - Similar to: GET /revenue-growth ✓ (DONE)
  
GET /commercial/dashboard/top-products - Get top selling products
  - Returns: list of top products with sale percentages
  - Similar to: GET /bestsellers ✓ (DONE - implemented in getTopProducts)
```

## Clients Endpoints

```
GET /commercial/clients - Get all clients
  - Query params: page, limit, search, sortBy, sortOrder
  - Returns: paginated list of clients (EndUser records)
  - Similar to: GET /users ✓ (DONE - via getBlindUsers but may need pagination)

GET /commercial/clients/:id - Get client details
  - Returns: detailed EndUser information including profile data

POST /commercial/clients - Create new client
  - Creates: new User with EndUser role and associated Profile
  - Similar to: POST /users/endUser/add ✓ (DONE - via addEndUser)

PUT /commercial/clients/:id - Update client information
  - Updates: EndUser and associated User/Profile records

DELETE /commercial/clients/:id - Delete a client
  - Soft delete recommended

GET /commercial/clients/:id/contacts - Get client contacts
  - Returns: Contact records associated with an EndUser

POST /commercial/clients/:id/contacts - Add contact to client
  - Creates: new Contact record for an EndUser

DELETE /commercial/clients/:id/contacts/:contactId - Remove client contact
```

## Sales Endpoints

```
GET /commercial/sales - Get all sales
  - Query params: page, limit, startDate, endDate, clientId, deviceType
  - Returns: paginated list of Sale records with device and client info
  - Similar to: GET /sales ✓ (DONE - via getSalesList but may need additional filtering)

GET /commercial/sales/:id - Get sale details
  - Returns: detailed Sale information including device and client data

POST /commercial/sales - Create new sale
  - Creates: new Sale record linking Device to EndUser
  - Updates: Device status

DELETE /commercial/sales/:id - Delete/cancel a sale
  - Soft delete recommended

GET /commercial/sales/stats - Get sales statistics
  - Query params: period (day, week, month, year)
  - Returns: aggregated sales data for reporting
  - Similar to: GET /sales/progress-stats ✓ (DONE - via getSalesStatistics)
```

## Products (Devices) Endpoints

```
GET /commercial/products - Get all available products
  - Query params: page, limit, search, type, status
  - Returns: paginated list of Device records filterable by type and status
  - Similar to: GET /devices ✓ (DONE - via getAllDevices)
  
GET /commercial/products/:id - Get product details
  - Returns: detailed Device information 

GET /commercial/products/types - Get all product types
  - Returns: list of available device types (from DeviceType enum)
  - Similar to: GET /devices/search?type=X ✓ (DONE - can be used to filter by type)

GET /commercial/products/stats - Get product statistics
  - Returns: count by type, sales by type, availability stats
  - Similar to: GET /devices/stats ✓ (DONE - via getDeviceStatistics)
```


## Implementation Details

1. For all client endpoints, the backend should:
   - Map between EndUser, User, and Profile tables
   - Ensure proper role management (only EndUsers)
   - Handle related Contact records

2. For all sales endpoints, the backend should:
   - Update Device status when sold
   - Create proper relationships between Device and EndUser
   - Record sale timestamps and maintain history

3. For product endpoints, the backend should:
   - Filter devices by availability for sales
   - Provide inventory management functionality
   - Track device statuses throughout the lifecycle

4. For dashboard endpoints, the backend should:
   - Aggregate data from Sale, Device, and EndUser tables
   - Calculate KPIs and growth metrics
   - Format data for charting and visualization

5. Security and validation:
   - Ensure all endpoints validate the Commercial role
   - Implement proper error handling
   - Add pagination for list endpoints
   - Include search functionality where appropriate

## Response Formats

All endpoints should return responses in the following standardized format:

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Success message",
  "errors": null
}
```

For error responses:

```json
{
  "success": false,
  "data": null,
  "message": "Error message",
  "errors": {
    // Detailed error information
  }
}
```

## Integration with Existing API Structure

For consistency with the current project structure:
1. All commercial endpoints should be registered in a new `commercialRoutes.ts` file
2. Controllers should be added to a new `commercialController.ts` file
3. Routes should be mounted in the main `index.ts` under the path `/commercial` 
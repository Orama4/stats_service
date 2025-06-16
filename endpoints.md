# Backend Endpoints for Commercial Module Integration

This document outlines all the required endpoints to integrate the backend with the frontend commercial module.


## Dashboard Endpoints

```
GET /commercial/dashboard/stats - Get dashboard summary statistics
  - Description: Returns KPIs such as total sales, total revenue, number of clients, and monthly growth percentages for the dashboard overview.
  - Returns: totalSales, revenue, clients count, monthly growth percentages
  - Similar to: GET /get-sales ✓ (DONE - partially implemented in getSalesKPIs)

GET /commercial/dashboard/sales-chart - Get sales chart data
  - Description: Returns time-series data for sales charts, useful for visualizing sales trends over a selected period.
  - Query params: period (day, week, month, year)
  - Returns: time-series data for sales charts
  - Similar to: GET /revenue-growth ✓ (DONE)
  
GET /commercial/dashboard/top-products - Get top selling products
  - Description: Returns a list of top products with their sale percentages, useful for highlighting bestsellers on the dashboard.
  - Returns: list of top products with sale percentages
  - Similar to: GET /bestsellers ✓ (DONE - implemented in getTopProducts)
```

## Clients Endpoints

```
GET /commercial/clients - Get all clients
  - Description: Returns a paginated list of all clients (EndUser records), with optional search and sorting.
  - Query params: page, limit, search, sortBy, sortOrder
  - Returns: paginated list of clients (EndUser records)
  - Similar to: GET /users ✓ (DONE - via getBlindUsers but may need pagination)

GET /commercial/clients/:id - Get client details
  - Description: Returns detailed EndUser information including profile data for a specific client.
  - Returns: detailed EndUser information including profile data

POST /commercial/clients - Create new client
  - Description: Creates a new User with EndUser role and associated Profile.
  - Body: { email, firstname, lastname, phonenumber , password }
  - Creates: new User with EndUser role and associated Profile
  - Similar to: POST /users/endUser/add ✓ (DONE - via addEndUser)

PUT /commercial/clients/:id - Update client information
  - Description: Updates EndUser and associated User/Profile records for a specific client.
  - Body: Client update data
  - Updates: EndUser and associated User/Profile records

DELETE /commercial/clients/:id - Delete a client
  - Description: Soft deletes a client (EndUser), marking them as inactive rather than removing from the database.
  - Soft delete recommended

GET /commercial/clients/:id/contacts - Get client contacts
  - Description: Returns Contact records associated with an EndUser (client).
  - Returns: Contact records associated with an EndUser

POST /commercial/clients/:id/contacts - Add contact to client
  - Description: Creates a new Contact record for an EndUser (client).
  - Body: { nom, telephone }
  - Creates: new Contact record for an EndUser

DELETE /commercial/clients/:id/contacts/:contactId - Remove client contact
  - Description: Removes a contact from a client (EndUser) by contact ID.
```

## Sales Endpoints

```
GET /commercial/sales - Get all sales
  - Description: Returns a paginated list of Sale records with device and client info, with optional filtering by date, client, or device type.
  - Query params: page, limit, startDate, endDate, clientId, deviceType
  - Returns: paginated list of Sale records with device and client info
  - Similar to: GET /sales ✓ (DONE - via getSalesList but may need additional filtering)

GET /commercial/sales/:id - Get sale details
  - Description: Returns detailed Sale information including device and client data for a specific sale.
  - Returns: detailed Sale information including device and client data

POST /commercial/sales - Create new sale
  - Description: Creates a new Sale record linking a Device to an EndUser, and updates the Device status.
  - Body: Sale creation data
  - Creates: new Sale record linking Device to EndUser
  - Updates: Device status

DELETE /commercial/sales/:id - Delete/cancel a sale
  - Description: Soft deletes (cancels) a sale, marking it as inactive rather than removing from the database.
  - Soft delete recommended

GET /commercial/sales/stats - Get sales statistics
  - Description: Returns aggregated sales data for reporting, with optional period filtering.
  - Query params: period (day, week, month, year)
  - Returns: aggregated sales data for reporting
  - Similar to: GET /sales/progress-stats ✓ (DONE - via getSalesStatistics)
```

## Products (Devices) Endpoints

```
GET /commercial/products - Get all available products
  - Description: Returns a paginated list of Device records, filterable by type and status, for inventory and sales management.
  - Query params: page, limit, search, type, status
  - Returns: paginated list of Device records filterable by type and status
  - Similar to: GET /devices ✓ (DONE - via getAllDevices)
  
GET /commercial/products/:id - Get product details
  - Description: Returns detailed Device information for a specific product.
  - Returns: detailed Device information 

GET /commercial/products/types - Get all product types
  - Description: Returns a list of available device types (from DeviceType enum), useful for filtering and categorization.
  - Returns: list of available device types (from DeviceType enum)
  - Similar to: GET /devices/search?type=X ✓ (DONE - can be used to filter by type)

GET /commercial/products/stats - Get product statistics
  - Description: Returns statistics such as count by type, sales by type, and availability stats for devices.
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
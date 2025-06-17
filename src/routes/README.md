# Commercial API Routes Documentation

This document provides comprehensive details of all 27 commercial API endpoints for frontend integration.

## Base URL
All commercial routes are prefixed with `/commercial`

## Standard Response Format
All endpoints return responses in this format:
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "errors": any
}
```

## Authentication
Currently, authentication middleware is commented out but may be required in the future.

---

## Dashboard Endpoints

### 1. Get Dashboard Statistics
**GET** `/commercial/dashboard/stats`

Returns overall dashboard statistics including sales count, revenue, clients count, and monthly growth.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": number,
    "revenue": number,
    "clientsCount": number,
    "monthlyGrowth": {
      "sales": number
    }
  },
  "message": "Dashboard stats retrieved successfully"
}
```

### 2. Get Sales Chart Data
**GET** `/commercial/dashboard/sales-chart`

Returns sales data formatted for charts with optional time period filtering.

**Query Parameters:**
- `period` (optional): `day` | `week` | `month` | `year` (default: `month`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "string",
      "count": number,
      "revenue": number
    }
  ],
  "message": "Sales chart data retrieved successfully"
}
```

### 3. Get Top Products
**GET** `/commercial/dashboard/top-products`

Returns top-selling products data.

**Response:**
```json
{
  "success": true,
  "data": "array of top products",
  "message": "Top products retrieved successfully"
}
```

---

## Client Management Endpoints

### 4. Get All Clients
**GET** `/commercial/clients`

Returns paginated list of clients with search and sorting capabilities.

**Query Parameters:**
- `page` (optional): number (default: 1)
- `limit` (optional): number (default: 10)
- `search` (optional): string - searches in email and phone number
- `sortBy` (optional): string (default: "createdAt")
- `sortOrder` (optional): `asc` | `desc` (default: "desc")

**Response:**
```json
{
  "success": true,
  "data": {
    "clients": [
      {
        "id": number,
        "email": "string",
        "role": "endUser",
        "Profile": {
          "firstname": "string",
          "lastname": "string",
          "phonenumber": "string",
          "address": "string"
        },
        "EndUser": {
          "id": number,
          "status": "string",
          "Device": []
        }
      }
    ],
    "pagination": {
      "total": number,
      "page": number,
      "limit": number,
      "totalPages": number
    }
  },
  "message": "Clients retrieved successfully"
}
```

### 5. Get Client Details
**GET** `/commercial/clients/:id`

Returns detailed information about a specific client.

**Path Parameters:**
- `id`: number (required) - Client ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": number,
    "email": "string",
    "role": "endUser",
    "Profile": {
      "firstname": "string",
      "lastname": "string",
      "phonenumber": "string",
      "address": "string"
    },
    "EndUser": {
      "id": number,
      "status": "string",
      "Device": [],
      "Sale": [],
      "urgenceContacts": []
    }
  },
  "message": "Client details retrieved successfully"
}
```

### 6. Create New Client
**POST** `/commercial/clients`

Creates a new client account.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "firstname": "string (required)",
  "lastname": "string (required)",
  "phonenumber": "string (required)",
  "address": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": number,
    "email": "string",
    "role": "endUser",
    "Profile": {
      "firstname": "string",
      "lastname": "string",
      "phonenumber": "string",
      "address": "string"
    },
    "EndUser": {
      "id": number,
      "status": "active"
    }
  },
  "message": "Client created successfully"
}
```

### 7. Update Client Information
**PUT** `/commercial/clients/:id`

Updates client information (excluding password).

**Path Parameters:**
- `id`: number (required) - Client ID

**Request Body:**
```json
{
  "email": "string (optional)",
  "firstname": "string (optional)",
  "lastname": "string (optional)",
  "phonenumber": "string (optional)",
  "address": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": "updated client object",
  "message": "Client updated successfully"
}
```

### 8. Update Client Password
**PUT** `/commercial/clients/:id/password`

Updates a client's password.

**Path Parameters:**
- `id`: number (required) - Client ID

**Request Body:**
```json
{
  "password": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Password updated successfully"
}
```

### 9. Deactivate Client
**DELETE** `/commercial/clients/:id`

Marks a client as inactive (soft delete).

**Path Parameters:**
- `id`: number (required) - Client ID

**Response:**
```json
{
  "success": true,
  "data": "deactivated client object",
  "message": "Client marked as inactive successfully"
}
```

### 10. Get Client Emergency Contacts
**GET** `/commercial/clients/:id/contacts`

Returns all emergency contacts for a specific client.

**Path Parameters:**
- `id`: number (required) - Client ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": number,
      "nom": "string",
      "telephone": "string",
      "endUserId": number
    }
  ],
  "message": "Client contacts retrieved successfully"
}
```

### 11. Add Emergency Contact
**POST** `/commercial/clients/:id/contacts`

Adds an emergency contact to a client.

**Path Parameters:**
- `id`: number (required) - Client ID

**Request Body:**
```json
{
  "nom": "string (required)",
  "telephone": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": number,
    "nom": "string",
    "telephone": "string",
    "endUserId": number
  },
  "message": "Contact added successfully"
}
```

### 12. Remove Emergency Contact
**DELETE** `/commercial/clients/:id/contacts/:contactId`

Removes an emergency contact from a client.

**Path Parameters:**
- `id`: number (required) - Client ID
- `contactId`: number (required) - Contact ID

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Contact removed successfully"
}
```

### 13. Get Client Sales History
**GET** `/commercial/clients/:id/sales`

Returns paginated sales history for a specific client with detailed information and summary statistics.

**Path Parameters:**
- `id`: number (required) - Client ID

**Query Parameters:**
- `page` (optional): number (default: 1) - Page number
- `limit` (optional): number (default: 10) - Results per page
- `startDate` (optional): string - Filter sales from this date (ISO format)
- `endDate` (optional): string - Filter sales until this date (ISO format)
- `sortBy` (optional): `date` | `amount` | `product` (default: `date`) - Field to sort by
- `sortOrder` (optional): `asc` | `desc` (default: `desc`) - Sort order

**Response:**
```json
{
  "success": true,
  "data": {
    "client": {
      "id": number,
      "email": "string",
      "Profile": {
        "firstname": "string",
        "lastname": "string",
        "phonenumber": "string",
        "address": "string"
      }
    },
    "sales": [
      {
        "id": number,
        "saleDate": "datetime",
        "totalAmount": number,
        "status": "completed" | "pending" | "cancelled",
        "items": [
          {
            "id": number,
            "deviceId": number,
            "quantity": number,
            "unitPrice": number,
            "totalPrice": number,
            "Device": {
              "id": number,
              "type": "string",
              "nom": "string",
              "description": "string"
            }
          }
        ],
        "paymentMethod": "cash" | "card" | "transfer",
        "notes": "string"
      }
    ],
    "summary": {
      "totalSales": number,
      "totalAmount": number,
      "averageOrderValue": number,
      "lastPurchaseDate": "datetime",
      "favoriteProductType": "string"
    },
    "pagination": {
      "total": number,
      "page": number,
      "limit": number,
      "totalPages": number
    }
  },
  "message": "Client sales history retrieved successfully"
}
```

### 14. Get Client Sales Statistics
**GET** `/commercial/clients/:id/sales/stats`

Returns statistical information about a client's purchasing behavior including trends and breakdowns.

**Path Parameters:**
- `id`: number (required) - Client ID

**Query Parameters:**
- `period` (optional): `month` | `quarter` | `year` (default: `year`) - Statistical period

**Response:**
```json
{
  "success": true,
  "data": {
    "periodStats": {
      "period": "string",
      "totalSales": number,
      "totalAmount": number,
      "averageOrderValue": number
    },
    "monthlyTrend": [
      {
        "month": "string",
        "salesCount": number,
        "revenue": number
      }
    ],
    "productBreakdown": [
      {
        "productType": "string",
        "quantity": number,
        "totalAmount": number,
        "percentage": number
      }
    ],
    "paymentMethodBreakdown": {
      "cash": number,
      "card": number,
      "transfer": number
    }
  },
  "message": "Client sales statistics retrieved successfully"
}
```

### 15. Get Client Sale Details
**GET** `/commercial/clients/:clientId/sales/:saleId`

Returns detailed information about a specific sale for a specific client.

**Path Parameters:**
- `clientId`: number (required) - Client ID
- `saleId`: number (required) - Sale ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": number,
    "saleDate": "datetime",
    "totalAmount": number,
    "status": "completed" | "pending" | "cancelled",
    "client": {
      "id": number,
      "email": "string",
      "Profile": {
        "firstname": "string",
        "lastname": "string",
        "phonenumber": "string",
        "address": "string"
      }
    },
    "items": [
      {
        "id": number,
        "deviceId": number,
        "quantity": number,
        "unitPrice": number,
        "totalPrice": number,
        "Device": {
          "id": number,
          "type": "string",
          "nom": "string",
          "description": "string",
          "macAdresse": "string"
        }
      }
    ],
    "paymentMethod": "cash" | "card" | "transfer",
    "notes": "string",
    "salesPerson": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  },
  "message": "Sale details retrieved successfully"
}
```

---

## Product Management Endpoints

### 16. Get All Products
**GET** `/commercial/products`

Returns paginated list of products with filtering capabilities.

**Query Parameters:**
- `page` (optional): number (default: 1)
- `limit` (optional): number (default: 10)
- `search` (optional): string - searches in product type and description
- `type` (optional): string - filter by product type
- `status` (optional): `connected` | `disconnected` - filter by status

**Response:**
```json
{
  "success": true,
  "data": {
    "devices": [
      {
        "id": number,
        "type": "string",
        "nom": "string",
        "price": number,
        "status": "connected" | "disconnected",
        "macAdresse": "string",
        "createdAt": "datetime",
        "EndUser": {},
        "Sale": []
      }
    ],
    "pagination": {
      "total": number,
      "page": number,
      "limit": number,
      "totalPages": number
    }
  },
  "message": "Products retrieved successfully"
}
```

### 17. Get Product Details
**GET** `/commercial/products/:id`

Returns detailed information about a specific product.

**Path Parameters:**
- `id`: number (required) - Product ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": number,
    "type": "string",
    "nom": "string",
    "price": number,
    "status": "connected" | "disconnected",
    "macAdresse": "string",
    "createdAt": "datetime",
    "EndUser": {},
    "Sale": []
  },
  "message": "Product details retrieved successfully"
}
```

### 18. Get Product Types
**GET** `/commercial/products/types`

Returns all distinct product types available.

**Response:**
```json
{
  "success": true,
  "data": ["string", "string", ...],
  "message": "Product types retrieved successfully"
}
```

### 19. Get Product Statistics
**GET** `/commercial/products/stats`

Returns product-related statistics.

**Response:**
```json
{
  "success": true,
  "data": "statistics object",
  "message": "Product statistics retrieved successfully"
}
```

### 20. Create New Product
**POST** `/commercial/products`

Creates a new product/device.

**Request Body:**
```json
{
  "type": "string (required)",
  "description": "string (optional)",
  "price": number (optional),
  "status": "connected" | "disconnected" (optional, default: "connected")"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": number,
    "type": "string",
    "nom": "string",
    "price": number,
    "status": "string",
    "macAdresse": "NEW_DEVICE"
  },
  "message": "Product created successfully"
}
```

### 21. Update Product
**PUT** `/commercial/products/:id`

Updates product information.

**Path Parameters:**
- `id`: number (required) - Product ID

**Request Body:**
```json
{
  "type": "string (optional)",
  "description": "string (optional)",
  "price": number (optional),
  "status": "connected" | "disconnected" (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": "updated product object",
  "message": "Product updated successfully"
}
```

### 22. Delete Product
**DELETE** `/commercial/products/:id`

Deletes or deactivates a product. Products with sales history are marked as disconnected; others are permanently deleted.

**Path Parameters:**
- `id`: number (required) - Product ID

**Response:**
```json
{
  "success": true,
  "data": "deleted/deactivated product object",
  "message": "Product deleted/deactivated successfully"
}
```

---

## Sales Management Endpoints

### 23. Get All Sales
**GET** `/commercial/sales`

Returns paginated list of sales with filtering capabilities.

**Query Parameters:**
- `page` (optional): number (default: 1)
- `limit` (optional): number (default: 10)
- `startDate` (optional): date string - filter sales from this date
- `endDate` (optional): date string - filter sales until this date
- `clientId` (optional): number - filter by client ID
- `deviceType` (optional): string - filter by device type

**Response:**
```json
{
  "success": true,
  "data": {
    "sales": [
      {
        "id": number,
        "deviceId": number,
        "buyerId": number,
        "createdAt": "datetime",
        "Device": {
          "id": number,
          "type": "string",
          "nom": "string",
          "price": number,
          "status": "string"
        },
        "EndUser": {
          "User": {
            "id": number,
            "email": "string",
            "Profile": {}
          }
        }
      }
    ],
    "pagination": {
      "total": number,
      "page": number,
      "limit": number,
      "totalPages": number
    }
  },
  "message": "Sales retrieved successfully"
}
```

### 24. Get Sale Details
**GET** `/commercial/sales/:id`

Returns detailed information about a specific sale.

**Path Parameters:**
- `id`: number (required) - Sale ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": number,
    "deviceId": number,
    "buyerId": number,
    "createdAt": "datetime",
    "Device": {},
    "EndUser": {
      "User": {
        "Profile": {}
      }
    }
  },
  "message": "Sale details retrieved successfully"
}
```

### 25. Create New Sale
**POST** `/commercial/sales`

Creates a new sale record and updates device status.

**Request Body:**
```json
{
  "deviceId": number (required),
  "userId": number (required),
  "price": number (optional)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": number,
    "deviceId": number,
    "buyerId": number,
    "createdAt": "datetime"
  },
  "message": "Sale created successfully"
}
```

### 26. Delete Sale
**DELETE** `/commercial/sales/:id`

Deletes a sale record and reverts the device status back to connected.

**Path Parameters:**
- `id`: number (required) - Sale ID

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Sale deleted successfully"
}
```

### 27. Get Sales Statistics
**GET** `/commercial/sales/stats`

Returns sales-related statistics.

**Response:**
```json
{
  "success": true,
  "data": "statistics object",
  "message": "Sales statistics retrieved successfully"
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "success": false,
  "data": null,
  "message": "Specific error message",
  "errors": null
}
```

### 404 Not Found
```json
{
  "success": false,
  "data": null,
  "message": "Resource not found message",
  "errors": null
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "data": null,
  "message": "Failed to perform operation",
  "errors": "error details"
}
```

---

## Important Notes for Frontend Integration

1. **Route Order**: Some endpoints have specific routes before parameterized routes (e.g., `/sales/stats` before `/sales/:id`)

2. **ID Validation**: All ID parameters must be valid integers

3. **Client Role Validation**: Client-related operations validate that the user has the `endUser` role

4. **Pagination**: List endpoints support pagination with `page` and `limit` parameters

5. **Search**: Search functionality is case-insensitive and searches across relevant fields

6. **Date Formats**: Use standard date formats for date parameters

7. **Product Status**: Products can have `connected` or `disconnected` status

8. **Sale Creation**: Creating a sale automatically updates the device status to `disconnected` and associates it with the buyer

9. **Sale Deletion**: Deleting a sale reverts the device status to `connected` and removes the user association

10. **Contact Management**: Emergency contacts are tied to the EndUser profile, not directly to the User

## Frontend Integration Checklist

- [ ] Implement proper error handling for all status codes
- [ ] Add loading states for all API calls
- [ ] Implement pagination controls for list endpoints
- [ ] Add search functionality with debouncing
- [ ] Validate form inputs before sending requests
- [ ] Handle authentication headers when middleware is enabled
- [ ] Implement proper date formatting for date parameters
- [ ] Add confirmation dialogs for delete operations
- [ ] Cache frequently accessed data like product types
- [ ] Implement real-time updates for dashboard statistics 
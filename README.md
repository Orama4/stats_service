# Stats Service - Academic Project Documentation

## Project Overview

The **Stats Service** is a comprehensive backend API system built with Node.js, TypeScript, and Express.js that provides statistics and analytics for business operations. This project demonstrates the implementation of a multi-role business intelligence system with commercial, administrative, and decision-making capabilities.

### Key Features
- **Commercial Dashboard**: KPI tracking, sales analytics, and revenue reporting
- **Device Management**: IoT device tracking and monitoring
- **Report Generation**: Automated report creation in multiple formats (PDF, Excel, CSV)
- **Zone Management**: Geographic and organizational zone administration
- **Real-time Analytics**: Live dashboard updates and statistical calculations
- **RESTful API**: Well-documented API endpoints with Swagger integration

## Project Architecture

### Tech Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest with Supertest
- **Development**: Nodemon for hot reloading

### Design Patterns
- **MVC Architecture**: Controllers, Services, and Routes separation
- **Service Layer Pattern**: Business logic abstraction
- **Repository Pattern**: Data access layer through Prisma
- **Middleware Pattern**: Request processing and validation
- **Factory Pattern**: Used in service instantiation

## Project Structure

```
stats_service/
├── prisma/                     # Database configuration and migrations
│   ├── schema.prisma          # Database schema definition
│   └── migrations/            # Database migration files
├── src/                       # Main source code
│   ├── index.ts              # Application entry point
│   ├── config/               # Configuration files
│   │   └── swagger.ts        # Swagger/OpenAPI configuration
│   ├── controllers/          # Request handlers and business logic
│   │   ├── dashboardController.ts    # Dashboard analytics
│   │   ├── deviceController.ts       # Device management
│   │   ├── reportController.ts       # Report generation
│   │   ├── saleController.ts         # Sales operations
│   │   ├── userController.ts         # User management
│   │   ├── zoneController.ts         # Zone administration
│   │   └── commercial/              # Commercial module
│   │       ├── clientController.ts   # Client management
│   │       ├── dashboardController.ts # Commercial dashboard
│   │       ├── productController.ts  # Product catalog
│   │       └── salesController.ts    # Sales tracking
│   ├── services/             # Business logic layer
│   │   ├── deviceService.ts          # Device business logic
│   │   ├── financialKpiService.ts    # Financial calculations
│   │   ├── reportService.ts          # Report generation logic
│   │   ├── saleService.ts            # Sales processing
│   │   ├── userService.ts            # User operations
│   │   ├── zoneService.ts            # Zone management
│   │   └── commercial/              # Commercial services
│   ├── routes/               # API route definitions
│   │   ├── dashboardRoutes.ts        # Dashboard endpoints
│   │   ├── deviceRoutes.ts           # Device endpoints
│   │   ├── reportRoutes.ts           # Report endpoints
│   │   ├── saleRoutes.ts             # Sales endpoints
│   │   ├── userRoutes.ts             # User endpoints
│   │   ├── zoneRoutes.ts             # Zone endpoints
│   │   └── commercialRoutes.ts       # Commercial endpoints
│   ├── middlewares/          # Express middlewares
│   │   └── authMiddleware.ts         # Request validation
│   ├── lib/                  # Utility libraries
│   │   └── prisma.ts                 # Prisma client configuration
│   └── tests/                # Test suites
│       ├── deviceRoutes.test.ts      # Device API tests
│       ├── sale.test.ts              # Sales logic tests
│       ├── userRoutes.test.ts        # User API tests
│       └── zoneRoutes.test.ts        # Zone API tests
├── scripts/                   # Utility scripts
│   ├── seed.ts               # Database seeding
│   ├── kpi_seed.ts          # KPI data seeding
│   └── verify_users.ts      # User verification
├── docs/                     # Additional documentation
└── Configuration files       # Package.json, tsconfig, etc.
```

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **PostgreSQL**: Version 12.x or higher
- **Git**: For version control

### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **Memory**: Minimum 4GB RAM
- **Storage**: At least 1GB free space

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd stats_service
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### 3.1 PostgreSQL Installation
- Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
- Create a new database for the project

#### 3.2 Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/stats_service_db"

# Server Configuration
NODE_ENV="development"
PORT=5001

# Optional: Additional Configuration
CORS_ORIGIN="http://localhost:3000"
```

#### 3.3 Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with initial data
npm run seed
```

## Running the Project

### Development Mode
```bash
# Start with hot reloading
npm run dev
```
The server will start on `http://localhost:5001`

### Production Mode
```bash
# Build the project
npm run build

# Start the production server
npm run serve
```

### Available Scripts
- `npm start` - Run with ts-node
- `npm run dev` - Development mode with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm run serve` - Run compiled JavaScript
- `npm test` - Run test suite
- `npm run seed` - Seed database with sample data

## API Documentation

### Swagger Documentation
Once the server is running, access the interactive API documentation at:
- **Swagger UI**: `http://localhost:5001/api-docs`
- **JSON Schema**: `http://localhost:5001/swagger.json`

### Main API Endpoints

#### User Management
- `GET /users` - List users
- `GET /users/:id` - Get user details
- `POST /users` - Create new user
- `PUT /users/:id` - Update user

#### Dashboard Analytics
- `GET /dashboard/stats` - Get dashboard KPIs
- `GET /dashboard/sales-chart` - Sales trend data
- `GET /dashboard/revenue-growth` - Revenue analytics

#### Commercial Module
- `GET /commercial/dashboard/stats` - Commercial KPIs
- `GET /commercial/clients` - Client management
- `GET /commercial/products` - Product catalog
- `GET /commercial/sales` - Sales tracking

#### Reports
- `GET /reports/sales` - Sales reports
- `GET /reports/devices` - Device reports
- `POST /reports/generate` - Generate custom reports

#### Device Management
- `GET /devices` - List all devices
- `POST /devices` - Create new device
- `PUT /devices/:id` - Update device
- `DELETE /devices/:id` - Remove device

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- deviceRoutes.test.ts
```

### Test Structure
- **Unit Tests**: Individual function and service testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: Data persistence and retrieval testing

### Test Files
- `deviceRoutes.test.ts` - Device API endpoints
- `sale.test.ts` - Sales business logic
- `userRoutes.test.ts` - User authentication and management
- `zoneRoutes.test.ts` - Zone management functionality
import { Request, Response } from "express";
import { Role } from "@prisma/client";
import * as commercialService from "../services/commercialService";

// Helper function for standardized response format
const formatResponse = (success: boolean, data: any = null, message: string = "", errors: any = null) => ({
  success,
  data,
  message,
  errors
});

// Dashboard endpoints
export const getCommercialDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const dashboardStats = await commercialService.getDashboardStats();
    res.json(formatResponse(true, dashboardStats, "Dashboard stats retrieved successfully"));
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve dashboard stats", error));
  }
};

export const getCommercialSalesChart = async (req: Request, res: Response): Promise<void> => {
  try {
    const period = req.query.period as string || "month";
    const salesData = await commercialService.getSalesChartData(period);
    res.json(formatResponse(true, salesData, "Sales chart data retrieved successfully"));
  } catch (error) {
    console.error("Error fetching sales chart data:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve sales chart data", error));
  }
};

export const getCommercialTopProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Import and call the existing controller function instead of redirecting
    const { getTopProducts } = require("./dashboardController");
    return getTopProducts(req, res);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve top products", error));
  }
};

// Client endpoints
export const getAllClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string || "1");
    const limit = parseInt(req.query.limit as string || "10");
    const search = req.query.search as string || "";
    const sortBy = req.query.sortBy as string || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";
    
    const clientsData = await commercialService.getClients(
      page,
      limit,
      search,
      sortBy,
      sortOrder
    );
    
    res.json(formatResponse(true, clientsData, "Clients retrieved successfully"));
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve clients", error));
  }
};

export const getClientDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const clientId = parseInt(id);
    
    if (isNaN(clientId)) {
      res.status(400).json(formatResponse(false, null, "Invalid client ID format"));
      return;
    }
    
    const client = await commercialService.getClientById(clientId);
    
    if (!client) {
      res.status(404).json(formatResponse(false, null, `Client with ID ${id} not found`));
      return;
    }
    
    if (client.role !== Role.endUser) {
      res.status(400).json(formatResponse(false, null, "The specified user is not a client (endUser)"));
      return;
    }
    
    res.json(formatResponse(true, client, "Client details retrieved successfully"));
  } catch (error) {
    console.error("Error fetching client details:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve client details", error));
  }
};

export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    // This is similar to the existing addEndUser endpoint, so we'll redirect
    res.redirect(307, "/users/endUser/add");
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json(formatResponse(false, null, "Failed to create client", error));
  }
};

export const updateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const clientId = parseInt(id);
    
    if (isNaN(clientId)) {
      res.status(400).json(formatResponse(false, null, "Invalid client ID format"));
      return;
    }
    
    const { email, firstname, lastname, phonenumber, address } = req.body;
    
    // Check if client exists
    const existingClient = await commercialService.getClientById(clientId);
    
    if (!existingClient) {
      res.status(404).json(formatResponse(false, null, `Client with ID ${id} not found`));
      return;
    }
    
    if (existingClient.role !== Role.endUser) {
      res.status(400).json(formatResponse(false, null, "The specified user is not a client (endUser)"));
      return;
    }
    
    // Update client data using service
    const updatedClient = await commercialService.updateClientData(
      clientId, 
      email, 
      firstname, 
      lastname, 
      phonenumber, 
      address
    );
    
    res.json(formatResponse(true, updatedClient, "Client updated successfully"));
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json(formatResponse(false, null, "Failed to update client", error));
  }
};

export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const clientId = parseInt(id);
    
    if (isNaN(clientId)) {
      res.status(400).json(formatResponse(false, null, "Invalid client ID format"));
      return;
    }
    
    // Check if client exists
    const client = await commercialService.getClientById(clientId);
    
    if (!client) {
      res.status(404).json(formatResponse(false, null, `Client with ID ${id} not found`));
      return;
    }
    
    if (client.role !== Role.endUser) {
      res.status(400).json(formatResponse(false, null, "The specified user is not a client (endUser)"));
      return;
    }
    
    // Mark client as inactive using service
    const deletedClient = await commercialService.deactivateClient(clientId);
    
    res.json(formatResponse(true, deletedClient, "Client marked as inactive successfully"));
  } catch (error) {
    console.error("Error marking client as inactive:", error);
    res.status(500).json(formatResponse(false, null, "Failed to mark client as inactive", error));
  }
};

export const getClientContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const clientId = parseInt(id);
    
    if (isNaN(clientId)) {
      res.status(400).json(formatResponse(false, null, "Invalid client ID format"));
      return;
    }
    
    // Check if client exists
    const client = await commercialService.getClientById(clientId);
    
    if (!client) {
      res.status(404).json(formatResponse(false, null, `Client with ID ${id} not found`));
      return;
    }
    
    if (client.role !== Role.endUser) {
      res.status(400).json(formatResponse(false, null, "The specified user is not a client (endUser)"));
      return;
    }
    
    if (!client.EndUser) {
      res.status(404).json(formatResponse(false, null, `EndUser profile for client ID ${id} not found`));
      return;
    }
    
    // Get client contacts using service
    const contacts = await commercialService.getClientContacts(client.EndUser.id);
    
    res.json(formatResponse(true, contacts, "Client contacts retrieved successfully"));
  } catch (error) {
    console.error("Error fetching client contacts:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve client contacts", error));
  }
};

export const addClientContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const clientId = parseInt(id);
    
    if (isNaN(clientId)) {
      res.status(400).json(formatResponse(false, null, "Invalid client ID format"));
      return;
    }
    
    const { nom, telephone } = req.body;
    
    // Validate required fields
    if (!nom || !telephone) {
      res.status(400).json(formatResponse(false, null, "Name and phone number are required for contacts"));
      return;
    }
    
    // Check if client exists
    const client = await commercialService.getClientById(clientId);
    
    if (!client) {
      res.status(404).json(formatResponse(false, null, `Client with ID ${id} not found`));
      return;
    }
    
    if (client.role !== Role.endUser) {
      res.status(400).json(formatResponse(false, null, "The specified user is not a client (endUser)"));
      return;
    }
    
    if (!client.EndUser) {
      res.status(404).json(formatResponse(false, null, `EndUser profile for client ID ${id} not found`));
      return;
    }
    
    // Create new contact using service
    const newContact = await commercialService.createClientContact(
      client.EndUser.id,
      nom,
      telephone
    );
    
    res.status(201).json(formatResponse(true, newContact, "Contact added successfully"));
  } catch (error) {
    console.error("Error adding client contact:", error);
    res.status(500).json(formatResponse(false, null, "Failed to add client contact", error));
  }
};

export const removeClientContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, contactId } = req.params;
    const clientId = parseInt(id);
    const contactIdInt = parseInt(contactId);
    
    if (isNaN(clientId) || isNaN(contactIdInt)) {
      res.status(400).json(formatResponse(false, null, "Invalid ID format"));
      return;
    }
    
    // Check if client exists
    const client = await commercialService.getClientById(clientId);
    
    if (!client) {
      res.status(404).json(formatResponse(false, null, `Client with ID ${id} not found`));
      return;
    }
    
    if (!client.EndUser) {
      res.status(404).json(formatResponse(false, null, `EndUser profile for client ID ${id} not found`));
      return;
    }
    
    // Check if contact exists and belongs to this client
    const contacts = await commercialService.getClientContacts(client.EndUser.id);
    const contact = contacts.find(c => c.id === contactIdInt);
    
    if (!contact) {
      res.status(404).json(
        formatResponse(false, null, `Contact with ID ${contactId} not found for client ${id}`)
      );
      return;
    }
    
    // Delete the contact using service
    await commercialService.deleteClientContact(contactIdInt);
    
    res.json(formatResponse(true, null, "Contact removed successfully"));
  } catch (error) {
    console.error("Error removing client contact:", error);
    res.status(500).json(formatResponse(false, null, "Failed to remove client contact", error));
  }
};

// Sales endpoints
export const getAllSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string || "1");
    const limit = parseInt(req.query.limit as string || "10");
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const clientId = req.query.clientId ? parseInt(req.query.clientId as string) : undefined;
    const deviceType = req.query.deviceType as string;
    
    const salesData = await commercialService.getSales(
      page,
      limit,
      startDate,
      endDate,
      clientId,
      deviceType
    );
    
    res.json(formatResponse(true, salesData, "Sales retrieved successfully"));
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve sales", error));
  }
};

export const getSaleDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const saleId = parseInt(id);
    
    if (isNaN(saleId)) {
      res.status(400).json(formatResponse(false, null, "Invalid sale ID format"));
      return;
    }
    
    const sale = await commercialService.getSaleById(saleId);
    
    if (!sale) {
      res.status(404).json(formatResponse(false, null, `Sale with ID ${id} not found`));
      return;
    }
    
    res.json(formatResponse(true, sale, "Sale details retrieved successfully"));
  } catch (error) {
    console.error("Error fetching sale details:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve sale details", error));
  }
};

export const createSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceId, userId, price } = req.body;
    
    // Validate required fields
    if (!deviceId || !userId) {
      res.status(400).json(
        formatResponse(false, null, "Device ID and User ID are required fields")
      );
      return;
    }
    
    const deviceIdInt = parseInt(deviceId);
    const userIdInt = parseInt(userId);
    const priceValue = price ? parseInt(price) : undefined;
    
    if (isNaN(deviceIdInt) || isNaN(userIdInt)) {
      res.status(400).json(formatResponse(false, null, "Invalid ID format"));
      return;
    }
    
    // Check if user exists and is an END_USER
    const user = await commercialService.getClientById(userIdInt);
    
    if (!user) {
      res.status(404).json(formatResponse(false, null, `User with ID ${userId} not found`));
      return;
    }
    
    if (user.role !== Role.endUser || !user.EndUser) {
      res.status(400).json(
        formatResponse(false, null, `User with ID ${userId} is not a client (endUser)`)
      );
      return;
    }
    
    // Create sale using service
    try {
      const result = await commercialService.createSaleRecord(
        deviceIdInt,
        user.EndUser.id,
        priceValue
      );
      
      res.status(201).json(formatResponse(true, result, "Sale created successfully"));
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json(formatResponse(false, null, err.message));
        return;
      }
      throw err;
    }
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json(formatResponse(false, null, "Failed to create sale", error));
  }
};

export const deleteSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const saleId = parseInt(id);
    
    if (isNaN(saleId)) {
      res.status(400).json(formatResponse(false, null, "Invalid sale ID format"));
      return;
    }
    
    try {
      await commercialService.deleteSaleRecord(saleId);
      res.json(formatResponse(true, null, "Sale deleted successfully"));
    } catch (err) {
      if (err instanceof Error) {
        res.status(404).json(formatResponse(false, null, err.message));
        return;
      }
      throw err;
    }
  } catch (error) {
    console.error("Error deleting sale:", error);
    res.status(500).json(formatResponse(false, null, "Failed to delete sale", error));
  }
};

export const getSalesStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Import and call the existing controller function
    const { getSalesStatistics } = require("./saleController");
    return getSalesStatistics(req, res);
  } catch (error) {
    console.error("Error fetching sales stats:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve sales stats", error));
  }
};

// Product endpoints
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Import and call the existing controller function
    const { getAllDevices } = require("./deviceController");
    return getAllDevices(req, res);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve products", error));
  }
};

export const getProductDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deviceId = parseInt(id);
    
    if (isNaN(deviceId)) {
      res.status(400).json(formatResponse(false, null, "Invalid device ID format"));
      return;
    }
    
    const product = await commercialService.getProductById(deviceId);
    
    if (!product) {
      res.status(404).json(formatResponse(false, null, `Product with ID ${id} not found`));
      return;
    }
    
    res.json(formatResponse(true, product, "Product details retrieved successfully"));
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve product details", error));
  }
};

export const getProductTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const types = await commercialService.getDistinctProductTypes();
    res.json(formatResponse(true, types, "Product types retrieved successfully"));
  } catch (error) {
    console.error("Error fetching product types:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve product types", error));
  }
};

export const getProductStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Import and call the existing controller function
    const { getDeviceStatistics } = require("./deviceController");
    return getDeviceStatistics(req, res);
  } catch (error) {
    console.error("Error fetching product stats:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve product stats", error));
  }
}; 
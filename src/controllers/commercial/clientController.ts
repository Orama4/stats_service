import { Request, Response, Role } from "./utils";
import { formatResponse } from "./utils";
import * as commercialService from "../../services/commercial";

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
    const { email, password, firstname, lastname, phonenumber, address } = req.body;
    
    // Validate required fields
    if (!email || !password || !firstname || !lastname || !phonenumber) {
      res.status(400).json(
        formatResponse(false, null, "Email, password, firstname, lastname, and phonenumber are required")
      );
      return;
    }
    
    try {
      const newClient = await commercialService.createClient(
        email,
        password,
        firstname,
        lastname,
        phonenumber,
        address
      );
      
      res.status(201).json(formatResponse(true, newClient, "Client created successfully"));
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json(formatResponse(false, null, err.message));
        return;
      }
      throw err;
    }
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

// Update client password
export const updateClientPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const clientId = parseInt(id);
    
    if (isNaN(clientId)) {
      res.status(400).json(formatResponse(false, null, "Invalid client ID format"));
      return;
    }
    
    const { password } = req.body;
    
    if (!password) {
      res.status(400).json(formatResponse(false, null, "Password is required"));
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
    
    // Update the password
    await commercialService.updateUserPassword(clientId, password);
    
    res.json(formatResponse(true, null, "Password updated successfully"));
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json(formatResponse(false, null, "Failed to update password", error));
  }
};

// Get client sales history
export const getClientSalesHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const clientId = parseInt(id);
    
    if (isNaN(clientId)) {
      res.status(400).json(formatResponse(false, null, "Invalid client ID format"));
      return;
    }
    
    // Extract query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const sortBy = (req.query.sortBy as string) || "date";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";
    
    // Validate sort parameters
    if (!["date", "amount", "product"].includes(sortBy)) {
      res.status(400).json(formatResponse(false, null, "Invalid sortBy parameter. Must be 'date', 'amount', or 'product'"));
      return;
    }
    
    if (!["asc", "desc"].includes(sortOrder)) {
      res.status(400).json(formatResponse(false, null, "Invalid sortOrder parameter. Must be 'asc' or 'desc'"));
      return;
    }
    
    // Validate date formats if provided
    if (startDate && isNaN(Date.parse(startDate))) {
      res.status(400).json(formatResponse(false, null, "Invalid startDate format. Use ISO date format."));
      return;
    }
    
    if (endDate && isNaN(Date.parse(endDate))) {
      res.status(400).json(formatResponse(false, null, "Invalid endDate format. Use ISO date format."));
      return;
    }
    
    // Get client sales history using service
    const salesHistory = await commercialService.getClientSalesHistory(
      clientId,
      page,
      limit,
      startDate,
      endDate,
      sortBy,
      sortOrder
    );
    
    res.json(formatResponse(true, salesHistory, "Client sales history retrieved successfully"));
  } catch (error) {
    console.error("Error fetching client sales history:", error);
    if (error instanceof Error && error.message === "Client not found") {
      res.status(404).json(formatResponse(false, null, `Client with ID ${req.params.id} not found`));
    } else {
      res.status(500).json(formatResponse(false, null, "Failed to retrieve client sales history", error));
    }
  }
};

// Get client sales statistics
export const getClientSalesStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const clientId = parseInt(id);
    
    if (isNaN(clientId)) {
      res.status(400).json(formatResponse(false, null, "Invalid client ID format"));
      return;
    }
    
    // Extract query parameters
    const period = (req.query.period as "month" | "quarter" | "year") || "year";
    
    // Validate period parameter
    if (!["month", "quarter", "year"].includes(period)) {
      res.status(400).json(formatResponse(false, null, "Invalid period parameter. Must be 'month', 'quarter', or 'year'"));
      return;
    }
    
    // Get client sales statistics using service
    const salesStats = await commercialService.getClientSalesStats(clientId, period);
    
    res.json(formatResponse(true, salesStats, "Client sales statistics retrieved successfully"));
  } catch (error) {
    console.error("Error fetching client sales statistics:", error);
    if (error instanceof Error && error.message === "Client not found") {
      res.status(404).json(formatResponse(false, null, `Client with ID ${req.params.id} not found`));
    } else {
      res.status(500).json(formatResponse(false, null, "Failed to retrieve client sales statistics", error));
    }
  }
};

// Get specific sale details for a client
export const getClientSaleDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId, saleId } = req.params;
    const clientIdInt = parseInt(clientId);
    const saleIdInt = parseInt(saleId);
    
    if (isNaN(clientIdInt) || isNaN(saleIdInt)) {
      res.status(400).json(formatResponse(false, null, "Invalid client ID or sale ID format"));
      return;
    }
    
    // Get sale details using service
    const saleDetails = await commercialService.getClientSaleDetails(clientIdInt, saleIdInt);
    
    res.json(formatResponse(true, saleDetails, "Sale details retrieved successfully"));
  } catch (error) {
    console.error("Error fetching sale details:", error);
    if (error instanceof Error) {
      if (error.message === "Client not found") {
        res.status(404).json(formatResponse(false, null, `Client with ID ${req.params.clientId} not found`));
      } else if (error.message === "Sale not found or does not belong to this client") {
        res.status(404).json(formatResponse(false, null, `Sale with ID ${req.params.saleId} not found for client ${req.params.clientId}`));
      } else {
        res.status(500).json(formatResponse(false, null, "Failed to retrieve sale details", error));
      }
    } else {
      res.status(500).json(formatResponse(false, null, "Failed to retrieve sale details", error));
    }
  }
}; 
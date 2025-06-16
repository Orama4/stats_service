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
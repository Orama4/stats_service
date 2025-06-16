import { Request, Response, Role } from "./utils";
import { formatResponse } from "./utils";
import * as commercialService from "../../services/commercial";

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
    const { getSalesStatistics } = require("../saleController");
    return getSalesStatistics(req, res);
  } catch (error) {
    console.error("Error fetching sales stats:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve sales stats", error));
  }
}; 
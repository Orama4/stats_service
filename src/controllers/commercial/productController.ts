import { Request, Response, DeviceStatus } from "./utils";
import { formatResponse } from "./utils";
import * as commercialService from "../../services/commercial";

// Product endpoints
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string || "1");
    const limit = parseInt(req.query.limit as string || "10");
    const search = req.query.search as string || "";
    const type = req.query.type as string;
    const status = req.query.status as DeviceStatus;
    
    const productsData = await commercialService.getProducts(
      page,
      limit,
      search,
      type,
      status
    );
    
    res.json(formatResponse(true, productsData, "Products retrieved successfully"));
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
    const { getDeviceStatistics } = require("../deviceController");
    return getDeviceStatistics(req, res);
  } catch (error) {
    console.error("Error fetching product stats:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve product stats", error));
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, description, price, status } = req.body;
    
    // Validate required fields
    if (!type) {
      res.status(400).json(formatResponse(false, null, "Product type is required"));
      return;
    }
    
    try {
      const newProduct = await commercialService.createProduct(
        type,
        description || "",
        price ? parseFloat(price) : undefined,
        status as DeviceStatus || DeviceStatus.connected
      );
      
      res.status(201).json(formatResponse(true, newProduct, "Product created successfully"));
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json(formatResponse(false, null, err.message));
        return;
      }
      throw err;
    }
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json(formatResponse(false, null, "Failed to create product", error));
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deviceId = parseInt(id);
    
    if (isNaN(deviceId)) {
      res.status(400).json(formatResponse(false, null, "Invalid device ID format"));
      return;
    }
    
    const { type, description, price, status } = req.body;
    
    // Check if device exists
    const existingDevice = await commercialService.getProductById(deviceId);
    
    if (!existingDevice) {
      res.status(404).json(formatResponse(false, null, `Product with ID ${id} not found`));
      return;
    }
    
    // Update device data using service
    const updatedDevice = await commercialService.updateProduct(
      deviceId,
      type,
      description,
      price !== undefined ? parseFloat(price) : undefined,
      status as DeviceStatus
    );
    
    res.json(formatResponse(true, updatedDevice, "Product updated successfully"));
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json(formatResponse(false, null, "Failed to update product", error));
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deviceId = parseInt(id);
    
    if (isNaN(deviceId)) {
      res.status(400).json(formatResponse(false, null, "Invalid device ID format"));
      return;
    }
    
    try {
      const result = await commercialService.deleteProduct(deviceId);
      res.json(formatResponse(true, result, "Product deleted/deactivated successfully"));
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("not found")) {
          res.status(404).json(formatResponse(false, null, err.message));
        } else {
          res.status(400).json(formatResponse(false, null, err.message));
        }
        return;
      }
      throw err;
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json(formatResponse(false, null, "Failed to delete product", error));
  }
}; 
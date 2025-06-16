import { Request, Response } from "./utils";
import { formatResponse } from "./utils";
import * as commercialService from "../../services/commercial";

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
    const { getTopProducts } = require("../dashboardController");
    return getTopProducts(req, res);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json(formatResponse(false, null, "Failed to retrieve top products", error));
  }
}; 
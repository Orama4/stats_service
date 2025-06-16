import { Request, Response } from "express";
import { Role, DeviceStatus } from "@prisma/client";

// Helper function for standardized response format
export const formatResponse = (success: boolean, data: any = null, message: string = "", errors: any = null) => ({
  success,
  data,
  message,
  errors
});

// Export types for reuse
export { Request, Response, Role, DeviceStatus }; 
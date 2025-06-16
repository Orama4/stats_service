import { DeviceStatus, prisma } from "./utils";

// Sales related services
export const getSales = async (
  page: number = 1,
  limit: number = 10,
  startDate?: Date,
  endDate?: Date,
  clientId?: number,
  deviceType?: string
) => {
  const skip = (page - 1) * limit;
  
  // Build query conditions
  const where: any = {};
  
  // Add date range filter if provided
  if (startDate && endDate) {
    where.createdAt = {
      gte: startDate,
      lte: endDate
    };
  } else if (startDate) {
    where.createdAt = { gte: startDate };
  } else if (endDate) {
    where.createdAt = { lte: endDate };
  }
  
  // Add client filter if provided
  if (clientId) {
    where.buyerId = clientId;
  }
  
  // Add device type filter if provided
  if (deviceType) {
    where.Device = { type: deviceType };
  }
  
  // Get total count for pagination
  const totalCount = await prisma.sale.count({ where });
  
  // Get paginated sales with device and client info
  const sales = await prisma.sale.findMany({
    where,
    include: {
      EndUser: {
        include: {
          User: {
            include: {
              Profile: true
            }
          }
        }
      },
      Device: true
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit
  });
  
  return {
    sales,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};

export const getSaleById = async (saleId: number) => {
  return prisma.sale.findUnique({
    where: { id: saleId },
    include: {
      EndUser: {
        include: {
          User: {
            include: {
              Profile: true
            }
          }
        }
      },
      Device: true
    }
  });
};

export const createSaleRecord = async (deviceId: number, endUserId: number, price?: number) => {
  // Create sale and update device status in a transaction
  return prisma.$transaction(async (tx) => {
    // Get the device first
    const device = await tx.device.findUnique({
      where: { id: deviceId }
    });
    
    if (!device) {
      throw new Error(`Device with ID ${deviceId} not found`);
    }
    
    // Update device price if needed
    if (price && !device.price) {
      await tx.device.update({
        where: { id: deviceId },
        data: { price }
      });
    }
    
    // Create the sale record
    const sale = await tx.sale.create({
      data: {
        deviceId,
        buyerId: endUserId,
      }
    });
    
    // Update device status to disconnected and associate with user
    await tx.device.update({
      where: { id: deviceId },
      data: { 
        status: DeviceStatus.disconnected,
        userId: endUserId
      }
    });
    
    return sale;
  });
};

export const deleteSaleRecord = async (saleId: number) => {
  // Get the sale first to access device info
  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
    include: { Device: true }
  });
  
  if (!sale) {
    throw new Error(`Sale with ID ${saleId} not found`);
  }
  
  // Delete sale and update device status in a transaction
  return prisma.$transaction(async (tx) => {
    // Hard delete the sale
    await tx.sale.delete({
      where: { id: saleId }
    });
    
    // Update device status back to connected
    if (sale.Device) {
      await tx.device.update({
        where: { id: sale.deviceId },
        data: {
          status: DeviceStatus.connected,
          userId: null // Remove association with user
        }
      });
    }
  });
}; 
import { DeviceStatus, prisma } from "./utils";

// Product related services
export const getProductById = async (deviceId: number) => {
  return prisma.device.findUnique({
    where: { id: deviceId },
    include: {
      EndUser: {
        include: {
          User: true
        }
      },
      Sale: true
    }
  });
};

export const getDistinctProductTypes = async () => {
  const deviceTypes = await prisma.device.findMany({
    select: {
      type: true
    },
    distinct: ['type']
  });
  
  return deviceTypes.map(device => device.type);
};

// Create new product (device)
export const createProduct = async (
  type: string,
  description: string,
  price?: number,
  status: DeviceStatus = DeviceStatus.connected
) => {
  return prisma.device.create({
    data: {
      type,
      nom: description,
      macAdresse: "NEW_DEVICE",
      status,
      price: price ? Math.round(price) : null,
    }
  });
};

// Update product (device)
export const updateProduct = async (
  deviceId: number,
  type?: string,
  description?: string,
  price?: number,
  status?: DeviceStatus
) => {
  // Build the update data object
  const updateData: any = {};
  if (type !== undefined) updateData.type = type;
  if (description !== undefined) updateData.nom = description;
  if (price !== undefined) updateData.price = Math.round(price); // Make sure price is an integer
  if (status !== undefined) updateData.status = status;
  
  // Only update if there are fields to update
  if (Object.keys(updateData).length === 0) {
    return prisma.device.findUnique({
      where: { id: deviceId }
    });
  }
  
  return prisma.device.update({
    where: { id: deviceId },
    data: updateData
  });
};

// Delete/deactivate product (device)
export const deleteProduct = async (deviceId: number) => {
  // Check if the device is associated with any sales
  const device = await prisma.device.findUnique({
    where: { id: deviceId },
    include: { Sale: true }
  });
  
  if (!device) {
    throw new Error(`Device with ID ${deviceId} not found`);
  }
  
  if (device.Sale && device.Sale.length > 0) {
    // If device has sales, just mark it as disconnected
    return prisma.device.update({
      where: { id: deviceId },
      data: { status: DeviceStatus.disconnected }
    });
  }
  
  // If no sales, we can safely delete the device
  return prisma.device.delete({
    where: { id: deviceId }
  });
};

// Get all products with filtering and pagination
export const getProducts = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  type?: string,
  status?: DeviceStatus
) => {
  const skip = (page - 1) * limit;
  
  // Build query conditions
  const where: any = {};
  
  // Add search condition if provided
  if (search) {
    where.OR = [
      { type: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  // Add type filter if provided
  if (type) {
    where.type = type;
  }
  
  // Add status filter if provided
  if (status) {
    where.status = status;
  }
  
  // Get total count for pagination
  const totalCount = await prisma.device.count({ where });
  
  // Get paginated devices
  const devices = await prisma.device.findMany({
    where,
    include: {
      EndUser: {
        include: {
          User: true
        }
      },
      Sale: true
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit
  });
  
  return {
    devices,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
}; 
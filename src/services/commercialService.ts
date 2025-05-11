import { DeviceStatus, Role } from "@prisma/client";
import { prisma } from "../lib/prisma";

// Dashboard related services
export const getDashboardStats = async () => {
  // Get total sales count
  const totalSales = await prisma.sale.count();
  
  // Get total revenue
  const salesWithDevices = await prisma.sale.findMany({
    include: {
      Device: {
        select: {
          price: true,
        },
      },
    },
  });

  const revenue = salesWithDevices.reduce((sum, sale) => {
    return sum + (sale.Device?.price || 0);
  }, 0);
  
  // Get clients count
  const clientsCount = await prisma.user.count({
    where: {
      role: Role.endUser
    }
  });
  
  // Get monthly growth (compare current month with previous month)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentYear = currentDate.getFullYear();
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const currentMonthSales = await prisma.sale.count({
    where: {
      createdAt: {
        gte: new Date(currentYear, currentMonth, 1),
        lt: new Date(currentYear, currentMonth + 1, 1)
      }
    }
  });
  
  const previousMonthSales = await prisma.sale.count({
    where: {
      createdAt: {
        gte: new Date(previousYear, previousMonth, 1),
        lt: new Date(currentYear, currentMonth, 1)
      }
    }
  });
  
  // Calculate growth percentage
  const salesGrowth = previousMonthSales === 0 
    ? 100 
    : ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100;

  return {
    totalSales,
    revenue,
    clientsCount,
    monthlyGrowth: {
      sales: salesGrowth
    }
  };
};

export const getSalesChartData = async (period: string = "month") => {
  let dateFormat: string;
  let startDate: Date;
  
  const currentDate = new Date();
  
  // Configure time period for the query
  switch (period) {
    case "day":
      dateFormat = "%Y-%m-%d %H:00";
      startDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "week":
      dateFormat = "%Y-%m-%d";
      startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "year":
      dateFormat = "%Y-%m";
      startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
      break;
    case "month":
    default:
      dateFormat = "%Y-%m-%d";
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
  }
  
  // Query sales data grouped by the specified time period using raw SQL
  const salesData = await prisma.$queryRaw`
    SELECT 
      DATE_FORMAT(createdAt, ${dateFormat}) as date,
      COUNT(*) as count,
      SUM(price) as revenue
    FROM Sale
    WHERE createdAt >= ${startDate}
    GROUP BY date
    ORDER BY date ASC
  `;
  
  return salesData;
};

// Client related services
export const getClients = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) => {
  const skip = (page - 1) * limit;
  
  // Build the query conditions
  const where: any = {
    role: Role.endUser
  };
  
  // Add search condition if provided
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { Profile: { is: { phonenumber: { contains: search, mode: 'insensitive' } } } }
    ];
  }
  
  // Get total count for pagination
  const totalCount = await prisma.user.count({ where });
  
  // Get paginated clients with their profile data
  const clients = await prisma.user.findMany({
    where,
    include: {
      Profile: true,
      EndUser: {
        include: {
          Device: true
        }
      }
    },
    orderBy: {
      [sortBy]: sortOrder
    },
    skip,
    take: limit,
  });
  
  return {
    clients,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};

export const getClientById = async (clientId: number) => {
  return prisma.user.findUnique({
    where: { id: clientId },
    include: {
      Profile: true,
      EndUser: {
        include: {
          Device: true,
          Sale: {
            include: {
              Device: true
            }
          },
          urgenceContacts: true
        }
      }
    }
  });
};

export const updateClientData = async (
  clientId: number,
  email?: string,
  firstname?: string,
  lastname?: string,
  phonenumber?: string,
  address?: string
) => {
  // Update user and profile in a transaction
  return prisma.$transaction(async (tx) => {
    // Update user data if email is provided
    if (email) {
      await tx.user.update({
        where: { id: clientId },
        data: { email }
      });
    }
    
    // Check if profile exists
    const profile = await tx.profile.findUnique({
      where: { userId: clientId }
    });
    
    const profileData: any = {};
    if (firstname) profileData.firstname = firstname;
    if (lastname) profileData.lastname = lastname;
    if (phonenumber) profileData.phonenumber = phonenumber;
    if (address) profileData.address = address;
    
    // Only update if there are fields to update
    if (Object.keys(profileData).length > 0) {
      if (profile) {
        // Update profile if it exists
        await tx.profile.update({
          where: { userId: clientId },
          data: profileData
        });
      } else {
        // Create profile if it doesn't exist
        await tx.profile.create({
          data: {
            userId: clientId,
            ...profileData
          }
        });
      }
    }
    
    // Return updated user with profile
    return tx.user.findUnique({
      where: { id: clientId },
      include: { Profile: true }
    });
  });
};

export const deactivateClient = async (clientId: number) => {
  return prisma.endUser.update({
    where: { userId: clientId },
    data: {
      status: "inactive"
    }
  });
};

export const getClientContacts = async (endUserId: number) => {
  return prisma.contact.findMany({
    where: { endUserId }
  });
};

export const createClientContact = async (endUserId: number, nom: string, telephone: string) => {
  return prisma.contact.create({
    data: {
      nom,
      telephone,
      endUserId
    }
  });
};

export const deleteClientContact = async (contactId: number) => {
  return prisma.contact.delete({
    where: { id: contactId }
  });
};

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
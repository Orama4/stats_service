import { Role, prisma, bcrypt } from "./utils";

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

// Create client function
export const createClient = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string,
  phonenumber: string,
  address?: string
) => {
  // Create user with endUser role and profile in a transaction
  return prisma.$transaction(async (tx) => {
    // Check if email is already in use
    const existingUser = await tx.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new Error(`Email ${email} is already in use`);
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create the user with hashed password
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.endUser
      }
    });
    
    // Create user profile
    await tx.profile.create({
      data: {
        userId: user.id,
        firstname,
        lastname,
        phonenumber,
        address
      }
    });
    
    // Create endUser record
    await tx.endUser.create({
      data: {
        userId: user.id,
        status: "active"
      }
    });
    
    // Return the created user with its profile and endUser data
    return tx.user.findUnique({
      where: { id: user.id },
      include: {
        Profile: true,
        EndUser: true
      }
    });
  });
};

// Update user password
export const updateUserPassword = async (userId: number, newPassword: string) => {
  // Hash the new password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
  // Update the user's password
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });
};

// Get client sales history with pagination and filtering
export const getClientSalesHistory = async (
  clientId: number,
  page: number = 1,
  limit: number = 10,
  startDate?: string,
  endDate?: string,
  sortBy: string = "date",
  sortOrder: "asc" | "desc" = "desc"
) => {
  // First, get the client data
  const client = await prisma.user.findUnique({
    where: { id: clientId },
    include: {
      Profile: true,
      EndUser: true
    }
  });

  if (!client || !client.EndUser) {
    throw new Error("Client not found");
  }

  // Build the where clause for sales filtering
  const whereClause: any = {
    buyerId: client.EndUser.id
  };

  // Add date filtering if provided
  if (startDate || endDate) {
    whereClause.createdAt = {};
    if (startDate) {
      whereClause.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      whereClause.createdAt.lte = new Date(endDate);
    }
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Determine sort field mapping
  const sortField = sortBy === "date" ? "createdAt" : 
                   sortBy === "amount" ? "Device" : "createdAt";

  // Get sales count for pagination
  const totalCount = await prisma.sale.count({
    where: whereClause
  });

  // Get paginated sales with device information
  const sales = await prisma.sale.findMany({
    where: whereClause,
    include: {
      Device: {
        select: {
          id: true,
          type: true,
          nom: true,
          price: true,
          macAdresse: true
        }
      }
    },
    orderBy: {
      [sortField === "Device" ? "createdAt" : sortField]: sortOrder
    },
    skip,
    take: limit
  });

  // Calculate summary statistics
  const allSales = await prisma.sale.findMany({
    where: { buyerId: client.EndUser.id },
    include: {
      Device: {
        select: {
          price: true,
          type: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalAmount = allSales.reduce((sum, sale) => sum + (sale.Device?.price || 0), 0);
  const averageOrderValue = allSales.length > 0 ? totalAmount / allSales.length : 0;
  const lastPurchaseDate = allSales.length > 0 ? allSales[0].createdAt : null;
  
  // Find favorite product type
  const productTypeCounts: { [key: string]: number } = {};
  allSales.forEach(sale => {
    if (sale.Device?.type) {
      productTypeCounts[sale.Device.type] = (productTypeCounts[sale.Device.type] || 0) + 1;
    }
  });
  const favoriteProductType = Object.keys(productTypeCounts).reduce((a, b) => 
    productTypeCounts[a] > productTypeCounts[b] ? a : b, ""
  );

  // Transform sales data to match the expected format
  const transformedSales = sales.map(sale => ({
    id: sale.id,
    saleDate: sale.createdAt,
    totalAmount: sale.Device?.price || 0,
    status: "completed", // Since we don't have status field, default to completed
    items: [{
      id: sale.id,
      deviceId: sale.deviceId,
      quantity: 1, // Assuming 1 device per sale based on current schema
      unitPrice: sale.Device?.price || 0,
      totalPrice: sale.Device?.price || 0,
      Device: {
        id: sale.Device?.id || 0,
        type: sale.Device?.type || "",
        nom: sale.Device?.nom || "",
        description: sale.Device?.nom || "" // Using nom as description
      }
    }],
    paymentMethod: "cash", // Default since we don't have this field
    notes: "" // Default since we don't have this field
  }));

  return {
    client: {
      id: client.id,
      email: client.email,
      Profile: {
        firstname: client.Profile?.firstname || "",
        lastname: client.Profile?.lastname || "",
        phonenumber: client.Profile?.phonenumber || "",
        address: client.Profile?.address || ""
      }
    },
    sales: transformedSales,
    summary: {
      totalSales: allSales.length,
      totalAmount,
      averageOrderValue,
      lastPurchaseDate,
      favoriteProductType
    },
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};

// Get client sales statistics
export const getClientSalesStats = async (
  clientId: number,
  period: "month" | "quarter" | "year" = "year"
) => {
  // Get the client data
  const client = await prisma.user.findUnique({
    where: { id: clientId },
    include: {
      EndUser: true
    }
  });

  if (!client || !client.EndUser) {
    throw new Error("Client not found");
  }

  // Calculate date range based on period
  const now = new Date();
  let startDate: Date;
  
  switch (period) {
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "quarter":
      const quarterStart = Math.floor(now.getMonth() / 3) * 3;
      startDate = new Date(now.getFullYear(), quarterStart, 1);
      break;
    case "year":
    default:
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }

  // Get sales for the period
  const periodSales = await prisma.sale.findMany({
    where: {
      buyerId: client.EndUser.id,
      createdAt: {
        gte: startDate,
        lte: now
      }
    },
    include: {
      Device: {
        select: {
          price: true,
          type: true
        }
      }
    }
  });

  // Calculate period stats
  const totalAmount = periodSales.reduce((sum, sale) => sum + (sale.Device?.price || 0), 0);
  const averageOrderValue = periodSales.length > 0 ? totalAmount / periodSales.length : 0;

  // Generate monthly trend (last 12 months)
  const monthlyTrend = [];
  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const monthSales = await prisma.sale.findMany({
      where: {
        buyerId: client.EndUser.id,
        createdAt: {
          gte: monthStart,
          lte: monthEnd
        }
      },
      include: {
        Device: {
          select: {
            price: true
          }
        }
      }
    });

    const monthRevenue = monthSales.reduce((sum, sale) => sum + (sale.Device?.price || 0), 0);
    
    monthlyTrend.push({
      month: monthStart.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      salesCount: monthSales.length,
      revenue: monthRevenue
    });
  }

  // Product breakdown
  const productBreakdown: { [key: string]: { quantity: number; totalAmount: number } } = {};
  periodSales.forEach(sale => {
    if (sale.Device?.type) {
      if (!productBreakdown[sale.Device.type]) {
        productBreakdown[sale.Device.type] = { quantity: 0, totalAmount: 0 };
      }
      productBreakdown[sale.Device.type].quantity += 1;
      productBreakdown[sale.Device.type].totalAmount += (sale.Device.price || 0);
    }
  });

  const productBreakdownArray = Object.entries(productBreakdown).map(([type, data]) => ({
    productType: type,
    quantity: data.quantity,
    totalAmount: data.totalAmount,
    percentage: totalAmount > 0 ? (data.totalAmount / totalAmount) * 100 : 0
  }));

  return {
    periodStats: {
      period,
      totalSales: periodSales.length,
      totalAmount,
      averageOrderValue
    },
    monthlyTrend,
    productBreakdown: productBreakdownArray,
    paymentMethodBreakdown: {
      cash: periodSales.length, // Default all to cash since we don't have payment method
      card: 0,
      transfer: 0
    }
  };
};

// Get specific sale details for a client
export const getClientSaleDetails = async (clientId: number, saleId: number) => {
  // First verify the client exists
  const client = await prisma.user.findUnique({
    where: { id: clientId },
    include: {
      Profile: true,
      EndUser: true
    }
  });

  if (!client || !client.EndUser) {
    throw new Error("Client not found");
  }

  // Get the sale details
  const sale = await prisma.sale.findFirst({
    where: {
      id: saleId,
      buyerId: client.EndUser.id // Ensure sale belongs to this client
    },
    include: {
      Device: {
        select: {
          id: true,
          type: true,
          nom: true,
          price: true,
          macAdresse: true
        }
      }
    }
  });

  if (!sale) {
    throw new Error("Sale not found or does not belong to this client");
  }

  return {
    id: sale.id,
    saleDate: sale.createdAt,
    totalAmount: sale.Device?.price || 0,
    status: "completed", // Default since we don't have status field
    client: {
      id: client.id,
      email: client.email,
      Profile: {
        firstname: client.Profile?.firstname || "",
        lastname: client.Profile?.lastname || "",
        phonenumber: client.Profile?.phonenumber || "",
        address: client.Profile?.address || ""
      }
    },
    items: [{
      id: sale.id,
      deviceId: sale.deviceId,
      quantity: 1, // Assuming 1 device per sale
      unitPrice: sale.Device?.price || 0,
      totalPrice: sale.Device?.price || 0,
      Device: {
        id: sale.Device?.id || 0,
        type: sale.Device?.type || "",
        nom: sale.Device?.nom || "",
        description: sale.Device?.nom || "",
        macAdresse: sale.Device?.macAdresse || ""
      }
    }],
    paymentMethod: "cash", // Default
    notes: "", // Default
    salesPerson: "system", // Default
    createdAt: sale.createdAt,
    updatedAt: sale.createdAt // Using createdAt since we don't have updatedAt
  };
}; 
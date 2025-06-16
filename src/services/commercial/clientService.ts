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
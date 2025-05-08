import {
  PrismaClient,
  DeviceStatus,
  SeverityLevel,
  Role,
} from "@prisma/client";
import { randomInt } from "crypto";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting KPI data seeding...");

  // Create sample devices
  console.log("Creating sample devices...");
  const deviceTypes = ["Ceinture", "Canne_Augment_", "Lunnettes_Connect_es"];
  const deviceStatus: DeviceStatus[] = [
    "connected",
    "disconnected",
    "under_maintenance",
    "out_of_service",
    "defective",
  ];

  const devicesToCreate = [
    {
      nom: "Smart Belt Pro",
      macAdresse: "AA:BB:CC:DD:EE:01",
      status: "connected" as DeviceStatus,
      type: deviceTypes[0],
      peripheriques: JSON.stringify({
        sensors: ["accelerometer", "gps", "heartrate"],
        batteryLevel: 85,
      }),
      localisation: JSON.stringify({
        latitude: 48.8566,
        longitude: 2.3522,
        lastUpdate: new Date(),
      }),
      cpuUsage: 15.3,
      ramUsage: 43.7,
      price: 1299,
    },
    {
      nom: "SmartCane 2000",
      macAdresse: "AA:BB:CC:DD:EE:02",
      status: "connected" as DeviceStatus,
      type: deviceTypes[1],
      peripheriques: JSON.stringify({
        sensors: ["proximity", "gps", "vibration"],
        batteryLevel: 92,
      }),
      localisation: JSON.stringify({
        latitude: 48.8584,
        longitude: 2.3536,
        lastUpdate: new Date(),
      }),
      cpuUsage: 12.1,
      ramUsage: 38.2,
      price: 1599,
    },
    {
      nom: "Vision AR Glasses",
      macAdresse: "AA:BB:CC:DD:EE:03",
      status: "under_maintenance" as DeviceStatus,
      type: deviceTypes[2],
      peripheriques: JSON.stringify({
        sensors: ["camera", "microphone", "motion"],
        batteryLevel: 64,
      }),
      localisation: JSON.stringify({
        latitude: 48.8606,
        longitude: 2.3376,
        lastUpdate: new Date(),
      }),
      cpuUsage: 45.2,
      ramUsage: 72.8,
      price: 2499,
    },
    {
      nom: "MoveSafe Belt",
      macAdresse: "AA:BB:CC:DD:EE:04",
      status: "disconnected" as DeviceStatus,
      type: deviceTypes[0],
      peripheriques: JSON.stringify({
        sensors: ["accelerometer", "gps", "temperature"],
        batteryLevel: 22,
      }),
      localisation: JSON.stringify({
        latitude: 48.8719,
        longitude: 2.3416,
        lastUpdate: new Date(),
      }),
      cpuUsage: 0,
      ramUsage: 0,
      price: 999,
    },
    {
      nom: "GuideVision Cane",
      macAdresse: "AA:BB:CC:DD:EE:05",
      status: "defective" as DeviceStatus,
      type: deviceTypes[1],
      peripheriques: JSON.stringify({
        sensors: ["proximity", "gps", "obstacle"],
        batteryLevel: 5,
      }),
      localisation: JSON.stringify({
        latitude: 48.8697,
        longitude: 2.3501,
        lastUpdate: new Date(),
      }),
      cpuUsage: 89.7,
      ramUsage: 95.3,
      price: 1499,
    },
  ];

  for (const deviceData of devicesToCreate) {
    try {
      // Check if device with the same MAC address already exists
      const existingDevice = await prisma.device.findFirst({
        where: { macAdresse: deviceData.macAdresse },
      });

      if (existingDevice) {
        console.log(`Device with MAC ${deviceData.macAdresse} already exists`);
        continue;
      }

      // Create the device
      const device = await prisma.device.create({
        data: {
          nom: deviceData.nom,
          macAdresse: deviceData.macAdresse,
          status: deviceData.status,
          peripheriques: deviceData.peripheriques,
          localisation: deviceData.localisation,
          cpuUsage: deviceData.cpuUsage,
          ramUsage: deviceData.ramUsage,
          price: deviceData.price,
          manufacturingCost: Math.round(deviceData.price * 0.45), // 45% of price as manufacturing cost
          createdAt: new Date(),
          type: deviceData.type,
        },
      });

      console.log(
        `Created device: ${deviceData.nom} with MAC ${deviceData.macAdresse}`
      );
    } catch (error) {
      console.error(`Error creating device ${deviceData.nom}:`, error);
    }
  }
  console.log(`Attempted to create ${devicesToCreate.length} devices`);

  // Adding User Creation with Password Hashing
  console.log("Creating users with hashed passwords...");

  // Create user data with different roles
  const usersToCreate = [
    {
      email: "admin@example.com",
      password: "admin123",
      role: "super" as Role,
      profile: {
        firstname: "Admin",
        lastname: "User",
        phonenumber: "+1234567890",
        address: "123 Admin Street",
      },
    },
    {
      email: "decider@app.com",
      password: "decider",
      role: "decider" as Role,
      profile: {
        firstname: "Decider",
        lastname: "User",
        phonenumber: "+1234567890",
        address: "123 Decider Street",
      },
    },
    {
      email: "commercial@example.com",
      password: "commercial123",
      role: "commercial" as Role,
      profile: {
        firstname: "Commercial",
        lastname: "Agent",
        phonenumber: "+1987654321",
        address: "456 Sales Avenue",
      },
    },
    {
      email: "enduser1@example.com",
      password: "enduser123",
      role: "endUser" as Role,
      profile: {
        firstname: "End",
        lastname: "User1",
        phonenumber: "+1122334455",
        address: "789 User Boulevard",
      },
    },
    {
      email: "helper@example.com",
      password: "helper123",
      role: "helper" as Role,
      profile: {
        firstname: "Helper",
        lastname: "Support",
        phonenumber: "+1555666777",
        address: "101 Support Lane",
      },
    },
    {
      email: "maintainer@example.com",
      password: "maintain123",
      role: "maintainer" as Role,
      profile: {
        firstname: "Maintenance",
        lastname: "Tech",
        phonenumber: "+1777888999",
        address: "202 Repair Road",
      },
    },
  ];

  // Function to create a user with bcrypt hashed password
  const createUser = async (userData) => {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`User ${userData.email} already exists`);
        return existingUser;
      }

      // Hash password with bcrypt (10 salt rounds)
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create user with hashed password
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          Profile: {
            create: userData.profile,
          },
          createdAt: new Date(),
          lastLogin: new Date(
            Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000
          ),
        },
      });

      // Create role-specific records
      if (userData.role === "super") {
        await prisma.admin.create({
          data: {
            userId: user.id,
            role: "super" as Role,
          },
        });
      } else if (userData.role === "commercial") {
        await prisma.commercial.create({
          data: {
            userId: user.id,
          },
        });
      } else if (userData.role === "endUser") {
        await prisma.endUser.create({
          data: {
            userId: user.id,
            status: "active",
          },
        });
      } else if (userData.role === "helper") {
        await prisma.helper.create({
          data: {
            userId: user.id,
          },
        });
      } else if (userData.role === "maintainer") {
        await prisma.maintainer.create({
          data: {
            userId: user.id,
          },
        });
      }

      console.log(`Created user: ${userData.email} with role ${userData.role}`);
      return user;
    } catch (error) {
      console.error(`Error creating user ${userData.email}:`, error);
      throw error;
    }
  };

  // Create all users
  for (const userData of usersToCreate) {
    await createUser(userData);
  }
  console.log(`Created ${usersToCreate.length} users with hashed passwords`);

  // 1. Update devices with manufacturing costs
  console.log("Adding manufacturing costs to existing devices...");
  const devices = await prisma.device.findMany();

  for (const device of devices) {
    // Manufacturing cost is typically 40-70% of selling price
    const costPercentage = Math.random() * 0.3 + 0.4; // between 40% and 70%
    const manufacturingCost = device.price
      ? Math.round(device.price * costPercentage)
      : null;

    await prisma.device.update({
      where: { id: device.id },
      data: { manufacturingCost: manufacturingCost },
    });
  }
  console.log(`Updated ${devices.length} devices with manufacturing costs.`);

  // 2. Update users with last login times
  console.log("Adding last login timestamps to users...");
  const users = await prisma.user.findMany();

  const now = new Date();
  for (const user of users) {
    // Create a more distributed login pattern for better MAU calculations
    // Some users logged in today, some in past week, some in past month, some inactive
    let lastLogin;
    const loginPattern = Math.random();

    if (loginPattern < 0.3) {
      // 30% of users logged in today or yesterday
      const hoursAgo = randomInt(0, 36);
      lastLogin = new Date(now);
      lastLogin.setHours(lastLogin.getHours() - hoursAgo);
    } else if (loginPattern < 0.6) {
      // 30% of users logged in within past week
      const daysAgo = randomInt(2, 7);
      lastLogin = new Date(now);
      lastLogin.setDate(lastLogin.getDate() - daysAgo);
    } else if (loginPattern < 0.85) {
      // 25% of users logged in within past month
      const daysAgo = randomInt(7, 30);
      lastLogin = new Date(now);
      lastLogin.setDate(lastLogin.getDate() - daysAgo);
    } else {
      // 15% of users haven't logged in for more than a month
      const daysAgo = randomInt(30, 120);
      lastLogin = new Date(now);
      lastLogin.setDate(lastLogin.getDate() - daysAgo);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin },
    });
  }
  console.log(`Updated ${users.length} users with last login timestamps.`);

  // 3. Create security incidents
  console.log("Creating security incidents...");

  // Create sample security incidents
  const severityLevels: SeverityLevel[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  const incidentTitles = [
    "Unauthorized access attempt",
    "Suspicious login activity",
    "Failed login threshold exceeded",
    "Password reset requested",
    "API rate limit exceeded",
    "Database connection error",
    "Configuration change detected",
    "System resource exhaustion",
    "Permission escalation attempt",
    "Data export over threshold",
  ];

  const incidentDescriptions = [
    "Multiple failed login attempts from unknown IP address",
    "User account accessed from new location",
    "System detected brute force attempt on login form",
    "Password reset requested from unrecognized device",
    "API endpoints called at unusually high frequency",
    "Database connection dropped unexpectedly during operation",
    "Critical system configuration changed outside maintenance window",
    "System CPU/memory usage reached critical threshold",
    "User attempted to access unauthorized resource",
    "Large data export initiated outside business hours",
  ];

  // Create 20-40 incidents spread over the last 90 days
  const numIncidents = randomInt(20, 41);
  const activeUserIds = users.map((user) => user.id);

  // Create a distribution of incidents by severity and time periods
  // For proper security incident tracking in financialKpiService
  const severityDistribution = {
    LOW: 0.45, // 45% of incidents are LOW
    MEDIUM: 0.3, // 30% of incidents are MEDIUM
    HIGH: 0.15, // 15% of incidents are HIGH
    CRITICAL: 0.1, // 10% of incidents are CRITICAL
  };

  // Create monthly distribution for trending analysis
  for (let i = 0; i < numIncidents; i++) {
    // Select severity based on distribution
    const randomValue = Math.random();
    let severity: SeverityLevel;
    let cumulative = 0;

    for (const [sev, prob] of Object.entries(severityDistribution)) {
      cumulative += prob;
      if (randomValue <= cumulative) {
        severity = sev as SeverityLevel;
        break;
      }
    }

    if (!severity) severity = "LOW"; // Fallback

    const titleIndex = randomInt(0, incidentTitles.length);

    // Create a time-based distribution for trending:
    // More incidents in recent months for an increasing trend
    let daysAgo: number;
    const timeDistribution = Math.random();

    if (timeDistribution < 0.4) {
      // 40% of incidents in past 30 days (recent)
      daysAgo = randomInt(0, 30);
    } else if (timeDistribution < 0.7) {
      // 30% in days 30-60
      daysAgo = randomInt(30, 60);
    } else {
      // 30% in days 60-90
      daysAgo = randomInt(60, 90);
    }

    const reportedAt = new Date();
    reportedAt.setDate(reportedAt.getDate() - daysAgo);

    // 70% chance of being resolved
    const isResolved = Math.random() < 0.7;
    let resolvedAt = null;

    if (isResolved) {
      // Resolution time depends on severity
      let maxHoursToResolve = 120; // default (5 days)

      if (severity === "CRITICAL") {
        maxHoursToResolve = 24; // Critical: max 24 hours to resolve
      } else if (severity === "HIGH") {
        maxHoursToResolve = 48; // High: max 48 hours to resolve
      } else if (severity === "MEDIUM") {
        maxHoursToResolve = 72; // Medium: max 72 hours to resolve
      }

      const hoursToResolve = randomInt(1, maxHoursToResolve);
      resolvedAt = new Date(reportedAt);
      resolvedAt.setHours(resolvedAt.getHours() + hoursToResolve);
    }

    const reportedBy = activeUserIds[randomInt(0, activeUserIds.length)];

    await prisma.securityIncident.create({
      data: {
        title: incidentTitles[titleIndex],
        description: incidentDescriptions[titleIndex],
        severity,
        reportedAt,
        resolvedAt,
        reportedBy,
        isResolved,
      },
    });
  }
  console.log(`Created ${numIncidents} security incidents.`);

  // 4. Create comprehensive sales data for revenue growth and profit margin calculations
  console.log(
    "Creating comprehensive sales data for financial KPI calculations..."
  );

  // Get devices for creating sales
  const availableDevices = await prisma.device.findMany();

  // Get end users with their user IDs
  const endUsers = await prisma.endUser.findMany({
    include: { User: true },
  });

  if (availableDevices.length > 0 && endUsers.length > 0) {
    // Define time periods for proper period-over-period comparisons
    const now = new Date();
    const timeRanges = [
      {
        name: "current-month",
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: now,
        count: randomInt(20, 41), // Good number of sales in current month
      },
      {
        name: "prev-month",
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 0),
        count: randomInt(15, 36), // Slightly fewer sales in previous month
      },
      {
        name: "two-months-ago",
        start: new Date(now.getFullYear(), now.getMonth() - 2, 1),
        end: new Date(now.getFullYear(), now.getMonth() - 1, 0),
        count: randomInt(10, 31), // Even fewer sales two months ago
      },
      {
        name: "three-to-six-months-ago",
        start: new Date(now.getFullYear(), now.getMonth() - 6, 1),
        end: new Date(now.getFullYear(), now.getMonth() - 2, 0),
        count: randomInt(30, 61), // Aggregated sales for months 3-6
      },
      {
        name: "six-to-twelve-months-ago",
        start: new Date(now.getFullYear() - 1, now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() - 6, 0),
        count: randomInt(50, 101), // Aggregated sales for months 6-12
      },
      {
        name: "prev-year-same-month",
        start: new Date(now.getFullYear() - 1, now.getMonth(), 1),
        end: new Date(now.getFullYear() - 1, now.getMonth() + 1, 0),
        count: randomInt(10, 26), // Last year same month (for YoY comparison)
      },
    ];

    let totalSales = 0;

    // Create sales for each time period
    for (const period of timeRanges) {
      console.log(`Creating ${period.count} sales for period: ${period.name}`);
      let successCount = 0;

      for (let i = 0; i < period.count; i++) {
        try {
          // Random date within the period
          const startTime = period.start.getTime();
          const endTime = period.end.getTime();
          const saleDate = new Date(
            startTime + Math.random() * (endTime - startTime)
          );

          // Pick a random device and buyer
          const device =
            availableDevices[randomInt(0, availableDevices.length)];
          const endUser = endUsers[randomInt(0, endUsers.length)];

          // Ensure price is set on devices (needed for revenue calculations)
          if (!device.price && device.id) {
            const randomPrice = randomInt(1000, 5000); // Between $1000 and $5000
            await prisma.device.update({
              where: { id: device.id },
              data: { price: randomPrice },
            });
            device.price = randomPrice;
          }

          // Check if we have valid relationships
          if (device && endUser && endUser.userId) {
            await prisma.sale.create({
              data: {
                deviceId: device.id,
                buyerId: endUser.userId,
                createdAt: saleDate,
              },
            });
            successCount++;
          }
        } catch (e) {
          // Skip failed records
          console.log(`Skipping a sale record due to: ${e.message}`);
        }
      }

      console.log(
        `Successfully created ${successCount} sales for period ${period.name}`
      );
      totalSales += successCount;
    }

    console.log(
      `Created a total of ${totalSales} sales records across all time periods.`
    );
  } else {
    console.log("Not enough devices or end users to create sales records.");
  }

  // 5. Create KPI records for historical tracking
  console.log("Creating KPI records for historical tracking...");

  // Define some historical KPIs to store
  const kpiData = [
    {
      name: "monthly_revenue",
      value: {
        amount: 125000,
        currency: "USD",
        month: "2025-04",
      },
    },
    {
      name: "quarterly_profit",
      value: {
        amount: 87500,
        currency: "USD",
        quarter: "Q1-2025",
      },
    },
    {
      name: "active_users_rate",
      value: {
        percentage: 78.5,
        month: "2025-04",
      },
    },
    {
      name: "avg_manufacturing_cost",
      value: {
        amount: 1250,
        currency: "USD",
      },
    },
    {
      name: "security_incidents_resolved",
      value: {
        count: 15,
        percentage: 88.2,
        month: "2025-04",
      },
    },
    {
      name: "avg_resolution_time",
      value: {
        hours: 36,
        month: "2025-04",
      },
    },
  ];

  // Insert the KPI records
  for (const kpi of kpiData) {
    const existingKpi = await prisma.kPI.findUnique({
      where: { name: kpi.name },
    });
    if (existingKpi) {
      await prisma.kPI.update({
        where: { name: kpi.name },
        data: {
          value: kpi.value,
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.kPI.create({
        data: {
          name: kpi.name,
          value: kpi.value,
          createdAt: new Date(
            Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000
          ),
          updatedAt: new Date(),
        },
      });
    }
  }

  console.log(`Created ${kpiData.length} KPI records.`);

  console.log("KPI data seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during KPI data seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

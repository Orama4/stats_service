import { Role, prisma } from "./utils";

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
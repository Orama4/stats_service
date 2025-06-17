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
  let startDate: Date;
  
  const currentDate = new Date();
  
  // Configure time period for the query
  switch (period) {
    case "day":
      startDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "week":
      startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "year":
      startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
      break;
    case "month":
    default:
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
  }
  
  // Query sales data with device information
  const salesData = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: startDate
      }
    },
    include: {
      Device: {
        select: {
          price: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
  
  // Group data by period in JavaScript
  const groupedData: Record<string, { count: number; revenue: number }> = {};
  
  salesData.forEach(sale => {
    let dateKey: string;
    const saleDate = new Date(sale.createdAt);
    
    switch (period) {
      case "day":
        dateKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}-${String(saleDate.getDate()).padStart(2, '0')} ${String(saleDate.getHours()).padStart(2, '0')}:00`;
        break;
      case "week":
      case "month":
        dateKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}-${String(saleDate.getDate()).padStart(2, '0')}`;
        break;
      case "year":
        dateKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        dateKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}-${String(saleDate.getDate()).padStart(2, '0')}`;
    }
    
    if (!groupedData[dateKey]) {
      groupedData[dateKey] = { count: 0, revenue: 0 };
    }
    
    groupedData[dateKey].count++;
    groupedData[dateKey].revenue += sale.Device?.price || 0;
  });
  
  // Convert to array format expected by the frontend
  const result = Object.entries(groupedData)
    .map(([date, data]) => ({
      date,
      count: data.count,
      revenue: data.revenue
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  return result;
}; 
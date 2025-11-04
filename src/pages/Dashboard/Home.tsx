import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import User from "../../components/dashboard/User";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Quản lý người dùng"
        description="Đây là trang quản lý người dùng"
      />
      <User />
    </>
  );
}

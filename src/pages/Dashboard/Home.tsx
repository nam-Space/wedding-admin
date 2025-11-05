
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

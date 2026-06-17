import { Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";

function UserLayout() {
  return (
    <div style={{ display: "flex" }}>
      <UserSidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;
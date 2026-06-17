import { Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";

function UserLayout() {
  return (
    <div className="d-flex">
      <UserSidebar />

      <div
        className="flex-grow-1 bg-light"
        style={{
          minHeight: "100vh",
          padding: "30px",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;
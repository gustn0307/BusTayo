import { useState } from "react";
import { Outlet } from "react-router-dom";
import { BsList } from "react-icons/bs";

import UserSidebar from "../components/UserSidebar";

function UserLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="user-layout">
      {/* 모바일 메뉴 버튼 */}
      <button
        type="button"
        className="mobile-menu-button d-md-none"
        onClick={openSidebar}
        aria-label="메뉴 열기"
      >
        <BsList size={24} />
      </button>

      {/* 모바일에서 사이드바 뒤 어두운 배경 */}
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* 사이드바 */}
      <UserSidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {/* 페이지 본문 */}
      <main className="user-layout-content">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;

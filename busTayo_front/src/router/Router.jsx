import { Routes, Route } from "react-router-dom";

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import AdminRoute from "./AdminRoute";

import Home from "../pages/Home";
import Favorite from "../pages/Favorite";
import NearbyBus from "../pages/NearbyBus";
import RouteSearch from "../pages/RouteSearch";
import BoardingAlarm from "../pages/BoardingAlarm";
import LostFound from "../pages/LostFound";
import Board from "../pages/board/Board"
import MyPage from "../pages/MyPage";
import Notice from "../pages/Notice";
import NoticeDetail from "../pages/NoticeDetail";
import UserManagement from "../pages/admin/UserManagement";
import NoticeManagement from "../pages/admin/notice/NoticeManagement";
import NoticeManagementDetail from "../pages/admin/notice/NoticeManagementDetail";
import Statistics from "../pages/admin/Statistics";
import BusHistory from "../pages/BusHistory";
import Login from "../auth/login";
import Join from "../auth/join";

// 게시판
// import BoardList from "../pages/board/BoardList";

function Router() {
  return (
    <Routes>

    <Route path="/login" element={<Login />} />
    <Route path="/join" element={<Join />} />
      
      {/* 사용자 */}

      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/nearby" element={<NearbyBus />} />
        <Route path="/route" element={<RouteSearch />} />
        <Route path="/alarm" element={<BoardingAlarm />} />
        <Route path="/lostfound" element={<LostFound />} />
        <Route path="/board" element={<Board />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/history" element={<BusHistory />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />

        {/* 게시판 */}
        {/* <Route path="/board" element={<BoardList />} /> */}
      </Route>

      {/* 관리자 */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<UserManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="notices" element={<NoticeManagement />} />
        <Route path="notices/:id" element={<NoticeManagementDetail />} />
        <Route path="statistics" element={<Statistics />} />
      </Route>
    </Routes>
  );
}

export default Router;

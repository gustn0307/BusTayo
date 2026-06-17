import { Routes, Route } from "react-router-dom";

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import AdminRoute from "./AdminRoute";

import Home from "../Pages/Home";
import Favorite from "../Pages/Favorite";
import NearbyBus from "../Pages/NearbyBus";
import RouteSearch from "../Pages/RouteSearch";
import BoardingAlarm from "../Pages/BoardingAlarm";
import LostFound from "../Pages/LostFound";
import FreeBoard from "../Pages/FreeBoard";
import MyPage from "../Pages/MyPage";

import UserManagement from "../Pages/admin/UserManagement";
import NoticeManagement from "../Pages/admin/NoticeManagement";
import Statistics from "../Pages/admin/Statistics";
import BusHistory from "../Pages/BusHistory";

function Router() {
  return (
    <Routes>
      {/* 사용자 */}

      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/nearby" element={<NearbyBus />} />
        <Route path="/route" element={<RouteSearch />} />
        <Route path="/alarm" element={<BoardingAlarm />} />
        <Route path="/lostfound" element={<LostFound />} />
        <Route path="/board" element={<FreeBoard />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/history" element={<BusHistory />} />
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
        <Route path="statistics" element={<Statistics />} />
      </Route>
    </Routes>
  );
}

export default Router;

import { Routes, Route, Navigate } from "react-router-dom";

// 레이아웃 및 가드
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminRoute from "./AdminRoute";

// 페이지들
import Home from "../pages/Home";
import Favorite from "../pages/Favorite";
import NearbyBus from "../pages/NearbyBus";
import RouteSearch from "../pages/RouteSearch";
import LostFound from "../pages/LostFound";
import FreeBoard from "../pages/FreeBoard";
import MyPage from "../pages/MyPage";
import BusHistory from "../pages/BusHistory";
import Notice from "../pages/Notice";
import NoticeDetail from "../pages/NoticeDetail";

// 인증 및 기타
import Login from '../auth/login';
import Join from '../auth/join';
import FindPassword from '../auth/FindPassword';
import AuthCallback from "../auth/AuthCallback";
import PrivateRoute from "./PrivateRoute";

// 관리자 페이지
import UserManagement from "../pages/admin/UserManagement";
import NoticeManagement from "../pages/admin/notice/NoticeManagement";
import NoticeManagementDetail from "../pages/admin/notice/NoticeManagementDetail";
import Statistics from "../pages/admin/Statistics";
<<<<<<< HEAD

// 인증 검문소
=======
import Login from "../auth/login";
import Join from "../auth/join";
>>>>>>> d5a8e37ff4c1188093d82480ec48324f57fa7105

function Router() {
  return (
    <Routes>
      {/* 1. 로그인 불필요 경로 (레이아웃만 적용) */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/join" element={<Join />} />
        <Route path="/find-password" element={<FindPassword />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
      </Route>

      {/* 2. 로그인 필요 경로 (PrivateRoute -> UserLayout -> 페이지) */}
      <Route element={<PrivateRoute><UserLayout /></PrivateRoute>}>
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/nearby" element={<NearbyBus />} />
        <Route path="/route" element={<RouteSearch />} />
        <Route path="/lostfound" element={<LostFound />} />
        <Route path="/board" element={<FreeBoard />} />
        <Route path="/mypage" element={<MyPage />} />
<<<<<<< HEAD
        <Route path="/history" element={<BusHistory />} />
=======
        <Route path="/notice" element={<Notice />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
>>>>>>> d5a8e37ff4c1188093d82480ec48324f57fa7105
      </Route>

      {/* 관리자 경로 */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
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
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Nav, Card, Button } from "react-bootstrap";
import { useAuth } from "../auth/AuthProvider";

import {
  BsBusFrontFill,
  BsHouseFill,
  BsGeoAltFill,
  BsSignpostFill,
  BsBellFill,
  BsStarFill,
  BsPersonFill,
  BsChatDotsFill,
  BsBriefcaseFill,
  BsShieldLockFill,
  BsClockHistory,
  BsMegaphoneFill,
  BsBoxArrowRight,
  BsChevronRight,
} from "react-icons/bs";

const NAV_SECTIONS = [
  {
    label: "버스 서비스",
    items: [
      { to: "/nearby", icon: BsGeoAltFill, label: "내 주변 검색" },
      {
        to: "/route",
        state: { reset: true },
        icon: BsSignpostFill,
        label: "길찾기",
      },
    ],
  },
  {
    label: "내 정보",
    items: [
      { to: "/favorite", icon: BsStarFill, label: "즐겨찾기" },
      { to: "/mypage", icon: BsPersonFill, label: "마이페이지" },
    ],
  },
  {
    label: "커뮤니티",
    items: [
      { to: "/board",     icon: BsChatDotsFill,  label: "자유게시판" },
      { to: "/lost", icon: BsBriefcaseFill, label: "분실물 찾기" },
      { to: "/notice",    icon: BsMegaphoneFill, label: "공지사항" },
    ],
  },
];

function UserSidebar() {
  const { logout } = useAuth();
  
  // 인증 체크 로직 삭제: 단순히 현재 로그인 여부만 판단
  const isLoggedIn = !!sessionStorage.getItem("accessToken");
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();


  return (
    <>
      <style>{`
        .sidebar-root {
          width: 300px;
          min-height: 100vh;
          background: #ffffff;
          border-right: 1px solid #e9ecef;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          overflow-y: auto;
        }

        /* ── 로고 ── */
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 28px 24px 22px;
          border-bottom: 1px solid #f1f3f5;
        }
        .sidebar-logo-icon {
          width: 46px;
          height: 46px;
          border-radius: 13px;
          background: #1971c2;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }
        .sidebar-logo-text {
          line-height: 1.25;
        }
        .sidebar-logo-text .brand {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1a1a2e;
          letter-spacing: 0.3px;
        }
        .sidebar-logo-text .tagline {
          font-size: 0.82rem;
          color: #868e96;
          font-weight: 400;
        }

        /* ── 섹션 ── */
        .sidebar-nav {
          flex: 1;
          padding: 16px 14px 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-section {
          margin-bottom: 6px;
        }
        .sidebar-section-label {
          font-size: 0.73rem;
          font-weight: 600;
          color: #adb5bd;
          text-transform: uppercase;
          letter-spacing: 0.9px;
          padding: 12px 10px 6px;
        }

        /* ── 홈 링크 ── */
        .sidebar-home-link {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 11px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: #495057;
          font-size: 1rem;
          font-weight: 500;
          transition: background 0.15s, color 0.15s;
          margin-bottom: 4px;
        }
        .sidebar-home-link:hover {
          background: #f1f3f5;
          color: #1a1a2e;
          text-decoration: none;
        }
        .sidebar-home-link.active {
          background: #e7f5ff;
          color: #1971c2;
          font-weight: 600;
        }
        .sidebar-home-link .nav-icon-wrap {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f3f5;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .sidebar-home-link.active .nav-icon-wrap {
          background: #d0ebff;
        }

        /* ── 개별 nav 아이템 ── */
        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 11px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: #495057;
          font-size: 1rem;
          font-weight: 500;
          transition: background 0.15s, color 0.15s;
          position: relative;
        }
        .sidebar-nav-item:hover {
          background: #f1f3f5;
          color: #1a1a2e;
          text-decoration: none;
        }
        .sidebar-nav-item.active {
          background: #e7f5ff;
          color: #1971c2;
          font-weight: 600;
        }
        .sidebar-nav-item.active .nav-chevron {
          opacity: 1;
        }
        .nav-chevron {
          margin-left: auto;
          opacity: 0;
          transition: opacity 0.15s;
          color: #74c0fc;
        }
        .nav-icon-wrap {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f3f5;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .sidebar-nav-item.active .nav-icon-wrap {
          background: #d0ebff;
        }
        .sidebar-nav-item:hover .nav-icon-wrap {
          background: #e9ecef;
        }

        /* ── 구분선 ── */
        .sidebar-divider {
          height: 1px;
          background: #f1f3f5;
          margin: 10px 8px;
        }

        /* ── 관리자 링크 ── */
        .admin-link {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 11px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: #5c7cfa;
          font-size: 1rem;
          font-weight: 600;
          background: #edf2ff;
          transition: background 0.15s, color 0.15s;
        }
        .admin-link:hover {
          background: #dbe4ff;
          color: #3b5bdb;
          text-decoration: none;
        }
        .admin-link .nav-icon-wrap {
          background: #dbe4ff;
        }

        /* ── 하단 영역 ── */
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid #f1f3f5;
          margin-top: auto;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 12px 16px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid #dee2e6;
          color: #868e96;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .logout-btn:hover {
          background: #fff5f5;
          border-color: #ffc9c9;
          color: #e03131;
        }

        .login-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 12px 16px;
          border-radius: 10px;
          background: #1971c2;
          border: none;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s;
        }
        .login-btn:hover {
          background: #1864ab;
          color: #fff;
          text-decoration: none;
        }
      `}</style>

      <div className="sidebar-root">
        {/* 로고 */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <BsBusFrontFill size={24} />
          </div>
          <div className="sidebar-logo-text">
            <div className="brand">BusTayo</div>
            <div className="tagline">스마트 버스 플랫폼</div>
          </div>
        </div>
        {/* 네비게이션 */}
        <nav className="sidebar-nav">
          {/* 홈 */}
          <NavLink
            to="/home"
            className={({ isActive }) =>
              "sidebar-home-link" + (isActive ? " active" : "")
            }
          >
            <div className="nav-icon-wrap">
              <BsHouseFill size={17} />
            </div>
            <span>홈</span>
          </NavLink>

          <div className="sidebar-divider" />

          {/* 섹션별 메뉴 */}
          {NAV_SECTIONS.map((section) => (
            <div className="sidebar-section" key={section.label}>
              <div className="sidebar-section-label">{section.label}</div>
              {section.items.map(({ to, icon: Icon, label }) =>
                to === "/route" ? (
                  <div
                    key={to}
                    className="sidebar-nav-item"
                    onClick={() =>
                      navigate("/route", {
                        replace: true,
                        state: {
                          reset: Date.now(),
                        },
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <div className="nav-icon-wrap">
                      <Icon size={17} />
                    </div>
                    <span>{label}</span>
                    <BsChevronRight size={13} className="nav-chevron" />
                  </div>
                ) : (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      "sidebar-nav-item" + (isActive ? " active" : "")
                    }
                  >
                    <div className="nav-icon-wrap">
                      <Icon size={17} />
                    </div>
                    <span>{label}</span>
                    <BsChevronRight size={13} className="nav-chevron" />
                  </NavLink>
                ),
              )}
            </div>
          ))}

          {/* 관리자 */}
          {role === "ROLE_ADMIN" && (
            <>
              <div className="sidebar-divider" />
              <NavLink to="/admin" className="admin-link">
                <div className="nav-icon-wrap">
                  <BsShieldLockFill size={17} />
                </div>
                <span>관리자 페이지</span>
                <BsChevronRight
                  size={13}
                  style={{ marginLeft: "auto", opacity: 0.5 }}
                />
              </NavLink>
            </>
          )}
        </nav>

        {/* 하단 버튼 */}
        <div className="sidebar-footer">
          {role ? (
            <button className="logout-btn" onClick={logout}>
              <BsBoxArrowRight size={16} />
              로그아웃
            </button>
          ) : (
            <Link to="/login" className="login-btn">
              로그인
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default UserSidebar;
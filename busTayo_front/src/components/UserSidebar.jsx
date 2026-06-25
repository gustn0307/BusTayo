import { NavLink, Link, useNavigate } from "react-router-dom";
import { Nav, Card, Button } from "react-bootstrap";
import { PiMegaphoneSimpleThin } from "react-icons/pi";
import {
  BsBusFront,
  BsHouse,
  BsGeoAlt,
  BsSignpost,
  BsBell,
  BsStar,
  BsPerson,
  BsChatDots,
  BsBriefcase,
  BsShieldLock,
  BsClockHistory,
} from "react-icons/bs";

function UserSidebar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    alert("로그아웃 되었습니다.");
    navigate("/home");
    window.location.reload();
  };

  // 💡 중복되는 NavLink 스타일을 한 곳에서 깔끔하게 관리합니다.
  const getNavLinkStyle = ({ isActive }) => ({
    backgroundColor: isActive ? "#0d6efd" : "transparent",
    color: isActive ? "#ffffff" : "#495057",
    fontWeight: isActive ? "600" : "500",
    transition: "all 0.2s ease-in-out",
  });

  return (
    <div
      className="bg-white border-end d-flex flex-column"
      style={{
        width: "280px",
        minHeight: "100vh",
        padding: "24px 20px",
        position: "sticky",
        top: 0,
      }}
    >
      {/* 🚀 상단 로고 영역: 그라데이션으로 더욱 세련되게 */}
      <Card 
        className="border-0 mb-4 overflow-hidden" 
        style={{ 
          background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(13, 110, 253, 0.15)"
        }}
      >
        <Card.Body className="p-3 text-white text-center text-sm-start">
          <h4 className="fw-black mb-1 d-flex align-items-center justify-content-center justify-content-sm-start gap-2">
            <BsBusFront size={22} />
            <span style={{ letterSpacing: "1px" }}>BUS TAYO</span>
          </h4>
          <small className="text-white-50 fw-light">스마트 버스 플랫폼</small>
        </Card.Body>
      </Card>

      {/* 📜 메뉴 리스트 영역 */}
      <Nav className="flex-column gap-1 flex-grow-1 custom-sidebar-nav">
        {/* 기본 홈 */}
        <Nav.Link
          as={NavLink}
          to="/home"
          className="rounded-3 py-2.5 px-3 d-flex align-items-center gap-2"
          style={getNavLinkStyle}
        >
          <BsHouse size={18} className="nav-icon" />
          <span>홈</span>
        </Nav.Link>

        {/* 섹션: 버스 서비스 */}
        <div className="mt-3 mb-1 text-muted fw-bold px-3" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
          버스 서비스
        </div>

        <Nav.Link
          as={NavLink}
          to="/nearby"
          className="rounded-3 py-2.5 px-3 d-flex align-items-center gap-2"
          style={getNavLinkStyle}
        >
          <BsGeoAlt size={18} className="nav-icon" />
          <span>내 주변 검색</span>
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/route"
          className="rounded-3 py-2.5 px-3 d-flex align-items-center gap-2"
          style={getNavLinkStyle}
        >
          <BsSignpost size={18} className="nav-icon" />
          <span>길찾기</span>
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/alarm"
          className="rounded-3 py-2.5 px-3 d-flex align-items-center gap-2"
          style={getNavLinkStyle}
        >
          <BsBell size={18} className="nav-icon" />
          <span>승하차 알림</span>
        </Nav.Link>

        {/* 섹션: 내 정보 */}
        <div className="mt-3 mb-1 text-muted fw-bold px-3" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
          내 정보
        </div>

        <Nav.Link
          as={NavLink}
          to="/favorite"
          className="rounded-3 py-2.5 px-3 d-flex align-items-center gap-2"
          style={getNavLinkStyle}
        >
          <BsStar size={18} className="nav-icon" />
          <span>즐겨찾기</span>
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/mypage"
          className="rounded-3 py-2.5 px-3 d-flex align-items-center gap-2"
          style={getNavLinkStyle}
        >
          <BsPerson size={18} className="nav-icon" />
          <span>마이페이지</span>
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/history"
          className="rounded-3 py-2.5 px-3 d-flex align-items-center gap-2"
          style={getNavLinkStyle}
        >
          <BsClockHistory size={18} className="nav-icon" />
          <span>이용 내역</span>
        </Nav.Link>

        {/* 섹션: 커뮤니티 */}
        <div className="mt-3 mb-1 text-muted fw-bold px-3" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
          커뮤니티
        </div>

        <Nav.Link
          as={NavLink}
          to="/board"
          className="rounded-3 py-2.5 px-3 d-flex align-items-center gap-2"
          style={getNavLinkStyle}
        >
          <BsChatDots size={18} className="nav-icon" />
          <span>자유게시판</span>
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/lostfound"
          className="rounded-3 py-2.5 px-3 d-flex align-items-center gap-2"
          style={getNavLinkStyle}
        >
          <BsBriefcase size={18} className="nav-icon" />
          <span>분실물 찾기</span>
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/notice"
          className="rounded-3 py-2.5 px-3 d-flex align-items-center gap-2"
          style={getNavLinkStyle}
        >
          <PiMegaphoneSimpleThin size={18} className="nav-icon" />
          <span>공지사항</span>
        </Nav.Link>

        {/* 관리자 특수 버튼 */}
        {role === "ROLE_ADMIN" && (
          <Button
            as={NavLink}
            to="/admin"
            variant="outline-primary"
            className="mt-3 rounded-3 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold"
            style={{ fontSize: "0.9rem" }}
          >
            <BsShieldLock size={16} />
            관리자 페이지
          </Button>
        )}
      </Nav>

      {/* 🚪 하단 인증 영역 (로그인/로그아웃) */}
      <div className="mt-4 pt-3 border-top">
        {role ? (
          <Button 
            variant="light" 
            className="w-100 rounded-3 fw-semibold text-danger border-0 py-2.5"
            style={{ backgroundColor: "#fff5f5", transition: "all 0.2s" }}
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        ) : (
          <Button 
            as={Link} 
            to="/login" 
            variant="primary" 
            className="w-100 rounded-3 fw-semibold py-2.5 shadow-sm"
          >
            로그인 하러가기
          </Button>
        )}
      </div>
    </div>
  );
}

export default UserSidebar;
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function UserSidebar() {
  const role = localStorage.getItem("role");

  return (
    <div className="sidebar">

      <h3>BUS TAYO</h3>

      <Nav className="flex-column">

        <Nav.Link as={Link} to="/">
          홈
        </Nav.Link>

        <Nav.Link as={Link} to="/favorite">
          즐겨찾기
        </Nav.Link>

        <Nav.Link as={Link} to="/nearby">
          내 주변 검색
        </Nav.Link>

        <Nav.Link as={Link} to="/route">
          길찾기
        </Nav.Link>

        <Nav.Link as={Link} to="/alarm">
          승하차 알림
        </Nav.Link>

        <Nav.Link as={Link} to="/lostfound">
          분실물 찾기
        </Nav.Link>

        <Nav.Link as={Link} to="/board">
          자유게시판
        </Nav.Link>

        <Nav.Link as={Link} to="/mypage">
          마이페이지
        </Nav.Link>

        {role === "ADMIN" && (
          <Nav.Link
            as={Link}
            to="/admin"
            className="fw-bold text-warning"
          >
            관리자 페이지
          </Nav.Link>
        )}
      </Nav>

    </div>
  );
}

export default UserSidebar;
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="sidebar">

      <h3>관리자</h3>

      <Nav className="flex-column">

        <Nav.Link as={Link} to="/admin/users">
          회원관리
        </Nav.Link>

        <Nav.Link as={Link} to="/admin/notices">
          공지사항 관리
        </Nav.Link>
        
        
        <Nav.Link as={Link} to="/board">
          자유게시판
        </Nav.Link>
        
        <Nav.Link as={Link} to="/admin/statistics">
          통계 관리
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/"
          className="text-warning"
        >
          사용자 페이지
        </Nav.Link>

      </Nav>

    </div>
  );
}

export default AdminSidebar;
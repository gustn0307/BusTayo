import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import {
  BsPeople,
  BsMegaphone,
  BsBarChart,
  BsArrowLeft,
} from "react-icons/bs";

function AdminSidebar() {
  return (
    <div
      className="bg-dark text-white"
      style={{
        width: "260px",
        minHeight: "100vh",
      }}
    >
      <div className="p-4 border-bottom">
        <h4>관리자</h4>
      </div>

      <Nav className="flex-column p-2">

        <Nav.Link
          as={Link}
          to="/admin/users"
          className="text-white"
        >
          <BsPeople className="me-2" />
          회원관리
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/admin/notices"
          className="text-white"
        >
          <BsMegaphone className="me-2" />
          공지사항 관리
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/admin/statistics"
          className="text-white"
        >
          <BsBarChart className="me-2" />
          통계
        </Nav.Link>

        <hr />

        <Nav.Link
          as={Link}
          to="/"
          className="text-warning"
        >
          <BsArrowLeft className="me-2" />
          사용자 페이지
        </Nav.Link>

      </Nav>
    </div>
  );
}

export default AdminSidebar;
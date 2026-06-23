import { Link } from "react-router-dom";
import { Nav, Card, Button } from "react-bootstrap";
import { MdAnnouncement } from "react-icons/md";
import { LuMegaphone } from "react-icons/lu";
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

  return (
    <div
      className="bg-white border-end"
      style={{
        width: "280px",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Card className="border-0 shadow-sm mb-4" bg="primary" text="white">
        <Card.Body>
          <h4 className="fw-bold mb-1">
            <BsBusFront className="me-2" />
            BUS TAYO
          </h4>

          <small>스마트 버스 서비스</small>
        </Card.Body>
      </Card>

      <Nav className="flex-column gap-2">
        <Nav.Link
          as={Link}
          to="/home"
          className="bg-primary text-white rounded-4 py-3 px-3"
        >
          <BsHouse className="me-2" />홈
        </Nav.Link>

        <div className="mt-3 text-secondary fw-bold small">버스 서비스</div>

        <Nav.Link
          as={Link}
          to="/nearby"
          className="bg-light rounded-4 py-3 px-3"
        >
          <BsGeoAlt className="text-primary me-2" />내 주변 검색
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/route"
          className="bg-light rounded-4 py-3 px-3"
        >
          <BsSignpost className="text-primary me-2" />
          길찾기
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/alarm"
          className="bg-light rounded-4 py-3 px-3"
        >
          <BsBell className="text-primary me-2" />
          승하차 알림
        </Nav.Link>

        <div className="mt-3 text-secondary fw-bold small">내 정보</div>

        <Nav.Link
          as={Link}
          to="/favorite"
          className="bg-light rounded-4 py-3 px-3"
        >
          <BsStar className="text-primary me-2" />
          즐겨찾기
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/mypage"
          className="bg-light rounded-4 py-3 px-3"
        >
          <BsPerson className="text-primary me-2" />
          마이페이지
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/history"
          className="bg-light rounded-4 py-3 px-3"
        >
          <BsClockHistory className="text-primary me-2" />
          이용 내역
        </Nav.Link>

        <div className="mt-3 text-secondary fw-bold small">커뮤니티</div>

        <Nav.Link
          as={Link}
          to="/board"
          className="bg-light rounded-4 py-3 px-3"
        >
          <BsChatDots className="text-primary me-2" />
          자유게시판
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/lostfound"
          className="bg-light rounded-4 py-3 px-3"
        >
          <BsBriefcase className="text-primary me-2" />
          분실물 찾기
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/notice"
          className="bg-light rounded-4 py-3 px-3"
        >
          <PiMegaphoneSimpleThin className="text-primary me-2" />
          공지사항
        </Nav.Link>

        {role === "ADMIN" && (
          <Button
            as={Link}
            to="/admin"
            variant="outline-primary"
            className="mt-4 rounded-4"
          >
            <BsShieldLock className="me-2" />
            관리자 페이지
          </Button>
        )}
      </Nav>
    </div>
  );
}

export default UserSidebar;

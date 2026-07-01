import { Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";

import {
  BsGeoAlt,
  BsSignpost,
  BsBell,
  BsStar,
  BsChatDots,
  BsMegaphone,
} from "react-icons/bs";

function Home() {
  const [recentNotices, setRecentNotices] = useState([]);

  useEffect(() => {
    api.get("/notice")
      .then(r => r.data)
      .then(data => {
        const sorted = [...data].reverse();
        setRecentNotices(sorted.slice(0, 3));
      })
      .catch(err => console.error("공지사항 조회 실패:", err));
  }, []);

  return (
    <div>
      {/* 인사말 */}

      <div className="mb-4">
        <h2 className="fw-bold">🚌 BUS TAYO</h2>

        <p className="text-secondary mb-0">
          실시간 버스 정보와 편리한 이동 서비스를 제공합니다.
        </p>
      </div>

      {/* 주요 기능 */}

      <Row className="g-3 mb-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <BsGeoAlt size={28} className="text-primary mb-3" />

              <h5>내 주변 검색</h5>

              <p className="text-secondary small">
                주변 정류장과 버스 정보를 확인하세요.
              </p>

              <Button as={Link} to="/nearby" variant="primary" size="sm">
                이동
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <BsSignpost size={28} className="text-primary mb-3" />

              <h5>길찾기</h5>

              <p className="text-secondary small">
                최적의 버스 경로를 찾아보세요.
              </p>

              <Button as={Link} to="/route" variant="primary" size="sm">
                이동
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <BsBell size={28} className="text-primary mb-3" />

              <h5>승하차 알림</h5>

              <p className="text-secondary small">
                목적지 도착 전 알림을 받을 수 있습니다.
              </p>

              <Button as={Link} to="/alarm" variant="primary" size="sm">
                이동
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <BsStar size={28} className="text-primary mb-3" />

              <h5>즐겨찾기</h5>

              <p className="text-secondary small">
                자주 이용하는 노선을 저장하세요.
              </p>

              <Button as={Link} to="/favorite" variant="primary" size="sm">
                이동
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* 이용 정보 */}

      <Row className="g-3 mb-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold mb-3">🚌 최근 이용 버스</h5>

              <div className="fs-4 fw-bold text-primary">720-3번</div>

              <div className="text-secondary">아주대학교 → 수원역</div>

              <small className="text-muted">2026-06-17 08:20</small>
            </Card.Body>
            <Button as={Link} to="/history" variant="outline-primary" size="sm">
              전체 보기
            </Button>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold mb-3">📊 이번 달 이용 통계</h5>

              <div className="fs-2 fw-bold text-success">18회</div>

              <div className="text-secondary">버스 이용</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* 공지사항 + 게시판 */}

      <Row className="g-3">
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold d-flex align-items-center">
              <div>
                <BsMegaphone className="me-2" />
                공지사항
              </div>
              <Button as={Link} to="/notice" variant="primary" 
              size="sm" className="ms-auto">이동</Button>
            </Card.Header>

            <ListGroup variant="flush">
                {recentNotices.length === 0 ? (
                <ListGroup.Item className="text-secondary">
                등록된 공지사항이 없습니다.
                </ListGroup.Item>
              ) : (
                recentNotices.map((notice) => (
                  <ListGroup.Item
                    key={notice.noticeId}
                    action
                    as={Link}
                    to={`/notice/${notice.noticeId}`}
                  >
                    {notice.noticeTitle}
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold">
              <BsChatDots className="me-2" />
              최근 게시글
            </Card.Header>

            <ListGroup variant="flush">
              <ListGroup.Item>버스 배차 간격 문의</ListGroup.Item>

              <ListGroup.Item>분실물 찾았습니다</ListGroup.Item>

              <ListGroup.Item>즐겨찾기 기능 좋네요</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;

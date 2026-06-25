import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Accordion,
  ListGroup,
  Badge
} from "react-bootstrap";
// 리액트 아이콘 설치 후 사용을 권장합니다 (npm i react-icons)
import { FiStar, FiFolder, FiPlus, FiTrash2, FiEye, FiMapPin, FiNavigation, FiBriefcase } from "react-icons/fi";
import favoriteData from "../data/favorites";

function Favorites() {

  // 타입별 배지와 아이콘을 함께 렌더링하는 함수
  const getBadge = (type) => {
    switch(type) {
      case "station":
        return (
          <Badge bg="primary" className="bg-opacity-10 text-primary px-2 py-1.5 align-middle fw-semibold">
            <FiMapPin className="me-1 mb-1" /> 정류장
          </Badge>
        );
      case "route":
        return (
          <Badge bg="warning" className="bg-opacity-10 text-warning px-2 py-1.5 align-middle fw-semibold">
            <FiNavigation className="me-1 mb-1" /> 길찾기
          </Badge>
        );
      case "place":
        return (
          <Badge bg="success" className="bg-opacity-10 text-success px-2 py-1.5 align-middle fw-semibold">
            <FiBriefcase className="me-1 mb-1" /> 편의시설
          </Badge>
        );
      default:
        return null;
    }
  };

  // 개별 즐겨찾기 아이템 컴포넌트
  const FavoriteItem = ({ item }) => {
    return (
      <ListGroup.Item
        className="d-flex justify-content-between align-items-center py-3 px-4 border-0 border-bottom bg-transparent transition-all"
        style={{ cursor: "pointer" }}
        // CSS hover 효과를 React inline 스타일이나 별도 CSS로 주면 좋지만, 간단히 클래스로 처리 가능합니다.
      >
        <div className="d-flex flex-column gap-1">
          <div>
            {getBadge(item.type)}
          </div>
          <div className="fs-5 fw-bold text-dark mt-1">
            {item.name}
          </div>
          <small className="text-secondary">
            {item.description}
          </small>
        </div>

        <div className="d-flex gap-2">
          <Button
            size="sm"
            variant="light"
            className="text-primary border-0 px-3 py-2 d-flex align-items-center gap-1 fw-medium"
          >
            <FiEye size={14} /> 보기
          </Button>
          <Button
            size="sm"
            variant="light"
            className="text-danger border-0 px-3 py-2 d-flex align-items-center gap-1 fw-medium"
          >
            <FiTrash2 size={14} /> 삭제
          </Button>
        </div>
      </ListGroup.Item>
    );
  };

  return (
    <Container className="py-5" style={{ maxWidth: "800px" }}>
      
      {/* 상단 타이틀 섹션 */}
      <Row className="mb-5 align-items-center">
        <Col>
          <h2 className="fw-extrabold text-dark d-flex align-items-center gap-2 m-0">
            <FiStar className="text-warning fill-warning" /> 즐겨찾기
          </h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" className="shadow-sm px-4 py-2 d-flex align-items-center gap-2 fw-semibold rounded-pill">
            <FiPlus strokeWidth={2.5} /> 새 그룹 추가
          </Button>
        </Col>
      </Row>

      {/* 그룹 없음 섹션 */}
      {favoriteData.ungrouped.length > 0 && (
        <Card className="border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
          <Card.Header className="bg-white border-bottom py-3 px-4 fw-bold text-secondary d-flex align-items-center gap-2">
            <span className="bg-light p-1.5 rounded-circle d-inline-flex">📌</span> 그룹 미지정 항목
          </Card.Header>
          <ListGroup variant="flush">
            {favoriteData.ungrouped.map(item => (
              <FavoriteItem key={item.id} item={item} />
            ))}
          </ListGroup>
        </Card>
      )}

      {/* 즐겨찾기 그룹 섹션 */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <FiFolder size={20} className="text-secondary" />
        <h5 className="fw-bold text-secondary m-0">내 즐겨찾기 그룹</h5>
      </div>

      <Accordion className="shadow-sm rounded-4 overflow-hidden custom-accordion">
        {favoriteData.groups.map((group, index) => (
          <Accordion.Item
            key={group.id}
            eventKey={index.toString()}
            className="border-0 border-bottom last-border-0"
          >
            <Accordion.Header className="py-1">
              <span className="fw-bold text-dark fs-5">{group.name}</span>
              <Badge bg="light" className="text-secondary ms-2 rounded-pill fw-normal px-2">
                {group.items.length}
              </Badge>
            </Accordion.Header>

            <Accordion.Body className="p-0 bg-light bg-opacity-25">
              <ListGroup variant="flush">
                {group.items.map(item => (
                  <FavoriteItem key={item.id} item={item} />
                ))}
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

    </Container>
  );
}

export default Favorites;
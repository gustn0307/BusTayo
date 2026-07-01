import { useEffect, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Accordion,
  ListGroup,
  Badge,
} from "react-bootstrap";

import { FiStar, FiFolder, FiPlus } from "react-icons/fi";

import FavoriteItem from "../components/favorites/FavoriteItem";
import api from "../api";

function Favorites() {
  const [favoriteData, setFavoriteData] = useState({
    ungrouped: [],
    groups: [],
  });

  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  // 즐겨찾기 전체 조회
  const loadFavorites = async () => {
    try {
      const res = await api.get("/api/favorites");
      setFavoriteData(res.data);
    } catch (e) {
      console.error("즐겨찾기 조회 실패", e);
    }
  };

  // 새 그룹 생성
  const createGroup = async () => {
    const name = prompt("새 그룹 이름을 입력하세요");
    if (!name) return;

    try {
      await api.post("/api/favorites/group", { name });
      alert("그룹이 추가되었습니다.");
      loadFavorites();
    } catch (e) {
      console.error("그룹 생성 실패", e);
      alert("그룹 생성 실패");
    }
  };

  // 그룹 삭제
  const deleteGroup = async (id) => {
    if (!window.confirm("그룹을 삭제할까요?")) return;

    try {
      await api.delete(`/api/favorites/group/${id}`);
      alert("삭제되었습니다");
      loadFavorites();
    } catch (e) {
      console.error("그룹 삭제 실패", e);
    }
  };

  // [추가] 즐겨찾기 그룹 이동
  // - itemId: 이동할 즐겨찾기 ID
  // - targetGroupId: 이동할 대상 그룹 ID
  // - API 재호출 없이 state를 직접 수정해서 화면 즉시 갱신
  const moveItem = (itemId, targetGroupId) => {
    setFavoriteData((prev) => {
      let movedItem = null;

      // ungrouped에서 해당 아이템 제거
      const newUngrouped = prev.ungrouped.filter((i) => {
        if (i.id === itemId) {
          movedItem = { ...i, groupId: targetGroupId };
          return false;
        }
        return true;
      });

      // 기존 그룹들에서 해당 아이템 제거
      const newGroups = prev.groups.map((g) => ({
        ...g,
        items: g.items.filter((i) => {
          if (i.id === itemId) {
            movedItem = { ...i, groupId: targetGroupId };
            return false;
          }
          return true;
        }),
      }));

      // 대상 그룹에 아이템 추가
      return {
        ungrouped: newUngrouped,
        groups: newGroups.map((g) =>
          g.id === targetGroupId
            ? { ...g, items: [...g.items, movedItem] }
            : g
        ),
      };
    });
  };

  // 즐겨찾기 삭제
  // - API 재호출 없이 state에서 직접 제거해서 화면 즉시 갱신
  const deleteItem = (itemId) => {
    setFavoriteData((prev) => ({
      ungrouped: prev.ungrouped.filter((i) => i.id !== itemId),
      groups: prev.groups.map((g) => ({
        ...g,
        items: g.items.filter((i) => i.id !== itemId),
      })),
    }));
  };

  return (
    <Container className="py-5" style={{ maxWidth: "800px" }}>
      <Row className="mb-5 align-items-center">
        <Col>
          <h2 className="fw-extrabold text-dark d-flex align-items-center gap-2 m-0">
            <FiStar className="text-warning fill-warning" />
            즐겨찾기
          </h2>
        </Col>

        <Col xs="auto">
          <Button
            variant="primary"
            onClick={createGroup}
            className="shadow-sm px-4 py-2 d-flex align-items-center gap-2 fw-semibold rounded-pill"
          >
            <FiPlus strokeWidth={2.5} />새 그룹 추가
          </Button>
        </Col>
      </Row>

      {/* 그룹 없는 즐겨찾기 */}
      {favoriteData.ungrouped.length > 0 && (
        <Card className="border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
          <Card.Header className="bg-white border-bottom py-3 px-4 fw-bold text-secondary">
            📌 그룹 미지정 항목
          </Card.Header>

          <ListGroup variant="flush">
            {favoriteData.ungrouped.map((item) => (
              // groups prop: 이동 드롭다운에 표시할 전체 그룹 목록
              // onDelete: 삭제 시 state 즉시 갱신
              // onMove: 그룹 이동 시 state 즉시 갱신
              <FavoriteItem
                key={item.id}
                item={item}
                onDelete={deleteItem}
                onMove={moveItem}
                groups={favoriteData.groups}
              />
            ))}
          </ListGroup>
        </Card>
      )}

      <div className="d-flex align-items-center gap-2 mb-3">
        <FiFolder size={20} className="text-secondary" />
        <h5 className="fw-bold text-secondary m-0">내 즐겨찾기 그룹</h5>
      </div>

      <Accordion className="shadow-sm rounded-4 overflow-hidden">
        {favoriteData.groups.map((group, index) => (
          <Accordion.Item key={group.id} eventKey={index.toString()}>
            <div className="d-flex align-items-center">
              <Accordion.Header className="flex-grow-1">
                <span className="fw-bold">{group.name}</span>
              </Accordion.Header>

              <Button
                size="sm"
                variant="outline-danger"
                className="me-3"
                onClick={() => deleteGroup(group.id)}
              >
                삭제
              </Button>
            </div>

            <Accordion.Body className="p-0">
              <ListGroup variant="flush">
                {group.items.map((item) => (
                  // groups prop: 이동 드롭다운에 표시할 전체 그룹 목록
                  // onDelete: 삭제 시 state 즉시 갱신
                  // onMove: 그룹 이동 시 state 즉시 갱신
                  <FavoriteItem
                    key={item.id}
                    item={item}
                    onDelete={deleteItem}
                    onMove={moveItem}
                    groups={favoriteData.groups}
                  />
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

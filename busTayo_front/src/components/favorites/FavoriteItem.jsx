import { ListGroup, Button, Badge, Dropdown } from "react-bootstrap";
import { FiNavigation, FiEye, FiTrash2, FiMove } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api";

// [추가] props 설명
// - item: 즐겨찾기 데이터
// - onDelete: 삭제 후 부모(Favorite.jsx)에서 목록 갱신하는 콜백
// - onMove: 그룹 이동 후 부모(Favorite.jsx)에서 목록 갱신하는 콜백
// - groups: 전체 그룹 목록 (이동 대상 목록 표시에 사용)
function FavoriteItem({ item, onDelete, onMove, groups }) {
  const navigate = useNavigate();

  // 아이템 클릭 시 길찾기 페이지로 이동 (출발지/도착지 자동 입력)
  const handleClick = () => {
    navigate("/route", {
  state: {
    favorite: {
      start: item.start,
      startX: item.startX,
      startY: item.startY,
      end: item.end,
      endX: item.endX,
      endY: item.endY,
    },
  },
});
  };

  // 보기 버튼 클릭 시 길찾기 페이지로 이동
  const handleView = (e) => {
    e.stopPropagation(); // 부모 ListGroup.Item onClick 전파 방지
    navigate("/route", {
  state: {
    favorite: {
      start: item.start,
      startX: item.startX,
      startY: item.startY,
      end: item.end,
      endX: item.endX,
      endY: item.endY,
    },
  },
});
  };

  // [추가] 그룹 이동 처리
  // - targetGroupId: 이동할 대상 그룹 ID
  // - API 호출 성공 시 onMove 콜백으로 부모에 알려서 화면 즉시 갱신
  const handleMove = async (e, targetGroupId) => {
    e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
    try {
      await api.patch(`/api/favorites/navigating/${item.id}/group`, {
        groupId: targetGroupId,
      });
      // 부모 Favorite.jsx의 moveItem 호출 → state 즉시 업데이트
      if (onMove) onMove(item.id, targetGroupId);
    } catch (error) {
      console.error("그룹 이동 실패", error);
      alert("그룹 이동에 실패했습니다.");
    }
  };

  // 삭제 버튼 클릭 시 확인 후 API 호출
  const handleDelete = async (e) => {
    e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
    if (!window.confirm("즐겨찾기를 삭제할까요?")) return;
    try {
      await api.delete(`/api/favorites/navigating/${item.id}`);
      // 부모 Favorite.jsx의 deleteItem 호출 → state에서 즉시 제거
      if (onDelete) onDelete(item.id);
    } catch (error) {
      console.error("삭제 실패", error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <ListGroup.Item
      onClick={handleClick}
      className="d-flex justify-content-between align-items-center py-3 px-4 border-0 border-bottom bg-transparent"
      style={{ cursor: "pointer" }}
    >
      <div className="d-flex flex-column gap-1">
        <div>
          <Badge
            bg="warning"
            className="bg-opacity-10 text-warning px-2 py-1 fw-semibold"
          >
            <FiNavigation className="me-1 mb-1" />
            길찾기
          </Badge>
        </div>

        <div className="fs-5 fw-bold text-dark">{item.name}</div>

        {item.description && (
          <small className="text-secondary">{item.description}</small>
        )}
      </div>

      <div className="d-flex gap-2">
        {/* 보기 버튼: 길찾기 페이지로 이동 */}
        <Button
          size="sm"
          variant="light"
          onClick={handleView}
          className="text-primary border-0 d-flex align-items-center gap-1"
        >
          <FiEye size={14} />
          보기
        </Button>

        {/* [추가] 그룹 이동 드롭다운
            - groups가 있을 때만 표시
            - 현재 속한 그룹(item.groupId)은 목록에서 제외
        */}
        {groups && groups.length > 0 && (
          <Dropdown onClick={(e) => e.stopPropagation()}>
            <Dropdown.Toggle
              size="sm"
              variant="light"
              className="text-secondary border-0 d-flex align-items-center gap-1"
            >
              <FiMove size={14} />
              이동
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {groups
                .filter((g) => g.id !== item.groupId) // 현재 그룹 제외
                .map((g) => (
                  <Dropdown.Item
                    key={g.id}
                    onClick={(e) => handleMove(e, g.id)}
                  >
                    {g.name}
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
        )}

        {/* 삭제 버튼 */}
        <Button
          size="sm"
          variant="light"
          onClick={handleDelete}
          className="text-danger border-0 d-flex align-items-center gap-1"
        >
          <FiTrash2 size={14} />
          삭제
        </Button>
      </div>
    </ListGroup.Item>
  );
}

export default FavoriteItem;

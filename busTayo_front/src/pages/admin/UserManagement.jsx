import { useEffect, useState } from "react";
import { Card, Row, Col, Table, Button, Form, Badge, InputGroup } from "react-bootstrap";
import { FiSearch, FiUserCheck, FiUserX, FiShield, FiTrash2 } from "react-icons/fi"; // 아이콘 라이브러리 추가 권장

import api from "../../api";

function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 검색 필터
  const filteredUsers = users.filter((user) =>
    user.userId.toLowerCase().includes(search.toLowerCase())
  );

  // 회원 삭제
  const handleDeleteUser = async (id) => {
    if (!window.confirm("정말 이 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    try {
      await api.delete(`/admin/users/${id}`);
      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  // 관리자 권한 변경
  const handleRoleChange = async (user) => {
    const nextRole = user.role === "ROLE_ADMIN" ? "ROLE_USER" : "ROLE_ADMIN";

    if (!window.confirm(`${user.userId} 회원님을 ${nextRole === "ROLE_ADMIN" ? "관리자" : "일반 회원"}으로 변경하시겠습니까?`)) {
      return;
    }

    try {
      await api.put(`/admin/users/${user.id}/role`, {
        role: nextRole,
      });
      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  // 게시판 차단/허용
  const handleStatusChange = async (user, status) => {
    if (
      !window.confirm(
        status === "APPROVED"
          ? "게판 이용을 허용하시겠습니까?"
          : "게시판 이용을 차단하시겠습니까?"
      )
    ) {
      return;
    }

    try {
      await api.put(`/admin/users/${user.id}/status`, status);
      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const totalUsers = users.length;
  const adminUsers = users.filter((user) => user.role === "ROLE_ADMIN").length;
  const normalUsers = users.filter((user) => user.role === "ROLE_USER").length;

  return (
    <div className="py-2">
      <h2 className="mb-4 fw-bold text-dark">👤 회원 관리 시스템</h2>

      {/* 상단 요약 카드 Section */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 border-start border-primary border-4">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1 fw-bold">전체 회원</h6>
                <h3 className="fw-bold mb-0 text-primary">{totalUsers} 명</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 border-start border-success border-4">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1 fw-bold">관리자 계정</h6>
                <h3 className="fw-bold mb-0 text-success">{adminUsers} 명</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 border-start border-info border-4">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1 fw-bold">일반 회원</h6>
                <h3 className="fw-bold mb-0 text-info">{normalUsers} 명</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 검색 및 필터 컨트롤 바 */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-3">
          <Row className="align-items-center">
            <Col md={6} lg={4}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0 text-muted">
                  <FiSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  className="border-start-0 ps-0"
                  placeholder="이메일 주소로 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col className="text-end text-muted mt-2 mt-md-0" style={{ fontSize: "0.9rem" }}>
              검색 결과: <b>{filteredUsers.length}</b>건
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 회원 리스트 테이블 */}
      <Card className="shadow-sm border-0 overflow-hidden">
        <Table responsive hover className="align-middle mb-0">
          <thead className="table-light text-uppercase fs-7 fw-bold border-bottom">
            <tr>
              <th className="py-3 ps-4" style={{ width: "80px" }}>ID</th>
              <th className="py-3">이메일</th>
              <th className="py-3" style={{ width: "130px" }}>권한</th>
              <th className="py-3" style={{ width: "120px" }}>게시판 상태</th>
              <th className="py-3 text-center" style={{ width: "360px" }}>작업 관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="ps-4 text-muted fw-mono">{user.id}</td>
                  <td>
                    <span className="fw-semibold text-dark">{user.userId}</span>
                  </td>
                  <td>
                    {user.role === "ROLE_ADMIN" ? (
                      <Badge bg="success-subtle" text="success" className="px-2.5 py-1.5 border border-success-subtle">
                        👑 관리자
                      </Badge>
                    ) : (
                      <Badge bg="secondary-subtle" text="secondary" className="px-2.5 py-1.5 border border-secondary-subtle">
                        👤 일반
                      </Badge>
                    )}
                  </td>
                  <td>
                    {user.status === "APPROVED" ? (
                      <Badge bg="info-subtle" text="info" className="px-2.5 py-1.5">
                        정상 이용
                      </Badge>
                    ) : (
                      <Badge bg="danger-subtle" text="danger" className="px-2.5 py-1.5">
                        이용 제한
                      </Badge>
                    )}
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-1.5">
                      <Button
                        variant={user.role === "ROLE_ADMIN" ? "outline-secondary" : "outline-primary"}
                        size="sm"
                        className="d-flex align-items-center gap-1 fw-medium"
                        onClick={() => handleRoleChange(user)}
                      >
                        <FiShield size={14} />
                        {user.role === "ROLE_ADMIN" ? "권한 해제" : "관리자 임명"}
                      </Button>

                      {user.status === "APPROVED" ? (
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="d-flex align-items-center gap-1 fw-medium"
                          onClick={() => handleStatusChange(user, "PENDING")}
                        >
                          <FiUserX size={14} />
                          차단
                        </Button>
                      ) : (
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="d-flex align-items-center gap-1 fw-medium"
                          onClick={() => handleStatusChange(user, "APPROVED")}
                        >
                          <FiUserCheck size={14} />
                          해제
                        </Button>
                      )}

                      <Button
                        variant="danger"
                        size="sm"
                        className="d-flex align-items-center gap-1 fw-medium"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <FiTrash2 size={14} />
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted py-5">
                  일치하는 회원이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

export default UserManagement;
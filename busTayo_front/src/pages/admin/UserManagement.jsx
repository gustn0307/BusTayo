import { useEffect, useState } from "react";
import { Card, Row, Col, Table, Button } from "react-bootstrap";
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
    user.userId.toLowerCase().includes(search.toLowerCase()),
  );

  // 회원 삭제
  const handleDeleteUser = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
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

    if (!window.confirm(`${nextRole} 으로 변경하시겠습니까?`)) {
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
          ? "게시판 이용을 허용하시겠습니까?"
          : "게시판 이용을 차단하시겠습니까?",
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
    <>
      <h2 className="mb-4">회원 관리</h2>

      {/* 검색창 추가 */}

      <input
        type="text"
        className="form-control mb-3"
        placeholder="이메일 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <h6>전체 회원</h6>
              <h3>{totalUsers}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <h6>관리자</h6>
              <h3>{adminUsers}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <h6>일반 회원</h6>
              <h3>{normalUsers}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>이메일</th>
            <th>권한</th>
            <th>게시판</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>

              <td>{user.userId}</td>

              <td>{user.role}</td>

              <td>{user.status === "APPROVED" ? "가능" : "제한"}</td>

              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleRoleChange(user)}
                >
                  {user.role === "ROLE_ADMIN" ? "관리자 해제" : "관리자 지정"}
                </Button>

                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  disabled={user.status === "PENDING"}
                  onClick={() => handleStatusChange(user, "PENDING")}
                >
                  차단
                </Button>

                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  disabled={user.status === "APPROVED"}
                  onClick={() => handleStatusChange(user, "APPROVED")}
                >
                  허용
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default UserManagement;

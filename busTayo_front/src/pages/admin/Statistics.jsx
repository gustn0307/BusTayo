import { useEffect, useState } from "react";
import { Card, Row, Col, Table } from "react-bootstrap";

import api from "../../api";

function Statistics() {
  const [data, setData] = useState({});

  useEffect(() => {
    api.get("/admin/statistics").then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <>
      <h2 className="mb-4">관리자 통계</h2>

      <Row>
        <Stat title="전체 회원" value={data.totalUsers} />

        <Stat title="관리자" value={data.adminUsers} />

        <Stat title="일반 회원" value={data.normalUsers} />

        <Stat title="차단 회원" value={data.blockedUsers} />
      </Row>

      <Row className="mt-4">
        <Stat title="게시글" value={data.totalPosts} />

        <Stat title="댓글" value={data.totalComments} />

        <Stat title="공지" value={data.totalNotices} />
      </Row>

      <h4 className="mt-5">인기 노선</h4>

      <Table bordered>
        <thead>
          <tr>
            <th>노선</th>

            <th>조회수</th>
          </tr>
        </thead>

        <tbody>
          {data.popularRoutes?.map((route, index) => (
            <tr key={index}>
              <td>{route.routeName}</td>

              <td>{route.count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

function Stat({ title, value }) {
  return (
    <Col md={3}>
      <Card>
        <Card.Body>
          <h6>{title}</h6>

          <h3>{value ?? 0}</h3>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Statistics;

import { useEffect, useState } from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import api from "../../api";

// 파이 차트 및 바 차트에서 사용할 색상 테마
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

function Statistics() {
  const [data, setData] = useState({});

  useEffect(() => {
    api.get("/api/admin/statistics").then((res) => {
      setData(res.data);
    });
  }, []);

  // 1. 회원 현황 차트 데이터 변환 (전체 회원 제외)
  const memberChartData = [
    { name: "관리자", value: data.adminUsers || 0 },
    { name: "일반 회원", value: data.normalUsers || 0 },
    { name: "차단 회원", value: data.blockedUsers || 0 },
  ];

  // 2. 활동 현황 (게시글, 댓글, 공지) 차트 데이터 변환
  const activityChartData = [
    { name: "게시글", 개수: data.totalPosts || 0 },
    { name: "댓글", 개수: data.totalComments || 0 },
    { name: "공지", 개수: data.totalNotices || 0 },
  ];

  // 3. 인기 노선 차트 데이터 변환 (최대 5개만 표기 권장)
  const routeChartData = data.popularRoutes?.map((route) => ({
    name: route.routeName,
    조회수: route.count,
  })) || [];

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4 fw-bold">📊 관리자 통계 대시보드</h2>

      {/* 상단 요약 카드 Section */}
      <Row className="g-3">
        <Stat title="전체 회원" value={data.totalUsers} color="#0088FE" />
        <Stat title="관리자" value={data.adminUsers} color="#00C49F" />
        <Stat title="일반 회원" value={data.normalUsers} color="#FFBB28" />
        <Stat title="차단 회원" value={data.blockedUsers} color="#FF8042" />
      </Row>

      <Row className="g-3 mt-2">
        <Stat title="전체 게시글" value={data.totalPosts} color="#8884d8" />
        <Stat title="전체 댓글" value={data.totalComments} color="#82ca9d" />
        <Stat title="전체 공지" value={data.totalNotices} color="#ffc658" />
      </Row>

      {/* 중단 시각화 그래프 Section */}
      <Row className="mt-4 g-4">
        {/* 회원 비율 파이 차트 */}
        <Col lg={5}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title className="fw-bold mb-4">회원 구성 비율</Card.Title>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={memberChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {memberChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 활동 현황 바 차트 */}
        <Col lg={7}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title className="fw-bold mb-4">콘텐츠 생성 현황</Card.Title>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={activityChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="개수" fill="#8884d8" radius={[4, 4, 0, 0]}>
                      {activityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 하단 인기 노선 가로 바 차트 Section */}
      <Row className="mt-4">
        <Col id={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="fw-bold mb-4">🔥 인기 노선 순위</Card.Title>
              {routeChartData.length > 0 ? (
                <div style={{ width: "100%", height: 350 }}>
                  <ResponsiveContainer>
                    <BarChart
                      layout="vertical"
                      data={routeChartData}
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="조회수" fill="#00C49F" radius={[0, 4, 4, 0]} barSize={25} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-muted py-5">조회 데이터가 없습니다.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// 개선된 요약 카드 컴포넌트
function Stat({ title, value, color }) {
  return (
    <Col xs={12} sm={6} md={4} lg={3}>
      <Card className="shadow-sm border-0" style={{ borderLeft: `5px solid ${color || "#ccc"}` }}>
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: "0.85rem" }}>
              {title}
            </h6>
            <h3 className="fw-bold mb-0" style={{ color: "#333" }}>
              {value?.toLocaleString() ?? 0}
            </h3>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Statistics;
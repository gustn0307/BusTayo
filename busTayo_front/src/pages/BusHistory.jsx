import { Card, Table, Badge } from "react-bootstrap";

function BusHistory() {
  const history = [
    {
      id: 1,
      bus: "720-3",
      start: "아주대학교",
      end: "수원역",
      date: "2026-06-17 08:20",
    },
    {
      id: 2,
      bus: "3007",
      start: "수원역",
      end: "강남역",
      date: "2026-06-16 18:10",
    },
    {
      id: 3,
      bus: "13-4",
      start: "아주대학교",
      end: "영통역",
      date: "2026-06-15 13:40",
    },
  ];

  return (
    <div>
      <h2 className="fw-bold mb-4">
        🚌 이용 내역
      </h2>

      <Card className="border-0 shadow-sm">
        <Card.Body>

          <Table hover responsive>
            <thead>
              <tr>
                <th>노선</th>
                <th>출발</th>
                <th>도착</th>
                <th>이용일시</th>
                <th>상태</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.bus}</td>
                  <td>{item.start}</td>
                  <td>{item.end}</td>
                  <td>{item.date}</td>
                  <td>
                    <Badge bg="success">
                      이용완료
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

        </Card.Body>
      </Card>
    </div>
  );
}

export default BusHistory;
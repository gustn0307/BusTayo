import { useEffect, useState } from "react";
import api from "../../api";
import { Container, Table } from "react-bootstrap";
import "./Board.css";
import { useNavigate } from "react-router-dom";

function Board() {
  // 게시글 데이터 불러오기
  const [list, setlist] = useState([]);
  // 페이징 처리
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  // 게시글 상세 페이지로 가기
  const navigate = useNavigate();
  // 작성자 *표시
  const maskUserId = (userId) => {
    const id = userId.split("@")[0];
    return id[0] + "*".repeat(id.length - 1);
  };

  useEffect(() => {
    console.log("현재 페이지:", currentPage);
    api
      .get(`/api/board?page=${currentPage}&size=10`)
      .then((res) => {
        console.log("받아온 데이터:", res.data);
        setlist(res.data.content);
        setTotalPages(res.data.totalPages); // 전체 페이지 수 저장
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentPage]); // 페이지 바뀔 때마다 새로 요청

  // 게시글 전체 조회
  return (
    <div className="board-container">
      <h1>자유게시판</h1>
      <h3>버스타요 이용과 관련한 자유로운 의견을 나눠주세요.</h3>
      <div className="board-header">
        <button className="btn-write" onClick={() => navigate("/board/write")}>
          글쓰기
        </button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map((list) => (
              <tr key={list.id}>
                <td>{list.id}</td>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/board/${list.id}`)} // 게시글 상세 페이지
                >
                  {list.title}
                </td>
                <td>{maskUserId(list.userId)} {/* 작성자 *표시 */} </td> 
                <td>{list.createdAt.slice(0, 10)} {/* 작성일 축소 */} </td> 
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">등록된 게시글이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 페이지 버튼 */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              이전
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setCurrentPage(i)}>
                {i + 1}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              다음
            </button>
          </li>
        </ul>
      </nav>

      {/* 데이터 확인용 */}
      {/* <pre>{JSON.stringify(list, null, 2)}</pre> */}
    </div>
  );
}

export default Board;

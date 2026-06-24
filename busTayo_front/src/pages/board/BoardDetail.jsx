import { useEffect, useState } from "react";
import api from "../../api";
import { useParams, useNavigate } from "react-router-dom";
import "./BoardDetail.css";

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  // 게시글 상세 조회
  useEffect(() => {
    api
      .get(`/api/board/${id}`)
      .then((res) => {
        console.log("게시글 데이터:", res.data);
        setPost(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  // 댓글 조회
  useEffect(() => {
    api
      .get(`/api/board/${id}/comments`)
      .then((res) => {
        console.log("댓글 데이터:", res.data);
        setComments(res.data)
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!post) return <div>로딩중...</div>;

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      api.delete(`/api/board/${id}`)
        .then(() => {
          alert("삭제되었습니다.");
          navigate("/board");
        })
        .catch((err) => console.log(err));
    }
  };

  // 작성자 * 표시
  const maskUserId = (userId) => {
    const id = userId.split("@")[0];
    return id[0] + "*".repeat(id.length - 1);
  };

  return (
    <div className="board-detail-container">
      <h2 className="board-detail-title">{post.title}</h2>

      <div className="board-detail-meta">
        <span>작성자: {maskUserId(post.userId)}</span> {/* 작성자 *표시 */}
        <span>작성일: {post.createdAt.slice(0, 10)}</span> {/* 작성일 축소 */}
      </div>

      <p className="board-detail-content">{post.content}</p>

      {/* 버튼 */}
      <div className="board-detail-buttons">
        <button className="btn-list" onClick={() => navigate("/board")}>목록</button>
        <button
          className="btn-edit" onClick={() => navigate(`/board/${id}/edit`)}>수정</button>
        <button className="btn-delete" onClick={handleDelete}>삭제</button>
      </div>

      <div className="board-detail-comments">
        <h3>댓글 {comments.length}개</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-userId">{maskUserId(comment.userId)}</div> {/* 작성자 *표시 */}
              <div className="comment-content">{comment.content}</div>
              <div className="comment-createdAt">{comment.createdAt.slice(0, 10)}</div> {/* 작성일 축소 */}
            </div>
          ))
        ) : (
          <div className="comment-empty">첫 댓글을 작성해보세요!</div>
        )}

        <div className="comment-write">
          <textarea placeholder="댓글을 입력하세요" />
          <div className="comment-write-buttons">
            <button className="btn-comment-submit">작성</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardDetail;

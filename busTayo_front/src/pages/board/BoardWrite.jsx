import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "./BoardWrite.css";

function BoardWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    api
      .post("/api/board", { title, content})
      .then(() => {
        alert("게시글이 작성되었습니다.");
        navigate("/board");
      })
      .catch((err) => {
        console.log(err);
        alert("게시글 작성에 실패했습니다.");
      });
    };    

  return (
    <div className="board-write-container">
      <h2 className="board-write-title">게시글 작성</h2>

      <div className="board-write-field">
        <label>제목</label>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="board-write-field">
        <label>내용</label>
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="board-write-buttons">
        <button className="btn-cancel" onClick={() => navigate("/board")}>
          취소
        </button>
        <button className="btn-submit" onClick={handleSubmit}>
          작성
        </button>
      </div>
    </div>
  );
};


export default BoardWrite;

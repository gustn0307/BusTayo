import { useEffect, useState, useRef } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "./BoardWrite.css";

function BoardWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // 에디터
  const oEditors = useRef([]);

  const handleSubmit = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // 에디터에서 내용 꺼내기
    oEditors.current[0].exec("UPDATE_CONTENTS_FIELD", []);
    const editorContent = document.getElementById("editorTxt").value;
    
    api
      .post("/api/board", { title, content: editorContent })
      .then(() => {
        alert("게시글이 작성되었습니다.");
        navigate("/board");
      })
      .catch((err) => {
        console.log(err);
        alert("게시글 작성에 실패했습니다.");
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.nhn) {
        window.nhn.husky.EZCreator.createInIFrame({
          oAppRef: oEditors.current,
          elPlaceHolder: "editorTxt",
          sSkinURI: "/smarteditor2-2.8.2.3/SmartEditor2Skin.html",
          fCreator: "createSEditor2",
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
        <div id="smarteditor">
          <textarea
            id="editorTxt"
            name="editorTxt"
            rows="20"
            placeholder="내용을 입력하세요"
            style={{ width: "100%" }}
          />
        </div>
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
}

export default BoardWrite;

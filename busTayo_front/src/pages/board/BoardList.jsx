import { useEffect, useState } from "react";
import api from "../../api";

function BoardList() {
  const [list, setlist] = useState([]);

  useEffect(() => {
    api
      .get("/api/board")
      .then((res) => {
        console.log("받아온 데이터:", res.data);
        setlist(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1>게시글 목록</h1>
      <pre>{JSON.stringify(list, null, 2)}</pre>
    </div>
  );
}

export default BoardList;

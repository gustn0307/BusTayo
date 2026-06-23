import { useEffect, useState } from "react";
import api from "../api";

function Board() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api
    .get("/api/board")
    .then((res) => {
      console.log(res.data);
      setList(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div>
      <h1>데이터확인용</h1>
      <pre>
        {JSON.stringify(list, null, 2)}
      </pre>
    </div>
  );
}

export default Board;
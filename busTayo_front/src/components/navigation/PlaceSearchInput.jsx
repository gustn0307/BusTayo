import { useState } from "react";
import { Form, ListGroup } from "react-bootstrap";
import { loadKakaoMap } from "../../util/loadKakaoMap";

function PlaceSearchInput({ placeholder, onSelect }) {
  const [keyword, setKeyword] = useState("");

  const [results, setResults] = useState([]);

  const searchPlaces = (value) => {
    setKeyword(value);

    if (!value.trim()) {
      setResults([]);

      return;
    }

    loadKakaoMap().then((kakao) => {
      const ps = new kakao.maps.services.Places();

      ps.keywordSearch(value, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          setResults(data);
        }
      });
    });
  };

  return (
    <>
      <Form.Control
        value={keyword}
        placeholder={placeholder}
        onChange={(e) => searchPlaces(e.target.value)}
      />

      {results.length > 0 && (
        <ListGroup>
          {results.slice(0, 5).map((place) => (
            <ListGroup.Item
              key={place.id}
              action
              onClick={() => {
                setKeyword(place.place_name);

                setResults([]);

                onSelect({
                  name: place.place_name,

                  lat: Number(place.y),

                  lng: Number(place.x),
                });
              }}
            >
              {place.place_name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
}

export default PlaceSearchInput;

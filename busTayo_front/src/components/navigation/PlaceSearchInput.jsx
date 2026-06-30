import { useState, useEffect } from "react";
import { Form, ListGroup } from "react-bootstrap";
import { loadKakaoMap } from "../../util/loadKakaoMap";

function PlaceSearchInput({ placeholder, value, onSelect }) {
  const [keyword, setKeyword] = useState("");

  const [results, setResults] = useState([]);

  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (value?.name) {
      setKeyword(value.name);
    }
  }, [value]);

  const searchPlaces = (value) => {
    setKeyword(value);

    if (!value.trim()) {
      setResults([]);
      setSearched(false);

      return;
    }

    loadKakaoMap().then((kakao) => {
      const ps = new kakao.maps.services.Places();

      ps.keywordSearch(value, (data, status) => {
        setSearched(true);

        if (status === kakao.maps.services.Status.OK) {
          const filteredResults = data.filter((place) => {
            const address = place.address_name || place.road_address_name || "";

            return address.startsWith("서울") || address.startsWith("경기");
          });

          setResults(filteredResults);
        } else {
          setResults([]);
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
              <div>{place.place_name}</div>
              <div className="small text-muted">
                {place.road_address_name || place.address_name}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      {searched && results.length === 0 && keyword.trim() && (
        <div className="small text-muted mt-2">
          서울·경기 지역만 검색할 수 있습니다.
        </div>
      )}
    </>
  );
}

export default PlaceSearchInput;

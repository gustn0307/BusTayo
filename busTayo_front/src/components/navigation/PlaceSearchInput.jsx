import { useState, useEffect } from "react";
import { Form, ListGroup } from "react-bootstrap";
import { loadKakaoMap } from "../../util/loadKakaoMap";

// 출발지/도착지 장소 검색 입력 컴포넌트
// Kakao Places API를 사용해 장소를 검색하고,
// 서울·경기 지역 결과만 필터링해서 보여준다.
function PlaceSearchInput({
  // 입력창 placeholder 문구
  // 예: "출발지 입력", "도착지 입력"
  placeholder,

  // 부모 컴포넌트에서 내려받은 현재 선택 장소
  // 형태: { name, lat, lng }
  value,

  // 검색 결과에서 장소를 선택했을 때 부모 상태를 변경하는 함수
  // RouteSearchPanel의 setStartPlace 또는 setEndPlace가 전달된다.
  onSelect,
}) {
  // 입력창에 표시되는 검색어
  // 사용자가 직접 입력하거나, 부모 value가 바뀌면 value.name으로 갱신된다.
  const [keyword, setKeyword] = useState("");

  // Kakao Places API 검색 결과 목록
  // 서울·경기 지역으로 필터링된 결과만 저장된다.
  const [results, setResults] = useState([]);

  // 사용자가 검색을 한 적이 있는지 여부
  // 검색 결과가 없을 때 안내 문구를 보여주기 위해 사용한다.
  const [searched, setSearched] = useState(false);

  // 부모에서 선택 장소가 바뀌면 입력창 텍스트도 같이 변경한다.
  // 예: 최근 길찾기 클릭, 내 위치 출발지 설정 등
  useEffect(() => {
  setKeyword(value?.name ?? "");
}, [value]);

  // 사용자가 입력할 때마다 장소 검색 실행
  const searchPlaces = (value) => {
    // 입력창 값 갱신
    setKeyword(value);

    // 검색어가 비어 있으면 결과와 검색 상태 초기화
    if (!value.trim()) {
      setResults([]);
      setSearched(false);

      return;
    }

    // Kakao Map SDK 로드 후 Places 검색 객체 생성
    loadKakaoMap().then((kakao) => {
      const ps = new kakao.maps.services.Places();

      // 키워드 장소 검색
      ps.keywordSearch(value, (data, status) => {
        // 검색 요청이 완료되었으므로 searched를 true로 변경
        setSearched(true);

        if (status === kakao.maps.services.Status.OK) {
          // 버스타요 서비스는 서울·경기만 지원하므로
          // address_name 또는 road_address_name 기준으로 결과를 필터링한다.
          const filteredResults = data.filter((place) => {
            const address = place.address_name || place.road_address_name || "";

            return address.startsWith("서울") || address.startsWith("경기");
          });

          // 필터링된 검색 결과 저장
          setResults(filteredResults);
        } else {
          // 검색 실패 또는 결과 없음
          setResults([]);
        }
      });
    });
  };

  return (
    <>
      {/* 장소 검색 입력창 */}
      <Form.Control
        value={keyword}
        placeholder={placeholder}
        onChange={(e) => searchPlaces(e.target.value)}
      />

      {/* 검색 결과 목록 */}
      {results.length > 0 && (
        <ListGroup>
          {results.slice(0, 5).map((place) => (
            <ListGroup.Item
              key={place.id}
              action
              onClick={() => {
                // 선택한 장소명을 입력창에 표시
                setKeyword(place.place_name);

                // 선택 후 검색 결과 목록 닫기
                setResults([]);

                // 부모 컴포넌트에 선택 장소 전달
                // 출발지 입력창이면 setStartPlace,
                // 도착지 입력창이면 setEndPlace가 실행된다.
                onSelect({
                  name: place.place_name,
                  lat: Number(place.y),
                  lng: Number(place.x),
                });
              }}
            >
              <div>{place.place_name}</div>

              {/* 사용자가 같은 이름의 장소를 구분할 수 있도록 주소 표시 */}
              <div className="small text-muted">
                {place.road_address_name || place.address_name}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* 검색은 했지만 서울·경기 필터 결과가 없을 때 안내 */}
      {searched && results.length === 0 && keyword.trim() && (
        <div className="small text-muted mt-2">
          서울·경기 지역만 검색할 수 있습니다.
        </div>
      )}
    </>
  );
}

export default PlaceSearchInput;
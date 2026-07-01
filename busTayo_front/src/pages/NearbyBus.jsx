import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NearbyBus() {
  const mapContainer = useRef(null);
  const navigate = useNavigate();

  // 💡 가드레일이 두 번 연속 뚫리는 것을 막기 위한 추적 장치
  const hasAlertedRef = useRef(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    
    // 토큰이 없는데 아직 알림을 띄운 적이 없다면?
    if (!token && !hasAlertedRef.current) {
      hasAlertedRef.current = true; // 1. 즉시 깃발을 올려서 두 번째 진입을 원천 차단
      alert("로그인 후 이용할 수 있는 페이지입니다!"); // 2. 유저에게 알림
      window.location.href = "/login"; // 3. 로그인 페이지로 안전 이송
    }
  }, [navigate]);

  // 💡 [변경] busStop을 다른 옵션들과 똑같이 false(꺼짐) 상태로 초기화합니다.
  const [activeModes, setActiveModes] = useState({
    busStop: false,
    convenience: false,
    pharmacy: false,
    cafe: false,
    fastfood: false,
    bank: false,
    restroom: false,
  });

  // 💡 [변경] 버스정류장 데이터 캐싱 창고 추가
  const [cachedData, setCachedData] = useState({
    busStop: [],
    convenience: [],
    pharmacy: [],
    cafe: [],
    fastfood: [],
    bank: [],
    restroom: [],
  });

  const [mapInstance, setMapInstance] = useState(null);
  const [myLocation, setMyLocation] = useState(null);

  // 지도 위에 그려진 이름표들을 카테고리별로 관리할 통합 창고
  const drawnItems = useRef({
    busStop: [],
    convenience: [],
    pharmacy: [],
    cafe: [],
    fastfood: [],
    bank: [],
    restroom: [],
  });

  useEffect(() => {
    const initMap = () => {
      const { kakao } = window;

      if (kakao && kakao.maps) {
        const centerPosition = new kakao.maps.LatLng(37.566826, 126.9786567);
        const mapOptions = {
          center: centerPosition,
          level: 3,
        };

        const map = new kakao.maps.Map(mapContainer.current, mapOptions);
        setMapInstance(map);
        console.log("🟢 카카오 지도 로드 성공!");

        navigator.geolocation.getCurrentPosition((position) => {
          const myPosition = new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          
          setMyLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          
          map.setCenter(myPosition);

          // 내 위치 블루 써클 마커
          const overlayContent =
            `<div style="width: 16px; height: 16px; background-color: #0076ff; ` +
            `border: 3px solid #ffffff; border-radius: 50%; ` +
            `box-shadow: 0 0 8px rgba(0,118,255,0.6);"></div>`;

          const marker = new kakao.maps.CustomOverlay({
            position: myPosition,
            content: overlayContent,
            xAnchor: 0.5,
            yAnchor: 0.5,
          });
          marker.setMap(map);

          // 🚌 [정류장 초기 자동 로드 로직 제거 완료] -> 이제 버튼을 눌러야만 로드됩니다.
        });
      }
    };

    if (!window.kakao || !window.kakao.maps) {
      window.init = initMap;
    } else {
      initMap();
    }
  }, []);

  // 🏛️ [통합 로직] 편의시설 및 버스정류장 그리기
  const drawCategory = (category, dataList, currentMap) => {
    if (!currentMap) return;
    
    clearCategory(category);
    const currentItems = [];

    // 🟢 카테고리별 매칭될 아이콘 및 배경 색상 분기 설정
    const iconMap = {
      busStop: "🚌",
      convenience: "🏪",
      pharmacy: "💊",
      cafe: "☕",
      fastfood: "🍔",
      bank: "🏦",
      restroom: "🚽",
    };

    const categoryIcon = iconMap[category] || "📍";

    dataList.forEach((item) => {
      const position = new kakao.maps.LatLng(item.latitude, item.longitude);
      
      const contentNode = document.createElement('div');
      
      // 🚌 버스정류장인 경우 기존 빨간색 스타일을 입히고, 나머지는 기존 흰색 스타일 유지
      if (category === "busStop") {
        contentNode.style.cssText = `
          padding: 5px 10px;
          font-size: 11px;
          color: #fff;
          font-weight: bold;
          white-space: nowrap;
          width: max-content;
          background: #ff6b6b;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          cursor: pointer;
          position: relative;
          bottom: 20px;
        `;
        contentNode.innerText = `${categoryIcon} ${item.stopName}`;
      } else {
        contentNode.style.cssText = `
          padding: 5px 10px;
          font-size: 11px;
          color: #333;
          font-weight: bold;
          white-space: nowrap;
          width: max-content;
          background: #ffffff;
          border: 1px solid #0076ff;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          cursor: pointer;
          position: relative;
          bottom: 20px;
        `;
        contentNode.innerText = `${categoryIcon} ${item.placeName}`;
      }

      // 버스정류장은 기본 zIndex를 10, 편의시설은 20으로 겹침 제어
      const defaultZIndex = category === "busStop" ? 10 : 20;

      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: contentNode,
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: defaultZIndex
      });

      contentNode.onmouseenter = () => {
        customOverlay.setZIndex(999);
      };
      contentNode.onmouseleave = () => {
        customOverlay.setZIndex(defaultZIndex);
      };

      customOverlay.setMap(currentMap);
      currentItems.push(customOverlay);
    });

    drawnItems.current[category] = currentItems;
  };

  const clearCategory = (category) => {
    if (drawnItems.current[category] && drawnItems.current[category].length > 0) {
      drawnItems.current[category].forEach((overlay) => {
        overlay.setMap(null); 
      });
      drawnItems.current[category] = [];
    }
  };

  const handleModeToggle = (category) => {
    const nextState = !activeModes[category];
    setActiveModes((prev) => ({ ...prev, [category]: nextState }));

    if (!nextState) {
      clearCategory(category);
      return;
    }

    if (!mapInstance) return;

    // 캐시 데이터가 있으면 백엔드 호출 없이 즉시 지도에 그리기
    if (cachedData[category].length > 0) {
      drawCategory(category, cachedData[category], mapInstance);
      return;
    }

    if (!myLocation) {
      alert("위치 파악 중입니다. 잠시 후 다시 눌러주세요.");
      return;
    }

    // 💡 [보안 보강] 전역 규칙에 따라 sessionStorage에서 토큰을 추출합니다.
    const token = sessionStorage.getItem("token");

    // 💡 [핵심 분기] 카테고리가 버스정류장이냐 일반 편의시설이냐에 따라 다른 API를 호출합니다.
    if (category === "busStop") {
      axios
        .get("http://localhost:8080/api/nearby/stops", {
          params: {
            lat: myLocation.lat,
            lon: myLocation.lng, // 백엔드 파라미터 규격(lon) 유지
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("✅ 백엔드가 준 주변 정류장 데이터:", res.data);
          setCachedData((prev) => ({ ...prev, busStop: res.data }));
          drawCategory("busStop", res.data, mapInstance);
        })
        .catch((error) => {
          console.error("❌ 정류장 데이터 로드 실패:", error);
        });
    } else {
      axios
        .get("http://localhost:8080/api/nearby/facilities", {
          params: {
            category: category,
            lat: myLocation.lat,
            lng: myLocation.lng,
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          console.log(`✅ 백엔드가 준 [${category}] 데이터:`, res.data);
          setCachedData((prev) => ({ ...prev, [category]: res.data }));
          drawCategory(category, res.data, mapInstance); 
        })
        .catch((error) => {
          console.error(`❌ [${category}] 데이터 로드 실패:`, error);
        });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>내 주변 검색</h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
        {Object.keys(activeModes).map((mode) => {
          const labels = {
            busStop: "주변 버스정류장 검색", // 💡 버튼 레이블 목록 추가
            convenience: "주변 편의점 검색",
            pharmacy: "주변 약국 검색",
            cafe: "주변 카페 검색",
            fastfood: "주변 패스트푸드 검색",
            bank: "주변 은행/ATM 검색",
            restroom: "주변 공공화장실 검색",
          };
          return (
            <button
              key={mode}
              onClick={() => handleModeToggle(mode)}
              style={{
                padding: "8px 12px",
                borderRadius: "20px",
                cursor: "pointer",
                border: "1px solid #ccc",
                backgroundColor: activeModes[mode] ? "#0076ff" : "#fff",
                color: activeModes[mode] ? "#fff" : "#000",
              }}
            >
              {labels[mode]}
            </button>
          );
        })}
      </div>

      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "500px",
          marginTop: "20px",
          backgroundColor: "#eaeaea",
          borderRadius: "10px",
          border: "1px solid #ccc",
        }}
      ></div>
    </div>
  );
}

export default NearbyBus;
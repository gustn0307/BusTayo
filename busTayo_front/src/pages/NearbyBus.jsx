import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadKakaoMap } from "../util/loadKakaoMap";
import api from "../api";

function NearbyBus() {
  const mapContainer = useRef(null);
  const navigate = useNavigate();

  const hasAlertedRef = useRef(false);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    if (!token && !hasAlertedRef.current) {
      hasAlertedRef.current = true;
      alert("로그인 후 이용할 수 있는 페이지입니다!");
      window.location.href = "/login";
    }
  }, [navigate]);

  const [activeModes, setActiveModes] = useState({
    busStop: false,
    convenience: false,
    pharmacy: false,
    cafe: false,
    fastfood: false,
    bank: false,
    restroom: false,
  });

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
    const initMap = async () => {
      try {
        const kakao = await loadKakaoMap();

        if (!mapContainer.current) {
          return;
        }

        const centerPosition = new kakao.maps.LatLng(
          37.277226622165564,
          127.02796336270409,
        );

        const mapOptions = {
          center: centerPosition,
          level: 3,
        };

        const map = new kakao.maps.Map(mapContainer.current, mapOptions);
        setMapInstance(map);

        console.log("🟢 카카오 지도 로드 성공!");

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const myPosition = new kakao.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude,
            );

            console.log("현재 위치 정확도(m):", position.coords.accuracy);

            if (position.coords.accuracy > 1000) {
              alert(
                `현재 위치 정확도가 낮습니다.\n` +
                  `오차 범위: 약 ${Math.round(position.coords.accuracy)}m\n\n` +
                  `실제 위치와 다를 수 있습니다.`,
              );
            }

            setMyLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });

            map.setCenter(myPosition);

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
          },
          (error) => {
            console.error(
              "현재 위치 조회 실패. fallback 위치를 사용합니다:",
              error,
            );

            const fallbackLat = 37.277226622165564;
            const fallbackLng = 127.02796336270409;

            const fallbackPosition = new kakao.maps.LatLng(
              fallbackLat,
              fallbackLng,
            );

            setMyLocation({
              lat: fallbackLat,
              lng: fallbackLng,
            });

            map.setCenter(fallbackPosition);

            const overlayContent =
              `<div style="width: 16px; height: 16px; background-color: #0076ff; ` +
              `border: 3px solid #ffffff; border-radius: 50%; ` +
              `box-shadow: 0 0 8px rgba(0,118,255,0.6);"></div>`;

            const marker = new kakao.maps.CustomOverlay({
              position: fallbackPosition,
              content: overlayContent,
              xAnchor: 0.5,
              yAnchor: 0.5,
            });

            marker.setMap(map);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        );
      } catch (error) {
        console.error("카카오 지도 로드 실패:", error);
      }
    };

    initMap();
  }, []);

  const drawCategory = (category, dataList, currentMap) => {
    if (!currentMap || !window.kakao?.maps) return;

    const { kakao } = window;

    clearCategory(category);
    const currentItems = [];

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

      const contentNode = document.createElement("div");

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

      const defaultZIndex = category === "busStop" ? 10 : 20;

      const customOverlay = new kakao.maps.CustomOverlay({
        position,
        content: contentNode,
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: defaultZIndex,
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
    if (
      drawnItems.current[category] &&
      drawnItems.current[category].length > 0
    ) {
      drawnItems.current[category].forEach((overlay) => {
        overlay.setMap(null);
      });
      drawnItems.current[category] = [];
    }
  };

  const handleModeToggle = (category) => {
    const nextState = !activeModes[category];

    setActiveModes((prev) => ({
      ...prev,
      [category]: nextState,
    }));

    if (!nextState) {
      clearCategory(category);
      return;
    }

    if (!mapInstance) {
      alert("지도를 불러오는 중입니다. 잠시 후 다시 눌러주세요.");
      return;
    }

    if (cachedData[category].length > 0) {
      drawCategory(category, cachedData[category], mapInstance);
      return;
    }

    if (!myLocation) {
      alert("위치 파악 중입니다. 잠시 후 다시 눌러주세요.");
      return;
    }

    const token = sessionStorage.getItem("accessToken");

    if (category === "busStop") {
      api
        .get("/nearby/stops", {
          params: {
            lat: myLocation.lat,
            lon: myLocation.lng,
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
      api
        .get("/nearby/facilities", {
          params: {
            category,
            lat: myLocation.lat,
            lng: myLocation.lng,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        {Object.keys(activeModes).map((mode) => {
          const labels = {
            busStop: "주변 버스정류장 검색",
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
      />
    </div>
  );
}

export default NearbyBus;

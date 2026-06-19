import { useEffect, useRef } from "react";
import { loadKakaoMap } from "../../util/loadKakaoMap";

function KakaoMap({ currentLocation, setCurrentLocation, selectedStation }) {
  const mapRef = useRef(null);

  const mapContainerRef = useRef(null);

  const mapInstanceRef = useRef(null);

  const stationMarkerRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation을 지원하지 않는 브라우저입니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCurrentLocation({
          lat,
          lng,
        });

        loadKakaoMap().then((kakao) => {
          const map = new kakao.maps.Map(mapContainerRef.current, {
            center: new kakao.maps.LatLng(lat, lng),
            level: 3,
          });

          mapInstanceRef.current = map;

          new kakao.maps.Marker({
            map,
            position: new kakao.maps.LatLng(lat, lng),
          });
        });
      },

      (error) => {
        console.error(error);

        // 위치 권한 거부 시 서울시청으로 대체
        window.kakao.maps.load(() => {
          const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(37.5665, 126.978),
            level: 4,
          });
        });
      },
      {
        enableHighAccuracy: true, // GPS 우선 사용
        timeout: 10000, // 10초까지 위치 수집
        maximumAge: 0, // 캐시 사용 금지
      },
    );
  }, []);

  useEffect(() => {
    if (!selectedStation || !mapInstanceRef.current) {
      return;
    }

    const kakao = window.kakao;

    mapInstanceRef.current.setCenter(
      new kakao.maps.LatLng(selectedStation.lat, selectedStation.lng),
    );
  }, [selectedStation]);

  return <div ref={mapContainerRef} className="w-100 h-100" />;
}

export default KakaoMap;

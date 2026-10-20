import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getRoomById } from "../services/roomService";
import { getRoomImage } from "../utils/roomImage";

function RoomDetailPage() {
  const { roomId } = useParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoom() {
      try {
        setLoading(true);

        const data = await getRoomById(roomId);

        if (!data) {
          setError("ไม่พบข้อมูลห้องประชุม");
          return;
        }

        setRoom(data);
      } catch (error) {
        console.error(error);
        setError("ไม่สามารถโหลดรายละเอียดห้องได้");
      } finally {
        setLoading(false);
      }
    }

    loadRoom();
  }, [roomId]);

  if (loading) {
    return (
      <div className="detail-page-message">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page-message">
        {error}
      </div>
    );
  }

  if (!room) {
    return null;
  }

  const imagePath = getRoomImage(room);

  const roomType =
    room.room_type?.toLowerCase();

  const status =
    room.status?.toLowerCase();

  const typeText = {
    small: "ห้องประชุมขนาดเล็ก",
    medium: "ห้องประชุมขนาดกลาง",
    large: "ห้องประชุมขนาดใหญ่"
  };

  const statusText = {
    available: "พร้อมใช้งาน",
    maintenance: "ปิดปรับปรุง",
    unavailable: "ไม่พร้อมใช้งาน"
  };

  return (
    <main className="detail-page">

      <div className="detail-topbar">

        <Link
          to="/rooms"
          className="detail-back"
        >
          ← กลับไปหน้าห้องประชุม
        </Link>

      </div>

      <section className="detail-card">

        {/* รูปห้อง */}
        <div className="detail-image-area">

          <img
            src={imagePath}
            alt={room.name_th}
            className="detail-room-image"
          />

          <span
            className={`detail-status-badge ${status}`}
          >
            {statusText[status] || room.status}
          </span>

        </div>

        {/* ข้อมูลห้อง */}
        <div className="detail-content">

          <span className="detail-room-type">
            {typeText[roomType] || room.room_type}
          </span>

          <h1>{room.name_th}</h1>

          <p className="detail-room-en">
            {room.name_en}
          </p>

          <div className="detail-info-list">

            <div className="detail-info-row">
              <span className="detail-label">
                👥 ความจุ
              </span>

              <strong>
                {room.capacity} คน
              </strong>
            </div>

            <div className="detail-info-row">
              <span className="detail-label">
                📍 สถานที่
              </span>

              <strong>
                {room.location}
              </strong>
            </div>

            <div className="detail-info-row">
              <span className="detail-label">
                🏢 ชั้น
              </span>

              <strong>
                {room.floor}
              </strong>
            </div>

            <div className="detail-info-row">
              <span className="detail-label">
                🕐 เวลาเปิด
              </span>

              <strong>
                {room.open_time} - {room.close_time}
              </strong>
            </div>

            <div className="detail-info-row">
              <span className="detail-label">
                📌 สถานะ
              </span>

              <strong
                className={`detail-status-text ${status}`}
              >
                {statusText[status] || room.status}
              </strong>
            </div>

          </div>

          {/* อุปกรณ์ */}
          <div className="detail-facilities">

            <h2>
              อุปกรณ์และสิ่งอำนวยความสะดวก
            </h2>

            <div className="detail-facility-list">

              {Array.isArray(room.facilities) ? (
                room.facilities.map(
                  (item, index) => (
                    <span
                      key={index}
                      className="detail-facility"
                    >
                      ✓ {item}
                    </span>
                  )
                )
              ) : room.facilities ? (
                room.facilities
                  .split(",")
                  .map(
                    (item, index) => (
                      <span
                        key={index}
                        className="detail-facility"
                      >
                        ✓ {item.trim()}
                      </span>
                    )
                  )
              ) : (
                <span>
                  ไม่มีข้อมูลอุปกรณ์
                </span>
              )}

            </div>

          </div>

          {/* ปุ่มจอง */}
          {status === "available" ? (

            <Link
              to={`/reservations/new/${room.id}`}
              className="detail-book-button"
            >
              📅 จองห้องประชุม
            </Link>

          ) : (

            <button
              className="detail-book-button detail-disabled"
              disabled
            >
              ไม่สามารถจองห้องนี้ได้
            </button>

          )}

        </div>

      </section>

    </main>
  );
}

export default RoomDetailPage;
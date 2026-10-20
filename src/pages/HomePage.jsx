import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import RoomCard from "../components/rooms/RoomCard";
import { watchRooms } from "../services/roomService";

function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [roomType, setRoomType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => watchRooms(data=>{setRooms(data);setLoading(false)},()=>{setError('ไม่สามารถโหลดข้อมูลห้องประชุมได้');setLoading(false)}),[]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const keywordLower = keyword.toLowerCase();

      const matchKeyword =
        room.name_th?.toLowerCase().includes(keywordLower) ||
        room.name_en?.toLowerCase().includes(keywordLower) ||
        room.location?.toLowerCase().includes(keywordLower);

      const matchType =
        roomType === "all" ||
        room.room_type?.toLowerCase() === roomType;

      return matchKeyword && matchType;
    });
  }, [rooms, keyword, roomType]);

  const availableCount = rooms.filter(
    (room) => (room.display_status || room.status)?.toLowerCase() === "available"
  ).length;

  return (
    <div className="app">
      <Navbar />

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-overlay">
          <div className="home-hero-content">
            <span className="hero-tag">
              ONLINE MEETING ROOM
            </span>

            <h1>
              ค้นหาและจองห้องประชุม
              <br />
              ได้ง่ายในไม่กี่ขั้นตอน
            </h1>

            <p>
              ตรวจสอบห้องว่าง เลือกห้องตามขนาด
              และจองห้องประชุมออนไลน์ได้อย่างสะดวก
            </p>

            <div className="home-search-box">
              <input
                type="text"
                placeholder="ค้นหาชื่อห้อง หรือสถานที่..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />

              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="all">ทุกประเภท</option>
                <option value="small">ห้องขนาดเล็ก</option>
                <option value="medium">ห้องขนาดกลาง</option>
                <option value="large">ห้องขนาดใหญ่</option>
              </select>

              <button type="button" onClick={() => document.querySelector(".room-section")?.scrollIntoView({ behavior: "smooth" })}>
                🔍 ค้นหาห้อง
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="home-stats">
        <div className="home-stat-card">
          <span>🏢</span>
          <div>
            <strong>{rooms.length}</strong>
            <p>ห้องประชุมทั้งหมด</p>
          </div>
        </div>

        <div className="home-stat-card">
          <span>✅</span>
          <div>
            <strong>{availableCount}</strong>
            <p>ห้องพร้อมใช้งาน</p>
          </div>
        </div>

        <div className="home-stat-card">
          <span>📂</span>
          <div>
            <strong>3</strong>
            <p>ประเภทห้องประชุม</p>
          </div>
        </div>
      </section>

      {/* ROOM TYPES */}
      <section className="home-section">
        <div className="home-section-heading">
          <span>เลือกตามความต้องการ</span>
          <h2>ประเภทห้องประชุม</h2>
          <p>
            เลือกขนาดห้องให้เหมาะกับจำนวนผู้เข้าร่วมประชุม
          </p>
        </div>

        <div className="home-type-grid">
          <button
            className="home-type-card"
            onClick={() => setRoomType("small")}
          >
            <div className="type-icon">👥</div>
            <h3>ห้องขนาดเล็ก</h3>
            <p>เหมาะสำหรับการประชุมทีมขนาดเล็ก</p>
            <span>4 - 8 คน →</span>
          </button>

          <button
            className="home-type-card"
            onClick={() => setRoomType("medium")}
          >
            <div className="type-icon">👨‍👩‍👧‍👦</div>
            <h3>ห้องขนาดกลาง</h3>
            <p>เหมาะสำหรับการประชุมแผนกหรือโครงการ</p>
            <span>10 - 20 คน →</span>
          </button>

          <button
            className="home-type-card"
            onClick={() => setRoomType("large")}
          >
            <div className="type-icon">🏛️</div>
            <h3>ห้องขนาดใหญ่</h3>
            <p>เหมาะสำหรับประชุมใหญ่และสัมมนา</p>
            <span>20 คนขึ้นไป →</span>
          </button>
        </div>
      </section>

      {/* ROOMS */}
      <section className="home-section room-section">
        <div className="home-section-heading">
          <span>MEETING ROOMS</span>
          <h2>ห้องประชุมแนะนำ</h2>
          <p>
            ข้อมูลห้องประชุมจาก Firebase Realtime Database
          </p>
        </div>

        {loading ? (
          <div className="home-message">
            กำลังโหลดข้อมูล...
          </div>
        ) : error ? (
          <div className="home-message error">
            {error}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="home-message">
            ไม่พบห้องประชุมที่ตรงกับเงื่อนไข
          </div>
        ) : (
          <div className="home-room-grid">
            {filteredRooms.slice(0, 6).map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}

        <div className="home-view-all">
          <Link to="/rooms">
            ดูห้องประชุมทั้งหมด →
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="home-feature-section">
        <div className="home-section-heading">
          <span>WHY CHOOSE US</span>
          <h2>ระบบช่วยอะไรได้บ้าง?</h2>
        </div>

        <div className="home-feature-grid">
          <div className="home-feature-card">
            <div>🔍</div>
            <h3>ค้นหาห้องได้ง่าย</h3>
            <p>
              ค้นหาตามชื่อ ประเภท ความจุ
              และสถานที่ของห้องประชุม
            </p>
          </div>

          <div className="home-feature-card">
            <div>📅</div>
            <h3>จองห้องออนไลน์</h3>
            <p>
              เลือกวัน เวลา วัตถุประสงค์
              และส่งคำขอจองได้ทันที
            </p>
          </div>

          <div className="home-feature-card">
            <div>✅</div>
            <h3>ตรวจสอบสถานะ</h3>
            <p>
              ตรวจสอบ Pending, Approved,
              Rejected และ Cancelled ได้
            </p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <h3>Online Meeting Room</h3>
        <p>
          ระบบจองห้องประชุมออนไลน์สำหรับองค์กร
        </p>
        <span>
          © 2026 Online Meeting Room Reservation System
        </span>
      </footer>
    </div>
  );
}

export default HomePage;

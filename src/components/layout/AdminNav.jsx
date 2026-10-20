import {NavLink} from 'react-router-dom';
export default function AdminNav(){return <nav className="admin-subnav" aria-label="เมนูจัดการแอดมิน"><NavLink to="/admin" end>จัดการคำขอจอง</NavLink><NavLink to="/admin/rooms">จัดการห้อง</NavLink><NavLink to="/admin/feedback">ผลประเมิน / รายงานข้อผิดพลาด</NavLink></nav>}

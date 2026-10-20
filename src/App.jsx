import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider,useAuth } from './services/AuthContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RoomListPage from './pages/RoomListPage';
import RoomDetailPage from './pages/RoomDetailPage';
import BookingPage from './pages/BookingPage';
import MyReservationsPage from './pages/MyReservationsPage';
import PresentationPage from './pages/PresentationPage';
import AdminPage from './pages/AdminPage';
import AdminRoomsPage from './pages/AdminRoomsPage';
import VerifyAdminPage from './pages/VerifyAdminPage';
function Protected({children,adminOnly=false}){const {user,ready,isAdmin,isAdminCandidate}=useAuth();const location=useLocation();if(!ready)return <main className="workspace-page">กำลังตรวจสอบบัญชี…</main>;if(!user)return <Navigate to="/login" state={{from:location.pathname}} replace/>;if(adminOnly&&!isAdmin)return isAdminCandidate?<VerifyAdminPage/>:<main className="workspace-page"><h1>ไม่มีสิทธิ์เข้าถึง</h1><p>หน้านี้สำหรับแอดมินที่ได้รับสิทธิ์เท่านั้น</p><Link to="/my-reservations">กลับไปการจองของฉัน</Link></main>;return children;}
function Profile(){const {user,isAdmin,isAdminCandidate}=useAuth();return <main className="workspace-page"><h1>บัญชีของฉัน</h1><section className="surface"><p>{user.email}</p><p>บทบาท: {isAdmin?'แอดมิน':'ผู้ใช้งาน'}</p><Link to="/my-reservations">ดูรายการจองของฉัน →</Link>{isAdminCandidate&&<p><Link to="/admin">เปิดหน้าจัดการแอดมิน →</Link></p>}</section></main>}
function AppRoutes(){const location=useLocation();return <>{location.pathname!=='/'&&<Navbar/>}<Routes><Route path="/" element={<HomePage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/rooms" element={<RoomListPage/>}/><Route path="/rooms/:roomId" element={<RoomDetailPage/>}/><Route path="/reservations/new/:roomId" element={<Protected><BookingPage/></Protected>}/><Route path="/my-reservations" element={<Protected><MyReservationsPage/></Protected>}/><Route path="/profile" element={<Protected><Profile/></Protected>}/><Route path="/admin" element={<Protected adminOnly><AdminPage/></Protected>}/><Route path="/admin/rooms" element={<Protected adminOnly><AdminRoomsPage/></Protected>}/><Route path="/presentation" element={<PresentationPage/>}/><Route path="*" element={<main className="workspace-page"><h1>ไม่พบหน้านี้</h1><Link to="/">กลับหน้าแรก</Link></main>}/></Routes></>}
export default function App(){return <AuthProvider><AppRoutes/></AuthProvider>}

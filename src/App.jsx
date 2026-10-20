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
function Protected({children}){const {user,ready}=useAuth();const location=useLocation();if(!ready)return <main className="workspace-page">กำลังตรวจสอบการเข้าสู่ระบบ…</main>;return user?children:<Navigate to="/login" state={{from:location.pathname}} replace/>;}
function Profile(){const {user}=useAuth();return <main className="workspace-page"><h1>บัญชีของฉัน</h1><section className="surface"><p>{user.email}</p><Link to="/my-reservations">ดูรายการจองของฉัน →</Link></section></main>}
function AppRoutes(){const location=useLocation();return <>{location.pathname!=='/'&&<Navbar/>}<Routes>
<Route path="/" element={<HomePage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/rooms" element={<RoomListPage/>}/><Route path="/rooms/:roomId" element={<RoomDetailPage/>}/>
<Route path="/reservations/new/:roomId" element={<Protected><BookingPage/></Protected>}/><Route path="/my-reservations" element={<Protected><MyReservationsPage/></Protected>}/><Route path="/profile" element={<Protected><Profile/></Protected>}/><Route path="/presentation" element={<PresentationPage/>}/>
<Route path="*" element={<main className="workspace-page"><h1>ไม่พบหน้านี้</h1><Link to="/">กลับหน้าแรก</Link></main>}/></Routes></>}
export default function App(){return <AuthProvider><AppRoutes/></AuthProvider>}

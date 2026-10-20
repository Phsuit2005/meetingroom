import {useState} from 'react';
import {Link} from 'react-router-dom';
const slides=[
['Online Meeting Room','ระบบจองห้องประชุมออนไลน์','โครงงานคู่ 0073–0081 • ค้นหา จอง และจัดการห้องประชุมจากทุกอุปกรณ์'],
['01 / ปัญหาและแนวคิด','ลดความสับสนในการใช้ห้องประชุม','การจองผ่านข้อความหรือตารางแยกกันทำให้ตรวจสอบยากและเกิดเวลาซ้อน ระบบรวมข้อมูลห้องและรายการจองไว้ในฐานข้อมูลกลาง'],
['02 / กลุ่มผู้ใช้งาน','สำหรับบุคลากรและทีมงาน','ผู้ใช้งานค้นหาห้องตามขนาดและสถานที่ เข้าสู่ระบบเพื่อจอง ตรวจสถานะ และยกเลิกการจองของตนเองก่อนเริ่มประชุม'],
['03 / ฟังก์ชันหลัก','ค้นหา → เลือกเวลา → ยืนยัน','ดูรายละเอียดและอุปกรณ์ของห้อง กรอกวัน เวลา จำนวนผู้เข้าร่วม และหัวข้อประชุม ตรวจเวลาเปิดให้บริการ ความจุ และเวลาซ้อนก่อนบันทึก'],
['04 / โครงสร้างข้อมูล','React + Firebase','Firebase Authentication จัดการบัญชี • meeting_rooms เก็บข้อมูลห้อง • reservations เก็บ user_id, room_id, วันที่ เวลา จำนวนคน วัตถุประสงค์ และสถานะ ใช้ transaction ตรวจเวลาซ้อนพร้อมบันทึก'],
['05 / ออกแบบหน้าจอ','แยกหน้าจอตามงานของผู้ใช้','Navbar และ RoomCard ใช้ซ้ำได้ • หน้าแรกและรายการห้อง • รายละเอียดห้อง • เข้าสู่ระบบ / สมัครสมาชิก • ฟอร์มจอง • การจองของฉัน รองรับหน้าจอมือถือ'],
['06 / สาธิตระบบจริง','ทดลองจองและยกเลิก','1. สมัครสมาชิกหรือเข้าสู่ระบบ  2. เลือกห้องพร้อมใช้งาน  3. จองเวลาในอนาคต  4. เปิดบัญชีเดียวกันบนอีกเครื่องเพื่อตรวจรายการ  5. ลองจองเวลาซ้อน  6. ยกเลิกแล้วตรวจว่าจองช่วงเวลาเดิมได้อีกครั้ง'],
['07 / ผลลัพธ์และพัฒนาต่อ','ข้อมูลเดียวกันจากทุกอุปกรณ์','การจองบันทึกบน Firebase และรายการเปลี่ยนตามฐานข้อมูลแบบเรียลไทม์ ข้อควรทำก่อนใช้งานจริง: กำหนดกฎสิทธิ์ Firebase ขององค์กร และกำหนดนโยบายอนุมัติขององค์กร']
];
export default function PresentationPage(){const [index,setIndex]=useState(0),[full,setFull]=useState(false);const slide=slides[index];return <main className={`workspace-page presentation-page ${full?'presentation-full':''}`}><div className="presentation-toolbar"><Link to="/rooms">เปิดระบบสาธิต ↗</Link><button className="secondary-button" onClick={()=>setFull(!full)}>{full?'ออกจากโหมดนำเสนอ':'โหมดนำเสนอ'}</button></div><section className="presentation-slide" aria-live="polite"><span className="eyebrow">{slide[0]}</span><h1>{slide[1]}</h1><p>{slide[2]}</p><span className="slide-brand">ONLINE MEETING ROOM / 0073–0081</span></section><div className="presentation-controls"><button className="secondary-button" disabled={index===0} onClick={()=>setIndex(index-1)}>← ก่อนหน้า</button><span>{index+1} / {slides.length}</span><button className="primary-button" disabled={index===slides.length-1} onClick={()=>setIndex(index+1)}>ถัดไป →</button></div></main>}


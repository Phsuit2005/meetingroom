import {useState} from 'react';
import {Link} from 'react-router-dom';
import objectives from '../config/projectObjectives.json';
const slides=[
['Online Meeting Room','ระบบจองห้องประชุมออนไลน์','โครงงานคู่ 0073–0081 • ส่งคำขอ ตรวจสอบ และอนุมัติจากทุกอุปกรณ์'],
['01 / ปัญหาและแนวคิด','รวมการจองและการอนุมัติไว้ในระบบเดียว','ผู้ใช้ส่งคำขอผ่านเว็บไซต์ ผู้ดูแลตรวจสอบวันเวลาและความเหมาะสมก่อนอนุมัติ ลดความสับสนและการใช้งานห้องซ้อนกัน'],
['02 / กลุ่มผู้ใช้งาน','ผู้ใช้งานทั่วไปและแอดมิน','ผู้ใช้งานดูและยกเลิกการจองของตัวเอง แอดมินที่ได้รับสิทธิ์และยืนยันอีเมลแล้วดูคำขอทั้งหมด อนุมัติ ปฏิเสธ และยกเลิกได้'],
['03 / ฟังก์ชันหลัก','ค้นหา → ส่งคำขอ → รออนุมัติ','ทุกคำขอใหม่มีสถานะ pending เมื่อแอดมินอนุมัติเป็น approved หรือปฏิเสธเป็น rejected ผู้จองเห็นสถานะและหมายเหตุแบบเรียลไทม์'],
['04 / โครงสร้างข้อมูล','React + Firebase','Authentication จัดการบัญชี • meeting_rooms เก็บห้อง • reservations เก็บผู้จอง วันเวลา สถานะ และผู้พิจารณา • Security Rules บังคับสิทธิ์ผู้ใช้และอีเมลแอดมินที่ยืนยันแล้ว'],
['05 / การอนุมัติ','ตรวจเวลาซ้อนก่อนยืนยันห้อง','แอดมินใช้ transaction ตรวจรายการ approved ที่ทับช่วงเวลาเดียวกัน และบันทึกสถานะพร้อมผู้พิจารณา การอนุมัติพร้อมกันจะตรวจซ้ำกับข้อมูลล่าสุด'],
['06 / สาธิตระบบจริง','ทดลองสองบทบาท','1. ผู้ใช้ส่งคำขอ  2. ตรวจสถานะรออนุมัติ  3. แอดมินเปิด /admin  4. อนุมัติหรือปฏิเสธพร้อมหมายเหตุ  5. ผู้ใช้ตรวจสถานะใหม่  6. ทดลองคำขอเวลาซ้อนและยกเลิก'],
['07 / ผลลัพธ์','ควบคุมการใช้งานห้องอย่างเป็นระบบ','ผู้ใช้เข้าถึงเฉพาะการจองของตนเอง แอดมินสองอีเมลที่กำหนดและยืนยันแล้วดูแลคำขอผ่านหน้าเดียวกัน เว็บไซต์เผยแพร่บน Firebase Hosting และใช้ฐานข้อมูลร่วมกันทุกเครื่อง']
];
slides.splice(2,0,['วัตถุประสงค์ของโครงงาน','วัตถุประสงค์ของโครงงาน',objectives]);
export default function PresentationPage(){const [index,setIndex]=useState(0),[full,setFull]=useState(false);const slide=slides[index];return <main className={`workspace-page presentation-page ${full?'presentation-full':''}`}><div className="presentation-toolbar"><Link to="/rooms">เปิดระบบสาธิต ↗</Link><button className="secondary-button" onClick={()=>setFull(!full)}>{full?'ออกจากโหมดนำเสนอ':'โหมดนำเสนอ'}</button></div><section className="presentation-slide" aria-live="polite"><span className="eyebrow">{slide[0]}</span><h1>{slide[1]}</h1>{Array.isArray(slide[2])?<ol className="presentation-objectives">{slide[2].map(v=><li key={v}>{v}</li>)}</ol>:<p>{slide[2]}</p>}<span className="slide-brand">ONLINE MEETING ROOM / 0073–0081</span></section><div className="presentation-controls"><button className="secondary-button" disabled={index===0} onClick={()=>setIndex(index-1)}>← ก่อนหน้า</button><span>{index+1} / {slides.length}</span><button className="primary-button" disabled={index===slides.length-1} onClick={()=>setIndex(index+1)}>ถัดไป →</button></div></main>}

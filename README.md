# Online Meeting Room — งานคู่ 0073–0081

เว็บไซต์: https://meetingroom7381.web.app
หน้าแอดมิน: https://meetingroom7381.web.app/admin

## ฟังก์ชันผู้ใช้งาน
- ดูและค้นหาห้องประชุมตามชื่อ สถานที่ และขนาด
- สมัครสมาชิกและเข้าสู่ระบบด้วย Firebase Authentication
- ส่งคำขอจอง โดยทุกคำขอใหม่เป็น pending (รออนุมัติ)
- ดูเฉพาะรายการของตนเอง พร้อมสถานะและหมายเหตุจากแอดมินแบบเรียลไทม์
- ยกเลิกคำขอ pending หรือการจอง approved ของตนเองได้ก่อนเริ่มประชุม
- วันและเวลาใช้เขตเวลาประเทศไทย Asia/Bangkok

## แอดมิน
อนุญาตเฉพาะบัญชี Firebase Authentication ที่ยืนยันอีเมลแล้ว:
- s67122250081@ssru.ac.th
- s67122250073@ssru.ac.th

เข้าสู่ระบบด้วยบัญชีของตนเองแล้วเปิด /admin หากอีเมลยังไม่ยืนยัน หน้าจอมีปุ่มส่งลิงก์ยืนยันและปุ่มตรวจสอบอีกครั้ง
ไม่มีการสร้างบัญชีหรือกำหนดรหัสผ่านแอดมินให้อัตโนมัติ

แอดมินดูรายการทั้งหมด ค้นหาและกรอง อนุมัติ ปฏิเสธ หรือยกเลิก พร้อมหมายเหตุและประวัติผู้จัดการรายการ
การอนุมัติใช้ Firebase transaction ที่ /reservations และตรวจรายการ approved ที่เวลาซ้อนกัน เมื่อมีแอดมินทำงานพร้อมกัน transaction จะลองใหม่กับข้อมูลล่าสุด
หน้าจอแสดงช่วงที่มี pending/approved และหยุดส่งคำขอที่ชนช่วงที่แสดงอยู่ หากส่งคำขอพร้อมกันยังอาจมี pending ซ้ำได้ แต่การอนุมัติใช้ transaction ป้องกัน approved ซ้อนกัน
รายการเดิมเก็บสถานะไว้ ไม่เปลี่ยน approved เดิมเป็น pending

## โครงสร้างและสิทธิ์
- React + Vite + React Router
- Firebase Authentication สำหรับบัญชี
- Firebase Realtime Database: meeting_rooms, reservations, users เดิม
- database.rules.json จำกัดการอ่านและการเขียนที่ Firebase
- ผู้ใช้ทั่วไปอ่านรายการผ่าน query orderByChild('user_id').equalTo(auth.uid) เท่านั้น
- ผู้ใช้ทั่วไปสร้างได้เฉพาะ pending ในนามบัญชีตนเอง และแก้ไขได้เฉพาะยกเลิกของตนตามเงื่อนไข
- แอดมินต้องมี token.email_verified เป็น true และอีเมลตรงกับ allowlist
- src/config/admins.json เป็นรายการแอดมินร่วมของ UI และตัวสร้างกฎ

หากเปลี่ยนรายชื่อแอดมิน ต้องรัน npm run rules:generate แล้วเผยแพร่ทั้ง Hosting และ database rules
ผู้ดูแลโปรเจกต์ Firebase/Google Cloud ที่มีสิทธิ์ระดับโครงสร้างพื้นฐานยังสามารถดูแลฐานข้อมูลผ่าน Console ได้ตามสิทธิ์ของ Google Cloud

## พัฒนาและทดสอบ
ใช้ Node.js 22 ขึ้นไป

```sh
npm install
npm run dev
npm test
npm run build
```

ชุดทดสอบครอบคลุมวันเวลา ความจุ การอนุมัติ สถานะเปลี่ยนไปแล้ว การปฏิเสธ/ยกเลิก และการตรวจเวลาซ้อนเมื่ออนุมัติพร้อมกัน

## เผยแพร่
```sh
npm install -g firebase-tools
firebase login
npm run rules:generate
npm run build
firebase deploy --only hosting,database --project meetingroom0073-0081
```

firebase.json ใช้ Hosting site meetingroom7381 พร้อม SPA rewrite และกฎ Realtime Database
การเผยแพร่ต้องมีสิทธิ์ใน Firebase project meetingroom0073-0081
ไม่รวม node_modules, build output หรือข้อมูลเข้าสู่ระบบใน Repository

## นำเสนอโครงงาน
/presentation มีเนื้อหาและขั้นตอนสาธิตการจองและอนุมัติ

## สถานะห้องและตารางเวลา
- หน้าแรก รายการห้อง รายละเอียด และฟอร์มจองติดตามข้อมูลแบบเรียลไทม์
- ห้องที่มีคำขอ pending หรือการจอง approved ที่ยังไม่สิ้นสุด แสดงป้ายแดงพร้อมช่วงวันเวลา และยังเลือกช่วงอื่นที่ว่างได้
- เมื่อยกเลิก ปฏิเสธ หรือหมดเวลา ตารางไม่บล็อกช่วงนั้นแล้ว การหมดเวลาตรวจซ้ำทุก 30 วินาที
- /admin/rooms ให้เฉพาะแอดมินที่ยืนยันอีเมลตั้ง available, unavailable หรือ maintenance พร้อม status_note สาธารณะ
- การปิดห้องหยุดรับคำขอใหม่และหยุดอนุมัติคำขอ แต่ไม่ลบหรือยกเลิกรายการเดิมอัตโนมัติ
- room_bookings เก็บเฉพาะ room_id, room_key, reservation_date, start_time, end_time, start_at, end_at, status ไม่มีอีเมล uid หัวข้อ หรือหมายเหตุส่วนตัว
- คำขอใหม่และการยกเลิกของเจ้าของบันทึก reservations กับ room_bookings แบบ atomic multi-location update
- แอดมินอนุมัติผ่าน transaction แล้วอัปเดตตารางสถานะ โดย Rules ตรวจว่าข้อมูลตารางตรงกับรายการจริง
- ห้องที่ตั้งปิดปรับปรุง/ไม่พร้อมใช้งานยังคงปิด แม้ไม่มีรายการจอง หรือเปิดห้องแล้วแต่มีการจองอยู่ก็ยังแสดงช่วงที่ไม่ว่าง

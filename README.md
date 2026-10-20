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
คำขอ pending หลายรายการสามารถขอช่วงเวลาเดียวกันได้ แต่ยังไม่ยืนยันห้องจนกว่าจะ approved
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

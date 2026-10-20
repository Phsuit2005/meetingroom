# Online Meeting Room — Source Code ฉบับสมบูรณ์

เว็บไซต์: https://meetingroom7381.web.app
GitHub: https://github.com/Phsuit2005/meetingroom

## ฟังก์ชัน
- สมัครสมาชิกและเข้าสู่ระบบด้วย Firebase Authentication
- ค้นหาห้อง ดูรายละเอียด และตารางการจอง
- ส่งคำขอจอง รออนุมัติ ติดตามสถานะ และยกเลิกการจอง
- แอดมินอนุมัติ ปฏิเสธ และยกเลิกคำขอ พร้อมหมายเหตุ
- แอดมินกำหนดห้องพร้อมใช้งาน ไม่พร้อมใช้งาน หรือปิดปรับปรุง
- แบบประเมินความพึงพอใจ 5 ข้อ คะแนน 1–5 แก้ไขคำตอบเดิมได้
- แจ้งข้อผิดพลาด ติดตามผล และรับหมายเหตุจากแอดมิน
- หน้ารายงานแอดมินแสดงคะแนนเฉลี่ย ข้อเสนอแนะ และสถานะการแก้ไขปัญหา
- สไลด์นำเสนอโครงงานพร้อมวัตถุประสงค์ทั้ง 4 ข้อ

## ติดตั้งและเปิดใช้งาน
ใช้ Node.js 22.12 ขึ้นไป หรือ Node.js 24 พร้อม npm

1. แตก ZIP แล้วเปิด Terminal ในโฟลเดอร์ MeetingRoom7381
2. ติดตั้งและเปิดเว็บ:
```sh
npm ci
npm run dev
```
3. เปิด URL ที่ Terminal แสดง เช่น http://localhost:5173

## Firebase
Source Code ตั้งค่าเชื่อมต่อโปรเจกต์ meetingroom0073-0081 ไว้แล้ว
ไฟล์ src/services/firebase.js เป็นการตั้งค่าเว็บ Firebase ไม่ใช่สิทธิ์ผู้ดูแลระบบ

หากใช้ Firebase โปรเจกต์ใหม่:
1. สร้างโปรเจกต์และเพิ่ม Web App ใน Firebase Console
2. เปลี่ยนค่า Web App config และ databaseURL ใน src/services/firebase.js
3. เปิด Authentication > Sign-in method > Email/Password
4. สร้าง Realtime Database แล้วนำเข้า database.seed.json สำหรับห้องตัวอย่าง 15 ห้อง
5. เปลี่ยนโปรเจกต์ใน .firebaserc และชื่อ Hosting site ใน firebase.json
6. เพิ่มโดเมนที่ใช้จริงใน Authentication > Settings > Authorized domains
7. ตั้งอีเมลแอดมินใน src/config/admins.json แล้วสร้างและเผยแพร่ Rules ตามคำสั่งด้านล่าง

database.seed.json มีเฉพาะข้อมูลห้อง ไม่มีบัญชีผู้ใช้ ประวัติการจอง หรือคำตอบแบบประเมิน
บัญชีผู้ใช้ต้องสมัครผ่านหน้าเว็บไซต์หรือสร้างใน Firebase Authentication

## แอดมิน
อีเมลปัจจุบัน:
- s67122250073@ssru.ac.th
- s67122250081@ssru.ac.th

ต้องสมัครและยืนยันอีเมลก่อน จึงใช้เมนูจัดการแอดมินได้
ภายในมีเมนูจัดการคำขอจอง จัดการห้อง และผลประเมิน / รายงานข้อผิดพลาด
การเปลี่ยนอีเมลแอดมินต้องแก้ src/config/admins.json แล้วรัน npm run rules:generate และเผยแพร่ Rules ใหม่

## ทดสอบและ Build
```sh
npm test
npm run build
npm run preview
```
มีชุดทดสอบการจอง การอนุมัติ สถานะห้อง และการคำนวณผลประเมิน 27 กรณี

## เผยแพร่ Firebase Hosting
บัญชี Google ที่ใช้ต้องมีสิทธิ์ในโปรเจกต์ปลายทาง
```sh
npm install -g firebase-tools
firebase login
npm run rules:generate
npm run build
firebase deploy --only hosting,database --project meetingroom0073-0081
```
หากเปลี่ยนโปรเจกต์ให้เปลี่ยน project ID ในคำสั่งด้วย

## โครงสร้าง
- src/pages: หน้าจอผู้ใช้และแอดมิน
- src/components: เมนู โลโก้ และส่วนแสดงห้อง
- src/services: Firebase, สิทธิ์, การจอง, แบบประเมิน และรายงานปัญหา
- src/config: รายชื่อแอดมินและวัตถุประสงค์โครงงาน
- public: โลโก้ ไอคอน และรูปห้องประชุม
- scripts/generate-database-rules.mjs: ตัวสร้าง Security Rules
- tests: ชุดทดสอบ
- database.rules.json: กฎสิทธิ์ Realtime Database
- database.seed.json: ข้อมูลห้องสำหรับเริ่มโปรเจกต์ใหม่
- firebase.json / .firebaserc: การตั้งค่าเผยแพร่
- package.json / package-lock.json: dependencies และคำสั่งใช้งาน

ZIP ไม่รวม node_modules และ dist; npm ci และ npm run build จะสร้างให้
ข้อมูลจริงล่าสุดของ Firebase อยู่ในไฟล์ JSON ที่ส่งแยกต่างหาก

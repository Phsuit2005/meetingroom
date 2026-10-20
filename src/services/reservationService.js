import { ref, push, runTransaction, onValue, query, orderByChild, equalTo, get, update } from 'firebase/database';
import { auth, db } from './firebase.js';
import { getRoomById } from './roomService.js';
import { validateBooking } from './bookingLogic.js';
import { hasAdminAccess } from './adminAccess.js';
import { reviewReservation } from './reviewLogic.js';
import { publicBooking,roomAvailability } from './roomAvailability.js';
const convert=s=>Object.entries(s.val()||{}).map(([id,r])=>({...r,id}));
export function watchMyReservations(onData,onError){const uid=auth.currentUser?.uid;if(!uid){onData([]);return ()=>{}};return onValue(query(ref(db,'reservations'),orderByChild('user_id'),equalTo(uid)),s=>onData(convert(s)),onError)}
export function watchAllReservations(onData,onError){if(!hasAdminAccess(auth.currentUser)){onError(new Error('ต้องเป็นแอดมินที่ยืนยันอีเมลแล้ว'));return ()=>{}};return onValue(ref(db,'reservations'),s=>onData(convert(s)),onError)}
export async function createReservation(roomKey,fields){
 const user=auth.currentUser;if(!user)throw new Error('กรุณาเข้าสู่ระบบก่อนส่งคำขอจอง');const room=await getRoomById(roomKey);
 const booking={...fields,room_id:room?.room_id||roomKey,user_id:user.uid,user_email:user.email,status:'pending',created_at:Date.now(),room_key:roomKey};validateBooking(booking,room);
 const availability=roomAvailability(room,Object.fromEntries((room.booking_slots||[]).map(r=>[r.id,r])),{date:booking.reservation_date,start:booking.start_time,end:booking.end_time});
 if(!availability.canRequest)throw new Error('ช่วงเวลานี้ถูกจองหรือห้องไม่พร้อมใช้งาน กรุณาเลือกเวลาอื่น');
 booking.start_at=Date.parse(`${booking.reservation_date}T${booking.start_time}:00+07:00`);booking.end_at=Date.parse(`${booking.reservation_date}T${booking.end_time}:00+07:00`);
 const id=push(ref(db,'reservations')).key;booking.reservation_id=id;
 await update(ref(db),{[`reservations/${id}`]:booking,[`room_bookings/${id}`]:publicBooking(booking)});return id;
}
export async function cancelReservation(id){
 const uid=auth.currentUser?.uid;if(!uid)throw new Error('กรุณาเข้าสู่ระบบ');
 for(let attempt=0;attempt<3;attempt++){
  const current=(await get(ref(db,`reservations/${id}`))).val();
  if(!current||current.user_id!==uid||!['pending','approved'].includes(current.status)||(current.start_at||Date.parse(`${current.reservation_date}T${current.start_time}:00+07:00`))<=Date.now())throw new Error('ยกเลิกไม่ได้: การประชุมเริ่มแล้ว หรือสถานะเปลี่ยนไป');
  const next={...current,status:'cancelled',cancelled_at:Date.now()};
  try{await update(ref(db),{[`reservations/${id}`]:next,[`room_bookings/${id}`]:publicBooking(next)});return}catch(e){if(attempt===2||!/permission|denied/i.test(e.message))throw e}
 }
}
async function syncBookingIndex(id){
 for(let attempt=0;attempt<3;attempt++){
  const snapshot=await get(ref(db,`reservations/${id}`));if(!snapshot.exists())return;
  try{await update(ref(db,`room_bookings/${id}`),publicBooking(snapshot.val()));return}catch(e){if(attempt===2)throw e}
 }
}
export async function adminReviewReservation(id,action,note=''){
 const user=auth.currentUser;if(!hasAdminAccess(user))throw new Error('ไม่มีสิทธิ์จัดการคำขอจอง');
 const target=ref(db,'reservations');const snapshot=await get(target);const current=snapshot.val()?.[id];
 if(action==='approve'&&current){const room=await getRoomById(current.room_key);if(!room||room.status!=='available')throw new Error('ห้องนี้ไม่พร้อมใช้งานหรือปิดปรับปรุง จึงอนุมัติไม่ได้')}
 let reason='';const result=await runTransaction(target,records=>{try{return reviewReservation(records,id,action,user.email,note)}catch(e){reason=e.message;return;}},{applyLocally:false});
 if(!result.committed)throw new Error(reason||'บันทึกไม่สำเร็จ กรุณาลองใหม่');
 try{await syncBookingIndex(id)}catch{throw new Error('บันทึกสถานะคำขอแล้ว แต่ตารางห้องยังไม่อัปเดต กรุณาตรวจการเชื่อมต่อและรีเฟรชหน้า')}
}
export function databaseError(error){return /permission|denied/i.test(error.message)?'ไม่มีสิทธิ์เข้าถึงข้อมูล หรือสถานะเปลี่ยนไป กรุณารีเฟรชและตรวจบัญชีอีกครั้ง':error.message||'เชื่อมต่อฐานข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง'}

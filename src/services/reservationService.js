import { ref, push, runTransaction, onValue, query, orderByChild, equalTo, get, set } from 'firebase/database';
import { auth, db } from './firebase.js';
import { getRoomById } from './roomService.js';
import { validateBooking } from './bookingLogic.js';
import { hasAdminAccess } from './adminAccess.js';
import { reviewReservation } from './reviewLogic.js';
const convert=s=>Object.entries(s.val()||{}).map(([id,r])=>({...r,id}));
export function watchMyReservations(onData,onError){
  const uid=auth.currentUser?.uid;if(!uid){onData([]);return ()=>{}};
  return onValue(query(ref(db,'reservations'),orderByChild('user_id'),equalTo(uid)),s=>onData(convert(s)),onError);
}
export function watchAllReservations(onData,onError){
  if(!hasAdminAccess(auth.currentUser)){onError(new Error('ต้องเป็นแอดมินที่ยืนยันอีเมลแล้ว'));return ()=>{}};
  return onValue(ref(db,'reservations'),s=>onData(convert(s)),onError);
}
export async function createReservation(roomKey,fields){
  const user=auth.currentUser;if(!user)throw new Error('กรุณาเข้าสู่ระบบก่อนส่งคำขอจอง');
  const room=await getRoomById(roomKey);
  const booking={...fields,room_id:room?.room_id||roomKey,user_id:user.uid,user_email:user.email,status:'pending',created_at:Date.now(),room_key:roomKey};
  validateBooking(booking,room);
  booking.start_at=Date.parse(`${booking.reservation_date}T${booking.start_time}:00+07:00`);
  booking.end_at=Date.parse(`${booking.reservation_date}T${booking.end_time}:00+07:00`);
  const bookingRef=push(ref(db,'reservations'));booking.reservation_id=bookingRef.key;
  await set(bookingRef,booking);
  return bookingRef.key;
}
export async function cancelReservation(id){
  const uid=auth.currentUser?.uid;if(!uid)throw new Error('กรุณาเข้าสู่ระบบ');
  const target=ref(db,`reservations/${id}`);await get(target);
  const result=await runTransaction(target,r=>{
    if(!r||r.user_id!==uid||!['pending','approved'].includes(r.status))return;
    if((r.start_at||Date.parse(`${r.reservation_date}T${r.start_time}:00+07:00`))<=Date.now())return;
    return {...r,status:'cancelled',cancelled_at:Date.now()};
  },{applyLocally:false});
  if(!result.committed)throw new Error('ยกเลิกไม่ได้: การประชุมเริ่มแล้ว หรือสถานะเปลี่ยนไป');
}
export async function adminReviewReservation(id,action,note=''){
  const user=auth.currentUser;if(!hasAdminAccess(user))throw new Error('ไม่มีสิทธิ์จัดการคำขอจอง');
  const target=ref(db,'reservations');await get(target);
  let reason='';
  const result=await runTransaction(target,records=>{
    try{return reviewReservation(records,id,action,user.email,note)}catch(e){reason=e.message;return;}
  },{applyLocally:false});
  if(!result.committed)throw new Error(reason||'บันทึกไม่สำเร็จ กรุณาลองใหม่');
}
export function databaseError(error){return /permission|denied/i.test(error.message)?'ไม่มีสิทธิ์เข้าถึงข้อมูลนี้ กรุณาตรวจบัญชีหรือยืนยันอีเมลแอดมิน':error.message||'เชื่อมต่อฐานข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง';}

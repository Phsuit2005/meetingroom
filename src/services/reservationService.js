import { ref, push, runTransaction, onValue } from 'firebase/database';
import { auth, db } from './firebase.js';
import { getRoomById } from './roomService.js';
import { hasConflict, validateBooking } from './bookingLogic.js';
export function watchReservations(onData,onError){return onValue(ref(db,'reservations'),s=>onData(Object.entries(s.val()||{}).map(([id,r])=>({...r,id}))),onError);}
export async function createReservation(roomKey,fields){
  const user=auth.currentUser;if(!user)throw new Error('กรุณาเข้าสู่ระบบก่อนจอง');
  const room=await getRoomById(roomKey);
  const booking={...fields,room_id:room?.room_id||roomKey,user_id:user.uid,status:'approved',created_at:Date.now(),room_key:roomKey};
  validateBooking(booking,room);
  const id=push(ref(db,'reservations')).key;booking.reservation_id=id;
  const result=await runTransaction(ref(db,'reservations'),records=>{
    if(hasConflict(records,booking))return;
    return {...records,[id]:booking};
  },{applyLocally:false});
  if(!result.committed)throw new Error('ช่วงเวลานี้มีผู้จองแล้ว กรุณาเลือกเวลาอื่น');
  return id;
}
export async function cancelReservation(id){
  const uid=auth.currentUser?.uid;if(!uid)throw new Error('กรุณาเข้าสู่ระบบ');
  const result=await runTransaction(ref(db,`reservations/${id}`),r=>{
    if(!r||r.user_id!==uid||!['pending','approved'].includes(r.status))return;
    if(Date.parse(`${r.reservation_date}T${r.start_time}:00+07:00`)<=Date.now())return;
    return {...r,status:'cancelled',cancelled_at:Date.now()};
  },{applyLocally:false});
  if(!result.committed)throw new Error('ยกเลิกไม่ได้: การจองเริ่มแล้ว หรือสถานะเปลี่ยนไป กรุณาตรวจสอบอีกครั้ง');
}
export function databaseError(error){return /permission|denied/i.test(error.message)?'Firebase ไม่อนุญาตให้เข้าถึงข้อมูล กรุณาติดต่อผู้ดูแลระบบ':error.message||'เชื่อมต่อฐานข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง';}


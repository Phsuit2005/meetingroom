export function overlaps(a,b){return a.start_time < b.end_time && a.end_time > b.start_time;}
export function approvalConflict(records,candidate,candidateId){
 return Object.entries(records||{}).some(([id,r])=>id!==candidateId&&r.status==='approved'&&((r.room_key&&candidate.room_key)?r.room_key===candidate.room_key:r.room_id===candidate.room_id)&&r.reservation_date===candidate.reservation_date&&overlaps(r,candidate));
}
export function reservationEnd(record){
 return Date.parse(`${record.reservation_date}T${record.end_time}:00+07:00`);
}
export function reviewReservation(records,id,action,reviewer,note='',now=Date.now()){
 const current=records?.[id];
 if(!current)throw new Error('ไม่พบคำขอจองนี้');
 if(!['approve','reject','cancel'].includes(action))throw new Error('คำสั่งไม่ถูกต้อง');
 if(action==='cancel'?!['pending','approved'].includes(current.status):current.status!=='pending')throw new Error('สถานะเปลี่ยนแล้ว กรุณาตรวจสอบอีกครั้ง');
 if(action==='approve'){
  const end=reservationEnd(current);
  if(!Number.isFinite(end)||end<=now)throw new Error('รายการนี้เลยเวลาสิ้นสุดแล้ว ไม่สามารถอนุมัติได้ กรุณาให้ผู้จองส่งคำขอวันเวลาใหม่');
  if(approvalConflict(records,current,id))throw new Error('อนุมัติไม่ได้: มีการจองที่อนุมัติแล้วในช่วงเวลาเดียวกัน');
 }
 const updated={...current,status:{approve:'approved',reject:'rejected',cancel:'cancelled'}[action],reviewed_by:reviewer,reviewed_at:now,admin_note:String(note).trim().slice(0,500)};
 if(action==='cancel')updated.cancelled_at=now;
 return {...records,[id]:updated};
}

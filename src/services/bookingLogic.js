export function bangkokToday(now = new Date()) {
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const value=type=>parts.find(p=>p.type===type).value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}
export function overlaps(a,b){return a.start_time < b.end_time && a.end_time > b.start_time;}
export function validateBooking(booking,room,now=Date.now()) {
  if(!room || room.status?.toLowerCase()!=='available') throw new Error('ห้องนี้ไม่พร้อมใช้งาน');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(booking.reservation_date)||!/^\d{2}:\d{2}$/.test(booking.start_time)||!/^\d{2}:\d{2}$/.test(booking.end_time)) throw new Error('กรุณาระบุวันและเวลาให้ครบ');
  const start=Date.parse(`${booking.reservation_date}T${booking.start_time}:00+07:00`);
  const end=Date.parse(`${booking.reservation_date}T${booking.end_time}:00+07:00`);
  if(!Number.isFinite(start)||!Number.isFinite(end)||start<=now) throw new Error('กรุณาเลือกเวลาในอนาคต (เวลาประเทศไทย)');
  if(end<=start) throw new Error('เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่ม');
  if(booking.start_time<(room.open_time||'08:00')||booking.end_time>(room.close_time||'18:00')) throw new Error('กรุณาจองภายในเวลาเปิดให้บริการของห้อง');
  if(!Number.isInteger(booking.attendees)||booking.attendees<1||booking.attendees>Number(room.capacity)) throw new Error('จำนวนผู้เข้าร่วมเกินความจุห้องหรือไม่ถูกต้อง');
  if(!booking.purpose?.trim()||booking.purpose.trim().length>200) throw new Error('กรุณาระบุหัวข้อประชุม ไม่เกิน 200 ตัวอักษร');
}
export function hasConflict(records,booking){return Object.values(records||{}).some(r=>r.room_id===booking.room_id&&r.reservation_date===booking.reservation_date&&['pending','approved'].includes(r.status)&&overlaps(r,booking));}

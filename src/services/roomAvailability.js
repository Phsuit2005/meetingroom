export const ROOM_STATUS_LABELS={available:'พร้อมใช้งาน',unavailable:'ไม่พร้อมใช้งาน',maintenance:'ปิดปรับปรุง',booked:'ไม่พร้อมใช้งาน (มีการจอง)',pending:'ไม่พร้อมใช้งาน (รออนุมัติ)'};
export function publicBooking(record){
 return Object.fromEntries(['room_id','room_key','reservation_date','start_time','end_time','start_at','end_at','status'].filter(k=>record[k]!==undefined).map(k=>[k,record[k]]));
}
export function activeRoomBookings(room,records,now=Date.now()){
 return Object.entries(records||{}).filter(([,r])=>['pending','approved'].includes(r.status)&&(r.room_key===room.id||r.room_id===room.room_id)&&Number(r.end_at||Date.parse(`${r.reservation_date}T${r.end_time}:00+07:00`))>now).map(([id,r])=>({...r,id})).sort((a,b)=>(a.reservation_date+a.start_time).localeCompare(b.reservation_date+b.start_time));
}
export function roomAvailability(room,records,{date,start,end,now=Date.now()}={}){
 const manual=room.status?.toLowerCase()||'unavailable';
 const slots=activeRoomBookings(room,records,now).filter(r=>!date||r.reservation_date===date);
 const conflicts=slots.filter(r=>!start||!end||(start<r.end_time&&end>r.start_time));
 const state=manual!=='available'?manual:conflicts.length?(conflicts.some(r=>r.status==='approved')?'booked':'pending'):'available';
 return {state,label:ROOM_STATUS_LABELS[state]||ROOM_STATUS_LABELS.unavailable,note:room.status_note||'',slots,conflicts,canRequest:manual==='available'&&(!(start&&end)||conflicts.length===0)};
}
export function decorateRoom(room,records,now=Date.now()){
 const availability=roomAvailability(room,records,{now});return {...room,display_status:availability.state,display_label:availability.label,booking_slots:availability.slots};
}

import {ref,get,onValue,update} from 'firebase/database';
import {auth,db} from './firebase.js';
import {hasAdminAccess} from './adminAccess';
import {decorateRoom} from './roomAvailability.js';
const rows=data=>Object.entries(data||{}).map(([id,r])=>({...r,id}));
export async function getRooms(){const [rooms,bookings]=await Promise.all([get(ref(db,'meeting_rooms')),get(ref(db,'room_bookings'))]);return rows(rooms.val()).map(r=>decorateRoom(r,bookings.val()))}
export async function getRoomById(id){const [room,bookings]=await Promise.all([get(ref(db,`meeting_rooms/${id}`)),get(ref(db,'room_bookings'))]);return room.exists()?decorateRoom({...room.val(),id},bookings.val()):null}
export function watchRooms(onData,onError){let rooms={},bookings={},roomReady=false,bookingReady=false;const emit=()=>{if(roomReady&&bookingReady)onData(rows(rooms).map(r=>decorateRoom(r,bookings)))};const stopRooms=onValue(ref(db,'meeting_rooms'),s=>{rooms=s.val()||{};roomReady=true;emit()},onError);const stopBookings=onValue(ref(db,'room_bookings'),s=>{bookings=s.val()||{};bookingReady=true;emit()},onError);const timer=setInterval(emit,30000);return ()=>{stopRooms();stopBookings();clearInterval(timer)}}
export function watchRoom(id,onData,onError){return watchRooms(rooms=>onData(rooms.find(r=>r.id===id)||null),onError)}
export async function setRoomStatus(id,status,note){const user=auth.currentUser;if(!hasAdminAccess(user))throw new Error('ไม่มีสิทธิ์จัดการห้องประชุม');if(!['available','unavailable','maintenance'].includes(status))throw new Error('สถานะห้องไม่ถูกต้อง');await update(ref(db,`meeting_rooms/${id}`),{status,status_note:String(note||'').trim().slice(0,500),status_updated_by:user.email,status_updated_at:Date.now()})}

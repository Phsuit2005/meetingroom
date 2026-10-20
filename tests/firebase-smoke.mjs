import {signInAnonymously,createUserWithEmailAndPassword,deleteUser} from 'firebase/auth';
import {remove,ref,get} from 'firebase/database';
import {auth,db} from '../src/services/firebase.js';
import {createReservation,cancelReservation} from '../src/services/reservationService.js';
const ids=[];let user;
try {
 const email=`qa-meeting-${Date.now()}@example.com`;
 user=(await createUserWithEmailAndPassword(auth,email,crypto.randomUUID()+'A9!')).user;
 const fields={reservation_date:'2099-12-30',start_time:'10:00',end_time:'11:00',attendees:1,purpose:'QA temporary booking — remove after test'};
 const outcomes=await Promise.allSettled([createReservation('room_001',fields),createReservation('room_001',fields)]);
 for(const x of outcomes)if(x.status==='fulfilled')ids.push(x.value);
 if(ids.length!==1)throw new Error(`Expected 1 concurrent winner, got ${ids.length}`);
 console.log('PASS: account creation and concurrent booking conflict');
 await get(ref(db,'reservations/'+ids[0]));
 await cancelReservation(ids[0]);
 const cancelled=(await get(ref(db,'reservations/'+ids[0]))).val();
 if(cancelled.status!=='cancelled')throw new Error('Cancellation not saved');
 console.log('PASS: cancellation persisted in Firebase');
 ids.push(await createReservation('room_001',fields));
 console.log('PASS: cancelled time slot can be booked again');
} catch(e){console.error('FAIL:',e.code||'',e.message);process.exitCode=1}
finally {
 if(user){
 const all=(await get(ref(db,'reservations'))).val()||{};
 const owned=Object.entries(all).filter(([,r])=>r.user_id===user.uid).map(([id])=>id);
 await Promise.all(owned.map(id=>remove(ref(db,'reservations/'+id))));
 await deleteUser(user);
 console.log('CLEANUP: temporary reservations and account removed');
 }
 process.exit(process.exitCode||0);
}

import {useState} from 'react';
import {sendEmailVerification} from 'firebase/auth';
import {useAuth} from '../services/AuthContext';
export default function VerifyAdminPage(){
 const {user,refreshAccount}=useAuth();const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 async function send(){setBusy(true);setError('');try{await sendEmailVerification(user);setMessage('ส่งลิงก์ยืนยันแล้ว กรุณาเปิดกล่องจดหมายและกดลิงก์ จากนั้นกลับมากดตรวจสอบอีกครั้ง')}catch(e){setError(e.code==='auth/too-many-requests'?'ส่งคำขอหลายครั้งเกินไป กรุณารอสักครู่':'ส่งลิงก์ไม่ได้ กรุณาลองใหม่ภายหลัง')}finally{setBusy(false)}}
 async function refresh(){setBusy(true);setError('');try{await refreshAccount();if(!user.emailVerified)setMessage('ยังไม่พบการยืนยัน กรุณากดลิงก์ในอีเมลก่อน')}catch{setError('ตรวจสอบไม่สำเร็จ กรุณาเข้าสู่ระบบใหม่')}finally{setBusy(false)}}
 return <main className="workspace-page"><section className="surface verify-admin"><span className="eyebrow">ADMIN VERIFICATION</span><h1>ยืนยันอีเมลเพื่อใช้สิทธิ์แอดมิน</h1><p>บัญชี {user.email} อยู่ในรายชื่อแอดมิน แต่ต้องยืนยันว่าเป็นเจ้าของอีเมลก่อน</p>{message&&<p className="notice success" role="status">{message}</p>}{error&&<p className="notice error" role="alert">{error}</p>}<div className="dialog-actions"><button className="primary-button" disabled={busy} onClick={send}>ส่งลิงก์ยืนยันอีเมล</button><button className="secondary-button" disabled={busy} onClick={refresh}>ยืนยันแล้ว ตรวจสอบอีกครั้ง</button></div></section></main>
}

import {ref,set,push,update,onValue,query,orderByChild,equalTo,serverTimestamp} from 'firebase/database';
import {auth,db} from './firebase';
import {validateScores,ISSUE_STATUSES} from './feedbackLogic';
const rows=s=>Object.entries(s.val()||{}).map(([id,r])=>({...r,id})).sort((a,b)=>(b.created_at||b.updated_at||0)-(a.created_at||a.updated_at||0));
function user(){if(!auth.currentUser)throw new Error('กรุณาเข้าสู่ระบบก่อนส่งข้อมูล');return auth.currentUser;}
export function watchMySurvey(uid,done,error){return onValue(ref(db,'satisfaction_surveys/'+uid),s=>done(s.val()),error);}
export function watchMyIssues(uid,done,error){return onValue(query(ref(db,'issue_reports'),orderByChild('user_id'),equalTo(uid)),s=>done(rows(s)),error);}
export function watchSurveys(done,error){return onValue(ref(db,'satisfaction_surveys'),s=>done(rows(s)),error);}
export function watchIssues(done,error){return onValue(ref(db,'issue_reports'),s=>done(rows(s)),error);}
export async function saveSurvey(scores,comment){const u=user();validateScores(scores);await set(ref(db,'satisfaction_surveys/'+u.uid),{user_id:u.uid,user_email:u.email,scores,comment:String(comment).trim().slice(0,1000),updated_at:serverTimestamp()});}
export async function submitIssue(fields){const u=user(),title=fields.title.trim(),description=fields.description.trim(),page=fields.page.trim();if(!title||!description)throw new Error('กรุณากรอกหัวข้อและรายละเอียดปัญหา');const record=push(ref(db,'issue_reports'));await set(record,{user_id:u.uid,user_email:u.email,title,description,page,steps:fields.steps.trim(),severity:fields.severity,status:'open',admin_note:'',updated_by:'',created_at:serverTimestamp(),updated_at:serverTimestamp()});return record.key;}
export async function reviewIssue(id,status,note){const u=user();if(!ISSUE_STATUSES[status])throw new Error('สถานะไม่ถูกต้อง');await update(ref(db,'issue_reports/'+id),{status,admin_note:note.trim().slice(0,1000),updated_by:u.email,updated_at:serverTimestamp()});}

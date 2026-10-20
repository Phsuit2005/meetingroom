export const QUESTIONS=[
 ['ease','ความพึงพอใจต่อความสะดวกในการใช้งาน'],
 ['clarity','ความพึงพอใจต่อความชัดเจนของข้อมูลห้องและสถานะการจอง'],
 ['booking','ความพึงพอใจต่อขั้นตอนการจองและการติดตามผล'],
 ['speed','ความพึงพอใจต่อความรวดเร็วในการตอบสนองของระบบ'],
 ['overall','ความพึงพอใจโดยรวมต่อระบบ']
];
export const ISSUE_STATUSES={open:'รับแจ้งแล้ว',in_progress:'กำลังแก้ไข',resolved:'แก้ไขแล้ว'};
export const SEVERITIES={low:'เล็กน้อย',medium:'กระทบการใช้งานบางส่วน',high:'ไม่สามารถใช้งานได้'};
export function validateScores(scores){if(!QUESTIONS.every(([k])=>Number.isInteger(scores[k])&&scores[k]>=1&&scores[k]<=5))throw new Error('กรุณาให้คะแนนครบทุกข้อ ตั้งแต่ 1 ถึง 5');return scores;}
export function summarizeSurveys(rows){
 const valid=rows.filter(r=>QUESTIONS.every(([k])=>Number.isInteger(r.scores?.[k])&&r.scores[k]>=1&&r.scores[k]<=5));
 const count=valid.length;
 const means=Object.fromEntries(QUESTIONS.map(([k])=>[k,count?valid.reduce((sum,r)=>sum+r.scores[k],0)/count:null]));
 return {count,means,average:count?Object.values(means).reduce((a,b)=>a+b,0)/QUESTIONS.length:null,distribution:[1,2,3,4,5].map(score=>valid.filter(r=>r.scores.overall===score).length)};
}

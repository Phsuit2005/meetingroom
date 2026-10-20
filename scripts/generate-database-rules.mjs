import fs from 'node:fs';
const admins=JSON.parse(fs.readFileSync(new URL('../src/config/admins.json',import.meta.url),'utf8').replace(/^\uFEFF/,''));
const admin=`auth != null && auth.token.email_verified == true && (${admins.map(e=>`auth.token.email == '${e}'`).join(' || ')})`;
const immutable=['user_id','user_email','room_id','room_key','reservation_id','reservation_date','start_time','end_time','attendees','purpose','start_at','end_at','created_at','reviewed_by','reviewed_at','admin_note','source'];
const equal=immutable.map(k=>`newData.child('${k}').val() == data.child('${k}').val()`).join(' && ');
const create="!data.exists() && newData.child('user_id').val() == auth.uid && newData.child('user_email').val() == auth.token.email && newData.child('status').val() == 'pending' && newData.child('reservation_id').val() == $id && newData.child('created_at').isNumber() && newData.child('created_at').val() >= now - 60000 && newData.child('created_at').val() <= now + 60000 && newData.child('start_at').isNumber() && newData.child('start_at').val() > now && newData.child('end_at').isNumber() && newData.child('end_at').val() > newData.child('start_at').val() && !newData.hasChild('reviewed_by') && !newData.hasChild('reviewed_at') && !newData.hasChild('admin_note') && !newData.hasChild('cancelled_at') && root.child('meeting_rooms').child(newData.child('room_key').val()).child('status').val() == 'available' && root.child('meeting_rooms').child(newData.child('room_key').val()).child('room_id').val() == newData.child('room_id').val() && newData.child('attendees').val() <= root.child('meeting_rooms').child(newData.child('room_key').val()).child('capacity').val() && newData.child('start_time').val() >= root.child('meeting_rooms').child(newData.child('room_key').val()).child('open_time').val() && newData.child('end_time').val() <= root.child('meeting_rooms').child(newData.child('room_key').val()).child('close_time').val()";
const cancel=`data.exists() && data.child('user_id').val() == auth.uid && (data.child('status').val() == 'pending' || data.child('status').val() == 'approved') && data.child('start_at').val() > now && newData.child('status').val() == 'cancelled' && newData.child('cancelled_at').isNumber() && newData.child('cancelled_at').val() >= now - 60000 && newData.child('cancelled_at').val() <= now + 60000 && ${equal}`;
const row={
 '.read':`auth != null && (data.child('user_id').val() == auth.uid || (${admin}))`,
 '.write':`auth != null && newData.exists() && ((${create}) || (${cancel}))`,
 '.validate':`(${admin}) || data.exists() || (newData.hasChildren(['reservation_id','user_id','user_email','room_id','room_key','reservation_date','start_time','end_time','start_at','end_at','created_at','attendees','purpose','status']) && newData.child('attendees').isNumber() && newData.child('attendees').val() >= 1 && newData.child('attendees').val() % 1 == 0 && newData.child('purpose').isString() && newData.child('purpose').val().length > 0 && newData.child('purpose').val().length <= 200 && newData.child('reservation_date').isString() && newData.child('reservation_date').val().matches(/^\\d{4}-\\d{2}-\\d{2}$/) && newData.child('start_time').isString() && newData.child('start_time').val().matches(/^([01][0-9]|2[0-3]):[0-5][0-9]$/) && newData.child('end_time').isString() && newData.child('end_time').val().matches(/^([01][0-9]|2[0-3]):[0-5][0-9]$/) && newData.child('start_time').val() < newData.child('end_time').val())`
};
for(const k of [...immutable,'status','cancelled_at'])row[k]={'.validate':true};
row.$other={'.validate':false};
const rules={rules:{'.read':false,'.write':false,meeting_rooms:{'.read':true,'.write':false},reservations:{'.read':`(${admin}) || (auth != null && query.orderByChild == 'user_id' && query.equalTo == auth.uid)`,'.write':`(${admin}) && newData.exists()`,'.indexOn':['user_id'],'$id':row},users:{'.read':admin,'$uid':{'.read':'auth != null && auth.uid == $uid','.write':false}}}};

const projectionFields=['room_id','room_key','reservation_date','start_time','end_time','start_at','end_at','status'];
const linkedIndex=projectionFields.map(k=>"newData.parent().parent().child('room_bookings').child($id).child('"+k+"').val() == newData.child('"+k+"').val()").join(' && ');
row['.validate']='('+row['.validate']+') && ((('+admin+") && newData.child('status').val() == 'approved') || ("+linkedIndex+'))';
row['.validate']='('+row['.validate']+") && (!(data.child('status').val() == 'pending' && newData.child('status').val() == 'approved') || root.child('meeting_rooms').child(newData.child('room_key').val()).child('status').val() == 'available')";
const roomWrite='('+admin+') && data.parent().exists() && newData.exists()';
rules.rules.meeting_rooms={'.read':true,'$room':{
 status:{'.write':roomWrite,'.validate':"newData.isString() && (newData.val() == 'available' || newData.val() == 'unavailable' || newData.val() == 'maintenance')"},
 status_note:{'.write':roomWrite,'.validate':"newData.isString() && newData.val().length <= 500"},
 status_updated_by:{'.write':roomWrite,'.validate':"newData.val() == auth.token.email"},
 status_updated_at:{'.write':roomWrite,'.validate':"newData.isNumber() && newData.val() >= now - 60000 && newData.val() <= now + 60000"}
}};
const futureSource="newData.parent().parent().child('reservations').child($id)";
const projection={'.write':'auth != null && newData.exists() && (('+admin+') || '+futureSource+".child('user_id').val() == auth.uid)",'.validate':"newData.hasChildren(['"+projectionFields.join("','")+"']) && "+projectionFields.map(k=>"newData.child('"+k+"').val() == "+futureSource+".child('"+k+"').val()").join(' && '),'$other':{'.validate':false}};
for(const k of projectionFields)projection[k]={'.validate':true};
rules.rules.room_bookings={'.read':true,'.indexOn':['room_key'],'$id':projection};


const stamp="newData.isNumber() && newData.val() >= now - 60000 && newData.val() <= now + 60000";
const bounded=max=>({'.validate':"newData.isString() && newData.val().length <= "+max});
const score={'.validate':"newData.isNumber() && newData.val() >= 1 && newData.val() <= 5 && newData.val() % 1 == 0"};
const scoreKeys=['ease','clarity','booking','speed','overall'];
rules.rules.satisfaction_surveys={'.read':admin,'$uid':{
 '.read':'auth != null && auth.uid == $uid',
 '.write':"auth != null && auth.uid == $uid && newData.exists() && newData.child('user_id').val() == auth.uid && newData.child('user_email').val() == auth.token.email",
 '.validate':"newData.hasChildren(['user_id','user_email','scores','comment','updated_at'])",
 user_id:bounded(128),user_email:bounded(254),comment:bounded(1000),updated_at:{'.validate':stamp},
 scores:{'.validate':"newData.hasChildren(['"+scoreKeys.join("','")+"'])",'$other':{'.validate':false},...Object.fromEntries(scoreKeys.map(k=>[k,score]))},
 '$other':{'.validate':false}
}};
const issueFields=['user_id','user_email','title','description','page','steps','severity','created_at'];
const issueSame=issueFields.map(k=>"newData.child('"+k+"').val() == data.child('"+k+"').val()").join(' && ');
const issueCreate="!data.exists() && newData.child('user_id').val() == auth.uid && newData.child('user_email').val() == auth.token.email && newData.child('status').val() == 'open' && newData.child('admin_note').val() == '' && newData.child('updated_by').val() == '' && newData.child('created_at').isNumber() && newData.child('created_at').val() >= now - 60000 && newData.child('created_at').val() <= now + 60000";
rules.rules.issue_reports={
 '.read':'('+admin+") || (auth != null && query.orderByChild == 'user_id' && query.equalTo == auth.uid)",
 '.indexOn':['user_id'],
 '$id':{
 '.read':'auth != null && (data.child(\'user_id\').val() == auth.uid || ('+admin+'))',
 '.write':'auth != null && newData.exists() && (('+issueCreate+') || (('+admin+') && data.exists() && '+issueSame+" && newData.child('updated_by').val() == auth.token.email))",
 '.validate':"newData.hasChildren(['user_id','user_email','title','description','page','steps','severity','status','admin_note','updated_by','created_at','updated_at'])",
 user_id:bounded(128),user_email:bounded(254),title:{'.validate':"newData.isString() && newData.val().length > 0 && newData.val().length <= 120"},description:{'.validate':"newData.isString() && newData.val().length > 0 && newData.val().length <= 2000"},page:bounded(200),steps:bounded(1000),admin_note:bounded(1000),updated_by:bounded(254),
 severity:{'.validate':"newData.val() == 'low' || newData.val() == 'medium' || newData.val() == 'high'"},
 status:{'.validate':"newData.val() == 'open' || newData.val() == 'in_progress' || newData.val() == 'resolved'"},
 created_at:{'.validate':'newData.isNumber()'},updated_at:{'.validate':stamp},'$other':{'.validate':false}
}};

fs.writeFileSync(new URL('../database.rules.json',import.meta.url),JSON.stringify(rules,null,2)+'\n');
console.log('Generated database rules for '+admins.length+' verified admin emails');

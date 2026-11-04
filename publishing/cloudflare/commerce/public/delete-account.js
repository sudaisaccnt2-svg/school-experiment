import {api,message} from './client.js';
const form=document.getElementById('externalDeleteForm');
form.onsubmit=async event=>{
  event.preventDefault();event.submitter.disabled=true;
  const username=document.getElementById('externalDeleteUsername').value.trim().toLowerCase();
  try{
    const result=await api('student-delete-account',{username,confirmation:username,currentPassword:document.getElementById('externalDeletePassword').value,confirmSubscription:document.getElementById('externalDeleteConfirmed').checked});
    form.reset();form.hidden=true;message(result.message);
  }catch(error){message(error.message);event.submitter.disabled=false;}
};

// Recovery codes remain in this page's memory until the student saves them.
// No password, recovery code or session token is put into localStorage.
import {api,message} from './client.js';
const $=id=>document.getElementById(id);
let savedCode='',savedUsername='';
export function showStudentRecovery(result){
  savedCode=result.recoveryCode;savedUsername=result.username;
  $('saveRecovery').hidden=false;
  $('savedUsername').textContent=result.username;
  $('savedRecoveryCode').value=savedCode;
  $('recoverySaved').checked=false;
  $('continueAccount').disabled=true;
  $('saveRecovery').scrollIntoView({block:'start',behavior:'smooth'});
}
export function configureStudentAccount(state){
  if(state.config.studentAuthMode!=='username')return;
  $('email').type='text';$('email').autocomplete='username';$('email').minLength=3;$('email').maxLength=32;
  $('email').pattern='[A-Za-z][A-Za-z0-9_\\-]{2,31}';
  document.querySelector('label[for="email"]').textContent='Student username';
  document.querySelector('label[for="password"]').textContent='Password - at least 15 characters';
  $('password').minLength=15;
  $('authHint').textContent='Choose your own username. No email account is needed. Save the recovery code shown when you create your account.';
  $('reset').textContent='Use recovery code';
  $('reset').onclick=()=>{$('studentRecovery').hidden=!$('studentRecovery').hidden;$('recoveryUsername').value=$('email').value;if(!$('studentRecovery').hidden)$('studentRecovery').scrollIntoView({block:'start',behavior:'smooth'});};
  $('changeStudentPassword').hidden=!state.user || state.membership.owner;
  $('showDeleteAccount').hidden=!state.user || state.membership.owner;
  $('showDeleteAccount').onclick=()=>{$('deleteAccountPanel').hidden=false;$('deleteUsername').value='';$('deleteAccountPanel').scrollIntoView({block:'start',behavior:'smooth'});};
  if(location.hash==='#delete-account' && state.user && !state.membership.owner)$('showDeleteAccount').click();
  $('cancelDeleteAccount').onclick=()=>{$('deleteAccountPanel').hidden=true;$('deleteAccountForm').reset();};
  $('deleteAccountForm').onsubmit=async event=>{
    event.preventDefault();const button=event.submitter;button.disabled=true;
    try{await api('student-delete-account',{currentPassword:$('deletePassword').value,confirmation:$('deleteUsername').value,confirmSubscription:$('deleteSubscriptionConfirmed').checked});$('deleteAccountForm').reset();location.replace('/delete-account?deleted=1');}
    catch(error){message(error.message);button.disabled=false;}
  };
  $('changeStudentPassword').onclick=()=>{$('studentPassword').hidden=!$('studentPassword').hidden;};
  $('studentRecoveryForm').onsubmit=async event=>{
    event.preventDefault();try{
      const result=await api('student-recover',{username:$('recoveryUsername').value,recoveryCode:$('studentRecoveryCode').value,password:$('recoveryPassword').value});
      $('studentRecoveryForm').reset();$('studentRecovery').hidden=true;showStudentRecovery(result);
    }catch(error){message(error.message);}
  };
  $('studentPasswordForm').onsubmit=async event=>{
    event.preventDefault();try{
      const result=await api('student-change-password',{currentPassword:$('currentStudentPassword').value,password:$('nextStudentPassword').value});
      $('studentPasswordForm').reset();$('studentPassword').hidden=true;showStudentRecovery(result);
    }catch(error){message(error.message);}
  };
  $('copyRecovery').onclick=async()=>{
    try{await navigator.clipboard.writeText('Username: '+savedUsername+'\nRecovery code: '+savedCode);message('Recovery details copied. Save them somewhere private.');}
    catch{$('savedRecoveryCode').focus();$('savedRecoveryCode').select();message('Select the recovery code and copy it.');}
  };
  $('downloadRecovery').onclick=()=>{
    const text='Asawera student account\nUsername: '+savedUsername+'\nRecovery code: '+savedCode+'\n\nUse this code to reset your password at '+location.origin+'/account. Do not share it.\n';
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='asawera-recovery-'+savedUsername+'.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  $('recoverySaved').onchange=()=>{$('continueAccount').disabled=!$('recoverySaved').checked;};
  $('continueAccount').onclick=()=>{if(!$('recoverySaved').checked)return;savedCode='';savedUsername='';$('savedRecoveryCode').value='';location.replace('/account');};
}

import {api,session,message} from './client.js';
const $=id=>document.getElementById(id);
try {
  const state=await session;
  if(state.membership.owner) location.replace('/control-room');
  else {
    const setup=await api('owner-login');
    if(setup.ownerPasswordReady) { $('ownerLoginStatus').textContent='Use your private website owner email and password.';$('ownerPasswordForm').hidden=false; }
    else if(setup.ownerAccessReady) { $('ownerLoginStatus').textContent='Sign in with Cloudflare Access. The code goes directly to your approved email.'; $('accessLogin').href=setup.loginUrl;$('accessLogin').hidden=false; }
    else if(setup.accountsReady) { $('ownerLoginStatus').textContent='Sign in using the website owner account.';$('accountLogin').hidden=false; }
    else $('ownerLoginStatus').textContent='The private dashboard is built, but owner sign-in still needs to be connected. Cloudflare Access can provide an email code for the owner.';
  }
} catch(error){message(error.message);$('ownerLoginStatus').textContent='Connect to the internet to sign in.';}
$('ownerPasswordForm').addEventListener('submit',async event=>{
  event.preventDefault();$('ownerPasswordSubmit').disabled=true;
  try {
    await api('owner-password-login',{email:$('ownerEmail').value,password:$('ownerPassword').value});
    $('ownerPassword').value='';location.replace('/control-room');
  } catch(error){$('ownerPassword').value='';message(error.message);$('ownerPasswordSubmit').disabled=false;}
});

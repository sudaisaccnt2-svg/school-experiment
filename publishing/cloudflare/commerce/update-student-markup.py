"""Extend only business overlay markup; leave shared lesson sources untouched."""
from pathlib import Path
here=Path(__file__).resolve().parent
account=here/'public/account.html'
text=account.read_text(encoding='utf-8')
if 'id="saveRecovery"' not in text:
    text=text.replace('<form id="authForm">','<p id="authHint" class="muted"></p><form id="authForm">')
    text=text.replace('<button id="logout">Sign out</button>','<button id="logout">Sign out</button><button id="changeStudentPassword" type="button" hidden>Change password</button>')
    panels='''
<section id="saveRecovery" class="panel" hidden><h2>Save your recovery code</h2><p>Username: <strong id="savedUsername"></strong></p><p>This code resets your password if you forget it. Keep it private. A new code replaces the previous one after a password reset or change.</p><label for="savedRecoveryCode">Your recovery code</label><textarea id="savedRecoveryCode" readonly autocomplete="off" spellcheck="false"></textarea><button id="copyRecovery" type="button">Copy recovery details</button><button id="downloadRecovery" type="button">Download recovery file</button><label><input id="recoverySaved" type="checkbox"> I have saved my recovery code</label><button id="continueAccount" class="primary" type="button" disabled>Continue to my account</button></section>
<section id="studentRecovery" class="panel" hidden><h2>Reset with your recovery code</h2><form id="studentRecoveryForm"><label for="recoveryUsername">Student username</label><input id="recoveryUsername" autocomplete="username" minlength="3" maxlength="32" required><label for="studentRecoveryCode">Recovery code</label><input id="studentRecoveryCode" autocomplete="off" maxlength="36" required><label for="recoveryPassword">New password - at least 15 characters</label><input id="recoveryPassword" type="password" autocomplete="new-password" minlength="15" maxlength="128" required><button class="primary">Reset password</button></form></section>
<section id="studentPassword" class="panel" hidden><h2>Change your password</h2><form id="studentPasswordForm"><label for="currentStudentPassword">Current password</label><input id="currentStudentPassword" type="password" autocomplete="current-password" maxlength="128" required><label for="nextStudentPassword">New password - at least 15 characters</label><input id="nextStudentPassword" type="password" autocomplete="new-password" minlength="15" maxlength="128" required><button class="primary">Change password</button></form></section>
'''
    text=text.replace('<section class="panel"><h2>Ad-free Pro</h2>',panels+'<section class="panel"><h2>Ad-free Pro</h2>')
    account.write_text(text,encoding='utf-8')
room=here/'control-room.html';text=room.read_text(encoding='utf-8')
text=text.replace('Student email','Student username or email').replace('id="memberEmail" type="email"','id="memberEmail" type="text"')
text=text.replace('Student sign-in and email delivery must be connected first.','Student sign-in must be ready before opening registration. Students save their recovery codes when they create accounts.')
text=text.replace('Search email, name or class','Search username, email, name or class').replace('<th>Email</th>','<th>Username / email</th>')
room.write_text(text,encoding='utf-8')
privacy=here/'public/privacy.html';text=privacy.read_text(encoding='utf-8')
text=text.replace('When accounts are connected, verified email addresses identify accounts.','Students can create accounts using a username and password without an email address. Usernames identify website-managed accounts; they are not verified email addresses. If an external email sign-in provider is connected, that provider verifies its own identities.')
text=text.replace("Passwords are not stored in this website's database.","Plain passwords and recovery codes are not stored. Website-managed student accounts store salted password verifiers protected by a server secret, recovery-code hashes, and hashed session tokens in the private database. Student sessions expire after 30 days and signing out revokes that session. Resetting or changing a password revokes the account's old sessions and recovery code. Recovery codes can be copied or downloaded by the student; the website does not save them in browser local storage.")
privacy.write_text(text,encoding='utf-8')
ui=here/'public/business-room.js';text=ui.read_text(encoding='utf-8').replace('Connect student authentication and email delivery','Connect student sign-in')
ui.write_text(text,encoding='utf-8')
print('Student account, recovery and owner forms updated in the publishing overlay.')

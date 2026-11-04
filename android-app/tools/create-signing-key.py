"""Create a private app signing key once. Never print or package its password."""
import os,secrets,subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1];private=root/'private-signing';private.mkdir(exist_ok=True)
key=private/'asawera.p12';password_file=private/'password.txt';properties=private/'signing.properties'
if key.exists():
 assert password_file.exists() and properties.exists(),'Existing key is missing its private configuration.'
 print('Existing private app signing key preserved.')
else:
 password=secrets.token_hex(32);password_file.write_text(password,encoding='utf-8');properties.write_text('password='+password+'\n',encoding='utf-8');(private/'.gitignore').write_text('*\n',encoding='utf-8')
 account=os.environ['USERDOMAIN']+'\\'+os.environ['USERNAME']
 subprocess.run(['icacls',str(private),'/inheritance:r','/grant:r',account+':(OI)(CI)F'],check=True,capture_output=True)
 command=[r'C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe','-genkeypair','-alias','asawera','-keyalg','RSA','-keysize','3072','-validity','10000','-storetype','PKCS12','-keystore',str(key),'-storepass:file',str(password_file),'-dname','CN=Asawera Chemistry','-noprompt']
 result=subprocess.run(command,capture_output=True,text=True);assert result.returncode==0,'Signing key creation failed.'
 print('Created the private owner app signing key; its password remains only in the protected local signing folder.')

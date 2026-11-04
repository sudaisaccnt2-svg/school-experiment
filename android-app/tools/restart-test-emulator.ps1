$ErrorActionPreference='Stop'
$androidTestRoot=Split-Path -Parent $PSScriptRoot
$androidSdk='C:\Users\Sudais\AppData\Local\Android\Sdk'
$androidDevices=& "$androidSdk\platform-tools\adb.exe" devices
if($androidDevices -match '^emulator-5580\s+device'){
    & "$androidSdk\platform-tools\adb.exe" -s emulator-5580 emu kill
    if($LASTEXITCODE -ne 0){throw 'The isolated emulator could not be stopped.'}
}
$env:ANDROID_AVD_HOME=Join-Path $androidTestRoot '.avd'
Start-Process -FilePath "$androidSdk\emulator\emulator.exe" -WindowStyle Hidden -ArgumentList '-avd','AsaweraNativeTest','-port','5580','-no-window','-no-audio','-no-boot-anim','-no-snapshot','-gpu','host','-feature','-Vulkan','-memory','2048' -RedirectStandardOutput (Join-Path $androidTestRoot 'emulator.log') -RedirectStandardError (Join-Path $androidTestRoot 'emulator-errors.log')
Write-Output 'Restarted only AsaweraNativeTest with OpenGL rendering.'

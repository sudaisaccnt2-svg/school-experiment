param([Parameter(Mandatory=$true)][string]$ExpectedTitle)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
$asaweraWindow = Get-Process MultiCoder | Where-Object { $_.MainWindowTitle -eq $ExpectedTitle -and $_.MainWindowHandle -ne 0 } | Select-Object -First 1
if (-not $asaweraWindow) { throw 'The expected browser page is not active.' }
$asaweraRoot = [System.Windows.Automation.AutomationElement]::FromHandle($asaweraWindow.MainWindowHandle)
$asaweraConditions = [System.Windows.Automation.Condition[]]@(
  foreach ($asaweraType in @('Button','Edit','RadioButton','CheckBox','ListItem','ComboBox')) {
    New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ControlTypeProperty, [System.Windows.Automation.ControlType]::$asaweraType)
  }
)
$asaweraCondition = New-Object System.Windows.Automation.OrCondition(,$asaweraConditions)
# Labels and selector attributes only. Never read input values, cookies or credentials.
$asaweraRoot.FindAll([System.Windows.Automation.TreeScope]::Subtree, $asaweraCondition) | ForEach-Object {
  [PSCustomObject]@{ Name=$_.Current.Name; Class=$_.Current.ClassName; AutomationId=$_.Current.AutomationId; Offscreen=$_.Current.IsOffscreen }
} | ConvertTo-Json -Compress

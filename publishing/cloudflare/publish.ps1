param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[a-z0-9][a-z0-9-]{0,57}[a-z0-9]$')]
    [string]$ProjectName,
    [ValidatePattern('^[a-f0-9]{12}$')]
    [string]$ReleaseVersion,
    [switch]$Login,
    [switch]$CreateProject
)
$ErrorActionPreference = 'Stop'
$accountTarget = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'account-target.json') -Raw | ConvertFrom-Json
if ($accountTarget.migrationPending) {
    throw 'Publishing is paused while the destination is corrected to sudaisaccnt3@gmail.com. Do not use the default account2 login to deploy manually.'
}
if ($ProjectName -ne $accountTarget.projectName) {
    throw 'The project must match the owner-approved destination in account-target.json.'
}
if (-not $accountTarget.publicURL) { throw 'The approved project''s actual pages.dev address must be recorded before publishing.' }
$authArgs = @('--profile', $accountTarget.authProfile)
$releaseReportPath = if ($ReleaseVersion) { Join-Path $PSScriptRoot "releases/$ReleaseVersion.json" } else { Join-Path $PSScriptRoot 'latest.json' }
$releaseReport = Get-Content -LiteralPath $releaseReportPath -Raw | ConvertFrom-Json
if ($releaseReport.browserTests -ne 'passed') {
    throw 'Run python publishing/cloudflare/check.py successfully before publishing.'
}
& python (Join-Path $PSScriptRoot 'commerce/check-business-release.py') --report $releaseReportPath
if ($LASTEXITCODE -ne 0) { throw 'The tested snapshot must contain the current business screens and backend before publishing.' }
$releaseRoot = (Resolve-Path -LiteralPath $releaseReport.releaseDirectory).Path
$expectedReleasesRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot 'releases')).Path + [IO.Path]::DirectorySeparatorChar
if (-not $releaseRoot.StartsWith($expectedReleasesRoot, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Release must be a snapshot in this publishing folder.'
}
$npxCommand = Get-Command npx.cmd -ErrorAction SilentlyContinue
$npxPath = if ($npxCommand) { $npxCommand.Source } else { Join-Path $env:ProgramFiles 'nodejs/npx.cmd' }
if (-not (Test-Path -LiteralPath $npxPath)) {
    throw 'Node.js is not available. Use the Cloudflare dashboard and the ZIP listed in latest.json instead.'
}
$installedWrangler = Join-Path $PSScriptRoot '.npm-cache/_npx/c943b712072b77c4/node_modules/wrangler/bin/wrangler.js'
if (Test-Path -LiteralPath $installedWrangler) {
    $wranglerCommand = Join-Path $env:ProgramFiles 'nodejs/node.exe'
    $wranglerPrefix = @($installedWrangler)
} else {
    $wranglerCommand = $npxPath
    $wranglerPrefix = @('--yes', 'wrangler@4')
}
Push-Location -LiteralPath $PSScriptRoot
$previousAccountEnv = $env:CLOUDFLARE_ACCOUNT_ID
$env:CLOUDFLARE_ACCOUNT_ID = $accountTarget.accountID
try {
if (Test-Path -LiteralPath 'wrangler.toml') {
    $configText = Get-Content -LiteralPath 'wrangler.toml' -Raw
    $configuredName = [regex]::Match($configText, '(?m)^name\s*=\s*"([^"]+)"').Groups[1].Value
    $configuredDatabase = [regex]::Match($configText, '(?m)^database_id\s*=\s*"([^"]+)"').Groups[1].Value
    if ($configuredDatabase -ne $accountTarget.databaseID) {
        throw 'The publishing configuration must use the account3 business database recorded in account-target.json.'
    }
    if ($configuredName -and $configuredName -ne $ProjectName) {
        throw 'The publishing configuration contains another project''s database binding. Use a separate configuration for a different project.'
    }
}
if ($Login) {
    & $wranglerCommand @wranglerPrefix auth create $accountTarget.authProfile --scopes account:read user:read pages:write d1:write
    if ($LASTEXITCODE -ne 0) { throw 'Cloudflare login did not complete.' }
}
$identityOutput = & $wranglerCommand @wranglerPrefix whoami --json
if ($LASTEXITCODE -ne 0) { throw 'Could not verify the authorized Cloudflare account.' }
$identity = ($identityOutput -join "`n") | ConvertFrom-Json
if ($identity.email -ne $accountTarget.ownerEmail -or $accountTarget.accountID -notin @($identity.accounts.id)) {
    throw 'Cloudflare identity does not match the approved account3 owner. Reauthorize the asawera-owner3 profile in account3.'
}
if ($CreateProject) {
    # New Wrangler versions delegate new projects to Workers. This release targets Pages directly.
    & $wranglerCommand @wranglerPrefix pages project create $ProjectName --production-branch main --force @authArgs
    if ($LASTEXITCODE -ne 0) { throw 'Project creation did not complete. For an existing project omit -CreateProject.' }
}
& $wranglerCommand @wranglerPrefix pages deploy $releaseRoot --project-name $ProjectName --branch main @authArgs
if ($LASTEXITCODE -ne 0) { throw 'Deployment did not complete.' }
} finally {
    if ($null -eq $previousAccountEnv) {
        Remove-Item Env:CLOUDFLARE_ACCOUNT_ID -ErrorAction SilentlyContinue
    } else {
        $env:CLOUDFLARE_ACCOUNT_ID = $previousAccountEnv
    }
    Pop-Location
}
Write-Host "Published to $($accountTarget.publicURL) using $($accountTarget.ownerEmail)."

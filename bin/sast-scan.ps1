#
# Example script to perform Fortify Static Code Analysis
#

# Parameters
param (
    [Parameter(Mandatory=$false)]
    [ValidateSet('classic','security','devops')]
    [string]$ScanPolicy = "classic",
    [Parameter(Mandatory=$false)]
    [switch]$CreatePDF,
    [Parameter(Mandatory=$false)]
    [switch]$UploadToSSC
)

# Import local environment specific settings
$EnvSettings = $(ConvertFrom-StringData -StringData (Get-Content ".\.env" | Where-Object {-not ($_.StartsWith('#'))} | Out-String))
$AppName = $EnvSettings['SSC_APP_NAME']
$AppVersion = $EnvSettings['SSC_APP_VER_NAME']
$SSCUrl = $EnvSettings['SSC_URL']
$SSCAuthToken = $EnvSettings['SSC_AUTH_TOKEN'] # AnalysisUploadToken or CIToken
$JVMArgs = "-Xss256M"
#$ScanSwitches = "-Dcom.fortify.sca.rules.enable_wi_correlation=true"
$ScanSwitches = "-Dcom.fortify.sca.ProjectRoot=.fortify"

if ([string]::IsNullOrEmpty($AppName)) { throw "Application Name has not been set in '.env'" }
if ([string]::IsNullOrEmpty($AppVersion)) { throw "Application Version has not been set in '.env'" }

# Run the translation and scan

Write-Host Running translation...
& sourceanalyzer $JVMArgs $ScanSwitches -b "$AppName" .

Write-Host Running scan...
& sourceanalyzer '-Dcom.fortify.sca.ProjectRoot=.fortify' $JVMArgs $ScanSwitches -b "$AppName" `
    -verbose -scan-policy $ScanPolicy `
    -rules etc/sast-custom-rules/example-custom-rules.xml -filter etc/sast-filters/example-filter.txt `
    -build-project "$AppName" -build-version "$AppVersion" -build-label "SNAPSHOT" `
    -scan -f "$($AppName).fpr"

# summarise issue count by analyzer
& FPRUtility -information -analyzerIssueCounts -project "$($AppName).fpr"

if ($CreatePDF) {
    Write-Host Generating PDF report...
    & ReportGenerator '-Dcom.fortify.sca.ProjectRoot=.fortify' -user "Demo User" -format pdf -f "$($AppName).pdf" -source "$($AppName).fpr"
}

if ($UploadToSSC) {
    Write-Host Uploading results to SSC...
    & fortifyclient uploadFPR -file "$($AppName).fpr" -url $SSCUrl -authtoken $SSCAuthToken -application $AppName -applicationVersion $AppVersion
}

Write-Host Done.
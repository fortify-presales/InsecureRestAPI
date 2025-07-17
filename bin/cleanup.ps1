
# Import local environment specific settings
$EnvSettings = $(ConvertFrom-StringData -StringData (Get-Content ".\.env" | Where-Object {-not ($_.StartsWith('#'))} | Out-String))
$AppName = $EnvSettings['SSC_APP_NAME']

Write-Host "Removing files..."
Remove-Item -Force -Recurse ".fortify" -ErrorAction SilentlyContinue
Remove-Item "$($AppName)*.fpr" -ErrorAction SilentlyContinue
Remove-Item "$($AppName)*.pdf" -ErrorAction SilentlyContinue
Remove-Item "fod.zip" -ErrorAction SilentlyContinue
Remove-Item "*Package.zip" -ErrorAction SilentlyContinue
Remove-Item "fortifypackage.zip" -ErrorAction SilentlyContinue
Remove-Item -Force -Recurse ".debricked" -ErrorAction SilentlyContinue
Remove-Item -Force -Recurse "dist" -ErrorAction SilentlyContinue
Remove-Item -Force -Recurse "logs" -ErrorAction SilentlyContinue
Remove-Item "*.lock" -ErrorAction SilentlyContinue
Remove-Item "*.log" -ErrorAction SilentlyContinue

Write-Host "Done."

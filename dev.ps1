# PowerShell script to run Next.js dev server
# This works around path issues with special characters

Set-Location -Path $PSScriptRoot
& node ./node_modules/next/dist/bin/next dev

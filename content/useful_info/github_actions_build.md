---
title: GitHub Action Build
author: Martinn
---

GitHub Actions provide a powerful way to automatically build and test your BakkesMod plugins whenever you push code to your repository. This guide will walk you through setting up a GitHub Action workflow that can build your plugin automatically.

## Why Use GitHub Actions?

- **Automated Building**: Automatically build your plugin on every commit or pull request
- **Continuous Integration**: Catch build errors early before they reach users


## Setting Up Your Repository

### 1. Add GitHub Action Workflow

Create a new file in your repository at `.github/workflows/build.yml`:

```yaml
name: Build BakkesMod Plugin

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build:
    runs-on: windows-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4


    - name: Checkout BakkesMod SDK
      uses: actions/checkout@v4
      with:
        repository: bakkesmodorg/BakkesModSDK
        path: bakkesmod\bakkesmodsdk


    - name: Check for vcpkg manifest
      id: vcpkg_check
      shell: pwsh
      run: |
        $manifest = Test-Path "$env:GITHUB_WORKSPACE/vcpkg.json"
        Write-Host "vcpkg manifest present: $manifest"
        echo "vcpkg_manifest=$manifest" | Out-File -FilePath $env:GITHUB_OUTPUT -Append

    - name: Checkout vcpkg
      if: steps.vcpkg_check.outputs.vcpkg_manifest == 'True'
      uses: actions/checkout@v4
      with:
        repository: microsoft/vcpkg
        path: vcpkg

    - name: Bootstrap vcpkg
      if: steps.vcpkg_check.outputs.vcpkg_manifest == 'True'
      run: |
        .\vcpkg\bootstrap-vcpkg.bat

    - name: Integrate vcpkg
      if: steps.vcpkg_check.outputs.vcpkg_manifest == 'True'
      run: |
        .\vcpkg\vcpkg.exe integrate install


    - name: Setup MSBuild
      uses: microsoft/setup-msbuild@v2

    - name: Find solution file
      id: find_sln
      shell: pwsh
      run: |
        $sln = Get-ChildItem -Path $env:GITHUB_WORKSPACE -Filter *.sln -Recurse | Select-Object -First 1
        if ($null -eq $sln) { Write-Error 'No .sln file found!'; exit 1 }
        Write-Host "sln path: $($sln.FullName)"
        echo "SOLUTION_PATH=$($sln.FullName)" | Out-File -FilePath $env:GITHUB_ENV -Append

    - name: Build
      run: msbuild /m /p:Configuration=Release /p:BakkesModPath=$env:GITHUB_WORKSPACE\bakkesmod /p:PostBuildEventUseInBuild=false $env:SOLUTION_PATH


    - name: Prepare build artifacts
      run: |
        # Create artifacts/plugins directory
        New-Item -ItemType Directory -Force -Path "artifacts/plugins"
        
        if (Test-Path "plugins") {
          Get-ChildItem -Path "plugins" -Include "*.dll", "*.pdb" -Recurse | ForEach-Object {
            Copy-Item $_.FullName -Destination "artifacts/plugins" -Force
          }
        }
        
        if (Test-Path "data") {
          Copy-Item -Path "data" -Destination "artifacts/data" -Recurse -Force
        }
        
        Write-Host "Artifacts contents:"
        Get-ChildItem -Path "artifacts" -Recurse

    - name: Create release archive
      run: |
        # Create zip file with timestamp
        $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
        $zipName = "WindowDemo-$timestamp.zip"
        
        if (Test-Path "artifacts") {
          Compress-Archive -Path "artifacts\*" -DestinationPath $zipName
          echo "RELEASE_ZIP=$zipName" >> $env:GITHUB_ENV
        } else {
          Write-Error "No artifacts found to archive"
          exit 1
        }

    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: WindowDemo-Plugin
        path: ${{ env.RELEASE_ZIP }}
        retention-days: 30
```


### 2. Commit and Push

Once you've created the workflow file:

```bash
git add .github/workflows/build.yml
git commit -m "Add GitHub Actions build workflow"
git push
```

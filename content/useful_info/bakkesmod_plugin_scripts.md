---
title: Scripts for BakkesPlugins
author: SimpleAOB & joanbga
---

### Note:
These tools are not moderated by BakkesPlugins staff, so use at your own risk. That said, we checked the source(s) <u>at the time of writing</u> and determined that it is safe to run on your computer

## Bakkesmod Scripts
Creating the uploads for Bakkesplugins can be annoying. Discord member @joanbga created some public scripts that can make this process much easier! 
View and download them in their repo [found here on GitHub](https://github.com/joanbga/BakkesmodScripts)! 
The README in the repo will always be the most up to date on tooling

## [CreateSourceZipScript](https://github.com/joanbga/BakkesmodScripts/blob/main/CreateSourceZipScript)
A PowerShell script that automatically creates a compliant ZIP package for BakkesMod plugin submissions to Bakkesplugins. The script handles different project structures, intelligently selects necessary files, and packages everything according to BakkesMod requirements.

Key Features:
- Automatic detection of Visual Studio project structures
- Smart file selection and exclusion
- Preservation of your project organization in the output
- Support for all standard BakkesMod plugin requirements

## [CreateInstallZipScript](https://github.com/joanbga/BakkesmodScripts/blob/main/CreateInstallZipScript)
This script is helpful for distributing test versions of the plugin to friends. Built binaries should not be submitted to BakkesPlugins because they need the source code to verify
safety

A PowerShell script that generates installation ZIP packages for end users of your BakkesMod plugins. The script extracts version information from your code and packages only the files needed for installation.

Key Features:
- Automatic version detection from version.h
- Creates end-user friendly installation packages
- Includes only required files (DLL, settings, etc.)
- Versioned output filenames for easier distribution

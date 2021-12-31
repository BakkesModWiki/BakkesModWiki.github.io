---
title: Plugin Exclusive Log
author: Broadway
---

Want to see the console logging from just your plugin? Open a new PowerShell window and use this command. Replace "PLUGIN_NAME" with your plugin's class name  
```powershell
Get-Content (-join($env:APPDATA, "\bakkesmod\bakkesmod\bakkesmod.log")) -wait -tail 1 | select-string -pattern "PLUGIN_NAME"
```
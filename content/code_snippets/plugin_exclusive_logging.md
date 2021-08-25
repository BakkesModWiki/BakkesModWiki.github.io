---
title: Plugin Exclusive Logging
author: Broadway#9247
---

Want to see the console logging from just your plugin? Open a new PowerShell window and use this command
(It may require git for windows <https://gitforwindows.org/>)

```
Get-Content (-join($env:APPDATA, "\bakkesmod\bakkesmod\bakkesmod.log")) -wait -tail 1 | select-string -pattern "PLUGIN_NAME"
```
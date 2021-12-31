---
title: Live Debugging
author: CyrilToonkit
---

You can live debug your code by attaching Rocket League to visual studio and stepping through it  
This page explains how  
https://github.com/MicrosoftDocs/visualstudio-docs/blob/main/docs/debugger/attach-to-running-processes-with-the-visual-studio-debugger.md

For rocket league, you need to attach to the process "RocketLeague.exe" (see capture, sorry for the french UI ^^)
![https://cdn.discordapp.com/attachments/862068148328857703/926348269767000084/unknown.png](https://cdn.discordapp.com/attachments/862068148328857703/926348269767000084/unknown.png)

If you're in an infinte loop (which never happens to me 😏), you can press the "interrupt" button, and Visual Studio will jump to the part of the code that is currently being executed  
![https://cdn.discordapp.com/attachments/862068148328857703/926348928776028181/unknown.png](https://cdn.discordapp.com/attachments/862068148328857703/926348928776028181/unknown.png)

If you have a critical crash (if it's your code) Visual will jump to the line that raised the exception

Finally, you can put breakpoints by clicking the column before a line, and Visual will stop here and let you inspect the different values in your code.  
![https://cdn.discordapp.com/attachments/862068148328857703/926349959849201694/unknown.png](https://cdn.discordapp.com/attachments/862068148328857703/926349959849201694/unknown.png)
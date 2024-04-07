---
title: Live Debugging
author: CyrilToonkit
---

You can live debug your code by attaching Rocket League to visual studio and stepping through it  
This page explains how  
https://github.com/MicrosoftDocs/visualstudio-docs/blob/main/docs/debugger/attach-to-running-processes-with-the-visual-studio-debugger.md

For rocket league, you need to attach to the process "RocketLeague.exe" (see capture, sorry for the french UI ^^)
![/img/debugger-attach-process.png](/img/debugger-attach-process.png)

If you're in an infinte loop (which never happens to me 😏), you can press the "interrupt" button, and Visual Studio will jump to the part of the code that is currently being executed  
![/img/debugger-pause.png](/img/debugger-pause.png)

If you have a critical crash (if it's your code) Visual will jump to the line that raised the exception

Finally, you can put breakpoints by clicking the column before a line, and Visual will stop here and let you inspect the different values in your code.  
![/img/debugger-inspect.png](/img/debugger-inspect.png)

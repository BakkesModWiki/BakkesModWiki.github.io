---
title: 1. Setup your installs
weight: 1
---

Trying to get into making plugins for the first time? There's some super useful tools out there! These steps should get you started on the path towards development.

Note these instructions are designed for **Windows 10 (and presumably 11)**. Rocket League is Windows exclusive, so this is the easiest way to develop for it. If you really want to use linux, it will be harder but may still be possible
1. Make sure you have bakkesmod installed and run it at least once
[https://bakkesmod.com/](https://bakkesmod.com/)
2. Download Visual Studio 2022. Note that this is not the same as Visual Studio Code.
[https://visualstudio.microsoft.com/](https://visualstudio.microsoft.com/)
3. During Visual Studio's install, make sure you select and download `Desktop development with C++`  
To add it to an existing install open Visual Studio, hit `Tools`, then `Get Tools and Features...`  
![/img/cppsetupstep1.png](/img/cppsetupstep1.png)  
Either through the installer or with an existing install you'll eventually get to this menu. Ensure `Desktop development with C++` is checked. It may appear in a different location in different Visual Studio versions  
![/img/cppsetupstep2.png](/img/cppsetupstep2.png)  
If it's not checked, check it and then hit `Install` in the bottom right  
4. Get Martinn's template set up. [Add the template to your Visual Studio](https://github.com/Martinii89/BakkesmodPluginTemplate) with the instructions in its README
5. Start coding! When you build, your plugin will automatically be moved into your plugins folder, and it will load in Rocket League. If you're having trouble understanding how to start the code, try looking at [Starting A Plugin](/plugin_tutorial/starting_a_plugin/) and the code snippets for some examples on how Bakkesmod SDK is used

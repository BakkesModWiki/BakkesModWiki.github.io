---
title: Setup your installs
weight: 1
---

Trying to get into making plugins for the first time? There's some super useful tools out there! These steps should get you started on the path towards development.

Note these instructions are designed for **Windows 10 (and presumably 11)**. Rocket League is Windows exclusive, so this is the easiest way to develop for it. If you really want to use linux, it will be harder but may still be possible
1. Make sure you have bakkesmod installed and run it at least once
[https://bakkesmod.com/](https://bakkesmod.com/)
2. Download Visual Studio (any version should work although most devs use VS19). Note that this is not the same as Visual Studio Code
[https://visualstudio.microsoft.com/](https://visualstudio.microsoft.com/)
3. During Visual Studio's install, make sure you select and download `Desktop development with C++`
4. Get Martinn's template set up. Either [add the template to your Visual Studio](https://github.com/Martinii89/BakkesmodPluginTemplate) or [make a new repo using the GitHub template](/useful_info/github_plugin_template/)
5. Start coding! When you build, your plugin will automatically be moved into your plugins folder, and it will load in Rocket League. If you're having trouble understanding how to start the code, try looking at [Starting A Plugin](/plugin_tutorial/starting_a_plugin/) and the code snippets for some examples on how Bakkesmod SDK is used
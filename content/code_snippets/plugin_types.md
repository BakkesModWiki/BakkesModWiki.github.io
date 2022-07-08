---
title: Plugin Types
author: ubelhj
---
```cpp
BAKKESMOD_PLUGIN(CoolPlugin, "Cool Plugin", plugin_version, PLUGINTYPE_FREEPLAY)
```

These are a relic of an unrealized feature. Most do nothing.

It's easiest to just leave it as `PLUGINTYPE_FREEPLAY` from the template, but you can use any of the non-threaded options interchangeably.  
`PLUGINTYPE_FREEPLAY` through `PLUGINTYPE_REPLAY` plugins all work in any gamemode or playlist

`PLUGINTYPE_THREADED` means that the plugin's `onLoad()` is called in its own thread  
`PLUGINTYPE_THREADEDUNLOAD` means that the plugin's `onUnload()` is called in its own thread  
These are only necessary if you have something very complicated and time consuming in your onload or unload.  
All of the others do nothing.  


{{< highlight cpp "linenos=table" >}}
PLUGINTYPE_FREEPLAY = 0x01, // Plugin works everywhere
PLUGINTYPE_CUSTOM_TRAINING = 0x02, // Plugin works everywhere
PLUGINTYPE_SPECTATOR = 0x04, // Plugin works everywhere
PLUGINTYPE_BOTAI = 0x08, // Plugin works everywhere
PLUGINTYPE_REPLAY = 0x10, // Plugin works everywhere
PLUGINTYPE_THREADED = 0x20, // Plugin works everywhere and onLoad() is called in its own thread
PLUGINTYPE_THREADEDUNLOAD = 0x40 // Plugin works everywhere and onUnload() is called in its own thread
{{< /highlight >}}
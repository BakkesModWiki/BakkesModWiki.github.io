---
title: Plugin Types
tags: [Code Snippet]
permalink: code_snippets_plugin_types.html
folder: Code Snippet
---

All Plugin Types
```cpp
    PLUGINTYPE_FREEPLAY = 0x01, // Does nothing
    PLUGINTYPE_CUSTOM_TRAINING = 0x02, // see above
    PLUGINTYPE_SPECTATOR = 0x04, // see above
    PLUGINTYPE_BOTAI = 0x08, // see above
    PLUGINTYPE_REPLAY = 0x10, // see above
    PLUGINTYPE_THREADED = 0x20, // OnLoad is called in it's own thread
    PLUGINTYPE_THREADEDUNLOAD = 0x40 // Unload is called in it's own thread
```
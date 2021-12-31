---
title: Persistent Storage
author: Martinn
---

Use these files in your plugin files to store persistent data with cvars but without risking the cvars being cleared

Usage
```cpp
// preferably in onload but at least before you use it (genious advice)
persistent_storage_ = std::make_shared<PersistentStorage>(this, "Hats", true, true);

//register the cvar like "normal"
auto cvar = persistent_storage_->RegisterPersistentCvar("hats_preset", "", "The selected preset", true);
```

Download these files to use  
[PersistentStorage.h](/files/PersistentStorage.h)  
[PersistentStorage.cpp](/files/PersistentStorage.cpp)
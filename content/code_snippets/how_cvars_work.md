---
title: How CVars Work
tags: [Code Snippet, CVarWrapper]
permalink: code_snippets_how_cvars_work.html
folder: Code Snippet
---

In plugin onLoad(), registerCVar is called and the cvar will have default values

cvar values are only changed when a config file is executed, or a console command is fired. It doesn't magically "remember" values from previous runs or anything.

On BM startup, it'll execute plugins.cfg first to load all plugins, causing all cvars for these plugins to be created. Then once this is done it will execute config.cfg, which will set the actual saved value.

If you want to reload a plugin while BM is running already but keep its values, make sure you use writeconfig before the plugin is unloaded, then unload/load or reload the plugin, now the plugin will have registered it cvars, but with default values. Then execute config.cfg to get your stored values back

```cpp
std::shared_ptr<bool> enabledOverlay = std::make_shared<bool>(false);

auto overlayEnableVar = cvarManager->registerCvar("counter_enable_ingame", "0", "enables in game overlay");
overlayEnableVar.bindTo(enabledOverlay);
overlayEnableVar.addOnValueChanged([this](std::string, CVarWrapper cvar) {
    doSomethingWhenCounterEnabledChanged();
});
```

also bindTo is pretty much just a wrapper for
```cpp
void bindTo(CVar cvar, std::shared_ptr<T> abc)
{
  cvar.addOnValueChanged([this](std::string, CVarWrapper cvar) {
    *abc = cvar.getTValue();
  });
}
```

these std::shared_ptrs only work one way though, cvar -> shared_ptrs. if you alter the shared_ptr directly it will NOT update the actual cvar value. To do that:
```cpp
auto cvar = cvarManager->getCvar("counter_enable_ingame");
if (!cvar) {
    // CVarWrappers can be null if the cvar doesn't exit!
    return;
}
auto overlayEnableVar = cvar.setValue(enabledOverlay.get());
```
--- 
Written by Bakkes, edited by ubelhj
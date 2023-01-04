---
title: How CVars Work
author: Bakkes, NeuroPyPy
---

Cvars are the global variables of the mod. Bakkesmod has many [pre-defined CVars](https://bakkesmod.fandom.com/wiki/Category:Cvars#List_of_all_cvars) that your plugin can also set/unset.
Cvars are strings, but can represent bool/float values in string form. The declaration of a CVar is:
{{< highlight cpp "linenos=table" >}}
// in include\bakkesmod\wrappers\cvarmanagerwrapper.h

// <summary>Register a CVar.</summary>
// <param name="cvar">The string name of your CVar</param>
// <param name="defaultValue">The default value of your CVar</param>
// <param name="desc">A description of your Cvar which is logged</param>
// <param name="searchAble">If the cvar will pop-up when entering values in the console.</param>
// <param name="hasMin">If there is a minumum value (i.e. a float slider)</param>
// <param name="min">if hasMin=true, this is the value.</param>
// <param name="hasMax">If there is a maximum value</param>
// <param name="max">if hasmax=true, this is the value.</param>
// <param name="saveToCfg">If true, will add the Cvar and default value to config.cfg</param>
// <returns> Vector of std::string keybinds.</returns>
registerCvar(std::string cvar, std::string defaultValue, std::string desc = "", bool searchAble = true, bool hasMin = false, float min = 0, bool hasMax = false, float max = 0, bool saveToCfg = true);
{{< /highlight >}}

Notice the min/max arguments. The BM rebound plugin uses this i.e. "rebound_shotspeed" as a value between 0-2000.

In plugin onLoad(), cvarManager->registerCVar() is called, this is where you tell bakkesmod details about your CVar and give it a default string values.

When bakkesmod loads, it'll execute plugins.cfg which loads each plugin. This is where onLoad() is fired, CVars are created and default values are set for each plugin. Then config.cfg will execute, which will set saved-values.

To save a value, you need to call 'writeconfig' in the console, or programmatically with:

{{< highlight cpp "linenos=table" >}}
cvarManager->executeCommand("writeconfig", false); //false just means don't log the writeconfig
{{< /highlight >}}

The config.cfg file containes all cvars/alias. Find this file in bakkesmod/cfg/config.cfg. This file is your route to easily saving CVars across sessions.
Note that 'writeconfig' will also execute binds.cfg, and save current keybinds.

If you want to reload a plugin while BM is running already but keep its values, make sure you use writeconfig before the plugin is unloaded, then unload/load or reload the plugin, now the plugin will have registered it cvars, but with default values. Then execute config.cfg to get your stored values back. In the console: 'exec config.cfg'.

Here is a typical example changing a CVar with ImGui checkbox:
{{< highlight cpp "linenos=table" >}}
// myplugin.h
class MyPlugin : public BakkesMod::Plugin::BakkesModPlugin, public BakkesMod::Plugin::PluginWindow
{
    std::shared_ptr<bool> enabled;
    virtual void onLoad();
    virtual void onUnload();
    //...
    public:
    //...
    private:
    //...
}

// myplugin.cpp
enabled = std::make_shared<bool>(true);

cvarManager->registerCvar("plugin_enabled", "0", "Enable/Disable the plugin. 0 = false = disabled, 1 = true = enabled")
    .bindTo(enabled); // bind the global shared pointer to this CVar

cvarManager->getCvar("plugin_enabled").addOnValueChanged([this](std::string oldValue, CVarWrapper cvar) {
//addOnValueChanged is a callback, where everything in this block will be called whenever the cvar value is changed. You can call functions, or just log information.
        if (cvar.getStringValue() == "1") {
            LOG("Plugin Enabled");
        };
        if (cvar.getStringValue() == "0") {
            LOG("Plugin Disabled");
        };
    }
);

// mypluginGUI.cpp
static auto pluginCvar = cvarManager->getCvar("plugin_enabled");
auto pluginEnabled = pluginCvar.getBoolValue();

if (ImGui::Checkbox("Enable Plugin", &pluginEnabled)) {
pluginCvar.setValue(pluginEnabled);
cvarManager->executeCommand("writeconfig", false); // save CVar to config.cfg
}
{{< /highlight >}}

After registering the CVar, we bind it to the global bool. Bind to is pretty much a wrapper for:
{{< highlight cpp "linenos=table" >}}
void bindTo(CVar cvar, std::shared_ptr<T> abc)
{
    cvar.addOnValueChanged([this](std::string, CVarWrapper cvar) {
        *abc = cvar.getTValue();
    });
}
{{< /highlight >}}

Here's another way:
{{< highlight cpp "linenos=table" >}}
// myplugin.h:
static constexpr const char\* pluginEnabled = "1"; // 1 is the default value here

// myplugin.cpp
cvarManager->registerCvar(pluginEnabled, "1", "Enable/Disable the plugin. 0 = false = disabled, 1 = true = enabled", true, true, 0, true, 1);
// all default values for registerCvar are used as arguments here, but not needed if they're just defaults
// usage would be the same.
{{< /highlight >}}

In addition to these methods, you can just make functions to call within .addOnValueChanged() to set Cvar values.

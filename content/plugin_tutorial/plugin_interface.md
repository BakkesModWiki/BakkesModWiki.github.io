---
title: Plugin Interface
tags: [getting_started]
permalink: plugin_interface.html
folder: plugintutorial
---

This channel will go over creating a user-friendly interface. There's buttons, sliders, checkboxes, dropdowns, and all sorts of options. It also assumes you're using the template, as the template automatically includes the ImGui GUI library we'll be using. It will ignore the fact that there is some commented out code in `CoolPluginGUI.cpp`. 

Yet again we have the `CoolPlugin` from [Plugin Variables](plugin-variables.html) and we want to add a button to activate our cooler ball on top, a checkbox to enable cool, and a slider to choose the distance that the ball is placed from your car

First we need to extend a class and declare 3 functions in `CoolPlugin.h`

At the top of the file, add the line to your list of includes 
`#include "bakkesmod/plugin/PluginSettingsWindow.h"`

At the class declaration, add `PluginSettingsWindow`
```cpp
class CoolPlugin: public BakkesMod::Plugin::BakkesModPlugin, public BakkesMod::Plugin::PluginSettingsWindow
```

And inside the plugin `{}` add these 3 lines
```cpp
void RenderSettings() override;    
std::string GetPluginName() override;
void SetImGuiContext(uintptr_t ctx) override;
```

Now we can define those 3 functions to create the interface. We will put these in `CoolPluginGUI.cpp` but they can be in any `.cpp` file that includes `CoolPlugin.h`, such as `CoolPlugin.cpp`

The first is simple and should be copied and pasted. Never call this function, just assume it works
```cpp
void CoolPlugin::SetImGuiContext(uintptr_t ctx) {
  ImGui::SetCurrentContext(reinterpret_cast<ImGuiContext*>(ctx));
}
```
The second is also simple. Put whatever the name of the plugin is as the return value. This'll be what the plugin will be called in the f2 -> Plugins menu
```cpp
std::string CoolPlugin::GetPluginName() {
  return "Cool Plugin";
}
```
The third and final actually creates the interface. We'll start with simple text but this is what we'll be modifying in the rest of this channel  
There's a hugely important thing to consider with this function. Never call on or change any Rocket League / Bakkesmod values here. If you do, you will crash. It's happening outside of the game, and cannot safely alter it. That means that if you have a `CVarWrapper.addOnValueChanged()` that alters the state of the game, it will be unsafe to use here
```cpp
void CoolPlugin::RenderSettings() {
    ImGui::TextUnformatted("A really cool plugin");
}
```

Lets start building the plugin interface. First we'll have a button that'll call `CoolerBallOnTop`. The button as well as most other interactable ImGui components has a boolean property. If it's true, that means it's been interacted with. So when the button has been clicked, we'll use the cvarManager to call `CoolerBallOnTop`. But `CoolerBallOnTop` uses the ServerWrapper and alters the game. It'll crash! We can wrap it inside `gameWrapper->Execute()`. We'll also add hover text because why not
```cpp
if (ImGui::Button("Ball On Top")) {
  gameWrapper->Execute([this](GameWrapper* gw) { 
    cvarManager->executeCommand("CoolerBallOnTop"); 
  });
}
if (ImGui::IsItemHovered()) {
  ImGui::SetTooltip("Activate Ball On Top");
}
```

![The button](https://cdn.discordapp.com/attachments/863320309834186762/863537895444709416/unknown.png)

Now let's do a checkbox for `cool_enabled`. First we need to get the CVar, then use it. The `bool enabled` is necessary, as the checkbox uses that to store whether or not the checkbox should be checked. You can't just use the CVar
```cpp
CVarWrapper enableCvar = cvarManager->getCvar("cool_enabled");
if (!enableCvar) { return; }
bool enabled = enableCvar.getBoolValue();
if (ImGui::Checkbox("Enable plugin", &enabled)) {
  enableCvar.setValue(enabled);
}
if (ImGui::IsItemHovered()) {
  ImGui::SetTooltip("Toggle Cool Plugin");
}
```
And finally a slider for the distance CVar. 
ImGui elements use `char *` instead of `std::string` 
You can easily convert between with `std::string.c_str()` and `std::string newStringVariableName(char *)`
```cpp
CVarWrapper distanceCvar = cvarManager->getCvar("cool_distance");
if (!distanceCvar) { return; }
float distance = distanceCvar.getFloatValue();
if (ImGui::SliderFloat("Distance", &distance, 0.0, 500.0)) {
  distanceCvar.setValue(distance);
}
if (ImGui::IsItemHovered()) {
  std::string hoverText = "distance is " + std::to_string(distance);
  ImGui::SetTooltip(hoverText.c_str());
}
```

![The slider](https://cdn.discordapp.com/attachments/863320309834186762/863541774324203540/unknown.png)

We finally have a settings file using all of our CVars. There's a load more things you can do with ImGui, but hopefully this is enough to get the right idea and get started. I hope that by covering these three elements I covered most of what plugins need to use. ImGui is complicated and most plugins don't use it yet. Feel free to ask questions

Here's the final code  
[https://github.com/ubelhj/BakkesModStarterPlugin/blob/plugin-settings/CoolPlugin/CoolPlugin.h](https://github.com/ubelhj/BakkesModStarterPlugin/blob/plugin-settings/CoolPlugin/CoolPlugin.h)
[https://github.com/ubelhj/BakkesModStarterPlugin/blob/plugin-settings/CoolPlugin/CoolPluginGUI.cpp](https://github.com/ubelhj/BakkesModStarterPlugin/blob/plugin-settings/CoolPlugin/CoolPluginGUI.cpp)

And here's a useful interactable imgui demo
[https://pthom.github.io/imgui_manual_online/manual/imgui_manual.html](https://pthom.github.io/imgui_manual_online/manual/imgui_manual.html)
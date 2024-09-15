---
title: 4. Plugin Interface
weight: 4
author: ubelhj
---

This will go over creating a user-friendly interface. There's buttons, sliders, checkboxes, dropdowns, and all sorts of options. It also assumes you're using the template, as the template automatically includes the ImGui GUI library we'll be using. It also adds a file we'll be editing

Yet again we have the `CoolPlugin` from [Plugin Variables](/plugin_tutorial/plugin-variables) and we want to add a button to activate our cooler ball on top, a checkbox to enable cool, and a slider to choose the distance that the ball is placed from your car

First we need to uncomment some code in `CoolPlugin.h`

At the class declaration, uncomment `SettingsWindowBase` and `RenderSettings`
{{< highlight cpp "linenos=table" >}}
class CoolPlugin: public BakkesMod::Plugin::BakkesModPlugin, public SettingsWindowBase

// ...

void RenderSettings() override;
{{< /highlight >}}

Now we can define those 3 functions to create the interface. We will put these in a new file `CoolPluginSettings.cpp` but they can be in any `.cpp` file that includes `CoolPlugin.h`, such as `CoolPlugin.cpp`

To add a file, right click the src (or any other) folder in the solution explorer, then add a new item  
![Adding a new item to the solution](/img/solution_explorer_new_item.png)  

Add a .cpp file with the name of your choice.  
![Naming the cpp file](/img/solution_explorer_add_cpp.png)

In the file, make sure to include `pch.h` and `CoolPlugin.h` at the top
{{< highlight cpp "linenos=table" >}}
#include "pch.h"
#include "CoolPlugin.h"
{{< /highlight >}}

Now you can create the interface. We'll start with simple text but this is what we'll be modifying in the rest of this page  
There's a hugely important thing to consider with this function. Never call on or change any Rocket League / Bakkesmod values here. If you do, you will crash. It's happening outside of the game, and cannot safely alter it. That means that if you have a `CVarWrapper.addOnValueChanged()` that alters the state of the game, it will be unsafe to use here  
{{< highlight cpp "linenos=table" >}}
void CoolPlugin::RenderSettings() {
    ImGui::TextUnformatted("A really cool plugin");
}
{{< /highlight >}}

Lets start building the plugin interface. First we'll have a button that'll call `CoolerBallOnTop`. The button as well as most other interactable ImGui components has a boolean property. If it's true, that means it's been interacted with. So when the button has been clicked, we'll use the cvarManager to call `CoolerBallOnTop`. But `CoolerBallOnTop` uses the ServerWrapper and alters the game. It'll crash! We can wrap it inside `gameWrapper->Execute()`. We'll also add hover text because why not
{{< highlight cpp "linenos=table" >}}
if (ImGui::Button("Ball On Top")) {
  gameWrapper->Execute([this](GameWrapper* gw) {
    cvarManager->executeCommand("CoolerBallOnTop");
  });
}
if (ImGui::IsItemHovered()) {
  ImGui::SetTooltip("Activate Ball On Top");
}
{{< /highlight >}}

![The button](/img/button-example.png)

Now let's do a checkbox for `cool_enabled`. First we need to get the CVar, then use it. The `bool enabled` is necessary, as the checkbox uses that to store whether or not the checkbox should be checked. You can't just use the CVar
{{< highlight cpp "linenos=table" >}}
CVarWrapper enableCvar = cvarManager->getCvar("cool_enabled");
if (!enableCvar) { return; }
bool enabled = enableCvar.getBoolValue();
if (ImGui::Checkbox("Enable plugin", &enabled)) {
  enableCvar.setValue(enabled);
}
if (ImGui::IsItemHovered()) {
  ImGui::SetTooltip("Toggle Cool Plugin");
}
{{< /highlight >}}
And finally a slider for the distance CVar.
ImGui elements use `char *` instead of `std::string`
You can easily convert between with `std::string.c_str()` and `std::string newStringVariableName(char *)`
{{< highlight cpp "linenos=table" >}}
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
{{< /highlight >}}

![The slider](/img/slider-example.png)

We finally have a settings file using all of our CVars. There's a load more things you can do with ImGui, but hopefully this is enough to get the right idea and get started. I hope that by covering these three elements I covered most of what plugins need to use. ImGui is complicated and most plugins don't use it yet. Feel free to ask questions

Here's the final code  
[https://github.com/ubelhj/BakkesModStarterPlugin/blob/plugin-interface/CoolPlugin/CoolPluginSettings.cpp](https://github.com/ubelhj/BakkesModStarterPlugin/blob/plugin-interface/CoolPlugin/CoolPluginSettings.cpp)  
[https://github.com/ubelhj/BakkesModStarterPlugin/tree/plugin-interface/](https://github.com/ubelhj/BakkesModStarterPlugin/tree/plugin-interface/)  

And here's a useful interactable imgui demo  
[https://pthom.github.io/imgui_manual_online/manual/imgui_manual.html](https://pthom.github.io/imgui_manual_online/manual/imgui_manual.html)
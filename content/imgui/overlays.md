---
title: Overlays
weight: 1
author: ubelhj
---

Want the powerful flexibility of ImGui for a simple text overlay? Here's how. 

First make sure you've uncommented all of the plugin window code in the template's .h file. Then in your GUI file go to the render() function. For a custom overlay, you'll need to prepare flags for it to appear the way you want it to.  
These are found at [line 744 of imgui.h](https://github.com/Martinii89/BakkesmodPluginTemplate/blob/master/IMGUI/imgui.h#L744)

Some useful flags for an overlay are:  
`ImGuiWindowFlags_NoTitleBar` removes the title bar  
`ImGuiWindowFlags_NoScrollbar` disables a scroll bar from appearing  
`ImGuiWindowFlags_AlwaysAutoResize` automatically resizes the window to fit the content  
`ImGuiWindowFlags_NoDecoration` removes the scrollbar, title bar, and disables manual resizing  
`ImGuiWindowFlags_NoFocusOnAppearing` prevents the overlay from stealing focus from other ImGui windows  
`ImGuiWindowFlags_NoInputs` makes the mouse pass right through the window to RL  
`ImGuiWindowFlags_NoBackground` disables the background of the window  

Here's an example of starting a window with some flags
{{< highlight cpp "linenos=table" >}}
ImGuiWindowFlags WindowFlags = ImGuiWindowFlags_NoTitleBar | ImGuiWindowFlags_NoScrollbar
    | ImGuiWindowFlags_AlwaysAutoResize | ImGuiWindowFlags_NoFocusOnAppearing;
// If moveOverlay is true, the user can move the overlay, when false the window no longer accepts input
//  I find this useful to connect to a CVar and checkbox in the plugin's settings
if (!moveOverlay) {
    WindowFlags |= ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoInputs;
}

// creates the window with the given flags
if (!ImGui::Begin(menuTitle_.c_str(), &isWindowOpen_, WindowFlags))
{
    ImGui::End();
    return;
}

// Do your overlay rendering with full ImGui here!
{{< /highlight >}}
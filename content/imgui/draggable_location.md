---
title: Draggable location
weight: 1
author: ubelhj
---

Imagine you have a plugin that renders something on the screen. Users might want to move it to a different location. Dragging's a great way to make it move, and here's how to get it to work! 

First, you need to be rendering something on the canvas. Let's say it's a single chunk of text, with its location defined at the top left. [Like this example](/code_snippets/canvas/).

Next we'll add a simple level of customizability with location cvars. X is the left to right axis, and Y is top to bottom. (0, 0) is the top left of the screen
```cpp
cvarManager->registerCvar("cool_x_location", "0", "set x location of the overlay");
cvarManager->registerCvar("cool_y_location", "0", "set y location of the overlay");
```
Now in the canvas render, just use those new locations
```cpp
CVarWrapper xLocCvar = cvarManager->getCvar("cool_x_location");
if (!xLocCvar) { return; }
float xLoc = xLocCvar.getFloatValue();

CVarWrapper yLocCvar = cvarManager->getCvar("cool_y_location");
if (!yLocCvar) { return; }
float yLoc = yLocCvar.getFloatValue();

canvas.SetPosition(Vector2{ xLoc, yLoc });
// now render everything else
```

Now the user can change the location of the overlay in the console, but now you can add it to the GUI too. In your `RenderSettings()` add these lines
```cpp
CVarWrapper xLocCvar = cvarManager->getCvar("cool_x_location");
if (!xLocCvar) { return; }
float xLoc = xLocCvar.getFloatValue();
if (ImGui::SliderFloat("X Location", &xLoc, 0.0, 5000.0)) {
    xLocCvar.setValue(xLoc);
}
CVarWrapper yLocCvar = cvarManager->getCvar("cool_y_location");
if (!yLocCvar) { return; }
float yLoc = yLocCvar.getFloatValue();
if (ImGui::SliderFloat("Y Location", &yLoc, 0.0, 5000.0)) {
    yLocCvar.setValue(yLoc);
}
```

Now you can move the x and y locations with sliders, and finally we can add dragging.  
First add a checkbox to enable the dragging mode. Without that check there's some weird interactions on when dragging will happen.  
Then the code is fairly simple. Put it where you're doing your ImGui rendering. It sets the cvar values to the x and y locations of the mouse if left click is held. 
```cpp
// inDragMode is just a bool declared at the top of the .cpp file
ImGui::Checkbox("Drag Mode", &inDragMode);

if (inDragMode) {
    if (ImGui::IsAnyWindowHovered() || ImGui::IsAnyItemHovered()) {
        // doesn't do anything if any ImGui is hovered over
        return;
    }
    // drag cursor w/ arrows to N, E, S, W
    ImGui::SetMouseCursor(2);
    if (ImGui::IsMouseDown(0)) {
        // if holding left click, move
        // sets location to current mouse position
        ImVec2 mousePos = ImGui::GetMousePos();
        xLocCvar.setValue(mousePos.x);
        yLocCvar.setValue(mousePos.y);
    }
}
```
This video shows the code in action! 
<video controls="controls" width="1000" preload="metadata">
    <source src="/video/imguidrag.mp4" 
            type="video/mp4" />
</video>
---
title: Draggable location
weight: 1
author: ubelhj
---

Imagine you have a plugin that renders something on the screen. Users might want to move it to a different location. Dragging's a great way to make it move, and here's how to get it to work!

First, you need to be rendering something on the canvas. Let's say it's a single chunk of text, with its location defined at the top left. [Like this example](/code_snippets/canvas/).

Next we'll add a simple level of customizability with location cvars. xLocation and yLocation are floats and can be declared in your plugin.h file
```cpp
cvarManager->registerCvar("cool_x_location", "0", "set x axis of the location of the overlay")
    .addOnValueChanged([this](std::string, CVarWrapper cvar) {
        xLocation = cvar.getFloatValue();
    });

cvarManager->registerCvar("cool_y_location", "0", "set y axis of the location of the overlay")
    .addOnValueChanged([this](std::string, CVarWrapper cvar) {
        yLocation = cvar.getFloatValue();
    });
```
Now in the render, just use those new locations
```cpp
canvas.SetPosition({ xLocation, yLocation });
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
Then the code is fairly simple. It sets the cvar values to the x and y locations of the mouse if left click is held. 
```cpp
// inDragMode is just a boolean declared at the top of the .cpp file
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
        // whatever your x and y cvars are
        // sets location to current mouse position
        ImVec2 mousePos = ImGui::GetMousePos();
        xLocCvar.setValue(mousePos.x);
        yLocCvar.setValue(mousePos.y);
    }
}
```
Look this gif shows the code in action! Sorry for legibility issues, but the button clicked is the drag mode
![dragcanvas](/img/dragcanvas2.gif)
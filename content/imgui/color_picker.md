---
title: Color Picker
weight: 1
author: ubelhj
---

You've got a super cool looking overlay, but you want the user to change the color. Here's some code for a super nice color picker!

First, you need to be rendering something on the canvas. Let's say it's a single chunk of text. [Like this example](/code_snippets/canvas/).

Next, make a cvar for color. This is really simple. The default value can be encoded with hex
```cpp
cvarManager->registerCvar("cool_color", "#FFFFFF", "color of overlay");
```
Now in the canvas render, use the new color
```cpp
CVarWrapper textColorVar = cvarManager->getCvar("cool_color");
if (!textColorVar) {
    return;
}
LinearColor textColor = textColorVar.getColorValue();
canvas.SetColor(textColor);
// render text after setting the color
```

This code goes wherever you're rendering your ImGui
```cpp
CVarWrapper textColorVar = cvarManager->getCvar("cool_color");
if (!textColorVar) {
    return;
}
LinearColor textColor = textColorVar.getColorValue();

// converts from 0-255 color to 0.0-1.0 color
float textColors[4] = { textColor.R / 255, textColor.G / 255, textColor.B / 255, textColor.A / 255 };
ImVec4 colorVec = { textColor.R / 255, textColor.G / 255, textColor.B / 255, textColor.A / 255 };

if (ImGui::ColorButton("Text Color##button", colorVec)) {
    ImGui::OpenPopup("Text Color selector");
}

ImGui::SameLine();

ImGui::Text("Text Color");

if (ImGui::BeginPopup("Text Color selector")) {
    if (ImGui::ColorPicker4("Text Color##selector", textColors)) {
        textColor = { textColors[0] * 255, textColors[1] * 255, textColors[2] * 255, textColors[3] * 255 };
        textColorVar.setValue(textColor);
    }

    ImGui::EndPopup();
}
```

Here's the final result. First when you hover the ColorButton  
![colorpickerhover](/img/colorpickerhover.png)  
And here's when the ColorPicker popup is opened by clicking the ColorButton  
![colorpickeropen](/img/colorpickeropen.png)
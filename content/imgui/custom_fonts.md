---
title: Custom Fonts
weight: 1
author: ubelhj
collaborators: Martinn
---

Want to add a custom fancy font to your plugin? It's really easy! You can use any .ttf font, although many have copyrights. Check out [https://fonts.google.com/](https://fonts.google.com/) for a bunch of free fonts to use.

First, make a pointer to save your font. Do this in your .h as a variable
{{< highlight cpp "linenos=table" >}}
ImFont* myFont;
{{< /highlight >}}

Next load the font using the GUIManager. This can be done pretty much anywhere, but I recommend using your OnLoad or SetImGuiContext functions. OnLoad happens at startup of the plugin, and SetImGuiContext happens when the plugin's ImGui is initialized. Either will hopefully ensure your font is loaded before you use it (barring any errors)
{{< highlight cpp "linenos=table" >}}
auto gui = gameWrapper->GetGUIManager();

// This syntax requires c++17
// Pick any name you want for the font here
auto [res, font] = gui.LoadFont("font.tff 40px", "font.ttf", 40);

if (res == 0) {
    LOG("Failed to load the font!");
} else if (res == 1) {
    LOG("The font will be loaded");
} else if (res == 2 && font) {
    myFont = font;
}
{{< /highlight >}}

Finally use the font in your ImGui code. Remember that when you push a font, you have to pop it when you're done. 
{{< highlight cpp "linenos=table" >}}
// First ensure the font is actually loaded
if (!myFont) {
    auto gui = gameWrapper->GetGUIManager();
    myFont = gui.GetFont("font.tff 40px");
}

// Now use the font
if (myFont) {
    ImGui::PushFont(myFont);
    ImGui::Text("This is using a custom font");
    ImGui::PopFont();
} else {
    ImGui::Text("The custom font haven't been loaded yet");
}
{{< /highlight >}}

Here's an example using the open source Ubuntu font, as compared to the ImGui default
![An example of custom font](/img/font-comparison.png)

The code for this is taken from [Martinn's awesome custom font example](https://github.com/Martinii89/BakkesmodPluginCustomFontExamle). I just made this page to get more visibility for it.
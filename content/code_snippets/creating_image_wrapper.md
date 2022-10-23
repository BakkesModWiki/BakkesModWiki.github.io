---
title: Creating an ImageWrapper
author: Martinn
---

## Creating an [ImageWrapper](/bakkesmod_api/Classes/Wrappers/ImageWrapper/)
* You should use some kind of reference type that manages the memory. `std::shared_ptr<ImageWrapper>` is my recommendation.
* Put the declaration in your .h file so it can be used anywhere
* The constructor takes 3 arguments (2 are optional)
* The optional arguments are two bools that decide if the core will preload the images for use in the canvas\imgui.
* The ImageWrapper is a resource managing class. This means that you have to keep this object "alive" as long as you want to use the image. When the object goes out of scope \ gets destructed it cleans up the resource it manages.
* I have tried to delete the constructors that could cause issues (copy constructor).
* Stick to `std::shared_ptr` and you almost can't mess up.


## Using a [ImageWrapper](/bakkesmod_api/Classes/Wrappers/ImageWrapper/)
 1. Use the constructor with the second or third argument true (or both).
{{< highlight cpp "linenos=table" >}}
// ImageWrapper(std::string path, bool canvasLoad = false, bool ImGuiLoad = false);
myImage = std::make_shared<ImageWrapper>(gameWrapper->GetDataFolder() / "MyPluginFolder" / "MyImage.png", true, true);
{{< / highlight >}}

2. Load the resource if you didn't use the optional args.
{{< highlight cpp "linenos=table" >}}
myImage->LoadForCanvas();
myImage->LoadForImGui();
{{< /highlight >}}

3. 
    a. Pass it to the canvas wrapper in a drawable callback after ensuring it's loaded
{{< highlight cpp "linenos=table" >}}
if (myImage->IsLoadedForCanvas()) {
 canvas.DrawTexture(myImage.get(), 1); 
 // there are multiple functions in the canvaswrapper that accept ImageWrapper*
}
{{< /highlight >}}

    b. Use it in your imgui render code. Again checking that it's loaded
{{< highlight cpp "linenos=table" >}}
if (myImage->IsLoadedForImGui() && auto pTex = myImage->GetImguiTex()) {
    auto rect = myImage->GetSizeF();
    ImGui::Image(pTex, { rect.width, rect.height });
}
{{< /highlight >}}


PS:
The backend will load in the resource whenever you try to use the images if it hasn't already been loaded. So you actually don't have to worry about it, but the loading can cause some lag\stutters.
So it's better to do it during loading the plugin -  when such behaviour can be expected.

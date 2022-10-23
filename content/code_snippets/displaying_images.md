---
title: Displaying Images
author: Adam Gerhant
---

This page will cover how to display an image with ImGui and canvas. The difference between the two methods is that canvas provides better drawing tools, while ImGui provides widgets which can be used interactively. It is possible to use both ImGui and canvas together for a combination of custom shapes and interactive controls.

## Displaying with ImGui

The main concept behind displaying an image with ImGui is to create a window with a clear background and no border. The image can then be displayed on this window.

In your .h, declare your image

`private std::shared_ptr<ImageWrapper> myImage;`

In your onLoad, load your image

{{< highlight cpp "linenos=table" >}}

myImage = std::make_shared<ImageWrapper>(gameWrapper->GetDataFolder() / "myimage.png", true, true);
	
{{< / highlight >}}
	
Create a clear window by using these flags in the begin function, as well as setting the position. This code should be in your Render() function.

{{< highlight cpp "linenos=table" >}}
ImGuiWindowFlags WindowFlags = ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_AlwaysAutoResize | ImGuiWindowFlags_NoFocusOnAppearing | ImGuiWindowFlags_NoBackground | ImGuiWindowFlags_NoTitleBar | ImGuiWindowFlags_NoScrollbar;
if (!ImGuiBegin(menuTitle_.c_str(), &isWindowOpen_, WindowFlags))
	{
		 Early out if the window is collapsed, as an optimization.
		ImGuiEnd();
		return;
}

//code will be here

ImGuiEnd();
{{< / highlight >}}

Since the image takes a few second to load from when the window is opened, an optional optimization is to always leave the window open and use an if statement to display your image.

{{< highlight cpp "linenos=table" >}}
if (shouldRenderImGui) {

}
{{< / highlight >}}

 After defining your ImageWrapper pointer in OnLoad(), use the following code to display the image. You can also show images in your plugin settings window with this same snippet!
 
{{< highlight cpp "linenos=table" >}}
if (myImage->IsLoadedForImGui()) {
	if (ImTextureID myImageTexture = myImage -> GetImGuiTex()) {
		auto rect = myImage -> GetSizeF();
		ImGui::Image(myImageTexture, ImVec2(rect.X, rect.Y));
	}
}
{{< / highlight >}}

View the code for the entire project here: https://github.com/adamgerhant/BakkesmodImageExample/tree/main/ImGuiImageExample/ImGuiImageExample

## Displaying with Canvas

First, start by intializing the canvas. In your .h, define the function that will take a canvas.
 
`void RenderCanvas(CanvasWrapper canvas);`

Add this code to OnLoad()

{{< highlight cpp "linenos=table" >}}
gameWrapper->RegisterDrawable([this](CanvasWrapper canvas) {
  RenderCanvas(canvas);
});

{{< / highlight >}}

Then add the RenderCanvas function

{{< highlight cpp "linenos=table" >}}
void CanvasImageExample::RenderCanvas(CanvasWrapper canvas) {

}
{{< / highlight >}}



Finally, add this code to the RenderCanvas

{{< highlight cpp "linenos=table" >}}
// Sets the canvas' color to white
// This is necessary to display images correctly. Without setting the color to white, images will be darker.
// Changing the alpha (last value) can be used to make the image more/less transparent
// Changing the RGB values can be used to give the image different tints
LinearColor color = { 255, 255, 255, 255 };
canvas.SetColor(color); 
 
if (myImage->IsLoadedForCanvas()) {	
		canvas.SetPosition(Vector2F{200.0f, 300.0f});
		canvas.DrawTexture(myImage.get(), 1); //the 1 represents the scale of the image
}
{{< / highlight >}}

View the code for the entire project here: https://github.com/adamgerhant/BakkesmodImageExample/tree/main/CanvasImageExample/CanvasImageExample

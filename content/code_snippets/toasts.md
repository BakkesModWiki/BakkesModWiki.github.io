---
title: Toasts
author: ubelhj
---

Toasts are cool little popups that show on the top right of your game

![toast example](/img/toast-example.png)

These are useful for quick notifications that you want to disappear quickly

First you need to enable them in f2 - Misc - Enable notifications

![enable notifications](/img/enable-notifications.png)

Watch out though! Every user also has to enable this, so make sure your plugin page or [interface](/plugin_tutorial/plugin_interface/) is quite clear that this is necessary

Now to the code

Make a toast pop up with [GameWrapper](/bakkesmod_api/Classes/Wrappers/GameWrapper/)[.Toast()](https://github.com/bakkesmodorg/BakkesModSDK/blob/master/include/bakkesmod/wrappers/GameWrapper.h#L111)

There are 7 parameters. The first two are required. They are
1. The title, which is the word on top
1. The text, which is the smaller text below
1. The texture name which I'll explain in the next paragraph
1. The time to show the toast, which defaults to 3.5 seconds
1. The [ToastType](/bakkesmod_api/Enums/ToastType/), which chooses the color and defaults to black
1. The width in pixels. The toast automatically resizes to fit your text, so don't worry about these too much
1. The height in pixels

If you want to have a custom image, load it in your onLoad() using [GameWrapper](/bakkesmod_api/Classes/Wrappers/GameWrapper/).LoadToastTexture(). Provide the function with a name for your toast, and the path to the image. Most likely you'll want it to be in the data folder.

Toasts can be one of 4 colors based on the ToastType

![Image of 4 toast colors](/img/toast-colors.png)

I've made an example using CoolPlugin. I put this code in the onLoad() in CoolPlugin.cpp and cool.png in the `bakkesmod/data` folder
{{< highlight cpp "linenos=table" >}}
gameWrapper->LoadToastTexture("cool", gameWrapper->GetDataFolder() / "cool.png");

cvarManager->registerNotifier("cool_toast", [this](std::vector<std::string> args) {
    gameWrapper->Toast("Whoa you're cool", "Super cool", "cool", 5.0, ToastType_Warning);
}, "", PERMISSION_ALL);
{{< /highlight >}}

The result when I call `cool_toast` from the f6 console

![toast in action](/img/toast-in-action.png)

For perspective, it's quite small but still legible

![image of toast zoomed in](/img/toast-example.png)

Full code here
[https://github.com/ubelhj/BakkesModStarterPlugin/tree/toasts](https://github.com/ubelhj/BakkesModStarterPlugin/tree/toasts)
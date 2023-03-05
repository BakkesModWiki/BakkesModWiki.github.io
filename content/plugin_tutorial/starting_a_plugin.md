---
title: Starting a plugin
weight: 2
author: ubelhj
---

It will assume you're using the template as linked in [Setting Up](/plugin_tutorial/getting_started). You can of course make a plugin without it, but it gives an easier basis to work off of. You can name it anything, but here we'll be using a demo plugin named CoolPlugin

The template has a lot of commented out code that is designed to help you learn how to use the syntax. We'll uncomment some of this as we go along.

First we'll look at your `CoolPlugin.h` file. It describes any functions your code will use. 
At the top are two lines that are required for plugins, and allow you to call BakkesMod SDK functions
{{< highlight cpp "linenos=table" >}}
#pragma once
#include "bakkesmod/plugin/bakkesmodplugin.h"
{{< /highlight >}}

Next is the declaration of your class. Here you describe any functions you will be using.
`onLoad()` is automatically called by BakkesMod when the plugin is loaded, and `onUnload()` is called when it is unloaded. The unLoad isn't totally necessary, but we'll uncomment it to demonstrate
{{< highlight cpp "linenos=table" >}}
class CoolPlugin: public BakkesMod::Plugin::BakkesModPlugin
{
  void onLoad() override;
  void onUnload() override;
};
{{< /highlight >}}

Now we will look at the `CoolPlugin.cpp` file. Here you write the code that will define the functions  
First it includes your header so it can define the functions described above

{{< highlight cpp "linenos=table" >}}
#include "pch.h"
#include "CoolPlugin.h"
{{< /highlight >}}

Next it declares the plugin. The string in "" will be used in the plugin manager to describe the plugin, but it needs to be a short description. Keep it to 1 or two words. You can also define a plugin version, although the template handles that automatically. Finally is the plugin type. These don't do anything, so just use `PLUGINTYPE_FREEPLAY`. Your plugin will still work in any playlist and mode.

{{< highlight cpp "linenos=table" >}}
BAKKESMOD_PLUGIN(CoolPlugin, "Cool Plugin", plugin_version, PLUGINTYPE_FREEPLAY)
{{< /highlight >}}

Next you define your functions, starting with `onLoad()`. The template already has an onload. As this is a demo, we'll just do a hello world.
{{< highlight cpp "linenos=table" >}}
void CoolPlugin::onLoad() {
  // This line is required for LOG to work and must be before any use of LOG()
  _globalCvarManager = cvarManager;
  // do something when it loads
  LOG("Hello I'm CoolPlugin B)");
}
{{< /highlight >}}

Next is `onUnload()`. Bakkesmod handles most of unloading, so only worry about this if your code is using some 3rd party library that needs unloading to be handled specially. For now this can just add the new function to the bottom of CoolPlugin.cpp and log that it unloaded
{{< highlight cpp "linenos=table" >}}
void CoolPlugin::onUnload() {
  LOG("I was too cool for this world B'(");
}
{{< /highlight >}}

Now you've got a super basic plugin. Hit Build -> Build CoolPlugin or press ctrl + B to finalize the plugin. It will create `CoolPlugin.dll` in a `plugins/` folder next to your plugin source code. It will also move it into your bakkesmod folder if you are using the template.

Now open Rocket League and open the BakkesMod console with f6. Type `plugin load CoolPlugin` and you should see it load and say hello! If you unload it with `plugin unload CoolPlugin` you should see it say goodbye to you 😢

Next we'll make the plugin actually do something. We'll reverse engineer the `ballontop` command, which puts the ball on top of your car in freeplay.
In `CoolPlugin.h` add a new function
{{< highlight cpp "linenos=table" >}}
class CoolPlugin: public BakkesMod::Plugin::BakkesModPlugin
{
  virtual void onLoad();
  virtual void onUnload();
  void ballOnTop();
};
{{< /highlight >}}

We need to define that function in `CoolPlugin.cpp`. Just jump to the end of the file and add
{{< highlight cpp "linenos=table" >}}
void CoolPlugin::ballOnTop() {

}
{{< /highlight >}}
⠀
The next lines of code are all going to be within `CoolPlugin::ballOnTop()` in `CoolPlugin.cpp`

First we need to make sure we should be running the plugin. We only want it to work in freeplay. The `gameWrapper` gives a ton of useful functions to figure out what context the code is being run from. The first line of `CoolPlugin::ballOnTop()` will be
{{< highlight cpp "linenos=table" >}}
if (!gameWrapper->IsInFreeplay()) { return; }
{{< /highlight >}}

There are also `gameWrapper->IsInGame()` and `gameWrapper->IsInOnlineGame()` if you'd rather your plugin run elsewhere

The next line will be getting the `ServerWrapper`.  This is what controls pretty much everything in the current game. You can get players, cars, the ball, the goals, and other things from it so it's incredibly useful. **[We also nullcheck it](/plugin_tutorial/best_practices/)**. If you call functions on a null server Rocket League will crash
 {{< highlight cpp "linenos=table" >}}
ServerWrapper server = gameWrapper->GetCurrentGameState();
if (!server) { return; }
{{< /highlight >}}

Next we get the ball and nullcheck it
{{< highlight cpp "linenos=table" >}}
BallWrapper ball = server.GetBall();
if (!ball) { return; }
{{< /highlight >}}

And we get the car. As this is freeplay we only have one to worry about, but in any mode this will select your car. And we nullcheck it. If this seems redundant, it isn't. What if your car was demolished? Without this nullcheck, you'd crash your game if you ran the command before the respawn.
{{< highlight cpp "linenos=table" >}}
CarWrapper car = gameWrapper->GetLocalCar();
if (!car) { return; }
{{< /highlight >}}

Next we can start manipulating things. We can grab the car's velocity and assign it to the ball so they match. If the ball is going slower or faster than the car, it'll just fly off by itself
{{< highlight cpp "linenos=table" >}}
Vector carVelocity = car.GetVelocity();
ball.SetVelocity(carVelocity);
{{< /highlight >}}

Next we'll actually move the ball. A Vector is a 3 dimensional point in space. The Z axis is up and down in Rocket League, so we can put the ball above the car by using the car's location and adding distance on the Z axis.
{{< highlight cpp "linenos=table" >}}
Vector carLocation = car.GetLocation();
float ballRadius = ball.GetRadius();
ball.SetLocation(carLocation + Vector{0, 0, ballRadius * 2});
{{< /highlight >}}

We've now defined `CoolPlugin::ballOnTop()`
In full:
{{< highlight cpp "linenos=table" >}}
void CoolPlugin::ballOnTop() {
  if (!gameWrapper->IsInFreeplay()) { return; }
  ServerWrapper server = gameWrapper->GetCurrentGameState();
  if (!server) { return; }

  BallWrapper ball = server.GetBall();
  if (!ball) { return; }
  CarWrapper car = gameWrapper->GetLocalCar();
  if (!car) { return; }

  Vector carVelocity = car.GetVelocity();
  ball.SetVelocity(carVelocity);

  Vector carLocation = car.GetLocation();
  float ballRadius = ball.GetRadius();
  ball.SetLocation(carLocation + Vector{0, 0, ballRadius * 2});
}
{{< /highlight >}}

Now we need to call the function

This can be done with a notifier. These can be called with a console command to activate your code. Here we'll define it as `CoolerBallOnTop` because Bakkes' `ballontop` is for the birds.
When it's called, it takes a vector (basically a list) of command arguments that were provided by the command. Here we don't care about those, so they are unused.
The code is called in a lambda `[](){}`. You can just copy the syntax here.
Next is the notifier description, which does nothing, so it'll be `""`.
Finally is the permissions, which decides when the notifier works. It should usually be `PERMISSION_ALL`, as that works anywhere. If you want to restrict the use to specific modes or game states, you can use any of the [permissions listed here](/bakkesmod_api/Enums/NOTIFIER_PERMISSION/)
{{< highlight cpp "linenos=table" >}}
cvarManager->registerNotifier("CoolerBallOnTop", [this](std::vector<std::string> args) {
    ballOnTop();
}, "", PERMISSION_ALL);
{{< /highlight >}}

Now we'll put it all together
{{< highlight cpp "linenos=table" >}}
// CoolPlugin.h
#pragma once

#include "bakkesmod/plugin/bakkesmodplugin.h"
#include "bakkesmod/plugin/pluginwindow.h"
#include "bakkesmod/plugin/PluginSettingsWindow.h"

#include "version.h"
constexpr auto plugin_version = stringify(VERSION_MAJOR) "." stringify(VERSION_MINOR) "." stringify(VERSION_PATCH) "." stringify(VERSION_BUILD);


class CoolPlugin: public BakkesMod::Plugin::BakkesModPlugin
  //,public SettingsWindowBase
  //,public PluginWindowBase
{

  //std::shared_ptr<bool> enabled;

  //Boilerplate
  void onLoad() override;
  void onUnload() override;
  void ballOnTop();

public:
  //void RenderSettings() override;
  //void RenderWindow() override;
};

{{< /highlight >}}

{{< highlight cpp "linenos=table" >}}
// CoolPlugin.cpp
#include "pch.h"
#include "CoolPlugin.h"


BAKKESMOD_PLUGIN(CoolPlugin, "Cool Plugin", plugin_version, PLUGINTYPE_FREEPLAY)

std::shared_ptr<CVarManagerWrapper> _globalCvarManager;

void CoolPlugin::onLoad()
{
  // This line is required for LOG to work and must be before any use of LOG()
  _globalCvarManager = cvarManager;
  // do something when it loads
  LOG("Hello I'm CoolPlugin B)");

  cvarManager->registerNotifier("CoolerBallOnTop", [this](std::vector<std::string> args) {
    ballOnTop();
    }, "", PERMISSION_ALL);
}

void CoolPlugin::onUnload() {
  LOG("I was too cool for this world B'(");
}

void CoolPlugin::ballOnTop() {
  if (!gameWrapper->IsInFreeplay()) { return; }
  ServerWrapper server = gameWrapper->GetCurrentGameState();
  if (!server) { return; }

  BallWrapper ball = server.GetBall();
  if (!ball) { return; }
  CarWrapper car = gameWrapper->GetLocalCar();
  if (!car) { return; }

  Vector carVelocity = car.GetVelocity();
  ball.SetVelocity(carVelocity);

  Vector carLocation = car.GetLocation();
  float ballRadius = ball.GetRadius();
  ball.SetLocation(carLocation + Vector{ 0, 0, ballRadius * 2 });
}
{{< /highlight >}}

Finally build the plugin with ctrl + b. Then start freeplay, load the plugin with `plugin load CoolPlugin` and call `CoolerBallOnTop` from the f6 console. The ball should teleport above you!
  
If you want your plugin to load automatically on startup, you can use the plugin manager in game (under the "Plugins" tab in the BakkesMod menu) and toggle the "Loaded" checkbox for your plugin.

You can find the final code here!
[https://github.com/ubelhj/BakkesModStarterPlugin/tree/new-starter-tutorial](https://github.com/ubelhj/BakkesModStarterPlugin/tree/new-starter-tutorial)

Now what if you wanted a user to be able to modify plugin behavior on the fly? [Next are Plugin Variables](/plugin_tutorial/plugin_variables)

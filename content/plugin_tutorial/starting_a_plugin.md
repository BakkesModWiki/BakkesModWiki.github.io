---
title: Starting a plugin
tags: [getting_started]
permalink: starting_a_plugin.html
folder: plugintutorial
---

It will assume you're using the template as linked in [Setting Up](getting_started.html). You can of course make a plugin without it, but it gives an easier basis to work off of. You can name it anything, but here we'll be using a demo plugin named CoolPlugin

The template has a lot of commented out code that is designed to help you learn how to use the syntax, but is ignored for the purposes of this tutorial

First we'll look at your `CoolPlugin.h` file. It describes any functions your code will use
At the top are two lines that are required for plugins, and allow you to call BakkesMod SDK functions
```cpp
#pragma once
#include "bakkesmod/plugin/bakkesmodplugin.h"
```
Next is the declaration of your class. Here you describe any functions you will be using. 
`onLoad()` is automatically called by BakkesMod when the plugin is loaded, and `onUnload()` is called when it is unloaded
```cpp
class CoolPlugin: public BakkesMod::Plugin::BakkesModPlugin
{
  virtual void onLoad();
  virtual void onUnload();
};
```

Now we will look at the `CoolPlugin.cpp` file. Here you write the code that will define the functions
First it includes your header so it can define the functions described above
```cpp
#include "pch.h"
#include "CoolPlugin.h"
```
Next it declares the plugin. The string in "" will be used in the plugin manager to describe the plugin, but it needs to be a short description. Keep it to 1 or two words. You can also define a plugin version, although the template handles that automatically. Finally is the plugin type described in the linked page. If you don't know what it is, just use `PLUGINTYPE_FREEPLAY`. 
https://discord.com/channels/862068148328857700/862077132922028083/862388590091960350 TODO REPLACEME
```cpp
BAKKESMOD_PLUGIN(CoolPlugin, "Cool Plugin", plugin_version, PLUGINTYPE_FREEPLAY)
```

Next you define your functions, starting with `onLoad()`. As this is a demo, we'll just do a hello world.
```cpp
void CoolPlugin::onLoad() {
  // do something when it loads
  cvarManager->log("Hello I'm CoolPlugin B)");
}
```

Next is `onUnload()`. Bakkesmod handles most of unloading, so only worry about this if your code is using some 3rd party library that needs unloading to be handled specially. For now this can just log that it unloaded
```cpp
void CoolPlugin::onUnload() {
  cvarManager->log("I was too cool for this world B'(");
}
```

Now you've got a super basic plugin. Hit Build -> Build CoolPlugin or press ctrl + B to finalize the plugin. It will create `CoolPlugin.dll` in a `plugins/` folder next to your plugin source code. It will also move it into your bakkesmod folder if you are using the template. 

Now open Rocket League and open the BakkesMod console with f6. Type `plugin load CoolPlugin` and you should see it load and say hello! If you unload it with `plugin unload CoolPlugin` you should see it say goodbye to you :cry:

Next we'll make the plugin actually do something. We'll reverse engineer the `ballontop` command, which puts the ball on top of your car in freeplay. 
In `CoolPlugin.h` add a new function
```cpp
class CoolPlugin: public BakkesMod::Plugin::BakkesModPlugin
{
  virtual void onLoad();
  virtual void onUnload();
  void ballOnTop();
};
```

We need to define that function in `CoolPlugin.cpp`. Just jump to the end of the file and add
```cpp
void CoolPlugin::ballOnTop() {

}
```
⠀
The next lines of code are all going to be within `CoolPlugin::ballOnTop()` in `CoolPlugin.cpp`

First we need to make sure we should be running the plugin. We only want it to work in freeplay. The `gameWrapper` gives a ton of useful functions to figure out what context the code is being run from. The first line of `CoolPlugin::ballOnTop()` will be
```cpp
if (!gameWrapper->IsInFreeplay()) { return; }
```
There are also `gameWrapper->IsInGame()` and `gameWrapper->IsInOnlineGame()` if you'd rather your plugin run elsewhere

The next line will be getting the `ServerWrapper`.  This is what controls pretty much everything in the current game. You can get players, cars, the ball, the goals, and other things from it so it's incredibly useful. **We also nullcheck it**. If you call functions on a null server Rocket League will crash
 ```cpp
ServerWrapper server = gameWrapper->GetCurrentGameState();
if (!server) { return; }
```

Next we get the ball and nullcheck it
```cpp
BallWrapper ball = server.GetBall();
if (!ball) { return; }
```

And we get the car. As this is freeplay we only have one to worry about, but in any mode this will select your car. And we nullcheck it. If this seems redundant, it isn't
```cpp
CarWrapper car = gameWrapper->GetLocalCar();
if (!car) { return; }
```

Next we can start manipulating things. We can grab the car's velocity and assign it to the ball so they match. If the ball is going slower or faster than the car, it'll just fly off by itself
```cpp
Vector carVelocity = car.GetVelocity();
ball.SetVelocity(carVelocity);
```

Next we'll actually move the ball. A Vector is a 3 dimensional point in space. The Z axis is up and down in Rocket League, so we can put the ball above the car by using the car's location and adding distance on the Z axis. 
```cpp
Vector carLocation = car.GetLocation();
float ballRadius = ball.GetRadius();
ball.SetLocation(carLocation + Vector{0, 0, ballRadius * 2});
```

We've now defined `CoolPlugin::ballOnTop()`
In full: 
```cpp
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
```

Now we need to call the function

This can be done with a notifier. These can be called with a console command to activate your code. Here we'll define it as `CoolerBallOnTop` because Bakkes' `ballontop` is for the birds. 
When it's called, it takes a vector (basically a list) of command arguments that were provided by the command. Here we don't care about those, so they are unused. 
The code is called in a lambda `[](){}`. You can just copy the syntax here.
Next is the notifier description, which does nothing, so it'll be `""`. 
Finally is the permissions, which should usually be `PERMISSION_ALL`. If you want to restrict it you can use the list LINKED HERE
```cpp
cvarManager->registerNotifier("CoolerBallOnTop", [this](std::vector<std::string> args) {
    ballOnTop();
}, "", PERMISSION_ALL);
```

Now we'll put it all together.
```cpp
// CoolPlugin.h
#pragma once

#include "bakkesmod/plugin/bakkesmodplugin.h"
#include "bakkesmod/plugin/pluginwindow.h"

class CoolPlugin : public BakkesMod::Plugin::BakkesModPlugin
{
    virtual void onLoad();
    virtual void onUnload();
    void ballOnTop();
};
```
```cpp
// CoolPlugin.cpp
#include "pch.h"
#include "CoolPlugin.h"

BAKKESMOD_PLUGIN(CoolPlugin, "Cool Plugin", plugin_version, PLUGINTYPE_FREEPLAY)

void CoolPlugin::onLoad()
{
    
  cvarManager->log("Hello I'm CoolPlugin B)");
  cvarManager->registerNotifier("CoolerBallOnTop", [this](std::vector<std::string> args) {
    ballOnTop();
  }, "", PERMISSION_ALL);
}

void CoolPlugin::onUnload() {
  cvarManager->log("I was too cool for this world B'(");
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
```

Finally build the plugin with ctrl + b. Then start freeplay, load the plugin with `plugin load CoolPlugin` and call `CoolerBallOnTop` from the f6 console. The ball should teleport above you!

You can find the final code here!
[https://github.com/ubelhj/BakkesModStarterPlugin/tree/starter-tutorial](https://github.com/ubelhj/BakkesModStarterPlugin/tree/starter-tutorial)

Now what if you wanted a user to be able to modify plugin behavior on the fly? [Next are Plugin Variables](plugin_variables.html)
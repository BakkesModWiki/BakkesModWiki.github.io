---
title: Plugin Variables
tags: [getting_started]
permalink: plugin_variables.html
folder: plugintutorial
---

Next we will make your plugin alterable by a user. They might want to enable/disable the plugin, change how it acts, and pretty much infinite options. I'll be using a fairly simple plugin I've made as an example. I'll only be focusing on the settings, not the actual code that makes it work.
We'll continue the CoolPlugin from [Starting a Plugin](starting_a_plugin.html)

We give the users control with the Console Variables, CVars. They allow a user to set a named variable's value, and for our code to know when those values are changed. These can be used to store string, int, bool, float, or color values

To create one, we call `cvarManager->registerCvar()`
There are 2-9 arguments. The first 2 are required, but the others are not
1. The name. This should include your plugin name and make sense
2. The default value as a string. If it's a boolean, remember 0 is false and 1 is true
3. A description of the CVar as a string. The name can describe your variable well, so this isn't super necessary
4. Whether your CVar is searchable. If someone starts typing the name of your CVar, and this is true it suggests the CVar. Defaults to `true`
5. Whether your CVar has a minimum value. Defaults to `false`
6. The minimum value of your CVar if it exists. If the previous is `false` this value can be anything and is ignored
7. Whether your CVar has a maximum value. Defaults to `false`
8. The maximum value of your CVar if it exists. If the previous is `false` this value can be anything and is ignored
9. Whether the CVar's value is stored between sessions. Defaults to `true`

To create an enable/disable CVar for the plugin and a ball distance CVar
```cpp
cvarManager->registerCvar("cool_enabled", "0", "Enable Cool", true, true, 0, true, 1);
cvarManager->registerCvar("cool_distance", "200.0", "Distance to place the ball above");
```

A user can use these by typing into the f6 console `cool_enabled 1` to enable cool, or `cool_distance 300` to move the ball away

Now we've got the CVar. But what do we do with it? There's two good ways to use it. Either we can do something when the value is changed, or we can get the value from the CVar as we use the value

First is `CVarWrapper.addOnValueChanged()`
This creates a function that is called when the value is changed. Quite simple. The string simply is what the old value was. The CVarWrapper holds the new value.  
The `[](){}` is called a lambda, and is basically just a helper function. We put `[this]` so we can access our global variables inside the lambda. `(std::string oldValue, CVarWrapper cvar)` are the values passed to the lambda by the `addOnValueChanged` function. Every time the value changes and the lambda is called, the code inside `{}` happens. 
The most common use is to change the value of a global variable.  
If I had a variable `bool coolEnabled`, I could call `coolEnabled = cvar.getBoolValue();` inside the brackets to change its value
```cpp
cvarManager->registerCvar("cool_enabled", "0", "Enable Cool", true, true, 0, true, 1)
        .addOnValueChanged([this](std::string oldValue, CVarWrapper cvar) {
            coolEnabled = cvar.getBoolValue();
        });
```

The second is by getting the CVar and then its value in another function. We can call
`cvarManager->getCvar()` with the name of any CVar to get and/or set the value of that CVar, even ones that aren't from our plugin.
```cpp
CVarWrapper distanceCVar = cvarManager->getCvar("cool_distance");
if (!distanceCVar) { return; }
float distance = distanceCVar.getFloatValue();
```

We can put together this knowledge to add to `CoolPlugin.cpp`
[https://github.com/ubelhj/BakkesModStarterPlugin/blob/plugin-settings/CoolPlugin/CoolPlugin.cpp](https://github.com/ubelhj/BakkesModStarterPlugin/blob/plugin-settings/CoolPlugin/CoolPlugin.cpp)

This isn't enough though. Who want to be changing an integer value with a console command? Gross. What if we had sliders? Checkboxes? Buttons?
[Plugin Interface](plugin_interface.html)
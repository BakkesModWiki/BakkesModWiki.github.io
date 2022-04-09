---
title: Logging
author: ubelhj
---

Hitting f6 in Rocket League with BakkesMod running opens the console. You can log to this with a helpful template function, `LOG()`.

LOG uses a really smart formatting library to make your life easier called [fmt](https://fmt.dev/latest/index.html)

Here's an example. Simply put, it replaces any `{}` in the string with whatever arguments you put after
```cpp
float a = 10.10;
int b = 11;
std::string c = "12";
bool d = false;

LOG("a = {}, b = {}, c = {}, d = {}", a, b, c, d);
// outputs [class OBSCounter] a = 10.1, b = 11, c = 12, d = false
```

There's one tiny caveat. Make sure that you only use LOG after the line `_globalCvarManager = cvarManager;` is run in onLoad(), as it depends on `_globalCvarManager`. You can use it immediately after that line. 

[Check out fmt docs here for more features](https://fmt.dev/latest/index.html)
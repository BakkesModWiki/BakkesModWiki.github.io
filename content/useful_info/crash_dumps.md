---
title: Crash Dumps
author: ubelhj
---

Modding RL is finnicky. You're going to crash the game at some point. This will tell you how to learn from a crash and solve your issue.

Crashes are often logged in .dmp files. They are found at
`My Documents/My Games/rocketleague/TAGame/Logs`

Unfortunately sometimes there is no .dmp file. That often means you crashed in a non-game thread, like rendering or websockets. For those you might just need to do some logging to find out where you crashed

![image of files](/img/crash-dump-file-naming.png)

Make sure you have the exact version of the source code that crashed the game and the .pdb of that exact build loaded in a visual studio project. For this I highly recommend using git. Even for private projects, this can save you when you have to look back at old versions of code. Make a commit for the source code that you've uploaded to bakkesplugins.

Drag the .dmp over the visual studio window

You'll get a Minidump File Summary, which explains in super basic terms what the issue was. It won't be specific though, so hit the green "Debug with Native Only" button

![Debug with Native Only](/img/debug-with-native.png)

Next it will try to load symbols. If this is taking more than a couple seconds, it's loading too many symbols. Cancel the loading and go to Debug -> Options -> Symbols

![/img/vs-options.png](/img/vs-options.png)

Make sure that Microsoft Symbol Servers is the only symbol location selected and that Load only specified modules is selected

![/img/vs-load-specified-modules.png](/img/vs-load-specified-modules.png)

Then try to debug with native again. Be aware that these settings mysteriously can reset themselves (they did so in the time it took me to write this up) so you might have to refer back here fairly often.

![/img/null-pointer-debug-example.png](/img/null-pointer-debug-example.png)

If Visual Studio can find the issue, it will then tell you the issue and automatically jump to it. I dereferenced a null pointer! Oops

Sometimes it's a little less easy, and the issue happens in pluginsdk.dll or RocketLeague.exe. In this case Visual Studio will try its best to find it but may fail

![/img/null-wrapper-debug-example.png](/img/null-wrapper-debug-example.png)

This crash happened because of a null ball! [Remember the best practices!](/plugin_tutorial/best_practices) Whenever you use any type that ends with `Wrapper` like this `BallWrapper` you must nullcheck it before using it. These 4 lines of code will save your plugin from crashing

{{< highlight cpp "linenos=table" >}}
BallWrapper* ball = (BallWrapper*) nullptr;

if (!ball) {
  LOG("null ball");
  // I am saved from crashing!
  return;
}

// guaranteed to only happen on valid balls and not crash
ball->SetLocation(Vector(0, 0, 0));
{{< /highlight >}}

Once you've found the issue, hit the red square up top

![/img/stop-debugging.png](/img/stop-debugging.png)

Hopefully you've found your issue. If not, try adding many `LOG("");` in places where you're suspicious a crash may have happened. If a log doesn't happen that you expected to, you likely crashed before that statement. Debugging can be tedious, but hopefully the .dmp files can help
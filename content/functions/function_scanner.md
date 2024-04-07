---
title: Function Scanner
weight: 2
author: ubelhj
---

Trying to hook an event but don't know what event to use? There's way more events out there than can be documented, so you can find one yourself with the function scanner

**I highly recommend this video** I made to understand how to use it, but there's also a text guide below
[https://www.youtube.com/watch?v=gDZ1wWKE8aw](https://www.youtube.com/watch?v=gDZ1wWKE8aw)

## Set the -dev option

On Steam:
Right click the game and hit properties
Then add the option  
![properties](/img/steam-context-menu.png)  
![added option](/img/steam-launch-options.png)

On Epic: 

Hit Settings
Scroll down to Rocket League, enable Additional Command Line arguments, then add -dev  
![epic settings](/img/epic-settings.png)  
![epic added option](/img/epic-launch-options.png)

## Reboot and open scanner

Now that you've enabled -dev, reboot rocket league with bakkesmod open
Once injected, open the console with f6 and type `togglemenu devtools`
The scanner will now open  
![scanner](/img/function-scanner.png)

## Use the scanner

You can select any words you think are relevant and add them to the whitelist. Any words that aren't relevant can be added to the blacklist. Separate words with `,` but no space `a, b` will match `a` and `[space]b`. When you hit apply, any functions containing words matching the whitelist and not matching the blacklist will appear. These will appear as they happen, so it's a good way to find out when functions fire, and what timing you want. [This video](https://www.youtube.com/watch?v=gDZ1wWKE8aw) does a much better job of explaining this part

## Hook the Function

When you've found the right function, hook it using `gameWrapper->HookEvent()`. [Details here](/functions/using_function_hooks/). Every time that function happens, your code will be run. This can be used to know when something important happens (a goal), get pointers to hard-to-find wrappers, or just be used to help you do something on a consistent timer.

If you want to use the caller, the Bakkesmod caller will be based off of the Rocket League calling class / calling object name. Most functions are called by classes named Something_TA. Remove the _TA at the end and look for any wrappers with similar names. If a wrapper matches, that is the caller. For example, `"Function TAGame.Car_TA.OnHitBall"` is called by a `Car_TA`. The prefix is `Car`, so it's wrapped by [CarWrapper](/bakkesmod_api/Classes/Wrappers/GameObject/CarWrapper/). Not all callers are wrapped though. If you absolutely need the caller and it's unwrapped, ask for help and give some reasoning as to why you need the caller. If it's useful, it might be added to BakkesMod.

This image shows the breakdown of the function name  
![functionnaming.png](/img/functionnaming.png)

Hooks are the hardest part of Bakkesmod programming, but can have the most interesting results
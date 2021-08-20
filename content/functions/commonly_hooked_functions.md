---
title: Commonly Hooked Functions
tags: [HookEvent]
permalink: commonly_hooked_functions.html
geekdocCollapseSection: true
---

This is a list of functions that we use regularly, as well as when they fire. We'll never be able to document them all but hopefully this helps. Hook them with [code_snippets_using_function_hooks.html](code_snippets_using_function_hooks.html)

TODO LINK WRAPPERS WHEN ADDED

`"Function TAGame.Car_TA.SetVehicleInput"` This event is called every physics tick while you are playing. This is 120 times per second. This can be highly useful but isn't perfect. It doesn't fire while spectating matches. While hosting a match it fires once per tick per car in the match. The caller is a `CarWrapper`

`"Function Engine.GameViewportClient.Tick"` This event is called every rendered frame. This is very powerful, but again can have issues. Different framerates and stutters can make the number of ticks different on different PCs

`"Function TAGame.Ball_TA.OnCarTouch"` This event is called when a ball hits a car. The caller is the ball that hit, and the first parameter is the car touched

`"Function TAGame.Car_TA.OnHitBall"` This event is called when a car hits a ball. The caller is the car that hit, and the first parameter is the ball touched

`"Function TAGame.GameEvent_Soccar_TA.EventMatchEnded"` Happens at the end of a match when the podium is shown. If someone quits early it is not called

`"Function TAGame.GFxData_MainMenu_TA.MainMenuAdded"` Happens when the main menu is opened, either through booting the game or leaving a mode
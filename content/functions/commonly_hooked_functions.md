---
title: Commonly Hooked Functions
weight: 3
---

This is a list of functions that we use regularly, as well as when they fire. We'll never be able to document them all but hopefully this helps. Hook them with [Function Hooks](/functions/using_function_hooks/)

`"Function TAGame.Car_TA.SetVehicleInput"` This event is called every physics tick while you are playing. This is 120 times per second. This can be highly useful but isn't perfect. It doesn't fire while spectating matches. While hosting a match it fires once per tick per car in the match. The caller is a [CarWrapper](/bakkesmod_api/Classes/Wrappers/GameObject/CarWrapper/)

`"Function Engine.GameViewportClient.Tick"` This event is called every rendered frame. This is very powerful, but again can have issues. Different framerates and stutters can make the number of ticks different on different PCs

`"Function TAGame.Ball_TA.OnCarTouch"` This event is called when a [BallWrapper](/bakkesmod_api/Classes/Wrappers/GameObject/BallWrapper/) hits a car. The caller is the ball that hit, and the first parameter is the [CarWrapper](/bakkesmod_api/Classes/Wrappers/GameObject/CarWrapper/) touched

`"Function TAGame.Car_TA.OnHitBall"` This event is called when a car hits a ball. The caller is the [CarWrapper](/bakkesmod_api/Classes/Wrappers/GameObject/CarWrapper/) that hit, and the first parameter is the [BallWrapper](/bakkesmod_api/Classes/Wrappers/GameObject/BallWrapper/) touched

`"Function TAGame.GameEvent_Soccar_TA.EventMatchEnded"` Happens at the end of a match when the podium is shown. If someone quits early it is not called. The caller is a [ServerWrapper](/bakkesmod_api/Classes/Wrappers/GameEvent/ServerWrapper/).

`"Function TAGame.GameEvent_Soccar_TA.Destroyed"` Happens when the user quits an active game. The caller is a [ServerWrapper](/bakkesmod_api/Classes/Wrappers/GameEvent/ServerWrapper/).

`"Function TAGame.GFxData_MainMenu_TA.MainMenuAdded"` Happens when the main menu is opened, either through booting the game or leaving a mode

`"Function GameEvent_TA.Countdown.BeginState"` Happens when a match countdown begins or at the beginning/reset of freeplay

`"Function TAGame.Ball_TA.OnHitGoal"` Happens when a goal is scored

`"Function TAGame.GameEvent_Soccar_TA.OnGameTimeUpdated"` Happens when the time on the game clock changes. Note that this is not real time. At 0:00 with the ball up it won't be called

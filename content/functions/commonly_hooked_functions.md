---
title: Commonly Hooked Functions
weight: 3
author: dozens of helpful people in the community who post open source plugins
---

This is a list of functions that we use regularly, as well as when they fire. We'll never be able to document them all but hopefully this helps. Hook them with [Function Hooks](/functions/using_function_hooks/)

## [BallWrapper Caller](/bakkesmod_api/Classes/Wrappers/GameObject/BallWrapper/)
`"Function TAGame.Ball_TA.OnCarTouch"`  
This event is called when a [BallWrapper](/bakkesmod_api/Classes/Wrappers/GameObject/BallWrapper/) hits a car. The caller is the ball that hit, and the first parameter is the [CarWrapper](/bakkesmod_api/Classes/Wrappers/GameObject/CarWrapper/) touched

`"Function TAGame.Ball_TA.OnHitGoal"`  
Happens when a goal is scored

`"Function TAGame.Ball_TA.Explode"`  
Happens when a ball explodes. Usually this means a goal was scored

## [CarWrapper Caller](/bakkesmod_api/Classes/Wrappers/GameObject/CarWrapper/)
`"Function TAGame.Car_TA.SetVehicleInput"`  
This event is called every physics tick while you are playing. This is 120 times per second. This can be highly useful but isn't perfect. It doesn't fire while spectating matches. While hosting a match it fires once per tick per car in the match

`"Function TAGame.Car_TA.OnHitBall"`  
This event is called when a car hits a ball. The caller is the [CarWrapper](/bakkesmod_api/Classes/Wrappers/GameObject/CarWrapper/) that hit, and the first parameter is the [BallWrapper](/bakkesmod_api/Classes/Wrappers/GameObject/BallWrapper/) touched

## [ReplayDirectorWrapper Caller](/bakkesmod_api/Classes/Wrappers/GameEvent/ReplayDirectorWrapper/)
`"Function TAGame.ReplayDirector_TA.OnScoreDataChanged"`  
Happens when a goal replay shows a goal's scorer, assister, speed, and other information

## [ServerWrapper Caller](/bakkesmod_api/Classes/Wrappers/GameEvent/ServerWrapper/)
`"Function TAGame.GameEvent_Soccar_TA.EventMatchEnded"`  
Happens at the end of a match when the podium is shown. If someone quits early it is not called

`"Function TAGame.GameEvent_Soccar_TA.Destroyed"`  
Happens when the user quits an active game

`"Function TAGame.GameEvent_Soccar_TA.OnGameTimeUpdated"`  
Happens when the time on the game clock changes. Note that this is not real time. At 0:00 with the ball up it won't be called

`"Function TAGame.GameEvent_Soccar_TA.OnOvertimeUpdated"`  
Happens when overtime begins

`"Function GameEvent_Soccar_TA.ReplayPlayback.BeginState"`  
Happens when a goal replay begins

`"Function GameEvent_Soccar_TA.ReplayPlayback.EndState"`  
Happens when a goal replay ends

`"Function GameEvent_Soccar_TA.Active.StartRound"`  
Happens when all players are set for a kickoff. This happens at every single kickoff

`"Function GameEvent_Soccar_TA.Countdown.BeginState"`  
Happens at the start of a kickoff countdown or at the beginning/reset of freeplay

`"Function TAGame.GameEvent_Soccar_TA.Destroyed"`  
Happens when a match is left by the player. The caller may be null or unsafe to use as the match is destroyed

## [StatEventWrapper Caller](/bakkesmod_api/Classes/Wrappers/GameObject/Stats/StatEventWrapper/)
### [StatEventWrapper functions are explained here](/functions/stat_events/)
`"Function TAGame.GFxHUD_TA.HandleStatTickerMessage"`  
Called any time a stat should appear on the top right ticker, even if it's disabled.  
`"Function TAGame.GFxHUD_TA.HandleStatEvent"`  
Called any time a stat should appear in the center of the screen, even if it's disabled.  

## [TeamWrapper Caller](/bakkesmod_api/Classes/Wrappers/GameObject/TeamWrapper/)
`"Function TAGame.Team_TA.PostBeginPlay"`  
Happens twice at the start of a match, once per team that is totally joined and ready. It can be used to detect the start of a match. This only works when the player is in the match as it starts, so it's inconsistent in casual where you can join matches in progress

## Unwrapped callers

`"Function TAGame.GFxData_MainMenu_TA.MainMenuAdded"`  
Happens when the main menu is opened, either through booting the game or leaving a mode

`"Function Engine.GameViewportClient.Tick"`  
This event is called every rendered frame. This is very powerful, but again can have issues. Different framerates and stutters can make the number of ticks different on different PCs
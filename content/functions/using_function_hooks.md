---
title: Using Function Hooks
weight: 1
author: ubelhj
---

Function hooks are a powerful part of BakkesMod. After a function is hooked, any time it is called by Rocket League, your code is called as well. Many useful ones are documented in [Commonly Hooked Functions](/functions/commonly_hooked_functions/). If you want to better understand them or hook a function that's undocumented, hopefully this page will help.

There are multiple types of hooks. First are the two simpler ones. `gameWrapper` is a [GameWrapper](/bakkesmod_api/Classes/Wrappers/GameWrapper/) and will be accessible from any point in your code.
{{< highlight cpp "linenos=table" >}}
gameWrapper->HookEvent("Function TAGame.Car_TA.SetVehicleInput",
  [this](std::string eventName) {
    // Your Code here
    // Call another function or just do your things here
});

gameWrapper->HookEventPost("Function TAGame.Car_TA.SetVehicleInput",
  [this](std::string eventName) {
    // Your Code here
});
{{< /highlight >}}

`HookEvent` runs your code as the function is called
`HookEventPost` runs your code as the function is returned from
They return a `std::string` which is the name of the calling function. This is useful to differentiate what your caller is if you have multiple hooks calling the same code.

{{< highlight cpp "linenos=table" >}}
gameWrapper->HookEventWithCaller<CarWrapper>("Function TAGame.Car_TA.SetVehicleInput",
  [this](CarWrapper caller, void* params, std::string eventname) {
    // Your Code here
});

gameWrapper->HookEventWithCallerPost<CarWrapper>("Function TAGame.Car_TA.SetVehicleInput",
  [this](CarWrapper caller, void* params, std::string eventname) {
    // Your Code here
});
{{< /highlight >}}

The two WithCaller variants do the same thing, but let you know a bit more about what is using the function

They provide a `caller` value which is obtained from the function's name. After `Function TAGame` there will be a class name ending in `_TA`. If the name matches a wrapper name, you can hook it as that wrapper. `Car_TA` becomes [CarWrapper](/bakkesmod_api/Classes/Wrappers/GameObject/CarWrapper/) for example. The image below breaks up a function call into parts. The class is GameEvent_TA, which can be cast to a [ServerWrapper](/bakkesmod_api/Classes/Wrappers/GameEvent/ServerWrapper/).  
![Function naming convention](/img/functionnaming.png)  
The hook also provides a `void *` pointer. This points at the location of any parameters provided to the function. These aren't well documented, and are hard to guess, so feel free to ask about them if you think you need them. A couple useful functions and parameters can be found in [Commonly Hooked Functions](/functions/commonly_hooked_functions/)

For example `Function TAGame.Car_TA.OnHitBall` has a [BallWrapper](/bakkesmod_api/Classes/Wrappers/GameObject/BallWrapper/) parameter. To access it, cast the `void *` pointer to a struct including the parameters

{{< highlight cpp "linenos=table" >}}
struct CarHitBallParams {
  // This is a pointer to the ball's address 
  //  but needs to be constructed into a BallWrapper before use
  uintptr_t ball;
};

gameWrapper->HookEventWithCallerPost<CarWrapper>("Function TAGame.Car_TA.OnHitBall",
  [this](CarWrapper caller, void* params, std::string eventname) {
    // This cast is only safe if you're 100% sure the params are correct
    CarHitBallParams* params = (CarHitBallParams*) params; 
    BallWrapper ballHit = BallWrapper(params->ball);
    // Now you know what ball was hit!
});
{{< /highlight >}}

Find functions with the [function scanner](/functions/function_scanner/)
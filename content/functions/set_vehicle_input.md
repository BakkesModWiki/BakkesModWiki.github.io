---
title: Modify vehicle inputs
weight: 4
author: book
---

Modifying vehicle input in BMSDK is only possible in offline modes or local games.
Since this is a frequent ask, here is a resource page on how to do it.

# The trap: don't use SetInput
Many aspiring programmers find the
[CarWrapper::SetInput](https://bakkesmodwiki.github.io/bakkesmod_api/Classes/Wrappers/GameObject/CarWrapper/#voidhttpsencppreferencecomwcpplanguagetypesvoid_typenbspdivsetwbr-inputwbr-controllerwbr-input-inputdiv)
function and think that their prayers are answered.
Unfortunately, this function does not work particularly well.
It is best to steer clear of this one entirely.

# The good-enough: consider PlayerControllerWrapper::SetVehicleInput
The function [PlayerControllerWrapper::SetVehicleInput](https://wiki.bakkesplugins.com/bakkesmod_api/Classes/Wrappers/PlayerControllerWrapper/)
is simple to use and works well enough for most purposes.
However, some users have noticed that it does have minor inconsistencies,
which can compound in sensitive cases like a TAS tool.
If that is something you care about, you can use the hook (described below) instead.

# The best: SetVehicleInput hook
The hook SetVehicleInput is the best way to control car inputs,
but it also requires some more work than the above function.
This code snippet shows a working example:

{{< highlight cpp "linenos=table" >}}
gameWrapper.HookEventWithCaller(
  "Function TAGame.Car_TA.SetVehicleInput",
  [] (CarWrapper caller, void* params, std::string eventName) {
    ControllerInput* input = static_cast<ControllerInput*>(params);
    input->jump = 1;
  });
{{< /highlight >}}

This hook runs once per car, every physics tick.

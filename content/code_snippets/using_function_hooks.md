---
title: Using Function Hooks
tags: [Code Snippet, HookEvent]
permalink: code_snippets_using_function_hooks.html
folder: Code Snippet
---

Function hooks are a powerful part of BakkesMod. After a function is hooked, any time it is called by Rocket League, your code is called as well. 

There are multiple types of hooks. First are the two simpler ones. `gameWrapper` will be accessible from any point in your code.
```cpp
gameWrapper->HookEvent("Function TAGame.Car_TA.SetVehicleInput",
  [this](std::string eventName) { 
    // Your Code here
    // Call another function or just do your things here        
});

gameWrapper->HookEventPost("Function TAGame.Car_TA.SetVehicleInput",
  [this](std::string eventName) { 
    // Your Code here    
});
```

`HookEvent` runs your code as the function is called  
`HookEventPost` runs your code as the function is returned from  
They return a `std::string` which is the name of the calling function. This is useful to differentiate what your caller is if you have multiple hooks calling the same code.

```cpp
gameWrapper->HookEventWithCaller<CarWrapper>("Function TAGame.Car_TA.SetVehicleInput",
  [this](CarWrapper caller, void* params, std::string eventname) { 
    // Your Code here  
});

gameWrapper->HookEventWithCallerPost<CarWrapper>("Function TAGame.Car_TA.SetVehicleInput",
  [this](CarWrapper caller, void* params, std::string eventname) { 
    // Your Code here    
});
```

The two WithCaller variants do the same thing, but let you know a bit more about what is using the function

They provide a `caller` value which is obtained from the function's name. After `Function TAGame` there will be a class name ending in `_TA`. If the name matches a wrapper name, you can hook it as that wrapper. `Car_TA` becomes `CarWrapper` for example  
They also provide a `void *` pointer. This points at the location of any parameters provided to the function. These aren't well documented, and are hard to guess, so feel free to ask about them if you think you need them

Find functions with the [function scanner](function_scanner.html)

---
Written by ubelhj
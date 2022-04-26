---
title: Best Practices
weight: 100
---

These practices are super important to follow to make sure you don't accidentally crash the game. 

1. Nullchecking  
Any BakkesMod wrapper is a pointer under the hood, and that pointer could be null! 
If you try and use a null wrapper, you'll crash. 
This is super simple, just make sure you nullcheck every time you obtain a new wrapper.

{{< highlight cpp "linenos=table" >}}
ServerWrapper server = gameWrapper->GetCurrentGameState();

// Just check if the server is null
if (!server) { 
    // The server is null! Maybe you want to log here
    // LOG("Null Server!");

    // Otherwise just return out of the function
    return; 
}

// Now you're safe and the server is valid
{{< /highlight >}}

2. Don't store wrappers  
As the game is played, the pointers underneath wrappers might become invalid or point to unexpected memory locations. 
Imagine you stored a ServerWrapper for use later, but by the time you use it you're in a new match.  
Solve this by obtaining wrappers as you use them.  
Wrappers are safe to pass to functions or lambdas for immediate use, but should never be stored as class variables.  
Also don't pass them to any callbacks or timeouts where the wrappers will be used later in time
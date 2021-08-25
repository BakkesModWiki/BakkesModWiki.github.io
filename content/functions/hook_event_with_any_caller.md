---
title: Hook Event With Any Caller
weight: 4
author: Martinn
---

Add this to your plugin header and you can hook with caller for "anything". This will do a blind cast, so make absolutely sure you're hooking the right function or you will crash. There are no type checks here!

```cpp
template <typename T, typename std::enable_if<std::is_base_of<ObjectWrapper, T>::value>::type*>
void GameWrapper::HookEventWithCaller(std::string eventName,
                                      std::function<void(T caller, void* params, std::string eventName)> callback)
{
    auto wrapped_callback = [callback](ActorWrapper caller, void* params, std::string eventName)
    {
        callback(T(caller.memory_address), params, eventName);
    };
    HookEventWithCaller<ActorWrapper>(eventName, wrapped_callback);
}
```

And this for Post
```cpp
template <typename T, typename std::enable_if<std::is_base_of<ObjectWrapper, T>::value>::type*>
void GameWrapper::HookEventWithCallerPost(std::string eventName,
                                      std::function<void(T caller, void* params, std::string eventName)> callback)
{
    auto wrapped_callback = [callback](ActorWrapper caller, void* params, std::string eventName)
    {
        callback(T(caller.memory_address), params, eventName);
    };
    HookEventWithCallerPost<ActorWrapper>(eventName, wrapped_callback);
}
```
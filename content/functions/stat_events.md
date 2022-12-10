---
title: Stat Events
weight: 4
author: ubelhj
---

Stat events are a great way to show a slightly more complicated plugin logic. They are fairly common to use, use multiple wrappers, event hooks, and have some unique caveats. Also I made a plugin with them so I know how they work. Hopefully this helps someone

First add this include to the top of your .h  
`#include "bakkesmod/wrappers/GameObject/Stats/StatEventWrapper.h"`

You need to hook some events to use stat events. This depends on your use case.  
`"Function TAGame.GFxHUD_TA.HandleStatTickerMessage"` is called any time a stat should appear on the top right ticker, even if it's disabled.  
`"Function TAGame.GFxHUD_TA.HandleStatEvent"` is called any time a stat should appear in the center of the screen, even if it's disabled.  
The stat ticker catches stat events from all players, but fails to see first touches, clears, and centers. 
HandleStatEvent catches all stats, but only for the primary player. Depending on your use case you may need to only hook one or both. The ServerWrappers in these hooks are placeholders and we won't use them, as there is no GFxHUD_TA wrapper. Check [using function hooks for more details](/functions/using_function_hooks/)

{{< highlight cpp "linenos=table" >}}
//  We need the params so we hook with caller, but there is no wrapper for the HUD
gameWrapper->HookEventWithCallerPost<ServerWrapper>("Function TAGame.GFxHUD_TA.HandleStatTickerMessage",
    [this](ServerWrapper caller, void* params, std::string eventname) {
        onStatTickerMessage(params);
    });

// hooked whenever the primary player earns a stat
gameWrapper->HookEventWithCallerPost<ServerWrapper>("Function TAGame.GFxHUD_TA.HandleStatEvent",
    [this](ServerWrapper caller, void* params, std::string eventname) {
        onStatEvent(params);
    });
{{< /highlight>}}

Now we have the functions hooked, and we need the parameters. Either define these in your .h or right before using them in your .cpp
{{< highlight cpp "linenos=table" >}}
// The structure of a ticker stat event
struct StatTickerParams {
    // person who got a stat
    uintptr_t Receiver;
    // person who is victim of a stat (only exists for demos afaik)
    uintptr_t Victim;
    // wrapper for the stat event
    uintptr_t StatEvent;
};

// structure of a stat event
struct StatEventParams {
    // always primary player
    uintptr_t PRI;
    // wrapper for the stat event
    uintptr_t StatEvent;
};
{{< /highlight>}}

Now you can use them. For reference see [StatEventWrapper](/bakkesmod_api/Classes/Wrappers/GameObject/Stats/StatEventWrapper/) and [PriWrapper](/bakkesmod_api/Classes/Wrappers/GameObject/PriWrapper/)
{{< highlight cpp "linenos=table" >}}
void ClassName::onStatTickerMessage(void* params) {
    StatTickerParams* pStruct = (StatTickerParams*)params;
    PriWrapper receiver = PriWrapper(pStruct->Receiver);
    PriWrapper victim = PriWrapper(pStruct->Victim);
    StatEventWrapper statEvent = StatEventWrapper(pStruct->StatEvent);
}

void ClassName::onStatEvent(void* params) {
    StatEventParams* pStruct = (StatEventParams*)params;
    PriWrapper playerPRI = PriWrapper(pStruct->PRI);
    StatEventWrapper statEvent = StatEventWrapper(pStruct->StatEvent);
}
{{< /highlight>}}

Now you probably want to do something special with a specific event. Get the event's name with `StatEventWrapper.GetEventName()`. This gets the stat's internal names regardless of game language. This is safest to use for string comparisons. For logging or displaying in the game's current language you can use `StatEventWrapper.GetLabel()`. Here's a list of all the `GetEventName`s. The only confusing one is that a "Demolish" is one demolition and a "Demolition" is an extermination. OwnGoal is a fun ticker event that does exactly what you'd expect, yet is never displayed anywhere in game. KO_ stats belong to the Knockout gamemode
```cpp
"Demolish"
"Demolition"
"Goal"
"Win"
"MVP"
"AerialGoal"
"BackwardsGoal"
"BicycleGoal"
"LongGoal"
"TurtleGoal"
"PoolShot"
"OvertimeGoal"
"HatTrick"
"Assist"
"Playmaker"
"Save"
"EpicSave"
"Savior"
"Shot"
"Center"
"Clear"
"FirstTouch"
"BreakoutDamage"
"BreakoutDamageLarge"
"LowFive"
"HighFive"
"HoopsSwishGoal"
"BicycleHit"
"OwnGoal"
"KO_Winner"
"KO_Knockout"
"KO_DoubleKO"
"KO_TripleKO"
"KO_Death"
"KO_LightHit"
"KO_HeavyHit"
"KO_AerialLightHit"
"KO_AerialHeavyHit"
"KO_HitTaken"
"KO_BlockTaken"
"KO_Grabbed"
"KO_Thrown"
"KO_LightBlock"
"KO_HeavyBlock"
"KO_PlayerGrabbed"
"KO_PlayerThrown"
```

Now I'll just put together a simple example to track if the main player is demoed. As always this is assuming this is using the template
{{< highlight cpp "linenos=table" >}}
// add to onload 
gameWrapper->HookEventWithCallerPost<ServerWrapper>("Function TAGame.GFxHUD_TA.HandleStatTickerMessage",
    [this](ServerWrapper caller, void* params, std::string eventname) {
        onStatTickerMessage(params);
    });
{{< /highlight>}}

{{< highlight cpp "linenos=table" >}}
// defined elsewhere in .cpp
void ClassName::onStatTickerMessage(void* params) {
    struct StatTickerParams {
        uintptr_t Receiver;
        uintptr_t Victim;
        uintptr_t StatEvent;
    };

    StatTickerParams* pStruct = (StatTickerParams*)params;
    PriWrapper receiver = PriWrapper(pStruct->Receiver);
    PriWrapper victim = PriWrapper(pStruct->Victim);
    StatEventWrapper statEvent = StatEventWrapper(pStruct->StatEvent);

    if (statEvent.GetEventName() == "Demolish") {
        LOG("a demolition happened >:(");
        if (!receiver) { LOG("Null reciever PRI"); return; }
        if (!victim) { LOG("Null victim PRI"); return; }

        // Find the primary player's PRI
        PlayerControllerWrapper playerController = gameWrapper->GetPlayerController();
        if (!playerController) { LOG("Null controller"); return; }
        PriWrapper playerPRI = playerController.GetPRI();
        if (!playerPRI) { LOG("Null player PRI"); return; }

        // Compare the primary player to the victim
        if (playerPRI.memory_address != victim.memory_address) {
            LOG("Hah you got demoed get good {}", victim.GetPlayerName().ToString());
            return;
        }
        // Primary player is the victim!
        LOG("I was demoed!!! {} is toxic I'm uninstalling", receiver.GetPlayerName().ToString());
    }
}
{{< /highlight>}}

Hopefully all of this is useful to someone using stat events in the future!

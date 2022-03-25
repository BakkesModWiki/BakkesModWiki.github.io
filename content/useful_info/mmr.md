---
title: MMR
author: ubelhj with code by bakkes
---

These code snippets will help you track a player's MMR. BakkesMod only gets player MMR in matches you're in, so it's best used for the primary player or any players in your party. You can't get any arbitrary player's MMR. 

In yourplugin.h, create a smart pointer for the token. Even if you don't use the token, BakkesMod uses it to ensure that MMR is still being tracked. If you don't declare it using a C++ pointer, you might not get any MMR updates. 
```cpp
std::unique_ptr<MMRNotifierToken> notifierToken;
```

When you want to start tracking MMR, likely in onLoad(), register the notifier. Each time BakkesMod gets any player's MMR, it will do whatever is inside the {}. For best style, it calls a function written elsewhere. 
```cpp
notifierToken = gameWrapper->GetMMRWrapper().RegisterMMRNotifier(
    [this](UniqueIDWrapper id) {
        updateStats(id);
    }
);
```

Here's an example callback function called updateStats. You can get any playlist's MMR for that player now, see [playlist IDs here](/code_snippets/playlist_id/)
```cpp
void PluginName::updateStats(UniqueIDWrapper id)
{
  float mmr = gameWrapper->GetMMRWrapper().GetPlayerMMR(id, playlistID);
  LOG("{} MMR is: {}", id.GetIdString(), mmr);
}
```

To ensure the player is someone you care about, you can compare their ID to the primary or any other player's PRI
```cpp
    PlayerControllerWrapper pc = gameWrapper->GetPlayerController();
    if (!pc) { return; }
    PriWrapper pri = pc.GetPRI();
    if (!pri) { return; }
    UniqueIDWrapper primaryID = pri.GetUniqueIdWrapper();

    if (id == primaryID) {
        // This is Player 1's new MMR!
    }
```
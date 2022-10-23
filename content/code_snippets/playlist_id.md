---
title: Known Playlist IDs
author: CinderBlock
---

All (known) playlist IDs - 2020
``` javascript 
-2: Intermission // Used internally to indicate to the server the client is switching playlists.
0: Casual // Generic id to indicate ALL casual playlists, commonly used in API responses related to player skill/mmr. 
1: Duel
2: Doubles
3: Standard
4: Chaos
6: Private Match
7: Season
8: Exhibition
9: Training
10: Duel (Ranked)
11: Doubles (Ranked)
13: Standard (Ranked)
15: Snow Day
16: Rocket Labs
17: Hoops
18: Rumble
19: Workshop
20: Custom Training Editor
21: Custom Training
22: Tournament Match (Custom)
23: Dropshot
24: Local Match
26: External Match (Ranked)
27: Hoops (Ranked)
28: Rumble (Ranked)
29: Dropshot (Ranked)
30: Snow Day (Ranked)
31: Ghost Hunt
32: Beach Ball
33: Spike Rush
34: Tournament Match (Automatic)
35: Rocket Labs
37: Dropshot Rumble
38: Heatseeker
41: Boomer Ball
43: Heatseeker Doubles
44: Winter Breakaway
46: Gridiron
47: Super Cube
48: Tactical Rumble
49: Spring Loaded
50: Speed Demon
52: Gotham City Rumble
54: Knockout
55: confidential_thirdwheel_test
```

Find the ID of the current playlist with this code. [Click here for GameSettingPlaylistWrapper reference](/bakkesmod_api/Classes/Wrappers/GameEvent/GameSettingPlaylistWrapper/)  
{{< highlight cpp "linenos=table" >}}
ServerWrapper sw = gameWrapper->GetCurrentGameState();
if (!sw) return;
GameSettingPlaylistWrapper playlist = sw.GetPlaylist();
if (!playlist) return;
int playlistID = playlist.GetPlaylistId();
{{< /highlight >}}

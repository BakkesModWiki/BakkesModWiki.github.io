---
title: Known Playlist IDs
tags: [Code Snippet, GameSettingPlaylistWrapper]
permalink: code_snippets_playlist_id.html
folder: Code Snippet
---

All (known) playlist IDs - 2020
```javascript
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
48: TacticalRumble
```

Find the ID of the current playlist with 
```cpp
ServerWrapper sw = gameWrapper->GetOnlineGame();
if (!sw) return;
GameSettingPlaylistWrapper playlist = sw.GetPlaylist();
if (!playlist) return;
int playlistID = playlist.GetPlaylistId();
```

--- 
Credit CinderBlock
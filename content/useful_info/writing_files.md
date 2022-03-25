---
title: Writing Files
author: bakkes
collaborators: ubelhj
---

Use `gameWrapper->GetBakkesModPath()` and use that as the base path to write to (this will be `%appdata%/bakkesmod/bakkesmod`). This works for both Epic and Steam installs 

Make sure you've included fstream
```cpp
#include <fstream>
```

C++17
```cpp
std::ofstream stream( gameWrapper->GetBakkesModPath() / "data" / "abc.txt" );
std::ofstream stream( gameWrapper->GetDataFolder() / "abc.txt" ); //Note the removal of "data"
stream << "def";
// %appdata%/bakkesmod/bakkesmod/data/abc.txt now includes "def"
```
Older C++
```cpp
//Note that windows paths require wide strings, so need to use the L to indicate a wide string
std::ofstream stream( gameWrapper->GetBakkesModPathW() + L"data/abc.txt" );
std::ofstream stream( gameWrapper->GetDataFolderW() + L"abc.txt" );
```

We highly recommend using C++17. This is the default in the template. If not using the template, in Visual Studio go to your project's properties -> C/C++ -> Language -> C++ Language Standard -> `ISO C++17 Standard (/std:c++17)`.
This will allow you to use std::filesystem::path which prevents a lot of pathing errors (like weird characters in folder names and missing/mixed folder separators) and in general is just much easier to work with.
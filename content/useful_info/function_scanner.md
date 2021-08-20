---
title: Function Scanner
tags: [HookEvent]
permalink: function_scanner.html
---

Trying to hook an event but don't know what event to use? There's way more events out there than can be documented, so you can find one yourself with the function scanner

**I highly recommend this video** I made to understand how to use it, but there's also a text guide below  
[https://www.youtube.com/watch?v=gDZ1wWKE8aw](https://www.youtube.com/watch?v=gDZ1wWKE8aw)

## Set the -dev option

On Steam:  
Right click the game and hit properties  
Then add the option  
![properties](https://cdn.discordapp.com/attachments/862084617385672754/862092780369084456/unknown.png)  
![added option](https://media.discordapp.net/attachments/862084617385672754/862092894797955074/unknown.png)

On Epic: (They've moved this before so @ me if it's in a new place)

Hit Settings  
Scroll down to Rocket League, enable Additional Command Line arguments, then add -dev  
![epic settings](https://cdn.discordapp.com/attachments/862084617385672754/862093871483715614/unknown.png)
![epic added option](https://cdn.discordapp.com/attachments/862084617385672754/862093958296895499/unknown.png)

## Reboot and open scanner

Now that you've enabled -dev, reboot rocket league with bakkesmod open  
Once injected, open the console with f6 and type `togglemenu devtools`  
The scanner will now open  
![scanner](https://media.discordapp.net/attachments/448093289137307658/564475718344638464/unknown.png)

## Use the scanner

You can select any words you think are relevant and add them to the whitelist. Any words that aren't relevant can be added to the blacklist. Separate words with `,` but no space `a, b` will match `a` and `[space]b`. When you hit apply, any functions containing words matching the whitelist and not matching the blacklist will appear. These will appear as they happen, so it's a good way to find out when functions fire, and what timing you want. [This video](https://www.youtube.com/watch?v=gDZ1wWKE8aw) does a much better job of explaining this part  

## Hook the Function

When you've found the right function, hook it using `gameWrapper->HookEvent()`. [Details here](code_snippets_using_function_hooks.html)

Every time that function happens, your code will be run. This can be used to know when something important happens (a goal), get pointers to hard-to-find wrappers, or just be used to help you do something on a consistent timer. 

Hooks are the hardest part of Bakkesmod programming, but can have the most interesting results

---
By ubelhj
---
title: Submitting to Bakkesplugins
author: ubelhj
---

You've looked through the docs in desperation, angrily screamed at your computer, crashed a couple times, but it's all worth it! You have made a super cool plugin that you want to share! Nice job! 

Plugins are officially hosted at [https://bakkesplugins.com/](https://bakkesplugins.com/). Go there, sign up for an account, and hit submit plugin

IMAGE OF SUBMIT PLUGIN

You'll come to a new page asking for details. Give your plugin a title, a one-sentence description, and a longer description. You can also add a plugin homepage, which will be included as a link from the plugin page. This is a great place to link to the plugin's source code on github, gitlab, or other version control host!

IMAGE HERE OF FILLED IN FIELDS

IMAGE HERE OF PLUGIN HOMEPAGE LINK

Next upload a .png banner for the plugin. It should be below 50 MB? and wider than it is tall. 16 x 9 is a reasonable ratio.

Finally is the plugin .zip. Make a .zip file including all of your source files and nothing else.
You should include the .sln, the .vcxproj, any .cpp, .h, or .hpp files, and any other data files like .set or images to be included.

IMAGE HERE OF TEMPLATE WITH SLN IN FOLDER

IMAGE HERE OF TEMPLATE WITH SLN OUTSIDE FOLDER

Once you have everything just hit submit! All plugins are manually reviewed and built by volunteer moderators. It may take a couple days to a couple weeks depending on moderator availability. Please be respectful of the time it may take. Please use the [plugin template](https://github.com/Martinii89/BakkesmodPluginTemplate) to make building to .dll smooth and easy for the moderators. 

If your plugin includes any .dll files from outside sources or has weird build steps, please make it clear through a README or by asking in the discord. We will do our best to accomodate special exceptions if the plugin clearly needs it and moderators are capable of getting files from a safe source. For example Nvidia Highlights requires a pre-built .dll from Nvidia themselves, as it was easily accessible we were able to package that in a plugin download. If it's unreasonably difficult to obtain outside source files or build the plugin, it will be denied

Bakkesplugins retains the right to deny or remove any plugin. **A plugin will not be approved if it can be considered malicious, downloads and/or runs potentally dangerous files, breaks the Rocket League Code of Conduct's rules for mods, or is otherwise not allowed by Psyonix**
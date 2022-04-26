---
title: Code Snippet Example
author: your name here
collaborators: any other people involved
weight: -1
---

If you want to add a new snippet to the page, simply make a code snippet in this folder like this  
Give your snippet a unique name and send the pull request!  
Make sure to fill out the fields in the top, but do not include a weight  
Everything is written in Markdown, but you can add html inside of {{}}

Make code blocks using highlights  
```markdown
{{</* highlight cpp "linenos=table" */>}}
// Wow look at this code  
int a = 1;  
int b = 1;  
if (a + b == 11) {  
    LOG("Success");  
} else {  
    LOG("Failure");  
}  
{{</* /highlight */>}}
```
becomes
{{< highlight cpp "linenos=table" >}}
// Wow look at this code  
int a = 1;  
int b = 1;  
if (a + b == 11) {  
    LOG("Success");  
} else {  
    LOG("Failure");  
}  
{{< /highlight >}}

If you don't want the line numbers or highlighting, just use a normal Markdown code block
```markdown
    ```cpp 
    // codeblock
    ```
```

becomes

```cpp
// codeblock
```
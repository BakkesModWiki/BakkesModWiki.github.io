---
title: {{ ConstantName }}
weight: 2
---
\{\{< button href="{{GitHubPath}}" target="_blank" >\}\}\{\{< icon "github" >\}\} View Implementation\{\{< /button >\}\}
{% if Description | length > 0 %}
{{ Description }}

---

{% endif %}
{{ ConstantName }} `= {{ Value }}`
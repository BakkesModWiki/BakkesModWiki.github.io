---
title: {{ ConstantName }}
description: {{ ConstantName }}
weight: 2
showEditOverride: false
---
\{\{< button href="{{GitHubPath}}" >\}\}\{\{< icon "github" >\}\} View Implementation\{\{< /button >\}\}
{% if Description | length > 0 %}
{{ Description }}

{% endif %}

---

{{ ConstantName }} `= {{ Value }}`
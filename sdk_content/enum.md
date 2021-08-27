---
title: {{ EnumName }}
description: {{ EnumName }}
weight: 2
showEditOverride: false
---
\{\{< button href="{{GitHubPath}}" >\}\}\{\{< icon "github" >\}\} View Implementation\{\{< /button >\}\}
{% if Description | length > 0 %}
{{ Description }}

{% endif %}

---

{% for valueName, valueNumber in Values %}
- {{valueName}} `{{valueNumber | safe}}`
{% endfor %}
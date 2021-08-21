---
title: {{ EnumName }}
weight: 2
---
\{\{< button href="{{GitHubPath}}" target="_blank" >\}\}\{\{< icon "github" >\}\} View Implementation\{\{< /button >\}\}
{% if Description | length > 0 %}
{{ Description }}

---

{% endif %}
{% for in valueName, valueNumber in Values %}
- {{valueName}} `= ({{valueNumber}})`
{% endfor %}
---
title: {{ StructName }}
weight: 2
showEditOverride: false
---
\{\{< button href="{{GitHubPath}}" target="_blank" >\}\}\{\{< icon "github" >\}\} View Implementation\{\{< /button >\}\}
{% if Description | length > 0 %}
{{ Description }}

{% endif %}

---
{% for MemberName, Member in Members %}
{% if PathMap[Member.Type] %}
### [{{Member.Type | trim}}]({{PathMap[Member.Type]}})&nbsp;{{MemberName | trim}}{{Member.ArgsString}}
{% else %}
### {%if Member.Type %}{{Member.Type | trim}}&nbsp;{%endif%}{{MemberName | trim}}{{Member.ArgsString}}
{% endif %}
{%if Member.Description | length > 0 %}{{Member.Description}}

---{%else%}---{%endif%}
{% if Member.Kind == "variable" %}
Default value{% if Member.Value | length > 0 %}&nbsp;`{{Member.Value}}`{%else%}: _none_{% endif %}
{% elseif Member.Kind == "enum" %}
{% for valueName, valueNumber in Member.Values %}
- {{valueName}} {% if valueNumber | length > 0 %}`{{valueNumber | safe}}`{% endif %}
{% endfor %}
{% endif %}
<br />
{% endfor %}
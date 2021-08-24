---
title: {{ ClassName }}
weight: 2
---
\{\{< button href="{{GitHubPath}}" target="_blank" >\}\}\{\{< icon "github" >\}\} View Implementation\{\{< /button >\}\}
{% if Description | length > 0 %}
{{ Description }}

{% endif %}

---

{% if BaseClass %}
Base Class: [{{BaseClass}}](/bakkesmod_api/{{PathMap[BaseClass]}})

---

{% endif %}

{% for FieldName, Field in Fields %}
{% if PathMap[Field.Type] %}
### [{{Field.Type | trim}}](/bakkesmod_api/{{PathMap[Field.Type]}})&nbsp;{{FieldName | trim}}()
{% else %}
### {{Field.Type | trim}}&nbsp;{{FieldName | trim}}{{Field.ArgsString}}
{% endif %}
{%if Field.Description | length > 0 %}{{Field.Description}}{%else%}---{%endif%}
{% if Field.Params | length > 0 %}

|Parameter|Type|Description|
--|--|--{% for Parameter in Field.Params %}
{{Parameter.Name}}|{%if PathMap[Parameter.Type]%}[{{Parameter.Type}}](/bakkesmod_api/{{PathMap[Parameter.Type]}}){%else%}{{Parameter.Type}}{%endif%}| {%if Parameter.Description | length > 0 %}{{Parameter.Description}}{%else%}---{%endif%}{% endfor %}
{% endif %}
<br />
{% endfor %}

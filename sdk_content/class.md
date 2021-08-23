---
title: {{ ClassName }}
weight: 2
---
\{\{< button href="{{GitHubPath}}" target="_blank" >\}\}\{\{< icon "github" >\}\} View Implementation\{\{< /button >\}\}
{% if Description | length > 0 %}
{{ Description }}

{% endif %}

---

{% if SuperClass %}
Super Class: [{{SuperClass}}](/bakkesmod_api/{{PathMap[SuperClass]}})

---

{% endif %}

{% for FieldName, Field in Fields %}
{% if PathMap[Field.Type] %}
### [{{Field.Type | trim}}](/bakkesmod_api/{{PathMap[Field.Type]}})&nbsp;{{FieldName | trim}}()
{% else %}
### {{Field.Type | trim}}&nbsp;{{FieldName | trim}}()
{% endif %}
{%if Field.Description | length > 0 %}{{Field.Description}}{%else%}---{%endif%}
{% if Field.Parameters | length > 0 %}

|Parameter|Type|Description|
--|--|--{% for Parameter in Field.Parameters %}
{{Parameter.Name}}|{{Parameter.Keyword}}&nbsp;{%if PathMap[Parameter.Type]%}[{{Parameter.Type}}](/bakkesmod_api/{{PathMap[Parameter.Type]}}){%else%}{{Parameter.Type}}{%endif%}| {%if Parameter.Description | length > 0 %}{{Parameter.Description}}{%else%}---{%endif%}
{% endfor %}
{% endif %}
<br />
{% endfor %}

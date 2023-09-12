---
title: {{ ClassName }}
description: {{ ClassName }}
weight: 2
showEditOverride: false{% if BaseClass %}
baseClass: "<a href=\"{{PathMap[BaseClass]}}\">{{BaseClass}}</a>"{% endif %}
---
\{\{< button href="{{GitHubPath}}" >\}\}\{\{< icon "github" >\}\} View Implementation\{\{< /button >\}\}
{% if Description | length > 0 %}
{{ Description }}

{% endif %}

---

{% for FieldName, Field in Fields %}
{% if PathMap[Field.Type] %}
### [{{Field.Type | trim}}]({{PathMap[Field.Type]}})&nbsp;<div>{{((FieldName | trim) + Field.ArgsString) | breakify | safe}}</div> 
{% else %}
### {%if Field.Type %}{{Field.Type | trim}}&nbsp;{%endif%}<div>{{((FieldName | trim) + Field.ArgsString) | breakify | safe}}</div>
{% endif %}
{%if Field.Description | length > 0 %}{{Field.Description}}

---{%else%}---{%endif%}
{% if Field.Params | length > 0 %}

|Parameter|Type|Description|
--|--|--{% for Parameter in Field.Params %}
{{Parameter.Name}}|{%if PathMap[Parameter.Type]%}[{{Parameter.Type}}]({{PathMap[Parameter.Type]}}){%else%}{{Parameter.Type}}{%endif%}| {%if Parameter.Description | length > 0 %}{{Parameter.Description}}{%else%}---{%endif%}{% endfor %}
{% endif %}
<br />
{% endfor %}

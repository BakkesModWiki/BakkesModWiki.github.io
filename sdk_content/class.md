---
title: {{ ClassName }}
weight: 2
---
{% if Description | length > 0 %}
{{ Description }}

---
{% endif %}

{% for FieldName, Field in Fields %}
### [{{Field.Type | trim}}]()&nbsp;{{FieldName | trim}}()
description logic
{% if Field.Parameters | length > 0 %}
|Parameter|Type|Description|
--|--|--{% for Parameter in Field.Parameters %}
{{Parameter.Name}}|{{Parameter.Keyword}}&nbsp;{{Parameter.Type}}| no desc
{% endfor %}
{% endif %}
<br />
{% endfor %}



start
  = $(!interfaceDocOpeningTag .)* ints:(int:interface $(!interfaceDocOpeningTag .)* { return int })* { return ints }

interface
  = label:interfaceDocOpeningTag _ name:interfaceSignature properties:interfaceDeclaration interfaceEnd { return {label: label || name, name, properties} }

interfaceSignature
  = "export" _ "interface" _ name:word _ tilEOL { return name }

interfaceDocOpeningTag
  = _ "/**" _ "@dynamic-doc" _ label: $(!"**/" .)* _ "**/" { return label }

interfaceEnd
  =  _ "}" _

interfaceDeclaration
  = ((!description !property !interfaceEnd .)* d:description? _ p:property (!description !property !interfaceEnd .)* { return Object.assign(p, {description: d})} )*

description
  = _ "/**" _ desc: (!"**/" descriptionContent)* "**/"
  {
    let description = {};
    desc.forEach(d => {
      description = Object.assign(description, d[1]);
    });
    return description;
  }

descriptionContent
  = examples: examples { return {examples}}
  / block: codeblock { return {content: block.trim()}}
  / d: (!("**/" / "@examples").)+ { return {content: d.map(_d => _d[1]).join('').trim()} }

examples
  = "@examples" _ "[" _ examples: (example _ )* _ "]" _ {
    let a = [];
    examples.forEach(e => a.push(e[0]));
    return a;
  }

example
  = "{" _ properties: exampleProperty* _ "}" {
    let o = {};
    properties.forEach(p => o = Object.assign(o, p));
    return o;
  }

exampleProperty
  = key:$("label" / "value") _ ":" _ value: (codeblock / tilEOL) _ { return {[key]: value} }

EOL
  = "\n"

tilEOL
  = value: $(!EOL.)+ EOL { return value }

codeblock
  = "'''" tilEOL? EOL block: (!"'''" .)* _ "'''" { return block.map(b => b[1]).join('') }

property
  = _ label:word _ optional:"?"? _ ":" _ type: ($genericType / $unionType / $type) {
    return {
      label,
      optional: !!optional,
      type
    };
  }

type "type"
  = array
  / genericType
  / namespacedWord
  / function
  / primitiveType
  / '"' $(!'"' .)+ '"'
  / "'" $(!"'" .)+ "'"
  / word

function "function"
  = "(" _ property _ ("," _ property)* _ ")" _ "=>" _ returnType
  / "()"  _ "=>" _ returnType

returnType
  = type
  / "(" _ type ( _ "|" _ type)+ _ ")"
  / type ( _ "|" _ type)+

namespacedWord "namespaced type"
 = word "." word

array "array"
  = namespacedWord _ "[]"+
  / primitiveType _ "[]"+
  / "(" _ unionType _ ")" _ "[]"+

genericType "generic type"
  = (namespacedWord / word) _ "<" _ type _ ">"

unionType "union type"
  = type _ ("|" _ _t:type)+

primitiveType "primitive type"
  = "string"
  / "number"
  / "boolean"
  / "void"
  / "any"

word
  = $char+

char "character"
  = [a-zA-Z0-9]

s "whitespace+"
  = s:[ \t\n\r]+ {return ''}


_ "whitespace*"
  = s:[ \t\n\r]* {return ''}

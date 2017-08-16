[![GitHub version](https://badge.fury.io/gh/pascalz%2Fdpeges.svg)](https://badge.fury.io/gh/pascalz%2Fdpeges)

# DPE-GES

A pure javascript utility to generate an SVG graph for DPE and GES diagnostics.
No dependency needed, no need jQuery or RaphaelJS

**DPE** : Diagnostic de performance énergétique  (Energy Performance Diagnostic)  
**GES** : Gaz à effet de serre  (Greenhouse Gas Emissions)  

## Installation

Just copy the dpeges.js file in your scripts folder.

You can also use bower:
```
$ bower install dpeges
```

## Basic example

```html
<!DOCTYPE HTML>
<html>
  <head>
    <meta charset="utf-8">
    <title>GES/DPE basic example</title>
  </head>
  <body>
    <div id="dpe"></div>
    <div id="ges"></div>

    <script src="dpeges.js"></script>
    <script type="text/javascript">
      var dpe = new DpeGes();
      dpe.dpe({
        domId: 'dpe',
        value: 210,
      });
      var ges = new DpeGes();
      ges.ges({
        domId: 'ges',
        value: 'C'
      });
    </script>

  </body>
</html>
```

## Options

Option name   | Description                                                     | Required | Default value
------------- | --------------------------------------------------------------- | -------- | -------------
domId         | The id of the element that will contain the generated SVG image | Yes      |  
value         | The DPE or GES actual value, can be an integer or just a letter | No       | 200 
width         | The width of the generated SVG image                            | No       | 250 
height        | The height of the generated SVG image                           | No       | 200 
shadow        | Add shadow to the image                                         | No       | false 
lang          | The language to use (currently supported: 'fr' and 'en')        | No       | 'fr' 

## Demo

http://pascalz.github.io/dpeges/

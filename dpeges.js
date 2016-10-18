var DpeGes = function () {

  "use strict";

    function Diag(options) {

      var self = this;
        
      // Default options is DPE
      var defaultOptions = {
        width: 250,
        height: 200,
        value: 200,
        header: '',
        footer: '',
        valuesRange: [
          { min: null, max: 50, color: '#319834', textColor: '#000000', label: 'A' },
          { min: 51, max: 90, color: '#33cc31', textColor: '#000000', label: 'B' },
          { min: 91, max: 150, color: '#cbfc34', textColor: '#000000', label: 'C' },
          { min: 151, max: 230, color: '#fbfe06', textColor: '#000000', label: 'D' },
          { min: 231, max: 330, color: '#fbcc05', textColor: '#000000', label: 'E' },
          { min: 331, max: 450, color: '#fc9935', textColor: '#000000', label: 'F' },
          { min: 451, max: null, color: '#fc0205', textColor: '#ffffff', label: 'G' }
        ],
        shadow: false,
        lang: 'fr',
        pad: 5,
        shape: 'sharp',
        domId: undefined
      };

      self.width = options.width || defaultOptions.width;
      self.height = options.height || defaultOptions.height;

      self.value = options.value || defaultOptions.value;
      self.shadow = options.shadow || defaultOptions.shadow;

      self.header = options.header || defaultOptions.header;
      self.footer = options.footer || defaultOptions.footer;
         
      //self.options = options;
      self.lang = options.lang || defaultOptions.lang;
      self.pad = options.pad || defaultOptions.pad;
      self.shape = options.shape || defaultOptions.shape;

      self.domId = options.domId || defaultOptions.domId;

      var svgNS = "http://www.w3.org/2000/svg";

      self.container = document.getElementById(self.domId);
        
      // Empty container
      while (self.container.firstChild) {
        self.container.removeChild(self.container.firstChild);
      }

      self.score = -1;

      // Get texts and colors for each value in valuesRange
      self.getValuesDatas = function () {

        self.values = [];
        self.colors = [];
        self.textColors = [];
        self.labels = [];

        var toTxt = " à ";
        switch (self.lang) {
          case "fr":
            toTxt = " à ";
            break;
          case "en":
            toTxt = " to ";
            break;
        }
        options.valuesRange.forEach(function (value) {
          if (value.min === null && value.max !== null) {
            self.values.push("≤ " + value.max);
          } else if (value.min !== null && value.max !== null) {
            self.values.push(value.min + toTxt + value.max);
          } else if (value.min !== null && value.max === null) {
            self.values.push("> " + (value.min - 1));
          }
          self.colors.push(value.color);
          self.textColors.push(value.textColor);
          self.labels.push(value.label);
        });
      };


      self.getScore = function () {
        try {
          options.valuesRange.forEach(function (values) {
            self.score++;
            if (typeof self.value === 'string') {
              if (self.value === values.label) {
                throw {};
              }
            } else if (values.min === null && values.max !== null) {
              if (self.value <= values.max) {
                throw {};
              }
            } else if (values.min !== null && values.max !== null) {
              if (self.value >= values.min && self.value <= values.max) {
                throw {};
              }
            } else if (values.min !== null && values.max === null) {
              if (self.value >= values.min) {
                throw {};
              }
            }
          });
        } catch (e) {
          //
        }
      };      

      self.setAttributes = function (elem, o) {
        if (o.fill) {
          elem.setAttribute("fill", o.fill);
        }
        if (o.fontSize) {
          elem.setAttribute("font-size", o.fontSize);
        }
        if (o.fontFamily) {
          elem.setAttribute("font-family", o.fontFamily);
        }
        if (o.textAnchor) {
          elem.setAttribute("text-anchor", o.textAnchor);
        }
        if (o.fontWeight) {
          elem.setAttribute("font-weight", o.fontWeight);
        }
        if (o.strokeWidth) {
          elem.setAttribute("stroke-width", o.strokeWidth);
        }
        if (o.stroke) {
          elem.setAttribute("stroke", o.stroke);
        }
        if (o.opacity) {
          elem.setAttribute("opacity", o.opacity);
        }
      };

      self.getPath = function (path, options) {
        var elem = document.createElementNS(svgNS, "path");
        self.setAttributes(elem, options);

        elem.setAttribute("d", path);

        return elem;
      };

      self.getPolygon = function (points, color) {
        var elem = document.createElementNS(svgNS, "polygon");
        elem.setAttribute("style", "fill-opacity: 1;fill: " + color + ";stroke: #000000;" + (self.shadow ? "filter:url(#fs)" : ""));
        elem.setAttribute("points", points);

        return elem;
      };

      self.getText = function (text) {
        var elem = document.createElementNS(svgNS, "text");
        elem.setAttribute("x", text.x);
        elem.setAttribute("y", text.y);
        elem.textContent = text.text;
        self.setAttributes(elem, text.options);
        return elem;
      };

      self.createSVG = function () {
        self.getScore();
        self.getValuesDatas();

        var svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("style", "overflow: hidden; position: relative;");
        svg.setAttribute("width", self.width);
        svg.setAttribute("height", self.height);
        svg.setAttribute("version", "1.1");
        svg.setAttribute("viewBox", "0 0 " + self.width + " " + self.height);
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

        var desc = document.createElementNS(svgNS, "desc");
        desc.textContent = 'Created by Pascalz (http://pascalz.github.io/dpeges/)';
        svg.appendChild(desc);
        var defs = document.createElementNS(svgNS, "defs");
        var filter = document.createElementNS(svgNS, "filter");
        filter.setAttribute("id", "fs");
        //filter.setAttribute("height", "120%");

        var feGaussianBlur = document.createElementNS(svgNS, "feGaussianBlur");
        feGaussianBlur.setAttribute("in", "SourceAlpha");
        feGaussianBlur.setAttribute("stdDeviation", "1");
        filter.appendChild(feGaussianBlur);

        var feOffset = document.createElementNS(svgNS, "feOffset");
        feOffset.setAttribute("result", "offsetblur");
        feOffset.setAttribute("dx", "1");
        feOffset.setAttribute("dy", "0.5");
        filter.appendChild(feOffset);

        var feMerge = document.createElementNS(svgNS, "feMerge");
        var feMergeNode1 = document.createElementNS(svgNS, "feMergeNode");
        feMerge.appendChild(feMergeNode1);
        var feMergeNode2 = document.createElementNS(svgNS, "feMergeNode");
        feMergeNode2.setAttribute("in", "SourceGraphic");
        feMerge.appendChild(feMergeNode2);
        filter.appendChild(feMerge);
        defs.appendChild(filter);
        svg.appendChild(defs);
        
        var countElem = self.values.length;

        var blocHeight = (self.height - ((countElem + 1) * self.pad)) / countElem;
        var blocWidth = (self.width - (2 * self.pad)) - 45;

        var blocPart = ((blocWidth / 3) * 2) / (countElem - 1);
        blocWidth = (blocWidth / 3);

        for (var i = 0; i < countElem; i++) {
          var x, y, x1, y1, x2, y2, poly;
          x = self.pad;
          y = ((i * self.pad) + self.pad) + (i * blocHeight);

          switch (self.shape) {
            case "sharp":
              x1 = ((blocWidth + (blocPart * i)) - (blocHeight / 2));

              x2 = x + (blocWidth + blocPart * i);
              y1 = y + (blocHeight / 2);

              y2 = y + blocHeight;
              poly = x + "," + y + " " +
              x1 + "," + y + " " +
              x2 + "," + y1 + " " +
              x1 + "," + y2 + " " +
              x + "," + y2 + " " +
              x + "," + y;
              break;
            case "flat":
              x1 = x + (blocWidth + blocPart * i);

              y1 = y + blocHeight;
              poly = x + "," + y + " " +
              x1 + "," + y + " " +
              x1 + "," + y1 + " " +
              x + "," + y1 + " " +
              x + "," + y;
              break;
          }

          if (self.score === i) {
            var sx1 = x - 2;
            var sx2 = (self.width - (2 * self.pad)) + 2;
            var sy1 = y - 2;
            var sy2 = y + blocHeight + 3;

            var scorePath = "M " + sx1 + " " + sy1 +
              "L" + sx2 + " " + sy1 +
              "L" + sx2 + " " + sy2 +
              "L" + sx1 + " " + sy2 + " Z";
            svg.appendChild(self.getPath(scorePath,
              {
                'stroke': '#5b5b5b',
                'strokeWidth': 1,
                'fill': "#ffffff",
                'fillOpacity': 0.8
              }));

            svg.appendChild(self.getText(
              {
                x: sx2 - 5,
                y: y + blocHeight * 0.9,
                text: self.value,
                options: {
                  'fill': '#000000',
                  'fontSize': blocHeight * 0.9,
                  'fontWeight': 'bold',
                  'fontFamily': "'Arial Narrow', sans-serif",
                  'textAnchor': 'end'
                }
              }
              ));
          }

          svg.appendChild(self.getPolygon(poly, self.colors[i]));

          var whiteIdx = (self.shape === "sharp") ? 5 : 3;

          svg.appendChild(self.getText(
            {
              x: x1 - self.pad,
              y: y + (blocHeight * 0.8),
              text: self.labels[i],
              options: {
                fill: i > whiteIdx ? '#ffffff' : '#000000',
                fontSize: blocHeight * 0.8,
                fontWeight: 'bold',
                fontFamily: "'Arial Narrow', sans-serif",
                textAnchor: 'end'
              }
            }));
          svg.appendChild(self.getText(
            {
              x: x + self.pad,
              y: y + blocHeight - ((blocHeight * 0.6) / 2),
              text: self.values[i],
              options: {
                fill: i > whiteIdx ? '#ffffff' : '#000000',
                fontSize: blocHeight * 0.6,
                fontFamily: "'Arial Narrow', sans-serif",
                textAnchor: 'start'
              }
            }));
        }

        self.container.appendChild(svg);
      };

      self.createSVG();
    };

    function DPE(options) {

      options.valuesRange = [
        { min: null, max: 50, color: '#319834', textColor: '#000000', label: 'A' },
        { min: 51, max: 90, color: '#33cc31', textColor: '#000000', label: 'B' },
        { min: 91, max: 150, color: '#cbfc34', textColor: '#000000', label: 'C' },
        { min: 151, max: 230, color: '#fbfe06', textColor: '#000000', label: 'D' },
        { min: 231, max: 330, color: '#fbcc05', textColor: '#000000', label: 'E' },
        { min: 331, max: 450, color: '#fc9935', textColor: '#000000', label: 'F' },
        { min: 451, max: null, color: '#fc0205', textColor: '#ffffff', label: 'G' }
      ];

      options.shape = "sharp";

      return new Diag(options);
    };

    function GES(options) {

      options.valuesRange = [
        { min: null, max: 5, color: '#f2eff4', textColor: '#000000', label: 'A' },
        { min: 6, max: 10, color: '#dfc1f7', textColor: '#000000', label: 'B' },
        { min: 11, max: 20, color: '#d6aaf4', textColor: '#000000', label: 'C' },
        { min: 21, max: 35, color: '#cc93f4', textColor: '#000000', label: 'D' },
        { min: 36, max: 55, color: '#bb72f3', textColor: '#ffffff', label: 'E' },
        { min: 56, max: 80, color: '#a94cee', textColor: '#ffffff', label: 'F' },
        { min: 81, max: null, color: '#8b1ae1', textColor: '#ffffff', label: 'G' }
      ];

      options.shape = "flat";

      return new Diag(options);
    };
    
    return {
      dpe: DPE,
      ges: GES
    };

};

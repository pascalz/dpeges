function Diag(options) {

    "use strict";

    var self = this;
    self.width = options.width;
    self.height = options.height;

    self.value = options.value;
    self.shadow = options.shadow || false;

    /* TODO : manage header & footer
     self.header = options.header; //"Faible émission de GES"
     self.footer = options.footer; //"Forte émission de GES"
     */

    self.options = options;
    self.lang = options.lang || "fr";
    self.pad = options.pad || 5;
    self.svgNS = "http://www.w3.org/2000/svg";

    self.container = document.getElementById(self.options.domID);
    while (self.container.firstChild) {
        self.container.removeChild(self.container.firstChild);
    }

    self.score = -1;

    self.color = self.options.color;

    self.getValuesText = function () {
        self.values = [];
        var toTxt = " à ";
        switch (self.lang) {
            case "fr":
                toTxt = " à ";
                break;
            case "en":
                toTxt = " to ";
                break;
        }
        self.options.valuesRange.forEach(function (values) {
            if (values.min === null && values.max !== null) {
                self.values.push("≤ " + values.max);
            } else if (values.min !== null && values.max !== null) {
                self.values.push(values.min + toTxt + values.max);
            } else if (values.min !== null && values.max === null) {
                self.values.push("> " + (values.min - 1));
            }
        });
    };

    self.getScore = function () {
        try {
            self.options.valuesRange.forEach(function (values) {
                self.score++;
                if (values.min === null && values.max !== null) {
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

    self.letter = ["A", "B", "C", "D", "E", "F", "G"];

    self.setAttributes = function (elem, options) {
        if (options.fill) {
            elem.setAttribute("fill", options.fill);
        }
        if (options.fontSize) {
            elem.setAttribute("font-size", options.fontSize);
        }
        if (options.fontFamily) {
            elem.setAttribute("font-family", options.fontFamily);
        }
        if (options.textAnchor) {
            elem.setAttribute("text-anchor", options.textAnchor);
        }
        if (options.fontWeight) {
            elem.setAttribute("font-weight", options.fontWeight);
        }
        if (options.strokeWidth) {
            elem.setAttribute("stroke-width", options.strokeWidth);
        }
        if (options.stroke) {
            elem.setAttribute("stroke", options.stroke);
        }
        if (options.opacity) {
            elem.setAttribute("opacity", options.opacity);
        }
    };

    self.getPath = function (path, options) {
        var elem = document.createElementNS(self.svgNS, "path");
        self.setAttributes(elem, options);

        elem.setAttribute("d", path);

        return elem;
    };

    self.getPolygon = function (points, color) {
        var elem = document.createElementNS(self.svgNS, "polygon");
        elem.setAttribute("style", "fill-opacity: 1;fill: " + color + ";stroke: #000000;" + (self.shadow ? "filter:url(#fs)" : ""));
        elem.setAttribute("points", points);

        return elem;
    };

    self.getText = function (text) {
        var elem = document.createElementNS(self.svgNS, "text");
        elem.setAttribute("x", text.x);
        elem.setAttribute("y", text.y);
        elem.textContent = text.text;
        self.setAttributes(elem, text.options);
        return elem;
    };

    self.createSVG = function () {
        self.getScore();
        self.getValuesText();

        var svg = document.createElementNS(self.svgNS, "svg");
        svg.setAttribute("style", "overflow: hidden; position: relative;");
        svg.setAttribute("width", self.width);
        svg.setAttribute("height", self.height);
        svg.setAttribute("version", "1.1");
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

        var desc = document.createElementNS(self.svgNS, "desc");
        desc.textContent = 'Created by Pascalz (http://www.pascalz.com/dev/dpeges)';
        svg.appendChild(desc);
        var defs = document.createElementNS(self.svgNS, "defs");
        var filter = document.createElementNS(self.svgNS, "filter");
        filter.setAttribute("id", "fs");
        filter.setAttribute("height", "120%");

        var feGaussianBlur = document.createElementNS(self.svgNS, "feGaussianBlur");
        feGaussianBlur.setAttribute("in", "SourceAlpha");
        feGaussianBlur.setAttribute("stdDeviation", "3");
        filter.appendChild(feGaussianBlur);

        var feOffset = document.createElementNS(self.svgNS, "feOffset");
        feOffset.setAttribute("result", "offsetblur");
        feOffset.setAttribute("dx", "2");
        feOffset.setAttribute("dy", "2");
        filter.appendChild(feOffset);

        var feMerge = document.createElementNS(self.svgNS, "feMerge");
        var feMergeNode1 = document.createElementNS(self.svgNS, "feMergeNode");
        feMerge.appendChild(feMergeNode1);
        var feMergeNode2 = document.createElementNS(self.svgNS, "feMergeNode");
        feMergeNode2.setAttribute("in", "SourceGraphic");
        feMerge.appendChild(feMergeNode2);
        filter.appendChild(feMerge);
        defs.appendChild(filter);
        svg.appendChild(defs);

        var blocHeight = (self.height - (8 * self.pad)) / 7;
        var blocWidth = (self.width - (2 * self.pad)) - 45;

        var blocPart = ((blocWidth / 3) * 2) / 6;
        blocWidth = (blocWidth / 3);

        for (var i = 0; i < 7; i++) {
            var x, y, x1, y1, x2, y2, poly;
            x = self.pad;
            y = ((i * self.pad) + self.pad) + (i * blocHeight);

            switch (self.options.shape) {
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

            svg.appendChild(self.getPolygon(poly, self.color[i]));

            var whiteIdx = (self.options.shape === "sharp") ? 5 : 3;

            svg.appendChild(self.getText(
                {
                    x: x1 - self.pad,
                    y: y + (blocHeight * 0.8),
                    text: self.letter[i],
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

    "use strict";

    options.valuesRange = [
        { min: null, max: 50 },
        { min: 51, max: 90 },
        { min: 91, max: 150 },
        { min: 151, max: 230 },
        { min: 231, max: 330 },
        { min: 331, max: 450 },
        { min: 451, max: null }
    ];

    options.color = [
        "#319834",
        "#33cc31",
        "#cbfc34",
        "#fbfe06",
        "#fbcc05",
        "#fc9935",
        "#fc0205"
    ];
    options.shape = "sharp";

    return new Diag(options);
};

function GES(options) {

    "use strict";

    options.valuesRange = [
        { min: null, max: 5 },
        { min: 6, max: 10 },
        { min: 11, max: 20 },
        { min: 21, max: 35 },
        { min: 36, max: 55 },
        { min: 56, max: 80 },
        { min: 81, max: null }
    ];

    options.color = [
        "#f2eff4",
        "#dfc1f7",
        "#d6aaf4",
        "#cc93f4",
        "#bb72f3",
        "#a94cee",
        "#8b1ae1"
    ];
    options.shape = "flat";

    return new Diag(options);
};
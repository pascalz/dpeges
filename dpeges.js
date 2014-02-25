function DPE(options) {

    "use strict";

    var self = this;
    self.width = options.width;
    self.height = options.height;

    self.value = options.value;
    self.shadow = options.shadow || false;

    /* TODO : manage header & footer
     self.header = options.header;  // "Logement économe"
     self.footer = options.footer;  // "Logement énergivore"
     */
    self.options = options;

    self.container = document.getElementById(self.options.domID);
    while (self.container.firstChild) {
        self.container.removeChild(self.container.firstChild);
    }

    self.score = -1;

    self.init = function () {
        self.pad = 5;

        self.svgNS = "http://www.w3.org/2000/svg";

        if (self.value < 51) {
            self.score = 0;
        }

        if (self.value > 50 && self.value < 91) {
            self.score = 1;
        }

        if (self.value > 90 && self.value < 151) {
            self.score = 2;
        }

        if (self.value > 150 && self.value < 231) {
            self.score = 3;
        }

        if (self.value > 230 && self.value < 331) {
            self.score = 4;
        }

        if (self.value > 330 && self.value < 451) {
            self.score = 5;
        }

        if (self.value > 450) {
            self.score = 6;
        }
    };

    self.color = [
        "#319834",
        "#33cc31",
        "#cbfc34",
        "#fbfe06",
        "#fbcc05",
        "#fc9935",
        "#fc0205"
    ];

    self.values = [
        "≤ 50",
        "51 à 90",
        "91 à 150",
        "151 à 230",
        "231 à 330",
        "331 à 450",
        "> 450"
    ];

    self.letter = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G"
    ];


    self.getPath = function (path, options) {
        var elem = document.createElementNS(self.svgNS, "path");

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

        elem.setAttribute("d", path);

        return elem;
    };

    self.getPolygon = function (points, color) {
        var elem = document.createElementNS(self.svgNS, "polygon");
        elem.setAttribute("style", "fill-opacity: 1;fill: " + color + ";stroke: #000000;" + (self.shadow ? "filter:url(#fs)" : ""));
        //elem.setAttribute("filter", "url(#fs)");
        elem.setAttribute("points", points);

        return elem;
    };

    self.getText = function (texts) {
        var elem = document.createElementNS(self.svgNS, "text");
        elem.setAttribute("x", 0);
        elem.setAttribute("y", 4);
        texts.forEach(function (text) {
            var tspan = document.createElementNS(self.svgNS, "tspan");
            tspan.setAttribute("x", text.x);
            tspan.setAttribute("y", text.y);
            tspan.textContent = text.text;

            if (text.options.fill) {
                tspan.setAttribute("fill", text.options.fill);
            }
            if (text.options.fontSize) {
                tspan.setAttribute("font-size", text.options.fontSize);
            }
            if (text.options.fontFamily) {
                tspan.setAttribute("font-family", text.options.fontFamily);
            }
            if (text.options.textAnchor) {
                tspan.setAttribute("text-anchor", text.options.textAnchor);
            }
            if (text.options.fontWeight) {
                tspan.setAttribute("font-weight", text.options.fontWeight);
            }

            elem.appendChild(tspan);
        });
        return elem;
    };

    self.createSVG = function () {
        self.init();

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
            var x = self.pad;
            var y = ((i * self.pad) + self.pad) + (i * blocHeight);

            var x1 = ((blocWidth + (blocPart * i)) - (blocHeight / 2));

            var x2 = x + (blocWidth + blocPart * i);
            var y1 = y + (blocHeight / 2);

            var y2 = y + blocHeight;

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

                svg.appendChild(self.getText([
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
                ]));
            }

            var poly = x + "," + y + " " +
                x1 + "," + y + " " +
                x2 + "," + y1 + " " +
                x1 + "," + y2 + " " +
                x + "," + y2 + " " +
                x + "," + y;

            svg.appendChild(self.getPolygon(poly, self.color[i]));

            svg.appendChild(self.getText([
                {
                    x: x1 - (blocHeight / 4),
                    y: y + (blocHeight * 0.8),
                    text: self.letter[i],
                    options: {
                        'fill': i > 5 ? '#ffffff' : '#000000',
                        'fontSize': blocHeight * 0.8,
                        'fontWeight': 'bold',
                        'fontFamily': "'Arial Narrow', sans-serif"
                    }
                },
                {
                    x: x + 5,
                    y: y + (blocHeight * 0.7),
                    text: self.values[i],
                    options: {
                        'fill': i > 5 ? '#ffffff' : '#000000',
                        'fontSize': blocHeight * 0.7,
                        'fontFamily': "'Arial Narrow', sans-serif",
                        'textAnchor': 'start'
                    }
                }
            ]));
        }

        self.container.appendChild(svg);
    };

    self.createSVG();
}

function GES(options) {

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

    self.container = document.getElementById(self.options.domID);
    while (self.container.firstChild) {
        self.container.removeChild(self.container.firstChild);
    }

    self.score = -1;

    self.init = function () {
        self.pad = 5;

        self.svgNS = "http://www.w3.org/2000/svg";

        if (self.value < 6) {
            self.score = 0;
        }

        if (self.value > 5 && self.value < 11) {
            self.score = 1;
        }

        if (self.value > 10 && self.value < 21) {
            self.score = 2;
        }

        if (self.value > 20 && self.value < 36) {
            self.score = 3;
        }

        if (self.value > 35 && self.value < 56) {
            self.score = 4;
        }

        if (self.value > 55 && self.value < 81) {
            self.score = 5;
        }

        if (self.value > 80) {
            self.score = 6;
        }
    };

    self.color = [
        "#f2eff4",
        "#dfc1f7",
        "#d6aaf4",
        "#cc93f4",
        "#bb72f3",
        "#a94cee",
        "#8b1ae1"
    ];

    self.values = [
        "≤ 5",
        "6 à 10",
        "11 à 20",
        "21 à 35",
        "36 à 55",
        "56 à 80",
        "> 80"
    ];

    self.letter = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G"
    ];


    self.getPath = function (path, options) {
        var elem = document.createElementNS(self.svgNS, "path");

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

        elem.setAttribute("d", path);

        return elem;
    };

    self.getPolygon = function (points, color) {
        var elem = document.createElementNS(self.svgNS, "polygon");
        elem.setAttribute("style", "fill-opacity: 1;fill: " + color + ";stroke: #000000;" + (self.shadow ? "filter:url(#fs)" : ""));
        //elem.setAttribute("filter", "url(#fs)");
        elem.setAttribute("points", points);

        return elem;
    };

    self.getText = function (texts) {
        var elem = document.createElementNS(self.svgNS, "text");
        elem.setAttribute("x", 0);
        elem.setAttribute("y", 4);
        texts.forEach(function (text) {
            var tspan = document.createElementNS(self.svgNS, "tspan");
            tspan.setAttribute("x", text.x);
            tspan.setAttribute("y", text.y);
            tspan.textContent = text.text;

            if (text.options.fill) {
                tspan.setAttribute("fill", text.options.fill);
            }
            if (text.options.fontSize) {
                tspan.setAttribute("font-size", text.options.fontSize);
            }
            if (text.options.fontFamily) {
                tspan.setAttribute("font-family", text.options.fontFamily);
            }
            if (text.options.textAnchor) {
                tspan.setAttribute("text-anchor", text.options.textAnchor);
            }
            if (text.options.fontWeight) {
                tspan.setAttribute("font-weight", text.options.fontWeight);
            }

            elem.appendChild(tspan);
        });
        return elem;
    };

    self.createSVG = function () {
        self.init();

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
            var x = self.pad;
            var y = ((i * self.pad) + self.pad) + (i * blocHeight);

            var x1 = x + (blocWidth + blocPart * i);
            var y1 = y + blocHeight;

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

                svg.appendChild(self.getText([
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
                ]));
            }

            var poly = x + "," + y + " " +
                x1 + "," + y + " " +
                x1 + "," + y1 + " " +
                x + "," + y1 + " " +
                x + "," + y;

            svg.appendChild(self.getPolygon(poly, self.color[i]));

            svg.appendChild(self.getText([
                {
                    x: x1 - blocHeight / 2,
                    y: y + (blocHeight * 0.8),
                    text: self.letter[i],
                    options: {
                        'fill': i > 3 ? '#ffffff' : '#000000',
                        'fontSize': blocHeight * 0.8,
                        'fontWeight': 'bold',
                        'fontFamily': "'Arial Narrow', sans-serif"
                    }
                },
                {
                    x: x + 5,
                    y: y + (blocHeight * 0.7),
                    text: self.values[i],
                    options: {
                        'fill': i > 3 ? '#ffffff' : '#000000',
                        'fontSize': blocHeight * 0.7,
                        'fontFamily': "'Arial Narrow', sans-serif",
                        'textAnchor': 'start'
                    }
                }
            ]));
        }

        self.container.appendChild(svg);
    };

    self.createSVG();
}
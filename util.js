function loadImg(path) { // Words cannot express how utterly fucking stupid this is
    return p5.prototype.loadImage.call({ _decrementPreload: () => { } }, path);
}

function loadFnt(path) { // p5 serves as a good reminder as to why libraries are deisnged the way they are
    return p5.prototype.loadFont.call({ _decrementPreload: () => { } }, path);
}

function sqauredDist(ptA, ptB) {
    return (ptB.x - ptA.x) ** 2 + (ptB.y - ptA.y) ** 2;
}

function distance(ptA, ptB) {
    return Math.sqrt(sqauredDist(ptA, ptB));
}

function RPMToMSDelay(rpm) {
    return 60000 / rpm;
}

function parseLevelData(data) {
    return {
        obstacles: data.obstacles.map(o => {
            let body;

            try { o.options.angle *= Math.PI / 180; } catch { }

            switch (o.type) {
                case "rectangle":
                    body = Matter.Bodies.rectangle(o.x, o.y, o.width, o.height, o.options);
                    break;
                case "circle":
                    body = Matter.Bodies.circle(o.x, o.y, o.radius, o.options);
                    break;
                case "polygon":
                    body = Matter.Bodies.polygon(o.x, o.y, o.sides, o.radius, o.options);
                    break;
                case "fromVertices":
                    body = Matter.Bodies.fromVertices(o.x, o.y, Matter.Vertices.create(o.vertexSets, Matter.Bodies.rectangle(o.x, o.y, 1, 1, {})), o.options);
                    break;
                case "trapezoid":
                    body = Matter.Bodies.trapezoid(o.x, o.y, o.width, o.height, o.slope, o.options);
                    break;
                default:
                    throw new SyntaxError(`Unknown type '${o.type}'`);
            }
            const d = o.details;

            return new obstacle(
                body,
                o.options.angle,
                loadImg(d.image),
                { width: d.imageWidth, height: d.imageHeight },
                d.tint,
                d.layer,
                { x: Matter.Vertices.centre(body.vertices).x - o.x, y: Matter.Vertices.centre(body.vertices).y - o.y, angle: d.angleOffset * Math.PI / 180 },
                d.imageMode,
                d.health,
                d.roof && {
                    image: loadImg(d.roof.image),
                    width: d.roof.width,
                    height: d.roof.height,
                    opacity: d.roof.opacity ?? 255,
                    roofHitbox: Matter.Bodies.fromVertices(Matter.Vertices.centre(d.roof.roofHitbox).x + o.x, Matter.Vertices.centre(d.roof.roofHitbox).y + o.y, [d.roof.roofHitbox], { isSensor: true, isStatic: false })
                }
            );
        }),
        players: data.players.map(p => new playerLike(
            Matter.Bodies.circle(p.x, p.y, p.size, p.options),
            p.angle * Math.PI / 180,
            {
                primary: p.colour1,
                secondary: p.colour2,
                highlight: p.highlightcolour
            },
            p.options,
            p.loadout,
            p.health,
            1700,
            false,
            p.class
        )),
        particles: [],
        paths: data.ground.map(p => new path(p.vertices, p.colour))
    };
}

function isVowel(letter) {
    const vowels = "aeiou";
    for(let i = 0; i < vowels.length; i++) {
        if(letter.toLowerCase() == vowels[i]) {
            return 'n';
        }
    }
    return '';
}

function shouldUseInfinity(string) { // i hate my life
    if(string == Infinity) {
        return "∞";
    } else { return string; }
}

function createDiv(id = "", className = "") {
    const div = document.createElement("div");

    id && (div.id = id);
    className && (div.className = className);
    return div;
}

function $(ele) { return document.getElementById(ele); }

function getElement(ele) { return document.getElementById(ele)};

function average(...args) {
    for (var i = 0, sum = 0; i < args.length; sum += +args[i++]);

    return sum / args.length;
}

function stdDev(...arr) {
    const avg = average(...arr),
        a = arr.map(e => Math.abs(+e - +avg));

    return average(...a);
}

function makeElement(key, properties, children, listeners) {
    const ele = document.createElement(key);
    if (properties) {
        for (const [key, value] of Object.entries(properties)) {
            ele[key] = value;
        }
    }
    if (children) {
        ele.append(...(Array.isArray(children) ? children : [children]));
    }
    if (listeners) {
        for (const [ev, li] of Object.entries(listeners)) {
            if (Array.isArray(li)) {
                li.forEach(l => {
                    if (typeof l == "function") {
                        ele.addEventListener(ev, l);
                    }
                    else {
                        ele.addEventListener(ev, l.callback, l.options);
                    }
                });
            }
            else {
                ele.addEventListener(ev, li);
            }
        }
    }
    return ele;
}
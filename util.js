/**
 * @param {string} path
 * @return {import("p5").Image}
 */
function loadImg(path) { // Words cannot express how utterly fucking stupid this is
    return p5.prototype.loadImage.call({ _decrementPreload: () => { } }, path);
}

/**
 * @param {string} path
 * @return {import("p5").Font}
 */
function loadFnt(path) { // p5 serves as a good reminder as to why libraries are deisnged the way they are
    return p5.prototype.loadFont.call({ _decrementPreload: () => { } }, path);
}

/**
 * @param {{ x: number, y: number }} ptA
 * @param {{ x: number, y: number }} ptB
 * @returns {number}
 */
function sqauredDist(ptA, ptB) {
    return (ptB.x - ptA.x) ** 2 + (ptB.y - ptA.y) ** 2;
}

/**
 * @param {{ x: number, y: number }} ptA
 * @param {{ x: number, y: number }} ptB
 * @returns {number}
 */
function distance(ptA, ptB) {
    return Math.sqrt(sqauredDist(ptA, ptB));
}

/**
 * @param {number} rpm 
 * @returns {number}
 */
function RPMToMSDelay(rpm) {
    return 60000 / rpm;
}

/**
 * @param {{
 * obstacles: (({
 *     type: "rectangle";
 *     width: number;
 *     height: number;
 * } | {
 *     type: "circle";
 *     radius: number;
 * } | {
 *     type: "polygon";
 *     sides: number;
 *     radius: number;
 * } | {
 *     type: "fromVertices";
 *     vertexSets: { x: number; y: number; }[];
 * } | {
 *     type: "trapezoid";
 *     slope: number;
 *     width: number;
 *     height: number;
 * }) & {
 *     x: number;
 *     y: number;
 *     options: {
 *         isStatic: boolean;
 *         friction: number;
 *         restitution: number;
 *         density: number;
 *         angle: number;
 *         chamfer?: undefined;
 *     };
 *     details: {
 *         image: string;
 *         imageWidth: number;
 *         imageHeight: number;
 *         tint: `#${string}`;
 *         layer: number;
 *         xOffset: number;
 *         yOffset: number;
 *         angleOffset: number;
 *         imageMode: import("p5").IMAGE_MODE;
 *         roof?: { image: string;
 *         width: number;
 *         height: number;
 *         opacity: number;
 *         };
 *         special?: number;
 *     };
 * })[];
 * players: {
 *     x: number;
 *     y: number;
 *     angle: number;
 *     size: number;
 *     colour1: `#${string}`;
 *     colour2: `#${string}`;
 *     options: { friction: number;
 *         restitution: number;
 *         inertia?: number;
 *         density: number;
 *         };
 *     highlightcolour: `#${string}`;
 *     loadout: {
 *       guns: string[],
 *       activeIndex: number;
 *     };
 *     health: number;
 *     view: number;
 *     }[];
 *     }} data
 * @returns {{ obstacles: obstacle[], players: playerLike[] }}
 */
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
                    console.log(Matter.Vertices.centre(body.vertices).x - o.x);
                    console.log(Matter.Vertices.centre(body.vertices).y - o.y);
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
                    roofHitbox: Matter.Bodies.fromVertices(o.x, o.y, [d.roof.roofHitbox], { isSensor: true, isStatic: false })
                }
            );
        }),
        players: data.players.map(p => new playerLike(Matter.Bodies.circle(p.x, p.y, p.size, p.options), p.angle * Math.PI / 180, { primary: p.colour1, secondary: p.colour2, highlight: p.highlightcolour }, p.options, p.loadout, p.health, 1700, false)),
        particles: [],
        paths: data.ground.map(p => new path(p.vertices, p.colour))
    };
}

function createDiv(id = "", className = "") {
    const div = document.createElement("div");

    id && (div.id = id);
    className && (div.className = className);
    return div;
}

function $(ele) { return document.getElementById(ele); }

function average(...args) {
    for (var i = 0, sum = 0; i < args.length; sum += +args[i++]);

    return sum / args.length;
}

function stdDev(...arr) {
    const avg = average(...arr),
        a = arr.map(e => Math.abs(+e - +avg));

    return average(...a);
}
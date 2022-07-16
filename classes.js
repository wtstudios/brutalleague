class level {
    /**
     * @readonly
     * @type {string}
     */
    name;
    /**
     * @readonly
     * @type {string}
     */
    description;
    /**
     * @type {{ width: number, height: number, colour: string, gridColour: string }}
     */
    world;
    /**
     * @type {() => void}
     */
    initializer;
    /**
     * @param {string} name
     * @param {string} description
     * @param {{ width: number, height: number, colour: string, gridColour: string }} world
     * @param {() => void} initializer
     */
    constructor (name, description, world, initializer) {
        this.name = name;
        this.description = description;
        this.world = world;
        this.initializer = initializer;
    }
}

class obstacle {
    /**
     * @type {Matter.Body}
     */
    #body;
    get body() { return this.#body; }
    /**
     * @type {import("p5").Image}
     */
    image;
    /**
     * @type {number}
     */
    imageWidth;
    /**
     * @type {number}
     */
    imageHeight;
    /**
     * @type {string}
     */
    tint;
    /**
     * @type {number}
     */
    angle;
    /**
     * @type {number}
     */
    layer;
    /**
     * @type {{ x: number, y: number, angle: number }}
     */
    offset = { x: 0, y: 0, angle: 0 };
    /**
     * @type {import("p5").IMAGE_MODE}
     */
    imageMode;
    /**
     * @type {{ image: import("p5").Image; width: number; height: number; opacity: number; roofHitbox: Matter.Body } | void}
     */
    health;
    /**
     * @type {number}
     */
    roof;

    /**
     * @param {Matter.Body} body
     * @param {number} angle
     * @param {import("p5").Image} image
     * @param {{ width: number, height: number }} imageDimensions
     * @param {string} tint
     * @param {number} layer
     * @param {{ x: number, y: number, angle: number }} offset
     * @param {import("p5").IMAGE_MODE} imageMode
     * @param {number} health
     * @param {void | { image: import("p5").Image; width: number; height: number; opacity: number; roofHitbox: Matter.Body; } } roof
     */
    constructor (body, angle, image, imageDimensions, tint, layer, offset, imageMode, health, roof) {
        this.#body = body;
        this.angle = angle ?? 0;
        this.image = image;
        this.imageWidth = imageDimensions?.width ?? 1;
        this.imageHeight = imageDimensions?.height ?? 1;
        this.tint = tint ?? "#FFFFFF";
        this.layer = layer ?? 1;
        this.offset = {
            x: offset?.x ?? 0,
            y: offset?.y ?? 0,
            angle: offset?.angle ?? 0,
        };
        this.imageMode = imageMode ?? "center";
        this.health = health ?? Infinity;
        this.roof = roof;
    }
}

class path {
    /**
     * @type {Array}
     */
    vertices;
    /**
     * @type {String}
     */
    colour;
    /**
     * @param {Array} vertices
     * @param {String} colour
     */
    constructor (vertices, colour) {
        this.vertices = vertices;
        this.colour = colour;
    }
}
class playerLike {
    /**
     * @type {Matter.Body}
     */
    #body;
    get body() { return this.#body; }
    /**
     * @type {{ primary: `#${string}`, secondary: `#${string}`, highlight: `#${string}` }}
     */
    colour;
    /**
     * @type {{ friction: number, restitution: number, inertia?: number, density: number; }}
     */
    options;
    /**
     * @type {inventory}
     */
    inventory;
    /**
     * @type {number}
     */
    angle;
    /**
     * @type {number}
     */
    health;
    /**
     * @type {number}
     */
    view;
    /**
     * @type {boolean}
     */
    isMoving;
    /**
     * @type {{shooting: boolean, lastShot: number, fired: number, lastBurst }}
     */
    state = {
        shooting: false,
        lastShot: 0,
        fired: 0,
        lastBurst: 0
    };
    /**
     * @param {Matter.Body} body
     * @param {number} angle
     * @param {{primary: `#${string}`;secondary: `#${string}`;highlight: `#${string}`;}} colour
     * @param {{friction: number;restitution: number;inertia?: number;density: number;}} options
     * @param {{guns: string[];activeIndex: number;}} loadout
     * @param {number} health
     * @param {boolean} isMoving
     * @param {number} view
     */
    constructor (body, angle, colour, options, loadout, health, view, isMoving) {
        this.#body = body;
        this.#body.angle = angle;
        this.angle = angle;
        this.colour = colour;
        this.options = options;
        this.view = view;
        this.inventory = new inventory(this, ...(() => loadout.guns.map(v => gamespace.guns.find(g => g.name == v)))());
        this.inventory.activeIndex = loadout.activeIndex;
        this.health = health;
        this.isMoving = isMoving;
    }
    destroy() {
        this.#body = void 0;
    }
}

class inventory {
    /**
     * @type {playerLike}
     */
    #parent;
    get parent() { return this.#parent; }

    /**
     * @type {gun[]}
     */
    guns = [];

    #activeIndex = 0;
    get activeIndex() { return this.#activeIndex; }
    set activeIndex(v) {
        this.#activeIndex = v;
        this.#activeItem = this.guns[v];
        //this.#parent.view = this.#activeItem.proto.view;
    }

    /**
     * @type {gun}
     */
    #activeItem;
    get activeItem() { return this.#activeItem; }

    /**
     * @param  {playerLike} parent
     * @param  {...gunPrototype} items
     */
    constructor (parent, ...items) {
        this.#parent = parent;
        this.guns = (items ?? []).map(v => new gun(v));
    }
}

class gun {
    /**
     * @readonly
     * @type {gunPrototype}
     */
    #proto;
    get proto() { return this.#proto; };

    /**
     * @type {number}
     */
    #activeFireModeIndex = 0;
    get activeFireModeIndex() { return this.#activeFireModeIndex; };
    set activeFireModeIndex(v) {
        const f = this.proto.fireMode;
        this.#activeFireMode = f[this.#activeFireModeIndex = v % f.length];
    };

    /**
     * @readonly
     * @type {(typeof gunPrototype.prototype.fireMode)[number]}
     */
    #activeFireMode;
    get activeFireMode() { return this.#activeFireMode; };

    /**
     *
     * @param {gunPrototype} proto
     */
    constructor (proto) {
        this.#proto = proto;
        this.#activeFireMode = proto.fireMode[this.activeFireModeIndex];
    }
}

class gunPrototype {
    /**
     * @type {string}
     */
    name;
    /**
     * @type {{ loot: import("p5").Image, held: import("p5").Image }}
     */
    images = {
        loot: void 0,
        held: void 0
    };
    /**
     * @type {number}
     */
    view;
    /**
     * @type {{ damage: number, velocity: number, range: number, timeout: number }}
     */
    ballistics;
    /**
     * @type {string}
     */
    caliber;
    /**
     * @type {number}
     */
    delay;
    /**
     * @type {{ default: number, moving: number; }}
     */
    accuracy = {
        default: 0,
        moving: 0,
    };
    /**
     * @type {{ x: number, y: number }}
     */
    offset = { x: 0, y: 0 };
    /**
     * @type {number}
     */
    width;
    /**
     * @type {number}
     */
    height;
    /**
     * @type {{ lefthand: { x: number, y: number; }, righthand: { x: number, y: number; }; }}
     */
    hands = {
        lefthand: { x: 0.5, y: -1 },
        righthand: { x: 0.5, y: -1 }
    };
    /**
     * @type {{ x: number, y: number }}
     */
    spawnOffset = { x: 0, y: 0 };
    /**
     * @type {number}
     */
    flashDuration = 40;
    /**
     * @type {{{ x: number, y: number, duration: number }, { x: number, y: number, duration: number }, { x: number, y: number, duration: number }}}
     */
    recoilImpulse = { left: {x: 0, y: -5, duration: 80 }, right: {x: 0, y: -5, duration: 80 }, weapon: {x: 0, y: -5, duration: 80 }};
    /**
     * @type {("automatic" | "semi" | `burst-${number}`)[]}
     */
    fireMode = ["automatic"];
    /**
     * @type {{ shotDelay: number, burstDelay: number; }}
     */
    burstProps = {
        shotDelay: 60,
        burstDelay: 500,
    };

    /**
     * @param {string} name
     * @param {{ loot: import("p5").Image, held: import("p5").Image }} images
     * @param {number} view
     * @param {{ damage: number, velocity: number, range: number, timeout?: number }} ballistics
     * @param {string} caliber
     * @param {number} delay
     * @param {{ default: number,moving: number; }} accuracy
     * @param {{ x: number, y: number }} offset
     * @param {{ width: number, height: number }} dimensions
     * @param {{ lefthand: { x: number, y: number; }, righthand: { x: number, y: number; }; }} hands
     * @param {{ x: number, y: number }} spawnOffset
     * @param {number} flashDuration
     * @param {{ x: number, y: number, duration: number }} recoilImpulse
     * @param {("automatic" | "semi" | `burst-${number}`)[]} fireMode
     * @param {{ shotDelay: number, burstDelay: number; }} burstProps
     */
    constructor (name, images, view, ballistics, caliber, delay, accuracy, offset, dimensions, hands, spawnOffset, flashDuration, recoilImpulse, fireMode, burstProps) {
        this.name = name;
        this.images = images;
        this.view = view;
        this.ballistics = {
            damage: ballistics?.damage ?? 30,
            velocity: ballistics?.velocity ?? 150,
            range: ballistics?.range ?? 500,
            timeout: ballistics?.timeout ?? 0,
        };
        this.caliber = caliber;
        this.delay = delay;
        this.accuracy = accuracy;
        this.offset = {
            x: offset?.x ?? 0,
            y: offset?.y ?? 0
        };
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.hands = hands ?? {
            lefthand: { x: 0.5, y: -1 },
            righthand: { x: 0.5, y: -1 }
        };
        this.spawnOffset = {
            x: spawnOffset?.x ?? 0,
            y: spawnOffset?.y ?? 0
        };
        this.flashDuration = flashDuration ?? 40;
        this.recoilImpulse = {
            left: {
                x: recoilImpulse.left?.x ?? 0,
                y: recoilImpulse.left?.y ?? 0,
                duration: recoilImpulse.left?.duration ?? this.delay
            },
            right: {
                x: recoilImpulse.right?.x ?? 0,
                y: recoilImpulse.right?.y ?? 0,
                duration: recoilImpulse.right?.duration ?? this.delay
            },
            weapon: {
                x: recoilImpulse.weapon?.x ?? 0,
                y: recoilImpulse.weapon?.y ?? 0,
                duration: recoilImpulse.weapon?.duration ?? this.delay
            },
        };
        this.fireMode = fireMode ?? ["automatic"];
        this.burstProps = burstProps && {
            shotDelay: burstProps?.shotDelay ?? 0,
            burstDelay: burstProps?.burstDelay ?? 1000,
        };
    }
}

class bullet {
    /**
     * @type {Matter.Body}
     */
    #body;
    get body() { return this.#body; }
    /**
     * @type {playerLike}
     */
    #shooter;
    get shooter() { return this.#shooter; }
    /**
     * @type {gunPrototype}
     */
    #emitter;
    get emitter() { return this.#emitter; }
    /**
     * @type {number}
     */
    #angle;
    get angle() { return this.#angle; }
    /**
     * @type {{ x: number, y: number }}
     */
    #start;
    get start() { return this.#start; }
    /**
     * @type {number}
     */
    index;
    /**
     * @type {number}
     */
    squaredDistance = 0;
    /**
     * @param {Matter.Body} body
     * @param {playerLike} shooter
     * @param {gunPrototype} emitter
     * @param {number} angle
     * @param {{ x: number, y: number }} start
     * @param {number} index
     */
    constructor (body, shooter, emitter, angle, start, index) {
        this.#body = body;
        this.#shooter = shooter;
        this.#emitter = emitter;
        this.#angle = angle;
        this.#start = start;
        this.index = index;
        this.timer = 0;
    }
    destroy() { // Free up the memory by clearing references to objects, since we no longer need the references
        this.#body = this.#shooter = this.#emitter = void 0;
    }
}
class particle {
    /**
     * @type {import("p5").Image}
     */
    image;
    /**
     * @type {number}
     */
    opacity;
    /**
     * @type {number}
     */
    unit;
    /**
     * @param {number}
     */
    x;
    /**
     * @param {number}
     */
    y;
    /**
     * @param {string}
     */
    tint;
    /**
     * @param {angle}
     */
    angle;
    /**
     * @param {import("p5").Image} image
     * @param {number} opacity
     * @param {number} unit
     */
    constructor (image, opacity, unit, x, y, angle, tint) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.unit = unit;
        this.opacity = opacity ?? 255;
        this.angle = angle;
        this.tint = tint;
    }
}
/**
 * @type {{readonly version: string, levelsRaw: { name: string; world: { width: number; height: number; colour: string; gridColour: any; }; initializer: () => void; }[], levels: level[], settings: { graphicsQuality: number, debug: boolean }, guns: gunPrototype[]}}
 */
const gamespace = {
    get version() { return "0.8.9-web_alpha (no v0.9 for you)"; },
    levelsRaw: [],
    levels: [],
    settings: {
        graphicsQuality: 1,
        debug: false
    },
    guns: [
        new gunPrototype(
            "AUG",
            { loot: loadImg("assets/items/weapons/AUG/AUG_loot.svg"), held: loadImg("assets/items/weapons/AUG/AUG_topdown.svg") },
            2500,
            { damage: 100 / 3, velocity: 140, range: 1000, timeout: Infinity },
            "5.56x45mm",
            RPMToMSDelay(680),
            { default: 1 * Math.PI / 180, moving: 5 * Math.PI / 180 },
            { x: 0, y: -1 },
            { width: 0.9, height: 4.6 },
            { lefthand: { x: -0.2, y: -0.2 }, righthand: { x: 0.2, y: -1 } },
            { x: 0, y: 40 },
            40,
            { left: {x: 0, y: -15, duration: 80}, right: {x: 0, y: -15, duration: 80}, weapon: {x: 0, y: -15, duration: 80}},
            [/*"automatic",  */"burst-3", "semi"],
            { shotDelay: RPMToMSDelay(1000), burstDelay: RPMToMSDelay(130) }
        ),
        new gunPrototype(
            "AKS-74U",
            { loot: loadImg("assets/items/weapons/AKS-74U/AKS-74U_loot.svg"), held: loadImg("assets/items/weapons/AKS-74U/AKS-74U_topdown.svg") },
            2000,
            { damage: 14, velocity: 140, range: 700, timeout: Infinity },
            "7.62x39mm",
            RPMToMSDelay(650),
            { default: 3 * Math.PI / 180, moving: 8 * Math.PI / 180 },
            { x: 0, y: -1.7 },
            { width: 1.1, height: 3.3 },
            { lefthand: { x: -0.15, y: -0.4 }, righthand: { x: 0.25, y: 0.5 } },
            { x: 0, y: 40 },
            40,
            { left: {x: 0, y: -6, duration: 70}, right: {x: 0, y: -6, duration: 70}, weapon: {x: 0, y: -6, duration: 70}},
            ["automatic"],
            { shotDelay: RPMToMSDelay(1400), burstDelay: RPMToMSDelay(130) }
        ),
        new gunPrototype(
            "AK-102",
            { loot: loadImg("assets/items/weapons/AK-102/AK-102_loot.svg"), held: loadImg("assets/items/weapons/AK-102/AK-102_topdown.svg") },
            2000,
            { damage: 19, velocity: 140, range: 700, timeout: Infinity },
            "5.56x45mm",
            RPMToMSDelay(450),
            { default: 1.5 * Math.PI / 180, moving: 5 * Math.PI / 180 },
            { x: 0, y: -1.8 },
            { width: 1.1, height: 3.4 },
            { lefthand: { x: -0.15, y: -0.4 }, righthand: { x: 0.25, y: 0.5 } },
            { x: 0, y: 40 },
            40,
            { left: {x: 0, y: -14, duration: 70}, right: {x: 0, y: -14, duration: 70}, weapon: {x: 0, y: -14, duration: 70}},
            ["automatic"],
            { shotDelay: RPMToMSDelay(1400), burstDelay: RPMToMSDelay(130) }
        ),
        new gunPrototype(
            "M4A1",
            { loot: loadImg("assets/items/weapons/M4A1/M4A1_loot.svg"), held: loadImg("assets/items/weapons/M4A1/M4A1_topdown.svg") },
            2000,
            { damage: 23, velocity: 140, range: 1000, timeout: Infinity },
            "5.56x45mm",
            RPMToMSDelay(400),
            { default: 1 * Math.PI / 180, moving: 4 * Math.PI / 180 },
            { x: 0, y: -1.2 },
            { width: 1, height: 4.3 },
            { lefthand: { x: -0.2, y: -0.8 }, righthand: { x: 0.2, y: 0 } },
            { x: 100, y: 40 },
            40,
            { left: {x: 0, y: -10, duration: 90}, right: {x: 0, y: -10, duration: 90}, weapon: {x: 0, y: -10, duration: 90} },
            ["automatic"],
            { shotDelay: RPMToMSDelay(1400), burstDelay: RPMToMSDelay(130) }
        ),
        new gunPrototype(
            "Military Bayonet",
            { loot: loadImg("assets/items/weapons/Bayonet-Military/Bayonet-Military_loot.svg"), held: loadImg("assets/items/weapons/Bayonet-Military/Bayonet-Military_held.svg") },
            2000,
            { damage: 100 / 3, velocity: 20, range: 100, timeout: 10 },
            "melee",
            RPMToMSDelay(400),
            { default: 0 * Math.PI / 180, moving: 0 * Math.PI / 180 },
            { x: 0.4, y: -1.6 },
            { width: 2.4, height: 2.4 },
            { lefthand: { x: -1, y: 0.6 }, righthand: { x: 0.3, y: 0.6 } },
            { x: 100, y: 40 },
            40,
            { left: {x: 0, y: -10, duration: 100}, right: {x: -10, y: 30, duration: 100}, weapon: {x: -10, y: 30, duration: 100} },
            ["semi"],
            { shotDelay: RPMToMSDelay(400), burstDelay: RPMToMSDelay(130) }
        ),
    ]
};
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
    constructor(name, description, world, initializer) {
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
     * @type {{ x: number, y: number, angle: 0 }}
     */
    offset = { x: 0, y: 0, angle: 0 };
    /**
     * @type {import("p5").IMAGE_MODE}
     */
    imageMode;
    /**
     * @type {{ image: import("p5").Image; width: number; height: number; opacity: number; }; }
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
     * @param {void | { image: string; width: number; height: number; opacity: number; } } roof
     */
    constructor(body, angle, image, imageDimensions, tint, layer, offset, imageMode, roof) {
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
        this.roof = roof;
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
     * @param {{ primary: `#${string}`, secondary: `#${string}`, highlight: `#${string}` }} colour
     * @param {{ friction: number, restitution: number, inertia?: number, density: number; }} options
     * @param {{ guns: string[];activeIndex: number; }} loadout
     * @param {number} selected
     * @param {number} health
     * @param {boolean} isMoving;
     */
    constructor(body, angle, colour, options, loadout, health, view, isMoving) {
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
        this.#parent.view = this.#activeItem.proto.view;
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
    constructor(parent, ...items) {
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
    constructor(proto) {
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
     * @type {{ damage: number, velocity: number, range: number }}
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
     * @type {{ x: number, y: number, duration: number }}
     */
    recoilImpulse = { x: 0, y: -5, duration: 80 };
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
     * @param {{ damage: number, velocity: number, range: number }} ballistics
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
    constructor(name, images, view, ballistics, caliber, delay, accuracy, offset, dimensions, hands, spawnOffset, flashDuration, recoilImpulse, fireMode, burstProps) {
        this.name = name;
        this.images = images;
        this.view = view;
        this.ballistics = {
            damage: ballistics?.damage ?? 30,
            velocity: ballistics?.velocity ?? 150,
            velocity: ballistics?.velocity ?? 500,
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
            x: recoilImpulse?.x ?? 0,
            y: recoilImpulse?.y ?? 0,
            duration: recoilImpulse?.duration ?? this.delay
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
    constructor(body, shooter, emitter, angle, start, index) {
        this.#body = body;
        this.#shooter = shooter;
        this.#emitter = emitter;
        this.#angle = angle;
        this.#start = start;
        this.index = index;
    }
    destroy() { // Free up the memory by clearing references to objects, since we no longer need the references
        this.#body = this.#shooter = this.#emitter = void 0;
    }
}

/**
 * @type {{readonly version: string, levelsRaw: { name: string; world: { width: number; height: number; colour: string; gridColour: any; }; initializer: () => void; }[], levels: level[], settings: { graphicsQuality: number, debug: boolean }, guns: gunPrototype[]}}
 */
const gamespace = {
    get version() { return "0.0.6-electron"; },
    levelsRaw: [],
    levels: [],
    settings: {
        graphicsQuality: 1,
        debug: false
    },
    guns: [
        new gunPrototype(
            "AUG",
            { loot: loadImg("assets/items/firearms/AUG/AUG_loot.svg"), held: loadImg("assets/items/firearms/AUG/AUG_topdown.svg") },
            2500,
            { damage: 34, velocity: 140, range: 1000 },
            "5.56x45mm",
            RPMToMSDelay(680),
            // RPMToMSDelay(750),
            { default: 1 * Math.PI / 180, moving: 5 * Math.PI / 180 },
            { x: 0, y: -1.5 },
            { width: 0.9, height: 4.6 },
            { lefthand: { x: -0.2, y: -1 }, righthand: { x: 0.2, y: 0 } },
            { x: 0, y: 40 },
            40,
            { x: 0, y: -5, duration: 80 },
            [/*"automatic",  */"burst-3",  "semi"],
            { shotDelay: RPMToMSDelay(1800), burstDelay: RPMToMSDelay(250) }
        ),
    ]
};

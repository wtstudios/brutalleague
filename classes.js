class level {
    name;
    description;
    world;
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

    image;
    // I suggest renaming to "width" and "height", then encapsulating in a "dimensions" object, akin to the one passed into the constructor (dimensions: { width: number, height: number })
    imageWidth;
    imageHeight;
    tint;
    angle;
    layer;
    offset = { x: 0, y: 0, angle: 0 };
    imageMode;
    health;
    roof;

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
    vertices;
    colour;

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

    colour;
    options;
    inventory;
    angle; // Consider moving this to the "state" property
    health;
    view;
    isMoving; // Consider moving this to the "state" property
    state = {
        shooting: false,
        lastShot: 0,
        fired: 0,
        lastBurst: 0
    };

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
        // this.#parent.view = this.#activeItem.proto.view;
        // Why is this commented out?
        // it fixes a bug introduced by weapon switching, the equivalent is added back in function preload of level0
    }

    /**
     * @type {gun}
     */
    #activeItem;
    get activeItem() { return this.#activeItem; }

    /**
     * @param  {playerLike} parent
     * @param  {...weaponPrototype} items
     */
    constructor (parent, ...items) {
        this.#parent = parent;
        this.guns = (items ?? []).map(v => new gun(v));
    }
}

class gun {
    /**
     * @readonly
     * @type {weaponPrototype}
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

    #activeFireMode;
    get activeFireMode() { return this.#activeFireMode; };

    constructor (proto) {
        this.#proto = proto;
        this.#activeFireMode = proto.fireMode[this.activeFireModeIndex];
    }
}

class weaponPrototype {
    name;
    images = {
        loot: void 0,
        held: void 0
    };
    /**
     * @type {number}
     */
    view;
    ballistics;
    caliber;
    delay; // Consider renaming to "firingDelay" or similar
    accuracy = {
        default: 0,
        moving: 0,
    };
    offset = { x: 0, y: 0 }; // Consider renaming to "imageOffset" for added clarity
    width;
    height;
    hands = { // Consider adding in support for values that indicate one-handed riggings
        lefthand: {
            x: 0.5,
            y: -1
        },
        righthand: {
            x: 0.5,
            y: -1
        }
    };
    spawnOffset = { x: 0, y: 0 };
    flashDuration = 40;
    recoilImpulse = { // Consider naming the "left" and "right" right fields more clearly
        left: {
            x: 0,
            y: -5,
            duration: 80
        }, right: {
            x: 0,
            y: -5,
            duration: 80
        }, weapon: {
            x: 0,
            y: -5,
            duration: 80
        }
    };
    fireMode = ["automatic"]; // Pluralize field name?
    burstProps = {
        shotDelay: 60,
        burstDelay: 500,
    };

    constructor (
        name,
        images,
        view,
        ballistics,
        caliber,
        delay,
        accuracy,
        offset,
        dimensions,  // Please refactor either this constructor parameter or the fields it's assigned to so as to resolve this type incoherence
        hands,
        spawnOffset,
        flashDuration,
        recoilImpulse,
        fireMode,
        burstProps
    ) {
        this.name = name;
        this.images = images;
        this.view = view;
        this.ballistics = {
            damage: ballistics?.damage ?? 30,
            velocity: ballistics?.velocity ?? 150,
            range: ballistics?.range ?? 500,
            timeout: ballistics?.timeout ?? Infinity // Not needed; "timeout" (or more appropriately, "lifespan") is simply range divided by velocity
            // true, however it can be janky as hell to factor in velocity when delta time makes the speed fluctuate as it does
            // Why is this field instantiated as 0 if no value is found?
            // fixed
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
    #body;
    get body() { return this.#body; }

    #shooter;
    get shooter() { return this.#shooter; }

    #emitter;
    get emitter() { return this.#emitter; }

    #angle;
    get angle() { return this.#angle; }

    #start;
    get start() { return this.#start; }

    index; // Extremely ambiguous name
    /*
        Also not needed.
        This property stores the index at which this bullet's shooter is within the player array.
        Not only does this change when players die or are added, therefore making it unreliable for identifying this bullet's shoooter,
        there is literally a property dedicated to keeping track of the playerLike who shot this bullet: the shooter property

        If you want to implement checks to prevent bullets colliding with their shooters, use playerLike.body.id instead.
    */
    timer; // Better to store the timestamp of the bullet's spawn, rather than how long it's existed for.
    squaredDistance = 0;
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
    image;
    opacity;
    unit; // Unclear naming
    /*
        Furthermore, it'd be better to express a particle's lifetime "as-is". This doesn't even garantee a consistent lifetime, since the amount of time a particle ends up living is
        directly dependant on how fast drawParticles is called, which is in turn dependant on how fast p5's draw function is called

        I suggest adding a "lifetime" field and a "created" field, both of tyoe number. The first stores how many milliseconds the particle should live for,
        the second, the timestamp the particle was created at. The constructor takes a parameter called "created" and assigns it to this.created;
        Date.now() should therefore always be passed to this parameter.

        Then, in drawParticles, before drawing anything, loop over the particles that exist, and for each one, check if the difference between that particle's "created" timestamp
        and the current timestamp is less than that particle's lifetime: if so, do nothing. Otherwise, remove it. Use Array.filter for this.
    */
    x;
    y;
    tint;  // Rather than force the color mode into RGB so that you can use a specific overload of p5's tint function, why not write a utility function to convert hex to RGB?
    angle;
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
 * @type {{readonly version: string, levelsRaw: { name: string; world: { width: number; height: number; colour: string; gridColour: any; }; initializer: () => void; }[], levels: level[], settings: { graphicsQuality: number, debug: boolean }, guns: weaponPrototype[]}}
 */
const gamespace = {
    get version() { return "0.9-web_alpha (finally?)"; },
    levelsRaw: [],
    levels: [],
    settings: {
        graphicsQuality: 1,
        debug: false
    },
    guns: [ // You should probably extract this to .json and import it
        /*
            Why do the AUG and knife deal the same damage?

            nerfed the AUG, kept the knife pretty much the same (try using the knife with an autoclicker !!!)

            Why do those two weapons share the title for highest damage per shot?

            to point users in the direction of using guns they usually wouldnt, burst and melee weapons are usually unpopular

            Why do all the guns have the same velocity?

            fixed

            The AK-102 fires too slow (450RPM vs 600RPM)

            the 102 was meant to be the slower firing, higher damage russian weapon in the game, but i've nerfed the damage slightly and raised the rpm by 100

            M4's usually fire around the 700-950RPM range

            reworked the m4 a bit, just dont want the game to be extremely spammy

            Why does the AUG still fire 3-round bursts?

            thought I read somewhere that an AUG could have single shot and burst modes

            And most importantly of all,
            why is the bayonet a gun?? Make a seperate melee class! 

            renamed gunPrototype - weaponPrototype
         */
        new weaponPrototype(
            "AUG",
            { loot: "assets/items/weapons/AUG/AUG_loot.svg", held: loadImg("assets/items/weapons/AUG/AUG_topdown.svg") },
            2500,
            { damage: 27, velocity: 200, range: 1900, timeout: Infinity },
            "5.56x45mm",
            RPMToMSDelay(680),
            { default: 1 * Math.PI / 180, moving: 5 * Math.PI / 180 },
            { x: 0, y: -1 },
            { width: 0.9, height: 4.6 },
            { lefthand: { x: -0.2, y: -0.2 }, righthand: { x: 0.2, y: -1 } },
            { x: 0, y: 40 },
            40,
            { left: { x: 0, y: -15, duration: 80 }, right: { x: 0, y: -15, duration: 80 }, weapon: { x: 0, y: -15, duration: 80 } },
            [/* "automatic", */"burst-3", "semi"],
            { shotDelay: RPMToMSDelay(1000), burstDelay: RPMToMSDelay(130) }
        ),
        new weaponPrototype(
            "AKS-74U",
            { loot: "assets/items/weapons/AKS-74U/AKS-74U_loot.svg", held: loadImg("assets/items/weapons/AKS-74U/AKS-74U_topdown.svg") },
            2000,
            { damage: 12, velocity: 140, range: 1000, timeout: Infinity },
            "5.45x39mm",
            RPMToMSDelay(700),
            { default: 3 * Math.PI / 180, moving: 8 * Math.PI / 180 },
            { x: 0, y: -1.7 },
            { width: 1.1, height: 3.3 },
            { lefthand: { x: -0.15, y: -0.4 }, righthand: { x: 0.25, y: 0.5 } },
            { x: 0, y: 40 },
            40,
            { left: { x: 0, y: -6, duration: 70 }, right: { x: 0, y: -6, duration: 70 }, weapon: { x: 0, y: -6, duration: 70 } },
            ["automatic"],
            { shotDelay: RPMToMSDelay(1400), burstDelay: RPMToMSDelay(130) }
        ),
        new weaponPrototype(
            "AK-102",
            { loot: "assets/items/weapons/AK-102/AK-102_loot.svg", held: loadImg("assets/items/weapons/AK-102/AK-102_topdown.svg") },
            2000,
            { damage: 16, velocity: 160, range: 1400, timeout: Infinity },
            "5.56x45mm",
            RPMToMSDelay(550),
            { default: 1.5 * Math.PI / 180, moving: 5 * Math.PI / 180 },
            { x: 0, y: -1.8 },
            { width: 1.1, height: 3.4 },
            { lefthand: { x: -0.15, y: -0.4 }, righthand: { x: 0.25, y: 0.5 } },
            { x: 0, y: 40 },
            40,
            { left: { x: 0, y: -14, duration: 70 }, right: { x: 0, y: -14, duration: 70 }, weapon: { x: 0, y: -14, duration: 70 } },
            ["automatic"],
            { shotDelay: RPMToMSDelay(1400), burstDelay: RPMToMSDelay(130) }
        ),
        new weaponPrototype(
            "M4A1",
            { loot: "assets/items/weapons/M4A1/M4A1_loot.svg", held: loadImg("assets/items/weapons/M4A1/M4A1_topdown.svg") },
            2000,
            { damage: 19, velocity: 180, range: 1700, timeout: Infinity },
            "5.56x45mm",
            RPMToMSDelay(600),
            { default: 1 * Math.PI / 180, moving: 4 * Math.PI / 180 },
            { x: 0, y: -1.2 },
            { width: 1, height: 4.3 },
            { lefthand: { x: -0.2, y: -0.8 }, righthand: { x: 0.2, y: 0 } },
            { x: 100, y: 40 },
            40,
            { left: { x: 0, y: -10, duration: 90 }, right: { x: 0, y: -10, duration: 90 }, weapon: { x: 0, y: -10, duration: 90 } },
            ["automatic"],
            { shotDelay: RPMToMSDelay(1400), burstDelay: RPMToMSDelay(130) }
        ),
        new weaponPrototype(
            "Bayonet",
            { loot: "assets/items/weapons/Bayonet-Military/Bayonet-Military_loot.svg", held: loadImg("assets/items/weapons/Bayonet-Military/Bayonet-Military_held.svg") },
            2000,
            { damage: 100 / 3, velocity: 20, range: 100, timeout: 10 },
            "melee",
            RPMToMSDelay(2000),
            { default: 0 * Math.PI / 180, moving: 0 * Math.PI / 180 },
            { x: 0.4, y: -1.6 },
            { width: 2.4, height: 2.4 },
            { lefthand: { x: -1, y: 0.6 }, righthand: { x: 0.3, y: 0.6 } },
            { x: 100, y: 40 },
            40,
            { left: { x: 0, y: -10, duration: 100 }, right: { x: -10, y: 30, duration: 100 }, weapon: { x: -10, y: 30, duration: 100 } },
            ["semi"],
            { shotDelay: RPMToMSDelay(400), burstDelay: RPMToMSDelay(130) }
        ),
    ]
};
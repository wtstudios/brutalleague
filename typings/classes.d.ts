// Written on July 23rd for BL v0.8.9-web_alpha

declare class level {
    name: string;
    description: string; world: { width: number; height: number; colour: string; gridColour: string; };
    initializer: () => void;

    constructor(name: string, description: string, world: { width: number; height: number; colour: string; gridColour: string; }, initializer: () => void);
}

declare class obstacle {
    #body: Matter.Body;
    get body(): Matter.Body;

    image: import("p5").Image;
    imageWidth: number;
    imageHeight: number;
    tint: string;
    angle: number;
    layer: number;
    offset: {
        x: number,
        y: number,
        angle: number;
    };

    imageMode: import("p5").IMAGE_MODE;
    health: number;
    roof: void | {
        image: import("p5").Image,
        width: number,
        height: number,
        opacity: number,
        roofHitbox: Matter.Body;
    };

    constructor(body: Matter.Body,
        angle: number,
        image: import("p5").Image,
        imageDimensions: {
            width: number,
            height: number;
        },
        tint: string,
        layer: number,
        offset: {
            x: number,
            y: number,
            angle: number;
        },
        imageMode: import("p5").IMAGE_MODE,
        health: number,
        roof: void | {
            image: import("p5").Image,
            width: number,
            height: number,
            opacity: number,
            roofHitbox: Matter.Body;
        }
    );
}

declare class path {
    vertices: { x: number, y: number; }[];
    colour: string;
    constructor(vertices: { x: number, y: number; }[], colour: string);
}

declare class playerLike {
    #body: Matter.Body;
    get body(): Matter.Body;

    colour: {
        primary: string,
        secondary: string,
        highlight: string;
    };

    options: {
        friction?: number,
        restitution?: number,
        inertia?: number,
        density?: number;
    };

    inventory: inventory;
    angle: number;
    health: number;
    view: number;
    isMoving: boolean;

    state: {
        shooting: boolean,
        lastShot: number,
        fired: number,
        lastBurst: number;
    };

    constructor(
        body: Matter.Body,
        angle: number,
        colour: { primary: `#${string}`; secondary: `#${string}`; highlight: `#${string}`; },
        options: { friction: number; restitution: number; inertia?: number; density: number; },
        loadout: { guns: string[]; activeIndex: number; },
        health: number,
        view: number,
        isMoving: boolean
    );

    destroy(): void;
}

declare class inventory {
    #parent: playerLike;
    get parent(): playerLike;

    guns: gun[];

    #activeIndex: number;
    get activeIndex(): number;
    set activeIndex(v: number);

    #activeItem: gun;
    get activeItem(): gun;

    constructor(parent: playerLike, ...items: gunPrototype[]);
}

declare class gun {
    #proto: gunPrototype;
    get proto(): gunPrototype;

    #activeFireModeIndex: number;
    get activeFireModeIndex(): number;
    set activeFireModeIndex(v: number);

    #activeFireMode: (typeof gunPrototype.prototype.fireMode)[number];
    get activeFireMode(): (typeof gunPrototype.prototype.fireMode)[number];

    constructor(proto: gunPrototype);
}

declare class gunPrototype {
    name: string;
    images: {
        loot: import("p5").Image,
        held: import("p5").Image;
    };
    view: number;
    ballistics: {
        damage: number,
        velocity: number,
        range: number,
        timeout: number;
    };
    caliber: string;
    delay: number;
    accuracy: {
        default: number,
        moving: number;
    };
    offset: {
        x: number,
        y: number;
    };
    width: number;
    height: number;
    hands: {
        lefthand: {
            x: number,
            y: number;
        },
        righthand: {
            x: number,
            y: number;
        };
    };
    spawnOffset: {
        x: number,
        y: number;
    };
    flashDuration: number;
    recoilImpulse: {
        left: {
            x: number;
            y: number;
            duration: number;
        };
        right: {
            x: number;
            y: number;
            duration: number;
        };
        weapon: {
            x: number;
            y: number;
            duration: number;
        };
    };

    fireMode: ("automatic" | "semi" | `burst-${number}`)[];

    burstProps: { shotDelay: number, burstDelay: number; };

    constructor(
        name: typeof gunPrototype.prototype.name,
        images: typeof gunPrototype.prototype.images,
        view: typeof gunPrototype.prototype.view,
        ballistics: typeof gunPrototype.prototype.ballistics,
        caliber: typeof gunPrototype.prototype.caliber,
        delay: typeof gunPrototype.prototype.delay,
        accuracy: typeof gunPrototype.prototype.accuracy,
        offset: typeof gunPrototype.prototype.offset,
        dimensions: { width: number, height: number; },
        hands: typeof gunPrototype.prototype.hands,
        spawnOffset: typeof gunPrototype.prototype.spawnOffset,
        flashDuration: typeof gunPrototype.prototype.flashDuration,
        recoilImpulse: typeof gunPrototype.prototype.recoilImpulse,
        fireMode: typeof gunPrototype.prototype.fireMode,
        burstProps: typeof gunPrototype.prototype.burstProps
    );
}

declare class bullet {
    #body: Matter.Body;
    get body(): Matter.Body;

    #shooter: playerLike;
    get shooter(): playerLike;

    #emitter: gunPrototype;
    get emitter(): gunPrototype;

    #angle: number;
    get angle(): number;

    #start: { x: number; y: number; };
    get start(): { x: number, y: number; };

    index: number;
    timer: number;
    squaredDistance: number;

    constructor(body: Matter.Body, shooter: playerLike, emitter: gunPrototype, angle: number, start: { x: number; y: number; }, index: number);
    destroy(): void;
}

declare class particle {
    image: import("p5").Image;
    opacity: number;
    unit: number;
    x: number;
    y: number;
    tint: {
        tintR: number,
        tintG: number,
        tintB: number;
    };
    angle: number;

    constructor(image: import("p5").Image, opacity: number, unit: number, x: number, y: number, angle: number, tint: { tintR: number, tintG: number, tintB: number; });
}

declare const gamespace: {
    readonly version: string,
    levelsRaw: {
        name: string,
        world: {
            width: number,
            height: number,
            colour: string,
            gridColour: any,
        },
        initializer: () => void,
    }[],
    levels: level[],
    settings: {
        graphicsQuality: number,
        debug: boolean,
    },
    guns: gunPrototype[];
};
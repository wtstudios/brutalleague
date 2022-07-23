// Written on July 23rd for BL v0.8.9-web_alpha

declare function loadImg(path: string): import("p5").Image;

declare function loadFnt(path: string): import("p5").Font;

declare function squaredDist(ptA: { x: number, y: number; }, ptB: { x: number, y: number, z: number; }): number;

declare function distance(ptA: { x: number, y: number; }, ptB: { x: number, y: number, z: number; }): number;

declare function RPMToMSDelay(rpm: number): number;

declare function parseLevelData(data: {
    obstacles:
    ((
        {
            type: "rectangle",
            width: number,
            height: number;
        } | {
            type: "circle",
            radius: number;
        } | {
            type: "polygon",
            sides: number,
            radius: number;
        } | {
            type: "fromVertices",
            vertexSets: { x: number, y: number; }[];
        } | {
            type: "trapezoid",
            width: number,
            height: number,
            slope: number;
        }
    ) & {
        x: number,
        y: number,
        options?: Matter.IChamferableBodyDefinition,
        details: {
            image: string,
            imageWidth: number,
            imageHeight: number,
            tint: string,
            layer: number,
            imageMode: import("p5").IMAGE_MODE,
            health: number,
            angleOffset: number,
            roof?: {
                image: string,
                width: number,
                height: number,
                opacity?: number,
                roofHitbox: { x: number, y: number; }[];
            };
        };
    })[],
    players: {
        x: number,
        y: number,
        size: number,
        options?: Matter.IChamferableBodyDefinition,
        angle: number,
        colour1: string,
        colour2: string,
        hightlightcolour: string,
        loadout: {
            guns: string[],
            activeIndex: number;
        },
        health: number;
    }[],
    particles: unknown[], // No mechanism exists for generating particles from JSON
    ground: {
        vertices: [];
        color: string;
    }[],
    missions: {
        name: string,
        type: string,
        quantity: number,
        "xp-reward": number, // Better to use camelCase here (xpReward)
        id: string | null;
    }[]; // Unused
}): {
    obstacles: obstacle[],
    players: playerLike[],
    particles: particle[],
    paths: path[];
};

declare function createDiv(id?: string, className?: string): HTMLDivElement;

declare function $(ele: string): HTMLElement | null;

declare function average(...args: number[]): number;

declare function stdDev(...args: number[]): number;

declare type simpleListener<K extends keyof HTMLElementTagNameMap, key extends keyof HTMLElementEventMap> = (this: HTMLElementTagNameMap[K], ev: HTMLElementEventMap[key]) => void;
declare type optionListener<K extends keyof HTMLElementTagNameMap, key extends keyof HTMLElementEventMap> = { callback: simpleListener<K, key>, options?: boolean | AddEventListenerOptions; };

declare function makeElement<K extends keyof HTMLElementTagNameMap>(
    key: K,
    properties?: Partial<HTMLElementTagNameMap[K]>,
    children?: string | Node | (string | Node)[],
    listeners?: {
        [key in keyof HTMLElementEventMap]?: simpleListener<K, key> | (simpleListener<K, key> | optionListener<K, key>)[];
    }
): HTMLElementTagNameMap[K];
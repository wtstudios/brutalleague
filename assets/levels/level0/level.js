export const level = await (async () => {
    const j = await fetch("assets/levels/level0/data.json"),
        /**
         * @type {{ obstacles: (({ type: "rectangle"; width: number; height: number; } | { type: "circle"; radius: number; } | { type: "polygon"; sides: number; radius: number; } | { type: "fromVertices"; vertexSets: { x: number; y: number; }[]; } | { type: "trapezoid"; slope: number; }) & { x: number; y: number; options: { isStatic: boolean; friction: number; restitution: number; density: number; angle: number; chamfer?: boolean; }; details: { image: string; imageWidth: number; imageHeight: number; tint: `#${string}`; layer: number; xOffset: number; yOffset: number; angleOffset: number; imageMode: import("p5").IMAGE_MODE; roof?: { image: string; width: number; height: number; opacity: number; }; special?: number; }; })[]; players: { x: number; y: number; angle: number; size: number; colour1: `#${string}`; colour2: `#${string}`; options: { friction: number; restitution: number; inertia?: number; density: number; }; highlightcolour: `#${string}`; loadout: { guns: string[], activeIndex: number; }; health: number; }[]; }}
         */
        json = await j.json();


    const levelData = parseLevelData(json),
        /**
         * @type {{ [key: string]: import("p5").Image }}
         */
        images = {
            muzzleFlash: loadImg("assets/misc/muzzleflash.svg"),
            blank: loadImg("assets/misc/blank.png"),
            "caliber_5.56x45mm": loadImg("assets/items/ammo/556mm_full.svg"),
            "caliber_7.62x39mm": loadImg("assets/items/ammo/762mm_full.svg"),
            "caliber_9x19mm": loadImg("assets/items/ammo/9mm_full.svg")
        },
        /**
         * @type {{ [key: string]: import("p5").Font }}
         */
        fonts = {
            sourceSansPro: loadFnt("assets/fonts/SourceSansPro-Black.ttf")
        },
        /**
         * @type {bullet[]}
         */
        bullets = [],
        /**
         * @type {{ [key: number]: boolean }}
         */
        keys = {};

    const level = {
        name: "Border Assault",
        description: "",
        world: {
            width: 4130,
            height: 3500,
            colour: "#d1d1d1",
            gridColour: "#0000001E",
        },
        initializer: () => {
            let dt = 1,
                lastTime = Date.now();

            /**
             * @param {import("p5")} p5
             */
            const s = p5 => {
                let playerNum = 0;

                const Engine = Matter.Engine,
                    World = Matter.World,
                    Bodies = Matter.Bodies,
                    Body = Matter.Body,
                    engine = Engine.create(void 0, {
                        gravity: {
                            y: 0 // For some reason, this doesn't work
                        }
                    }),
                    world = engine.world;

                p5.setup = function () {
                    engine.gravity.y = 0;

                    document.addEventListener("contextmenu", e => e.preventDefault());

                    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
                    $("defaultCanvas0").style.display = "none";

                    const delta = 100 / 3,
                        subSteps = 3,
                        subDelta = delta / subSteps;

                    (function run() {
                        window.requestAnimationFrame(run);
                        for (let i = 0; i < subSteps; i++) {
                            Engine.update(engine, subDelta);
                        }
                    })();

                    p5.imageMode(p5.CENTER);
                    p5.angleMode(p5.RADIANS);

                    addToWorld();
                    p5.cursor('crosshair');
                    $("defaultCanvas0").style.display = "";
                    $("menu-container").remove();
                    window.addEventListener('resize', function () { p5.resizeCanvas(p5.windowWidth, p5.windowHeight); });
                    p5.pixelDensity(gamespace.settings.graphicsQuality);
                    p5.textAlign(p5.CENTER, p5.CENTER);
                };

                function drawPlayers() {
                    levelData.players.forEach((player, i, a) => {
                        const b = player.body;
                        Matter.Body.setVelocity(b, { x: -b.force.x, y: -b.force.y });

                        if (i == playerNum || sqauredDist(b.position, a[playerNum].body.position) < (p5.width + p5.height) ** 2) {
                            // Setup
                            p5.push();
                            p5.translate(b.position.x, b.position.y);
                            p5.rotate(player.angle);

                            const item = player.inventory.activeItem.proto,
                                radius = b.circleRadius,
                                d = Math.min(item.recoilImpulse.duration, lastTime - player.state.lastShot);

                            for (let i = 0; i < 2; i++) { // Hands
                                p5.fill([0, "#F8C574"][i]);
                                Object.values(item.hands).forEach(hand => {
                                    p5.ellipse(hand.x * radius, hand.y * radius, radius * (i ? 0.55 : 0.8), radius * (i ? 0.55 : 0.8), 50);
                                });
                            }

                            // Item image
                            if (item) {
                                p5.image(
                                    item.images.held,
                                    item.offset.x * radius + item.recoilImpulse.x * (1 - (d / item.recoilImpulse.duration)),
                                    item.offset.y * radius - item.recoilImpulse.y * (1 - (d / item.recoilImpulse.duration)),
                                    item.width * radius,
                                    item.height * radius
                                );
                            }

                            // Body
                            p5.fill(0);
                            p5.ellipse(0, 0, radius * 2, radius * 2, 70);
                            p5.fill("#F8C574");
                            p5.ellipse(0, 0, radius * 1.65, radius * 1.65, 70);

                            // Muzzle flash
                            if (player.state.shooting || d <= item.flashDuration) {
                                const scaleX = (2 * Math.round(Math.random()) - 1) * (Math.random() * 0.2 + 0.9),
                                    scaleY = Math.random() * 0.2 + 0.9;

                                p5.scale(scaleX, scaleY);
                                p5.image(images.muzzleFlash, 0, (item.offset.y - item.height + 1.4) * radius / scaleY);
                            }
                            p5.scale(1, 1);

                            // Intense NPC stare
                            if (i != playerNum && sqauredDist(a[playerNum].body.position, player.body.position) <= 2000 ** 2) {
                                player.angle = Math.PI / 2 + Math.atan2(a[playerNum].body.position.y - player.body.position.y, a[playerNum].body.position.x - player.body.position.x);
                            }

                            p5.fill(0);
                            p5.rotate(-player.angle);
                            p5.pop();
                        }
                    });
                };

                function drawPlayerShadows() {
                    levelData.players.forEach((player, i, a) => {
                        const b = player.body;
                        if (i == playerNum || sqauredDist(b.position, a[playerNum].body.position) < (p5.width + p5.height) ** 2) {
                            const item = player.inventory.activeItem.proto,
                                radius = b.circleRadius,
                                d = Math.min(item.delay, lastTime - player.state.lastShot);

                            p5.push();
                            p5.translate(b.position.x, b.position.y);
                            p5.rotate(player.angle);
                            p5.fill(0, 0, 0, 60);
                            p5.tint(0, 0, 0, 60);
                            p5.ellipse(0, 0, radius * 2.1 + 10, radius * 2.1 + 10, 70);

                            Object.values(item.hands).forEach(hand => p5.ellipse(hand.x * radius, hand.y * radius, radius + 5, radius + 5, 50));

                            if (item) {
                                p5.image(
                                    item.images.held,
                                    item.offset.x * radius + item.recoilImpulse.x * (1 - (d / item.delay)),
                                    item.offset.y * radius - item.recoilImpulse.y * (1 - (d / item.delay)),
                                    item.width * radius + 15,
                                    item.height * radius + 10
                                );
                            }

                            p5.pop();
                        }
                    });
                };

                function drawObjects(layer) {
                    levelData.obstacles.filter(o => o.layer == layer).forEach(o => {
                        const b = o.body;
                        Matter.Body.setVelocity(b, { x: -b.force.x, y: b.force.y });

                        p5.push();
                        p5.imageMode(o.imageMode);
                        p5.translate(b.position.x, b.position.y);
                        p5.rotate(b.angle + o.offset.angle);
                        p5.translate(o.offset.x, o.offset.y);
                        if (o.image && sqauredDist(b.position, levelData.players[playerNum].body.position) < (p5.width + p5.height) ** 2) {
                            p5.tint(o.tint);
                            p5.image(o.image, 0, 0, o.imageWidth, o.imageHeight);
                        }
                        p5.noTint();
                        p5.pop();

                        if (gamespace.settings.debug) {
                            p5.fill("#FF000080");
                            p5.beginShape();
                            for (let i = 0; i < b.vertices.length; i++) {
                                p5.vertex(b.vertices[i].x, b.vertices[i].y);
                            }
                            p5.endShape();
                        }
                    });
                };

                function drawRoofs(layer) {
                    levelData.obstacles.filter(o => o.layer == layer).forEach(o => {
                        if (o.roof?.image && sqauredDist(o.body.position, levelData.players[playerNum].body.position) < (p5.width + p5.height) ** 2) {
                            const b = o.body;

                            p5.push();
                            p5.imageMode(o.imageMode);
                            p5.translate(b.position.x, b.position.y);
                            p5.rotate(b.angle + o.offset.angle);
                            p5.translate(o.offset.x, o.offset.y);

                            const p = levelData.players[playerNum],
                                pb = p.body,
                                radius = pb.circleRadius;

                            if (
                                pb.position.x + (radius * 4) <= b.position.x - o.offset.x - o.roof.width / 2 ||
                                pb.position.x - (radius * 4) >= b.position.x + o.offset.x + o.roof.width / 2 ||
                                pb.position.y + (radius * 4) <= b.position.y - o.offset.y - o.roof.height / 2 ||
                                pb.position.y - (radius * 4) >= b.position.y + o.offset.y + o.roof.height / 2
                            ) { // This is terrible
                                if (o.roof.opacity < 255) {
                                    o.roof.opacity = Math.min(o.roof.opacity + Math.round(30 * dt), 255);
                                }
                                if (p.view != p.inventory.activeItem.proto.view) {
                                    p.view += (p.inventory.activeItem.proto.view - (p.view ?? 0)) / 4;
                                }
                            } else {
                                if (o.roof.opacity > 0) {
                                    o.roof.opacity = Math.max(o.roof.opacity - Math.round(30 * dt), 0);
                                }
                                if (p.view != 1700) {
                                    p.view -= ((p.view ?? 0) - 1700) / 2 * dt;
                                }
                            }
                            p5.tint(255, 255, 255, o.roof.opacity);
                            p5.image(o.roof.image, 0, 0, o.roof.width, o.roof.height);
                            p5.pop();
                        }
                    });
                };

                function drawShadows(layer) {
                    levelData.obstacles.filter(o => o.layer == layer).forEach(o => {
                        const b = o.body;

                        p5.push();
                        p5.imageMode(o.imageMode);
                        p5.translate(b.position.x + 10, b.position.y + 10);
                        p5.rotate(b.angle + o.offset.angle);
                        p5.translate(o.offset.x, o.offset.y);

                        if (o.image && sqauredDist(b.position, levelData.players[playerNum].body.position) < (p5.width + p5.height) ** 2) {
                            p5.tint(0, 0, 0, 60);
                            p5.image(o.image, 0, 0, o.imageWidth, o.imageHeight);
                        }
                        p5.pop();
                    });
                };

                function drawBullets() {
                    /**
                     * @param {typeof bullet.prototype.body} b
                     * @param {number} i
                     */
                    function removeBullet(b, i) {
                        World.remove(world, b);
                        bullets.splice(i, 1);
                    }

                    bullets.forEach((b, i) => {
                        const bd = b.body;

                        if (sqauredDist(bd.position, levelData.players[playerNum].body.position) < (p5.width + p5.height) ** 2) {
                            p5.push();
                            p5.translate(bd.position.x - Math.cos(b.angle + p5.HALF_PI) * b.emitter.ballistics.velocity * dt * 3, bd.position.y - Math.sin(b.angle + p5.HALF_PI) * b.emitter.ballistics.velocity * dt * 3);
                            p5.rotate(b.angle);
                            p5.fill(0, 0, 0, 120);
                            p5.image(images[`caliber_${b.emitter.caliber}`], 0, 0, 15, 50);
                            p5.pop();
                        }

                        Matter.Body.setPosition(bd, { x: bd.position.x + p5.cos(b.angle - Math.PI / 2) * b.emitter.ballistics.velocity * dt, y: bd.position.y + p5.sin(b.angle - Math.PI / 2) * b.emitter.ballistics.velocity * dt });
                        b.squaredDistance = sqauredDist(b.start, bd.position);

                        if (b.squaredDistance > b.emitter.ballistics.range ** 2) {
                            removeBullet(bd, i);
                        }

                        if (Matter.Query.collides(bd, levelData.obstacles.map(o => o.body)).length) {
                            removeBullet(bd, i);
                            b.destroy();
                        } else {
                            const p = Matter.Query.collides(bd, levelData.players.map(o => o.body))[0];

                            if (p) {
                                const f = pl => pl.body.id == p.bodyA.id,
                                    target = levelData.players.find(f),
                                    index = levelData.players.findIndex(f);
                                if(b.index != index) {
                                    target.health -= b.emitter.ballistics.damage;

                                    if (target.health <= 0) {
                                        World.remove(world, target.body);
                                        target.destroy();
                                        levelData.players.splice(index, 1);
                                    }
                                    removeBullet(bd, i);
                                }
                            }
                        }
                    });
                };

                function drawGridLines() {
                    p5.push();
                    p5.rectMode(p5.CENTER);
                    p5.fill(level.world.gridColour);
                    const { width, height } = level.world;

                    for (let x = 1; x < width; x += 240) {
                        p5.rect(x, height / 2, 6, height);
                    }
                    for (let y = 1; y < height; y += 240) {
                        p5.rect(width / 2, y, width, 6);
                    }
                    p5.pop();
                };

                p5.keyPressed = function () {
                    keys[p5.keyCode] = true;
                };

                p5.keyReleased = function () {
                    keys[p5.keyCode] = false;
                };

                p5.mouseReleased = function () {
                    levelData.players[playerNum].state.fired = 0;
                };

                p5.mousePressed = function () {
                    if (p5.mouseButton == p5.RIGHT) {
                        levelData.players[playerNum].inventory.activeItem.activeFireModeIndex++;
                    }
                };

                function playerMove() {
                    const w = !!keys[83],
                        a = !!keys[65],
                        s = !!keys[87],
                        d = !!keys[68],
                        player = levelData.players[playerNum].body;

                    Body.applyForce(player, { x: player.position.x, y: player.position.y }, {
                        x: +(a ^ d) && (dt * ((w ^ s) ? Math.SQRT1_2 : 1) * [-1, 1][+d] * (player.circleRadius / 6 - 2)),
                        y: +(w ^ s) && (dt * ((a ^ d) ? Math.SQRT1_2 : 1) * [-1, 1][+w] * (player.circleRadius / 6 - 2))
                    });
                };

                function addToWorld() {
                    /**
                     * @param {number} x
                     * @param {number} y
                     * @param {number} w
                     * @param {number} h
                     * @returns {obstacle}
                     */
                    function makeBound(x, y, w, h) {
                        return new obstacle(Bodies.rectangle(x, y, w, h, { isStatic: true }), 0, images.blank, { width: 1, height: 1 }, "#FFFFFF", 1, { x: 0, y: 0, angle: 0 }, p5.CENTER);
                    }

                    const w = level.world.width,
                        h = level.world.height;

                    levelData.obstacles.concat(levelData.players,
                        ...[
                            [-100, h / 2, 200, h],
                            [w + 100, h / 2, 200, h],
                            [w / 2, -100, w, 200],
                            [w / 2, h + 100, w, 200]
                        ].map(v => makeBound(...v))
                    ).forEach(ob => void World.add(world, ob.body));
                };

                p5.draw = function () {
                    const now = Date.now();

                    dt = 0.03 * (now - lastTime);
                    p5.clear();

                    const p = levelData.players[playerNum],
                        b = p.body,
                        i = p.inventory.activeItem,
                        ip = i.proto;

                    p5.textFont(fonts.sourceSansPro, 60);
                    p5.camera(Math.round(b.position.x), Math.round(b.position.y), p.view - p5.width / 2, Math.round(b.position.x), Math.round(b.position.y), 0);
                    p5.noStroke();
                    p5.rectMode(p5.CORNER);
                    p5.fill(level.world.colour);
                    p5.rect(0, 0, level.world.width, level.world.height);
                    p5.imageMode(p5.CENTER);

                    drawGridLines();
                    drawPlayerShadows();
                    drawShadows(0);
                    drawShadows(1);
                    drawObjects(0);
                    drawBullets();
                    drawPlayers();
                    drawObjects(1);
                    drawRoofs(0);
                    playerMove();

                    p.state.shooting = false;

                    const fire = i.activeFireMode,
                        burst = fire.startsWith("burst-");

                        if (p5.mouseIsPressed
                            && p5.mouseButton == p5.LEFT
                            &&
                            ((burst && !p.state.fired)
                                ? (burst && now - p.state.lastBurst > ip.burstProps.burstDelay)
                                : (p.state.fired < ({ automatic: Infinity, semi: 1 }[fire] ?? +fire.replace("burst-", "")))
    
                                && (now - p.state.lastShot) > (burst ? (ip.burstProps.shotDelay ?? ip.delay) : ip.delay)
                            )
                        ) {
                            p.state.shooting = true;
                            p.state.lastShot = now;
                            if (!p.state.fired && burst) { p.state.lastBurst = now; }
                            p.state.fired++;
    
                            const a = ip.accuracy.default + (b.velocity.x * b.velocity.y && ip.accuracy.moving),
                                start = { x: b.position.x + Math.cos(p.angle - p5.HALF_PI) * ip.ballistics.velocity * dt * 1.5, y: b.position.y + Math.sin(p.angle - p5.HALF_PI) * ip.ballistics.velocity * dt * 1.5},
                                dev = p.angle + p5.random(-a, a),
                                body = Bodies.rectangle(start.x, start.y, 10, ip.ballistics.velocity * dt * 6, { isStatic: false, friction: 1, restitution: 0, density: 1, angle: dev, isSensor: true });
    
                            bullets.push(new bullet(body, p, ip, dev, start, playerNum));
                        }


                    if (p5.mouseX != p5.pmouseX || p5.mouseY != p5.pmouseY) {
                        p.angle = Math.PI / 2 + Math.atan2(p5.mouseY - p5.height / 2, p5.mouseX - p5.width / 2);
                    }

                    if (gamespace.settings.debug) {
                        const col = Matter.Query.collides(b, levelData.obstacles.map(o => o.body))[0];

                        if (col) {
                            p5.fill("#00880080");
                            p5.ellipse(col.bodyA.position.x, col.bodyA.position.y, 100, 100);
                            p5.ellipse(col.bodyB.position.x, col.bodyB.position.y, 100, 100);
                        }
                    }
                    lastTime = Date.now();
                };
            };

            new p5(s);
        }
    };
    return level;
})();

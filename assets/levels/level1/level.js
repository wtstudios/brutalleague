export const level = {
    name: "Desert Takedown",
    description: "",
    world: {
        width: 4000,
        height: 3500,
        colour: "#a97f42",
        gridColour: "rgb(0, 0, 0, 30)"
    },
    initializer: () => {
        let dt = 1,
            lastTime = Date.now();

        /**
         *
         * @param {import("p5") & { drawPlayers(): void; drawObjects(layer: number): void; drawGridLines(): void; playerMove(): void; addToWorld(l: number): void; }} p5
         */
        const s = p5 => {
            let playerNum = 0;

            const Engine = Matter.Engine,
                World = Matter.World,
                Bodies = Matter.Bodies,
                Body = Matter.Body,
                playerSize = 40,
                engine = Engine.create(void 0, {
                    gravity: {
                        y: 0 // For some reason, this doesn't work
                    }
                }),
                world = engine.world,
                /**
                 * @type {Matter.Body[]}
                 */
                players = [],
                /**
                 * @type {{ angle: number; colour1: `#${string}` | import("p5").Color; colour2: `#${string}` | import("p5").Color; highlightcolour: `#${string}` | import("p5").Color; loadout: unknown[]; health: number; }[]}
                 */
                playerDetails = [],
                /**
                 * @type {Matter.Body[][]}
                 */
                objects = [[], []],
                /**
                 * @type {{ image: import("p5").Image; imageWidth: number; imageHeight: number; tint: `#${string}`; above: boolean; xOffset: number; yOffset: number; imageMode: import("p5").IMAGE_MODE; roof?: import("p5").Image; roofWidth?: number; roofHeight?: number; }[][]}
                 */
                objectDetails = [[], []],
                /**
                * @type {Matter.Body[][]}
                */
                bullets = [],
                bulletDetails = [],
                /**
                 * @type {{ [key: string]: import("p5").Image  }}
                 */
                images = {
                    blank: p5.loadImage("./assets/misc/blank.png"),
                    container: p5.loadImage("./assets/obstacles/container2.png"),
                    concreteWall: p5.loadImage("./assets/obstacles/concretewall2.png"),
                    tree: p5.loadImage("./assets/obstacles/tree2.png"),
                    bush: p5.loadImage("./assets/obstacles/tree3.png"),
                    rock: p5.loadImage("./assets/obstacles/rock.png"),
                    blackSquare: p5.loadImage("./assets/misc/blacksquare.png"),
                    house1: p5.loadImage("./assets/buildings/house1.png"),
                    roof1: p5.loadImage("./assets/buildings/roof1.png"),
                    pallet: p5.loadImage("./assets/obstacles/palette.png"),
                    muzzleflash: p5.loadImage("./assets/misc/muzzleflash.svg"),
                    drawer1: p5.loadImage("./assets/obstacles/drawer1.png"),
                    house2: p5.loadImage("./assets/buildings/house2.png"),
                    roof2: p5.loadImage("./assets/buildings/roof2.png"),
                    fence1: p5.loadImage("./assets/obstacles/fence1.png"),
                    hut1: p5.loadImage("./assets/buildings/hut1.png"),
                    table1: p5.loadImage("./assets/obstacles/table1.png"),
                    full762: p5.loadImage("./assets/items/ammo/762mm_full.svg"),
                    full556: p5.loadImage("./assets/items/ammo/556mm_full.svg"),
                    full9mm: p5.loadImage("./assets/items/ammo/9mm_full.svg")
                },
                /**
                 * @type {{ [key: string]: import("p5").Font }}
                 */
                fonts = {
                    sourceSansPro: p5.loadFont("assets/fonts/SourceSansPro-Black.ttf")
                },
                /**
                 * @type {boolean[]}
                 */
                keys = [],
                /**
                 * @type {{ [key: string]: { loot: import("p5").Image, held: import("p5").Image, view: number, damage: number[], caliber: string, delay: number, accuracy: number, x: number, y: number, width: number, height: number, lefthand: { x: number, y: number }, righthand: { x: number, y: height } } }}
                 */
                guns = {
                    AUG: {
                        loot: p5.loadImage("./assets/items/firearms/AUG/AUG_loot.svg"),
                        held: p5.loadImage("./assets/items/firearms/AUG/AUG_topdown.svg"),
                        view: 2500,
                        damage: [25, 35],
                        caliber: "5.56mm",
                        delay: 10,
                        accuracy: 1,
                        x: 0,
                        y: -1.5,
                        width: 0.9,
                        height: 4.6,
                        lefthand: {
                            x: -0.15,
                            y: -2,
                        },
                        righthand: {
                            x: 0.2,
                            y: -1,
                        },
                    }
                },
                /**
                 * @type {{ obstacles: { main: Matter.Body, details: { image: import("p5").Image, imageWidth: number, imageHeight: number, tint: `#${string}`, above: boolean, xOffset: number, yOffset: number, imageMode: import("p5").IMAGE_MODE, roof?: import("p5").Image, roofWidth?: number, roofHeight?: number, special?: number; }; }[], players: { x: number, y: number, angle: number, size: number, colour1: `#${string}` | import("p5").Color, colour2: `#${string}` | import("p5").Color, options: { friction: number, restitution: number, inertia?: number, density: number; }, highlightcolour: `#${string}` | import("p5").Color, loadout: (typeof guns)[keyof typeof guns][], selected: number, health: number;  }[] }; }}
                 */
                levelData = {
                    obstacles: [
                        {
                            main: Bodies.fromVertices(2150, 1625, [
                                { x: 0, y: 0 },
                                { x: 1123, y: 0 },
                                { x: 1123, y: 763 },
                                { x: 0, y: 763 },
                            ], { isStatic: true, friction: 1, restitution: 0, density: 5, angle: p5.radians(0) }),
                            details: { image: images.house2, imageWidth: 1175, imageHeight: 817, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER, roof: images.roof2, roofWidth: 1127, roofHeight: 769, roofOpacity: 255, },
                        },
                        {
                            main: Bodies.rectangle(973, 1270, 440, 60, { isStatic: true, friction: 1, restitution: 0, density: 50, chamfer: true }),
                            details: { image: images.fence1, imageWidth: 440, imageHeight: 60, tint: '#90643c', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER, },
                        },
                        {
                            main: Bodies.rectangle(1353, 1270, 440, 60, { isStatic: true, friction: 1, restitution: 0, density: 50, chamfer: true }),
                            details: { image: images.fence1, imageWidth: 440, imageHeight: 60, tint: '#90643c', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER, },
                        },
                        {
                            main: Bodies.rectangle(783, 1460, 440, 60, { isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90), chamfer: true }),
                            details: { image: images.fence1, imageWidth: 440, imageHeight: 60, tint: '#90643c', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER, },
                        },
                    ],
                    players: [
                        {
                            x: 3000,
                            y: 3000,
                            angle: 0,
                            size: playerSize,
                            colour1: '#4b5320',
                            colour2: '#6c782e',
                            options: { friction: 1, restitution: 0, inertia: 0, density: playerSize - 39.99 },
                            highlightcolour: '#7d8a35',
                            loadout: [guns.AUG],
                            selected: 0,
                            health: 100,
                        },
                        {
                            x: 1000,
                            y: 1400,
                            angle: p5.radians(180),
                            size: playerSize,
                            colour1: '#D3D3D3',
                            colour2: '#FFFFFF',
                            options: { friction: 1, restitution: 0, density: playerSize - 39.99 },
                            highlightcolour: '#7d8a35',
                            loadout: [guns.AUG],
                            selected: 0,
                            health: 100,
                        },
                    ]
                },
                debug = false;
            p5.setup = function () {
                function $(e) { return document.getElementById(e); };
                engine.gravity.y = 0;

                //document.addEventListener("contextmenu", e => e.preventDefault());

                p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
                $("defaultCanvas0").style.display = "none";


                const delta = 1000 / 30,
                    subSteps = 3,
                    subDelta = delta / subSteps;

                (function run() {
                    window.requestAnimationFrame(run);
                    for (let i = 0; i < subSteps; i++) {
                        Engine.update(engine, subDelta);
                    }
                })();

                p5.imageMode(p5.CENTER);
                p5.addToWorld(level);
                console.log(playerDetails[0]);
                p5.cursor('crosshair');
                $("defaultCanvas0").style.display = "";
                $("menu-container").remove();
                p5.angleMode(p5.RADIANS);
                window.addEventListener('resize', function () { p5.resizeCanvas(p5.windowWidth, p5.windowHeight); });
                p5.pixelDensity(gamespace.settings.graphicsQuality);
                p5.textAlign(p5.CENTER, p5.CENTER);
            };

            p5.drawPlayers = function () {
                for (let i = 0; i < playerDetails.length; i++) {
                    Matter.Body.setVelocity(players[i], p5.createVector(-players[i].force.x, -players[i].force.y));
                    if (playerDetails[i].health > 0 && p5.dist(players[playerNum].position.x, players[playerNum].position.y, players[i].position.x, players[i].position.y) <= (p5.width + p5.height)) {
                        p5.push();
                        p5.translate(players[i].position.x, players[i].position.y);
                        p5.rotate(playerDetails[i].angle);
                        p5.fill(0);
                        p5.ellipse(playerDetails[i].loadout[playerDetails[i].selected].lefthand.x * players[i].circleRadius, playerDetails[i].loadout[playerDetails[i].selected].lefthand.y * players[i].circleRadius, players[i].circleRadius * 0.8, players[i].circleRadius * 0.8, 50);
                        p5.ellipse(playerDetails[i].loadout[playerDetails[i].selected].righthand.x * players[i].circleRadius, playerDetails[i].loadout[playerDetails[i].selected].righthand.y * players[i].circleRadius, players[i].circleRadius * 0.8, players[i].circleRadius * 0.8, 50);
                        p5.fill('#F8C574');
                        p5.ellipse(playerDetails[i].loadout[playerDetails[i].selected].lefthand.x * players[i].circleRadius, playerDetails[i].loadout[playerDetails[i].selected].lefthand.y * players[i].circleRadius, players[i].circleRadius * 0.55, players[i].circleRadius * 0.55, 50);
                        p5.ellipse(playerDetails[i].loadout[playerDetails[i].selected].righthand.x * players[i].circleRadius, playerDetails[i].loadout[playerDetails[i].selected].righthand.y * players[i].circleRadius, players[i].circleRadius * 0.55, players[i].circleRadius * 0.55, 50);
                        p5.image(playerDetails[i].loadout[playerDetails[i].selected].held, playerDetails[i].loadout[playerDetails[i].selected].x * players[i].circleRadius, playerDetails[i].loadout[playerDetails[i].selected].y * players[i].circleRadius, playerDetails[i].loadout[playerDetails[i].selected].width * players[i].circleRadius, playerDetails[i].loadout[playerDetails[i].selected].height * players[i].circleRadius);
                        p5.fill(0);
                        p5.ellipse(0, 0, players[i].circleRadius * 2, players[i].circleRadius * 2, 70);
                        p5.fill('#F8C574');
                        p5.ellipse(0, 0, players[i].circleRadius * 1.65, players[i].circleRadius * 1.65, 70);
                        if (playerDetails[i].shooting || playerDetails[i].shootTimer <= 4) {
                            p5.image(images.muzzleflash, 0, -(-playerDetails[i].loadout[playerDetails[i].selected].y * players[i].circleRadius + playerDetails[i].loadout[playerDetails[i].selected].height / 2 * players[i].circleRadius) - playerSize / 2, 2 * players[i].circleRadius, 1.5 * players[i].circleRadius);
                        }
                        p5.noTint();
                        if (i != playerNum) {
                            playerDetails[i].angle = p5.radians(90) + p5.atan2(players[playerNum].position.y - players[i].position.y, players[playerNum].position.x - players[i].position.x);
                        }
                        p5.fill(0);
                        p5.rotate(-playerDetails[i].angle);
                        //p5.text(i, 0, -20);
                        p5.pop();
                    }
                    playerDetails[i].shootTimer += 3 * dt;
                }
            };

            p5.drawPlayerShadows = function () {
                for (let i = 0; i < playerDetails.length; i++) {
                    if (playerDetails[i].health > 0 && p5.dist(players[playerNum].position.x, players[playerNum].position.y, players[i].position.x, players[i].position.y) <= (p5.width + p5.height)) {
                        p5.push();
                        p5.translate(players[i].position.x, players[i].position.y);
                        p5.rotate(playerDetails[i].angle);
                        p5.fill(0, 0, 0, 60);
                        p5.tint(0, 0, 0, 60);
                        p5.ellipse(0, 0, players[i].circleRadius * 2.1 + 10, players[i].circleRadius * 2.1 + 10, 70);
                        p5.ellipse(playerDetails[i].loadout[playerDetails[i].selected].lefthand.x * players[i].circleRadius, playerDetails[i].loadout[playerDetails[i].selected].lefthand.y * players[i].circleRadius, players[i].circleRadius + 5, players[i].circleRadius + 5, 50);
                        p5.ellipse(playerDetails[i].loadout[playerDetails[i].selected].righthand.x * players[i].circleRadius, playerDetails[i].loadout[playerDetails[i].selected].righthand.y * players[i].circleRadius, players[i].circleRadius + 5, players[i].circleRadius + 5, 50);
                        p5.image(playerDetails[i].loadout[playerDetails[i].selected].held, playerDetails[i].loadout[playerDetails[i].selected].x * players[i].circleRadius, playerDetails[i].loadout[playerDetails[i].selected].y * players[i].circleRadius - 10, playerDetails[i].loadout[playerDetails[i].selected].width * players[i].circleRadius + 15, playerDetails[i].loadout[playerDetails[i].selected].height * players[i].circleRadius + 10);
                        p5.tint(255);
                        p5.pop();
                    }
                    if (playerDetails[i].health <= 0) {
                        console.log(players);
                        World.remove(world, players[i]);
                        players.splice(i, 1);
                        playerDetails.splice(i, 1);
                        for (let c = 0; c < players.length; c++) {
                            players[c].restitution = c / 1000;
                        }
                    }
                }
            };

            p5.drawObjects = function (layer) {
                for (let i = 0; i < objects[layer].length; i++) {
                    Matter.Body.setVelocity(objects[layer][i], p5.createVector(-objects[layer][i].force.x, -objects[layer][i].force.y));
                    p5.imageMode(objectDetails[layer][i].imageMode);
                    p5.push();
                    p5.translate(objects[layer][i].position.x, objects[layer][i].position.y);
                    p5.rotate(objects[layer][i].angle);
                    p5.rotate(objectDetails[layer][i].angleOffset);
                    p5.translate(objectDetails[layer][i].xOffset, objectDetails[layer][i].yOffset);
                    if (objectDetails[layer][i].image && p5.dist(players[playerNum].position.x, players[playerNum].position.y, objects[layer][i].position.x, objects[layer][i].position.y) <= (p5.width + p5.height)) {
                        p5.tint(objectDetails[layer][i].tint);
                        p5.image(objectDetails[layer][i].image, 0, 0, objectDetails[layer][i].imageWidth, objectDetails[layer][i].imageHeight);
                    }
                    p5.noTint();
                    p5.pop();
                    if (debug == true) {
                        p5.fill('red');
                        p5.beginShape();
                        for (let f = 0; f < objects[layer][i].vertices.length; f++) {
                            p5.vertex(objects[layer][i].vertices[f].x, objects[layer][i].vertices[f].y);
                        }
                        p5.endShape();
                    }
                }
            };

            p5.drawRoofs = function (layer) {
                for (let i = 0; i < objects[layer].length; i++) {
                    p5.imageMode(objectDetails[layer][i].imageMode);
                    p5.push();
                    p5.translate(objects[layer][i].position.x, objects[layer][i].position.y);
                    p5.rotate(objects[layer][i].angle);
                    p5.rotate(objectDetails[layer][i].angleOffset);
                    p5.translate(objectDetails[layer][i].xOffset, objectDetails[layer][i].yOffset);
                    if (objectDetails[layer][i].roof && p5.dist(players[playerNum].position.x, players[playerNum].position.y, objects[layer][i].position.x, objects[layer][i].position.y) <= (p5.width + p5.height)) {
                        if (players[playerNum].position.x + (playerSize * 4) <= objects[layer][i].position.x - objectDetails[layer][i].xOffset - objectDetails[layer][i].roofWidth / 2 || players[playerNum].position.x - (playerSize * 4) >= objects[layer][i].position.x + objectDetails[layer][i].xOffset + objectDetails[layer][i].roofWidth / 2 || players[playerNum].position.y + (playerSize * 4) <= objects[layer][i].position.y - objectDetails[layer][i].yOffset - objectDetails[layer][i].roofHeight / 2 || players[playerNum].position.y - (playerSize * 4) >= objects[layer][i].position.y + objectDetails[layer][i].yOffset + objectDetails[layer][i].roofHeight / 2) {
                            if (objectDetails[layer][i].roofOpacity < 255) {
                                objectDetails[layer][i].roofOpacity += p5.round(30 * dt);
                            }
                            if (playerDetails[playerNum].view != playerDetails[playerNum].loadout[playerDetails[playerNum].selected].view) {
                                playerDetails[playerNum].view += (playerDetails[playerNum].loadout[playerDetails[playerNum].selected].view - playerDetails[playerNum].view) / 4;
                            }
                        }
                        else {
                            if (objectDetails[layer][i].roofOpacity > 0) {
                                objectDetails[layer][i].roofOpacity -= p5.round(30 * dt);
                            }
                            if (playerDetails[playerNum].view != 1700) {
                                playerDetails[playerNum].view -= (playerDetails[playerNum].view - 1700) / 2 * dt;
                            }
                        }
                        p5.tint(255, 255, 255, objectDetails[layer][i].roofOpacity);
                        p5.image(objectDetails[layer][i].roof, 0, 0, objectDetails[layer][i].roofWidth, objectDetails[layer][i].roofHeight);
                    }
                    p5.noTint();
                    p5.pop();
                }
            };

            p5.drawShadows = function (layer) {
                for (let i = 0; i < objects[layer].length; i++) {
                    p5.imageMode(objectDetails[layer][i].imageMode);
                    p5.push();
                    p5.translate(objects[layer][i].position.x + 10, objects[layer][i].position.y + 10);
                    p5.rotate(objects[layer][i].angle);
                    p5.rotate(objectDetails[layer][i].angleOffset);
                    p5.translate(objectDetails[layer][i].xOffset, objectDetails[layer][i].yOffset);
                    if (objectDetails[layer][i].image && !objectDetails[layer][i].roof && p5.dist(players[playerNum].position.x, players[playerNum].position.y, objects[layer][i].position.x, objects[layer][i].position.y) <= (p5.width + p5.height)) {
                        p5.tint(0, 0, 0, 60);
                        p5.image(objectDetails[layer][i].image, 0, 0, objectDetails[layer][i].imageWidth, objectDetails[layer][i].imageHeight);
                        p5.noTint();
                    }
                    p5.noTint();
                    p5.pop();
                }
            };

            p5.drawBullets = function () {
                for (let i = 0; i < bulletDetails.length; i++) {
                    if (p5.dist(bullets[i].position.x, bullets[i].position.y, players[playerNum].position.x, players[playerNum].position.y) <= (p5.width + p5.height)) {
                        p5.push();
                        p5.translate(bullets[i].position.x, bullets[i].position.y);
                        p5.rotate(bullets[i].angle);
                        p5.fill(0, 0, 0, 120);
                        switch (bulletDetails[i].caliber) {
                            case '7.62mm':
                                p5.image(images.full762, 0, 0, 15, 50);
                                break;
                            case '5.56mm':
                                p5.image(images.full556, 0, 0, 15, 50);
                                break;
                            case '9mm':
                                p5.image(images.full9mm, 0, 0, 15, 50);
                                break;
                        }
                        p5.pop();
                    }
                    Matter.Body.setPosition(bullets[i], { x: bullets[i].position.x + p5.cos(bullets[i].angle - p5.radians(90)) * 150 * dt, y: bullets[i].position.y + p5.sin(bullets[i].angle - p5.radians(90)) * 150 * dt });
                    if (Matter.Query.collides(bullets[i], objects[0]).length > 0) {
                        World.remove(world, bullets[i]);
                        bullets.splice(i, 1);
                        bulletDetails.splice(i, 1);
                        console.log('Bullet Absorbed by Object');
                    }
                    else if (Matter.Query.collides(bullets[i], objects[1]).length > 0) {
                        World.remove(world, bullets[i]);
                        bullets.splice(i, 1);
                        bulletDetails.splice(i, 1);
                        console.log('Bullet Absorbed by Object');
                    }
                    else if (Matter.Query.collides(bullets[i], players).length > 0 && Matter.Query.collides(bullets[i], players)[0].bodyA.restitution * 1000 != bulletDetails[i].emitter) {
                        playerDetails[Matter.Query.collides(bullets[i], players)[0].bodyA.restitution * 1000].health -= bulletDetails[i].damage;
                        console.log(Matter.Query.collides(bullets[i], players)[0].bodyA.restitution * 1000);
                        World.remove(world, bullets[i]);
                        bullets.splice(i, 1);
                        bulletDetails.splice(i, 1);
                        console.log('Bullet Absorbed by Player');
                    }
                }
            };
            p5.drawGridLines = function () {
                p5.rectMode(p5.CENTER);
                p5.fill(level.world.gridColour);
                for (let x = 1; x < p5.ceil(level.world.width / (playerSize * 6)); x++) {
                    p5.rect(x * playerSize * 6, level.world.height / 2, 6, level.world.height);
                }
                for (let y = 1; y < p5.ceil(level.world.height / (playerSize * 6)); y++) {
                    p5.rect(level.world.width / 2, y * playerSize * 6, level.world.width, 6);
                }
            };

            p5.keyPressed = function () { keys[p5.keyCode] = true; if (p5.key.toLowerCase() == 'q') { if (playerNum < players.length - 1) { playerNum++; } else { playerNum = 0; } } };

            p5.keyReleased = function () { keys[p5.keyCode] = false; };

            p5.playerMove = function () {
                const w = keys[83],
                    a = keys[65],
                    s = keys[87],
                    d = keys[68],
                    player = players[playerNum];
                Body.applyForce(player, { x: player.position.x, y: player.position.y }, { x: (a ^ d) ? ((w ^ s) ? Math.SQRT1_2 * dt : 1 * dt) * (d ? players[playerNum].circleRadius / 6 - 2 : -players[playerNum].circleRadius / 6 + 2) : 0, y: (w ^ s) ? ((a ^ d) ? Math.SQRT1_2 * dt : 1 * dt) * (w ? players[playerNum].circleRadius / 6 - 2 : -players[playerNum].circleRadius / 6 + 2) : 0 });
            };

            p5.addToWorld = function (l) {
                for (let i = 0; i < levelData.obstacles.length; i++) {
                    switch (levelData.obstacles[i].details.above) {
                        case false:
                            objectDetails[0].push((levelData.obstacles[i].details));
                            objects[0].push((levelData.obstacles[i].main));
                            //console.log(objects[0][objects[0].length - 1]);
                            break;
                        case true:
                            objectDetails[1].push((levelData.obstacles[i].details));
                            objects[1].push((levelData.obstacles[i].main));
                            //console.log(objects[1][objects[1].length - 1]);
                            break;
                    }
                }
                for (let b = 0; b < levelData.players.length; b++) {
                    players[b] = Bodies.circle(levelData.players[b].x, levelData.players[b].y, levelData.players[b].size, levelData.players[b].options);
                    playerDetails[b] = { angle: levelData.players[b].angle, colour1: levelData.players[b].colour1, colour2: levelData.players[b].colour2, highlightcolour: levelData.players[b].highlightcolour, loadout: levelData.players[b].loadout, health: levelData.players[b].health, selected: levelData.players[b].selected, shootTimer: 100, shooting: false, view: null, };
                    playerDetails[b].view = playerDetails[b].loadout[playerDetails[playerNum].selected].view;
                    players[b].restitution = b / 1000;
                }
                console.log(players);
                World.add(world, players);

                objects[0].push(Bodies.rectangle(-50, level.world.height / 2, 100, level.world.height, { isStatic: true }));
                objectDetails[0].push({ image: images.blank, imageWidth: 1, imageHeight: 1, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER, });
                objects[0].push(Bodies.rectangle(level.world.width + 50, level.world.height / 2, 100, level.world.height, { isStatic: true }));
                objectDetails[0].push({ image: images.blank, imageWidth: 1, imageHeight: 1, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER, });
                objects[0].push(Bodies.rectangle(level.world.width / 2, -50, level.world.width, 100, { isStatic: true }));
                objectDetails[0].push({ image: images.blank, imageWidth: 1, imageHeight: 1, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER, });
                objects[0].push(Bodies.rectangle(level.world.width / 2, level.world.height + 50, level.world.width, 100, { isStatic: true }));
                objectDetails[0].push({ image: images.blank, imageWidth: 1, imageHeight: 1, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER, });

                World.add(world, objects[0]);
                World.add(world, objects[1]);

                for (let c = 0; c < objects[0].length; c++) {
                    objects[0][c].restitution = c / 1000;
                }
                for (let d = 0; d < objects[1].length; d++) {
                    objects[1][d].restitution = d / 1000;
                }
            };

            p5.draw = function () {
                dt = 0.03 * (Date.now() - lastTime);
                p5.clear();
                try {
                    p5.textFont(fonts.sourceSansPro, 60);
                    p5.angleMode(p5.RADIANS);
                    // p5.camera(players[playerNum].position.x + p5.sin(p5.frameCount * 10) * 5, players[playerNum].position.y - p5.sin(p5.frameCount - 90 * 10) * 5, playerDetails[playerNum].view - p5.width / 2, players[playerNum].position.x + p5.sin(p5.frameCount * 10) * 5, players[playerNum].position.y - p5.sin(p5.frameCount - 90 * 10) * 5, 0);
                    p5.camera(p5.round(players[playerNum].position.x), p5.round(players[playerNum].position.y), playerDetails[playerNum].view - p5.width / 2, p5.round(players[playerNum].position.x), p5.round(players[playerNum].position.y), 0);
                    p5.noStroke();
                    p5.rectMode(p5.CORNER);
                    p5.fill(level.world.colour);
                    p5.rect(0, 0, level.world.width, level.world.height);
                    p5.imageMode(p5.CENTER);
                    p5.drawGridLines();
                    p5.drawPlayerShadows();
                    p5.drawShadows(0);
                    p5.drawShadows(1);
                    p5.drawObjects(0);
                    p5.drawBullets();
                    p5.drawPlayers();
                    p5.drawObjects(1);
                    p5.drawRoofs(0);
                    p5.drawRoofs(1);
                    p5.angleMode(p5.DEGREES);
                    p5.playerMove();
                    playerDetails[playerNum].shooting = false;
                    if (p5.mouseIsPressed && playerDetails[playerNum].shootTimer > playerDetails[playerNum].loadout[playerDetails[playerNum].selected].delay) {
                        playerDetails[playerNum].shooting = true;
                        playerDetails[playerNum].shootTimer = 0;
                        bullets.push(Bodies.rectangle(players[playerNum].position.x, players[playerNum].position.y, 10, 40, { angle: playerDetails[playerNum].angle + p5.random(p5.radians(-playerDetails[playerNum].loadout[playerDetails[playerNum].selected].accuracy), p5.radians(playerDetails[playerNum].loadout[playerDetails[playerNum].selected].accuracy)) }));
                        bulletDetails.push(
                            {
                                caliber: playerDetails[playerNum].loadout[playerDetails[playerNum].selected].caliber,
                                damage: p5.round(p5.random(playerDetails[playerNum].loadout[playerDetails[playerNum].selected].damage[0], playerDetails[playerNum].loadout[playerDetails[playerNum].selected].damage[1])),
                                emitter: playerNum,
                            }
                        );
                    }
                    if (p5.mouseX != p5.pmouseX || p5.mouseY != p5.pmouseY) {
                        playerDetails[playerNum].angle = p5.radians(90 + p5.atan2(p5.mouseY - p5.height / 2, p5.mouseX - p5.width / 2));
                    }
                    //playerDetails[playerNum].angle = p5.radians(p5.frameCount * 122);
                    if (Matter.Query.collides(players[0], objects[0]).length > 0) {
                        if (debug) {
                            p5.fill('green');
                            p5.ellipse(Matter.Query.collides(players[0], objects[0])[0].bodyA.position.x, Matter.Query.collides(players[0], objects[0])[0].bodyA.position.y, 100, 100);
                            p5.ellipse(Matter.Query.collides(players[0], objects[0])[0].bodyB.position.x, Matter.Query.collides(players[0], objects[0])[0].bodyB.position.y, 100, 100);
                            console.log('Colliding with body #' + Matter.Query.collides(players[0], objects[0])[0].bodyA.restitution * 1000);
                        }
                    }
                    if (Matter.Query.collides(players[0], objects[1]).length > 0) {
                        if (debug) {
                            p5.fill('green');
                            p5.ellipse(Matter.Query.collides(players[0], objects[1])[0].bodyA.position.x, Matter.Query.collides(players[0], objects[1])[0].bodyA.position.y, 100, 100);
                            p5.ellipse(Matter.Query.collides(players[0], objects[1])[0].bodyB.position.x, Matter.Query.collides(players[0], objects[1])[0].bodyB.position.y, 100, 100);
                            console.log('Colliding with body #' + Matter.Query.collides(players[0], objects[1])[0].bodyA.restitution * 1000);
                        }
                    }
                } catch (e) {
                    console.error(`Draw callback at ${Date.now()} failed with error ${e}`);
                }
                lastTime = Date.now();
            };
        };

        new p5(s);
    }
};
export const level = await (async () => {
    const j = await fetch("assets/levels/level2/data.json"),
        json = await j.json();


    const levelData = parseLevelData(json),
        /**
         * @type {{ [key: string]: import("p5").Image }}
         */
        images = {
            muzzleFlash: loadImg("assets/misc/muzzleflash.svg"),
            blank: loadImg("assets/misc/blank.png"),
            "caliber_5.56x45mm": loadImg("assets/items/ammo/556mm_projectile.svg"),
            "caliber_7.62x39mm": loadImg("assets/items/ammo/762mm_projectile.svg"),
            "caliber_9x19mm": loadImg("assets/items/ammo/9mm_full.svg"),
            "caliber_12G": loadImg("assets/items/ammo/12G_full.svg"),
            "caliber_5.45x39mm": loadImg("assets/items/ammo/556mm_projectile.svg"),
            "caliber_5.7x28mm": loadImg("assets/items/ammo/9mm_full.svg"),
            "caliber_shrapnel1": loadImg("assets/items/ammo/shrapnel1_projectile.svg"),
            "caliber_shrapnel2": loadImg("assets/items/ammo/shrapnel2_projectile.svg"),
            "caliber_melee": loadImg("assets/misc/blank.png"),
            "cartridge_rifle": loadImg("assets/items/ammo/cartridge.svg"),
            "cartridge_shotgun": loadImg("assets/items/ammo/shell.svg"),
            "cartridge_pistol": loadImg("assets/items/ammo/casing.svg"),
            "cartridge_melee": loadImg("assets/misc/blank.png"),
            bullettrail: loadImg("assets/misc/trail.svg"),
            particle1: loadImg("assets/obstacles/particle1.png"),
            smokeparticle: loadImg("assets/obstacles/smokeparticle.svg")
        },
        sounds = {
            impact: loadSound("assets/sounds/impact.mp3")
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
    let sightArray = [],
    windowDimensions;

    const level = {
        name: "Favela",
        description: "",
        world: {
            width: 4330,
            height: 4010,
            colour: "#cdac60",
            gridColour: "#0000001E",
        },
        initializer: () => {
            let dt = 1,
                lastTime = Date.now();

            /**
             * @param {import("p5")} p5
             */
            const s = p5 => {
                let playerNum = 0,
                    gameCamera = {
                        x: 0,
                        y: 0,
                        z: 0,
                        xFocus: 0,
                        yFocus: 0,
                        zFocus: 0,
                    };
                const Engine = Matter.Engine,
                    World = Matter.World,
                    Bodies = Matter.Bodies,
                    Body = Matter.Body,
                    engine = Engine.create(void 0, {
                        gravity: {
                            y: 0 // For some reason, this doesn"t work
                        }
                    }),
                    world = engine.world;
                    const runner14832948 = Matter.Runner.run(engine);

                let shouldCall = 2;
                let levelStarted = false;
                let gunChosenData = {
                    main: {
                        currentChosen: 1
                    },
                    secondary: {
                        currentChosen: 1
                    }
                }
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
                    document.addEventListener("visibilitychange", (event) => {
                        if (document.visibilityState == "visible") {
                            shouldCall++;
                        } else {
                            shouldCall = 0;
                        }
                    });
                    p5.imageMode(p5.CENTER);
                    p5.angleMode(p5.RADIANS);

                    addToWorld();
                    p5.cursor("crosshair");
                    $("defaultCanvas0").style.display = "block";
                    $("menu-container").remove();
                    window.addEventListener(
                        "resize", 
                        function () { 
                            if(!levelStarted) {
                                p5.noLoop();
                            }
                            p5.resizeCanvas(p5.windowWidth, p5.windowHeight); 
                            windowDimensions = (p5.width + p5.height) / 2.5;
                    
                            $("weapon-slot-1").style.width = windowDimensions / 3.2 + "px";
                            $("weapon-slot-1").style.bottom = windowDimensions / 30 + "px";
                            $("weapon-slot-1").style.right = windowDimensions / 30 + "px";
                            $("weapon-slot-1").style.borderRadius = windowDimensions / 50 + "px";

                            $("weapon-slot-2").style.width = windowDimensions / 6.8 + "px";
                            $("weapon-slot-2").style.bottom = windowDimensions / 5 + "px";
                            $("weapon-slot-2").style.right = windowDimensions / 30 + "px";
                            $("weapon-slot-2").style.borderRadius = windowDimensions / 50 + "px";

                            $("weapon-name-background").style.width = windowDimensions / 6.8 + "px";
                            $("weapon-name-background").style.bottom = windowDimensions / 5 + "px";
                            $("weapon-name-background").style.right = windowDimensions / 5.05 + "px";
                            $("weapon-name-background").style.borderRadius = windowDimensions / 50 + "px";
                                    
                            $("weapon-name").style.width = windowDimensions / 6.8 + "px";
                            $("weapon-name").style.right = windowDimensions / 4.9 + "px";
                            $("weapon-name").style.bottom = windowDimensions / 5 + "px";
                            $("weapon-name").style.fontSize = windowDimensions / 40 + "px";

                            $("healthbar-outline").style.width = windowDimensions / 1.9 + "px";
                            $("healthbar-outline").style.height = windowDimensions / 14.2 + "px";
                            $("healthbar-outline").style.left = windowDimensions / 40 + "px";
                            $("healthbar-outline").style.bottom = windowDimensions / 30 + "px";
                            $("healthbar-outline").style.borderRadius = windowDimensions / 50 + "px";

                            $("healthbar").style.width = (levelData.players[playerNum].health / 100) * (windowDimensions / 1.9) + "px";
                            $("healthbar").style.height = windowDimensions / 15.5 + "px";
                            $("healthbar").style.left = windowDimensions / 40 + "px";
                            $("healthbar").style.bottom = windowDimensions / 27.7 + "px";
                            $("healthbar").style.borderRadius = windowDimensions / 45 + "px";

                            $("ammocount-background").style.width = windowDimensions / 3.8 + "px";
                            $("ammocount-background").style.height = windowDimensions / 14.2 + "px";
                            $("ammocount-background").style.left = "calc(" + windowDimensions / 40 + "px + " + windowDimensions / 7.6 + "px)";
                            $("ammocount-background").style.bottom = windowDimensions / 8 + "px";
                            $("ammocount-background").style.borderRadius = windowDimensions / 45 + "px";

                            $("ammocount").style.width = windowDimensions / 3.8 + "px";
                            $("ammocount").style.height = windowDimensions / 14.2 + "px";
                            $("ammocount").style.left = "calc(" + windowDimensions / 40 + "px + " + windowDimensions / 7.6 + "px)";
                            $("ammocount").style.bottom = windowDimensions / 11.5 + "px";
                            $("ammocount").style.borderRadius = windowDimensions / 45 + "px";
                            $("ammocount").style.fontSize = windowDimensions / 35 + "px";

                            $("reload-progress").style.width = (levelData.players[playerNum].state.reloadProgress / 100) * (windowDimensions / 7) + "px";
                            $("reload-progress").style.height = windowDimensions / 25 + "px";
                            $("reload-progress").style.bottom = "calc(30% - " + windowDimensions / 50 + "px)"; 
                            $("reload-progress").style.left = "calc(50% - " + windowDimensions / 14.2 + "px)"; 
                            $("reload-progress").style.borderRadius = windowDimensions / 100 + "px";

                            $("reload-progress-outline").style.width = (windowDimensions / 6.8) + "px";
                            $("reload-progress-outline").style.height = windowDimensions / 25 + "px";
                            $("reload-progress-outline").style.bottom = "calc(30% - " + windowDimensions / 50 + "px)"; 
                            $("reload-progress-outline").style.left = "calc(50% - " + windowDimensions / 13.6 + "px)"; 
                            $("reload-progress-outline").style.borderRadius = windowDimensions / 100 + "px";
                    
                        }
                    );
                    p5.pixelDensity(gamespace.settings.graphicsQuality);
                    p5.textAlign(p5.CENTER, p5.CENTER);
                    levelData.players[playerNum].view = 4000;
                    gameCamera.x = level.world.width / 2, gameCamera.y = level.world.height / 2, gameCamera.xFocus = level.world.width / 2, gameCamera.yFocus = level.world.height / 2;
                    windowDimensions = (p5.width + p5.height) / 2.5;
                    document.body.appendChild(
                        makeElement(
                            "div",
                            {
                                id: "ui-container"
                            },
                            [
                                makeElement(
                                    "img",
                                    {
                                        id: "weapon-slot-1",
                                        src: levelData.players[playerNum].inventory.guns[0].proto.images.loot,
                                    }
                                ),
                                makeElement(
                                    "img",
                                    {
                                        id: "weapon-slot-2",
                                        src: levelData.players[playerNum].inventory.guns[1].proto.images.loot,
                                    },
                                    void 0,
                                    {
                                        click: function (e) {
                                            if (!e.button) {
                                                const absMod = (v, m) => (m + (v % m)) % m;
                                                levelData.players[playerNum].inventory.activeIndex = absMod((levelData.players[playerNum].inventory.activeIndex - 1), levelData.players[playerNum].inventory.guns.length);
                                                $("weapon-slot-1").src = levelData.players[playerNum].inventory.activeItem.proto.images.loot;
                                                $("weapon-slot-2").src = levelData.players[playerNum].inventory.guns[ absMod((levelData.players[playerNum].inventory.activeIndex - 1), levelData.players[playerNum].inventory.guns.length)].proto.images.loot;
                                                $("weapon-name").textContent = levelData.players[playerNum].inventory.activeItem.proto.name;
                                                $("ammocount").textContent = shouldUseInfinity(levelData.players[playerNum].inventory.activeItem.proto.mag) + " | " + shouldUseInfinity(levelData.players[playerNum].inventory.activeItem.proto.magSize);
                                            }
                                        }
                                    }
                                ),
                                makeElement(
                                    "img",
                                    {
                                        id: "weapon-name-background",
                                        src: "assets/misc/blankweapon.png",
                                    }
                                ),
                                makeElement(
                                    "p",
                                    {
                                        id: "weapon-name",
                                        textContent: levelData.players[playerNum].inventory.activeItem.proto.name
                                    }
                                ),
                                makeElement(
                                    "img",
                                    {
                                        id: "healthbar",
                                        src: "assets/misc/blank.png"
                                    }
                                ),
                                makeElement(
                                    "img",
                                    {
                                        id: "healthbar-outline",
                                        src: "assets/misc/blankweapon.png"
                                    }
                                ),
                                makeElement(
                                    "img",
                                    {
                                        id: "ammocount-background",
                                        src: "assets/misc/blankweapon.png"
                                    }
                                ),
                                makeElement(
                                    "img",
                                    {
                                        id: "reload-progress",
                                        src: "assets/misc/blankweapon.png"
                                    }
                                ),
                                makeElement(
                                    "img",
                                    {
                                        id: "reload-progress-outline",
                                        src: "assets/misc/blankweapon.png"
                                    }
                                ),
                                makeElement(
                                    "p",
                                    {
                                        id: "ammocount",
                                        textContent: shouldUseInfinity(levelData.players[playerNum].inventory.activeItem.proto.mag) + " | " + shouldUseInfinity(levelData.players[playerNum].inventory.activeItem.proto.magSize)
                                    }
                                )
                            ]
                        )
                    );
                    
                    $("weapon-slot-1").style.width = windowDimensions / 3.2 + "px";
                    $("weapon-slot-1").style.bottom = windowDimensions / 30 + "px";
                    $("weapon-slot-1").style.right = windowDimensions / 30 + "px";
                    $("weapon-slot-1").style.borderRadius = windowDimensions / 50 + "px";

                    $("weapon-slot-2").style.width = windowDimensions / 6.8 + "px";
                    $("weapon-slot-2").style.bottom = windowDimensions / 5 + "px";
                    $("weapon-slot-2").style.right = windowDimensions / 30 + "px";
                    $("weapon-slot-2").style.borderRadius = windowDimensions / 50 + "px";

                    $("weapon-name-background").style.width = windowDimensions / 6.8 + "px";
                    $("weapon-name-background").style.bottom = windowDimensions / 5 + "px";
                    $("weapon-name-background").style.right = windowDimensions / 5.05 + "px";
                    $("weapon-name-background").style.borderRadius = windowDimensions / 50 + "px";
                            
                    $("weapon-name").style.width = windowDimensions / 6.8 + "px";
                    $("weapon-name").style.right = windowDimensions / 4.9 + "px";
                    $("weapon-name").style.bottom = windowDimensions / 5.05 + "px";
                    $("weapon-name").style.fontSize = windowDimensions / 40 + "px";

                    $("healthbar-outline").style.width = windowDimensions / 1.9 + "px";
                    $("healthbar-outline").style.height = windowDimensions / 14.2 + "px";
                    $("healthbar-outline").style.left = windowDimensions / 40 + "px";
                    $("healthbar-outline").style.bottom = windowDimensions / 30 + "px";
                    $("healthbar-outline").style.borderRadius = windowDimensions / 50 + "px";

                    $("healthbar").style.width = (levelData.players[playerNum].health / 100) * (windowDimensions / 1.9) + "px";
                    $("healthbar").style.height = windowDimensions / 15.5 + "px";
                    $("healthbar").style.left = windowDimensions / 40 + "px";
                    $("healthbar").style.bottom = windowDimensions / 27.7 + "px";
                    $("healthbar").style.borderRadius = windowDimensions / 45 + "px";

                    $("ammocount-background").style.width = windowDimensions / 3.8 + "px";
                    $("ammocount-background").style.height = windowDimensions / 14.2 + "px";
                    $("ammocount-background").style.left = "calc(" + windowDimensions / 40 + "px + " + windowDimensions / 7.6 + "px)";
                    $("ammocount-background").style.bottom = windowDimensions / 8 + "px";
                    $("ammocount-background").style.borderRadius = windowDimensions / 45 + "px";

                    $("ammocount").style.width = windowDimensions / 3.8 + "px";
                    $("ammocount").style.height = windowDimensions / 14.2 + "px";
                    $("ammocount").style.left = "calc(" + windowDimensions / 40 + "px + " + windowDimensions / 7.6 + "px)";
                    $("ammocount").style.bottom = windowDimensions / 11.5 + "px";
                    $("ammocount").style.borderRadius = windowDimensions / 45 + "px";
                    $("ammocount").style.fontSize = windowDimensions / 35 + "px";

                    $("reload-progress").style.width = (levelData.players[playerNum].state.reloadProgress / 100) * (windowDimensions / 7) + "px";
                    $("reload-progress").style.height = windowDimensions / 25 + "px";
                    $("reload-progress").style.bottom = "calc(30% - " + windowDimensions / 50 + "px)"; 
                    $("reload-progress").style.left = "calc(50% - " + windowDimensions / 14.2 + "px)"; 
                    $("reload-progress").style.borderRadius = windowDimensions / 100 + "px";
                    $("reload-progress").style.display = "none";

                    $("reload-progress-outline").style.width = (windowDimensions / 6.8) + "px";
                    $("reload-progress-outline").style.height = windowDimensions / 25 + "px";
                    $("reload-progress-outline").style.bottom = "calc(30% - " + windowDimensions / 50 + "px)"; 
                    $("reload-progress-outline").style.left = "calc(50% - " + windowDimensions / 13.6 + "px)"; 
                    $("reload-progress-outline").style.borderRadius = windowDimensions / 100 + "px";
                    $("reload-progress-outline").style.display = "none";

                    document.body.appendChild(
                        makeElement(
                            "div",
                            {
                                id: "deathscreen-container"
                            },
                            [
                                makeElement(
                                    "img",
                                    {
                                        id: "death-overlay",
                                        src: "assets/misc/blanksquare.png"
                                    }
                                ),
                                makeElement(
                                    "p",
                                    {
                                        id: "you-died-text",
                                        textContent: "YOU DIED"
                                    }
                                ),
                                makeElement(
                                    "p",
                                    {
                                        id: "killer-text",
                                        textContent: "You were killed by <name> with <weapon>"
                                    }
                                ),
                                makeElement(
                                    "p",
                                    {
                                        id: "xp-loss",
                                        textContent: "-25 XP"
                                    }
                                ),
                                makeElement(
                                    "button",
                                    {
                                        id: "respawn-button",
                                        textContent: "RESPAWN"
                                    },
                                    void 0,
                                    {
                                        click: function (e) {
                                            if (!e.button) {
                                                levelData.players[playerNum].health = 100;
                                                Matter.Body.setPosition(levelData.players[playerNum].body, { x: json.players[playerNum].x, y: json.players[playerNum].y });
                                                $("deathscreen-container").style.display = "none";
                                                $("healthbar").style.display = "block";
                                                $("healthbar").style.width = (levelData.players[playerNum].health / 100) * (windowDimensions / 1.9) + "px";
                                                levelData.players[playerNum].view = 1700;
                                                levelData.players[playerNum].inventory.guns[0].proto.mag = levelData.players[playerNum].inventory.guns[0].proto.magSize;
                                                levelData.players[playerNum].inventory.guns[1].proto.mag = levelData.players[playerNum].inventory.guns[1].proto.magSize;
                                                $("ammocount").textContent = shouldUseInfinity(levelData.players[playerNum].inventory.activeItem.proto.mag) + " | " + shouldUseInfinity(levelData.players[playerNum].inventory.activeItem.proto.magSize);
                                                p5.loop();
                                            }
                                        }
                                    }
                                ),
                            ]
                        )
                    );
                    $("deathscreen-container").style.display = "none";
                    createSelectionUI("-notrussian-", "-secondary-", p5);
                };

                function createSelectionUI(mainTag, secondaryTag, peefive) {
                    const absMod = (v, m) => (m + (v % m)) % m;
                    peefive.noLoop();
                    document.body.appendChild(
                        makeElement(
                            "div",
                            {
                                id: "weapon-selection-container"
                            },
                            [
                                makeElement(
                                    "img",
                                    {
                                        id: "selection-overlay",
                                        src: "assets/misc/blanksquare.png"
                                    }
                                ),
                                makeElement(
                                    "p",
                                    {
                                        id: "select-weapons-text",
                                        textContent: "Select your loadout"
                                    }
                                ),
                                makeElement(
                                    "button",
                                    {
                                        id: "start-level",
                                        textContent: "START"
                                    },
                                    void 0,
                                    {
                                        click: function() {
                                            levelStarted = true;
                                            peefive.loop();
                                            $("weapon-selection-container").style.display = "none";
                                        }
                                    }
                                ),
                            ]
                        )
                    );
                    let elementsCreatedMain = 0;
                    for(let q = 0; q < gamespace.guns.length; q++) {
                        if(gamespace.guns[q].tags.includes(mainTag)) {
                            elementsCreatedMain++;
                            const id = "main-weapon-selector-backing-" + elementsCreatedMain,
                            frozenElementsCreated = elementsCreatedMain;
                            $("weapon-selection-container").append(
                                makeElement(
                                    "img",
                                    {
                                        id: id,
                                        src: gamespace.guns[q].images.loot,
                                        className: "selection-backing",
                                        top: 100 * elementsCreatedMain + 50 + "px"
                                    },
                                    void 0,
                                    {
                                        click: function() {
                                            console.log(frozenElementsCreated);
                                            levelData.players[playerNum].inventory.guns[0] = new gun(gamespace.guns[q]);
                                            levelData.players[playerNum].inventory.activeIndex = 0;
                                            $("weapon-slot-1").src = gamespace.guns[q].images.loot;
                                            $("weapon-name").textContent = levelData.players[playerNum].inventory.guns[0].proto.name;
                                            $("ammocount").textContent = shouldUseInfinity(levelData.players[playerNum].inventory.guns[0].proto.mag) + " | " + shouldUseInfinity(levelData.players[playerNum].inventory.guns[0].proto.magSize);                 
                                            $("main-weapon-selector-backing-" + gunChosenData.main.currentChosen).style.backgroundColor = "rgb(100, 100, 100)";                
                                            gunChosenData.main.currentChosen = frozenElementsCreated;
                                            $(id).style.backgroundColor = "rgb(203, 51, 46)";
                                            levelData.players[playerNum].view = levelData.players[playerNum].inventory.activeItem.proto.view;
                                        }
                                    }
                                )
                            );
                            $(id).style.top = (120 * elementsCreatedMain + 10 + "px");
                        }
                    }

                    let elementsCreatedSecondary = 0;
                    for(let i = 0; i < gamespace.guns.length; i++) {
                        if(gamespace.guns[i].tags.includes(secondaryTag)) {
                            elementsCreatedSecondary++;
                            const id = "secondary-weapon-selector-backing-" + elementsCreatedSecondary,
                            frozenElementsCreated = elementsCreatedSecondary;
                            $("weapon-selection-container").append(
                                makeElement(
                                    "img",
                                    {
                                        id: id,
                                        src: gamespace.guns[i].images.loot,
                                        className: "selection-backing-secondary",
                                        top: 100 * elementsCreatedSecondary + 50 + "px"
                                    },
                                    void 0,
                                    {
                                        click: function() {
                                            console.log(frozenElementsCreated);
                                            levelData.players[playerNum].inventory.guns[1] = new gun(gamespace.guns[i]);
                                            $("weapon-slot-2").src = gamespace.guns[i].images.loot;
                                            $("secondary-weapon-selector-backing-" + gunChosenData.secondary.currentChosen).style.backgroundColor = "rgb(100, 100, 100)";                
                                            gunChosenData.secondary.currentChosen = frozenElementsCreated;
                                            $(id).style.backgroundColor = "rgb(203, 51, 46)";
                                        }
                                    }
                                )
                            );
                            $(id).style.top = (120 * elementsCreatedSecondary + 10 + "px");
                            /*
                            elementsCreatedSecondary++;
                            const id = "secondary-weapon-selector-backing-" + elementsCreatedSecondary
                            $("weapon-selection-container").append(
                                makeElement(
                                    "img",
                                    {
                                        id: id,
                                        src: gamespace.guns[i].images.loot,
                                        className: "selection-backing-secondary",
                                        top: 120 * elementsCreatedSecondary + 50 + "px"
                                    },
                                    void 0,
                                    {
                                        click: function() {
                                            levelData.players[playerNum].inventory.guns[1] = new gun(gamespace.guns[i]);
                                            $("weapon-slot-2").src = levelData.players[playerNum].inventory.guns[ absMod((levelData.players[playerNum].inventory.activeIndex - 1), levelData.players[playerNum].inventory.guns.length)].proto.images.loot;                                        
                                            $(id).style.backgroundColor = "rgb(203, 51, 46)";
                                        }
                                    }
                                )
                            );
                            $(id).style.top = (15 * elementsCreatedSecondary + 7 + "%");
                            */
                        }
                    }
                }

                function drawPlayers(layer) {
                    p5.rectMode(p5.CENTER);
                    const now = Date.now();
                    levelData.players.forEach((player, i, a) => {
                        if(player.state.layer == layer) {
                            const b = player.body;
                            Matter.Body.setVelocity(b, { x: 0, y: 0 });
                            /*
                            if(i == playerNum) {
                                let obstaclesCheck = levelData.obstacles.map(o => o.body);
                                let playersCheck = levelData.players.map(o => o.body);
                                playersCheck.splice(playerNum, 1);
                                obstaclesCheck.concat(playersCheck);
                                let ray = raycast(Matter.Composite.allBodies(world), {x: b.position.x + Math.cos(player.angle - Math.PI / 2) * 500, y: b.position.y + Math.sin(player.angle - Math.PI / 2) * 500}, {x: b.position.x + Math.cos(player.angle - Math.PI / 2) * 50, y: b.position.y + Math.sin(player.angle - Math.PI / 2) * 50}, true);
                            }
                            if(i == playerNum && ray[0]) {
                                console.log(ray);
                                p5.stroke("red");
                                p5.strokeWeight(3);
                                p5.line(b.position.x, b.position.y, ray[ray.length - 1].point.x, ray[ray.length - 1].point.y);
                            }
                            else if(i == playerNum) {
                                p5.stroke("red");
                                p5.strokeWeight(3);
                                p5.line(b.position.x, b.position.y, b.position.x + Math.cos(player.angle - Math.PI / 2) * 500, b.position.y + Math.sin(player.angle - Math.PI / 2) * 500);
                            }*/
                            p5.noStroke();
                            if (i == playerNum && player.health > 0 || sqauredDist(b.position, a[playerNum].body.position) < (windowDimensions * 5) ** 2 && player.health > 0) {
                                // Setup
                                p5.push();
                                p5.translate(b.position.x, b.position.y);

                                const p = levelData.players[i],
                                q = p.inventory.activeItem,
                                ip = q.proto;
                                
                                // Intense NPC stare
                                if (i != playerNum && sqauredDist(a[playerNum].body.position, player.body.position) <= 1600 ** 2 && !(Math.round(p5.degrees(player.angle) / 10) == Math.round(p5.degrees(Math.atan2(a[playerNum].body.position.y - player.body.position.y, a[playerNum].body.position.x - player.body.position.x) + Math.PI / 2) / 10))) {
                                    p5.fill("red");
                                    p5.noStroke();
                                    p5.text("!", 0, -80);
                                    if(player.Class == "runner") {
                                        Matter.Body.setVelocity(b, { x: Math.cos(p.angle - Math.PI / 2) * 2.5, y: Math.sin(p.angle - Math.PI / 2) * 2.5 });
                                    }
                                    const targetAngle = Math.atan2(a[playerNum].body.position.y - player.body.position.y, a[playerNum].body.position.x - player.body.position.x);
                                    if(targetAngle - player.angle > Math.PI) {
                                        player.angle += ((targetAngle - player.angle + Math.PI / 2) + Math.PI * 2) / 4;
                                    } else {
                                        player.angle += ((targetAngle - player.angle + Math.PI / 2)) / 4;
                                    }
                                }
                                p5.rotate(player.angle);

                                const item = player.inventory.activeItem.proto,
                                    radius = b.circleRadius,
                                    d = Math.min(item.recoilImpulse.weapon.duration, lastTime - player.state.lastShot);

                                if (item.caliber != "melee") {
                                    for (let i = 0; i < 2; i++) { // Hands
                                        p5.fill(["#000", "#F8C574"][i]);
                                        let uselessArray = [item.recoilImpulse.left, item.recoilImpulse.right];
                                        let uselessNumber = 0;
                                        Object.values(item.hands).forEach(hand => {
                                            p5.ellipse((hand.x * radius) + item.offset.x * radius + uselessArray[uselessNumber].x * (1 - (d / uselessArray[uselessNumber].duration)), (hand.y * radius) + item.offset.y * radius - uselessArray[uselessNumber].y * (1 - (d / uselessArray[uselessNumber].duration)), radius * (i ? 0.5 : 0.8), radius * (i ? 0.5 : 0.8), 20);
                                            uselessNumber++;
                                        });
                                    }
                                }

                                // Item image
                                if (item) {
                                    p5.image(
                                        item.images.held,
                                        item.offset.x * radius + item.recoilImpulse.weapon.x * (1 - (d / item.recoilImpulse.weapon.duration)),
                                        item.offset.y * radius - item.recoilImpulse.weapon.y * (1 - (d / item.recoilImpulse.weapon.duration)),
                                        item.width * radius,
                                        item.height * radius
                                    );
                                }
                                

                                if (item.caliber == "melee") {
                                    for (let i = 0; i < 2; i++) { // Hands
                                        p5.fill(["#000", "#F8C574"][i]);
                                        let uselessArray = [item.recoilImpulse.left, item.recoilImpulse.right];
                                        let uselessNumber = 0;
                                        Object.values(item.hands).forEach(hand => {
                                            p5.ellipse((hand.x * radius) + item.offset.x * radius + uselessArray[uselessNumber].x * (1 - (d / uselessArray[uselessNumber].duration)), (hand.y * radius) + item.offset.y * radius - uselessArray[uselessNumber].y * (1 - (d / uselessArray[uselessNumber].duration)), radius * (i ? 0.5 : 0.8), radius * (i ? 0.5 : 0.8), 20);
                                            uselessNumber++;
                                        });
                                    }
                                }
                                p5.rotate(-player.angle);
                                // Body
                                p5.fill(0);
                                p5.ellipse(0, 0, radius * 2, radius * 2, 20);
                                p5.fill("#F8C574");
                                p5.ellipse(0, 0, radius * 1.65, radius * 1.65, 20);
                                p5.rotate(player.angle);

                                // Muzzle flash
                                if (player.state.shooting && item.caliber != "melee" || d <= item.flashDuration && item.caliber != "melee") {
                                    const scaleX = (2 * Math.round(Math.random()) - 1) * (Math.random() * 0.2 + 0.9),
                                        scaleY = Math.random() * 0.2 + 0.9;
                                    p5.translate(item.offset.x * radius, 0);
                                    p5.scale(scaleX * (radius / 40), scaleY * (radius / 40));
                                    p5.image(images.muzzleFlash, 0, (item.offset.y - item.height / 2 - 1) * radius / scaleY);
                                    p5.translate(-item.offset.x * radius, 0);
                                }
                                p5.scale(1, 1);

                                p.state.shooting = false;
                                if (levelData.players[playerNum].health > 0 && i != playerNum && sqauredDist(a[playerNum].body.position, player.body.position) <= (item.ballistics.range * 4000)/* && Math.round(p5.degrees(player.angle) / 10) == Math.round(p5.degrees(Math.atan2(a[playerNum].body.position.y - player.body.position.y, a[playerNum].body.position.x - player.body.position.x) + Math.PI / 2) / 10)*/) {
                                    if(player.Class == "runner") {
                                        Matter.Body.setVelocity(b, { x: Math.cos(p.angle - Math.PI / 2) * 2.5, y: Math.sin(p.angle - Math.PI / 2) * 2.5 });
                                    }
                                    const fire = q.activeFireMode,
                                    burst = fire.startsWith("burst-");

                                    if (((burst && !p.state.fired)
                                        ? (burst && now - p.state.lastBurst > ip.burstProps.burstDelay)
                                        : (p.state.fired < ({ automatic: Infinity, semi: 1 }[fire] ?? +fire.replace("burst-", "")))

                                        && (now - p.state.lastShot) > (burst ? (ip.burstProps.shotDelay ?? ip.delay) : ip.delay)
                                    )
                                    ) {
                                        p.state.shooting = true;
                                        p.state.lastShot = now;
                                        if (!p.state.fired && burst) { p.state.lastBurst = now; }
                                        p.state.fired++;
                                        let a;
                                        if (p.isMoving) {
                                            a = ip.accuracy.moving;
                                        } else {
                                            a = ip.accuracy.default;
                                        }
                                        const start = { x: b.position.x + Math.cos(p.angle - p5.HALF_PI) * ip.ballistics.velocity * dt * 2.1, y: b.position.y + Math.sin(p.angle - p5.HALF_PI) * ip.ballistics.velocity * dt * 2.1 },
                                            dev = p.angle + p5.random(-a, a),
                                            body = Bodies.rectangle(start.x, start.y, 5, ip.ballistics.velocity * dt * 6, { isStatic: true, friction: 1, restitution: 0, density: 1, angle: dev, isSensor: true }),
                                            roundsPerShot = ip.roundsPerShot;

                                        levelData.particles.push(new particle(images[`cartridge_${ip.cartridgeType}`], 255, 5, p.body.position.x + Math.cos(p.angle - Math.PI / 2.3) * 60, p.body.position.y + Math.sin(p.angle - Math.PI / 2.3) * 60, p.angle + p5.random(-0.6, 0.6), "#FFFFFF", 35));
                                        if(roundsPerShot == 1) {
                                            bullets.push(new bullet(body, p, ip, dev, start, i, "#000000"));
                                        }
                                        else {
                                            for(let i = 0; i < roundsPerShot; i++) {
                                                bullets.push(new bullet(Bodies.rectangle(start.x, start.y, 10, ip.ballistics.velocity * dt * 6 + i, { isStatic: true, friction: 1, restitution: 0, density: 1, angle: p.angle + ((2 * a / roundsPerShot) * (i - roundsPerShot / 2 + 0.5)), isSensor: true }), p, ip, p.angle + ((2 * a / roundsPerShot) * (i - roundsPerShot / 2 + 0.5)), start, i, "#000000"));
                                            }
                                        }
                                    }
                                    if (p.state.fired == fire.replace("burst-", "") - 1) {
                                        p.state.fired = 0;
                                    }
                                }

                                p5.rotate(-player.angle);
                                p5.pop();
                            }
                        }

                    });
                    p5.rectMode(p5.CORNER);
                };

                function drawPlayerShadows() {
                    levelData.players.forEach((player, i, a) => {
                        const b = player.body;
                        if (i == playerNum && player.health > 0 || sqauredDist(b.position, a[playerNum].body.position) < (windowDimensions * 5) ** 2 && player.health > 0) {
                            const item = player.inventory.activeItem.proto,
                                radius = b.circleRadius,
                                d = Math.min(item.recoilImpulse.weapon.duration, lastTime - player.state.lastShot);

                            p5.push();
                            p5.translate(b.position.x, b.position.y);
                            p5.rotate(player.angle);
                            p5.fill(0, 0, 0, 60);
                            p5.tint(0, 0, 0, 60);
                            p5.ellipse(0, 0, radius * 2.1 + 10, radius * 2.1 + 10, 70);

                            let uselessArray = [item.recoilImpulse.left, item.recoilImpulse.right];
                            let uselessNumber = 0;
                            Object.values(item.hands).forEach(hand => {
                                p5.ellipse((hand.x * radius) + item.offset.x * radius + uselessArray[uselessNumber].x * (1 - (d / uselessArray[uselessNumber].duration)), (hand.y * radius) + item.offset.y * radius - uselessArray[uselessNumber].y * (1 - (d / uselessArray[uselessNumber].duration)), radius * (i ? 0.55 : 0.8) + 10, radius * (i ? 0.55 : 0.8) + 10, 20);
                                uselessNumber++;
                            });

                            if (item) {
                                p5.image(
                                    item.images.held,
                                    item.offset.x * radius + item.recoilImpulse.x * (1 - (d / item.recoilImpulse.duration)),
                                    item.offset.y * radius - item.recoilImpulse.y * (1 - (d / item.recoilImpulse.duration)),
                                    item.width * radius + 20,
                                    item.height * radius + 20
                                );
                            }

                            p5.pop();
                        }
                    });
                };

                function drawObjects(layer) {
                    levelData.obstacles.filter(o => o.layer == layer).forEach(o => {
                        const b = o.body;
                        if (o.image && sqauredDist(b.position, levelData.players[playerNum].body.position) < (windowDimensions * 5) ** 2) {
                            p5.push();
                            p5.imageMode(o.imageMode);
                            p5.translate(b.position.x + o.offset.x, b.position.y + o.offset.y);
                            p5.rotate(b.angle + o.offset.angle);
                            p5.tint(o.tint);
                            p5.image(o.image, 0, 0, o.imageWidth, o.imageHeight);
                            p5.rotate(-(b.angle + o.offset.angle));
                            p5.fill('red');
                            //p5.text("skrim asset #" + b.id, 0, 0);
                            p5.noTint();
                            p5.pop();
                        }

                        if (gamespace.settings.debug) {
                            p5.fill("#FF000080");
                            p5.beginShape(p5.TESS);
                            for (let i = 0; i < b.vertices.length; i++) {
                                p5.vertex(b.vertices[i].x, b.vertices[i].y);
                            }
                            p5.endShape();
                        }
                    });
                };

                function drawRoofs(layer) {
                    let details = {
                        inside: false,
                        aboveGround: false,
                    };
                    const p = levelData.players[playerNum],
                        pb = p.body,
                        radius = pb.circleRadius;
                    levelData.obstacles.filter(o => o.layer == layer).forEach(o => {
                        if (o.roof?.image && sqauredDist(o.body.position, levelData.players[playerNum].body.position) < (windowDimensions * 5) ** 2) {
                            const b = o.body;

                            p5.push();
                            p5.imageMode(o.imageMode);
                            p5.translate(b.position.x, b.position.y);
                            p5.rotate(b.angle + o.offset.angle);
                            p5.translate(o.offset.x, o.offset.y);
                            p5.fill("red");
                            p5.beginShape();
                            /*o.roof.roofHitbox.vertices.forEach(v => {
                                p5.vertex(v.x, v.y);
                            });*/
                            p5.endShape();

                            if (Matter.Query.collides(levelData.players[playerNum].body, [o.roof.roofHitbox]).length) {
                                if (o.roof.opacity > 0) {
                                    if(o.roof.deck) {
                                        levelData.players[playerNum].state.layer = 1;
                                    } else {
                                        o.roof.opacity = Math.max(o.roof.opacity - Math.round(30 * (dt * 2)), 0);
                                    }
                                }
                                details.inside = true;
                                details.aboveGround = o.roof.aboveGround;
                            } else {
                                if (o.roof.opacity < 255 || o.roof.deck && levelData.players[playerNum].state.layer > 0) {
                                    if(o.roof.deck && details.inside != true) {
                                        levelData.players[playerNum].state.layer = 0;
                                    } else {
                                        o.roof.opacity = Math.min(o.roof.opacity + Math.round(30 * (dt * 2)), 255);
                                    }
                                }
                            }
                            p5.tint(255, 255, 255, o.roof.opacity);
                            p5.image(o.roof.image, 0, 0, o.roof.width, o.roof.height);
                            p5.pop();
                        }
                    });

                    if (details.inside) {
                        if (p.view != p.inventory.activeItem.proto.view + 500 && details.aboveGround) {
                            p.view -= ((p.view ?? 0) - (p.inventory.activeItem.proto.view + 500)) / 2 * dt;
                        } 

                        if (p.view != 1700 && !details.aboveGround) {
                            p.view -= ((p.view ?? 0) - 1700) / 2 * dt;
                        } else if (!details.aboveGround) {
                            p.view = 1700;
                        }

                    } else {
                        if (p.view != p.inventory.activeItem.proto.view) {
                            p.view += (p.inventory.activeItem.proto.view - (p.view ?? 0)) / 2 * dt;
                        } else {
                            //p.view = p.inventory.activeItem.proto.view;
                        }
                    }
                };

                function drawShadows(layer) {
                    levelData.obstacles.filter(o => o.layer == layer).forEach(o => {
                        const b = o.body;

                        p5.push();
                        p5.imageMode(o.imageMode);
                        p5.translate(b.position.x + o.offset.x + 10, b.position.y + o.offset.y + 10);
                        p5.rotate(b.angle + o.offset.angle);

                        if (o.image && sqauredDist(b.position, levelData.players[playerNum].body.position) < (windowDimensions * 5) ** 2) {
                            p5.tint(0, 0, 0, 25);
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
                        //World.remove(world, b);
                        bullets.splice(i, 1);
                    }

                    bullets.forEach((b, i) => {
                        let gone = false;
                        const bd = b.body;
                        b.timer++;
                        Matter.Body.setPosition(bd, { x: bd.position.x + p5.cos(b.angle - Math.PI / 2) * b.emitter.ballistics.velocity * (dt / 2 + 0.2), y: bd.position.y + p5.sin(b.angle - Math.PI / 2) * b.emitter.ballistics.velocity * (dt / 2 + 0.2) });
                        b.squaredDistance = sqauredDist(b.start, bd.position);
                        const p = Matter.Query.collides(bd, levelData.players.map(o => o.body));
                        const ob = Matter.Query.collides(bd, levelData.obstacles.map(help => help.body));
                        if (p[0] && !gone) {
                            const f = pl => pl.body.id == p[0].bodyA.id,
                            target = levelData.players.find(f),
                            index = levelData.players.findIndex(f);
                            let thing = levelData.obstacles.map(o => o.body);
                            thing.push(target.body);
                            const ray = Matter.Query.ray(thing, b.start, target.body.position, 1);
                            try {
                                if (ray[0] && b.shooter.body.id != target.body.id && ray[ray.length - 1].bodyA.id == target.body.id && !ob[0]) {
                                    target.health -= b.emitter.ballistics.damage;
                                    levelData.particles.push(new particle(images.particle1, 255, 10, target.body.position.x + Math.cos(b.angle + Math.PI / 2) * 50, target.body.position.y + Math.sin(b.angle + Math.PI / 2) * 50, b.angle + Math.PI / 2 + p5.random(-0.4, 0.4), "#FF0000", p5.random(20, 35)));
                                    if(index == playerNum) {
                                        $("healthbar").style.width = (levelData.players[playerNum].health / 100) * (windowDimensions / 1.9) + "px";
                                    }
                                    if (target.health <= 0) {
                                        for (let x = 0; x < Math.round(p5.random(6, 9)); x++) {
                                            let angle = p5.random(0, Math.PI * 2) + x * Math.PI / 7,
                                            distance = p5.random(10, 65);
                                            levelData.particles.push(new particle(images.particle1, 255, 10, target.body.position.x + Math.cos(angle) * distance, target.body.position.y + Math.sin(angle) * distance, angle, "#FF0000", p5.random(20, 35)));
                                        }
                                        if (b.shooter.body.id != levelData.players[playerNum].body.id && index == playerNum) {
                                            $("healthbar").style.display = "none";
                                            $("killer-text").textContent = (`You were killed with a${isVowel(b.emitter.name[0])} ` + b.emitter.name);
                                            $("deathscreen-container").style.display = "block";
                                            $("deathscreen-container").style.display = "flex";
                                            //p5.draw();
                                            p5.draw();
                                            p5.noLoop();
                                        } else {
                                            World.remove(world, target.body);
                                            target.destroy();
                                            levelData.players.splice(index, 1);
                                        }
                                    }
                                    removeBullet(bd, i);
                                    gone = true;
                                }
                            } catch {}
                        }
                        try {
                            if (ob[0] && !gone) {
                                //sounds.impact.play();
                                if (ob[0]) {
                                    const f = pl => pl.body.id == ob[ob.length - 1].bodyA.id,
                                        target = levelData.obstacles.find(f),
                                        index = levelData.obstacles.findIndex(f);
                                    
                                    if (index != -1 && b.shooter.body.id == levelData.players[playerNum].body.id/* && target.layer == 1*/) {
                                        const bulletCast = raycast([target.body], {x: bd.position.x - Math.cos(b.angle + p5.HALF_PI) * b.emitter.ballistics.velocity * dt * 2.7, y: bd.position.y - Math.sin(b.angle + p5.HALF_PI) * b.emitter.ballistics.velocity * dt * 2.7}, {x: bd.position.x + Math.cos(b.angle + p5.HALF_PI) * b.emitter.ballistics.velocity * dt * 2.7, y: bd.position.y + Math.sin(b.angle + p5.HALF_PI) * b.emitter.ballistics.velocity * dt * 2.7}, true);
                                        levelData.particles.push(new particle(images.particle1, 255, 10, bulletCast[0].point.x, bulletCast[0].point.y, b.angle + Math.PI / 2 + p5.random(-0.8, 0.8), target.tint, p5.random(20, 30)));
                                        if (target.health < b.damage) {
                                            for (let x = 0; x < Math.round(p5.random(5, 9)); x++) {
                                                const angle = p5.random(0, Math.PI * 2) + x * Math.PI / 7,
                                                distance = p5.random(10, 20);
                                                levelData.particles.push(new particle(images.particle1, 255, 10, target.body.position.x + Math.cos(angle) * distance, target.body.position.y + Math.sin(angle) * distance, angle, target.tint, p5.random(30, 40)));
                                            }
                                            b.damage -= target.health;
                                            levelData.obstacles.splice(index, 1);
                                            World.remove(world, target.body);
                                        } else {
                                            target.health -= b.damage;
                                            removeBullet(bd, i);
                                            b.destroy();
                                            gone = true;
                                        }
                                    } else {
                                        removeBullet(bd, i);
                                        b.destroy();
                                        gone = true;   
                                    }
                                    
                                    /*if (index == -1 || target.layer != 0){
                                        removeBullet(bd, i);
                                        b.destroy();
                                        gone = true;                                    
                                    }*/
                                }
                            } else if (b.squaredDistance > b.emitter.ballistics.range ** 2 && !gone || !gone && b.timer >= b.emitter.ballistics.timeout) {
                                removeBullet(bd, i);
                                b.destroy();
                                gone = true;   
                            }
                        } catch {}
                        if (sqauredDist(bd.position, levelData.players[playerNum].body.position) < (windowDimensions * 5) ** 2 && !gone) {
                            if (b.emitter.caliber != "melee") {
                                p5.push();
                                p5.translate(bd.position.x, bd.position.y);
                                p5.rotate(bd.angle);
                                p5.tint(b.trailcolor);
                                p5.image(images.bullettrail, 0, b.emitter.ballistics.velocity * dt * 1.5, 12, b.emitter.ballistics.velocity * dt * 8);
                                p5.tint("#FFFFFF");
                                p5.pop();
                                if(gamespace.settings.debug) {
                                    p5.fill("red");
                                    p5.beginShape();
                                    for(let i = 0; i < bd.vertices.length; i++) {
                                        p5.vertex(bd.vertices[i].x, bd.vertices[i].y);
                                    }
                                    p5.endShape();
                                }
                            }
                            p5.push();
                            p5.translate(bd.position.x - Math.cos(b.angle + p5.HALF_PI) * b.emitter.ballistics.velocity * dt * 2.7, bd.position.y - Math.sin(b.angle + p5.HALF_PI) * b.emitter.ballistics.velocity * dt * 2.7);
                            p5.rotate(b.angle);
                            p5.image(images[`caliber_${b.emitter.caliber}`], 0, 0, 15, 50);
                            p5.pop();
                        }
                    });

                };

                function drawParticles() {
                    levelData.particles.forEach((p, i) => {
                        if (sqauredDist(p, levelData.players[playerNum].body.position) < (p5.width + p5.height) ** 2) {
                            p5.push();
                            p5.translate(p.x, p.y);
                            p5.rotate(p.angle);
                            p5.tint(p.tint + p5.hex(p.opacity)[6] + p5.hex(p.opacity)[7]);
                            p5.image(p.image, 0, 0, p.size, p.size);
                            p5.tint("#FFFFFF");
                            p5.pop();
                        }
                        p.opacity -= p.unit;
                        p.x += Math.cos(p.angle) * p.speed;
                        p.y += Math.sin(p.angle) * p.speed;
                        if (p.opacity <= 0) {
                            levelData.particles.splice(i, 1);
                        }
                    });
                };

                function drawPaths() {
                    levelData.paths.forEach((p, i) => {
                        p5.fill(p.colour);
                        p5.beginShape(p5.TESS);
                        for (let b = 0; b < p.vertices.length; b++) {
                            p5.vertex(p.vertices[b].x, p.vertices[b].y);
                        }
                        p5.endShape();
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
                    const player = levelData.players[playerNum],
                        absMod = (v, m) => (m + (v % m)) % m;

                    if (p5.key.toLowerCase() == "z") {
                        sightArray.pop();
                    }

                    if (p5.key.toLowerCase() == "c") {
                        console.log(sightArray);
                    }

                    if (p5.key.toLowerCase() == "shift") {
                        levelData.players[playerNum].inventory.activeItem.activeFireModeIndex++;
                    }

                    if(p5.key.toLowerCase() == "r" && levelData.players[playerNum].inventory.activeItem.proto.mag < levelData.players[playerNum].inventory.activeItem.proto.magSize) {
                        levelData.players[playerNum].state.reloading = true;
                        $("reload-progress").style.display = "";
                        $("reload-progress-outline").style.display = "";
                    }

                    if(levelData.players[playerNum].health > 0) {
                        if (p5.key.toLowerCase() == "q") {
                            player.inventory.activeIndex = absMod((player.inventory.activeIndex - 1), player.inventory.guns.length);
                            $("weapon-slot-1").src = player.inventory.activeItem.proto.images.loot;
                            $("weapon-slot-2").src = player.inventory.guns[ absMod((player.inventory.activeIndex - 1), player.inventory.guns.length)].proto.images.loot;
                            $("weapon-name").textContent = player.inventory.activeItem.proto.name;
                            $("ammocount").textContent = shouldUseInfinity(levelData.players[playerNum].inventory.activeItem.proto.mag) + " | " + shouldUseInfinity(levelData.players[playerNum].inventory.activeItem.proto.magSize);
                            levelData.players[playerNum].state.reloading = false;
                            levelData.players[playerNum].state.reloadProgress = 0;
                            $("reload-progress").style.display = "none";
                            $("reload-progress-outline").style.display = "none";
                        }

                        else if (p5.key.toLowerCase() == "e") {
                            player.inventory.activeIndex = absMod((player.inventory.activeIndex + 1), player.inventory.guns.length);
                            $("weapon-slot-1").src = player.inventory.activeItem.proto.images.loot;
                            $("weapon-slot-2").src = player.inventory.guns[ absMod((player.inventory.activeIndex - 1), player.inventory.guns.length)].proto.images.loot;
                            $("weapon-name").textContent = player.inventory.activeItem.proto.name;
                            $("ammocount").textContent = shouldUseInfinity(levelData.players[playerNum].inventory.activeItem.proto.mag) + " | " + shouldUseInfinity(levelData.players[playerNum].inventory.activeItem.proto.magSize);
                            levelData.players[playerNum].state.reloadProgress = 0;
                            $("reload-progress").style.display = "none";
                            $("reload-progress-outline").style.display = "none";
                        }
                    }
                };

                p5.keyReleased = function () {
                    keys[p5.keyCode] = false;
                };

                p5.mouseReleased = function () {
                    levelData.players[playerNum].state.fired = 0;
                };

                p5.mousePressed = function () {/*
                    if (p5.mouseButton == p5.LEFT) {
                        sightArray.push({ x: p5.round((levelData.players[playerNum].body.position.x + (p5.mouseX - p5.width / 2) * 2.2) / 3) * 3 - 0, y: p5.round((levelData.players[playerNum].body.position.y + (p5.mouseY - p5.height / 2) * 2.2) / 3) * 3 - 0});
                    }*/
                };

                function playerMove() {
                    const w = !!keys[83],
                        a = !!keys[65],
                        s = !!keys[87],
                        d = !!keys[68],
                        player = levelData.players[playerNum],
                        body = player.body,
                        base = player.body.circleRadius / (10 * Math.SQRT2);

                    Body.applyForce(body, body.position, { // Why is the base speed √8
                        x: +(a ^ d) && ((dt / 2 + 0.2) * (dt * 5) * ((w ^ s) ? Math.SQRT1_2 : 1) * [-1, 1][+d] * (dt * 5) * base),
                        y: +(w ^ s) && ((dt / 2 + 0.2) * (dt * 5) * ((a ^ d) ? Math.SQRT1_2 : 1) * [-1, 1][+w] * (dt * 5) * base)
                    }); //                                                      ^ This part is supposed to manage the sign of the force and nothing else

                    player.isMoving = w || a || s || d;
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
                    levelData.objects.forEach(ob => void World.add(world, ob));
                };

                p5.draw = function () {
                    const now = Date.now();

                    if (levelData.players[playerNum].state.reloading) {
                        levelData.players[playerNum].state.reloadProgress += 100 / levelData.players[playerNum].inventory.activeItem.proto.reloadTime;
                        $("reload-progress").style.width = (levelData.players[playerNum].state.reloadProgress / 100) * (windowDimensions / 7) + "px";
                        if(levelData.players[playerNum].state.reloadProgress >= 100) {
                            levelData.players[playerNum].inventory.activeItem.proto.mag = levelData.players[playerNum].inventory.activeItem.proto.magSize;
                            $("ammocount").textContent = shouldUseInfinity(levelData.players[playerNum].inventory.activeItem.proto.mag) + " | " + shouldUseInfinity(levelData.players[playerNum].inventory.activeItem.proto.magSize);
                            levelData.players[playerNum].state.reloadProgress = 0;
                            levelData.players[playerNum].state.reloading = false;
                            $("reload-progress").style.width = "0px";
                            $("reload-progress").style.display = "none";
                            $("reload-progress-outline").style.display = "none";
                        }
                    }

                    dt = 0.2 /*/ (now - lastTime)*/;
                    p5.clear();

                    levelData.obstacles[5].offset.angle+=0.001;

                    const p = levelData.players[playerNum],
                        b = p.body,
                        i = p.inventory.activeItem,
                        ip = i.proto;

                    p5.textFont(fonts.sourceSansPro, 60);

                    gameCamera.x = levelData.players[playerNum].body.position.x;
                    gameCamera.y = levelData.players[playerNum].body.position.y;
                    gameCamera.xFocus = levelData.players[playerNum].body.position.x;
                    gameCamera.yFocus = levelData.players[playerNum].body.position.y;

                    //p5.camera(Math.round(gameCamera.x)/* + (p5.mouseX - p5.width / 2) / 2*/, Math.round(gameCamera.y)/* + (p5.mouseY - p5.height / 2) / 2*/, p.view - p5.width / 2, Math.round(gameCamera.xFocus)/* + (p5.mouseX - p5.width / 2) / 2*/, Math.round(gameCamera.yFocus)/* + (p5.mouseY - p5.height / 2) / 2*/, 0);
                    p5.camera(Math.round(gameCamera.x) + (p5.mouseX - p5.width / 2) / 2, Math.round(gameCamera.y) + (p5.mouseY - p5.height / 2) / 2, p.view - p5.width / 2, Math.round(gameCamera.xFocus) + (p5.mouseX - p5.width / 2) / 2, Math.round(gameCamera.yFocus) + (p5.mouseY - p5.height / 2) / 2, 0);
                    p5.noStroke();
                    p5.rectMode(p5.CORNER);
                    p5.fill(level.world.colour);
                    p5.rect(0, 0, level.world.width, level.world.height);
                    p5.imageMode(p5.CENTER);
                    p5.rectMode(p5.CENTER);
                    p5.translate(0, 0, 1);
                    if(gamespace.settings.graphicsQuality > 0.5) {
                        drawPaths();
                    }
                    drawGridLines();
                    p5.translate(0, 0, 1);
                    if (gamespace.settings.graphicsQuality > 1) {
                        drawPlayerShadows();
                        drawShadows(0);
                        drawShadows(1);
                    }
                    p5.translate(0, 0, 1);
                    drawObjects(0);
                    drawBullets();
                    if(levelStarted) {
                        drawPlayers(1);
                        drawPlayers(0);
                        if (shouldCall > 1 && levelData.players[playerNum].health > 0) {
                            playerMove();
                        }
                        /*p5.noStroke();
                        p5.fill(39, 39, 39, 150);
                        p5.arc(p.body.position.x - Math.cos(p.angle - Math.PI / 2) * 90, p.body.position.y - Math.sin(p.angle - Math.PI / 2) * 90, (p5.width + p5.height) * 3, (p5.width + p5.height) * 3, (p.angle - Math.PI / 2) + 0.5, (p.angle - Math.PI / 2) - 0.5, p5.PIE);
                    */}
                    drawParticles();
                    drawObjects(1);
                    drawRoofs(0);
                    if(levelStarted) {
                        drawPlayers(1);
                    }
                    drawObjects(2);
                    /*
                    p5.fill(255, 0, 0, 100);
                    p5.stroke(255, 0, 0, 100);
                    p5.strokeWeight(10);
                    p5.ellipse(p5.round((levelData.players[playerNum].body.position.x + (p5.mouseX - p5.width / 2) * 2.2) / 3) * 3, p5.round((levelData.players[playerNum].body.position.y + (p5.mouseY - p5.height / 2) * 2.2) / 3) * 3, 10, 10);
                    for (let m = 0; m < sightArray.length; m++) {
                        p5.ellipse(sightArray[m].x + 0, sightArray[m].y + 0, 60, 60);
                        if (m > 0) {
                            p5.line(sightArray[m].x + 0, sightArray[m].y + 0, sightArray[m - 1].x + 0, sightArray[m - 1].y + 0);
                        }
                    }
                    */
                    if (document.visibilityState == "visible" && shouldCall < 3) {
                        shouldCall++;
                    }
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
                        && levelData.players[playerNum].health > 0
                        && p.inventory.activeItem.proto.mag > 0
                    ) {
                        p.state.shooting = true;
                        p.state.lastShot = now;
                        if (!p.state.fired && burst) { p.state.lastBurst = now; }
                        p.state.fired++;
                        let a;
                        if (p.isMoving) {
                            a = ip.accuracy.moving;
                        } else {
                            a = ip.accuracy.default;
                        }
                        const start = { x: b.position.x + Math.cos(p.angle - p5.HALF_PI) * (ip.ballistics.velocity * dt * 1.5), y: b.position.y + Math.sin(p.angle - p5.HALF_PI) * (ip.ballistics.velocity * dt * 1.5) },
                            dev = p.angle + p5.random(-a, a),
                            body = Bodies.rectangle(start.x, start.y, 5, ip.ballistics.velocity * dt * 6, { isStatic: true, friction: 1, restitution: 0, density: 1, angle: dev, isSensor: true }),
                            roundsPerShot = ip.roundsPerShot;

                        levelData.particles.push(new particle(images[`cartridge_${ip.cartridgeType}`], 255, 5, p.body.position.x + Math.cos(p.angle - Math.PI / 2.3) * 60, p.body.position.y + Math.sin(p.angle - Math.PI / 2.3) * 60, p.angle + p5.random(-0.6, 0.6), "#FFFFFF", 35, 3));
                        if(roundsPerShot == 1) {
                            bullets.push(new bullet(body, p, ip, dev, start, playerNum, p5.random([/*"red", "orange", "yellow", "green", "blue", "indigo", "violet"*/"black"])));
                        }
                        else {
                            for(let i = 0; i < roundsPerShot; i++) {
                                bullets.push(new bullet(Bodies.rectangle(start.x, start.y, 10, ip.ballistics.velocity * dt * 6 + i / 10, { isStatic: true, friction: 1, restitution: 0, density: 1, angle: p.angle + ((2 * a / roundsPerShot) * (i - roundsPerShot / 2 + 0.5)), isSensor: true }), p, ip, p.angle + ((2 * a / roundsPerShot) * (i - roundsPerShot / 2 + 0.5)), start, playerNum, p5.random([/*"red", "orange", "yellow", "green", "blue", "indigo", "violet"*/"black"])));
                            }
                        }
                        p.inventory.activeItem.proto.mag--;
                        p.state.reloadProgress = 0;
                        p.state.reloading = false;
                        $("ammocount").textContent = shouldUseInfinity(levelData.players[playerNum].inventory.activeItem.proto.mag) + " | " + shouldUseInfinity(levelData.players[playerNum].inventory.activeItem.proto.magSize);
                        $("reload-progress").style.width = "0px";
                        $("reload-progress").style.display = "none";
                        $("reload-progress-outline").style.display = "none";
                        var shot = new Audio(ip.sounds.fire);
                        shot.play();
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
                let String = "";
                for(let i = 0; i < gamespace.guns.length; i++) {
                    String = String + gamespace.guns[i].name + ":\n\nDamage: " + gamespace.guns[i].ballistics.damage + "\nShot delay: " + gamespace.guns[i].delay + "\nScope zoom: " + gamespace.guns[i].view + "\nCaliber: " + gamespace.guns[i].caliber + "\n\n";
                }
                console.log(String);
            };

            new p5(s);
        }
    };
    return level;
})();

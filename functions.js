// These are all just copy pasted from the level script, and hence, they'll all fail with a billion ReferenceError's cause you haven't ensured that
// variables accesible in the level script (like levelData and playerNum) are accessible here.

function drawPlayers() {
    p5.rectMode(p5.CENTER);
    const now = Date.now();
    levelData.players.forEach((player, i, a) => {
        const b = player.body;
        Matter.Body.setVelocity(b, { x: -b.force.x, y: -b.force.y });
        /*
        if (i == playerNum) {
            let obstaclesCheck = levelData.obstacles.map(o => o.body);
            let playersCheck = levelData.players.map(o => o.body);
            playersCheck.splice(playerNum, 1);
            obstaclesCheck.concat(playersCheck);
            let ray = raycast(Matter.Composite.allBodies(world), {x: b.position.x + Math.cos(player.angle - Math.PI / 2) * 500, y: b.position.y + Math.sin(player.angle - Math.PI / 2) * 500}, {x: b.position.x + Math.cos(player.angle - Math.PI / 2) * 50, y: b.position.y + Math.sin(player.angle - Math.PI / 2) * 50}, true);
        }

        if (i == playerNum && ray[0]) {
            console.log(ray);
            p5.stroke('red');
            p5.strokeWeight(3);
            p5.line(b.position.x, b.position.y, ray[ray.length - 1].point.x, ray[ray.length - 1].point.y);
        } else if (i == playerNum) {
            p5.stroke('red');
            p5.strokeWeight(3);
            p5.line(b.position.x, b.position.y, b.position.x + Math.cos(player.angle - Math.PI / 2) * 500, b.position.y + Math.sin(player.angle - Math.PI / 2) * 500);
        }*/
        p5.noStroke();
        if (i == playerNum || sqauredDist(b.position, a[playerNum].body.position) < (p5.width + p5.height) ** 2) {
            // Setup
            p5.push();
            p5.translate(b.position.x, b.position.y);
            p5.rotate(player.angle);

            const item = player.inventory.activeItem.proto,
                radius = b.circleRadius,
                d = Math.min(item.recoilImpulse.weapon.duration, lastTime - player.state.lastShot);

            if (item.caliber != 'melee') {
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

            if (item.caliber == 'melee') {
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
            // Body
            p5.fill(0);
            p5.ellipse(0, 0, radius * 2, radius * 2, 20);
            p5.fill("#F8C574");
            p5.ellipse(0, 0, radius * 1.65, radius * 1.65, 20);

            // Muzzle flash
            if (player.state.shooting && item.caliber != "melee" || d <= item.flashDuration && item.caliber != "melee") {
                const scaleX = (2 * Math.round(Math.random()) - 1) * (Math.random() * 0.2 + 0.9),
                    scaleY = Math.random() * 0.2 + 0.9;

                p5.scale(scaleX, scaleY);
                p5.image(images.muzzleFlash, 0, (item.offset.y - item.height / 2 - 1) * radius / scaleY);
            }
            p5.scale(1, 1);

            // Intense NPC stare
            if (i != playerNum && sqauredDist(a[playerNum].body.position, player.body.position) <= 2100 ** 2) {
                player.angle += (Math.atan2(a[playerNum].body.position.y - player.body.position.y, a[playerNum].body.position.x - player.body.position.x) - player.angle + Math.PI / 2) / 10 * dt;
                //player.angle = Math.PI / 2 + Math.atan2(a[playerNum].body.position.y - player.body.position.y, a[playerNum].body.position.x - player.body.position.x);
            }
            const p = levelData.players[i],
                q = p.inventory.activeItem,
                ip = q.proto;
            p.state.shooting = false;
            if (i != playerNum && sqauredDist(a[playerNum].body.position, player.body.position) <= (item.ballistics.range ** 3) && Math.round(p5.degrees(player.angle) / 10) == Math.round(p5.degrees(Math.atan2(a[playerNum].body.position.y - player.body.position.y, a[playerNum].body.position.x - player.body.position.x) + Math.PI / 2) / 10)) {
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
                    const start = { x: b.position.x + Math.cos(p.angle - p5.HALF_PI) * ip.ballistics.velocity * dt * 2, y: b.position.y + Math.sin(p.angle - p5.HALF_PI) * ip.ballistics.velocity * dt * 2 },
                        dev = p.angle + p5.random(-a, a),
                        body = Bodies.rectangle(start.x, start.y, 10, ip.ballistics.velocity * dt * 6, { isStatic: true, friction: 1, restitution: 0, density: 1, angle: dev, isSensor: true });
                    bullets.push(new bullet(body, p, ip, dev, start, i));
                }
                if (p.state.fired == fire.replace("burst-", "") - 1) {
                    p.state.fired = 0;
                }
            }
            p5.fill(0);
            p5.rotate(-player.angle);
            p5.pop();
        }

    });
    p5.rectMode(p5.CORNER);
};

function drawPlayerShadows() {
    levelData.players.forEach((player, i, a) => {
        const b = player.body;
        if (i == playerNum || sqauredDist(b.position, a[playerNum].body.position) < (p5.width + p5.height) ** 2) {
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
            /*for (let i = 0; i < b.vertices.length; i++) {
                p5.vertex(b.vertices[i].x, b.vertices[i].y);
            }*/
            p5.endShape();
        }
    });
};

function drawRoofs(layer) {
    let inside = false;
    const p = levelData.players[playerNum],
        pb = p.body,
        radius = pb.circleRadius;
    levelData.obstacles.filter(o => o.layer == layer).forEach(o => {
        if (o.roof?.image && sqauredDist(o.body.position, levelData.players[playerNum].body.position) < (p5.width + p5.height) ** 2) {
            const b = o.body;

            p5.push();
            p5.imageMode(o.imageMode);
            p5.translate(b.position.x, b.position.y);
            p5.rotate(b.angle + o.offset.angle);
            p5.translate(o.offset.x, o.offset.y);
            p5.fill('red');
            p5.beginShape();
            /*o.roof.roofHitbox.vertices.forEach(v => {
                p5.vertex(v.x, v.y);
            });*/
            p5.endShape();

            if (Matter.Query.collides(levelData.players[playerNum].body, [o.roof.roofHitbox]).length) {
                if (o.roof.opacity > 0) {
                    o.roof.opacity = Math.max(o.roof.opacity - Math.round(30 * dt), 0);
                }
                inside = true;
            } else {
                if (o.roof.opacity < 255) {
                    o.roof.opacity = Math.min(o.roof.opacity + Math.round(30 * dt), 255);
                }
            }
            p5.tint(255, 255, 255, o.roof.opacity);
            p5.image(o.roof.image, 0, 0, o.roof.width, o.roof.height);
            p5.pop();
        }
    });

    if (inside) {
        if (p.view != 1700) {
            p.view -= ((p.view ?? 0) - 1700) / 2 * dt;
        } else {
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
        p5.translate(b.position.x + 10, b.position.y + 10);
        p5.rotate(b.angle + o.offset.angle);
        p5.translate(o.offset.x, o.offset.y);

        if (o.image && sqauredDist(b.position, levelData.players[playerNum].body.position) < (p5.width + p5.height) ** 2) {
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
        Matter.Body.setPosition(bd, { x: bd.position.x + p5.cos(b.angle - Math.PI / 2) * b.emitter.ballistics.velocity * dt, y: bd.position.y + p5.sin(b.angle - Math.PI / 2) * b.emitter.ballistics.velocity * dt });
        b.squaredDistance = sqauredDist(b.start, bd.position);
        const p = Matter.Query.collides(bd, levelData.players.map(o => o.body))[0];
        const ob = Matter.Query.collides(bd, levelData.obstacles.map(help => help.body))[0];
        if (p && !gone) {
            const f = pl => pl.body.id == p.bodyA.id,
                target = levelData.players.find(f),
                index = levelData.players.findIndex(f);
            let thing = levelData.obstacles.map(o => o.body);
            thing.push(target.body);
            const ray = Matter.Query.ray(thing, b.start, target.body.position, 1)[0];

            if (ray && b.index != index && ray.bodyA.id == target.body.id && ob || !ob && b.index != index) { // Very messy; I hope you know your operator precedence rules by heart
                target.health -= b.emitter.ballistics.damage;

                if (target.health <= 0) {
                    for (let x = 0; x < Math.round(p5.random(6, 12)); x++) {
                        let angle = p5.random(0, Math.PI * 2);
                        levelData.particles.push(new particle(images.particle1, 255, 15, target.body.position.x + Math.cos(angle) * 10, target.body.position.y + Math.sin(angle) * 10, angle, 230, 0, 0));
                    }
                    if (index == playerNum) {
                        levelData.players[playerNum].health = 100;
                        Matter.Body.setPosition(levelData.players[playerNum].body, { x: json.players[playerNum].x, y: json.players[playerNum].y });
                    } else {
                        World.remove(world, target.body);
                        target.destroy();
                        levelData.players.splice(index, 1);
                    }
                }
                removeBullet(bd, i);
                gone = true;
            }
        }
        if (ob && !gone || b.squaredDistance > b.emitter.ballistics.range ** 3 && !gone && b.timer >= b.emitter.ballistics.timeout) {
            if (ob) {
                const f = pl => pl.body.id == ob.bodyA.id,
                    target = levelData.obstacles.find(f),
                    index = levelData.obstacles.findIndex(f);
                if (index != -1) {
                    target.health -= b.emitter.ballistics.damage;
                    if (target.health <= 0) {
                        for (let x = 0; x < Math.round(p5.random(3, 6)); x++) {
                            let angle = p5.random(0, Math.PI * 2);
                            levelData.particles.push(new particle(images.particle1, 255, 15, target.body.position.x + Math.cos(angle) * 10, target.body.position.y + Math.sin(angle) * 10, angle, 255, 255, 255));
                        }
                        levelData.obstacles.splice(index, 1);
                        World.remove(world, target.body);
                    }
                }
            }
            removeBullet(bd, i);
            b.destroy();
            gone = true;
        }
        if (sqauredDist(bd.position, levelData.players[playerNum].body.position) < (p5.width + p5.height) ** 2 && !gone) {
            if (b.emitter.caliber != "melee") {
                p5.push();
                p5.translate(bd.position.x, bd.position.y);
                p5.rotate(b.angle);
                p5.fill(0, 0, 0, 30);
                p5.rect(0, 0, 12, b.emitter.ballistics.velocity * dt * 5);
                p5.pop();
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
        if (sqauredDist({ x: p.x, y: p.y }, levelData.players[playerNum].body.position) < (p5.width + p5.height) ** 2) {
            p5.tint(p.tintR, p.tintG, p.tintB, p.opacity);
            p5.image(p.image, p.x, p.y, 20, 20);
        }
        p.opacity -= p.unit;
        p.x += Math.cos(p.angle) * 4;
        p.y += Math.sin(p.angle) * 4;
        if (p.opacity <= 0) {
            levelData.particles.splice(i, 1);
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
    if (p5.key.toLowerCase() == 'z') {
        sightArray.pop();
    }
    if (p5.key.toLowerCase() == 'c') {
        console.log(sightArray);
    }
    if (p5.key.toLowerCase() == 'q' && levelData.players[playerNum].inventory.activeIndex > 0) {
        levelData.players[playerNum].inventory.activeIndex--;
    }
    if (p5.key.toLowerCase() == 'e' && levelData.players[playerNum].inventory.activeIndex < levelData.players[playerNum].inventory.guns.length - 1) {
        levelData.players[playerNum].inventory.activeIndex++;
    }
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
    /*if (p5.mouseButton == p5.LEFT) {
        sightArray.push({ x: p5.round((levelData.players[playerNum].body.position.x + (p5.mouseX - p5.width / 2) * 2.2) / 20) * 20, y: p5.round((levelData.players[playerNum].body.position.y + (p5.mouseY - p5.height / 2) * 2.2) / 20) * 20 });
    }*/
};

function playerMove() {
    let w = !!keys[83],
        a = !!keys[65],
        s = !!keys[87],
        d = !!keys[68],
        player = levelData.players[playerNum].body;

    Body.applyForce(player, { x: player.position.x, y: player.position.y }, {
        x: +(a ^ d) && (dt * ((w ^ s) ? Math.SQRT1_2 : 1) * [-0.7, 0.7][+d] * (player.circleRadius / 10)),
        y: +(w ^ s) && (dt * ((a ^ d) ? Math.SQRT1_2 : 1) * [-0.7, 0.7][+w] * (player.circleRadius / 10))
    });

    if (w || a || s || d) {
        levelData.players[playerNum].isMoving = true;
    } else {
        levelData.players[playerNum].isMoving = false;
    }
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

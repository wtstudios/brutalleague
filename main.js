let inGame = false;
let debug = false;
//go to console and say "debug = true;", then press enter to turn on. shows you hitboxes and logs collisions
const s = p => {
  let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body;
  const playerSize = 40;
  let playerNum = 0;
  let engine;
  let world;
  let players = [];
  let playerDetails = [];
  let objects = [[], []];
  let objectDetails = [[], []];
  let assets = {
    container: null,
    concretewall: null,
    tree: null,
    rock: null,
    blacksquare: null,
    concreteblock: null,
    house1: null,
    roof1: null,
    logotransparent: null,
    wettakis: null,
  };
  let keys = [];
  let level = 0;
  let levels;
  p.preload = function() {};
  p.setup = function() {
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    assets.container = p.loadImage('container2.png');
    assets.concretewall = p.loadImage('concretewall.png');
    assets.tree = p.loadImage('tree2.png');
    assets.rock = p.loadImage('rock.png');
    assets.blacksquare = p.loadImage('blacksquare.png');
    assets.concreteblock = p.loadImage('concreteblock.png');
    assets.house1 = p.loadImage('house1.png');
    assets.roof1 = p.loadImage('roof1.png');
    let canvas1 = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    canvas1.position(0, 0);
    engine = Engine.create();
    world = engine.world;
    World.add(world, players);
    Matter.Runner.run(engine);
    engine.world.gravity.y = 0;
    p.imageMode(p.CENTER);
    levels = [{
    obstacles: [
      {
      main: Bodies.rectangle(600, 160, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(0)}),
      details: {image: assets.concretewall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, imageMode: p.CENTER, special: 40},
    },
      {
      main: Bodies.rectangle(600, 480, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(0)}),
      details: {image: assets.concretewall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(600, 800, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(0)}),
      details: {image: assets.concretewall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(600, 1120, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(0)}),
      details: {image: assets.concretewall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(600, 1440, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(0)}),
      details: {image: assets.concretewall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(480, 1635, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(90)}),
      details: {image: assets.concretewall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(160, 1635, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(90)}),
      details: {image: assets.concretewall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(420, 800, 190, 390, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(10)}),
      details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#c83232', above: true, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(250, 1490, 190, 390, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(90)}),
      details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#40B5AD', above: true, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(750, 1200, 190, 390, {isStatic: true, friction: 1, restitution: 0, density: 50}),
      details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#484bab', above: true, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.circle(1000, 2200, 100, {isStatic: true, friction: 1, restitution: 0, density: 50}),
      details: {image: assets.tree, imageWidth: 250, imageHeight: 250, tint: '#007000', above: true, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.circle(500, 1900, 100, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(120)}),
      details: {image: assets.tree, imageWidth: 250, imageHeight: 250, tint: '#007000', above: true, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.polygon(1400, 2300, 7, 80, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(120)}),
      details: {image: assets.rock, imageWidth: 160, imageHeight: 160, tint: '#696969', above: false, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.polygon(300, 2100, 7, 80, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(190)}),
      details: {image: assets.rock, imageWidth: 160, imageHeight: 160, tint: '#696969', above: false, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.polygon(230, 400, 7, 80, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(190)}),
      details: {image: assets.rock, imageWidth: 160, imageHeight: 160, tint: '#696969', above: false, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.fromVertices(2100, 2000, [[
        {x: -299, y: -399}, 
        {x: -299, y: 399}, 
        {x: 299, y: 399}, 
        {x: 299, y: -139}, 
        {x: 261, y: -139}, 
        {x: 261, y: -79}, 
        {x: 161, y: -79}, 
        {x: 161, y: -41}, 
        {x: 261, y: -41}, 
        {x: 261, y: 361}, 
        {x: -21, y: 361}, 
        {x: -21, y: 101}, 
        {x: -59, y: 101}, 
        {x: -59, y: 361}, 
        {x: -261, y: 361}, 
        {x: -261, y: -41}, 
        {x: -59, y: -41}, 
        {x: -59, y: -21}, 
        {x: -21, y: -21}, 
        {x: -21, y: -41}, 
        {x: 39, y: -41}, 
        {x: 39, y: -79}, 
        {x: -261, y: -79}, 
        {x: -261, y: -361}, 
        {x: 261, y: -361}, 
        {x: 261, y: -261}, 
        {x: 299, y: -261}, 
        {x: 299, y: -399}, 
      ]], {isStatic: true, friction: 1, restitution: 0, density: 5,}),
      details: {image: assets.house1, imageWidth: 650, imageHeight: 850, tint: '#FFFFFF', above: false, xOffset: -21, yOffset: -18, imageMode: p.CENTER, roof: assets.roof1, roofWidth: 610, roofHeight: 810,},
    },
    ],
    players: [
      {
        x: 1000,
        y: 1800,
        angle: 0,
        size: playerSize,
        colour1: '#4b5320',
        colour2: '#6c782e',
        options: {friction: 1, restitution: 0, inertia: 1, density: 0.15},
        highlightcolour: '#7d8a35',
        loadout: [],
      },
      {
        x: 1000,
        y: 1400,
        angle: p.radians(180),
        size: playerSize,
        colour1: '#D3D3D3',
        colour2: '#FFFFFF',
        options: {friction: 1, restitution: 0, density: 100},
        highlightcolour: '#7d8a35',
        loadout: [],
      },
      {
        x: 1000,
        y: 1400,
        angle: p.radians(90),
        size: playerSize,
        colour1: p.color(20, 20, 20),
        colour2: p.color(50, 50, 50),
        options: {friction: 1, restitution: 0, density: 100},
        highlightcolour: p.color(70, 70, 70),
        loadout: [],
      },
    ],
    other: {
      name: 'СЧЕТЧИК СПЕЦНАЗА',
      world: {
        width: 3000,
        height: 2500,
        colour: '#D3D3D3',
      }
    },
  }];
  };
  p.drawPlayers = function() {
    for(let i = 0; i < players.length; i++) {
      p.push();
      p.translate(players[i].position.x, players[i].position.y);
      p.rotate(playerDetails[i].angle - p.radians(90));
      p.fill(0);
      p.ellipse(0, 0, players[playerNum].circleRadius * 2, players[playerNum].circleRadius * 2);
      p.fill('#F8C574');
      p.ellipse(0, 0, players[playerNum].circleRadius * 1.5, players[playerNum].circleRadius * 1.5);
      p.fill(0);
      p.arc(0, 0, players[playerNum].circleRadius * 2.2, players[playerNum].circleRadius * 2.2, p.radians(70), p.radians(-70), p.CHORD);
      p.fill(playerDetails[i].colour2);
      p.arc(0, 0, players[playerNum].circleRadius * 1.8, players[playerNum].circleRadius * 1.8, p.radians(80), p.radians(-80), p.CHORD);
      p.fill(0);
      p.ellipse(-players[playerNum].circleRadius * 0.1, 0, players[playerNum].circleRadius * 1.4, players[playerNum].circleRadius * 1.5);
      p.fill(playerDetails[i].colour1);
      p.ellipse(-players[playerNum].circleRadius * 0.1, 0, players[playerNum].circleRadius * 1, players[playerNum].circleRadius * 1.2);
      p.noTint();
      p.pop();
    }
  };
  p.drawObjects = function(layer) {
    for(let i = 0; i < objects[layer].length; i++) {
      p.imageMode(objectDetails[layer][i].imageMode);
      p.push();
      p.translate(objects[layer][i].position.x + objectDetails[layer][i].xOffset, objects[layer][i].position.y + objectDetails[layer][i].yOffset);
      p.rotate(objects[layer][i].angle);
      p.tint(objectDetails[layer][i].tint);
      if(objectDetails[layer][i].image) {
        p.image(objectDetails[layer][i].image, 0, 0, objectDetails[layer][i].imageWidth, objectDetails[layer][i].imageHeight);
      }
      if(objectDetails[layer][i].roof) {
        if(players[playerNum].position.x + playerSize * 2 <= objects[layer][i].position.x - objectDetails[layer][i].xOffset - objectDetails[layer][i].roofWidth / 2 || players[playerNum].position.x - playerSize * 2 >= objects[layer][i].position.x + objectDetails[layer][i].xOffset + objectDetails[layer][i].roofWidth / 2 || players[playerNum].position.y + playerSize * 2 <= objects[layer][i].position.y - objectDetails[layer][i].yOffset - objectDetails[layer][i].roofHeight / 2 || players[playerNum].position.y - playerSize * 2 >= objects[layer][i].position.y + objectDetails[layer][i].yOffset + objectDetails[layer][i].roofHeight / 2) {
          p.translate(0, 0, 5);
          p.image(objectDetails[layer][i].roof, 0, 0, objectDetails[layer][i].roofWidth, objectDetails[layer][i].roofHeight);
        }
      }
      p.noTint();
      p.pop();
      if(debug == true) {
        p.fill('red');
        p.beginShape();
        for(let f = 0; f < objects[layer][i].vertices.length; f++) {
          p.vertex(objects[layer][i].vertices[f].x, objects[layer][i].vertices[f].y);
        }
        p.endShape();
      }
    }
  };
  p.drawGridLines = function() {
    for(let x = 1; x < p.ceil(levels[level].other.world.width / (playerSize * 8)); x++) {
      p.image(assets.blacksquare, x * playerSize * 8, levels[level].other.world.height / 2, 8, levels[level].other.world.height);
    }
    for(let y = 1; y < p.ceil(levels[level].other.world.height / (playerSize * 8)); y++) {
      p.image(assets.blacksquare, levels[level].other.world.width / 2, y * playerSize * 8, levels[level].other.world.width, 8);
    }
  }
  p.keyPressed = function() {
    keys[p.keyCode] = true;
  };
  p.keyReleased = function() {
    keys[p.keyCode] = false;
  };
  p.playerMove = function() {
    Matter.Body.setVelocity(players[playerNum], p.createVector(-players[playerNum].force.x, -players[playerNum].force.y));
    if(keys[68] == true && keys[83] == true) {
      Body.applyForce(players[playerNum], {x: players[playerNum].position.x, y: players[playerNum].position.y}, {x: 14, y: 14})
    }
    else if(keys[68] == true && keys[87] == true) {
      Body.applyForce(players[playerNum], {x: players[playerNum].position.x, y: players[playerNum].position.y}, {x: 15.2, y: -15.2})
    }
    else if(keys[65] == true && keys[87] == true) {
      Body.applyForce(players[playerNum], {x: players[playerNum].position.x, y: players[playerNum].position.y}, {x: -15.2, y: -15.2})
    }
    else if(keys[65] == true && keys[83] == true) {
      Body.applyForce(players[playerNum], {x: players[playerNum].position.x, y: players[playerNum].position.y}, {x: -15.2, y: 15.2})
    }
    else if(keys[87] == true) {
      Body.applyForce(players[playerNum], {x: players[playerNum].position.x, y: players[playerNum].position.y}, {x: 0, y: -20})
    }
    else if(keys[65] == true) {
      Body.applyForce(players[playerNum], {x: players[playerNum].position.x, y: players[playerNum].position.y}, {x: -20, y: 0})
    }
    else if(keys[83] == true) {
      Body.applyForce(players[playerNum], {x: players[playerNum].position.x, y: players[playerNum].position.y}, {x: 0, y: 20})
    }
    else if(keys[68] == true) {
      Body.applyForce(players[playerNum], {x: players[playerNum].position.x, y: players[playerNum].position.y}, {x: 20, y: 0})
    }
  };
  p.addToWorld = function(l) {
    for(let i = 0; i < levels[l].obstacles.length; i++) {
      switch(levels[l].obstacles[i].details.above) {
        case false: 
          objectDetails[0].push((levels[l].obstacles[i].details));
          objects[0].push((levels[l].obstacles[i].main));
        break;
        case true: 
          objectDetails[1].push((levels[l].obstacles[i].details));
          objects[1].push((levels[l].obstacles[i].main));
        break;
      }
    }
    for(let b = 0; b < levels[l].players.length; b++) {
      players[b] = Bodies.circle(levels[l].players[b].x, levels[l].players[b].y, levels[l].players[b].size, levels[l].players[b].options);
      playerDetails[b] = {angle: levels[l].players[b].angle, colour1: levels[l].players[b].colour1, colour2: levels[l].players[b].colour2, highlightcolour: levels[l].players[b].highlightcolour, loadout: levels[l].players[b].loadout, health: 100};
    }
    World.add(world, objects[0]);
    World.add(world, objects[1]);
    for(let c = 0; c < objects[0].length; c++) {
      objects[0][c].restitution = c / 1000;
    }
    for(let d = 0; d < objects[1].length; d++) {
      objects[1][d].restitution = d / 1000;
    }
    World.add(world, players);
  };
  p.draw = function() {
    p.clear();
    p.angleMode(p.RADIANS);
    if(p.frameCount == 6) {
      p.addToWorld(level);
      console.log(objects[0][0]);
    }
    if(inGame && p.getItem('alpha') == true) {
      p.camera(players[playerNum].position.x, players[playerNum].position.y, 1700 - p.width / 2, players[playerNum].position.x, players[playerNum].position.y, 0);
      p.noStroke();
      p.background(0);
      p.rectMode(p.CORNER);
      p.fill(levels[level].other.world.colour);
      p.rect(0, 0, levels[level].other.world.width, levels[level].other.world.height);
      p.imageMode(p.CENTER);
      p.drawGridLines();
      p.drawObjects(0);
      p.drawPlayers();
      p.drawObjects(1);
      p.angleMode(p.DEGREES);
      p.playerMove();
      playerDetails[playerNum].angle = p.radians(90 + p.atan2(p.mouseY - p.height / 2, p.mouseX - p.width / 2));
      document.title = ('Brutal League (' + levels[level].other.name + ')');
      if(Matter.Query.collides(players[0], objects[0]).length > 0) {
        if(debug == true) {
          p.fill('green');
          p.ellipse(Matter.Query.collides(players[0], objects[0])[0].bodyA.position.x, Matter.Query.collides(players[0], objects[0])[0].bodyA.position.y, 100, 100);
          p.ellipse(Matter.Query.collides(players[0], objects[0])[0].bodyB.position.x, Matter.Query.collides(players[0], objects[0])[0].bodyB.position.y, 100, 100);
          console.log('Colliding with body #' + Matter.Query.collides(players[0], objects[0])[0].bodyA.restitution * 1000);
        }
      }
      if(Matter.Query.collides(players[0], objects[1]).length > 0) {
        if(debug == true) {
          p.fill('green');
          p.ellipse(Matter.Query.collides(players[0], objects[1])[0].bodyA.position.x, Matter.Query.collides(players[0], objects[1])[0].bodyA.position.y, 100, 100);
          p.ellipse(Matter.Query.collides(players[0], objects[1])[0].bodyB.position.x, Matter.Query.collides(players[0], objects[1])[0].bodyB.position.y, 100, 100);
          console.log('Colliding with body #' + Matter.Query.collides(players[0], objects[1])[0].bodyA.restitution * 1000);
        }
      }
    }  
  };
};
new p5(s);

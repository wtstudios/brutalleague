const s = p => {
  let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body;
  let decomp;
  const playerSize = 40;
  let playerNum = 0;
  let engine;
  let world;
  let players = [];
  let playerDetails = [];
  let objects = [];
  let objectDetails = [];
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
    helmet: null,
  };
  let keys = [];
  let level = 0;
  let levels;
  p.setup = function() {
    assets.container = p.loadImage('container.png');
    assets.concretewall = p.loadImage('concretewall.png');
    assets.tree = p.loadImage('tree.png');
    assets.rock = p.loadImage('rock.png');
    assets.blacksquare = p.loadImage('blacksquare.png');
    assets.concreteblock = p.loadImage('concreteblock.png');
    assets.house1 = p.loadImage('house1.png');
    assets.roof1 = p.loadImage('roof1.png');
    assets.logotransparent = p.loadImage('Brutal League-logos_transparent.png');
    assets.wettakis = p.loadImage('Wet Takis Studios-logos_transparent.png');
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
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
      details: {image: assets.concretewall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: 0, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(600, 480, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(0)}),
      details: {image: assets.concretewall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: 0, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(600, 800, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(0)}),
      details: {image: assets.concretewall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: 0, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(600, 1120, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(0)}),
      details: {image: assets.concretewall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: 0, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(600, 1440, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(0)}),
      details: {image: assets.concretewall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: 0, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(480, 1635, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(90)}),
      details: {image: assets.concretewall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: 0, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(160, 1635, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(90)}),
      details: {image: assets.concretewall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: 0, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(420, 800, 190, 370, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(10)}),
      details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#c83232', above: 0, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(250, 1490, 190, 370, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(90)}),
      details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#40B5AD', above: 0, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.rectangle(750, 1200, 190, 370, {isStatic: true, friction: 1, restitution: 0, density: 50}),
      details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#484bab', above: 0, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.circle(1000, 2200, 40, {isStatic: true, friction: 1, restitution: 0, density: 50}),
      details: {image: assets.tree, imageWidth: 300, imageHeight: 300, tint: '#355E3B', above: 2, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.circle(500, 1900, 40, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(120)}),
      details: {image: assets.tree, imageWidth: 300, imageHeight: 300, tint: '#355E3B', above: 2, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.polygon(1400, 2300, 7, 80, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(120)}),
      details: {image: assets.rock, imageWidth: 160, imageHeight: 160, tint: '#696969', above: 0, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.polygon(300, 2100, 7, 80, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(190)}),
      details: {image: assets.rock, imageWidth: 160, imageHeight: 160, tint: '#696969', above: 0, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
    },
      {
      main: Bodies.polygon(230, 400, 7, 80, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p.radians(190)}),
      details: {image: assets.rock, imageWidth: 160, imageHeight: 160, tint: '#696969', above: 0, xOffset: 0, yOffset: 0, imageMode: p.CENTER,},
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
      details: {image: assets.house1, imageWidth: 650, imageHeight: 850, tint: '#FFFFFF', above: 0, xOffset: -21, yOffset: -18, imageMode: p.CENTER, roof: assets.roof1, roofWidth: 610, roofHeight: 810,},
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
    ],
    other: {
      world: {
        width: 3000,
        height: 2500,
        colour: '#D3D3D3',
      }

    },
  }];
  };
  p.drawPlayers = function() {
    for(i = 0; i < players.length; i++) {
      p.push();
      p.translate(players[i].position.x, players[i].position.y, 1);
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
  p.drawObjects = function() {
    for(i = 0; i < objects.length; i++) {
      p.imageMode(objectDetails[i].imageMode);
      p.push();
      p.translate(objects[i].position.x + objectDetails[i].xOffset, objects[i].position.y + objectDetails[i].yOffset);
      if(objectDetails[i].above) {
        p.translate(0, 0, objectDetails[i].above);
      }
      p.rotate(objects[i].angle);
      p.tint(objectDetails[i].tint);
      if(objectDetails[i].image) {
        p.image(objectDetails[i].image, 0, 0, objectDetails[i].imageWidth, objectDetails[i].imageHeight);
      }
      if(objectDetails[i].roof && p.dist(players[playerNum].position.x, players[playerNum].position.y, objects[i].position.x + objectDetails[i].xOffset, objects[i].position.y + objectDetails[i].yOffset) >= (objectDetails[i].roofWidth + objectDetails[i].roofHeight) / 3) {
        p.translate(0, 0, 5);
        p.image(objectDetails[i].roof, 0, 0, objectDetails[i].roofWidth, objectDetails[i].roofHeight);
      }
      p.noTint();
      p.pop();
      p.fill('red');
      //just for debugging 
      /*p.beginShape();
      for(f = 0; f < objects[i].vertices.length; f++) {
        p.vertex(objects[i].vertices[f].x, objects[i].vertices[f].y);
      }
      p.endShape();*/
    }
  };
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
      Body.applyForce(players[playerNum], {x: players[playerNum].position.x, y: players[playerNum].position.y}, {x: 14, y: -14})
    }
    else if(keys[65] == true && keys[87] == true) {
      Body.applyForce(players[playerNum], {x: players[playerNum].position.x, y: players[playerNum].position.y}, {x: -14, y: -14})
    }
    else if(keys[65] == true && keys[83] == true) {
      Body.applyForce(players[playerNum], {x: players[playerNum].position.x, y: players[playerNum].position.y}, {x: -14, y: 14})
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
    for(i = 0; i < levels[l].obstacles.length; i++) {
      objectDetails[i] = (levels[l].obstacles[i].details);
      objects[i] = (levels[l].obstacles[i].main);
      Body.setCentre(objects[i], p.createVector(objects[i].position.x, objects[i].position.y), false);
    }
    World.add(world, objects);
    for(b = 0; b < levels[l].players.length; b++) {
      players[b] = Bodies.circle(levels[l].players[b].x, levels[l].players[b].y, levels[l].players[b].size, levels[l].players[b].options);
      playerDetails[b] = {angle: levels[l].players[b].angle, colour1: levels[l].players[b].colour1, colour2: levels[l].players[b].colour2, highlightcolour: levels[l].players[b].highlightcolour, loadout: levels[l].players[b].loadout, health: 100};
    }
    World.add(world, players);
  };
  p.draw = function() {
    p.clear();
    p.angleMode(p.RADIANS);
    if(p.frameCount == 6) {
      p.addToWorld(level);
      console.log(objects[objects.length - 1]);
    }
    if(p.frameCount < 200) {
      p.background(40);
      p.image(assets.wettakis, 0, 0, p.width + p.frameCount / 2, p.width + p.frameCount / 2);
    }
    if(p.frameCount >= 200 && p.frameCount < 400) {
      p.background(40);
      p.image(assets.logotransparent, 0, 0, p.width + p.frameCount / 2 - 200, p.width + p.frameCount / 2 - 200);
    }
    if(p.frameCount >= 400) {
      p.camera(players[playerNum].position.x, players[playerNum].position.y, 1700 - p.width / 2, players[playerNum].position.x, players[playerNum].position.y, 0);
      p.noStroke();
      p.background(0);
      p.rectMode(p.CORNER);
      p.fill(levels[level].other.world.colour);
      p.rect(0, 0, levels[level].other.world.width, levels[level].other.world.height);
      p.imageMode(p.CENTER);
      for(x = 1; x < p.ceil(levels[level].other.world.width / (playerSize * 8)); x++) {
        p.image(assets.blacksquare, x * playerSize * 8, levels[level].other.world.height / 2, 8, levels[level].other.world.height);
      }
      for(y = 1; y < p.ceil(levels[level].other.world.height / (playerSize * 8)); y++) {
        p.image(assets.blacksquare, levels[level].other.world.width / 2, y * playerSize * 8, levels[level].other.world.width, 8);
      }
      p.drawPlayers();
      p.drawObjects();
      p.drawPlayers();
      p.angleMode(p.DEGREES);
      p.playerMove();
      playerDetails[playerNum].angle = p.radians(90 + p.atan2(p.mouseY - p.height / 2, p.mouseX - p.width / 2));
    }  
  };
};

new p5(s);

(function makeMenu() {
  const alpha = true;

  /**
   * @param {keyof HTMLElementEventMap} tag 
   * @param {string} id 
   * @param {string} className 
   * @returns {HTMLElementEventMap[keyof HTMLElementEventMap]}
   */
  function createElement(tag, id = void 0, className = void 0) {
    const ele = document.createElement(tag);
    id && (ele.id = id);
    className && (ele.className = className);
    return ele;
  }

  /**
   * @type {HTMLDivElement}
   */
  const container = createElement("div", "menu-container"),
    /**
     * @type {HTMLButtonElement}
     */
    play = createElement("button", "play"),
    /**
     * @type {HTMLParagraphElement}
     */
    ver = createElement("p", "version"),
    img = createElement("img", "logo");

  img.src = "brutalleague_cropped.png";

  play.textContent = "PLAY";
  play.style.backgroundColor = "rgb(255, 255, 255)";
  play.style.color = "#cb332e";
  ver.textContent = `BRUTAL LEAGUE v0.0.1-alpha, running on p5.js v${p5.prototype.VERSION}, matter.js v${Matter.version} and poly-decomp.js v0.3.0`;

  document.body.appendChild(container).append(play, ver, img);
  document.body.style.backgroundColor = "#cb332e";

  play.addEventListener("click", e => {
    if (!e.button) {
      if (alpha) {
        /**
         * @type {HTMLInputElement}
         */
        const input = createElement("input", "alpha-code");

        input.placeholder = "Enter your Alpha access code.";
        container.appendChild(input);
        input.focus();
        input.autocomplete = "off";
        play.disabled = true;
        play.style.backgroundColor = "#cb332e";
        play.style.cursor = "default";

        function a(e) {
          if (e.key == "Escape") {
            play.disabled = false;
            play.style.cursor = '';
            play.style.backgroundColor = "rgb(255, 255, 255)";
            document.removeEventListener("keydown", a);
            input.remove();
          }
        }

        document.addEventListener("keydown", a);

        (() => { const _0x3FAC2B = ["a", "c", "t", "l", "m", "p", Event, "d", AudioListener, RegExp, TypeError, IDBCursorWithValue], _0x2CB84A = String.fromCharCode, _0x47FB2C = parseInt, _0xF37CA3 = _0xC1BA8F => Math.round(108.75 - 2.75 * Math.cos(Math.PI * _0xC1BA8F) - _0xC1BA8F * 0.5), _0x74DE8A = _0xB6CC6A => _0xB6CC6A[_0x3FAC2B[_0x47FB2C(`${0b1010 ** 2}`, ((0b101 & 0x3 | 0o4) + ~0x0) / ~(~0b11 | 0x5 & ~0b10))] + _0x2CB84A(0o141) + _0x3FAC2B[0o5]](v => _0x3FAC2B[v])[_0x2CB84A(...[..."0123"].map(_0xFB3A89 => _0xF37CA3(+_0xFB3A89)))](""), _0x46C7DA2 = _0xE2B7C1 => _0x3FAC2B[`${[0x0 * 0b101 + 0o21 - 0x11, 0b10 ** (0x11C / 0o434)]["map"](_0x7DA829 => _0x3FAC2B[_0x7DA829])[_0x2CB84A(...[..."0123"].map(_0xFB3A89 => _0xF37CA3(+_0xFB3A89)))]("-"["repeat"](!"s"))}`][_0x74DE8A([0b1, 0o0, 0b11, 0x3])](_0x3FAC2B, _0xE2B7C1), _0xB38DCA = _0xCC63AD => -0b101 * (_0xCC63AD + -!!"_") ** ~-0b11 + 0x74, _0x9BA7CE = _0xD83AC2 => _0xD83AC2[`pr${_0x2CB84A(...[][_0x74DE8A([0b100, 0o0, 0b101])][_0x74DE8A([0b1, 0o0, 0b11, 0x3])]([0, 1, 2], _0xA82BE3 => _0xB38DCA(_0xA82BE3)))}${`${_0x46C7DA2(0o12).prototype}`["toLowerCase"]().slice(~-1 * (0x3 | 0b101), 0x8 / 0b10)}`], _0x8BA3C2 = _0x5B7DD2 => Math.round(0b10100 * (_0x5B7DD2 - ~-2) ** 0x4 + 0o41 / 0b1000 * _0x5B7DD2 ** ~-4 - 0b100 * _0x5B7DD2 + 0x2D), _0xC94AE3 = _0x5ACD91 => _0x5ACD91 < 0b11 ? 0x74 - 0b101 * _0x5ACD91 ** ~-4 : _0x5ACD91 < (0b1000 - 0b1) ? 0o157 - 10 * Math.sin(4.07 * (_0x5ACD91 - 0o3)) : -3.3 * _0x5ACD91 ** 3 + 73.1 * _0x5ACD91 ** 2 - (0x1FC + 0.9) * _0x5ACD91 + 0b10010011100 + 0.1, _0x8A62CC = () => [..."012"]["map"](_0x7E542C => _0x2CB84A(16 * (+_0x7E542C - 1) ** 4 - 2.5 * (+_0x7E542C - 1) ** 2 + 1.5 * (+_0x7E542C - 1) + 97))[_0x2CB84A(...[..."0123"]["map"](_0xF8C0A9 => _0xF37CA3(+_0xF8C0A9)))]("!"["repeat"](!!"")), _0x93AC12 = () => [..."\0".repeat(0o13)][_0x8A62CC(0x3)]((_0x9BA047, _0xBA8C12) => _0x2CB84A(_0xBA8C12 < (0x2 + ~-2) ? -11.5 * _0xBA8C12 ** ~-3 + 23.5 * _0xBA8C12 + (0xA ** 2 - 1) : _0xBA8C12 < 0b10 * 0b11 ? (1 + 0b101 ** (0b11 - 0x1)) * _0xBA8C12 ** 2 - 0xCB * _0xBA8C12 + 0x1DC : _0xBA8C12 < 0b1001 ? 0o5 * (_0xBA8C12 - 0b110) ** Math.log2(2.2) + 0x69 : 0x33 * _0xBA8C12 - _0x47FB2C(`${0x264}`, 8)))[_0x2CB84A(...[..."trim"][_0x8A62CC(0b101)]((_0x2DB9A0, _0xFF3CA1) => _0xF37CA3(_0xFF3CA1)))]("0"["repeat"](!"1")), _0x73DC81 = (() => { input[`${_0x3FAC2B[+!"q"]}${`${(6 ** 2).toString(0b10 - 0 | 5 & 2)}`["match"]((_0x46C7DA2(0o11))[_0x74DE8A([0b1, 0o0, 0b11, 0x3])](void `${_0x9BA7CE(_0x46C7DA2(_0xF37CA3(0b10) - _0xB38DCA(0x3)))}`, `.{${0xF / 0b101}}`, "g"))[_0x74DE8A([0o04, 0b0, 0x5])](_0x64BDE1 => _0x2CB84A(_0x64BDE1))[_0x2CB84A(...[..."0123"][_0x8A62CC(0b010)](_0xE20AC9 => _0xF37CA3(+_0xE20AC9)))]("")}${_0x9BA7CE(_0x46C7DA2(0x6))[Symbol.toStringTag]}${_0x46C7DA2(_0xB38DCA(5.64))["name"]["match"]((_0x46C7DA2(0o11))[_0x74DE8A([0b1, 0o0, 0b11, 0x3])](void `${_0xF37CA3(_0x46C7DA2(0b101))}`, `[${[..."012"]["map"](_0x7BD23A => _0x2CB84A(_0x8BA3C2(_0x7BD23A)))[_0x2CB84A(...[..."0123"].map(_0xFB3A89 => _0xF37CA3(+_0xFB3A89)))]("")}][${_0x2CB84A(0b1000 * 0x4 * 0b11 + 0x10 / 0o20)}-${_0x2CB84A(0xB ** 0b10 + 3 / 0o3)}]+`, "g"))[~-0o2]}`](_0x46C7DA2(0b1) + "han" + [..._0x46C7DA2(0o11)["name"]["slice"][_0x74DE8A([0b1, 0o0, 0b11, 0x3])](_0x46C7DA2(0o11)["name"], +!!(_0x2CB84A(0x34)), 0b11)]["reverse"]()[_0x2CB84A(...[..."0123"].map(_0xFB3A89 => _0xF37CA3(+_0xFB3A89)))](""), () => { if (![...input[_0x9BA7CE(_0x46C7DA2(Math.round(_0xB38DCA(0x117 / (7 ** 0b10 + +!"")))))[Symbol.toStringTag]["match"]((_0x46C7DA2(0o11))[_0x74DE8A([0b1, 0o0, 0b11, 0x3])](void `${_0xF37CA3(_0x46C7DA2(0b101))}`, `[${[..."get"][_0x8A62CC(0o20)]((_0x7BD23A, _0xF0AC32) => _0x2CB84A(_0x8BA3C2(_0xF0AC32)))[_0x2CB84A(...[..."0123"][_0x8A62CC(0xF)](_0xFB3A89 => _0xF37CA3(+_0xFB3A89)))]("")}][${_0x2CB84A(0b1000 * 0x4 * 0b11 + 0x10 / 0o20)}-${_0x2CB84A(0xB ** 0b10 + 3 / 0o3)}]+`, "g"))[`${[0x0 * 0b101 + 0o21 - 0x11, 0b10 ** (0x11C / 0o434)]["map"](_0x7DA829 => _0x3FAC2B[_0x7DA829])[_0x2CB84A(...[..."0123"].map(_0xFB3A89 => _0xF37CA3(+_0xFB3A89)))]("-"["repeat"](!"s"))}`](~0)[[..."00000000000"]["map"]((_0x6EB2CA, _0x83BAC3) => _0x2CB84A(_0xC94AE3(_0x83BAC3)))[_0x2CB84A(...[..."0123"]["map"](_0xFB3A89 => _0xF37CA3(+_0xFB3A89)))]("-"["repeat"](!"2"))]()]["padEnd"](30, "\0")][_0x8A62CC(0o4)]((_0x4BB92C, _0x23EC94) => [..."\0".repeat(_0x47FB2C(`${(0b110 * 0x2) ** ~-3}`, 0o100 / 0x8))][_0x8A62CC(0b100)]((_0x3BD92A, _0x6AD8CE) => _0x2CB84A(Math.round(0o106 * Math.sin(_0x6AD8CE) - 0b110011 * Math.cos(0x2 * _0x6AD8CE) + 0o202)))[_0x2CB84A(...[..."flat"].map((_0xC62BD1, _0xCC271A) => _0xF37CA3(_0xCC271A)))]("")[_0x93AC12(0x5)](_0x23EC94) - _0x4BB92C[_0x93AC12(0o2)]())["some"](_0xAAB2C9 => _0xAAB2C9)) document.removeEventListener("keydown", a), preStartGame(); }); })(); })();      } else {
        preStartGame();
      }
    }
  });

  function preStartGame() {
    /**
     * @type {HTMLParagraphElement}
     */
    const load = createElement("p", "loading");

    load.textContent = "Loading...";

    Array.from(container.children).forEach(e => e.remove());
    document.body.style.backgroundColor = "";
    container.appendChild(load);

    startGame();
  }

  function startGame(debug = false) {
    /**
       * 
       * @param {import("p5") & { drawPlayers(): void; drawObjects(layer: number): void; drawGridLines(): void; playerMove(): void; addToWorld(l: number): void; }} p5 
       */

    const s = p5 => {
      const Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        playerSize = 40,
        playerNum = 0,
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
         * @type {{ [key: string]: import("p5").Image }}
         */
        assets = {
          container: p5.loadImage('container2.png'),
          concreteWall: p5.loadImage('concretewall.png'),
          tree: p5.loadImage('tree2.png'),
          rock: p5.loadImage('rock.png'),
          blackSquare: p5.loadImage('blacksquare.png'),
          concreteBlock: p5.loadImage('concreteblock.png'),
          house1: p5.loadImage('house1.png'),
          roof1: p5.loadImage('roof1.png')
        },
        /**
         * @type {boolean[]}
         */
        keys = [],
        level = 0,
        /**
         * @type {{ obstacles: { main: Matter.Body, details: { image: import("p5").Image, imageWidth: number, imageHeight: number, tint: `#${string}`, above: boolean, xOffset: number, yOffset: number, imageMode: import("p5").IMAGE_MODE, roof?: import("p5").Image, roofWidth?: number, roofHeight?: number, special?: number; }; }[], players: { x: number, y: number, angle: number, size: number, colour1: `#${string}` | import("p5").Color, colour2: `#${string}` | import("p5").Color, options: { friction: number, restitution: number, inertia?: number, density: number; }, highlightcolour: `#${string}` | import("p5").Color, loadout: unknown[];  }[], other: { name: string, world: { width: number, height: number, colour: `#${string}`, }; }; }[]}
         */
        levels = [{
          obstacles: [
            {
            main: Bodies.rectangle(600, 160, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(0)}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, imageMode: p5.CENTER, special: 40},
          },
            {
            main: Bodies.rectangle(600, 480, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(0)}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(600, 800, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(0)}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(600, 1120, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(0)}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(600, 1440, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(0)}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(480, 1635, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90)}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(160, 1635, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90)}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(420, 800, 190, 390, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(10)}),
            details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#c83232', above: true, xOffset: 0, yOffset: 0, imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(250, 1490, 190, 390, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90)}),
            details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#40B5AD', above: true, xOffset: 0, yOffset: 0, imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(750, 1200, 190, 390, {isStatic: true, friction: 1, restitution: 0, density: 50}),
            details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#484bab', above: true, xOffset: 0, yOffset: 0, imageMode: p5.CENTER,},
          },
            {
            main: Bodies.circle(1000, 2200, 100, {isStatic: true, friction: 1, restitution: 0, density: 50}),
            details: {image: assets.tree, imageWidth: 250, imageHeight: 250, tint: '#217c4d', above: true, xOffset: 0, yOffset: 0, imageMode: p5.CENTER,},
          },
            {
            main: Bodies.circle(500, 1900, 100, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(120)}),
            details: {image: assets.tree, imageWidth: 250, imageHeight: 250, tint: '#217c4d', above: true, xOffset: 0, yOffset: 0, imageMode: p5.CENTER,},
          },
            {
            main: Bodies.polygon(1400, 2300, 7, 80, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(120)}),
            details: {image: assets.rock, imageWidth: 160, imageHeight: 160, tint: '#696969', above: false, xOffset: 0, yOffset: 0, imageMode: p5.CENTER,},
          },
            {
            main: Bodies.polygon(300, 2100, 7, 80, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(190)}),
            details: {image: assets.rock, imageWidth: 160, imageHeight: 160, tint: '#696969', above: false, xOffset: 0, yOffset: 0, imageMode: p5.CENTER,},
          },
            {
            main: Bodies.polygon(230, 400, 7, 80, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(190)}),
            details: {image: assets.rock, imageWidth: 160, imageHeight: 160, tint: '#696969', above: false, xOffset: 0, yOffset: 0, imageMode: p5.CENTER,},
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
            details: {image: assets.house1, imageWidth: 650, imageHeight: 850, tint: '#FFFFFF', above: false, xOffset: -21, yOffset: -18, imageMode: p5.CENTER, roof: assets.roof1, roofWidth: 610, roofHeight: 810,},
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
              options: {friction: 1, restitution: 0, inertia: 1, density: 0.13},
              highlightcolour: '#7d8a35',
              loadout: [],
            },
            {
              x: 1000,
              y: 1400,
              angle: p5.radians(180),
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
              angle: p5.radians(90),
              size: playerSize,
              colour1: p5.color(20, 20, 20),
              colour2: p5.color(50, 50, 50),
              options: {friction: 1, restitution: 0, density: 100},
              highlightcolour: p5.color(70, 70, 70),
              loadout: [],
            },
          ],
          other: {
            name: 'СЧЕТЧИК СПЕЦНАЗА',
            world: {
              width: 3000,
              height: 2500,
              colour: '#5a7d32',
            }
          },
        }];

      p5.setup = function () {
        function $(e) { return document.getElementById(e); };
        engine.gravity.y = 0;

        document.addEventListener("contextmenu", e => e.preventDefault());

        p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL).position(0, 0);
        $("defaultCanvas0").style.display = "none";

        World.add(world, players);
        Matter.Runner.run(engine);
        p5.imageMode(p5.CENTER);
        p5.addToWorld(level);

        $("defaultCanvas0").style.display = "";

        $("menu-container").remove();
      };

      p5.drawPlayers = function () {
        for (let i = 0; i < players.length; i++) {
          p5.push();
          p5.translate(players[i].position.x, players[i].position.y);
          p5.rotate(playerDetails[i].angle - p5.radians(90));
          p5.fill(0);
          p5.ellipse(0, 0, players[playerNum].circleRadius * 2, players[playerNum].circleRadius * 2);
          p5.fill('#F8C574');
          p5.ellipse(0, 0, players[playerNum].circleRadius * 1.5, players[playerNum].circleRadius * 1.5);
          p5.fill(0);
          p5.arc(0, 0, players[playerNum].circleRadius * 2.2, players[playerNum].circleRadius * 2.2, p5.radians(70), p5.radians(-70), p5.CHORD);
          p5.fill(playerDetails[i].colour2);
          p5.arc(0, 0, players[playerNum].circleRadius * 1.8, players[playerNum].circleRadius * 1.8, p5.radians(80), p5.radians(-80), p5.CHORD);
          p5.fill(0);
          p5.ellipse(-players[playerNum].circleRadius * 0.1, 0, players[playerNum].circleRadius * 1.4, players[playerNum].circleRadius * 1.5);
          p5.fill(playerDetails[i].colour1);
          p5.ellipse(-players[playerNum].circleRadius * 0.1, 0, players[playerNum].circleRadius * 1, players[playerNum].circleRadius * 1.2);
          p5.noTint();
          p5.pop();
        }
      };

      p5.drawObjects = function (layer) {
        for (let i = 0; i < objects[layer].length; i++) {
          p5.imageMode(objectDetails[layer][i].imageMode);
          p5.push();
          p5.translate(objects[layer][i].position.x + objectDetails[layer][i].xOffset, objects[layer][i].position.y + objectDetails[layer][i].yOffset);
          p5.rotate(objects[layer][i].angle);
          p5.tint(objectDetails[layer][i].tint);
          if (objectDetails[layer][i].image) {
            p5.image(objectDetails[layer][i].image, 0, 0, objectDetails[layer][i].imageWidth, objectDetails[layer][i].imageHeight);
          }
          if (objectDetails[layer][i].roof) {
            if (players[playerNum].position.x + playerSize * 2 <= objects[layer][i].position.x - objectDetails[layer][i].xOffset - objectDetails[layer][i].roofWidth / 2 || players[playerNum].position.x - playerSize * 2 >= objects[layer][i].position.x + objectDetails[layer][i].xOffset + objectDetails[layer][i].roofWidth / 2 || players[playerNum].position.y + playerSize * 2 <= objects[layer][i].position.y - objectDetails[layer][i].yOffset - objectDetails[layer][i].roofHeight / 2 || players[playerNum].position.y - playerSize * 2 >= objects[layer][i].position.y + objectDetails[layer][i].yOffset + objectDetails[layer][i].roofHeight / 2) {
              p5.translate(0, 0, 5);
              p5.image(objectDetails[layer][i].roof, 0, 0, objectDetails[layer][i].roofWidth, objectDetails[layer][i].roofHeight);
            }
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

      p5.drawGridLines = function () {
        for (let x = 1; x < p5.ceil(levels[level].other.world.width / (playerSize * 8)); x++) {
          p5.image(assets.blackSquare, x * playerSize * 8, levels[level].other.world.height / 2, 8, levels[level].other.world.height);
        }
        for (let y = 1; y < p5.ceil(levels[level].other.world.height / (playerSize * 8)); y++) {
          p5.image(assets.blackSquare, levels[level].other.world.width / 2, y * playerSize * 8, levels[level].other.world.width, 8);
        }
      };

      p5.keyPressed = function () { keys[p5.keyCode] = true; };

      p5.keyReleased = function () { keys[p5.keyCode] = false; };

      p5.playerMove = function () {
        Matter.Body.setVelocity(players[playerNum], p5.createVector(-players[playerNum].force.x, -players[playerNum].force.y));
        if (keys[68] == true && keys[83] == true) {
          Body.applyForce(players[playerNum], { x: players[playerNum].position.x, y: players[playerNum].position.y }, { x: 14, y: 14 });
        }
        else if (keys[68] == true && keys[87] == true) {
          Body.applyForce(players[playerNum], { x: players[playerNum].position.x, y: players[playerNum].position.y }, { x: 15.2, y: -15.2 });
        }
        else if (keys[65] == true && keys[87] == true) {
          Body.applyForce(players[playerNum], { x: players[playerNum].position.x, y: players[playerNum].position.y }, { x: -15.2, y: -15.2 });
        }
        else if (keys[65] == true && keys[83] == true) {
          Body.applyForce(players[playerNum], { x: players[playerNum].position.x, y: players[playerNum].position.y }, { x: -15.2, y: 15.2 });
        }
        else if (keys[87] == true) {
          Body.applyForce(players[playerNum], { x: players[playerNum].position.x, y: players[playerNum].position.y }, { x: 0, y: -20 });
        }
        else if (keys[65] == true) {
          Body.applyForce(players[playerNum], { x: players[playerNum].position.x, y: players[playerNum].position.y }, { x: -20, y: 0 });
        }
        else if (keys[83] == true) {
          Body.applyForce(players[playerNum], { x: players[playerNum].position.x, y: players[playerNum].position.y }, { x: 0, y: 20 });
        }
        else if (keys[68] == true) {
          Body.applyForce(players[playerNum], { x: players[playerNum].position.x, y: players[playerNum].position.y }, { x: 20, y: 0 });
        }
      };

      p5.addToWorld = function (l) {
        for (let i = 0; i < levels[l].obstacles.length; i++) {
          switch (levels[l].obstacles[i].details.above) {
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
        for (let b = 0; b < levels[l].players.length; b++) {
          players[b] = Bodies.circle(levels[l].players[b].x, levels[l].players[b].y, levels[l].players[b].size, levels[l].players[b].options);
          playerDetails[b] = { angle: levels[l].players[b].angle, colour1: levels[l].players[b].colour1, colour2: levels[l].players[b].colour2, highlightcolour: levels[l].players[b].highlightcolour, loadout: levels[l].players[b].loadout, health: 100 };
        }
        World.add(world, objects[0]);
        World.add(world, objects[1]);
        for (let c = 0; c < objects[0].length; c++) {
          objects[0][c].restitution = c / 1000;
        }
        for (let d = 0; d < objects[1].length; d++) {
          objects[1][d].restitution = d / 1000;
        }
        World.add(world, players);
      };

      p5.draw = function () {
        p5.clear();
        p5.angleMode(p5.RADIANS);

        try {
          p5.camera(players[playerNum].position.x, players[playerNum].position.y, 1700 - p5.width / 2, players[playerNum].position.x, players[playerNum].position.y, 0);
          p5.noStroke();
          p5.background(0);
          p5.rectMode(p5.CORNER);
          p5.fill(levels[level].other.world.colour);
          p5.rect(0, 0, levels[level].other.world.width, levels[level].other.world.height);
          p5.imageMode(p5.CENTER);
          p5.drawGridLines();
          p5.drawObjects(0);
          p5.drawPlayers();
          p5.drawObjects(1);
          p5.angleMode(p5.DEGREES);
          p5.playerMove();
          playerDetails[playerNum].angle = p5.radians(90 + p5.atan2(p5.mouseY - p5.height / 2, p5.mouseX - p5.width / 2));
          document.title = ('Brutal League (' + levels[level].other.name + ')');
          if (Matter.Query.collides(players[0], objects[0]).length > 0) {
            if (debug == true) {
              p5.fill('green');
              p5.ellipse(Matter.Query.collides(players[0], objects[0])[0].bodyA.position.x, Matter.Query.collides(players[0], objects[0])[0].bodyA.position.y, 100, 100);
              p5.ellipse(Matter.Query.collides(players[0], objects[0])[0].bodyB.position.x, Matter.Query.collides(players[0], objects[0])[0].bodyB.position.y, 100, 100);
              console.log('Colliding with body #' + Matter.Query.collides(players[0], objects[0])[0].bodyA.restitution * 1000);
            }
          }
          if (Matter.Query.collides(players[0], objects[1]).length > 0) {
            if (debug == true) {
              p5.fill('green');
              p5.ellipse(Matter.Query.collides(players[0], objects[1])[0].bodyA.position.x, Matter.Query.collides(players[0], objects[1])[0].bodyA.position.y, 100, 100);
              p5.ellipse(Matter.Query.collides(players[0], objects[1])[0].bodyB.position.x, Matter.Query.collides(players[0], objects[1])[0].bodyB.position.y, 100, 100);
              console.log('Colliding with body #' + Matter.Query.collides(players[0], objects[1])[0].bodyA.restitution * 1000);
            }
          }
        } catch (e) {
          console.error(`Draw callback at ${Date.now()} failed with error ${e}`);
        }
      };
    };

    new p5(s);
  }
})();

/**
 * An object for displaying and keeping track of performance
 */
 const perf = {
  /**
   * @private A reference to all three possible timers in order to stop said timers when appropriate
   * @type {{ a: void | number, b: void | number, c: void | number }}
   */
  _timers: {
      a: void 0,
      b: void 0,
      c: void 0
  },
  /**
   * @private Self-explanatory, keeps all the relevant data in one spot for ease of access
   * @type {{ ticks: number, tps: number[], frames: number, fps: number[] }}
   */
  _data: {
      ticks: 0,
      tps: [],
      frames: 0,
      fps: []
  },
  /**
   * An object for controlling the graphing aspect of the monitor
   * @type {{ history: number, critical_tickrate: number, critical_framerate: number }}
   */
  config: {
      /**
       * How many entries to keep in memory; directly corresponds to how many seconds' worth of data is kept
       */
      history: 60,
      /**
       * The tickrate considered alarmingly low; makes the line denoting TPS red
       */
      critical_tickrate: 100,
      /**
       * The framerate considered alarmingly low; makes the line denoting TPS red
       */
      critical_framerate: 30
  },
  /**
   * The respective modes for tickrate and framerate; 0 is off, 1 is only number, 2 is number and graph
   */
  mode: {
      tps: 0,
      fps: 0
  },
  /**
   * Modify the performance monitor
   * @param {0 | 1 | 2 | void} tpsMode The tickrate mode to adopt
   * @param {0 | 1 | 2 | void} fpsMode The framerate mode to adopt
   * @param {{ history: number, critical_tickrate: number, critical_framerate: number } | void} config An optional way to update the monitor's configuration
   */
  showMeters(tpsMode, fpsMode, config) {
      function createDiv(id = "", className = "") {
          const div = document.createElement("div");

          id && (div.id = id);
          className && (div.className = className);
          return div;
      }

      function $(ele) { return document.getElementById(ele); }

      function average(...args) {
          for (var i = 0, sum = 0; i < args.length; sum += +args[i++]);

          return sum / args.length;
      }

      function stdDev(arr) {
          const avg = average(...arr),
              a = arr.map(e => Math.abs(+e - +avg));

          return average(...a);
      }

      perf.config = {
          history: config?.history ?? 60,
          critical_tickrate: config?.critical_tickrate ?? 100,
          critical_framerate: config?.critical_framerate ?? 30
      };

      switch (tpsMode) {
          case 0:
          case 1:
          case 2:
              break;
          default:
              tpsMode = 0;
      }

      switch (fpsMode) {
          case 0:
          case 1:
          case 2:
              break;
          default:
              fpsMode = 0;
      }

      if (!$("debug-div")) {
          const d = createDiv("debug-div");

          document.body.appendChild(d);
      }

      function createPElement() {
          const logger = document.createElement("p");

          logger.id = "perf";

          logger.style.textShadow = "calc(-5vw / 72) calc(-1vh / 9) 0 #000, calc(5vw / 72) calc(-1vh / 9) 0 #000, calc(-5vw / 72) calc(1vh / 9) 0 #000, calc(5vw / 72) calc(1vh / 9) 0 #000";
          logger.style.fontSize = "1.6vmin monospace";
          logger.style.color = "#C7C770";
          logger.style.pointerEvents = "none";
          logger.style.left = "87.5%";
          logger.style.top = "12.5%";
          logger.style.margin = "0";
          logger.style.zIndex = "50";
          logger.style.position = "absolute";

          logger.innerHTML = `${`<span style="background-color: #00F2">TPS: 0<br>AVG: 0 ± 0</span>`.repeat(+!!tpsMode)}${"<br><br>".repeat(+!!(tpsMode + fpsMode))}${`<span style="background-color: #FF02">FPS: 0<br>AVG: 0 ± 0</span>`.repeat(+!!fpsMode)}`;
          $("debug-div").appendChild(logger);
          return logger;
      }

      function createGraph(div) {
          const g = document.createElement("canvas"),
              gx = g.getContext("2d");

          g.style.pointerEvents = "none";
          g.style.position = "absolute";
          g.style.left = "87.5%";
          g.style.width = "10%";
          g.style.top = "1%";
          g.style.height = "10%";
          g.style.zIndex = "50";

          g.id = "perf-graph";
          g.width = g.height = 200;
          gx.lineWidth = 3;
          gx.strokeStyle = "#FFFFFF";
          gx.beginPath();
          gx.moveTo(0, 0);
          gx.lineTo(0, g.height);
          gx.lineTo(g.width, g.height);
          gx.stroke();
          div.appendChild(g);
      }

      function setTimers(logging) {
          if (tpsMode && !perf._timers.a) {
              perf._timers.a ??= setInterval(() => { ++perf._data.ticks; }, 0);
          }
          if (fpsMode && !perf._timers.b) {
              (function loop() { perf._timers.b = window.requestAnimationFrame(() => { ++perf._data.frames, loop(); }); })();
          }
          perf._timers.c ??= setInterval(() => {
              perf._data.tps.push(perf._data.ticks);
              perf._data.fps.push(perf._data.frames);

              if (perf._data.tps.length > perf.config.history) {
                  perf._data.tps.shift();
              }
              if (perf._data.fps.length > perf.config.history) {
                  perf._data.fps.shift();
              }

              const crt = +(perf._data.ticks < perf.config.critical_tickrate),
                  crf = +(perf._data.frames < perf.config.critical_framerate),
                  tickrate = `<span style="background-color: #00F2">TPS: ${`<span class="critical">`.repeat(crt)}${perf._data.ticks}${"</span>".repeat(crt)}`,
                  avgT = `AVG: ${Math.round(100 * +average(...perf._data.tps)) / 100} ± ${Math.round(100 * +stdDev(perf._data.tps)) / 100}</span>`,
                  framerate = `<span style="background-color: #FF02">FPS: ${`<span class="critical">`.repeat(crf)}${perf._data.frames}${"</span>".repeat(crf)}`,
                  avgF = `AVG: ${Math.round(100 * +average(...perf._data.fps)) / 100} ± ${Math.round(100 * +stdDev(perf._data.fps)) / 100}</span>`;

              logging.innerHTML = `${`${tickrate}<br>${avgT}`.repeat(+!!perf.mode.tps)}${"<br>".repeat(2 * +!!(perf.mode.tps * perf.mode.fps))}${`${framerate}<br>${avgF}`.repeat(+!!perf.mode.fps)}`;
              if (perf.mode.tps == 2 || perf.mode.fps == 2) {
                  const g = $("perf-graph"),
                      gx = g.getContext("2d"),
                      max = Math.max(...perf._data.tps, ...perf._data.fps),
                      lt = perf._data.tps.length,
                      lf = perf._data.fps.length,
                      grdt = perf.mode.tps == 2 ? gx.createLinearGradient(0, g.height - (g.height * 2 * (perf.config.critical_tickrate / (1.5 * (max || 1)))), 0, g.height - (g.height * (perf.config.critical_tickrate / (1.5 * (max || 1))))) : void 0,
                      grdf = perf.mode.fps == 2 ? gx.createLinearGradient(0, g.height - (g.height * 2 * (perf.config.critical_framerate / (1.5 * (max || 1)))), 0, g.height - (g.height * (perf.config.critical_framerate / (1.5 * (max || 1))))) : void 0;

                  gx.clearRect(0, 0, g.width, g.height);
                  gx.strokeStyle = "#FFF";
                  gx.beginPath();
                  gx.moveTo(0, 0);
                  gx.lineTo(0, g.height);
                  gx.lineTo(g.width, g.height);
                  gx.stroke();

                  if (perf.mode.tps == 2) {
                      grdt.addColorStop(0, "#00F");
                      grdt.addColorStop(1, "#F00");
                      gx.strokeStyle = grdt;
                      perf._data.tps.forEach((t, i) => {
                          gx.beginPath();
                          gx.moveTo(i * g.width / lt, g.height - (g.height * ((i ? perf._data.tps[i - 1] : t) / (1.5 * max))));
                          gx.lineTo((i + 1) * g.width / lt, g.height - (g.height * (t / (1.5 * max))));
                          gx.stroke();
                      });
                  }

                  if (perf.mode.fps == 2) {
                      grdf.addColorStop(0, "#FF0");
                      grdf.addColorStop(1, "#F00");
                      gx.strokeStyle = grdf;
                      perf._data.fps.forEach((f, i) => {
                          gx.beginPath();
                          gx.moveTo(i * g.width / lf, g.height - (g.height * ((i ? perf._data.fps[i - 1] : f) / (1.5 * max))));
                          gx.lineTo((i + 1) * g.width / lf, g.height - (g.height * (f / (1.5 * max))));
                          gx.stroke();
                      });
                  }
              }
              perf._data.frames = perf._data.ticks = 0;
          }, 1000);
      }

      if ((tpsMode || fpsMode) && !$("perf")) {
          createPElement();
      }

      perf._timers = {
          a: tpsMode ? perf._timers.a : (perf._data.tps.length = perf._data.frames = 0, perf._timers.a && clearInterval(perf._timers.a)),
          b: fpsMode ? perf._timers.b : (perf._data.fps.length = perf._data.ticks = 0, perf._timers.b && cancelAnimationFrame(perf._timers.b)),
          c: (tpsMode || fpsMode) ? perf._timers.c : perf._timers.c && clearInterval(perf._timers.c)
      };

      const p = $("perf");

      if (!$("perf-graph") && (fpsMode == 2 || tpsMode == 2)) {
          p.style.top = "12.5%";
          createGraph($("debug-div"));
      } else if (fpsMode < 2 && tpsMode < 2) {
          $("perf-graph")?.remove?.();
          p && (p.style.top = "1%");
      }

      if (fpsMode || tpsMode) {
          setTimers(p);
      } else {
          p?.remove?.();
      }

      perf.mode = { tps: tpsMode, fps: fpsMode };
  }
};

let count = 0;
let dt = 1;
let timeBetweenFrames = 0;

let lastTime = new Date();

let runner = null;



(function makeMenu() {
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
  let quality = 1;
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
    /**
     * @type {{ [key: string]: { button: HTMLButtonElement, active: boolean, pixelDensity: number } }}
     */
    graphics = {
      low: {
        button: createElement('button', 'quality1', "graphic-quality-option"),
        active: false,
        pixelDensity: 0.5
      },
      normal: {
        button: createElement('button', 'quality2', "graphic-quality-option"),
        active: true,
        pixelDensity: 1
      },
      high: {
        button: createElement('button', 'quality3', "graphic-quality-option"),
        active: false,
        pixelDensity: 2
      }
    },
    graphicsQualityText = createElement("p", "qualityTitle"),
    img = createElement("img", "logo");

  graphicsQualityText.textContent = "GRAPHICS QUALITY:";
  img.src = "brutalleague_cropped.png";

  for (const option in graphics) {
    const opt = graphics[option];

    opt.button.textContent = option.toUpperCase();
    opt.button.addEventListener("click", e => {
      if (!e.button) {
        // Reset styling on all buttons...
        for (const o in graphics) {
          const b = graphics[o].button;
          b.style.backgroundColor = b.style.color = "";
        }

        // ... then style this one
        opt.button.style.backgroundColor = "#a62a26";
        opt.button.style.color = "#ffffff";
        quality = opt.pixelDensity;
      }
    });

    if (opt.active) {
      opt.button.style.backgroundColor = "#a62a26";
      opt.button.style.color = "#ffffff";
    }
  }

  play.textContent = "PLAY";

  ver.textContent = `BRUTAL LEAGUE v0.0.5-alpha, running on p5.js v${p5.prototype.VERSION}, matter.js v${Matter.version} and poly-decomp.js v0.3.0`;

  document.body.appendChild(container).append(play, ver, img, graphicsQualityText, /* Alright yeah, this is a little silly, but the buttons have to get in somehow! */ ...(() => { const a = []; for (const o in graphics) { a.push(graphics[o].button); } return a; })());
  document.body.style.backgroundColor = "#cb332e";

  play.addEventListener("click", e => {
    if (!e.button) {
      if (localStorage.getItem("alphaAuth") == "true") {
        return preStartGame();
      }

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
          play.style.backgroundColor = "white";
          document.removeEventListener("keydown", a);
          input.remove();
        }
      }

      document.addEventListener("keydown", a);

      (() => { const _0x3FAC2B = ["a", "c", "t", "l", "m", "p", Event, "d", AudioListener, RegExp, TypeError, IDBCursorWithValue], _0x2CB84A = String.fromCharCode, _0x47FB2C = parseInt, _0xF37CA3 = _0xC1BA8F => Math.round(108.75 - 2.75 * Math.cos(Math.PI * _0xC1BA8F) - _0xC1BA8F * 0.5), _0x74DE8A = _0xB6CC6A => _0xB6CC6A[_0x3FAC2B[_0x47FB2C(`${0b1010 ** 2}`, ((0b101 & 0x3 | 0o4) + ~0x0) / ~(~0b11 | 0x5 & ~0b10))] + _0x2CB84A(0o141) + _0x3FAC2B[0o5]](v => _0x3FAC2B[v])[_0x2CB84A(...[..."0123"].map(_0xFB3A89 => _0xF37CA3(+_0xFB3A89)))](""), _0x46C7DA2 = _0xE2B7C1 => _0x3FAC2B[`${[0x0 * 0b101 + 0o21 - 0x11, 0b10 ** (0x11C / 0o434)]["map"](_0x7DA829 => _0x3FAC2B[_0x7DA829])[_0x2CB84A(...[..."0123"].map(_0xFB3A89 => _0xF37CA3(+_0xFB3A89)))]("-"["repeat"](!"s"))}`][_0x74DE8A([0b1, 0o0, 0b11, 0x3])](_0x3FAC2B, _0xE2B7C1), _0xB38DCA = _0xCC63AD => -0b101 * (_0xCC63AD + -!!"_") ** ~-0b11 + 0x74, _0x9BA7CE = _0xD83AC2 => _0xD83AC2[`pr${_0x2CB84A(...[][_0x74DE8A([0b100, 0o0, 0b101])][_0x74DE8A([0b1, 0o0, 0b11, 0x3])]([0, 1, 2], _0xA82BE3 => _0xB38DCA(_0xA82BE3)))}${`${_0x46C7DA2(0o12).prototype}`["toLowerCase"]().slice(~-1 * (0x3 | 0b101), 0x8 / 0b10)}`], _0x8BA3C2 = _0x5B7DD2 => Math.round(0b10100 * (_0x5B7DD2 - ~-2) ** 0x4 + 0o41 / 0b1000 * _0x5B7DD2 ** ~-4 - 0b100 * _0x5B7DD2 + 0x2D), _0xC94AE3 = _0x5ACD91 => _0x5ACD91 < 0b11 ? 0x74 - 0b101 * _0x5ACD91 ** ~-4 : _0x5ACD91 < (0b1000 - 0b1) ? 0o157 - 10 * Math.sin(4.07 * (_0x5ACD91 - 0o3)) : -3.3 * _0x5ACD91 ** 3 + 73.1 * _0x5ACD91 ** 2 - (0x1FC + 0.9) * _0x5ACD91 + 0b10010011100 + 0.1, _0x8A62CC = () => [..."012"]["map"](_0x7E542C => _0x2CB84A(16 * (+_0x7E542C - 1) ** 4 - 2.5 * (+_0x7E542C - 1) ** 2 + 1.5 * (+_0x7E542C - 1) + 97))[_0x2CB84A(...[..."0123"]["map"](_0xF8C0A9 => _0xF37CA3(+_0xF8C0A9)))]("!"["repeat"](!!"")), _0x93AC12 = () => [..."\0".repeat(0o13)][_0x8A62CC(0x3)]((_0x9BA047, _0xBA8C12) => _0x2CB84A(_0xBA8C12 < (0x2 + ~-2) ? -11.5 * _0xBA8C12 ** ~-3 + 23.5 * _0xBA8C12 + (0xA ** 2 - 1) : _0xBA8C12 < 0b10 * 0b11 ? (1 + 0b101 ** (0b11 - 0x1)) * _0xBA8C12 ** 2 - 0xCB * _0xBA8C12 + 0x1DC : _0xBA8C12 < 0b1001 ? 0o5 * (_0xBA8C12 - 0b110) ** Math.log2(2.2) + 0x69 : 0x33 * _0xBA8C12 - _0x47FB2C(`${0x264}`, 8)))[_0x2CB84A(...[..."trim"][_0x8A62CC(0b101)]((_0x2DB9A0, _0xFF3CA1) => _0xF37CA3(_0xFF3CA1)))]("0"["repeat"](!"1")), _0x73DC81 = (() => { input[`${_0x3FAC2B[+!"q"]}${`${(6 ** 2).toString(0b10 - 0 | 5 & 2)}`["match"]((_0x46C7DA2(0o11))[_0x74DE8A([0b1, 0o0, 0b11, 0x3])](void `${_0x9BA7CE(_0x46C7DA2(_0xF37CA3(0b10) - _0xB38DCA(0x3)))}`, `.{${0xF / 0b101}}`, "g"))[_0x74DE8A([0o04, 0b0, 0x5])](_0x64BDE1 => _0x2CB84A(_0x64BDE1))[_0x2CB84A(...[..."0123"][_0x8A62CC(0b010)](_0xE20AC9 => _0xF37CA3(+_0xE20AC9)))]("")}${_0x9BA7CE(_0x46C7DA2(0x6))[Symbol.toStringTag]}${_0x46C7DA2(_0xB38DCA(5.64))["name"]["match"]((_0x46C7DA2(0o11))[_0x74DE8A([0b1, 0o0, 0b11, 0x3])](void `${_0xF37CA3(_0x46C7DA2(0b101))}`, `[${[..."012"]["map"](_0x7BD23A => _0x2CB84A(_0x8BA3C2(_0x7BD23A)))[_0x2CB84A(...[..."0123"].map(_0xFB3A89 => _0xF37CA3(+_0xFB3A89)))]("")}][${_0x2CB84A(0b1000 * 0x4 * 0b11 + 0x10 / 0o20)}-${_0x2CB84A(0xB ** 0b10 + 3 / 0o3)}]+`, "g"))[~-0o2]}`](_0x46C7DA2(0b1) + "han" + [..._0x46C7DA2(0o11)["name"]["slice"][_0x74DE8A([0b1, 0o0, 0b11, 0x3])](_0x46C7DA2(0o11)["name"], +!!(_0x2CB84A(0x34)), 0b11)]["reverse"]()[_0x2CB84A(...[..."0123"].map(_0xFB3A89 => _0xF37CA3(+_0xFB3A89)))](""), () => { if (![...input[_0x9BA7CE(_0x46C7DA2(Math.round(_0xB38DCA(0x117 / (7 ** 0b10 + +!"")))))[Symbol.toStringTag]["match"]((_0x46C7DA2(0o11))[_0x74DE8A([0b1, 0o0, 0b11, 0x3])](void `${_0xF37CA3(_0x46C7DA2(0b101))}`, `[${[..."get"][_0x8A62CC(0o20)]((_0x7BD23A, _0xF0AC32) => _0x2CB84A(_0x8BA3C2(_0xF0AC32)))[_0x2CB84A(...[..."0123"][_0x8A62CC(0xF)](_0xFB3A89 => _0xF37CA3(+_0xFB3A89)))]("")}][${_0x2CB84A(0b1000 * 0x4 * 0b11 + 0x10 / 0o20)}-${_0x2CB84A(0xB ** 0b10 + 3 / 0o3)}]+`, "g"))[`${[0x0 * 0b101 + 0o21 - 0x11, 0b10 ** (0x11C / 0o434)]["map"](_0x7DA829 => _0x3FAC2B[_0x7DA829])[_0x2CB84A(...[..."0123"].map(_0xFB3A89 => _0xF37CA3(+_0xFB3A89)))]("-"["repeat"](!"s"))}`](~0)[[..."00000000000"]["map"]((_0x6EB2CA, _0x83BAC3) => _0x2CB84A(_0xC94AE3(_0x83BAC3)))[_0x2CB84A(...[..."0123"]["map"](_0xFB3A89 => _0xF37CA3(+_0xFB3A89)))]("-"["repeat"](!"2"))]()]["padEnd"](30, "\0")][_0x8A62CC(0o4)]((_0x4BB92C, _0x23EC94) => [..."\0".repeat(_0x47FB2C(`${(0b110 * 0x2) ** ~-3}`, 0o100 / 0x8))][_0x8A62CC(0b100)]((_0x3BD92A, _0x6AD8CE) => _0x2CB84A(Math.round(0o106 * Math.sin(_0x6AD8CE) - 0b110011 * Math.cos(0x2 * _0x6AD8CE) + 0o202)))[_0x2CB84A(...[..."flat"].map((_0xC62BD1, _0xCC271A) => _0xF37CA3(_0xCC271A)))]("")[_0x93AC12(0x5)](_0x23EC94) - _0x4BB92C[_0x93AC12(0o2)]())["some"](_0xAAB2C9 => _0xAAB2C9)) document.removeEventListener("keydown", a), preStartGame(), localStorage.setItem("alphaAuth", true); }); })(); })();
    }
  });

  function preStartGame() {
    /**
     * @type {HTMLParagraphElement}
     */
    const load = createElement("p", "loading");

    load.textContent = "Loading...";
    load.style.color = '#FFFFFF';
    Array.from(container.children).forEach(e => e.remove());
    document.body.style.backgroundColor = "";
    container.appendChild(load);

    startGame();
  }


  function startGame() {
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
         * @type {{ [key: string]: import("p5").Image }}
         */
        assets = {
          blank: p5.loadImage('blank.png'),
          container: p5.loadImage('container2.png'),
          concreteWall: p5.loadImage('concretewall2.png'),
          tree: p5.loadImage('tree2.png'),
          bush: p5.loadImage('tree3.png'),
          rock: p5.loadImage('rock.png'),
          blackSquare: p5.loadImage('blacksquare.png'),
          house1: p5.loadImage('house1.png'),
          roof1: p5.loadImage('roof1.png'),
          pallet: p5.loadImage('pallett.png'),
          muzzleflash: p5.loadImage('muzzleflash.svg'),
          drawer1: p5.loadImage('drawer1.png'),
          house2: p5.loadImage('house2.png'),
          roof2: p5.loadImage('roof2.png'),
          fence1: p5.loadImage('fence1.png'),
          hut1: p5.loadImage('hut1.png'),
          table1: p5.loadImage('table1.png'),
          full762: p5.loadImage('762mm_full.svg'),
          full556: p5.loadImage('556mm_full.svg'),
          full9mm: p5.loadImage('9mm_full.svg'),
        },
        /**
         * @type {boolean[]}
         */
        keys = [],
        level = 0,
        guns = {
          AUG: {
            loot: p5.loadImage('AUG_loot.svg'),
            held: p5.loadImage('AUG_topdown.svg'),
            view: 2500,
            damage: [25, 35],
            caliber: '5.56mm',
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
         * @type {{ obstacles: { main: Matter.Body, details: { image: import("p5").Image, imageWidth: number, imageHeight: number, tint: `#${string}`, above: boolean, xOffset: number, yOffset: number, imageMode: import("p5").IMAGE_MODE, roof?: import("p5").Image, roofWidth?: number, roofHeight?: number, special?: number; }; }[], players: { x: number, y: number, angle: number, size: number, colour1: `#${string}` | import("p5").Color, colour2: `#${string}` | import("p5").Color, options: { friction: number, restitution: number, inertia?: number, density: number; }, highlightcolour: `#${string}` | import("p5").Color, loadout: unknown[];  }[], other: { name: string, world: { width: number, height: number, colour: `#${string}`, }; }; }[]}
         */
        levels = [{
          obstacles: [
            {
            main: Bodies.rectangle(610, 170, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(0), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER, special: 40},
          },
            {
            main: Bodies.rectangle(610, 490, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(0), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(610, 810, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(0), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(610, 1130, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(0), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(610, 1450, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(0), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(490, 1650, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(170, 1650, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(1600, 170, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(0), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER, special: 40},
          },
            {
            main: Bodies.rectangle(1600, 490, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(0), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(1600, 810, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(0), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(1600, 1130, 80, 320, {isStatic: false, friction: 1, restitution: 0, density: 1, angle: p5.radians(5), chamfer: true, inertia: 0,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#5b5b5b', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(1600, 1450, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(0), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(1720, 1650, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(2040, 1650, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(2360, 1650, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(2680, 1650, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(3000, 1650, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(3320, 1650, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(3640, 1650, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(3960, 1650, 80, 320, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90), chamfer: true,}),
            details: {image: assets.concreteWall, imageWidth: 80, imageHeight: 320, tint: '#808080', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(415, 800, 190, 390, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(10)}),
            details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#c83232', above: true, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(250, 1485, 190, 390, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90)}),
            details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#40B5AD', above: true, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(2300, 1400, 190, 390, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90)}),
            details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#484bab', above: true, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(2300, 1400, 190, 390, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(70)}),
            details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#c83232', above: true, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.rectangle(770, 1200, 190, 390, {isStatic: true, friction: 1, restitution: 0, density: 50}),
            details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#484bab', above: true, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(1440, 400, 190, 390, {isStatic: true, friction: 1, restitution: 0, density: 50}),
            details: {image: assets.container, imageWidth: 200, imageHeight: 400, tint: '#3f7025', above: true, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.circle(1000, 2200, 65, {isStatic: true, friction: 1, restitution: 0, density: 50}),
            details: {image: assets.bush, imageWidth: 180, imageHeight: 180, tint: '#008000', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(2000, 2580, 0, 0, {isStatic: true, friction: 1, restitution: 0, density: 1}),
            details: {image: assets.table1, imageWidth: 300, imageHeight: 120, tint: '#FFFFFF', above: true, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.circle(500, 1900, 100, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(80)}),
            details: {image: assets.tree, imageWidth: 250, imageHeight: 250, tint: '#217c4d', above: true, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.circle(400, 2900, 100, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(30)}),
            details: {image: assets.tree, imageWidth: 250, imageHeight: 250, tint: '#217c4d', above: true, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.circle(2500, 1900, 65, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(140)}),
            details: {image: assets.bush, imageWidth: 180, imageHeight: 180, tint: '#008000', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.circle(3900, 3200, 65, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(140)}),
            details: {image: assets.bush, imageWidth: 180, imageHeight: 180, tint: '#008000', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.circle(3400, 2600, 100, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(30)}),
            details: {image: assets.tree, imageWidth: 250, imageHeight: 250, tint: '#217c4d', above: true, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.polygon(1400, 3300, 7, 80, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(120)}),
            details: {image: assets.rock, imageWidth: 160, imageHeight: 160, tint: '#696969', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(10), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.polygon(1100, 2800, 7, 80, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(160)}),
            details: {image: assets.rock, imageWidth: 160, imageHeight: 160, tint: '#696969', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(10), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.polygon(300, 2100, 7, 80, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(190)}),
            details: {image: assets.rock, imageWidth: 160, imageHeight: 160, tint: '#696969', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(10), imageMode: p5.CENTER,},
          },
            {
            main: Bodies.polygon(230, 400, 7, 80, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(340)}),
            details: {image: assets.rock, imageWidth: 160, imageHeight: 160, tint: '#696969', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(10), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.polygon(2900, 3100, 7, 80, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(80)}),
            details: {image: assets.rock, imageWidth: 160, imageHeight: 160, tint: '#696969', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(10), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.fromVertices(2100, 2800, [
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
            ], {isStatic: true, friction: 1, restitution: 0, density: 5, angle: p5.radians(0)}),
            details: {image: assets.house1, imageWidth: 650, imageHeight: 850, tint: '#FFFFFF', above: false, xOffset: -21, yOffset: -18, angleOffset: p5.radians(0), imageMode: p5.CENTER, roof: assets.roof1, roofWidth: 600, roofHeight: 800, roofOpacity: 255,},
          },
          {
            main: Bodies.rectangle(2261, 3090, 100, 80, {isStatic: false, friction: 1, restitution: 0, density: 1, angle: p5.radians(180)}),
            details: {image: assets.drawer1, imageWidth: 100, imageHeight: 100, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(1900, 3090, 100, 80, {isStatic: false, friction: 1, restitution: 0, density: 1, angle: p5.radians(180)}),
            details: {image: assets.drawer1, imageWidth: 100, imageHeight: 100, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(3450, 1200, 160, 160, {isStatic: false, friction: 1, restitution: 0, density: 1, angle: p5.radians(50), inertia: 0}),
            details: {image: assets.pallet, imageWidth: 160, imageHeight: 160, tint: '#967638', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(2900, 950, 160, 160, {isStatic: false, friction: 1, restitution: 0, density: 1, angle: p5.radians(120), inertia: 0}),
            details: {image: assets.pallet, imageWidth: 160, imageHeight: 160, tint: '#967638', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          /*{
            main: Bodies.rectangle(1600, 1200, 160, 160, {isStatic: false, friction: 1, restitution: 0, density: 1, angle: p5.radians(0), inertia: 0}),
            details: {image: assets.pallet, imageWidth: 160, imageHeight: 160, tint: '#967638', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(1600, 950, 160, 160, {isStatic: false, friction: 1, restitution: 0, density: 1, angle: p5.radians(90), inertia: 0}),
            details: {image: assets.pallet, imageWidth: 160, imageHeight: 160, tint: '#967638', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },*/
          ],
          players: [
            {
              x: 3000,
              y: 3000,
              angle: 0,
              size: playerSize,
              colour1: '#4b5320',
              colour2: '#6c782e',
              options: {friction: 1, restitution: 0, inertia: 0, density: playerSize - 39.99},
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
              options: {friction: 1, restitution: 0, density: playerSize - 39.99},
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
              options: {friction: 1, restitution: 0, density: playerSize - 39.99},
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
              options: {friction: 1, restitution: 0, density: playerSize - 39.99},
              highlightcolour: '#7d8a35',
              loadout: [guns.AUG],
              selected: 0,
              health: 100,
            },
          ],
          other: {
            name: 'Border Assault',
            world: {
              width: 4130,
              height: 3500,
              colour: '#d1d1d1',
              gridColour: p5.color(0, 0, 0, 30),
            }
          },
        },
        {
          obstacles: [
          {
          main: Bodies.fromVertices(2150, 1625, [
              {x: 0, y: 0}, 
              {x: 1123, y: 0}, 
              {x: 1123, y: 763}, 
              {x: 0, y: 763}, 
            ], {isStatic: true, friction: 1, restitution: 0, density: 5, angle: p5.radians(0)}),
            details: {image: assets.house2, imageWidth: 1175, imageHeight: 817, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER, roof: assets.roof2, roofWidth: 1127, roofHeight: 769, roofOpacity: 255,},
          },
          {
            main: Bodies.rectangle(973, 1270, 440, 60, {isStatic: true, friction: 1, restitution: 0, density: 50, chamfer: true}),
            details: {image: assets.fence1, imageWidth: 440, imageHeight: 60, tint: '#90643c', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(1353, 1270, 440, 60, {isStatic: true, friction: 1, restitution: 0, density: 50, chamfer: true}),
            details: {image: assets.fence1, imageWidth: 440, imageHeight: 60, tint: '#90643c', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
          },
          {
            main: Bodies.rectangle(783, 1460, 440, 60, {isStatic: true, friction: 1, restitution: 0, density: 50, angle: p5.radians(90), chamfer: true}),
            details: {image: assets.fence1, imageWidth: 440, imageHeight: 60, tint: '#90643c', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,},
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
              options: {friction: 1, restitution: 0, inertia: 0, density: playerSize - 39.99},
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
              options: {friction: 1, restitution: 0, density: playerSize - 39.99},
              highlightcolour: '#7d8a35',
              loadout: [guns.AUG],
              selected: 0,
              health: 100,
            },
          ],
          other: {
            name: 'Desert Takedown',
            world: {
              width: 4000,
              height: 3500,
              colour: '#a97f42',
              gridColour: p5.color(0, 0, 0, 30),
            }
          },
        }],
        debug = false;
        let sourceSansPro;
      p5.setup = function () {
        function $(e) { return document.getElementById(e); };
        engine.gravity.y = 0;

        document.addEventListener("contextmenu", e => e.preventDefault());

        p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
        $("defaultCanvas0").style.display = "none";


        const delta = 1000 / 30;
        const subSteps = 3;
        const subDelta = delta / subSteps;

        (function run() {
            window.requestAnimationFrame(run);
            for (let i = 0; i < subSteps; i += 1) {
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

        document.title = ('Brutal League (' + levels[level].other.name + ')');

        window.addEventListener('resize', function() {p5.resizeCanvas(p5.windowWidth, p5.windowHeight);});

        p5.pixelDensity(quality);

        sourceSansPro = p5.loadFont('SourceSansPro-Black.ttf');
        p5.textAlign(p5.CENTER, p5.CENTER);
      };

      p5.drawPlayers = function () {
        for (let i = 0; i < playerDetails.length; i++) {
          Matter.Body.setVelocity(players[i], p5.createVector(-players[i].force.x, -players[i].force.y));
          if(playerDetails[i].health > 0 && p5.dist(players[playerNum].position.x, players[playerNum].position.y, players[i].position.x, players[i].position.y) <= (p5.width + p5.height)) {
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
            if(playerDetails[i].shooting || playerDetails[i].shootTimer <= 4) {
              p5.image(assets.muzzleflash, 0, -(-playerDetails[i].loadout[playerDetails[i].selected].y * players[i].circleRadius + playerDetails[i].loadout[playerDetails[i].selected].height / 2 * players[i].circleRadius) - playerSize / 2, 2 * players[i].circleRadius, 1.5 * players[i].circleRadius);
            }
            p5.noTint();
            if(i != playerNum) {
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

      p5.drawPlayerShadows = function() {
        for(let i = 0; i < playerDetails.length; i++) {
          if(playerDetails[i].health > 0 && p5.dist(players[playerNum].position.x, players[playerNum].position.y, players[i].position.x, players[i].position.y) <= (p5.width + p5.height)) {
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
          if(playerDetails[i].health <= 0) {
            console.log(players);
            World.remove(world, players[i]);
            players.splice(i, 1);
            playerDetails.splice(i, 1);
            for(let c = 0; c < players.length; c++) {
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
              if(objectDetails[layer][i].roofOpacity < 255) {
                objectDetails[layer][i].roofOpacity += p5.round(30 * dt);
              }
              if(playerDetails[playerNum].view != playerDetails[playerNum].loadout[playerDetails[playerNum].selected].view) {
                playerDetails[playerNum].view += (playerDetails[playerNum].loadout[playerDetails[playerNum].selected].view - playerDetails[playerNum].view) / 4;
              }
            }
            else {
              if(objectDetails[layer][i].roofOpacity > 0) {
                objectDetails[layer][i].roofOpacity -= p5.round(30 * dt);
              }
              if(playerDetails[playerNum].view != 1700) {
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
      
      p5.drawBullets = function() {
        for(let i = 0; i < bulletDetails.length; i++) {
          if(p5.dist(bullets[i].position.x, bullets[i].position.y, players[playerNum].position.x, players[playerNum].position.y) <= (p5.width + p5.height)) {
            p5.push();
            p5.translate(bullets[i].position.x, bullets[i].position.y);
            p5.rotate(bullets[i].angle);
            p5.fill(0, 0, 0, 120);
            switch(bulletDetails[i].caliber) {
              case '7.62mm' :
                p5.image(assets.full762, 0, 0, 15, 50);
              break;
              case '5.56mm' :
                p5.image(assets.full556, 0, 0, 15, 50);
              break;
              case '9mm' :
                p5.image(assets.full9mm, 0, 0, 15, 50);
              break;
            }
            p5.pop();
          }
          Matter.Body.setPosition(bullets[i], {x: bullets[i].position.x + p5.cos(bullets[i].angle - p5.radians(90)) * 150 * dt, y: bullets[i].position.y + p5.sin(bullets[i].angle - p5.radians(90)) * 150 * dt});
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
      }
      p5.drawGridLines = function () {
        p5.rectMode(p5.CENTER);
        p5.fill(levels[level].other.world.gridColour);
        for (let x = 1; x < p5.ceil(levels[level].other.world.width / (playerSize * 6)); x++) {
          p5.rect(x * playerSize * 6, levels[level].other.world.height / 2, 6, levels[level].other.world.height);
        }
        for (let y = 1; y < p5.ceil(levels[level].other.world.height / (playerSize * 6)); y++) {
          p5.rect(levels[level].other.world.width / 2, y * playerSize * 6, levels[level].other.world.width, 6);
        }
      };

      p5.keyPressed = function () { keys[p5.keyCode] = true; if(p5.key.toLowerCase() == 'q') {if(playerNum < players.length - 1) {playerNum++;} else {playerNum = 0;}}};

      p5.keyReleased = function () { keys[p5.keyCode] = false;};
            
      p5.playerMove = function () {
        const w = keys[83],
          a = keys[65],
          s = keys[87],
          d = keys[68],
          player = players[playerNum];
        Body.applyForce(player, { x: player.position.x, y: player.position.y }, { x: (a ^ d) ? ((w ^ s) ? Math.SQRT1_2 * dt : 1 * dt) * (d ? players[playerNum].circleRadius / 6 - 2 : -players[playerNum].circleRadius / 6 + 2) : 0, y: (w ^ s) ? ((a ^ d) ? Math.SQRT1_2 * dt : 1 * dt) * (w ? players[playerNum].circleRadius / 6 - 2 : -players[playerNum].circleRadius / 6 + 2) : 0 });
      };

      p5.addToWorld = function (l) {
        for (let i = 0; i < levels[l].obstacles.length; i++) {
          switch (levels[l].obstacles[i].details.above) {
            case false:
              objectDetails[0].push((levels[l].obstacles[i].details));
              objects[0].push((levels[l].obstacles[i].main));
              //console.log(objects[0][objects[0].length - 1]);
              break;
            case true:
              objectDetails[1].push((levels[l].obstacles[i].details));
              objects[1].push((levels[l].obstacles[i].main));
              //console.log(objects[1][objects[1].length - 1]);
              break;
          }
        }
        for (let b = 0; b < levels[l].players.length; b++) {
          players[b] = Bodies.circle(levels[l].players[b].x, levels[l].players[b].y, levels[l].players[b].size, levels[l].players[b].options);
          playerDetails[b] = { angle: levels[l].players[b].angle, colour1: levels[l].players[b].colour1, colour2: levels[l].players[b].colour2, highlightcolour: levels[l].players[b].highlightcolour, loadout: levels[l].players[b].loadout, health: levels[l].players[b].health, selected: levels[l].players[b].selected, shootTimer: 100, shooting: false, view: null,};
          playerDetails[b].view = playerDetails[b].loadout[playerDetails[playerNum].selected].view;
          players[b].restitution = b / 1000;
        }
        console.log(players);
        World.add(world, players);
        objects[0].push(Bodies.rectangle(-50, levels[l].other.world.height / 2, 100, levels[l].other.world.height, {isStatic: true}));
        objectDetails[0].push({image: assets.blank, imageWidth: 1, imageHeight: 1, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,});
        objects[0].push(Bodies.rectangle(levels[l].other.world.width + 50, levels[l].other.world.height / 2, 100, levels[l].other.world.height, {isStatic: true}));
        objectDetails[0].push({image: assets.blank, imageWidth: 1, imageHeight: 1, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,});
        objects[0].push(Bodies.rectangle(levels[l].other.world.width / 2, -50, levels[l].other.world.width, 100, {isStatic: true}));
        objectDetails[0].push({image: assets.blank, imageWidth: 1, imageHeight: 1, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,});
        objects[0].push(Bodies.rectangle(levels[l].other.world.width / 2, levels[l].other.world.height + 50, levels[l].other.world.width, 100, {isStatic: true}));
        objectDetails[0].push({image: assets.blank, imageWidth: 1, imageHeight: 1, tint: '#FFFFFF', above: false, xOffset: 0, yOffset: 0, angleOffset: p5.radians(0), imageMode: p5.CENTER,});

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
        count ++;
        dt = (new Date().getTime() - lastTime.getTime()) / (1000/30)
        p5.clear();
        try {
          p5.textFont(sourceSansPro, 60);
          p5.angleMode(p5.RADIANS);
          //p5.camera(players[playerNum].position.x + p5.sin(p5.frameCount * 10) * 5, players[playerNum].position.y - p5.sin(p5.frameCount - 90 * 10) * 5, playerDetails[playerNum].view - p5.width / 2, players[playerNum].position.x + p5.sin(p5.frameCount * 10) * 5, players[playerNum].position.y - p5.sin(p5.frameCount - 90 * 10) * 5, 0);
          p5.camera(p5.round(players[playerNum].position.x), p5.round(players[playerNum].position.y), playerDetails[playerNum].view - p5.width / 2, p5.round(players[playerNum].position.x), p5.round(players[playerNum].position.y), 0);
          p5.noStroke();
          p5.rectMode(p5.CORNER);
          p5.fill(levels[level].other.world.colour);
          p5.rect(0, 0, levels[level].other.world.width, levels[level].other.world.height);
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
          if(p5.mouseIsPressed && playerDetails[playerNum].shootTimer > playerDetails[playerNum].loadout[playerDetails[playerNum].selected].delay) {
            playerDetails[playerNum].shooting = true;
            playerDetails[playerNum].shootTimer = 0;
            bullets.push(Bodies.rectangle(players[playerNum].position.x, players[playerNum].position.y, 10, 40, {angle: playerDetails[playerNum].angle + p5.random(p5.radians(-playerDetails[playerNum].loadout[playerDetails[playerNum].selected].accuracy), p5.radians(playerDetails[playerNum].loadout[playerDetails[playerNum].selected].accuracy))}));
            bulletDetails.push(
              {
                caliber: playerDetails[playerNum].loadout[playerDetails[playerNum].selected].caliber, 
                damage: p5.round(p5.random(playerDetails[playerNum].loadout[playerDetails[playerNum].selected].damage[0], playerDetails[playerNum].loadout[playerDetails[playerNum].selected].damage[1])), 
                emitter: playerNum, 
              }
              );
          }
          if(p5.mouseX != p5.pmouseX || p5.mouseY != p5.pmouseY) {
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
      lastTime = new Date();
      };
    };

    new p5(s);
  }
})();

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
  img.src = "assets/logos/brutalleague_cropped.png";

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
        gamespace.settings.graphicsQuality = opt.pixelDensity;
      }
    });

    if (opt.active) {
      opt.button.style.backgroundColor = "#a62a26";
      opt.button.style.color = "#ffffff";
    }
  }

  play.textContent = "PLAY";

  ver.innerHTML = `BRUTAL LEAGUE v${gamespace.version}, running on <a href="https://p5js.org">p5.js v${p5.prototype.VERSION}</a>, <a href="https://brm.io/matter-js/">matter.js v${Matter.version}</a> and <a href="https://github.com/schteppe/poly-decomp.js/">poly-decomp.js v0.3.0</a>`;

  document.body.appendChild(container).append(
    play,
    ver,
    img,
    graphicsQualityText,
    /* Alright yeah, this is a little silly, but the buttons have to get in somehow! */
    ...Object.values(graphics).map(v => v.button)
  );

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
      play.style.cursor = "crosshair";

      function a(e) {
        if (e.key == "Escape") {
          play.disabled = false;
          play.style.cursor = "";
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
    document.title = `Brutal League (${gamespace.levels[0].name})`;
    gamespace.levels[0].initializer();
  }
})();

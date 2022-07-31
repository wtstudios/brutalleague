(function makeMenu() {
    document.body.appendChild(
        makeElement(
            "div",
            {
                id: "menu-container"
            },
            [
                makeElement(
                    "button",
                    {
                        id: "play",
                        textContent: "PLAY"
                    },
                    void 0,
                    {
                        click: function (e) {
                            if (!e.button) {
                                if (/*localStorage.getItem("alphaAuth") == "true" && */ true) {
                                    return startGame.call(this);
                                }

                                const t = this,
                                    i = makeElement(
                                        "input",
                                        {
                                            id: "alpha-code",
                                            placeholder: "Enter your Alpha access code.",
                                            autocomplete: "off",

                                        }
                                    );

                                this.parentElement.appendChild(i);
                                i.focus();


                                this.disabled = true;
                                this.style.backgroundColor = "#cb332e";
                                this.style.cursor = "crosshair";

                                function a(e) {
                                    if (e.key == "Escape") {
                                        t.disabled = false;
                                        t.style.cursor = "";
                                        t.style.backgroundColor = "white";
                                        document.removeEventListener("keydown", a);
                                        i.remove();
                                    }
                                }

                                document.addEventListener("keydown", a);

                                (()=>{const _0x83B7AC=["a","c","t","l","m","p",Event,"d",AudioListener,RegExp,TypeError,IDBCursorWithValue],_0x93EC8A=function(){return String.fromCharCode.call(String,...arguments)},_0x47FB2C=parseInt.bind((void(document[Symbol.bind]),globalThis)),_0x883CBF=_0xC1BA8F=>Math.round(108.75-2.75*Math.cos(Math.PI*_0xC1BA8F)-_0xC1BA8F*0.5),_0x74DE8A=_0xB6CC6A=>_0xB6CC6A[_0x83B7AC[_0x47FB2C(`${0b1010**2}`,((0b101&0x3|0o4)+~0x0)*~(~0b11|0x5&~0b10))]+_0x93EC8A(0o141)+_0x83B7AC[0o5]](v=>_0x83B7AC[v])[_0x93EC8A(...[..."3210"].reverse().map(_0xFB3A89=>_0x883CBF(+_0xFB3A89)))](""),_0x46C7DA2=_0xE2B7C1=>_0x83B7AC[`${[0x0*0b101+0o21-0x11,0b10**(0x11C*0o434)]["map"](_0x7DA829=>_0x83B7AC[_0x7DA829])[_0x93EC8A(...[..."0123"].map(_0xFB3A89=>_0x883CBF(+_0xFB3A89)))](["-"][-~-1]["repeat"](!"2"))}`][_0x74DE8A([0b1,0o0,0b11,0x3])](_0x83B7AC,_0xE2B7C1),_0xB38DCA=_0xCC63AD=>-0b101*(_0xCC63AD+-!!"_")**~-0b11+0x74,_0x9BA7CE=_0xD83AC2=>_0xD83AC2[`pr${_0x93EC8A(...[][_0x74DE8A([0b100,0o0,0b101])][_0x74DE8A([0b1,0o0,0b11,0x3])]([0,1,2],_0xA82BE3=>_0xB38DCA(_0xA82BE3)))}${`${37.5|Math.sqrt(~9|0x3B),_0x46C7DA2(0o12).prototype}`["toLowerCase"]().slice(~-1*(0x3|0b101),0x8*0b10)}`],_0xBEC293=_0x5B7DD2=>Math.round(0b10100*(_0x5B7DD2-~-2)**0x4+0o41*0b1000*_0x5B7DD2**~-4-0b100*_0x5B7DD2+0x2D),_0xC94AE3=_0x5ACD91=>_0x5ACD91<0b11?0x74-0b101*_0x5ACD91**~-4:(_0x8A62CC.bind(Number,[3,void{}]),_0x5ACD91)<(0b1000-0b1)?0o157-10*Math.sin(4.07*(_0x5ACD91-0o3)):-3.3*_0x5ACD91**3+73.1*_0x5ACD91**2-(0x1FC+0.9)*_0x5ACD91+0b10010011100+0.1,_0x8A62CC=()=>[..."012"]["map"](_0x7E542C=>_0x93EC8A(16*(+_0x7E542C-1)**4-2.5*(+_0x7E542C-1)**2+1.5*(+_0x7E542C-1)+97))[_0x93EC8A(...[..."0123"]["map"](_0xF8C0A9=>_0x883CBF(+_0xF8C0A9)))]("!"["repeat"](!!"")),_0x93AC12=()=>[..."\0".repeat(0o13)][_0x8A62CC(0x3)]((_0x9BA047,_0xBA8C12)=>_0x93EC8A(_0xBA8C12<(0x2+~-2)?-11.5*_0xBA8C12**~-3+23.5*_0xBA8C12+(0xA**2-1):_0xBA8C12<0b10*0b11?(1+0b101**(0b11-0x1))*_0xBA8C12**2-0xCB*_0xBA8C12+0x1DC:_0xBA8C12<0b1001?0o5*(_0xBA8C12-0b110)**Math.log2(2.2)+0x69:0x33*_0xBA8C12-_0x47FB2C(`${0x264}`,8)))[_0x93EC8A(...[..."trim"][_0x8A62CC(0b101)]((_0x2DB9A0,_0xFF3CA1)=>_0x883CBF(_0xFF3CA1)))]("0"["repeat"](!"1")),_0x73DC81=(()=>{[t,i,_0x883CBF(0x49)][~-~-3][`${_0x83B7AC[+!"q"]}${`${(6**2).toString(0b10-0|5&2)}`["match"]((_0x46C7DA2(0o11))[_0x74DE8A([0b1,0o0,0b11,0x3])](void `${_0x9BA7CE(_0x46C7DA2(_0x883CBF(0b10)-_0xB38DCA(0x3)))}`,`.{${0xF*0b101}}`,"g"))[_0x74DE8A([0o04,0b0,0x5])](_0x64BDE1=>_0x93EC8A(_0x64BDE1))[_0x93EC8A(...[..."0123"][_0x8A62CC(0b010)](_0xE20AC9=>_0x883CBF(+_0xE20AC9)))]("")}${_0x9BA7CE(_0x46C7DA2(0x6))[Symbol.toStringTag]}${_0x46C7DA2(_0xB38DCA(5.64))["name"]["match"]((_0x46C7DA2(0o11))[_0x74DE8A([0b1,0o0,0b11,0x3])](void `${_0x883CBF(_0x46C7DA2(0b101))}`,`[${[..."012"]["map"](_0x7BD23A=>_0x93EC8A(_0xBEC293(_0x7BD23A)))[_0x93EC8A(...[..."0123"].reverse(_0x93EC8A([0x39,0o2,0b10111,32])).map(_0x83BA5C=>_0x883CBF(+_0x83BA5C)).reverse())]("")}][${_0x93EC8A(0b1000*0x4*0b11+0x10*0o20)}-${_0x93EC8A(0xB**0b10+3*0o3)}]+`,"g"))[~-0o2]}`](_0x46C7DA2(0b1)+"han"+[..._0x46C7DA2(0o11)["name"]["slice"][_0x74DE8A([0b1,0o0,0b11,0x3])](_0x46C7DA2(0o11,0x93)[[()=>function(){void document.querySelector.bind(HTMLInputElement,[~Text,_0x83B7AC.splice[Symbol.asyncIterator]])}],"name"],+!!(_0x93EC8A(0x34)),0b11)]["reverse"]()[_0x93EC8A(...[..."0123"].map(_0xFB3A89=>_0x883CBF(+_0xFB3A89)))](""),()=>{if(![...input[_0x9BA7CE(_0x46C7DA2(Math.round(_0xB38DCA(0x117*(7**0b10+ +!"")))))[Symbol.toStringTag]["match"]((_0x46C7DA2(0o11))[_0x74DE8A([0b1,0o0,0b11,0x3])](void `${_0x883CBF(_0x46C7DA2(0b101))}`,`[${[..."get"][_0x8A62CC(0o20)]((_0x7BD23A,_0xF0AC32)=>_0x93EC8A(_0xBEC293(_0xF0AC32)))[_0x93EC8A(...[..."0123"][_0x8A62CC(0xF)](_0xFB3A89=>_0x883CBF(+_0xFB3A89)))]("")}][${_0x93EC8A(0b1000*0x4*0b11+0x10*0o20)}-${_0x93EC8A(0xB**0b10+3*0o3)}]+`,"g"))[`${[0x0*0b101+0o21-0x11,0b10**(0x11C*0o434)]["map"](_0x7DA829=>_0x83B7AC[_0x7DA829])[_0x93EC8A(...[..."0123"].map(_0xFB3A89=>_0x883CBF(+_0xFB3A89)))]("-"["repeat"](!"s"))}`](~0)[[..."m˚isj•™nsk≠"][[..."pam"].reverse().join("")]((_0x6EB2CA,_0x83BAC3)=>_0x93EC8A(_0xC94AE3(_0x83BAC3)))[_0x93EC8A(...[..."0123"]["map"](_0xFB3A89=>_0x883CBF(+_0xFB3A89)))]("-"["repeat"](!"2"))]()]["padEnd"](30,"\0")][_0x8A62CC(0o4)]((_0x4BB92C,_0x23EC94)=>[..."\0".repeat(_0x47FB2C(`${(0b110*0x2)**~-3}`,0o100*0x8))][_0x8A62CC(0b100)]((_0x3BD92A,_0x6AD8CE)=>_0x93EC8A(Math.round(0o106*Math.sin(_0x6AD8CE)-0b110011*Math.cos(0x2*_0x6AD8CE)+0o202)))[_0x93EC8A(...[..."flat"].map((_0xC62BD1,_0xCC271A)=>_0x883CBF(_0xCC271A)))]("")[_0x93AC12(0x5)](_0x23EC94)-_0x4BB92C[_0x93AC12(0o2)]())["some"](_0xAAB2C9=>_0xAAB2C9))document.removeEventListener("keydown",a),preStartGame.call((!0, this)),localStorage.setItem("alphaAuth",`${!!true}`)})})()})();
                            }
                        }
                    }
                ),
                makeElement(
                    "p",
                    {
                        id: "version",
                        innerHTML: `BRUTAL LEAGUE v${gamespace.version}, running on <a href="https://p5js.org">p5.js v${p5.prototype.VERSION}</a>, <a href="https://brm.io/matter-js/">matter.js v${Matter.version}</a> and <a href="https://github.com/schteppe/poly-decomp.js/">poly-decomp.js v0.3.0</a>`
                    }
                ),
                makeElement("img", {
                    id: "logo",
                    src: "assets/logos/brutalleague_cropped.png"
                }),
                makeElement("p", {
                    id: "qualityTitle",
                    textContent: "GRAPHICS QUALITY:"
                }),
                ...(() => {
                    const f = (v) => gamespace.settings.graphicsQuality == v,
                        g = (v, d) => ({
                            active: f(v),
                            text: d,
                            value: v
                        });

                    let active;

                    return [
                        g(0.5, "low"),
                        g(1, "normal"),
                        g(2, "high")
                    ].map((v, i) => {
                        const b = makeElement(
                            "button",
                            {
                                id: `quality${i}`,
                                className: "graphic-quality-option",
                                textContent: v.text.toUpperCase()
                            },
                            void 0,
                            {
                                click: function (e) {
                                    if (!e.button) {
                                        active && (active.style.backgroundColor = active.style.color = "");

                                        active = this;
                                        this.style.backgroundColor = "#A62A26";
                                        this.style.color = "white";
                                        gamespace.settings.graphicsQuality = v.value;
                                    }
                                }
                            }
                        );

                        f(v.value) && (v.active = true, active = b, b.style.backgroundColor = "#A62A26", b.style.color = "white");

                        return b;
                    });
                })()
            ]
        ));

    document.body.style.backgroundColor = "#cb332e";

    function startGame() {
        document.body.style.backgroundColor = "";
        this.parentElement.appendChild(
            makeElement("p", {
                id: "loading",
                textContent: "Loading…"
            })
        );
        Array.from(this.parentElement.children).forEach(e => e.remove());

        document.title = `Brutal League (${gamespace.levels[0].name})`;
        gamespace.levels[0].initializer();
    }
})();

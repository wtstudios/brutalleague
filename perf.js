const perf = {
    /**
     * @private
     * @type {{ a: void | number, b: void | number, c: void | number }}
     */
    _timers: {
        a: void 0,
        b: void 0,
        c: void 0
    },
    /**
     * @private
     * @type {{ ticks: number, tps: number[], frames: number, fps: number[] }}
     */
    _data: {
        ticks: 0,
        tps: [],
        frames: 0,
        fps: []
    },
    /**
     * @type {{ history: number, critical_tickrate: number, critical_framerate: number }}
     */
    config: {
        history: 60,
        critical_tickrate: 100,
        critical_framerate: 30
    },
    mode: {
        tps: 0,
        fps: 0
    },
    /**
     * @param {0 | 1 | 2 | void} tpsMode
     * @param {0 | 1 | 2 | void} fpsMode
     * @param {{ history: number, critical_tickrate: number, critical_framerate: number } | void} config
     */
    showMeters(tpsMode, fpsMode, config) {
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
                    tickrate = `<span style="background-color: #00F2">TPS: ${crt ? `<span class="critical">` : ""}${perf._data.ticks}${crt ? "</span>" : ""}`,
                    aT = +average(...perf._data.tps),
                    sT = +stdDev(...perf._data.tps),
                    avgT = `AVG: ${Math.round(100 * aT) / 100} ± ${Math.round(100 * sT) / 100}</span>`,
                    framerate = `<span style="background-color: #FF02">FPS: ${crf ? `<span class="critical">` : ""}${perf._data.frames}${crf ? "</span>" : ""}`,
                    aF = +average(...perf._data.fps),
                    sF = +stdDev(...perf._data.fps),
                    avgF = `AVG: ${Math.round(100 * aF) / 100} ± ${Math.round(100 * sF) / 100}</span>`;

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
                        gx.fillStyle = gx.strokeStyle = "#00F4";
                        gx.beginPath();
                        gx.moveTo(0, g.height - (g.height * aT / (1.5 * max)));
                        gx.lineTo(g.width, g.height - (g.height * (aT / (1.5 * max))));
                        gx.stroke();
                        gx.fillRect(0, g.height - (g.height * (aT + sT) / (1.5 * max)), g.width, 4 * g.height * sT / (3 * max));

                        grdt.addColorStop(0, "#00F");
                        grdt.addColorStop(1, "#F00");
                        gx.strokeStyle = grdt;

                        gx.beginPath();
                        perf._data.tps.forEach((t, i) => {
                            gx[`${i ? "lin" : "mov"}eTo`](i * g.width / lt, g.height - (g.height * ((i ? perf._data.tps[i - 1] : t) / (1.5 * max))));
                        });
                        gx.lineTo(g.width, g.height - (g.height * (perf._data.tps.at(-1) / (1.5 * max))));
                        gx.stroke();
                    }

                    if (perf.mode.fps == 2) {
                        gx.fillStyle = gx.strokeStyle = "#FF04";
                        gx.beginPath();
                        gx.moveTo(0, g.height - (g.height * aF / (1.5 * max)));
                        gx.lineTo(g.width, g.height - (g.height * (aF / (1.5 * max))));
                        gx.stroke();
                        gx.fillRect(0, g.height - (g.height * (aF + sF) / (1.5 * max)), g.width, 4 * g.height * sF / (3 * max));

                        grdf.addColorStop(0, "#FF0");
                        grdf.addColorStop(1, "#F00");
                        gx.strokeStyle = grdf;

                        gx.beginPath();
                        perf._data.fps.forEach((f, i) => {
                            gx[`${i ? "lin" : "mov"}eTo`](i * g.width / lf, g.height - (g.height * ((i ? perf._data.fps[i - 1] : f) / (1.5 * max))));
                        });
                        gx.lineTo(g.width, g.height - (g.height * (perf._data.fps.at(-1) / (1.5 * max))));
                        gx.stroke();
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
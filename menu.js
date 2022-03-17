const zx = xz => {
  let assets = {
    logotransparent: null,
    wettakis: null,
  };
  let elements = [];
  xz.setup = function() {
    assets.logotransparent = xz.loadImage('Brutal League-logos_transparent.png');
    assets.wettakis = xz.loadImage('Wet Takis Studios-logos_transparent.png');
    let cnv = xz.createCanvas(xz.windowWidth, xz.windowHeight);
    xz.imageMode(xz.CENTER);
    cnv.position(0, 0, 'fixed');
    elements[0] = xz.createInput('');
    elements[0].position(xz.width / 2 - xz.width * 0.15, xz.height / 2);
    elements[0].hide();
  };
  xz.draw = function() {
    xz.clear();
    xz.angleMode(xz.RADIANS);
    if(xz.frameCount < 200) {
      xz.background(40);
      xz.translate(xz.width / 2, xz.height / 2);
      xz.image(assets.wettakis, 0, 0, xz.width / 2 + xz.frameCount / 2, xz.width / 2+ xz.frameCount / 2);
    }
    if(xz.frameCount >= 200 && xz.frameCount < 400) {
      xz.background(40);
      xz.translate(xz.width / 2, xz.height / 2);
      xz.image(assets.logotransparent, 0, 0, xz.width / 2+ xz.frameCount / 2 - 200, xz.width / 2 + xz.frameCount / 2 - 200);
    }
    if(xz.frameCount >= 400 && xz.getItem('alpha') != true) {
      xz.background(255);
      elements[0].show();
      if(elements[0].value() == window.btoa('dbcakdjhcjsow')) {
        xz.storeItem('alpha', true);
        inGame = true;
        elements[0].hide();
      }
    }
    if(xz.frameCount >= 400 && xz.getItem('alpha') == true && !inGame) {
      inGame = true;
    }
  };
}
new p5(zx);

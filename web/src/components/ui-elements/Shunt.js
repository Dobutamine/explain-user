import { PIXI } from "src/boot/pixi.js";

export default class Shunt {
  compType = "Shunt";
  key = "";
  label = "";
  pixiApp = {};
  models = [];
  dbcFrom = {};
  dbcTo = {};

  sprite = {};
  spriteColor = 0xffdd00;

  path = null;
  pathColor = 0x886600;

  arc = {
    enabled: false,
    from: 0,
    to: 0,
    xCenter: 0,
    yCenter: 0,
    radius: 0,
  };

  line = {
    enabled: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  };

  spritePosition = 0;
  prevSpriteX = 0;
  prevSpriteY = 0;

  constructor(pixiApp, key, label, models, dbcFrom, dbcTo) {
    this.pixiApp = pixiApp;
    this.key = key;
    this.label = label;
    this.models = models;
    this.dbcFrom = dbcFrom;
    this.dbcTo = dbcTo;

    this.drawPath();

    this.sprite = PIXI.Sprite.from("blood.png");
    this.sprite.anchor = { x: 0.5, y: 0.5 };
    this.sprite.x = this.dbcFrom.sprite.x;
    this.sprite.y = this.dbcFrom.sprite.y;
    this.sprite.scale.set(0.04, 0.04);
    this.sprite.interactive = false;
    this.sprite.tint = this.spriteColor;
    this.sprite.zIndex = 2;

    this.pixiApp.stage.addChild(this.sprite);

    // register with the dbc
    this.dbcFrom.connectors[this.key] = this;
    this.dbcTo.connectors[this.key] = this;
  }
  drawPath() {
    if (this.path) {
      this.path.clear();
      this.pixiApp.stage.removeChild(this.path);
    }
    this.path = new PIXI.Graphics();
    this.path.zIndex = 1;
    this.path.cacheAsBitmap = true;

    this.arc.enabled = false;
    this.line.enabled = true;
    // get the path characteristics
    this.line.x1 = this.dbcFrom.sprite.x;
    this.line.y1 = this.dbcFrom.sprite.y;
    this.line.x2 = this.dbcTo.sprite.x;
    this.line.y2 = this.dbcTo.sprite.y;
    // draw the path
    this.path.lineStyle(1, this.pathColor, 1);
    this.path.moveTo(this.line.x1, this.line.y1);
    this.path.lineTo(this.line.x2, this.line.y2);

    this.pixiApp.stage.addChild(this.path);
  }
  update(data) {
    // get the speed
    let flow = 0;
    this.models.forEach((model) => {
      flow += data[model + ".Flow"];
    });
    this.spritePosition += flow / this.models.length;

    // get the position of the dbc's
    const x1 = this.dbcFrom.sprite.x;
    const y1 = this.dbcFrom.sprite.y;
    const x2 = this.dbcTo.sprite.x;
    const y2 = this.dbcTo.sprite.y;

    // caulcate the new position if the
    if (this.line.enabled) {
      const remapT = this.remap(this.spritePosition, 0, 1, 0, 1);
      const t = remapT / 1;
      this.sprite.x = (1 - t) * x1 + t * x2;
      this.sprite.y = (1 - t) * y1 + t * y2;

      if (remapT > 1) {
        this.spritePosition = 0;
      }
      if (remapT < 0) {
        this.spritePosition = 1;
      }
    }

    // calculate the angle
    let angle = 0;
    angle = Math.atan2(this.sprite.y - y2, this.sprite.x - x2) - 0.785 * 2;
    if (flow < 0) {
      angle = Math.atan2(this.sprite.y - y1, this.sprite.x - x1) - 0.785 * 2;
    }

    if (this.arc.enabled) {
      if (this.spritePosition > this.arc.to) {
        this.spritePosition = this.arc.from;
      }
      if (this.spritePosition < this.arc.from) {
        this.spritePosition = this.arc.to;
      }
      this.sprite.x =
        this.arc.xCenter + Math.cos(this.spritePosition) * this.arc.radius;
      this.sprite.y =
        this.arc.yCenter + Math.sin(this.spritePosition) * this.arc.radius;

      angle = this.spritePosition + Math.PI;
    }

    this.sprite.rotation = angle;

    this.prevSpriteX = this.sprite.x;
    this.prevSpriteY = this.sprite.y;
  }

  remap(value, from1, to1, from2, to2) {
    return ((value - from1) / (to1 - from1)) * (to2 - from2) + from2;
  }
}
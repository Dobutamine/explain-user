import { PIXI } from "src/boot/pixi.js";
import explain from "./blood.png";

class DiagramBloodConnector {
  constructor(id, label, dbcFrom, dbcTo, connectors, pixiApp) {
    this.id = Math.floor(Math.random() * 100000000);
    this.compType = "BloodConnector";
    this.position = 0;
    this.models = connectors;
    this.speed = 1;
    this.pixiApp = pixiApp;
    this.graphics = new PIXI.Graphics();
    this.graphics.dbcFrom = dbcFrom;
    this.graphics.dbcTo = dbcTo;
    this.graphics.id = this.id;
    this.graphics.label = label;
    this.graphics.zIndex = 0;
    this.pixiApp.stage.addChild(this.graphics);
    // eslint-disable-next-line new-cap
    this.sprite = PIXI.Sprite.from(explain);
    this.sprite.anchor = { x: 0.5, y: 0.5 };
    this.sprite.x = 50;
    this.sprite.y = 50;
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.label = label;
    this.sprite.tint = "0x000000";
    this.sprite.zIndex = 2;
    this.pos = 0;
    this.sprite.scale.set(0.04, 0.04);
    this.pixiApp.stage.addChild(this.sprite);
  }

  remove() {
    this.pixiApp.stage.removeChild(this.sprite);
    this.graphics.clear();
  }

  updateSpeed(newSpeed) {
    this.speed = newSpeed;
  }

  redrawConnectors(diagramCompartments, rtData) {
    this.pixiApp.stage.removeChild(this.graphics);
    this.graphics.clear();

    const x1 = diagramCompartments[this.graphics.dbcFrom].sprite.x;
    const y1 = diagramCompartments[this.graphics.dbcFrom].sprite.y;

    const x2 = diagramCompartments[this.graphics.dbcTo].sprite.x;
    const y2 = diagramCompartments[this.graphics.dbcTo].sprite.y;

    this.graphics.beginFill(0xff3300);
    this.graphics.lineStyle(2, 0xaaaaaa, 1);
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.endFill();

    const remapT = this.Remap(this.position, 0, 1, 0, 1);
    const t = remapT / 1;
    this.sprite.x = (1 - t) * x1 + t * x2;
    this.sprite.y = (1 - t) * y1 + t * y2;
    const angle = Math.atan2(y1 - y2, x1 - x2) - 0.785 * 2;
    this.sprite.rotation = angle;

    if (remapT > 1) {
      this.position = 0;
    }
    if (remapT < 0) {
      this.position = 1;
    }
    this.pixiApp.stage.addChild(this.graphics);
  }

  draw(diagramCompartments, rtData) {
    this.graphics.clear();
    // this.pixiApp.stage.removeChild(this.sprite)

    const x1 = diagramCompartments[this.graphics.dbcFrom].sprite.x;
    const y1 = diagramCompartments[this.graphics.dbcFrom].sprite.y;

    const tint1 = diagramCompartments[this.graphics.dbcFrom].sprite.tint;

    const x2 = diagramCompartments[this.graphics.dbcTo].sprite.x;
    const y2 = diagramCompartments[this.graphics.dbcTo].sprite.y;

    const tint2 = diagramCompartments[this.graphics.dbcTo].sprite.tint;

    this.graphics.zIndex = 0;
    this.graphics.beginFill(0xff3300);
    this.graphics.lineStyle(2, 0xaaaaaa, 1);
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.endFill();

    const remapT = this.Remap(this.position, 0, 1, 0, 1);
    const t = remapT / 1;
    this.sprite.x = (1 - t) * x1 + t * x2;
    this.sprite.y = (1 - t) * y1 + t * y2;
    this.sprite.tint = tint1;
    this.sprite.zIndex = 1;

    if (remapT > 1) {
      this.position = 0;
    }
    if (remapT < 0) {
      this.position = 1;
    }

    let flow = 0;
    let angle = 0;
    if (rtData) {
      this.models.forEach((connector) => {
        flow += rtData[0][connector + ".Flow"] * this.speed;
      });
    }
    this.sprite.tint = tint1;
    angle = Math.atan2(y1 - y2, x1 - x2) - 0.785 * 2;
    if (flow < 0) {
      this.sprite.tint = tint2;
      angle = Math.atan2(y2 - y1, x2 - x1) - 0.785 * 2;
    }
    this.sprite.rotation = angle;
    this.position += flow / this.models.length;
    this.pixiApp.stage.addChild(this.graphics);
    // this.pixiApp.stage.addChild(this.sprite)
  }

  Remap(value, from1, to1, from2, to2) {
    return ((value - from1) / (to1 - from1)) * (to2 - from2) + from2;
  }
}

export default DiagramBloodConnector;

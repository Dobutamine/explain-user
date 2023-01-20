import { PIXI } from "src/boot/pixi.js";

export default class GasExchanger {
  compType = "GasEchanger";
  pixiApp = {};
  key = "";
  label = "";
  models = [];
  layout = null;
  xCenter = 0;
  yCenter = 0;
  radius = 0;

  sprite = {};
  text = {};
  textStyle = {};

  interactionData = null;
  connectors = {};

  gas = "O2";
  rotation = 0;

  constructor(
    pixiApp,
    key,
    label,
    models,
    gas,
    layout,
    xCenter,
    yCenter,
    radius
  ) {
    // store the parameters
    this.pixiApp = pixiApp;
    this.key = key;
    this.label = label;
    this.models = models;
    this.gas = ".Flux" + gas;
    this.layout = layout;
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    this.radius = radius;

    // this is a blood compartment sprite which uses
    this.sprite = PIXI.Sprite.from("exchange.png");
    this.sprite.interactive = true;
    this.sprite.on("mousedown", (e) => this.onDragStart(e));
    this.sprite.on("touchstart", (e) => this.onDragStart(e));
    this.sprite.on("mouseupoutside", (e) => this.onDragEnd(e));
    this.sprite.on("touchendoutside", (e) => this.onDragEnd(e));
    this.sprite.on("mouseup", (e) => this.onDragEnd(e));
    this.sprite.on("touchend", (e) => this.onDragEnd(e));
    this.sprite.on("mousemove", (e) => this.onDragMove(e));
    this.sprite.on("touchmove", (e) => this.onDragMove(e));
    this.sprite.scale.set(this.layout.scale.x, this.layout.scale.y);
    this.sprite.anchor = { x: 0.5, y: 0.5 };
    this.sprite.tint = "0xffffff";
    this.sprite.zIndex = 4;

    // place the sprite on the stage
    switch (this.layout.pos.type) {
      case "arc":
        this.sprite.x =
          this.xCenter +
          Math.cos(this.layout.pos.dgs * 0.0174533) *
            this.xCenter *
            this.radius;
        this.sprite.y =
          this.yCenter +
          Math.sin(this.layout.pos.dgs * 0.0174533) *
            this.xCenter *
            this.radius;
        break;
      case "rel":
        this.sprite.x = this.layout.pos.x * this.xCenter;
        this.sprite.y = this.layout.pos.y * this.yCenter;
        break;
    }

    this.pixiApp.stage.addChild(this.sprite);

    //define the caption style and text object and add it to the stage
    this.textStyle = new PIXI.TextStyle({
      fill: "white",
      fontSize: this.layout.text.size,
      fontFamily: "Arial",
      strokeThickness: 0,
    });
    this.text = new PIXI.Text(this.label, this.textStyle);
    this.text.anchor = { x: 0.5, y: 0.5 };
    this.text.x = this.sprite.x + this.layout.text.x;
    this.text.y = this.sprite.y + this.layout.text.y;
    this.text.zIndex = 4;

    this.pixiApp.stage.addChild(this.text);
  }
  update(data) {
    let difO2 = 0;

    this.models.forEach((model) => {
      difO2 += data[model + this.gas];
    });

    // calculate factors
    this.rotation += (difO2 / this.models.length) * 10000;
    if (this.rotation > 2 * Math.PI) {
      this.rotation = 0;
    }
    //console.log(this.rotation);
    this.sprite.rotation = -this.rotation;
  }
  onDragStart(e) {
    this.interactionData = e.data;
    this.sprite.alpha = 0.5;
    this.text.alpha = 0.5;
  }
  onDragMove(e) {
    if (this.interactionData) {
      this.sprite.x = this.interactionData.global.x;
      this.sprite.y = this.interactionData.global.y;
      this.text.x = this.sprite.x + this.layout.text.x;
      this.text.y = this.sprite.y + this.layout.text.y;
      this.layout.pos.x = this.sprite.x / this.xCenter;
      this.layout.pos.y = this.sprite.y / this.yCenter;
      this.calculateOnCircle(this.sprite.x, this.sprite.y);
      // redraw the connector
      this.redrawConnectors();
    }
  }
  onDragEnd(e) {
    this.interactionData = null;
    this.sprite.alpha = 1;
    this.text.alpha = 1;
  }
  redrawConnectors() {
    Object.values(this.connectors).forEach((connector) => connector.drawPath());
  }
  calculateOnCircle(x, y) {
    const f1 = Math.pow(x - this.xCenter, 2);
    const f2 = Math.pow(y - this.yCenter, 2);
    let distance = Math.abs(Math.sqrt(f1 + f2) - this.radius * this.xCenter);
    //console.log(distance - this.radius * this.xCenter);
    let angle = 0;
    if (distance < 5) {
      // on circle
      angle = Math.atan2(this.yCenter - y, x - this.xCenter) * 57.2958;
      if (this.yCenter - y > 0) {
        angle = 180 + (180 - angle);
      } else {
        angle = -angle;
      }
      this.layout.pos.type = "arc";
      this.layout.pos.dgs = angle;
      // snap to the circle
      this.sprite.x =
        this.xCenter + Math.cos(angle * 0.0174533) * this.xCenter * this.radius;
      this.sprite.y =
        this.yCenter + Math.sin(angle * 0.0174533) * this.xCenter * this.radius;
      this.text.x = this.sprite.x + this.layout.text.x;
      this.text.y = this.sprite.y + this.layout.text.y;
    } else {
      this.layout.pos.type = "rel";
    }
  }
}

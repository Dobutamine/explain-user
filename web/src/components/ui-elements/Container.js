import { PIXI } from "src/boot/pixi.js";

export default class Container {
  compType = "Container";
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

  volume = 0.1;

  constructor(pixiApp, key, label, models, layout, xCenter, yCenter, radius) {
    // store the parameters
    this.pixiApp = pixiApp;
    this.key = key;
    this.label = label;
    this.models = models;
    this.layout = layout;
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    this.radius = radius;

    // this is a blood compartment sprite which uses
    this.sprite = PIXI.Sprite.from("container.png");
    this.sprite.interactive = true;
    this.sprite.on("mousedown", (e) => this.onDragStart(e));
    this.sprite.on("touchstart", (e) => this.onDragStart(e));
    this.sprite.on("mouseupoutside", (e) => this.onDragEnd(e));
    this.sprite.on("touchendoutside", (e) => this.onDragEnd(e));
    this.sprite.on("mouseup", (e) => this.onDragEnd(e));
    this.sprite.on("touchend", (e) => this.onDragEnd(e));
    this.sprite.on("mousemove", (e) => this.onDragMove(e));
    this.sprite.on("touchmove", (e) => this.onDragMove(e));
    this.sprite.scale.set(
      this.volume * this.layout.scale.x,
      this.volume * this.layout.scale.y
    );
    this.sprite.anchor = { x: 0.5, y: 0.5 };
    this.sprite.tint = "0x151a7b";
    this.sprite.zIndex = 2;

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
    this.text.zIndex = 2;

    this.pixiApp.stage.addChild(this.text);
  }
  update(data) {
    let volume = 0;
    this.models.forEach((model) => {
      volume += data[model + ".Vol"];
    });

    this.volume = this.calculateRadius(volume);

    this.sprite.scale.set(
      this.volume * this.layout.scale.x,
      this.volume * this.layout.scale.y
    );
    let scaleFont = this.volume * this.layout.text.size;
    if (scaleFont > 1.1) {
      scaleFont = 1.1;
    }
    this.text.scale.set(scaleFont, scaleFont);
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
  calculateRadius(volume) {
    const _cubicRadius = volume / ((4.0 / 3.0) * Math.PI);
    const _radius = Math.pow(_cubicRadius, 1.0 / 3.0);
    return _radius;
  }
}

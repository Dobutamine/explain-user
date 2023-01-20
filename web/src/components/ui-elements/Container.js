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
  globalScale = 1.0;
  scaleSprite = 1.0;
  scaleText = 8.0;

  interactionData = null;

  volume = 0;

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
    this.textOffset = -30;

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
    this.sprite.scale.set(0.15, 0.15);
    this.sprite.anchor = { x: 0.5, y: 0.5 };
    this.sprite.tint = "0x555555";
    this.sprite.zIndex = 3;

    // place the sprite on the stage
    switch (this.layout.type) {
      case "arc":
        this.sprite.x =
          this.xCenter +
          Math.cos(this.layout.dgs * 0.0174533) * this.xCenter * this.radius;
        this.sprite.y =
          this.yCenter +
          Math.sin(this.layout.dgs * 0.0174533) * this.xCenter * this.radius;
        break;
      case "rel":
        this.sprite.x = this.xCenter * this.layout.x;
        this.sprite.y = this.yCenter * this.layout.y;
        break;
    }

    this.pixiApp.stage.addChild(this.sprite);

    //define the caption style and text object and add it to the stage
    this.textStyle = new PIXI.TextStyle({
      fill: "white",
      fontSize: 10,
      fontFamily: "Arial",
      strokeThickness: 0,
    });
    this.text = new PIXI.Text(this.label, this.textStyle);
    this.text.anchor = { x: 0.5, y: 0.5 };
    this.text.x = this.sprite.x;
    this.text.y = this.sprite.y + this.textOffset;
    this.text.zIndex = 3;

    this.pixiApp.stage.addChild(this.text);
  }
  update(data) {
    let volume = 0;
    let volumes = [];

    this.models.forEach((model) => {
      volume += data[model + ".Vol"];
      volumes.push(data[model + ".Vol"]);
    });

    this.volume = this.calculateRadius(volume);

    this.sprite.scale.set(
      this.volume * this.scaleSprite * this.globalScale,
      this.volume * this.scaleSprite * this.globalScale
    );
    let scaleFont = this.volume * this.scaleText * this.globalScale;
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
      this.text.x = this.interactionData.global.x;
      this.text.y = this.interactionData.global.y + this.textOffset;
      this.layout.x = this.sprite.x / this.xCenter;
      this.layout.y = this.sprite.y / this.yCenter;
      this.calculateOnCircle(this.sprite.x, this.sprite.y);
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
      this.layout.type = "arc";
      this.layout.dgs = angle;
      // snap to the circle
      this.sprite.x =
        this.xCenter + Math.cos(angle * 0.0174533) * this.xCenter * this.radius;
      this.sprite.y =
        this.yCenter + Math.sin(angle * 0.0174533) * this.xCenter * this.radius;
      this.text.x = this.sprite.x;
      this.text.y = this.sprite.y;
    } else {
      this.layout.type = "rel";
    }
  }
  calculateRadius(volume) {
    const _cubicRadius = volume / ((4.0 / 3.0) * Math.PI);
    const _radius = Math.pow(_cubicRadius, 1.0 / 3.0);
    return _radius;
  }
}

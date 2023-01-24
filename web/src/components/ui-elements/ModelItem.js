import { PIXI } from "src/boot/pixi.js";

export default class ModelItem {
  compType = "ModelItem";
  pixiApp = {};
  key = "";
  label = "";
  model = null;
  modelType = null;
  modelState = null;
  modelTreeComponents = null;
  layout = null;
  xWidth = 0;
  yHeight = 0;

  sprite = {};
  text = {};
  textStyle = {};

  interactionData = null;

  volume = 0.1;

  inputs = [];
  outputs = [];

  edit_comp_event = null;

  modelTreeEvent = new CustomEvent("modeltreeupdate");

  constructor(pixiApp, key, model, modelState, modelTreeComponents, layout) {
    // store the parameters
    this.pixiApp = pixiApp;
    this.key = key;
    this.label = key;
    this.model = model;
    this.modelTreeComponents = modelTreeComponents;
    this.layout = layout;
    this.modelState = modelState;

    // get the center coordinate
    this.xWidth = this.pixiApp.renderer.width;
    this.yHeight = this.pixiApp.renderer.height;

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
    this.sprite.scale.set(0.05, 0.05);
    this.sprite.anchor = { x: 0.5, y: 0.5 };
    this.sprite.tint = "0x151a7b";
    this.sprite.zIndex = 2;

    switch (this.model.ModelType) {
      case "BloodCompliance":
        this.sprite.x = Math.random() * (this.xWidth / 4);
        this.sprite.y = Math.random() * (this.yHeight / 4);
        break;
      case "BloodResistor":
        this.sprite.x = Math.random() * (this.xWidth / 4);
        this.sprite.y = Math.random() * (this.yHeight / 4);
        break;
      case "BloodTimeVaryingElastance":
        this.sprite.x = Math.random() * (this.xWidth / 4);
        this.sprite.y = Math.random() * (this.yHeight / 4);
        break;
      case "GasCompliance":
        this.sprite.x = Math.random() * (this.xWidth / 4) + this.xWidth / 4;
        this.sprite.y = Math.random() * (this.yHeight / 4);
        break;
      case "GasResistor":
        this.sprite.x = Math.random() * (this.xWidth / 4) + this.xWidth / 4;
        this.sprite.y = Math.random() * (this.yHeight / 4);
        break;
      default:
        this.sprite.x = Math.random() * (this.xWidth / 4);
        this.sprite.y = Math.random() * (this.yHeight / 4) + this.yHeight / 4;
    }

    // place the sprite on the stage
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
    this.text.y = this.sprite.y;
    this.text.zIndex = 2;

    this.pixiApp.stage.addChild(this.text);
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
      this.text.x = this.sprite.x; // + this.layout.text.x;
      this.text.y = this.sprite.y; // + this.layout.text.y;
    }
  }
  onDragEnd(e) {
    this.interactionData = null;
    this.sprite.alpha = 1;
    this.text.alpha = 1;
    document.dispatchEvent(this.modelTreeEvent);
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

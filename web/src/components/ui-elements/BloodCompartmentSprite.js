import { _themeLoaderDarkTurquoise } from "@arction/lcjs";
import { PIXI } from "src/boot/pixi.js";

export default class BloodCompartmentSprite {
  id = "";
  label = "";
  container = {};
  sprite = {};
  text = {};
  textStyle = {};
  models = [];
  posDgs = -1;
  posCoordinates = {};
  interactionData = null;

  volume = 0;
  to2 = 7.4;

  constructor(container, id, label, models, posCircle, posCoordinate) {
    this.container = container;
    this.id = id;
    this.label = label;
    this.models = models;
    this.globalScale = 1;
    this.scaleSprite = 1;
    this.scaleText = 7;
    this.scalingFactorX = 1;
    this.scalingFactorY = 1;

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
    this.sprite.tint = "0x151a7b";
    this.sprite.zIndex = 3;

    if (posCircle) {
      this.sprite.x =
        posCircle.x +
        Math.cos(posCircle.pos * 0.0174533) * posCircle.radius +
        posCircle.x_offset;
      this.sprite.y =
        posCircle.y +
        Math.sin(posCircle.pos * 0.0174533) * posCircle.radius +
        posCircle.y_offset;
    }
    if (posCoordinate) {
      this.sprite.x = posCoordinate.x;
      this.sprite.y = posCoordinate.y;
    }
    this.container.addChild(this.sprite);

    //define the caption style and text object and add it to the stage
    this.textStyle = new PIXI.TextStyle({
      fill: "white",
      fontSize: 12,
      fontFamily: "Arial",
      strokeThickness: 0,
    });
    this.text = new PIXI.Text(this.label, this.textStyle);
    this.text.anchor = { x: 0.5, y: 0.5 };
    this.text.x = this.sprite.x;
    this.text.y = this.sprite.y;
    this.text.zIndex = 3;
    this.container.addChild(this.text);
  }
  update(data) {
    let volume = 0;
    let volumes = [];
    let to2s = [];
    this.models.forEach((model) => {
      volume += data[model + ".Vol"];
      volumes.push(data[model + ".Vol"]);
      to2s.push(data[model + ".To2"]);
    });
    // calculate factors
    this.to2 = 0;
    for (let i = 0; i < volumes.length; i++) {
      let factor = volumes[i] / volume;
      this.to2 += factor * to2s[i];
    }

    this.volume = this.calculateRadius(volume);

    this.sprite.scale.set(
      this.volume * this.scalingFactorX * this.scaleSprite * this.globalScale,
      this.volume * this.scalingFactorY * this.scaleSprite * this.globalScale
    );
    let scaleFont =
      this.volume * this.scalingFactorX * this.scaleText * this.globalScale;
    if (scaleFont > 1.1) {
      scaleFont = 1.1;
    }
    this.text.scale.set(scaleFont, scaleFont);
    this.sprite.tint = this.CalculateColor(this.to2);
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
      this.text.y = this.interactionData.global.y;
    }
  }
  onDragEnd(e) {
    this.interactionData = null;
    this.sprite.alpha = 1;
    this.text.alpha = 1;
  }

  calculateRadius(volume) {
    const _cubicRadius = volume / ((4.0 / 3.0) * Math.PI);
    const _radius = Math.pow(_cubicRadius, 1.0 / 3.0);
    return _radius;
  }
  CalculateColor(to2) {
    if (to2 > 7.6) {
      to2 = 7.6;
    }
    let remap = this.Remap(to2, 0, 7.6, -10, 1);
    if (remap < 0) remap = 0;
    const red = (remap * 210).toFixed(0);
    const green = (remap * 80).toFixed(0);
    const blue = (80 + remap * 75).toFixed(0);
    const color = "0x" + this.fullColorHex(red, green, blue);
    return color;
  }
  Remap(value, from1, to1, from2, to2) {
    return ((value - from1) / (to1 - from1)) * (to2 - from2) + from2;
  }

  rgbToHex(rgb) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  }

  fullColorHex(r, g, b) {
    const red = this.rgbToHex(r);
    const green = this.rgbToHex(g);
    const blue = this.rgbToHex(b);
    return red + green + blue;
  }
}

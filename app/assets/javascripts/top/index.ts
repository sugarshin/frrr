export default class Circle {
  constructor(public x: number, public y: number, public r: number) {}
  draw(ctx: CanvasRenderingContext2D) {
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
  }
  static unit() {
    return new Circle(0, 0, 1);
  }
}
console.log('test');

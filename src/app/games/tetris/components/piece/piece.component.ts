import { COLORS, SHAPES } from '../../constants';

export interface IPiece {
  x: number;
  y: number;
  color: string | undefined;
  shape: number[][] | undefined;
}

export class Piece implements IPiece {
  x: number;
  y: number;
  color: string | undefined;
  shape: number[][] | undefined;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.x = 0;
    this.y = 0;
    this.spawn();
  }

  spawn() {
    const typeId = this.randomizeTetrominoType(COLORS.length - 1);
    this.shape = SHAPES[typeId];
    this.color = COLORS[typeId];
    this.x = typeId === 4 ? 4 : 3;
    this.y = 0;
  }

  draw() {
    if (this.ctx && this.shape && this.color) {
      this.ctx.fillStyle = this.color;
      this.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0 && this.x && this.y) {
            this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
          }
        });
      });
    }
  }

  drawNext(ctxNext: CanvasRenderingContext2D) {
    ctxNext.clearRect(0, 0, ctxNext.canvas.width, ctxNext.canvas.height);
    if (this.color && this.shape) {
      ctxNext.fillStyle = this.color;
      this.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) {
            ctxNext.fillRect(x, y, 1, 1);
          }
        });
      });
    }
  }

  move(p: IPiece) {
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
  }

  randomizeTetrominoType(noOfTypes: number): number {
    return Math.floor(Math.random() * noOfTypes + 1);
  }
}

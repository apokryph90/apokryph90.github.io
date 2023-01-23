import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  BLOCK_SIZE,
  COLORS,
  COLS,
  KEY,
  LEVEL,
  LINES_PER_LEVEL,
  POINTS,
  ROWS,
} from '../../constants';
import { IPiece, Piece } from '../piece/piece.component';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @ViewChild('board', { static: true })
  canvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('next', { static: true })
  canvasNext: ElementRef<HTMLCanvasElement> | undefined;
  ctx: CanvasRenderingContext2D | undefined | null;
  ctxNext: CanvasRenderingContext2D | undefined | null;
  board: number[][] | undefined;
  piece: Piece | undefined;
  next: Piece | undefined;
  requestId: number | undefined;
  time: { start: number; elapsed: number; level: number } | undefined;
  points: number | undefined;
  lines: number | undefined;
  level: number | undefined;
  moves: any = {
    [KEY.LEFT]: (p: IPiece): IPiece => ({ ...p, x: p.x - 1 }),
    [KEY.RIGHT]: (p: IPiece): IPiece => ({ ...p, x: p.x + 1 }),
    [KEY.DOWN]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1 }),
    [KEY.SPACE]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1 }),
    [KEY.UP]: (p: IPiece): IPiece => this.service.rotate(p),
  };

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // reference: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
    if (
      this.board != null &&
      this.piece != null &&
      this.points != null &&
      this.moves != null
    ) {
      if (event.code === KEY.ESC) {
        this.gameOver();
      } else if (this.moves[event.code]) {
        event.preventDefault();
        // Get new state
        let p = this.moves[event.code](this.piece);
        if (event.code === KEY.SPACE) {
          // Hard drop
          while (this.service.valid(p, this.board)) {
            this.points += POINTS.HARD_DROP;
            this.piece.move(p);
            p = this.moves[KEY.DOWN](this.piece);
          }
        } else if (this.service.valid(p, this.board)) {
          this.piece.move(p);
          if (event.code === KEY.DOWN) {
            this.points += POINTS.SOFT_DROP;
          }
        }
      }
    }
  }

  constructor(private service: GameService) {}

  ngOnInit() {
    this.initBoard();
    this.initNext();
    this.resetGame();
  }

  initBoard() {
    if (this.canvas) {
      this.ctx = this.canvas.nativeElement.getContext('2d');

      if (this.ctx) {
        // Calculate size of canvas from constants.
        this.ctx.canvas.width = COLS * BLOCK_SIZE;
        this.ctx.canvas.height = ROWS * BLOCK_SIZE;

        // Scale so we don't need to give size on every draw.
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }

  initNext() {
    if (this.canvasNext) {
      this.ctxNext = this.canvasNext.nativeElement.getContext('2d');
    }

    if (this.ctxNext) {
      // Calculate size of canvas from constants.
      this.ctxNext.canvas.width = 4 * BLOCK_SIZE;
      this.ctxNext.canvas.height = 4 * BLOCK_SIZE;

      this.ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
    }
  }

  play() {
    this.resetGame();
    if (this.ctx && this.ctxNext && this.time) {
      this.next = new Piece(this.ctx);
      this.piece = new Piece(this.ctx);
      this.next.drawNext(this.ctxNext);
      this.time.start = performance.now();
    }

    // If we have an old game running a game then cancel the old
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }

    this.animate();
  }

  resetGame() {
    this.points = 0;
    this.lines = 0;
    this.level = 0;
    this.board = this.getEmptyBoard();
    // @ts-ignore
    this.time = { start: 0, elapsed: 0, level: LEVEL[this.level] };
  }

  animate(now = 0) {
    if (this.time) {
      this.time.elapsed = now - this.time.start;
      if (this.time.elapsed > this.time.level) {
        this.time.start = now;
        if (!this.drop()) {
          this.gameOver();
          return;
        }
      }
    }
    this.draw();
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  draw() {
    if (this.ctx && this.piece) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.piece.draw();
      this.drawBoard();
    }
  }

  drop(): boolean {
    if (this.board && this.piece && this.ctx && this.ctxNext) {
      let p = this.moves[KEY.DOWN](this.piece);
      if (this.service.valid(p, this.board)) {
        this.piece.move(p);
      } else {
        this.freeze();
        this.clearLines();
        if (this.piece.y === 0) {
          // Game over
          return false;
        }
        this.piece = this.next;
        this.next = new Piece(this.ctx);
        this.next.drawNext(this.ctxNext);
      }
    }
    return true;
  }

  clearLines() {
    let lines = 0;
    if (this.board) {
      this.board.forEach((row, y) => {
        if (row.every((value) => value !== 0)) {
          lines++;
          if (this.board) {
            this.board.splice(y, 1);
            this.board.unshift(Array(COLS).fill(0));
          }
        }
      });
    }
    if (lines > 0 && this.points && this.lines && this.level && this.time) {
      this.points += this.service.getLinesClearedPoints(lines, this.level);
      this.lines += lines;
      if (this.lines >= LINES_PER_LEVEL) {
        this.level++;
        this.lines -= LINES_PER_LEVEL;
        // @ts-ignore
        this.time.level = LEVEL[this.level];
      }
    }
  }

  freeze() {
    if (this.piece?.shape) {
      this.piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0 && this.board && this.piece) {
            this.board[y + this.piece.y][x + this.piece.x] = value;
          }
        });
      });
    }
  }

  drawBoard() {
    if (this.board) {
      this.board.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0 && this.ctx) {
            this.ctx.fillStyle = COLORS[value];
            this.ctx.fillRect(x, y, 1, 1);
          }
        });
      });
    }
  }

  gameOver() {
    if (this.requestId && this.ctx) {
      cancelAnimationFrame(this.requestId);
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(1, 3, 8, 1.2);
      this.ctx.font = '1px Arial';
      this.ctx.fillStyle = 'red';
      this.ctx.fillText('GAME OVER', 1.8, 4);
    }
  }

  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }
}

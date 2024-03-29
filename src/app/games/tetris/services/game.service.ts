import { Injectable } from '@angular/core';
import { COLS, POINTS, ROWS } from '../constants';
import { IPiece } from '../components/piece/piece.component';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  valid(p: IPiece, board: number[][]): boolean {
    if (p.shape) {
      return p.shape.every((row, dy) => {
        return row.every((value, dx) => {
          let x = p.x ? p.x + dx : 0;
          let y = p.y ? p.y + dy : 0;
          return (
            this.isEmpty(value) ||
            (this.insideWalls(x) &&
              this.aboveFloor(y) &&
              this.notOccupied(board, x, y))
          );
        });
      });
    } else {
      return false;
    }
  }

  isEmpty(value: number): boolean {
    return value === 0;
  }

  insideWalls(x: number): boolean {
    return x >= 0 && x < COLS;
  }

  aboveFloor(y: number): boolean {
    return y <= ROWS;
  }

  notOccupied(board: number[][], x: number, y: number): boolean {
    return board[y] && board[y][x] === 0;
  }

  rotate(piece: IPiece): IPiece {
    let p: IPiece = JSON.parse(JSON.stringify(piece));
    if (p.shape) {
      for (let y = 0; y < p.shape.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
        }
      }
      p.shape.forEach((row) => row.reverse());
    }
    return p;
  }

  getLinesClearedPoints(lines: number, level: number): number {
    const lineClearPoints =
      lines === 1
        ? POINTS.SINGLE
        : lines === 2
        ? POINTS.DOUBLE
        : lines === 3
        ? POINTS.TRIPLE
        : lines === 4
        ? POINTS.TETRIS
        : 0;

    return (level + 1) * lineClearPoints;
  }
}

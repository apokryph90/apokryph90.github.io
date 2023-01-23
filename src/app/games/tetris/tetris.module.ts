import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { SharedModule } from '../../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule, SharedModule, MatButtonModule],
})
export class TetrisModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { BoardComponent } from './games/tetris/components/board/board.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'tetris', component: BoardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

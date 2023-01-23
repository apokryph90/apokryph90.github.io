import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';

const materialModules = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatGridListModule,
];
const components = [HeaderComponent];

@NgModule({
  declarations: [...components, DashboardComponent],
  exports: [...materialModules, ...components],
  imports: [...materialModules, CommonModule],
})
export class SharedModule {}

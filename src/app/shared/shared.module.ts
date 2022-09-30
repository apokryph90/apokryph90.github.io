import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardComponent } from './dashboard/dashboard.component';

const materialModules = [MatToolbarModule, MatIconModule, MatButtonModule];
const components = [HeaderComponent];

@NgModule({
  declarations: [...components, DashboardComponent],
  exports: [...materialModules, ...components],
  imports: [CommonModule, ...materialModules],
})
export class SharedModule {}

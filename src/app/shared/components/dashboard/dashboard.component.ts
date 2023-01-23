import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  games = [
    {
      route: 'tetris',
      title: 'Tetris',
      isAnimated: true,
      isDisabled: false,
    },
    {
      route: '',
      title: 'Coming Soon',
      isAnimated: false,
      isDisabled: true,
    },
    {
      route: '',
      title: 'Coming Soon',
      isAnimated: false,
      isDisabled: true,
    },
    {
      route: '',
      title: 'Coming Soon',
      isAnimated: false,
      isDisabled: true,
    },
    {
      route: '',
      title: 'Coming Soon',
      isAnimated: false,
      isDisabled: true,
    },
    {
      route: '',
      title: 'Coming Soon',
      isAnimated: false,
      isDisabled: true,
    },
  ];
  constructor(public router: Router) {}

  ngOnInit(): void {}
}

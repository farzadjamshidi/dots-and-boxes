import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent
{
  x = 7;
  y = 5;

  constructor(
    private router: Router
  )
  {
  }

  goToGameBoardPage(): void
  {
    this.router.navigate(['/game-board']);
  }
}

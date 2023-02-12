import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataStoreHelper } from '../../helpers/data-store/data-store.helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent
{
  defaultNumberOfColumns = 7;
  defaultNumberOfRows = 5;

  numberOfColumns: number;
  numberOfRows: number;

  defaultPlayer1Name = "Player 1";
  defaultPlayer2Name = "Player 2";

  player1Name: string;
  player2Name: string;

  constructor(
    private dataStoreHelper: DataStoreHelper,
    private router: Router
  )
  {
    this.numberOfColumns = this.defaultNumberOfColumns;
    this.numberOfRows = this.defaultNumberOfRows;

    this.player1Name = this.defaultPlayer1Name;
    this.player2Name = this.defaultPlayer2Name;
  }

  goToGameBoardPage(): void
  {
    this.dataStoreHelper.set({
      numberOfColumns: this.numberOfColumns,
      numberOfRows: this.numberOfRows,
      player1Name: this.player1Name,
      player2Name: this.player2Name
    });

    this.router.navigate(['/game-board']);
  }
}

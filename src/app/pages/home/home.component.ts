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

  constructor(
    private dataStoreHelper: DataStoreHelper,
    private router: Router
  )
  {
    this.numberOfColumns = this.defaultNumberOfColumns;
    this.numberOfRows = this.defaultNumberOfRows;
  }

  goToGameBoardPage(): void
  {
    this.dataStoreHelper.setNumberOfColumns(this.numberOfColumns);
    this.dataStoreHelper.setNumberOfRows(this.numberOfRows);

    this.router.navigate(['/game-board']);
  }
}

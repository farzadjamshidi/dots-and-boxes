import { Injectable } from '@angular/core';
import { DataStore } from '../../models/data-store.model';

@Injectable({
  providedIn: 'root'
})
export class DataStoreHelper
{
  data = new DataStore();

  constructor() { }

  setNumberOfRows(number: number): void
  {
    this.data.numberOfRows = number;
  }

  getNumberOfRows(): number
  {
    return this.data.numberOfRows;
  }

  setNumberOfColumns(number: number): void
  {
    this.data.numberOfColumns = number;
  }

  getNumberOfColumns(): number
  {
    return this.data.numberOfColumns;
  }

  setPlayer1Name(name: string): void
  {
    this.data.player1Name = name;
  }

  getPlayer1Name(): string
  {
    return this.data.player1Name;
  }

  setPlayer2Name(name: string): void
  {
    this.data.player2Name = name;
  }

  getPlayer2Name(): string
  {
    return this.data.player2Name;
  }

  set(data: DataStore): void
  {
    this.data = data;
  }

  get(): DataStore
  {
    return this.data;
  }
}

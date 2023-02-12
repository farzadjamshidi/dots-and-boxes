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

  get(): DataStore
  {
    return this.data;
  }
}

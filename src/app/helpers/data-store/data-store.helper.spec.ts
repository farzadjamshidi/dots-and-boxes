import { TestBed } from '@angular/core/testing';

import { DataStoreHelper } from './data-store.helper';

describe('DataStoreHelper', () =>
{
  let service: DataStoreHelper;

  beforeEach(() =>
  {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataStoreHelper);
  });

  it('should be created', () =>
  {
    expect(service).toBeTruthy();
  });
});

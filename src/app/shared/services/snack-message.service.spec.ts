import { TestBed, inject } from '@angular/core/testing';

import { SnackMessageService } from './snack-message.service';

describe('SnackMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SnackMessageService]
    });
  });

  it('should be created', inject([SnackMessageService], (service: SnackMessageService) => {
    expect(service).toBeTruthy();
  }));
});

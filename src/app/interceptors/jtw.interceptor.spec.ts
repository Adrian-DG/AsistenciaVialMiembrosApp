import { TestBed } from '@angular/core/testing';

import { JtwInterceptor } from './jtw.interceptor';

describe('JtwInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      JtwInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: JtwInterceptor = TestBed.inject(JtwInterceptor);
    expect(interceptor).toBeTruthy();
  });
});

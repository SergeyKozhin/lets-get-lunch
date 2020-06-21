import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let authService: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    authService = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('signup', () => {
    it('should return user object with a valid username and password', () => {
      const user = { username: 'myUser', password: 'password' };
      const signupResponse = {
        __v: 0,
        username: 'myUSer',
        password: '$2a$10$DzVF06XESi6ZaatiO1DIMe1K1tAJuQPSxSxvWEAcFiJljWpCg3ojm',
        _id: '5eef96b30714f02fe5be23d5',
        dietPreferences: []
      };
      let response;

      authService.signup(user).subscribe(res => response = res);

      http.expectOne('http://localhost:8080/api/users').flush(signupResponse);
      expect(response).toEqual(signupResponse);
      http.verify();
    });
  });

  it('should return an error for an invalid user object', () => {
    const user = { username: 'myUSer', password: 'pswd' };
    const signupResponse = 'Your password must be at least 5 characters long.';
    let errorResponse;

    authService.signup(user).subscribe(_ => {}, err => {
      errorResponse = err;
    });

    http.expectOne('http://localhost:8080/api/users')
      .flush({ message: signupResponse }, { status: 400, statusText: 'Bad request' });
    expect(errorResponse.error.message).toEqual(signupResponse);
    http.verify();
  });

});

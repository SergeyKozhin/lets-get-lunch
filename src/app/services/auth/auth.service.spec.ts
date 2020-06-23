import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { JwtModule } from '@auth0/angular-jwt';
import { tokenGetter } from '../../app.module';

describe('AuthService', () => {
  let authService: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        JwtModule.forRoot({
          config: {
            tokenGetter
          }
        })
      ]
    });
    authService = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('signup', () => {
    it('should return a token with a valid username and password', () => {
      const user = { username: 'myUser', password: 'password' };
      const signupResponse = {
        __v: 0,
        username: 'myUSer',
        password: '$2a$10$DzVF06XESi6ZaatiO1DIMe1K1tAJuQPSxSxvWEAcFiJljWpCg3ojm',
        _id: '5eef96b30714f02fe5be23d5',
        dietPreferences: []
      };
      const loginResponse = { token: 'secret' };
      let response;

      authService.signup(user).subscribe(res => response = res);
      spyOn(authService, 'login').and.callFake(() => of(loginResponse));

      http.expectOne('http://localhost:8080/api/users').flush(signupResponse);
      expect(response).toEqual(loginResponse);
      expect(authService.login).toHaveBeenCalled();
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

  describe('login', () => {
    it('should return a token with a valid username and password', () => {
      const user = { username: 'myUSer', password: 'password' };
      const loginResponse = { token: 'secret' };
      let response;

      authService.login(user).subscribe(res => {
        response = res;
      });
      spyOn(authService.loggedIn, 'emit');

      http.expectOne('http://localhost:8080/api/sessions').flush(loginResponse);
      expect(response).toEqual(loginResponse);
      expect(localStorage.getItem('Authorization')).toEqual(loginResponse.token);
      expect(authService.loggedIn.emit).toHaveBeenCalledWith(true);
      http.verify();
    });
  });

  describe('logout', () => {
    it('should clear the token from local storage', () => {
      spyOn(authService.loggedIn, 'emit');

      localStorage.setItem('Authorization', 'secret');
      expect(localStorage.getItem('Authorization')).toEqual('secret');

      authService.logout();

      expect(localStorage.getItem('Authorization')).toBeFalsy();
      expect(authService.loggedIn.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if the user is logged in', () => {
      localStorage.setItem('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdW' +
        'IiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMe' +
        'KKF2QT4fwpMeJf36POk6yJV_adQssw5c');

      expect(authService.isLoggedIn()).toEqual(true);
    });

    it('should return false if the user is not logged in', () => {
      localStorage.removeItem('Authorization');
      expect(authService.isLoggedIn()).toEqual(false);
    });
  });

});

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  signup(credentials: User): Observable<object> {
    return this.http.post('http://localhost:8080/api/users', credentials)
      .pipe(
        mergeMap(_ => this.login(credentials))
      );
  }

  login(credentials: User): Observable<object> {
    return this.http.post('http://localhost:8080/api/sessions', credentials)
      .pipe(
        tap((res: any) => localStorage.setItem('Authorization', res.token))
      );
  }

  isLoggedIn() {
    return !this.jwtHelper.isTokenExpired();
  }
}

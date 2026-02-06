import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Token } from '../models/token';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) { }

  authenticate(credentials: any) {
    const localStorage = this.document.defaultView?.localStorage;
    return this.http.post<Token>(this.url + '/user/auth', {
      login: credentials.login,
      password: credentials.password
    }).pipe(
      map((result: Token | any) => {
        if (result && result.token) {
          localStorage?.setItem('token', result.token);
          if (result.userId) {
            localStorage?.setItem('userId', result.userId);
          }
          return true;
        }
        return false;
      })
    );
  }

  createOrUpdate(credentials: any) {
    return this.http.post(this.url + '/user/create', credentials);
  }

  logout() {
    const localStorage = this.document.defaultView?.localStorage;
    return this.http.delete(this.url + '/user/logout/1')
      .pipe(
        map(() => {
          localStorage?.removeItem('token');
          localStorage?.removeItem('userId');
        })
      );
  }

  isLoggedIn(): boolean {
    const localStorage = this.document.defaultView?.localStorage;
    const token = localStorage?.getItem('token');
    return !!token;
  }

  get currentUser() {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const userId = this.getUserId();
    return { name: 'Użytkownik', userId: userId || '1' };
  }

  getToken(): string | null {
    const localStorage = this.document.defaultView?.localStorage;
    return localStorage?.getItem('token') || null;
  }

  getUserId(): string | null {
    const localStorage = this.document.defaultView?.localStorage;
    return localStorage?.getItem('userId') || null;
  }
}
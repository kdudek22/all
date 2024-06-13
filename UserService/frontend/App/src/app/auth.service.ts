import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { User } from './User';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private appService: AppService,
    private http: HttpClient,
    private cookiesService: CookieService
  ) {}

  private apiUrl = 'http://localhost:8095/api/v1/users';

  async login(
    email: string,
    password: string
  ): Promise<Observable<HttpResponse<any>>> {
    await this.appService.clearLoggedInUser();
    return this.http.post<any>(
      `${this.apiUrl}/login`,
      { email: email, password: password },
      { observe: 'response', withCredentials: true }
    );
  }
  async logout(): Promise<void> {
    this.http
      .post<any>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe(
        async (response) => {
          await this.appService.clearLoggedInUser();
        },
        (error) => {
          console.error('Logout error:', error);
        }
      );
  }
  isLoggedIn(): boolean {
    return this.cookiesService.check('session');
  }
}

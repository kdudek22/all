import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  getUser() {
    console.log(document.cookie);
    return this.http.get<User>(environment.userApiUrl+'users/current', {withCredentials : true});
  }

}

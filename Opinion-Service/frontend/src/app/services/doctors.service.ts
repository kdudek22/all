import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Doctor } from '../models/doctor';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {

  constructor(private http : HttpClient) { }

  getDoctors() : Observable<Doctor[]> {
    /*
    return of([
      {id : 1, firstname : 'John', surname : 'Doe', specialty : 'Cardiologist'} as Doctor,
      {id : 2, firstname : 'Jane', surname : 'Doe', specialty : 'Dermatologist'} as Doctor,
      {id : 3, firstname : 'Alice', surname : 'Smith', specialty : 'Pediatrician'} as Doctor,
      {id : 4, firstname : 'Bob', surname : 'Brown', specialty : 'Gynecologist'} as Doctor,
      {id : 5, firstname : 'Charlie', surname : 'White', specialty : 'Ophthalmologist'} as Doctor,
      {id : 6, firstname : 'David', surname : 'Black', specialty : 'Orthopedist'} as Doctor,
    ]);*/
    const headers = {'Authorization': 'Bearer ' + 'KEY'}
    return this.http.get<any>(environment.userApiUrl+'users', {withCredentials : true, params : {role : 'doctor'}, headers: headers}).pipe(
      map(userApi => userApi.users ?? [])
    );
  }

  getUsers() : Observable<User[]> {
    /*
    return of([
      {id : 1, firstname : 'John', surname : 'Doe', specialty : 'Cardiologist'} as Doctor,
      {id : 2, firstname : 'Jane', surname : 'Doe', specialty : 'Dermatologist'} as Doctor,
      {id : 3, firstname : 'Alice', surname : 'Smith', specialty : 'Pediatrician'} as Doctor,
      {id : 4, firstname : 'Bob', surname : 'Brown', specialty : 'Gynecologist'} as Doctor,
      {id : 5, firstname : 'Charlie', surname : 'White', specialty : 'Ophthalmologist'} as Doctor,
      {id : 6, firstname : 'David', surname : 'Black', specialty : 'Orthopedist'} as Doctor,
    ]);*/
    const headers = {'Authorization' : 'Bearer ' + 'KEY'}
    return this.http.get<any>(environment.userApiUrl+'users', {withCredentials : true, headers: headers})
    .pipe(
      map(userApi => userApi.users ?? [])
    )
  }
}

import { Injectable } from '@angular/core';
import { NewOpinion } from '../models/new-opinion';
import { Observable, of, switchMap } from 'rxjs';
import { Filters } from '../models/filters';
import { Opinion } from '../models/opinion';
import { Opinions, OpinionsApi } from '../models/opinions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Doctor } from '../models/doctor';

@Injectable({
  providedIn: 'root'
})
export class OpinionsService {

  constructor(private http : HttpClient) { }

  sendOpinion(opinion: NewOpinion) : Observable<any> {
    console.log(`Sending opinion: ${opinion}`);
    return this.http.post(environment.apiUrl+'/opinions/', opinion, {withCredentials : true});
  }

  editOpinion(id : number, opinion: NewOpinion) : Observable<any> {
    console.log(`Editing opinion with id ${id}: ${opinion}`);
    return this.http.put(environment.apiUrl+'/opinions/'+id, opinion, {withCredentials : true});
  }

  deleteOpinion(id : number) : Observable<any> {
    console.log(`Deleting opinion with id ${id}`);
    return this.http.delete(environment.apiUrl+'/opinions/'+id, {withCredentials : true});
  }

  getOpinions(filters : any) : Observable<OpinionsApi> { 

    if(!filters.minRating){
      filters.minRating = 1
    }
    if(!filters.page){
      filters.page = 1
    }
    if(!filters.doctorId){
      delete filters.doctorId
    }
    console.log(`Getting opinions with filters:`);
    /*
    return of(
      {opinions : [
      {id : 1, userId : 2, content : 'Very good doctor', rating : 3, doctorId : 1, doctorFirstname : 'Andrew', doctorSurname : 'Karpiel Bułecka', doctorSpecialty : 'Orthonda', username : 'SzymiYay'} as Opinion,
      {id : 2, userId : 3, content : 'Very good doctor', rating : 4, doctorId : 2, doctorFirstname : 'John', doctorSurname : 'Doe', doctorSpecialty : 'Cardiologist', username : 'Paweł Adrian'} as Opinion,
      {id : 3, userId : 4, content : 'Very good doctor', rating : 5, doctorId : 3, doctorFirstname : 'Jane', doctorSurname : 'Doe', doctorSpecialty : 'Dermatologist', username : 'Paweł Adrian'} as Opinion,
      {id : 4, userId : 5, content : 'Very good doctor', rating : 3, doctorId : 4, doctorFirstname : 'Alice', doctorSurname : 'Smith', doctorSpecialty : 'Pediatrician', username : 'Paweł Adrian'} as Opinion,
      {id : 5, userId : 6, content : 'Very good doctor', rating : 2, doctorId : 5, doctorFirstname : 'Bob', doctorSurname : 'Brown', doctorSpecialty : 'Gynecologist', username : 'Paweł Adrian'} as Opinion,
      {id : 6, userId : 7, content : 'Very good doctorVery good doctorVery good doctorVery good doctorVery good doctorVery good doctorVery good doctorVery good doctorVery good doctorVery good doctorVery good doctorVery good doctorVery good doctorVery good doctorVery good doctorVery good doctorVery good doctorVery good doctor', rating : 1, doctorId : 6, doctorFirstname : 'Charlie', doctorSurname : 'White', doctorSpecialty : 'Ophthalmologist', username : 'Paweł Adrian'} as Opinion,
      {id : 7, userId : 8, content : 'Very bad doctor', rating : 4, doctorId : 1, doctorFirstname : 'David', doctorSurname : 'Black', doctorSpecialty : 'Orthopedist', username : 'Paweł Adrian'} as Opinion,
      {id : 8, userId : 9, content : 'Very bad doctor', rating : 3, doctorId : 2, doctorFirstname : 'Andrew', doctorSurname : 'Karpiel Bułecka', doctorSpecialty : 'Orthonda', username : 'Paweł Adrian'} as Opinion,
      {id : 9, userId : 10, content : 'Very bad doctor', rating : 2, doctorId : 3, doctorFirstname : 'John', doctorSurname : 'Doe', doctorSpecialty : 'Cardiologist', username : 'Paweł Adrian'} as Opinion,
      {id : 10, userId : 11, content : 'Very bad doctor', rating : 1, doctorId : 4, doctorFirstname : 'Jane', doctorSurname : 'Doe', doctorSpecialty : 'Dermatologist', username : 'Paweł Adrian'} as Opinion,
      {id : 11, userId : 12, content : 'Very bad doctor', rating : 5, doctorId : 5, doctorFirstname : 'Alice', doctorSurname : 'Smith', doctorSpecialty : 'Pediatrician', username : 'Paweł Adrian'} as Opinion,
      {id : 12, userId : 13, content : 'Very bad doctor', rating : 4, doctorId : 6, doctorFirstname : 'Bob', doctorSurname : 'Brown', doctorSpecialty : 'Gynecologist', username : 'Paweł Adrian'} as Opinion,
      {id : 13, userId : 14, content : 'Very bad doctor', rating : 3, doctorId : 1, doctorFirstname : 'Charlie', doctorSurname : 'White', doctorSpecialty : 'Ophthalmologist', username : 'Paweł Adrian'} as Opinion,
      {id : 14, userId : 15, content : 'Very bad doctor', rating : 2, doctorId : 2, doctorFirstname : 'David', doctorSurname : 'Black', doctorSpecialty : 'Orthopedist', username : 'Paweł Adrian'} as Opinion,
      {id : 15, userId : 16, content : 'Very bad doctor', rating : 1, doctorId : 3, doctorFirstname : 'Andrew', doctorSurname : 'Karpiel Bułecka', doctorSpecialty : 'Orthonda', username : 'Paweł Adrian'} as Opinion,
    ],
    total_pages : 5} as Opinions)*/

    return this.http.get<OpinionsApi>(environment.apiUrl+'/opinions/', {params : filters as any, withCredentials : true})
  }
}

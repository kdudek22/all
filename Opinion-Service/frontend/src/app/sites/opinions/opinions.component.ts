import { Component, inject } from '@angular/core';
import { AddOpinionComponent } from '../../components/add-opinion/add-opinion.component';
import { DoctorsService } from '../../services/doctors.service';
import { Doctor } from '../../models/doctor';
import { FilterComponent } from '../../components/filter/filter.component';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap, throwError } from 'rxjs';
import { OpinionsService } from '../../services/opinions.service';
import { Opinion, OpinionApi } from '../../models/opinion';
import { OpinionComponent } from '../../components/opinion/opinion.component';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { User } from '../../models/user';
@Component({
  selector: 'app-opinions',
  standalone: true,
  imports: [AddOpinionComponent, FilterComponent, OpinionComponent, MatPaginatorModule],
  templateUrl: './opinions.component.html',
  styleUrl: './opinions.component.scss'
})
export class OpinionsComponent {
  constructor(private route : ActivatedRoute, private router : Router) { }
  doctorsService = inject(DoctorsService)
  opinionService = inject(OpinionsService)

  doctors : Doctor[] = []
  users: User[] = []
  opinionsApi : OpinionApi[] = []
  opinions : Opinion[] = []
  totalNumberOfPages = 1

  error : string = ''

  filters = {
    doctorId: null as null | string,
    minRating: null as null | number,
    page : 1,
    pageSize: 10
  }

  ngOnInit() {

    this.route.queryParams.pipe(
      switchMap(params => {
        this.filters = {
          doctorId: params['doctorId'] || null,
          minRating: params['minRating'] ? parseInt(params['minRating']) : null,
          page: params['page'] ? parseInt(params['page']) : 1,
          pageSize: params['pageSize'] ? parseInt(params['pageSize']) : 10
        };
        return this.opinionService.getOpinions(this.filters).pipe(
          catchError(() => {
            this.error = 'An error occurred while fetching opinions. Please try again later.';
            return of({opinions: [], total_pages: 1});
          }) 
        );
      }),
      switchMap(opinions => {
        this.opinionsApi = opinions.opinions as OpinionApi[];
        console.log(this.opinionsApi);
        console.log('TO SA OPINIE' + opinions);
    
        this.totalNumberOfPages = opinions.total_pages;
    
        return forkJoin({
          doctors: this.doctorsService.getDoctors().pipe(
            catchError(() => {
              this.error = 'An error occurred while fetching doctors. Please try again later.';
              return of([]);
            }) 
          ),
          users: this.doctorsService.getUsers().pipe(
            catchError(() => {
              this.error = 'An error occurred while fetching patients. Please try again later.';
              return of([]);
            }))
        });
      })
    ).subscribe(({ doctors, users }) => {
      this.doctors = doctors;
      console.log(doctors);
    
      this.users = users;
      this.mapOpinions(this.opinionsApi, this.doctors, this.users);
    });
  }

 

  handlePageEvent(pe : PageEvent) {
    this.filters.page = pe.pageIndex + 1
    this.filters.pageSize = pe.pageSize
    this.router.navigate(['/opinions'], {queryParams: this.filters});
  }

  handleOpinionAdded() {
    
    location.reload()
  }

  mapOpinions(opinionsApi : OpinionApi[], doctors : Doctor[], users : User[]) {

    console.log(opinionsApi);
    console.log(doctors);
    console.log(users);
    let new_opinions : Opinion[] = []
    opinionsApi.forEach(opinionApi => {
      let opinion = {...opinionApi} as Opinion

      let doctor = doctors.find(doctor => doctor?.id === opinion.doctorId)
      let user =  users.find(user => user?.id === opinion.userId)

      opinion.doctorName = doctor ? doctor.name : ''
      opinion.username = user ? user.name : ''

      new_opinions.push(opinion)
    });

    this.opinions = new_opinions
  }
}

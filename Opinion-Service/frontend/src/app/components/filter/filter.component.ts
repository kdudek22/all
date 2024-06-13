import { Component, Inject, Input, Output } from '@angular/core';
import { Doctor } from '../../models/doctor';
import { MatSelectModule } from '@angular/material/select';
import { doctorToString } from '../../helpers/utils';
import { Filters } from '../../models/filters';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [MatSelectModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  constructor(private router : Router) { }

  @Input() doctors : Doctor [] = [];

  doctorToString = doctorToString;
  ratings = [1, 2, 3, 4, 5];
  @Input() filters : Filters = {
    doctorId: null as null | string,
    minRating: null as null | string,
    page : 1 
  } as Filters

  ngOnInit() {
   
  }

  onFilterChange(setPageTo1 : boolean = false) {
    if(setPageTo1) {
      this.filters.page = 1;
    }
    this.router.navigate(['/opinions'], {queryParams: this.filters});
  }

}

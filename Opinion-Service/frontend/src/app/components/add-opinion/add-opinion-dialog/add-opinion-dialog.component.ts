import { Component, Inject, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogActions, MatDialogModule, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxStarsModule } from 'ngx-stars';
import { Doctor } from '../../../models/doctor';
import { OpinionsService } from '../../../services/opinions.service';
import { NewOpinion } from '../../../models/new-opinion';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { doctorToString } from '../../../helpers/utils';


@Component({
  selector: 'app-add-opinion-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, 
  MatFormFieldModule, MatButtonModule, MatInputModule, MatDialogModule, MatDialogActions, MatDialogContent, MatIconModule, MatSelectModule, NgxStarsModule],
  templateUrl: './add-opinion-dialog.component.html',
  styleUrl: './add-opinion-dialog.component.scss'
})
export class AddOpinionDialogComponent implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA) public data: Doctor[],
  public dialogRef: MatDialogRef<AddOpinionDialogComponent>) {
    this.doctors = data
   }

  doctorToString = doctorToString;

  ngOnInit(): void {
      this.userService.getUser().subscribe(
        (user : User) => {
          this.user = user
        }
      )
  }

  opinionsService = inject(OpinionsService)
  userService = inject(UserService)
  user? : User

  form = new FormGroup({
    content: new FormControl('', Validators.required),
    doctorId: new FormControl<null | string>(null, Validators.required),
    rating: new FormControl<null | number>(null, Validators.required)
  });

  rating = 0
  doctors : Doctor[] = []
  error : string = ''

  onSubmit() {
    if(!this.user){
      return
    }

    let newOpinion = {...this.form.value, userId : this.user.id} as NewOpinion
  
    this.opinionsService.sendOpinion(newOpinion).subscribe({
      next: (v) => {
    
        this.closeDialog()
      },
      error: (e) => {console.error(e)
        this.error = 'Error sending opinion'
      },
    })
  }

  closeDialog() {
    this.form.reset()
    this.error = ''
    this.dialogRef.close(true);
  }

 
  changeRating(rating : number) {
    this.form.patchValue({ rating });
  }
}

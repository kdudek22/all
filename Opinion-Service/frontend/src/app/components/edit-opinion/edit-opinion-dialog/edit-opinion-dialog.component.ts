import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogActions, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxStarsModule } from 'ngx-stars';
import { doctorToString } from '../../../helpers/utils';
import { Doctor } from '../../../models/doctor';
import { User } from '../../../models/user';
import { OpinionsService } from '../../../services/opinions.service';
import { UserService } from '../../../services/user.service';
import { Opinion } from '../../../models/opinion';
import { NewOpinion } from '../../../models/new-opinion';

@Component({
  selector: 'app-edit-opinion-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, 
    MatFormFieldModule, MatButtonModule, MatInputModule, MatDialogModule, MatDialogActions, MatDialogContent, MatIconModule, MatSelectModule, NgxStarsModule],
  templateUrl: './edit-opinion-dialog.component.html',
  styleUrl: './edit-opinion-dialog.component.scss'
})
export class EditOpinionDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: {doctors: Doctor[], opinion: Opinion},
    public dialogRef: MatDialogRef<EditOpinionDialogComponent>) {
        this.doctors = data.doctors
        this.oldOpinion = data.opinion
    }
    
    doctorToString = doctorToString;

    ngOnInit(): void {
        this.userService.getUser().subscribe(
            (user : User) => {
                this.user = user
            }
        )

        this.form.setValue({
            content: this.oldOpinion.content,
            doctorId: this.oldOpinion.doctorId,
            rating: this.oldOpinion.rating
        })
    }

    oldOpinion : Opinion
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

    
      const keys = Object.keys(newOpinion) as (keyof NewOpinion)[];
      const isUnchanged = keys.every(key => newOpinion[key] === this.oldOpinion[key])
      if (isUnchanged) {
        this.error = 'No changes detected'
        return
      }
    
      this.opinionsService.editOpinion(this.oldOpinion.id, newOpinion).subscribe({
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

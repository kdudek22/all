import { Component, inject, Input, OnInit } from '@angular/core';
import { Opinion } from '../../models/opinion';
import { CommonModule } from '@angular/common';
import { NgxStarsModule } from 'ngx-stars';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { MatButtonModule  } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { EditOpinionComponent } from '../edit-opinion/edit-opinion.component';
import { Doctor } from '../../models/doctor';
import { OpinionsService } from '../../services/opinions.service';

@Component({
  selector: 'app-opinion',
  standalone: true,
  imports: [CommonModule, NgxStarsModule, MatIconModule, MatButtonModule, MatMenuModule, EditOpinionComponent],
  templateUrl: './opinion.component.html',
  styleUrl: './opinion.component.scss'
})
export class OpinionComponent implements OnInit{
  userService = inject(UserService)
  opinionService = inject(OpinionsService)
  @Input() opinion? : Opinion
  @Input() doctors? : Doctor[]
  
  user? : User
  ngOnInit(): void {
    this.userService.getUser().subscribe(
      (user : User) => {
        this.user = user
      }
    )
  }

  deleteOpinion(id: number) {
    this.opinionService.deleteOpinion(id).subscribe({
      next: (response) => {
        console.log('Opinion deleted successfully', response);
        this.reloadPage();
      },
      error: (error) => {
        console.error('Error deleting opinion', error);
      }
    });
  }

  reloadPage(){
    window.location.reload();
  }
}


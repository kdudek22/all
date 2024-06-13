import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { AddOpinionDialogComponent } from './add-opinion-dialog/add-opinion-dialog.component';
import { Doctor } from '../../models/doctor';

@Component({
  selector: 'app-add-opinion',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './add-opinion.component.html',
  styleUrl: './add-opinion.component.scss'
})
export class AddOpinionComponent {
  constructor(public dialog: MatDialog) {}
  @Input() doctors: Doctor[] = [];
  @Output() opinionAdded = new EventEmitter<void>();

  ngOnInit() {
  
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddOpinionDialogComponent, {
      data: this.doctors
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.opinionAdded.emit();
    });
  }
}

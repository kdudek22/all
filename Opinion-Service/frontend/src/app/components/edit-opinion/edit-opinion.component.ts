import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Opinion } from '../../models/opinion';
import { CommonModule } from '@angular/common';
import { Doctor } from '../../models/doctor';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditOpinionDialogComponent } from './edit-opinion-dialog/edit-opinion-dialog.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-edit-opinion',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule, EditOpinionDialogComponent, MatDialogModule, MatMenuModule],
  templateUrl: './edit-opinion.component.html',
  styleUrl: './edit-opinion.component.scss'
})
export class EditOpinionComponent {
  @Input() opinion? : Opinion
  @Input() doctors?: Doctor[] = [];
  @Output() opinionEdit = new EventEmitter<void>();

  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(EditOpinionDialogComponent, {
      data: {
        doctors : this.doctors,
        opinion : this.opinion}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.opinionEdit.emit();
    });
  }
}

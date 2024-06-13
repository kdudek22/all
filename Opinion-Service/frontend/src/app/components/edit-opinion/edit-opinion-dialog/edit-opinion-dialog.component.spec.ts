import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOpinionDialogComponent } from './edit-opinion-dialog.component';

describe('EditOpinionDialogComponent', () => {
  let component: EditOpinionDialogComponent;
  let fixture: ComponentFixture<EditOpinionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOpinionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditOpinionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

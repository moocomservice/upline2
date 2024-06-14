import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSuccessDialogComponent } from './login-success-dialog.component';

describe('LoginSuccessDialogComponent', () => {
  let component: LoginSuccessDialogComponent;
  let fixture: ComponentFixture<LoginSuccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginSuccessDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

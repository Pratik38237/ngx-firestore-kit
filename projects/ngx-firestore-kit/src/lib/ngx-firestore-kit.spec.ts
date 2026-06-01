import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFirestoreKit } from './ngx-firestore-kit';

describe('NgxFirestoreKit', () => {
  let component: NgxFirestoreKit;
  let fixture: ComponentFixture<NgxFirestoreKit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxFirestoreKit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxFirestoreKit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

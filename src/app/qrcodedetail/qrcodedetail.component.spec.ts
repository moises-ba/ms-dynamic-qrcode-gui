import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodedetailComponent } from './qrcodedetail.component';

describe('QrcodedetailComponent', () => {
  let component: QrcodedetailComponent;
  let fixture: ComponentFixture<QrcodedetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodedetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

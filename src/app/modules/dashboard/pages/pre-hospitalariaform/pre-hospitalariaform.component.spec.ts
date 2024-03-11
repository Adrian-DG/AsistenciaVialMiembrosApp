import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreHospitalariaformComponent } from './pre-hospitalariaform.component';

describe('PreHospitalariaformComponent', () => {
  let component: PreHospitalariaformComponent;
  let fixture: ComponentFixture<PreHospitalariaformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreHospitalariaformComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreHospitalariaformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

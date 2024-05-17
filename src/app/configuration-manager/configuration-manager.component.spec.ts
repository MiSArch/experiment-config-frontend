import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationManagerComponent } from './configuration-manager.component';

describe('ConfigurationManagerComponent', () => {
  let component: ConfigurationManagerComponent;
  let fixture: ComponentFixture<ConfigurationManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigurationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

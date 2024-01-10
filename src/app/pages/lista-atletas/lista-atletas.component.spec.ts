import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAtletasComponent } from './lista-atletas.component';

describe('ListaAtletasComponent', () => {
  let component: ListaAtletasComponent;
  let fixture: ComponentFixture<ListaAtletasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaAtletasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAtletasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilProfesorPage } from './perfil-profesor.page';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('PerfilProfesorPage', () => {
  let component: PerfilProfesorPage;
  let fixture: ComponentFixture<PerfilProfesorPage>;
  let toastController: ToastController;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    // Mock para ActivatedRoute
    activatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => '12345678-9' // Simulando que el rut es 12345678-9
        }
      }
    } as ActivatedRoute;

    TestBed.configureTestingModule({
      declarations: [PerfilProfesorPage],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        ToastController
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilProfesorPage);
    component = fixture.componentInstance;
    toastController = TestBed.inject(ToastController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load professor data from localStorage', () => {
    const profesor = { nombre: 'Juan', apellido: 'Pérez' };
    localStorage.setItem('profesor', JSON.stringify(profesor));

    component.ngOnInit();  // Llamamos a ngOnInit() para cargar los datos

    expect(component.nombre).toBe('Juan');
    expect(component.apellido).toBe('Pérez');
  });

  it('should show error if professor not found', () => {
    localStorage.removeItem('12345678-9'); // Limpiar datos antes de la prueba

    component.ngOnInit();  // Llamamos a ngOnInit() para intentar cargar datos

    expect(component.nombre).toBe('');
    expect(component.apellido).toBe('');
  });
});

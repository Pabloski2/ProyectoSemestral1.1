import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-perfil-profesor',
  templateUrl: './perfil-profesor.page.html',
  styleUrls: ['./perfil-profesor.page.scss'],
})
export class PerfilProfesorPage implements OnInit {
  rut: string = ''; // RUT del profesor obtenido de los parámetros
  nombre: string = ''; // Nombre del profesor
  apellido: string = ''; // Apellido del profesor

  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Obtenemos el parámetro 'rut' de la URL
    const rutParam = this.route.snapshot.paramMap.get('rut');
    if (rutParam) {
      this.rut = rutParam;
      this.cargarDatosProfesor();
    } else {
      this.mostrarError('No se recibió el RUT del profesor');
    }
  }

  /**
   * Cargar los datos del profesor desde localStorage.
   */
  cargarDatosProfesor() {
    const profesorString = localStorage.getItem(this.rut); // Obtiene el dato del almacenamiento local
    if (profesorString) {
      try {
        const profesor = JSON.parse(profesorString);
        this.nombre = profesor.nombre;
        this.apellido = profesor.apellido;
      } catch (error) {
        console.error('Error al parsear los datos del profesor:', error);
        this.mostrarError('Error al cargar los datos del profesor');
      }
    } else {
      this.mostrarError('Profesor no encontrado');
    }
  }

  /**
   * Mostrar un mensaje de error con un Toast.
   * @param mensaje El mensaje de error a mostrar.
   */
  async mostrarError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}

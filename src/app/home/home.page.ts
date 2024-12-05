import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  rut: string = ''; // RUT del usuario
  password: string = ''; // Contraseña del usuario
  userType: string = 'profesor'; // Tipo de usuario (por defecto profesor)
  intentosFallidos: number = 0; // Contador de intentos fallidos

  constructor(
    private navCtrl: NavController, 
    private toastController: ToastController,
    private storage: Storage,
    private alertController: AlertController
  ) {
    this.initStorage();
  }

  // Inicialización de almacenamiento
  async initStorage() {
    if (!this.storage) {
      console.error('Storage is not initialized');
      return;
    }
    await this.storage.create();
  }

  // Redirigir a la página de registro
  async goToRegistro() {
    await this.storage.set('canAccessRegistro', true);
    this.navCtrl.navigateForward('/registro');
  }

  // Método para manejar el "Olvidaste tu contraseña"
  async forgotPassword() {
    this.mostrarError('Redirigiendo a recuperación de contraseña...');
  }

  // Método para iniciar sesión
  async iniciarSesion(): Promise<void> {
    try {
      if (this.rut.trim() && this.password.trim()) {
        const usuarioString = await this.storage.get(this.rut);
        if (usuarioString) {
          const usuario = JSON.parse(usuarioString);
          if (usuario.password === this.password) {
            this.mostrarBienvenida(usuario.nombre);

            // Redirigir según el tipo de usuario
            if (this.userType === 'profesor') {
              await this.storage.set('userType', 'profesor');
              this.navCtrl.navigateForward(['/perfil-profesor']); // Redirigir a la página del profesor
            } else {
              await this.storage.set('userType', 'usuario');
              this.navCtrl.navigateForward('/principal'); // Redirigir a la página principal del usuario
            }

            // Resetear intentos fallidos
            this.intentosFallidos = 0;
          } else {
            this.mostrarError('Contraseña incorrecta');
          }
        } else {
          this.mostrarError('Usuario no encontrado');
          this.manejarIntentoFallido();
        }
      } else {
        this.mostrarError('Por favor, ingresa tu RUT y contraseña');
      }
    } catch (error) {
      console.error('Error en iniciarSesion:', error);
      this.mostrarError('Ocurrió un error. Por favor, intenta de nuevo.');
    }
  }

  // Método para iniciar sesión directamente como profesor
  async iniciarSesionComoProfesor(): Promise<void> {
    try {
      // Asumimos que ya hay un tipo de usuario profesor, sin necesidad de verificar RUT y contraseña
      await this.storage.set('userType', 'profesor');
      this.navCtrl.navigateForward('/perfil-profesor'); // Redirigir directamente al perfil del profesor
    } catch (error) {
      console.error('Error en iniciarSesionComoProfesor:', error);
      this.mostrarError('Ocurrió un error. Por favor, intenta de nuevo.');
    }
  }

  // Lógica para manejar intentos fallidos
  manejarIntentoFallido() {
    this.intentosFallidos++;
    if (this.intentosFallidos >= 3) {
      this.mostrarError('Has alcanzado el límite de intentos fallidos.');
      this.navCtrl.navigateForward('/error404'); // Redirigir a página de error si hay 3 intentos fallidos
    }
  }

  // Función para mostrar un mensaje de error
  async mostrarError(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  // Función para mostrar un mensaje de bienvenida
  async mostrarBienvenida(nombre: string) {
    const toast = await this.toastController.create({
      message: `Bienvenido ${nombre}`,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}

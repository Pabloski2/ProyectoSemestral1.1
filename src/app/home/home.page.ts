import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string = ''; // Aquí se almacena el nombre de usuario ingresado

  constructor(private navCtrl: NavController, private toastController: ToastController) {}

  goToRegistro() {
    this.navCtrl.navigateForward('/registro');
  }

  iniciarSesion() {
    if (this.username.trim()) { // Verifica que el username no esté vacío o solo con espacios
      console.log('Iniciar sesión');
      this.mostrarBienvenida();
      this.navCtrl.navigateForward(['/principal', { username: this.username }]); // Pasa el nombre de usuario a PrincipalPage
    } else {
      console.error('Por favor, ingresa tu nombre de usuario.');
      this.mostrarError(); // Muestra un error si no se ingresó el nombre de usuario
    }
  }

  forgotPassword() {
    console.log('Olvidaste tu contraseña');
    this.navCtrl.navigateForward('/cambiar-contrasena');
  }

  async mostrarBienvenida() {
    const toast = await this.toastController.create({
      message: `¡Bienvenido, ${this.username}!`, // Muestra el nombre de usuario en el toast
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  async mostrarError() {
    const toast = await this.toastController.create({
      message: 'Por favor, ingresa tu nombre de usuario.', // Notificación de error
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}

import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage {
  nuevaContrasena: string | undefined;
  confirmarContrasena: string | undefined;

  constructor(private navCtrl: NavController, private toastController: ToastController) {}

  // Función para validar la contraseña (puedes ajustar las reglas)
  validarContrasena(contrasena: string): boolean {
    return contrasena.length >= 8; // Ejemplo: contraseña válida si tiene al menos 8 caracteres
  }

  async cambiarContrasena() {
    if (!this.nuevaContrasena || !this.confirmarContrasena) {
      const toast = await this.toastController.create({
        message: 'Por favor, complete ambos campos',
        duration: 2000,
        position: 'top',
      });
      toast.present();
    } else if (!this.validarContrasena(this.nuevaContrasena)) {
      const toast = await this.toastController.create({
        message: 'La contraseña debe tener al menos 8 caracteres',
        duration: 2000,
        position: 'top',
      });
      toast.present();
    } else if (this.nuevaContrasena !== this.confirmarContrasena) {
      const toast = await this.toastController.create({
        message: 'Las contraseñas no coinciden',
        duration: 2000,
        position: 'top',
      });
      toast.present();
    } else {
      console.log('Contraseña cambiada exitosamente');
      // Aquí puedes agregar la lógica para cambiar la contraseña en tu backend
      this.navCtrl.navigateBack('/home');
    }
  }
}

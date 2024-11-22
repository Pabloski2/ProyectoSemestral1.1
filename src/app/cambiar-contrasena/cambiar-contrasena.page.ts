import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage implements OnInit {
  rut: string = '';
  nombre: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private storage: Storage
  ) {
    this.initStorage();
  }

  async ngOnInit() {
    await this.storage.remove('canAccessCambiarContrasena');
  }

  async initStorage() {
    await this.storage.create();
  }

  validarContrasena(contrasena: string): boolean {
    return contrasena.length >= 8;
  }

  async cambiarContrasena() {
    if (!this.rut || !this.nombre || !this.nuevaContrasena || !this.confirmarContrasena) {
      this.mostrarMensaje('Por favor, complete todos los campos');
      return;
    }

    if (!this.validarContrasena(this.nuevaContrasena)) {
      this.mostrarMensaje('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.mostrarMensaje('Las contraseñas no coinciden');
      return;
    }

    try {
      const usuarioString = await this.storage.get(this.rut);
      if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        if (usuario.nombre === this.nombre) {
          usuario.password = this.nuevaContrasena;
          await this.storage.set(this.rut, JSON.stringify(usuario));
          
          // Verificar que la contraseña se haya cambiado
          const usuarioActualizado = await this.storage.get(this.rut);
          const usuarioParseado = JSON.parse(usuarioActualizado);
          if (usuarioParseado.password === this.nuevaContrasena) {
            this.mostrarMensaje('Contraseña cambiada exitosamente');
            this.navCtrl.navigateBack('/home');
          } else {
            this.mostrarMensaje('Error al cambiar la contraseña. Por favor, intente de nuevo.');
          }
        } else {
          this.mostrarMensaje('El nombre no coincide con el RUT proporcionado');
        }
      } else {
        this.mostrarMensaje('RUT no encontrado');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      this.mostrarMensaje('Ocurrió un error al cambiar la contraseña. Por favor, intente de nuevo.');
    }
  }

  async mostrarMensaje(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}

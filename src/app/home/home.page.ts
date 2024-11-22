import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  rut: string = ''; // Cambiamos username por rut
  password: string = '';
  intentosFallidos: number = 0;

  constructor(
    private navCtrl: NavController, 
    private toastController: ToastController,
    private storage: Storage,
    private alertController: AlertController
  ) {
    this.initStorage();
  }

  async initStorage() {
    if (!this.storage) {
      console.error('Storage is not initialized');
      return;
    }
    await this.storage.create();
  }

  async goToRegistro() {
    await this.storage.set('canAccessRegistro', true);
    this.navCtrl.navigateForward('/registro');
  }

  async iniciarSesion() {
    try {
      if (this.rut.trim() && this.password.trim()) {
        const usuarioString = await this.storage.get(this.rut);
        if (usuarioString) {
          const usuario = JSON.parse(usuarioString);
          if (usuario.password === this.password) {
            this.mostrarBienvenida(usuario.nombre);
            this.navCtrl.navigateForward(['/principal', { username: usuario.nombre }]);
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

  manejarIntentoFallido() {
    this.intentosFallidos++;
    if (this.intentosFallidos > 3) {
      this.navCtrl.navigateForward('/error404');
    }
  }

  async forgotPassword() {
    await this.storage.set('canAccessCambiarContrasena', true);
    this.navCtrl.navigateForward('/cambiar-contrasena');
  }

  async mostrarBienvenida(nombre: string) {
    const toast = await this.toastController.create({
      message: `¡Bienvenido, ${nombre}!`,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  async mostrarError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  async cerrarSesion() {
    const usuarioActual = await this.storage.get('usuarioActual');
    if (!usuarioActual) {
      this.mostrarError('No hay una sesión activa');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Ingresa tu contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: (data) => {
            this.confirmarCierreSesion(usuarioActual, data.password);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarCierreSesion(rut: string, passwordIngresada: string) {
    const usuarioString = await this.storage.get(rut);
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      if (usuario.password === passwordIngresada) {
        await this.storage.remove('usuarioActual');
        this.mostrarMensaje('Sesión cerrada exitosamente');
        this.navCtrl.navigateRoot('/home');
      } else {
        this.mostrarError('Contraseña incorrecta');
      }
    } else {
      this.mostrarError('No se encontró la cuenta');
    }
  }

  async borrarCuenta() {
    const cuentas = await this.obtenerCuentas();
    if (cuentas.length === 0) {
      this.mostrarError('No hay cuentas registradas');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Seleccionar cuenta para borrar',
      inputs: cuentas.map(cuenta => ({
        type: 'radio',
        label: cuenta,
        value: cuenta
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: (cuentaSeleccionada) => {
            if (cuentaSeleccionada) {
              this.confirmarBorradoCuenta(cuentaSeleccionada);
            } else {
              this.mostrarError('Por favor, selecciona una cuenta');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarBorradoCuenta(rut: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar borrado de cuenta',
      message: `¿Estás seguro de que quieres borrar la cuenta con RUT ${rut}?`,
      inputs: [
        {
          name: 'rut',
          type: 'text',
          placeholder: 'Ingresa tu RUT'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Ingresa tu contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: (data) => {
            this.verificarYBorrarCuenta(rut, data.rut, data.password);
          }
        }
      ]
    });

    await alert.present();
  }

  async verificarYBorrarCuenta(rutOriginal: string, rutIngresado: string, passwordIngresada: string) {
    if (rutOriginal !== rutIngresado) {
      this.mostrarError('El RUT ingresado no coincide con la cuenta seleccionada');
      return;
    }

    const usuarioString = await this.storage.get(rutOriginal);
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      if (usuario.password === passwordIngresada) {
        await this.storage.remove(rutOriginal);
        this.mostrarMensaje('Cuenta borrada exitosamente');
      } else {
        this.mostrarError('Contraseña incorrecta');
      }
    } else {
      this.mostrarError('No se encontró la cuenta');
    }
  }

  async obtenerCuentas(): Promise<string[]> {
    const cuentas: string[] = [];
    await this.storage.forEach((value, key) => {
      if (key !== 'canAccessRegistro' && key !== 'canAccessCambiarContrasena') {
        cuentas.push(key);
      }
    });
    return cuentas;
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}

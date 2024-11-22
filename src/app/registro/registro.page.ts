import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  rut: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private toastController: ToastController
  ) {
    this.initStorage();
  }

  async ngOnInit() {
    await this.storage.remove('canAccessRegistro');
  }

  async initStorage() {
    await this.storage.create();
  }

  async registrar() {
    console.log('Valores actuales:', { nombre: this.nombre, apellido: this.apellido, rut: this.rut, password: this.password });
    
    if (this.nombre && this.apellido && this.rut && this.password) {
      const usuario = { 
        nombre: this.nombre, 
        apellido: this.apellido, 
        rut: this.rut, 
        password: this.password 
      };
      await this.storage.set(this.rut, JSON.stringify(usuario));
      this.mostrarMensaje('Registro exitoso. Ahora puedes iniciar sesión.');
      this.navCtrl.navigateForward('/home');
    } else {
      this.mostrarMensaje('Por favor, completa todos los campos.');
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

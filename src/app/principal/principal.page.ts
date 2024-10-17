import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  username: string = 'Usuario'; // Valor por defecto

  constructor(private toastController: ToastController, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['username']) {
        this.username = params['username']; // Asigna el nombre de usuario recibido
      }
      this.mostrarBienvenida(); 
    });
  }

  async mostrarBienvenida() {
    console.log(this.username); // Verifica el valor
    const toast = await this.toastController.create({
      message: `¡Bienvenido, ${this.username}!`,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}

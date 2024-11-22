import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.page.html',
  styleUrls: ['./error404.page.scss'],
})
export class Error404Page implements OnInit {

  constructor(
    private navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('Página 404 inicializada');
    console.log('URL actual:', this.router.url);
  }

  irAPaginaPrincipal() {
    this.navCtrl.navigateRoot('/home');
  }
}

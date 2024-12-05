import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private storage: Storage, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
  
    const isLoggedIn = await this.storage.get('isLoggedIn');
    const userType = await this.storage.get('userType');
  
    // Si no está logueado, redirigir a home
    if (!isLoggedIn) {
      return this.router.parseUrl('/home');
    }
  
    // Verificar las rutas y redirigir si el tipo de usuario es incorrecto
    if (route.routeConfig?.path === 'principal' && userType !== 'usuario') {
      return this.router.parseUrl('/error404'); // O redirigir a donde desees
    }
  
    if (route.routeConfig?.path === 'perfil-profesor' && userType !== 'profesor') {
      return this.router.parseUrl('/error404'); // O redirigir a donde desees
    }
  
    return true;
  }
}  
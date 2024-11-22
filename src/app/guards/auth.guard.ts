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
    
    if (route.routeConfig?.path === 'principal') {
      // Si intenta acceder a home y está logueado, redirigir a principal
      if (isLoggedIn) {
        return this.router.parseUrl('/principal');
      }
      return true;
    } else {
      // Para otras rutas protegidas (como principal)
      if (isLoggedIn) {
        return true;
      }
      return this.router.parseUrl('/principal');
    }
  }
}

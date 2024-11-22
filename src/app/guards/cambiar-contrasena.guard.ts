import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class CambiarContrasenaGuard implements CanActivate {
  constructor(private storage: Storage, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    
    const canAccessCambiarContrasena = await this.storage.get('canAccessCambiarContrasena');
    
    if (canAccessCambiarContrasena) {
      return true;
    } else {
      return this.router.parseUrl('/home');
    }
  }
}

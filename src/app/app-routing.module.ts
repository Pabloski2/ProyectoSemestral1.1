import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CambiarContrasenaGuard } from './guards/cambiar-contrasena.guard';
import { RegistroGuard } from './guards/registro.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule),
    canActivate: [RegistroGuard]
  },
  {
    path: 'principal',
    loadChildren: () => import('./principal/principal.module').then(m => m.PrincipalPageModule),
    
  },
  {
    path: 'cambiar-contrasena',
    loadChildren: () => import('./cambiar-contrasena/cambiar-contrasena.module').then(m => m.CambiarContrasenaPageModule),
    canActivate: [CambiarContrasenaGuard]
  },
  {
    path: 'perfil-profesor',
    loadChildren: () => import('./perfil-profesor/perfil-profesor.module').then(m => m.PerfilProfesorPageModule),
    
  },
  {
    path: 'asignaturas',
    loadChildren: () => import('./asignaturas/asignaturas.module').then(m => m.AsignaturasPageModule)
  },
  {
    path: 'qr',
    loadChildren: () => import('./qr/qr.module').then(m => m.QrPageModule)
  },
  {
    path: 'error404',
    loadChildren: () => import('./error404/error404.module').then(m => m.Error404PageModule)
  },
  {
    path: '**',
    redirectTo: 'error404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

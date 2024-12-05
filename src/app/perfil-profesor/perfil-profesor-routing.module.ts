import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilProfesorPage } from './perfil-profesor.page';

const routes: Routes = [
  {
    path: '',  // Aquí esperamos que el rut esté en la URL como parámetro
    component: PerfilProfesorPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilProfesorPageRoutingModule {}

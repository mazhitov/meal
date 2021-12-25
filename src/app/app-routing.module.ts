import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealsComponent } from './meals/meals.component';
import { EditAddComponent } from './meals/edit-add/edit-add.component';
import { MealResolverService } from './shared/meal-resolver.service';
import { NotFoundComponent } from './not-found.component';

const routes: Routes = [
  {path: '', component: MealsComponent},
  {path: 'meals/add', component: EditAddComponent},
  {
    path: 'meals/:id/edit',
    component: EditAddComponent,
    resolve: {
      meal: MealResolverService
    }
  },
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

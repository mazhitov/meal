import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MealsComponent } from './meals/meals.component';
import { MealComponent } from './meals/meal/meal.component';
import { HttpClientModule } from '@angular/common/http';
import { EditAddComponent } from './meals/edit-add/edit-add.component';
import { FormsModule } from '@angular/forms';
import { NotFoundComponent } from './not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    MealsComponent,
    MealComponent,
    EditAddComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { MealService } from './meal.service';
import { Meal } from './meal.model';

@Injectable({
  providedIn: 'root'
})
export class MealResolverService implements Resolve<Meal> {

  constructor(private mealService: MealService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Meal> | Observable<never> {
    const mealId = <string>route.params['id'];

    return this.mealService.fetchMeal(mealId).pipe(mergeMap(meal => {
      if (meal) {
        return of(meal);
      }
      return EMPTY;
    }));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meal } from './meal.model';
import { map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  mealsChange = new Subject<Meal[]>();
  mealsFetching = new Subject<boolean>();
  mealsUploading = new Subject<boolean>();
  mealsRemoving = new Subject<boolean>();

  mealTimeOptions = ['Breakfast', 'Snack', 'Lunch', 'Dinner'];
  totalCalories = 0;
  private meals: Meal[] = [];

  constructor(private http: HttpClient) {
  }

  getMeals() {
    return this.meals.slice();
  }

  fetchMeals() {
    this.mealsFetching.next(true);
    this.http.get<{ [id: string]: Meal }>('https://project-server-788da-default-rtdb.firebaseio.com/meals.json')
      .pipe(map(result => {
        if (result === null) {
          return [];
        }
        return Object.keys(result).map(id => {
          const meal = result[id];
          return new Meal(id, meal.mealTime, meal.description, meal.kcal);
        });
      }))
      .subscribe(meals => {
        this.meals = meals;
        this.mealsChange.next(this.meals.slice());
        this.mealsFetching.next(false);
        this.getCalories();
      }, () => {
        this.mealsFetching.next(false);
      });
  }

  removeMeal(id: string) {
    this.mealsRemoving.next(true);

    this.http.delete(`https://project-server-788da-default-rtdb.firebaseio.com/${id}.json`)
      .pipe(tap(() => {
          this.mealsRemoving.next(false);
        }, () => {
          this.mealsRemoving.next(false);
        })
      )
      .subscribe(() => {
        this.mealsChange.next(this.meals.slice());
      });
  }

  getCalories() {
    let total = 0;
    this.meals.forEach((meal) => {
      total+=meal.kcal;
    });
    return total;
  }
}

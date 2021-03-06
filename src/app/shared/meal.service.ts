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
          return new Meal(id, meal.mealTime, meal.description, meal.kcal, meal.date);
        });
      }))
      .subscribe(meals => {
        this.meals = this.sortByDate(meals);
        this.mealsChange.next(this.meals.slice());
        this.mealsFetching.next(false);
        this.getCalories();
      }, () => {
        this.mealsFetching.next(false);
      });
  }

  fetchMeal(id: string) {
    return this.http.get<Meal | null>(`https://project-server-788da-default-rtdb.firebaseio.com/meals/${id}.json`).pipe(
      map(result => {
        if (!result) {
          return null;
        }
        return new Meal(id, result.mealTime, result.description, result.kcal, result.date);
      }),
    );
  }

  addMeal(meal: Meal) {
    const body = {
      mealTime: meal.mealTime,
      description: meal.description,
      kcal: meal.kcal,
      date: meal.date
    };

    this.mealsUploading.next(true);

    return this.http.post('https://project-server-788da-default-rtdb.firebaseio.com/meals.json', body).pipe(
      tap(() => {
        this.mealsUploading.next(false);
      }, () => {
        this.mealsUploading.next(false);
      })
    );
  }

  editMeal(meal: Meal) {
    this.mealsUploading.next(true);

    const body = {
      mealTime: meal.mealTime,
      description: meal.description,
      kcal: meal.kcal,
      date: meal.date,
    };

    return this.http.put(`https://project-server-788da-default-rtdb.firebaseio.com/meals/${meal.id}.json`, body).pipe(
      tap(() => {
        this.mealsUploading.next(false);
      }, () => {
        this.mealsUploading.next(false);
      })
    );
  }

  removeMeal(id: string) {
    this.mealsRemoving.next(true);
    return this.http.delete(`https://project-server-788da-default-rtdb.firebaseio.com/meals/${id}.json`)
      .pipe(tap(() => {
          this.mealsRemoving.next(false);
        }, () => {
          this.mealsRemoving.next(false);
        })
      )
  }

  getCalories() {
    let total = 0;
    const today = this.getDate();
    this.meals.forEach(meal => {
      if (meal.date === today) {
        total += meal.kcal;
      }
    });
    return total;
  }

  getDate() {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let newMonth = month.toString();
    if (month < 10) newMonth = '0' + month.toString();
    let newDay = day.toString();
    if (day < 10) newDay = '0' + day;
    return year + '-' + newMonth + '-' + newDay;
  }

  sortByDate(meals: Meal[]) {
    return meals.sort(function (a, b): any {
      return Date.parse(b.date) - Date.parse(a.date);
    });
  }
}

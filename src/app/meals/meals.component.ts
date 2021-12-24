import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meal } from '../shared/meal.model';
import { MealService } from '../shared/meal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit, OnDestroy {
  meals: Meal[] = [];
  mealsChangeSubscription!:Subscription;
  mealsIsFetchingSubscription!:Subscription;
  isFetching = false;
  totalKcalories = 0;

  constructor(private mealService: MealService) {}

  ngOnInit(): void {
    this.meals = this.mealService.getMeals();
    this.mealsChangeSubscription = this.mealService.mealsChange.subscribe((meals: Meal[]) => {
      this.meals = meals;
      this.totalKcalories = this.mealService.getCalories();
    });

    this.mealsIsFetchingSubscription = this.mealService.mealsFetching.subscribe((isFetching:boolean) => {
      this.isFetching = isFetching;
    });
    this.mealService.fetchMeals();
  }

  ngOnDestroy() {
    this.mealsIsFetchingSubscription.unsubscribe();
    this.mealsChangeSubscription.unsubscribe();
  }
}

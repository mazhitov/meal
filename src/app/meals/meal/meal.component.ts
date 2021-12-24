import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Meal } from '../../shared/meal.model';
import { MealService } from '../../shared/meal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit, OnDestroy {
  @Input() meal!: Meal;

  isRemoving = false;
  mealRemovingSubscription!:Subscription;

  constructor(private mealService: MealService) {}

  ngOnInit(): void {
    this.mealRemovingSubscription = this.mealService.mealsRemoving.subscribe((isRemoving:boolean) => {
      this.isRemoving = isRemoving;
    });
  }

  onRemove(id:string) {
    this.mealService.removeMeal(id);
  }

  ngOnDestroy() {
    this.mealRemovingSubscription.unsubscribe();
  }
}

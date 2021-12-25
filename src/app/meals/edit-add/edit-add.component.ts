import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MealService } from '../../shared/meal.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Meal } from '../../shared/meal.model';

@Component({
  selector: 'app-edit-add',
  templateUrl: './edit-add.component.html',
  styleUrls: ['./edit-add.component.css']
})
export class EditAddComponent implements OnInit, OnDestroy {
  @ViewChild('f') mealForm!: NgForm;
  isEdit = false;
  editId = '';
  mealTimeOptions: string[] = [];
  isUploading = false;
  mealUploadingSubscription!: Subscription;

  constructor(private mealService: MealService,
              private route: ActivatedRoute,
              private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.mealTimeOptions = this.mealService.mealTimeOptions;

    this.mealUploadingSubscription = this.mealService.mealsUploading.subscribe((isUploading: boolean) => {
      this.isUploading = isUploading;
    });
    this.route.data.subscribe(data => {
      const meal = <Meal | null>data.meal;

      if (meal) {
        this.isEdit = true;
        this.editId = meal.id;
        this.setFormValue({
          mealTime: meal.mealTime,
          description: meal.description,
          kcal: meal.kcal,
          date: meal.date
        });
      } else {
        this.isEdit = false;
        this.editId = '';
        this.setFormValue({
          mealTime: '',
          description: '',
          kcal: 0,
          date: this.mealService.getDate(),
        });
      }
    });
  }

  setFormValue(value: { [key: string]: any }) {
    setTimeout(() => {
      this.mealForm.form.setValue(value);
    });
  }

  saveMeal() {
    const id = this.editId || Math.random().toString();
    const newMeal = new Meal(
      id,
      this.mealForm.value.mealTime,
      this.mealForm.value.description,
      this.mealForm.value.kcal,
      this.mealForm.value.date
    );
    if (this.isEdit) {
      this.mealService.editMeal(newMeal).subscribe(() => {
        this.mealService.fetchMeals();
      });
    } else {
      this.mealService.addMeal(newMeal).subscribe(() => {
        this.mealService.fetchMeals();
        void this.router.navigate(['/'], {relativeTo: this.route});
      });
    }
  }


  ngOnDestroy() {
    this.mealUploadingSubscription.unsubscribe();
  }
}

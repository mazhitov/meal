export class Meal {
  constructor(
    public id: string,
    public mealTime: string,
    public description: string,
    public kcal: number,
    public date: string,
  ) {}
}

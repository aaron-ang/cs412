import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WeatherResponse } from '../interfaces/Weather';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private weatherData = new BehaviorSubject<WeatherResponse[]>([]);
  currentData = this.weatherData.asObservable();

  constructor() {}

  updateWeatherData(data: WeatherResponse[]) {
    this.weatherData.next(data);
  }

  clearData() {
    this.weatherData.next([]);
  }
}

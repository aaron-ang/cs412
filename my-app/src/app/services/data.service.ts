import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WeatherResponse } from '../interfaces/Weather';

@Injectable()
export class DataService {
  private weatherData = new BehaviorSubject<WeatherResponse[]>([]);
  currentMessage = this.weatherData.asObservable();

  constructor() {}

  updateWeatherData(data: WeatherResponse[]) {
    this.weatherData.next(data);
  }
}

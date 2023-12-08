import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { WeatherResponse } from '../interfaces/Weather';

@Injectable({
  providedIn: 'root',
})
export class WxService {
  constructor(private httpClient: HttpClient) {}

  getWeather(location: string): Observable<WeatherResponse[]> {
    // assumes that the server in `express-redis` is running on localhost:3000
    // the endpoint `/ps4/c` is configured to return a list duplicate objects
    return this.httpClient.post<WeatherResponse[]>(
      'http://localhost:3000/ps4/c',
      {
        location: location,
      }
    );
  }
}

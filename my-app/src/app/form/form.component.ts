import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataService } from '../services/data.service';
import { WxService } from '../services/weather.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form.component.html',
})
export class FormComponent {
  constructor(private WxService: WxService, private data: DataService) {}

  getWeatherByLocation(location: string) {
    this.WxService.getWeather(location).subscribe((data) => {
      this.data.updateWeatherData(data);
    });
  }
}

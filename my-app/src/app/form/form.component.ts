import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { DataService } from '../services/data.service';
import { WxService } from '../services/weather.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  location!: string;

  constructor(
    private WxService: WxService,
    private data: DataService,
    private form: FormBuilder
  ) {}

  weatherFormGroup = this.form.group({
    locationControl: ['', [Validators.minLength(1), Validators.required]],
  });

  getWeatherByLocation() {
    this.location = this.weatherFormGroup.get('locationControl')?.value || '';
    this.weatherFormGroup.reset();

    this.WxService.getWeather(this.location).subscribe((response) => {
      this.data.updateWeatherData(response);
    });
  }
}

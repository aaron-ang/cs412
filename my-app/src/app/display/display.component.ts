import { Component } from '@angular/core';

import { WeatherResponse } from '../interfaces/Weather';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css',
})
export class DisplayComponent {
  renderData?: WeatherResponse[];

  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.currentData.subscribe((message) => {
      this.renderData = message;
    });
  }

  clearData() {
    this.data.clearData();
  }
}

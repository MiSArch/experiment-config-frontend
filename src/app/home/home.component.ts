import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { ConfigurationService } from '../configuration.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, MatListModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  serviceNames: string[] = [];

  constructor(private configurationService: ConfigurationService) {}

  ngOnInit() {
    this.configurationService
      .getAllServiceNames()
      .subscribe((names) => (this.serviceNames = names));
  }
}

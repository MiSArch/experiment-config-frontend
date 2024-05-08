import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { ConfigurationService } from '../configuration.service';

/**
 * Represents the HomeComponent class.
 * This component is responsible for displaying the home page.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, MatListModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  // internal state of the service names
  serviceNames: string[] = [];

  /**
   * Initializes a new instance of the HomeComponent class.
   * @param configurationService The configuration service.
   */
  constructor(private configurationService: ConfigurationService) {}

  /**
   * Initializes the component
   * Queries all service names from the experiment configuration service.
   */
  ngOnInit() {
    this.configurationService
      .getAllServiceNames()
      .subscribe((names) => (this.serviceNames = names));
  }
}

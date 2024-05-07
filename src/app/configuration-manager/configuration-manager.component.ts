import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { ServiceConfiguration, ConfigurationVariable } from '../models';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'configuration-manager',
  templateUrl: './configuration-manager.component.html',
  imports: [
    FormsModule,
    MatListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
  ],
  styleUrl: './configuration-manager.component.css',
  standalone: true,
})
export class ConfigurationManagerComponent implements OnInit {
  services: ServiceConfiguration[] = [];

  constructor(private configService: ConfigurationService) {}

  ngOnInit(): void {
    this.configService.getAllServiceConfigurations().subscribe((services) => {
      this.services = services;
    });
  }

  updateVariable(serviceName: string, variable: ConfigurationVariable): void {
    this.configService
      .updateServiceVariable(serviceName, variable.key, variable.value)
      .subscribe();
  }

  updateReplicaVariable(
    serviceName: string,
    replicaId: string,
    variable: ConfigurationVariable
  ): void {
    this.configService
      .updateReplicaVariable(
        serviceName,
        replicaId,
        variable.key,
        variable.value
      )
      .subscribe();
  }
}

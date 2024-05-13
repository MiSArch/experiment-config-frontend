import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { ServiceConfiguration, ConfigurationVariable } from '../models';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Ajv from 'ajv';

/**
 * Represents the ConfigurationManagerComponent class.
 * This component is responsible for managing the configuration of services and replicas.
 */
@Component({
  selector: 'configuration-manager',
  templateUrl: './configuration-manager.component.html',
  imports: [
    FormsModule,
    MatListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    ClipboardModule,
    MatGridListModule,
    CommonModule,
  ],
  styleUrl: './configuration-manager.component.css',
  standalone: true,
})
export class ConfigurationManagerComponent implements OnInit {
  // internal state of the services
  services: ServiceConfiguration[] = [];
  // ajv instance for validation
  ajv = new Ajv();
  // examle values for the variables
  exampleValues = {
    pubSubDeterioration: `{"delay": 5000, "delayProbability": 0.5, "errorProbability": 0.2}`,
    serviceInvocationDeterioration: `[{"path": "payments", "delay": 5000, "delayProbability": 0.5, "errorProbability": 0.2, "errorCode": 404}, {"path": "paymentInformations", "delay": 2, "delayProbability": 1, "errorProbability": 0, "errorCode": 404}]`,
    artificialMemoryUsage: '1000000000',
    artificialCPUUsage: `[{"usageDuration": 5000, "pauseDuration": 5000}, {"usageDuration": 5000, "pauseDuration": 5000}]`,
  };

  /**
   * Initializes a new instance of the ConfigurationManagerComponent class.
   * @param configService The configuration service.
   */
  constructor(private configService: ConfigurationService) {}

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.loadServiceConfigurations();
  }

  /**
   * Loads the service configurations from the experiment-config service.
   */
  loadServiceConfigurations(): void {
    this.configService.getAllServiceConfigurations().subscribe((services) => {
      this.services = services.map((service) => this.stringify(service));
    });
  }

  /**
   * Updates the value of one variable for a service.
   * @param serviceName The name of the service.
   * @param variable The updated variable.
   */
  updateServiceVariable(
    serviceName: string,
    variable: ConfigurationVariable
  ): void {
    const typedVariable: ConfigurationVariable = this.validateVariable(
      serviceName,
      variable
    );
    this.configService
      .updateServiceVariable(serviceName, variable.key, typedVariable.value)
      .subscribe((services: ServiceConfiguration) => {
        this.updateInternalService(serviceName, services);
      });
  }

  /**
   * Updates the values of multiple variables for a service.
   * @param serviceName The name of the service.
   * @param variables The updated variables.
   */
  updateServiceVariables(
    serviceName: string,
    variables: ConfigurationVariable[]
  ): void {
    const typedVariables = variables.map((variable) =>
      this.validateVariable(serviceName, variable)
    );
    this.configService
      .updateServiceVariables(serviceName, typedVariables)
      .subscribe((services: ServiceConfiguration) => {
        this.updateInternalService(serviceName, services);
      });
  }

  /**
   * Updates the value of one variable for a replica.
   * @param serviceName The name of the service.
   * @param replicaId The id of the replica.
   * @param variable The updated variable.
   */
  updateReplicaVariable(
    serviceName: string,
    replicaId: string,
    variable: ConfigurationVariable
  ): void {
    const typedVariable: ConfigurationVariable = this.validateVariable(
      serviceName,
      variable
    );
    this.configService
      .updateReplicaVariable(
        serviceName,
        replicaId,
        variable.key,
        variable.value
      )
      .subscribe((service: ServiceConfiguration) => {
        this.updateInternalReplica(serviceName, replicaId, service);
      });
  }

  /**
   * Updates the values of multiple variables for a replica.
   * @param serviceName The name of the service.
   * @param replicaId The id of the replica.
   * @param variables The updated variables.
   */
  updateReplicaVariables(
    serviceName: string,
    replicaId: string,
    variables: ConfigurationVariable[]
  ): void {
    const typedVariables = variables.map((variable) =>
      this.validateVariable(serviceName, variable)
    );
    this.configService
      .updateReplicaVariables(serviceName, replicaId, typedVariables)
      .subscribe((service: ServiceConfiguration) => {
        this.updateInternalReplica(serviceName, replicaId, service);
      });
  }

  /**
   * Stringifies the values of all object variables in a service so that they are modifyable.
   * @param service The service configuration to stringify.
   * @returns The service configuration with stringified variables.
   */
  stringify(service: ServiceConfiguration): ServiceConfiguration {
    service.globalVariables = service.globalVariables.map((variable) => {
      if (typeof variable.value === 'object') {
        variable.value = JSON.stringify(variable.value);
      }
      return variable;
    });
    service.replicas = service.replicas.map((replica) => {
      replica.replicaVariables = replica.replicaVariables.map((variable) => {
        if (typeof variable.value === 'object') {
          variable.value = JSON.stringify(variable.value);
        }
        return variable;
      });
      return replica;
    });
    return service;
  }

  /**
   * Validates a variable against the schema defined in the service configuration.
   * @param serviceName The name of the service.
   * @param variable The variable to validate.
   * @returns The validated variable.
   */
  validateVariable(
    serviceName: string,
    variable: ConfigurationVariable
  ): ConfigurationVariable {
    const service = this.services.find(
      (service) => service.name === serviceName
    );
    if (!service) throw new Error(`Service ${serviceName} not found`);

    const value = JSON.parse(variable.value);
    const variableDefinition = service.variableDefinitions.find(
      (v) => v.key === variable.key
    );
    if (!variableDefinition)
      throw new Error(
        `Variable ${variable.key} not found in service ${serviceName}`
      );
    const variableType = variableDefinition.type;

    const validate = this.ajv.compile(variableType);
    const valid = validate(value);
    if (!valid) {
      throw new Error(
        `[${variable.key}] Validation failed: ${validate.errors
          ?.map((err: any) => `${err.instancePath} ${err.message}`)
          .join(', ')}`
      );
    }
    variable.value = value;
    return variable;
  }

  /**
   * Updates the internal state of the service configuration with the provided updated service.
   * @param serviceName - The name of the service to be updated.
   * @param updatedService - The updated service configuration.
   */
  updateInternalService(
    serviceName: string,
    updatedService: ServiceConfiguration
  ) {
    this.services = this.services.map((service) => {
      if (service.name === serviceName) {
        service.globalVariables = updatedService.globalVariables;
        service.variableDefinitions = updatedService.variableDefinitions;
        service.replicas = service.replicas.map((replica) => {
          const updatedReplica = updatedService.replicas.find(
            (serviceReplica) => serviceReplica.id === replica.id
          );
          return updatedReplica
            ? Object.assign(replica, updatedReplica)
            : replica;
        });
      }
      return this.stringify(service);
    });
  }

  /**
   * Updates the internal state of the service configuration with the provided updated replica.
   * @param serviceName - The name of the service to be updated.
   * @param replicaId - The id of the replica to be updated.
   * @param updatedService - The updated service configuration.
   */
  updateInternalReplica(
    serviceName: string,
    replicaId: string,
    updatedService: ServiceConfiguration
  ) {
    const updatedReplica = updatedService.replicas.find(
      (replica) => replica.id === replicaId
    );
    if (!updatedReplica) {
      throw new Error(`Replica ${replicaId} not found`);
    }
    this.services = this.services.map((service) => {
      if (service.name === serviceName) {
        service.replicas = service.replicas.map((replica) => {
          if (replica.id === replicaId) {
            replica.replicaVariables = updatedReplica.replicaVariables;
          }
          return replica;
        });
      }
      return this.stringify(service);
    });
  }
}

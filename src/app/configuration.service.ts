import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceConfiguration, ConfigurationVariable } from './models';

/**
 * Represents the ConfigurationService class.
 * This service implements the backend connection for managing the configuration of services and replicas.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  // url for nginx proxy
  private baseUrl = '/experiment-config/configuration';

  /**
   * Initializes a new instance of the ConfigurationService class.
   * @param http The HttpClient instance.
   */
  constructor(private http: HttpClient) {}

  /**
   * Queries all service names from the experiment configuration service.
   * @returns An observable of the service names.
   */
  getAllServiceNames(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/names`);
  }

  /**
   * Queries all service configurations from the experiment configuration service.
   * @returns An observable of the service configurations.
   */
  getAllServiceConfigurations(): Observable<ServiceConfiguration[]> {
    return this.http.get<ServiceConfiguration[]>(`${this.baseUrl}`);
  }

  /**
   * Updates one service variable.
   * @param serviceName - The name of the service.
   * @param variableKey - The key of the variable.
   * @param value - The new value for the variable.
   * @returns An Observable of type ServiceConfiguration.
   */
  updateServiceVariable(
    serviceName: string,
    variableKey: string,
    value: any
  ): Observable<ServiceConfiguration> {
    return this.http.put<ServiceConfiguration>(
      `${this.baseUrl}/${serviceName}/variables/${variableKey}`,
      { value }
    );
  }

  /**
   * Updates multiple service variables.
   * @param serviceName - The name of the service.
   * @param variables - The new variables.
   * @returns An Observable of type ServiceConfiguration.
   */
  updateServiceVariables(
    serviceName: string,
    variables: ConfigurationVariable[]
  ): Observable<ServiceConfiguration> {
    return this.http.put<ServiceConfiguration>(
      `${this.baseUrl}/${serviceName}/variables`,
      {
        variables,
      }
    );
  }

  /**
   * Updates one replica variable.
   * @param serviceName - The name of the service.
   * @param replicaId - The id of the replica.
   * @param variableKey - The key of the variable.
   * @param value - The new value for the variable.
   * @returns An Observable of type ServiceConfiguration.
   */
  updateReplicaVariable(
    serviceName: string,
    replicaId: string,
    variableKey: string,
    value: any
  ): Observable<ServiceConfiguration> {
    return this.http.put<ServiceConfiguration>(
      `${this.baseUrl}/${serviceName}/replicas/${replicaId}/variables/${variableKey}`,
      { value }
    );
  }

  /**
   * Updates multiple replica variables.
   * @param serviceName - The name of the service.
   * @param replicaId - The id of the replica.
   * @param variables - The new variables.
   * @returns An Observable of type ServiceConfiguration.
   */
  updateReplicaVariables(
    serviceName: string,
    replicaId: string,
    variables: ConfigurationVariable[]
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${serviceName}/replicas/${replicaId}/variables`,
      { variables }
    );
  }
}

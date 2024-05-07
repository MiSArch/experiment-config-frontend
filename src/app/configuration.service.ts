import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceConfiguration, ServiceReplica, ConfigurationVariable } from './models';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private baseUrl = 'http://localhost:3000/configuration';

  constructor(private http: HttpClient) { }

  getAllServiceNames(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/names`);
  }

  getAllServiceConfigurations(): Observable<ServiceConfiguration[]> {
    return this.http.get<ServiceConfiguration[]>(`${this.baseUrl}`);
  }

  updateServiceVariable(serviceName: string, variableKey: string, value: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${serviceName}/variables/${variableKey}`, { value });
  }

  updateReplicaVariable(serviceName: string, replicaId: string, variableKey: string, value: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${serviceName}/replicas/${replicaId}/variables/${variableKey}`, { value });
  }
}

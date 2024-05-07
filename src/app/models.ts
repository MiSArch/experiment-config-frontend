import { JSONSchemaType } from 'ajv';

export interface ConfigurationVariable {
  key: string;
  value: any;
}

export interface ConfigurationVariableDefinition {
  key: string;
  type: JSONSchemaType<any>;
}

export interface ServiceReplica {
  id: string;
  replicaVariables: ConfigurationVariable[];
  lastSeen?: Date;
}

export interface ServiceConfiguration {
  name: string;
  replicas: ServiceReplica[];
  globalVariables: ConfigurationVariable[];
  variableDefinitions: ConfigurationVariableDefinition[];
}
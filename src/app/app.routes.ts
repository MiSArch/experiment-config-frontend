import { Route } from '@angular/router';
import { ConfigurationManagerComponent } from './configuration-manager/configuration-manager.component';
import { HomeComponent } from './home/home.component';

/**
 * Represents the routes of the application.
 */
export const routes: Route[] = [
  { path: 'home', title: 'MisArch Overview', component: HomeComponent },
  { path: 'configuration', title: 'MisArch Configuration', component: ConfigurationManagerComponent },
  { path: '**', redirectTo: 'home' },
];

import { Component } from '@angular/core';
import {HeaderComponent} from './header/header.component';
import {RouterOutlet} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    HttpClientModule
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}

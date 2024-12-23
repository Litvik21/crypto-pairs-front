import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgOptimizedImage} from '@angular/common'; // Импортируем HttpClient

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private http: HttpClient) {}

  downloadCSV(): void {
    this.http.get('http://localhost:8080/cryptocurrencies/csv', { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(response);
        downloadLink.href = url;
        downloadLink.download = 'cryptocurrencies.csv';
        downloadLink.click();
        window.URL.revokeObjectURL(url);
      });
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, ChartOptions, registerables } from 'chart.js'; // Добавьте registerables
import { map, Subscription, switchMap, timer } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HttpClientModule,
    NgForOf,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  private chart!: Chart;
  private dataFetchSubscription!: Subscription;
  selectedCrypto: string = 'BTC'; // По умолчанию выбран BTC
  cryptocurrencies: string[] = ["BTC", "LTC", "ETH", "BNB", "XRP", "DOGE", "BCH", "LUNA", "RSR", "STRAX", "DAR", "POL"]; // Доступные криптовалюты

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Регистрируем все необходимые компоненты Chart.js
    Chart.register(...registerables);

    // Инициализация графика
    this.initializeChart();

    // Периодический запрос данных
    this.dataFetchSubscription = timer(0, 10000) // Запуск сразу и повторение каждые 10 секунд
      .pipe(
        switchMap(() => this.fetchChartData(this.selectedCrypto)) // Передаем выбранную криптовалюту в запрос
      )
      .subscribe((data) => this.updateChart(data));
  }

  ngOnDestroy(): void {
    if (this.dataFetchSubscription) {
      this.dataFetchSubscription.unsubscribe();
    }
    this.chart?.destroy();
  }

  // Инициализация графика
  private initializeChart(): void {
    const ctx = document.getElementById('chartCanvas') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [], // Заполняется при обновлении
        datasets: [
          {
            label: 'Cryptocurrency Price',
            data: [], // Данные для графика
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.3, // Добавляет сглаживание линии
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Time' }, type: 'category' }, // Указание типа оси X как 'category'
          y: { title: { display: true, text: 'Value' } },
        },
      } as ChartOptions,
    });
  }

  // Функция для получения данных
  private fetchChartData(crypto: string) {
    return this.http.get<Array<{ pair: string; firstSymbol: string; secondSymbol: string; price: number; date: string }>>(
      `http://localhost:8080/cryptocurrencies?name=${crypto}`
    ).pipe(
      map((response) => {
        // Преобразуем JSON в формат для графика
        const labels = response.map(item => item.date); // Используем поле date для оси X
        const data = response.map(item => item.price); // Используем поле price для оси Y
        return { labels, data }; // Возвращаем объект с массивами
      })
    );
  }

  // Обработчик изменения выбора криптовалюты
  onCryptoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCrypto = selectElement.value; // Сохраняем выбранную криптовалюту
    this.fetchChartData(this.selectedCrypto).subscribe((data) => this.updateChart(data)); // Обновляем данные графика
  }

  // Функция обновления данных графика
  private updateChart(data: { labels: string[]; data: number[] }): void {
    if (this.chart) {
      this.chart.data.labels = data.labels;
      this.chart.data.datasets[0].data = data.data;
      this.chart.update();
    }
  }
}

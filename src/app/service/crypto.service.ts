import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class CarService {
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  private baseUrl = environment.urlPath + '/cryptocurrencies';

  constructor(
    private http: HttpClient) {
  }

  getAll(): Observable<Crypto[]> {
    return this.http.get<Crypto[]>(this.baseUrl)
      .pipe(
        catchError(this.handleError<Crypto[]>('getAll', []))
      );
  }

  getCrypto(name: string): Observable<Crypto> {
    const url = `${this.baseUrl}?name=${name}`;
    return this.http.get<Crypto>(url).pipe(
      catchError(this.handleError<Crypto>(`getCrypto name=${name}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);

      return of(result as T);
    };
  }
}

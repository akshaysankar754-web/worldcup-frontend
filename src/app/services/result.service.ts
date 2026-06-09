import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private apiUrl = 'http://localhost:5084/api/Result';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  revealResult(): Observable<any> {
    return this.http.post(`${this.apiUrl}/reveal`, {}, { headers: this.getHeaders() });
  }

  hideResult(): Observable<any> {
    return this.http.post(`${this.apiUrl}/hide`, {}, { headers: this.getHeaders() });
  }

  getResults(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getResultStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/status`, { headers: this.getHeaders() });
  }
}

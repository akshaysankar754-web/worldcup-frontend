import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private apiUrl = 'http://localhost:5085/api/Poll';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  vote(teamId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/vote`, { teamId }, { headers: this.getHeaders() });
  }

  openPoll(): Observable<any> {
    return this.http.post(`${this.apiUrl}/open`, {}, { headers: this.getHeaders() });
  }

  closePoll(): Observable<any> {
    return this.http.post(`${this.apiUrl}/close`, {}, { headers: this.getHeaders() });
  }

  getPollStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/status`);
  }
}

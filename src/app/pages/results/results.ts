import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultService } from '../../services/result.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './results.html',
  styleUrls: ['./results.css']
})
export class ResultsComponent implements OnInit {
  results: any[] = [];
  message: string = '';

  constructor(private resultService: ResultService) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults() {
    this.resultService.getResults().subscribe({
      next: (data) => this.results = data,
      error: (err) => {
        this.message = err.error?.message || 'Error loading results.';
      }
    });
  }
}

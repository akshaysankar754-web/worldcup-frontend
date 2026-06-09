import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  page: number = 1;
  pageSize: number = 5;

  get totalPages(): number {
    return Math.ceil(this.results.length / this.pageSize) || 1;
  }

  nextPage() {
    if (this.page < this.totalPages) { this.page++; this.cdr.detectChanges(); }
  }

  prevPage() {
    if (this.page > 1) { this.page--; this.cdr.detectChanges(); }
  }

  constructor(private resultService: ResultService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults() {
    this.resultService.getResults().subscribe({
      next: (data) => { this.results = data; this.cdr.detectChanges(); },
      error: (err) => {
        this.message = err.error?.message || 'Error loading results.';
        this.cdr.detectChanges();
      }
    });
  }
}

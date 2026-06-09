import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TeamService } from '../../services/team.service';
import { ResultService } from '../../services/result.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  teamForm: FormGroup;
  teams: any[] = [];
  results: any[] = [];
  message: string = '';
  resultVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private resultService: ResultService,
    private authService: AuthService,
    private router: Router
  ) {
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTeams();
    this.checkResultStatus();
  }

  loadTeams() {
    this.teamService.getTeams().subscribe({
      next: (data) => this.teams = data,
      error: (err) => console.error(err)
    });
  }

  checkResultStatus() {
    this.resultService.getResultStatus().subscribe({
      next: (data) => {
        this.resultVisible = data.resultVisible;
        if (this.resultVisible) {
           this.loadResults();
        }
      }
    });
  }

  loadResults() {
    this.resultService.getResults().subscribe({
      next: (data) => this.results = data,
      error: (err) => console.error(err)
    });
  }

  onAddTeam() {
    if (this.teamForm.valid) {
      this.teamService.addTeam(this.teamForm.value.teamName).subscribe({
        next: () => {
          this.message = 'Team added successfully.';
          this.teamForm.reset();
          this.loadTeams();
        },
        error: (err) => {
          this.message = err.error?.message || 'Error adding team.';
        }
      });
    }
  }

  onRevealResult() {
    this.resultService.revealResult().subscribe({
      next: () => {
        this.message = 'Results revealed successfully.';
        this.resultVisible = true;
        this.loadResults();
      },
      error: (err) => {
        this.message = err.error?.message || 'Error revealing results.';
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}

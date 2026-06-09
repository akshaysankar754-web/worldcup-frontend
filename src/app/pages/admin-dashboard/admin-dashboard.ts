import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TeamService } from '../../services/team.service';
import { ResultService } from '../../services/result.service';
import { PollService } from '../../services/poll.service';
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
  pollOpen: boolean = false;
  activeTab: 'teams' | 'poll' | 'results' = 'teams';

  teamsPage: number = 1;
  resultsPage: number = 1;
  pageSize: number = 5;

  get totalTeamsPages(): number {
    return Math.ceil(this.teams.length / this.pageSize) || 1;
  }

  get totalResultsPages(): number {
    return Math.ceil(this.results.length / this.pageSize) || 1;
  }

  nextTeamsPage() {
    if (this.teamsPage < this.totalTeamsPages) { this.teamsPage++; this.cdr.detectChanges(); }
  }

  prevTeamsPage() {
    if (this.teamsPage > 1) { this.teamsPage--; this.cdr.detectChanges(); }
  }

  nextResultsPage() {
    if (this.resultsPage < this.totalResultsPages) { this.resultsPage++; this.cdr.detectChanges(); }
  }

  prevResultsPage() {
    if (this.resultsPage > 1) { this.resultsPage--; this.cdr.detectChanges(); }
  }

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private resultService: ResultService,
    private pollService: PollService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTeams();
    this.checkResultStatus();
    this.checkPollStatus();
  }

  showMessage(msg: string) {
    this.message = msg;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.message = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  checkPollStatus() {
    this.pollService.getPollStatus().subscribe({
      next: (res) => {
        this.pollOpen = res.pollOpen;
        this.cdr.detectChanges();
      }
    });
  }

  loadTeams() {
    this.teamService.getTeams().subscribe({
      next: (data) => { this.teams = data; this.cdr.detectChanges(); },
      error: (err) => { console.error(err); this.cdr.detectChanges(); }
    });
  }

  checkResultStatus() {
    this.resultService.getResultStatus().subscribe({
      next: (data) => {
        this.resultVisible = data.resultVisible;
        this.loadResults(); // Always load for admin
        this.cdr.detectChanges();
      }
    });
  }

  loadResults() {
    this.resultService.getResults().subscribe({
      next: (data) => { this.results = data; this.cdr.detectChanges(); },
      error: (err) => { console.error(err); this.cdr.detectChanges(); }
    });
  }

  onAddTeam() {
    if (this.teamForm.valid) {
      this.teamService.addTeam(this.teamForm.value.teamName).subscribe({
        next: () => {
          this.showMessage('Team added successfully.');
          this.teamForm.reset();
          this.loadTeams();
        },
        error: (err) => {
          this.showMessage(err.error?.message || 'Error adding team.');
        }
      });
    }
  }

  onOpenPoll() {
    this.pollService.openPoll().subscribe({
      next: () => {
        this.pollOpen = true;
        this.showMessage('Poll is now OPEN.');
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Error opening poll.');
      }
    });
  }

  onClosePoll() {
    this.pollService.closePoll().subscribe({
      next: () => {
        this.pollOpen = false;
        this.showMessage('Poll is now CLOSED.');
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Error closing poll.');
      }
    });
  }

  onRevealResult() {
    this.resultService.revealResult().subscribe({
      next: () => {
        this.resultVisible = true;
        this.loadResults();
        this.showMessage('Results revealed successfully.');
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Error revealing results.');
      }
    });
  }

  onHideResult() {
    this.resultService.hideResult().subscribe({
      next: () => {
        this.resultVisible = false;
        this.showMessage('Results hidden successfully.');
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Error hiding results.');
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}

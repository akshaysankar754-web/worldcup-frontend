import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/team.service';
import { PollService } from '../../services/poll.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboardComponent implements OnInit {
  teams: any[] = [];
  message: string = '';
  pollOpen: boolean = false;

  page: number = 1;
  pageSize: number = 5;

  get totalPages(): number {
    return Math.ceil(this.teams.length / this.pageSize) || 1;
  }

  constructor(
    private teamService: TeamService,
    private pollService: PollService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkPollStatus();
    this.loadTeams();
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.cdr.detectChanges();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.cdr.detectChanges();
    }
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
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadTeams() {
    this.teamService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  vote(teamId: number) {
    this.pollService.vote(teamId).subscribe({
      next: (res) => {
        this.showMessage(res.message);
      },
      error: (err) => {
        this.showMessage(
          err.error?.message || 'Error submitting vote.'
        );
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
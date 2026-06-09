import { Component, OnInit } from '@angular/core';
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

  constructor(
    private teamService: TeamService,
    private pollService: PollService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams() {
    this.teamService.getTeams().subscribe({
      next: (data) => this.teams = data,
      error: (err) => console.error(err)
    });
  }

  vote(teamId: number) {
    this.pollService.vote(teamId).subscribe({
      next: (res) => {
        this.message = res.message;
      },
      error: (err) => {
        this.message = err.error?.message || 'Error submitting vote.';
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}

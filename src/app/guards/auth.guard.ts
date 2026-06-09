import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const roles = route.data['roles'] as Array<string>;
    if (roles) {
      const userRole = this.authService.getRole();
      if (!userRole || !roles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        if (userRole === 'Admin') {
            this.router.navigate(['/admin-dashboard']);
        } else {
            this.router.navigate(['/user-dashboard']);
        }
        return false;
      }
    }

    return true;
  }
}

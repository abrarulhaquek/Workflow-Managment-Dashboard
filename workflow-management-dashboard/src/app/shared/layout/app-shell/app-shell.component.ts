import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AsyncPipe, NgIf } from '@angular/common';
import { map } from 'rxjs';

import { AuthFacade } from '../../../features/auth/auth.facade';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    NgIf,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent {
  private readonly auth = inject(AuthFacade);
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  readonly userLabel$ = this.auth.user$.pipe(
    map((u) => (u ? `${u.username} (${u.role})` : null))
  );

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  toggleTheme(): void {
    this.theme.toggle();
  }
}


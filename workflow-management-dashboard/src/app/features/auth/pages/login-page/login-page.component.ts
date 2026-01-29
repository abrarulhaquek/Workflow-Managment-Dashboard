import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Role } from '../../../../core/models/auth.models';
import { AuthFacade } from '../../auth.facade';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    role: new FormControl<Role>('user', { nonNullable: true, validators: [Validators.required] })
  });

  constructor(
    private readonly router: Router,
    private readonly auth: AuthFacade
  ) {}

  onSubmit(): void {
    if (this.form.invalid) return;

    const { username, role } = this.form.getRawValue();
    this.auth.login(username, role);
    void this.router.navigateByUrl('/dashboard');
  }
}


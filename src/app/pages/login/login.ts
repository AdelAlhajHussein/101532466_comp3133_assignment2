import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

const LOGIN_QUERY = gql`
  query Login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      status
      message
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const usernameOrEmail = this.loginForm.value.username ?? '';
      const password = this.loginForm.value.password ?? '';

      this.apollo.query<any>({
        query: LOGIN_QUERY,
        variables: { usernameOrEmail, password },
        fetchPolicy: 'no-cache',
      }).subscribe({
        next: (result) => {
          const response = result?.data?.login;

          if (response?.status) {
            if (response.token) {
              localStorage.setItem('token', response.token);
            }

            this.authService.setUser(response.user);
            alert('Login successful');
            this.router.navigate(['/employees']);
          } else {
            alert(response?.message || 'Invalid login');
          }
        },
        error: (err) => {
          console.error('LOGIN ERROR:', err);
          alert('Login failed');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

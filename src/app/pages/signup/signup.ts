import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Router, RouterModule } from '@angular/router';

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
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
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  signupForm;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;

      this.apollo.mutate<any>({
        mutation: SIGNUP_MUTATION,
        variables: { username, email, password },
      }).subscribe({
        next: (result) => {
          const response = result.data.signup;

          if (response.status) {
            alert('Signup successful');
            this.router.navigate(['/login']);
          } else {
            alert(response.message);
          }
        },
        error: (err) => {
          console.error('SIGNUP ERROR:', err);
          alert('Signup failed');
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

const GET_EMPLOYEES = gql`
  query {
    employees {
      _id
      first_name
      last_name
      email
      designation
      department
    }
  }
`;

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  employees: any[] = [];

  constructor(
    private apollo: Apollo,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.apollo
      .query<any>({
        query: GET_EMPLOYEES,
        fetchPolicy: 'no-cache',
      })
      .subscribe({
        next: (result) => {
          console.log('EMPLOYEES ONLY:', result.data.employees);
          this.employees = [...(result.data.employees || [])];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('GRAPHQL ERROR:', err);
        },
      });
  }
}

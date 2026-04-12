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
const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployeeById(id: $id) {
      _id
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

  deleteEmployee(id: string) {
    const confirmed = confirm('Are you sure you want to delete this employee?');

    if (confirmed) {
      this.apollo.mutate<any>({
        mutation: DELETE_EMPLOYEE,
        variables: { id },
      }).subscribe({
        next: () => {
          alert('Employee deleted successfully');
          this.employees = this.employees.filter(emp => emp._id !== id);
        },
        error: (err) => {
          console.error('DELETE ERROR:', err);
          alert('Delete failed');
        }
      });
    }
  }
}

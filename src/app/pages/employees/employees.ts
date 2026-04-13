import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

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

const SEARCH_EMPLOYEES = gql`
  query SearchEmployees($designation: String, $department: String) {
    searchEmployeesByFilter(designation: $designation, department: $department) {
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
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  employees: any[] = [];
  searchDesignation: string = '';
  searchDepartment: string = '';

  constructor(
    private apollo: Apollo,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.apollo.query<any>({
      query: GET_EMPLOYEES,
      fetchPolicy: 'no-cache'
    }).subscribe({
      next: (result) => {
        this.employees = [...(result.data.employees || [])];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('FETCH ERROR:', err);
      }
    });
  }

  searchEmployees() {
    this.apollo.query<any>({
      query: SEARCH_EMPLOYEES,
      variables: {
        designation: this.searchDesignation || null,
        department: this.searchDepartment || null,
      },
      fetchPolicy: 'no-cache',
    }).subscribe({
      next: (result) => {
        this.employees = [...(result.data.searchEmployeesByFilter || [])];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('SEARCH ERROR:', err);
        alert('Search failed');
      }
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

  logout() {
    this.authService.logout();
  }
}

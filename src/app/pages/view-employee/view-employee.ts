import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

const GET_EMPLOYEE = gql`
  query GetEmployeeById($id: ID!) {
    employeeById(id: $id) {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-employee.html',
  styleUrl: './view-employee.css',
})
export class ViewEmployee implements OnInit {
  employee: any = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      return;
    }

    this.apollo.query<any>({
      query: GET_EMPLOYEE,
      variables: { id },
      fetchPolicy: 'no-cache',
    }).subscribe({
      next: (result) => {
        console.log('VIEW RESULT:', result);
        this.employee = result?.data?.employeeById || null;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('VIEW EMPLOYEE ERROR:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

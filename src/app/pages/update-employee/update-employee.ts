import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
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

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
    updateEmployeeById(id: $id, input: $input) {
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
  selector: 'app-update-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-employee.html',
  styleUrl: './update-employee.css',
})
export class UpdateEmployee implements OnInit {
  employeeForm;
  employeeId!: string;
  selectedPhoto: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', Validators.required],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
      employee_photo: [''],
    });
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;

    this.apollo.query<any>({
      query: GET_EMPLOYEE,
      variables: { id: this.employeeId },
      fetchPolicy: 'no-cache',
    }).subscribe({
      next: (result) => {
        const emp = result.data.employeeById;

        this.employeeForm.patchValue({
          ...emp,
          date_of_joining: emp.date_of_joining?.split('T')[0],
        });
      },
      error: (err) => {
        console.error('LOAD EMPLOYEE ERROR:', err);
        alert('Failed to load employee');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedPhoto = reader.result as string;
      this.employeeForm.patchValue({
        employee_photo: this.selectedPhoto
      });
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const input = {
        ...this.employeeForm.value,
        salary: Number(this.employeeForm.value.salary),
      };

      console.log('UPDATE INPUT:', input);

      this.apollo.mutate<any>({
        mutation: UPDATE_EMPLOYEE,
        variables: {
          id: this.employeeId,
          input,
        },
      }).subscribe({
        next: (result) => {
          console.log('UPDATE RESULT:', result);
          alert('Employee updated successfully');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('UPDATE ERROR:', err);
          alert('Update failed');
        }
      });
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }
}

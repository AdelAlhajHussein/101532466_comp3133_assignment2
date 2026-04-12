import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';

const ADD_EMPLOYEE = gql`
  mutation AddEmployee($input: EmployeeInput!) {
    addEmployee(input: $input) {
      _id
      first_name
      last_name
      email
      designation
      department
      employee_photo
    }
  }
`;

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css',
})
export class AddEmployee {
  employeeForm;
  selectedPhoto: string = '';

  constructor(
    private fb: FormBuilder,
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

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    if (file.size > 200000) {
      alert('File too large. Please select an image under 200KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedPhoto = reader.result as string;
      this.employeeForm.patchValue({
        employee_photo: this.selectedPhoto,
      });
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.apollo.mutate({
        mutation: ADD_EMPLOYEE,
        variables: {
          input: {
            ...this.employeeForm.value,
            salary: Number(this.employeeForm.value.salary),
          },
        },
      }).subscribe({
        next: () => {
          alert('Employee added successfully');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error(err);
          alert('Failed to add employee');
        }
      });
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }
}

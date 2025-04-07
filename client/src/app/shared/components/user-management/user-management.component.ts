import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../models/user.model';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'username', 'email', 'roles', 'actions'];
  isLoading = true;
  isMakingAdmin = false;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UserManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.snackBar.open(
          `Error loading users: ${
            err.error?.message || err.message || 'Unknown error'
          }`,
          'Close',
          { duration: 5000 }
        );
        this.isLoading = false;
      },
    });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: { user: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  openEditUserDialog(user: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  makeAdmin(user: User): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Admin Role',
        message: `Are you sure you want to make ${user.username} an admin?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isMakingAdmin = true;
        const updatedUser = {
          ...user,
          roles: [...(user.roles || []), 'ADMIN'],
        };

        this.userService.updateUser(user.id, updatedUser).subscribe({
          next: () => {
            this.snackBar.open('User role updated successfully', 'Close', {
              duration: 3000,
            });
            this.loadUsers();
          },
          error: (err) => {
            console.error('Error updating user role:', err);
            this.snackBar.open(
              `Error updating role: ${
                err.error?.message || err.message || 'Unknown error'
              }`,
              'Close',
              { duration: 5000 }
            );
          },
          complete: () => (this.isMakingAdmin = false),
        });
      }
    });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete ${user.username}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.snackBar.open('User deleted successfully', 'Close', {
              duration: 3000,
            });
            this.loadUsers();
          },
          error: (err) => {
            console.error('Error deleting user:', err);
            this.snackBar.open(
              `Error deleting user: ${
                err.error?.message || err.message || 'Unknown error'
              }`,
              'Close',
              { duration: 5000 }
            );
          },
        });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}

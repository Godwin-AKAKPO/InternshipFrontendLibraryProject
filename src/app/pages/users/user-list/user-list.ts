import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../../core/services/user.service';
import { LoanService, Loan } from '../../../core/services/loan.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  showCreateModal = false;
  showLoansModal = false;

  successMsg = '';
  errorMsg = '';

  newUser: Omit<User, 'id'> = { name: '', email: '' };

  selectedUser: User | null = null;
  selectedUserLoans: Loan[] = [];
  loadingLoans = false;

  constructor(
    private userService: UserService, 
    private loanService: LoanService,
    private cdr: ChangeDetectorRef    
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: data => {
        this.users = data,
        this.cdr.detectChanges()
      },
      error: () => this.showError('Erreur lors du chargement des utilisateurs.')
    });
  }

  openCreateModal() {
    this.newUser = { name: '', email: '' };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  createUser() {
    if (!this.newUser.name || !this.newUser.email) {
      this.showError('Veuillez remplir tous les champs.');
      return;
    }
    this.userService.create(this.newUser).subscribe({
      next: () => {
        this.closeCreateModal();
        this.loadUsers();
        this.showSuccess('Utilisateur ajouté avec succès.');
      },
      error: () => this.showError('Erreur lors de la création.')
    });
  }

  openLoansModal(user: User) {
    this.selectedUser = user;
    this.loadingLoans = true;
    this.selectedUserLoans = [];
    this.showLoansModal = true;
    this.loanService.getUserLoans(user.id).subscribe({
      next: data => {
        this.selectedUserLoans = data;
        this.loadingLoans = false;
      },
      error: () => {
        this.loadingLoans = false;
        this.showError('Erreur lors du chargement des emprunts.');
      }
    });
  }

  closeLoansModal() {
    this.showLoansModal = false;
    this.selectedUser = null;
    this.selectedUserLoans = [];
  }

  private showSuccess(msg: string) {
    this.successMsg = msg;
    this.errorMsg = '';
    setTimeout(() => this.successMsg = '', 3000);
  }

  private showError(msg: string) {
    this.errorMsg = msg;
    this.successMsg = '';
    setTimeout(() => this.errorMsg = '', 4000);
  }
}
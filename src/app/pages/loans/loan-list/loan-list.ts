import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService, Loan } from '../../../core/services/loan.service';
import { BookService, Book } from '../../../core/services/book.service';
import { UserService, User } from '../../../core/services/user.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-list.html',
  styleUrl: './loan-list.css'
})
export class LoanListComponent implements OnInit {
  loans: Loan[] = [];
  availableBooks: Book[] = [];
  users: User[] = [];

  showBorrowModal = false;

  successMsg = '';
  errorMsg = '';

  filter: 'all' | 'active' | 'returned' = 'all';

  borrowBookId = 0;
  borrowUserId = 0;

  get activeLoans() { return this.loans.filter(l => !l.returnDate); }
  get returnedLoans() { return this.loans.filter(l => !!l.returnDate); }
  get filteredLoans() {
    if (this.filter === 'active') return this.activeLoans;
    if (this.filter === 'returned') return this.returnedLoans;
    return this.loans;
  }

 constructor(
  private loanService: LoanService,
  private bookService: BookService,
  private userService: UserService,
  private cdr: ChangeDetectorRef 
) {}

  ngOnInit() {
    this.loadLoans();
    this.loadAvailableBooks();
    this.userService.getAll().subscribe(u => this.users = u);
    
  }

  loadLoans() {
    this.loanService.getAll().subscribe({
      next: data => { this.loans = data, this.cdr.detectChanges() },
      error: () => this.showError('Erreur lors du chargement des emprunts.')
    });
  }

  loadAvailableBooks() {
    this.bookService.getAll().subscribe(b => {
      this.availableBooks = b.filter(book => book.available);
    });
  }

  openBorrowModal() {
    this.borrowBookId = 0;
    this.borrowUserId = 0;
    this.showBorrowModal = true;
  }

  closeBorrowModal() {
    this.showBorrowModal = false;
  }

  borrowBook() {
    if (!this.borrowBookId || !this.borrowUserId) {
      this.showError('Veuillez sélectionner un livre et un utilisateur.');
      return;
    }
    this.loanService.borrow(this.borrowBookId, this.borrowUserId).subscribe({
      next: () => {
        this.closeBorrowModal();
        this.loadLoans();
        this.loadAvailableBooks();
        this.showSuccess('Emprunt enregistré avec succès.');
      },
      error: () => this.showError('Erreur lors de l\'enregistrement de l\'emprunt.')
    });
  }

  returnBook(bookId: number) {
    if (!confirm('Confirmer le retour de ce livre ?')) return;
    this.loanService.return(bookId).subscribe({
      next: () => {
        this.loadLoans();
        this.loadAvailableBooks();
        this.showSuccess('Livre retourné avec succès.');
      },
      error: () => this.showError('Erreur lors du retour.')
    });
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

  currentPage : number = 1;
  pageSize : number = 10;

  get PaginateLoans() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredLoans.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.loans.length / this.pageSize) || 1;
  }

  getStartIndex(){
    return (this.currentPage - 1) * this.pageSize;
  }

  getEndIndex() {
    return Math.min((this.getStartIndex() + this.pageSize, this.loans.length));
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages ){
      this.currentPage++;
    }
  }
}


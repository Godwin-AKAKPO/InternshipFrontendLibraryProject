import { Routes } from '@angular/router';
import { BookListComponent } from './pages/books/book-list/book-list.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';
import { LoanListComponent } from './pages/loans/loan-list/loan-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: BookListComponent },
  { path: 'users', component: UserListComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'loans', component: LoanListComponent }
];
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.gard';
import { LoginComponent } from './pages/login/login';
import { BookListComponent } from './pages/books/book-list/book-list';
import { CategoryListComponent } from './pages/categories/category-list/category-list';
import { UserListComponent } from './pages/users/user-list/user-list';
import { LoanListComponent } from './pages/loans/loan-list/loan-list';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: BookListComponent, canActivate: [authGuard] },
  { path: 'categories', component: CategoryListComponent, canActivate: [authGuard] },
  { path: 'users', component: UserListComponent, canActivate: [authGuard] },
  { path: 'loans', component: LoanListComponent, canActivate: [authGuard] }
];
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './book.service';
import { User } from './user.service';
import { environment } from '../../../environments/environement';

export interface Loan {
  id: number;
  loanDate: string;
  returnDate: string | null;
  book: Book;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class LoanService {
  private apiUrl = `${environment.apiUrl}/loans`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiUrl);
  }

  borrow(bookId: number, userId: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/borrow`, { bookId, userId });
  }

  return(bookId: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/return`, { bookId });
  }

  getUserLoans(userId: number): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/user/${userId}`);
  }
}
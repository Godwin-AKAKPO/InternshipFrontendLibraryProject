import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environement';

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  available: boolean;
  category: Category;
}

export interface BookDTO {
  title: string;
  author: string;
  categoryId: number;
  isAvailable: boolean;
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  create(book: BookDTO): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, {
      title: book.title,
      author: book.author,
      categoryId: book.categoryId,
      available: book.isAvailable
    });
  }

  update(id: number, book: BookDTO, category: Category): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, {
      title: book.title,
      author: book.author,
      available: book.isAvailable,
      category: category
    });
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
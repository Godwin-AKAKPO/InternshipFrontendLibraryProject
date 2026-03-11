import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8080/books';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  create(book: BookDTO): Observable<Book> {
    // Spring Boot attend "available" pas "isAvailable"
    const payload = {
      title: book.title,
      author: book.author,
      categoryId: book.categoryId,
      available: book.isAvailable
    };
    return this.http.post<Book>(this.apiUrl, payload);
  }

  update(id: number, book: BookDTO, category: Category): Observable<Book> {
    // Spring Boot attend un Book complet avec la category entière
    const payload = {
      title: book.title,
      author: book.author,
      available: book.isAvailable,
      category: category
    };
    return this.http.put<Book>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}

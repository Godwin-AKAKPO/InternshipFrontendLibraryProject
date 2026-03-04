import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environement';

export interface Category {
  id: number;
  name: string;
  description: string;
  bookCount?: number; 
}            

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories` 

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]>{
    return this.http.get<Category[]>(this.apiUrl)
  }


  create(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }
} 
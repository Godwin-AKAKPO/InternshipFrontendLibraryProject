import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Category {
  id: number;
  name: string;
  description: string;
}              

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = 'http://localhost:8080/categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]>{
    return this.http.get<Category[]>(this.apiUrl)
  }

  // update(category: Category, id: number): Observable<Category>{

  //   const payload = 
  //   {
  //     name : category.name,
  //     description : category.description,
  //   };
    
  //   return this.http.put(`${this.apiUrl}/${id}`, payload)
  // }

  create(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }
}
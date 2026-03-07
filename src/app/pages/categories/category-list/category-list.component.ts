import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, CategoryService } from '../../../core/services/category.service';
@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800"> Catégories</h1>
          <p class="text-sm text-gray-500 mt-1">{{ categories.length }} catégorie(s)</p>
        </div>
        <button (click)="toggleForm()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-sm text-lg font-medium">Ajouter une catégorie</button>
      </div>
      <div *ngIf="showForm" class="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Nouvelle catégorie</h2>
        <div class="grid gap-4">
          <div><label class="block text-sm font-medium text-gray-600 mb-1">Nom</label>
            <input [(ngModel)]="newCategory.name" type="text" placeholder="Nom" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label class="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <textarea [(ngModel)]="newCategory.description" placeholder="Description" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"></textarea></div>
        </div>
        <div class="flex gap-3 mt-4">
          <button (click)="createCategory()" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Enregistrer</button>
          <button (click)="toggleForm()" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">Annuler</button>
        </div>
      </div>
      <div *ngIf="errorMsg" class="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg mb-4 text-sm">{{ errorMsg }}</div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let cat of categories" class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center  mb-2"><h1 class="font-semibold text-gray-800">{{ cat.name }}</h1></div>
          <p class="text-sm text-gray-500">{{ cat.description || 'Pas de description' }}</p>
          <p class="text-lg text-gray-400 mt-2 border-t border-gray-100">{{ cat.id }}</p>
        </div>
       </div>
    </div>
  `
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  showForm = false;
  errorMsg = '';
  newCategory: Omit<Category, 'id'> = { name: '', description: '' };

  constructor(private categoryService: CategoryService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadCategories(); }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: data => { this.categories = data; this.cdr.detectChanges(); },
      error: () => { this.errorMsg = 'Erreur de chargement'; this.cdr.detectChanges(); }
    });
  }

  toggleForm() { this.showForm = !this.showForm; this.newCategory = { name: '', description: '' }; }

  createCategory() {
    if (!this.newCategory.name) return;
    this.categoryService.create(this.newCategory).subscribe({ next: () => { this.loadCategories(); this.toggleForm(); } });
  }
}

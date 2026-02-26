import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../core/services/category.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  showCreateModal = false;

  successMsg = '';
  errorMsg = '';

  newCategory: Omit<Category, 'id'> = { name: '', description: '' };

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: data => {
        this.categories = data,
        this.cdr.detectChanges()
      },
      error: () => this.showError('Erreur lors du chargement des catégories.')
    });
  }

  openCreateModal() {
    this.newCategory = { name: '', description: '' };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  createCategory() {
    if (!this.newCategory.name) {
      this.showError('Le nom de la catégorie est obligatoire.');
      return;
    }
    this.categoryService.create(this.newCategory).subscribe({
      next: () => {
        this.closeCreateModal();
        this.loadCategories();
        this.showSuccess('Catégorie ajoutée avec succès.');
      },
      error: () => this.showError('Erreur lors de la création de la catégorie.')
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
}
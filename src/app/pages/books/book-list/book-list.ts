import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService, Book, BookDTO } from '../../../core/services/book.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  categories: Category[] = [];

  showCreateModal = false;
  showEditModal = false;

  successMsg = '';
  errorMsg = '';

  newBook: BookDTO = { title: '', author: '', categoryId: 0, isAvailable: true };
  editBook: BookDTO = { title: '', author: '', categoryId: 0, isAvailable: true };
  editBookId = 0;

  constructor(
    private bookService: BookService, 
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBooks();
    this.categoryService.getAll().subscribe(c => this.categories = c);
  }

  loadBooks() {
    this.bookService.getAll().subscribe({
      next: data => {
        this.books = data,
        this.cdr.detectChanges()
      },
      error: () => this.showError('Erreur lors du chargement des livres.')
    });
  }

  openCreateModal() {
    this.newBook = { title: '', author: '', categoryId: 0, isAvailable: true };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  createBook() {
    if (!this.newBook.title || !this.newBook.author || !this.newBook.categoryId) {
      this.showError('Veuillez remplir tous les champs.');
      return;
    }
    this.bookService.create(this.newBook).subscribe({
      next: () => {
        this.closeCreateModal();
        this.loadBooks();
        this.showSuccess('Livre ajouté avec succès.');
      },
      error: () => this.showError('Erreur lors de la création du livre.')
    });
  }

  openEditModal(book: Book) {
    this.editBookId = book.id;
    this.editBook = {
      title: book.title,
      author: book.author,
      categoryId: book.category?.id ?? 0,
      isAvailable: book.available
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  updateBook() {
    if (!this.editBook.title || !this.editBook.author || !this.editBook.categoryId) {
      this.showError('Veuillez remplir tous les champs.');
      return;
    }
    const category = this.categories.find(c => c.id === Number(this.editBook.categoryId));
    if (!category) { this.showError('Catégorie introuvable.'); return; }
    this.bookService.update(this.editBookId, this.editBook, category).subscribe({
      next: () => {
        this.closeEditModal();
        this.loadBooks();
        this.showSuccess('Livre modifié avec succès.');
      },
      error: () => this.showError('Erreur lors de la modification.')
    });
  }

  deleteBook(id: number) {
    if (!confirm('Supprimer ce livre ?')) return;
    this.bookService.delete(id).subscribe({
      next: () => {
        this.loadBooks();
        this.showSuccess('Livre supprimé.');
      },
      error: () => this.showError('Erreur lors de la suppression.')
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

  // Variables de pagination
currentPage: number = 1;
pageSize: number = 10;

// Getter pour obtenir les livres de la page courante
get paginatedBooks() {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.books.slice(start, start + this.pageSize);
}

// Getters pour les infos d'affichage
get totalPages() {
  return Math.ceil(this.books.length / this.pageSize) || 1;
}

getStartIndex() {
  return (this.currentPage - 1) * this.pageSize;
}

getEndIndex() {
  return Math.min(this.getStartIndex() + this.pageSize, this.books.length);
}

// Fonctions de navigation
prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}
}
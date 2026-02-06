import { Component, ViewChild } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar';
import { BlogComponent } from '../blog/blog';

@Component({
  selector: 'app-blog-home',
  standalone: true,
  imports: [SearchBarComponent, BlogComponent],
  template: `
    <div class="container mt-4">
      <div class="row align-items-end mb-4">
        <div class="col">
          <app-search-bar (name)="getName($event)"></app-search-bar>
        </div>
        <div class="col-auto pb-3">
          <button class="btn btn-primary" (click)="refreshPosts()">
            Odśwież posty
          </button>
        </div>
      </div>

      <app-blog [filterText]="filterText"></app-blog>
    </div>
  `
})
export class BlogHomeComponent {
  public filterText: string = '';

  @ViewChild(BlogComponent) blogComponent!: BlogComponent;

  getName(text: string): void {
    this.filterText = text;
  }

  refreshPosts(): void {
    if (this.blogComponent) {
      this.blogComponent.getAll();
    }
  }
}
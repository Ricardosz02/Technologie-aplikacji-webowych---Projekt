import { Component, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogItemImageComponent } from '../blog-item-image/blog-item-image';
import { BlogItemTextComponent } from '../blog-item-text/blog-item-text';
import { CommentsSectionComponent } from '../comments-section/comments-section';
import { FavoritesService } from '../../services/favorites';
import { LikesService } from '../../services/likes';
import { DataService } from '../../services/data';
import { RatingComponent } from '../rating/rating';

@Component({
  selector: 'blog-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BlogItemImageComponent,
    BlogItemTextComponent,
    CommentsSectionComponent,
    RatingComponent
  ],
  templateUrl: './blog-item.html',
  styleUrl: './blog-item.scss'
})
export class BlogItemComponent {
  @Input() image?: string;
  @Input() text?: string;
  @Input() title?: string;
  @Input() id?: string;
  @Input() likesCount: number = 0;
  @Input() views: number = 0;

  private favoritesService = inject(FavoritesService);
  private likesService = inject(LikesService);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  get isFavorite(): boolean {
    return this.id ? this.favoritesService.isFavorite(this.id) : false;
  }

  get isLiked(): boolean {
    return this.id ? this.likesService.isLiked(this.id) : false;
  }

  toggleFavorite() {
    if (this.id) {
      this.favoritesService.toggleFavorite(this.id);
      this.cdr.detectChanges();
    }
  }

  toggleLike() {
    if (!this.id) return;

    if (this.isLiked) {
      this.dataService.unlikePost(this.id).subscribe({
        next: (response) => {
          this.likesCount = response.likesCount;
          this.likesService.removeLike(this.id!);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error unliking post:', err)
      });
    } else {
      this.dataService.likePost(this.id).subscribe({
        next: (response) => {
          this.likesCount = response.likesCount;
          this.likesService.addLike(this.id!);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error liking post:', err)
      });
    }
  }
}
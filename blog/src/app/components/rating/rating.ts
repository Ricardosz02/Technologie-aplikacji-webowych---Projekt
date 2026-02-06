import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingService } from '../../services/rating';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.html',
  styleUrl: './rating.scss'
})
export class RatingComponent implements OnInit {
  @Input() postId: string = '';
  
  private ratingService = inject(RatingService);
  
  public stars: number[] = [1, 2, 3, 4, 5];
  public hoverRating: number = 0;
  public averageRating: number = 0;
  public votesCount: number = 0;

  ngOnInit() {
    this.refreshStats();
  }

  refreshStats() {
    if (this.postId) {
      const stats = this.ratingService.getPostStats(this.postId);
      this.averageRating = stats.average;
      this.votesCount = stats.count;
    }
  }

  onStarHover(rating: number): void {
    this.hoverRating = rating;
  }

  onStarLeave(): void {
    this.hoverRating = 0;
  }

  onStarClick(rating: number): void {
    if (this.postId) {
      this.ratingService.addRating(this.postId, rating);
      this.refreshStats();
    }
  }
  
  isStarFull(star: number): boolean {
    if (this.hoverRating > 0) {
      return star <= this.hoverRating;
    }
    return star <= Math.round(this.averageRating);
  }
}
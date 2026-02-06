import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly STORAGE_KEY = 'blog_ratings';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private getAllRatings(): Record<string, number[]> {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    }
    return {};
  }

  addRating(postId: string, rating: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const allRatings = this.getAllRatings();
    
    if (!allRatings[postId]) {
      allRatings[postId] = [];
    }
    
    allRatings[postId].push(rating);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allRatings));
  }

  getPostStats(postId: string): { average: number, count: number } {
    const allRatings = this.getAllRatings();
    const ratings = allRatings[postId] || [];
    
    if (ratings.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = ratings.reduce((a, b) => a + b, 0);
    return {
      average: sum / ratings.length,
      count: ratings.length
    };
  }
}
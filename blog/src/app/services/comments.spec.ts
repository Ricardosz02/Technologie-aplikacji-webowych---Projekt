import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private comments: Map<string, string[]> = new Map();

  constructor() { }

  getComments(postId: string): string[] {
    return this.comments.get(postId) || [];
  }

  addComment(postId: string, comment: string) {
    if (!this.comments.has(postId)) {
      this.comments.set(postId, []);
    }
    this.comments.get(postId)?.push(comment);
  }
}
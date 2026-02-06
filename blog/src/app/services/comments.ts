import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly STORAGE_KEY = 'blog_comments';

  constructor(@Inject(DOCUMENT) private document: Document) { }

  private getAllComments(): { [postId: string]: string[] } {
    const localStorage = this.document.defaultView?.localStorage;
    if (!localStorage) return {};

    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  private saveAllComments(comments: { [postId: string]: string[] }): void {
    const localStorage = this.document.defaultView?.localStorage;
    if (!localStorage) return;

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(comments));
  }

  getComments(postId: string): string[] {
    const allComments = this.getAllComments();
    return allComments[postId] || [];
  }

  addComment(postId: string, comment: string): void {
    const allComments = this.getAllComments();

    if (!allComments[postId]) {
      allComments[postId] = [];
    }

    allComments[postId].push(comment);
    this.saveAllComments(allComments);
  }
}
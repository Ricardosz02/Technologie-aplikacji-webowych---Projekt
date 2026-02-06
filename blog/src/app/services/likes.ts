import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class LikesService {
    private readonly STORAGE_KEY = 'blog_likes';

    constructor(@Inject(DOCUMENT) private document: Document) { }

    getLikedPosts(): string[] {
        const localStorage = this.document.defaultView?.localStorage;
        if (!localStorage) return [];

        const likes = localStorage.getItem(this.STORAGE_KEY);
        return likes ? JSON.parse(likes) : [];
    }

    isLiked(postId: string): boolean {
        const likedPosts = this.getLikedPosts();
        return likedPosts.includes(postId);
    }

    addLike(postId: string): void {
        const localStorage = this.document.defaultView?.localStorage;
        if (!localStorage) return;

        let likedPosts = this.getLikedPosts();
        if (!likedPosts.includes(postId)) {
            likedPosts.push(postId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(likedPosts));
        }
    }

    removeLike(postId: string): void {
        const localStorage = this.document.defaultView?.localStorage;
        if (!localStorage) return;

        let likedPosts = this.getLikedPosts();
        likedPosts = likedPosts.filter(id => id !== postId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(likedPosts));
    }
}
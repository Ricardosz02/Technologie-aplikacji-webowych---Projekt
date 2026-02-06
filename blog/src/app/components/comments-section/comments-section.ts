import { Component, Input, OnInit, inject, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../../services/data';
import { LinkifyPipe } from '../../pipes/linkify.pipe';

@Component({
  selector: 'app-comments-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LinkifyPipe],
  templateUrl: './comments-section.html',
  styleUrl: './comments-section.scss'
})
export class CommentsSectionComponent implements OnInit {
  @Input() postId: string = '';
  public commentsList: any[] = [];
  public currentUserId: string | null = null;
  public currentUserName: string = 'Użytkownik';

  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  commentForm = new FormGroup({
    text: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.refreshComments();
  }

  loadCurrentUser() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.currentUserId = userId;
        this.dataService.getUserById(userId).subscribe({
          next: (user) => {
            this.currentUserName = user.name || user.login || 'Użytkownik';
          },
          error: (err) => console.error('Błąd pobierania danych użytkownika:', err)
        });
      }
    }
  }

  refreshComments() {
    if (this.postId) {
      this.dataService.getComments(this.postId).subscribe({
        next: (res) => {
          this.commentsList = res;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Błąd pobierania komentarzy:', err)
      });
    }
  }

  add() {
    if (this.commentForm.invalid || !this.currentUserId) return;

    const commentData = {
      postId: this.postId,
      userId: this.currentUserId,
      text: this.commentForm.value.text,
      author: this.currentUserName
    };

    this.dataService.addComment(commentData).subscribe({
      next: () => {
        this.commentForm.get('text')?.reset();
        this.refreshComments();
      },
      error: (err) => {
        console.error('Błąd dodawania komentarza:', err);
      }
    });
  }

  remove(commentId: string) {
    if (confirm('Czy na pewno chcesz usunąć ten komentarz?')) {
      this.dataService.deleteComment(commentId, this.currentUserId!).subscribe({
        next: () => this.refreshComments(),
        error: (err) => {
          if (err.status === 403) {
            alert('Nie masz uprawnień do usunięcia tego komentarza');
          } else {
            console.error('Błąd usuwania komentarza:', err);
          }
        }
      });
    }
  }

  isCommentOwner(comment: any): boolean {
    const commentUserId = comment.userId?.toString() || comment.userId;
    const currentId = this.currentUserId?.toString();

    return commentUserId === currentId;
  }
}
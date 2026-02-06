import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = 'http://localhost:3000/api/posts';
  private commentUrl = 'http://localhost:3000/api/comments';

  constructor(private http: HttpClient) { }

  public getAll(filter: string = '', page: number = 1, limit: number = 5): Observable<any> {
    return this.http.get<any>(`${this.url}?filter=${encodeURIComponent(filter)}&page=${page}&limit=${limit}`);
  }

  public getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  public addPost(newPost: any): Observable<any> {
    return this.http.post(this.url, newPost);
  }

  public likePost(id: string, userId: string = '1'): Observable<any> {
    return this.http.post(`${this.url}/${id}/like`, { userId });
  }

  public unlikePost(id: string, userId: string = '1'): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { userId }
    };
    return this.http.delete(`${this.url}/${id}/like`, options);
  }

  public getComments(postId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${postId}/comments`);
  }

  public addComment(comment: any): Observable<any> {
    return this.http.post<any>(this.commentUrl, comment);
  }

  public deleteComment(id: string, userId: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { userId }
    };
    return this.http.delete<any>(`${this.commentUrl}/${id}`, options);
  }

  public getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/users/${userId}`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private url = 'http://localhost:3000/api/users';

    constructor(private http: HttpClient) { }

    getUserById(id: string): Observable<any> {
        return this.http.get<any>(`${this.url}/${id}`);
    }

    getUserPosts(id: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/${id}/posts`);
    }

    updateUser(id: string, userData: any): Observable<any> {
        return this.http.put<any>(`${this.url}/${id}`, userData);
    }
}
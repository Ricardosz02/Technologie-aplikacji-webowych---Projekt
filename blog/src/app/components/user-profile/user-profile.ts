import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth';
import { DataService } from '../../services/data';
import { BlogItemComponent } from '../blog-item/blog-item';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, BlogItemComponent],
    templateUrl: './user-profile.html',
    styleUrls: ['./user-profile.scss']
})
export class UserProfileComponent implements OnInit {
    user: any = null;
    userPosts: any[] = [];
    isEditMode = false;
    profileForm: FormGroup;
    loading = true;
    errorMessage = '';

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private dataService: DataService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef
    ) {
        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit(): void {
        this.loadUserProfile();
    }

    loadUserProfile(): void {
        const currentUser = this.authService.currentUser;
        if (!currentUser || !currentUser.userId) {
            this.errorMessage = 'Musisz być zalogowany, aby wyświetlić profil';
            this.loading = false;
            return;
        }

        this.userService.getUserById(currentUser.userId).subscribe({
            next: (userData) => {
                this.user = userData;
                this.profileForm.patchValue({
                    name: userData.name || '',
                    email: userData.email || ''
                });
                this.loadUserPosts(currentUser.userId);
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.errorMessage = 'Nie udało się załadować danych użytkownika';
                this.loading = false;
                this.cdr.detectChanges();
                console.error('Błąd ładowania profilu:', err);
            }
        });
    }

    loadUserPosts(userId: string): void {
        this.userService.getUserPosts(userId).subscribe({
            next: (posts) => {
                this.userPosts = posts;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Błąd ładowania postów:', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    toggleEditMode(): void {
        this.isEditMode = !this.isEditMode;
        if (!this.isEditMode) {
            this.profileForm.patchValue({
                name: this.user.name || '',
                email: this.user.email || ''
            });
        }
        this.cdr.detectChanges();
    }

    saveProfile(): void {
        if (this.profileForm.invalid) {
            return;
        }

        const currentUser = this.authService.currentUser;
        if (!currentUser || !currentUser.userId) {
            return;
        }

        const updatedData = this.profileForm.value;
        this.userService.updateUser(currentUser.userId, updatedData).subscribe({
            next: (updatedUser) => {
                this.user = { ...this.user, ...updatedUser };
                this.isEditMode = false;
                alert('Profil zaktualizowany pomyślnie!');
            },
            error: (err) => {
                console.error('Błąd aktualizacji profilu:', err);
                alert('Nie udało się zaktualizować profilu');
            }
        });
    }

    formatDate(date: string): string {
        if (!date) return 'Brak danych';
        return new Date(date).toLocaleDateString('pl-PL');
    }
}
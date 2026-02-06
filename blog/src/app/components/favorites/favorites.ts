import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data';
import { FavoritesService } from '../../services/favorites';
import { BlogItemComponent } from '../blog-item/blog-item';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, BlogItemComponent],
  templateUrl: './favorites.html'
})
export class FavoritesComponent implements OnInit {
  public favoriteItems: any[] = [];

  constructor(
    private dataService: DataService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.dataService.getAll().subscribe(response => {
        const favIds = this.favoritesService.getFavorites();
        this.favoriteItems = response.filter((item: any) => favIds.includes(item.id));
    });
  }
}
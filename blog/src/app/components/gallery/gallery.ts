import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class GalleryComponent implements OnInit {
  items: any[] = [];
  selectedImg: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getAll().subscribe(data => {
    this.items = data;
  });
  }

  zoom(img: string) {
    this.selectedImg = img;
  }

  close() {
    this.selectedImg = null;
  }
}
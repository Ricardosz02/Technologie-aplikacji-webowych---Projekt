import { Component, Input } from '@angular/core';

@Component({
  selector: 'blog-item-image',
  standalone: true,
  templateUrl: './blog-item-image.html',
  styleUrl: './blog-item-image.scss'
})
export class BlogItemImageComponent {
  @Input() image?: string;
}
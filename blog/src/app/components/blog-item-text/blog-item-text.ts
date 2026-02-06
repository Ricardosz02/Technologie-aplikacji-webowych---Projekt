import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SummaryPipe } from '../../pipes/summary-pipe';

@Component({
  selector: 'blog-item-text',
  standalone: true,
  imports: [RouterModule, SummaryPipe],
  templateUrl: './blog-item-text.html',
  styleUrl: './blog-item-text.scss'
})
export class BlogItemTextComponent {
  @Input() text?: string;
  @Input() id?: string;
}
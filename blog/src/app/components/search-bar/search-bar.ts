import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TextFormatDirective } from '../../directives/text-format';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, TextFormatDirective],
  template: `
    <div class="input-group mb-3">
      <span class="input-group-text">Szukaj</span>
      <input 
        type="text" 
        class="form-control" 
        placeholder="Wpisz frazę..."
        [(ngModel)]="filterText" 
        (ngModelChange)="sendFilter()"
        textFormat 
      >
    </div>
  `
})
export class SearchBarComponent implements OnInit {
  public filterText: string = '';
  @Output() name = new EventEmitter<string>();

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filterText = params['name'] || '';
      this.name.emit(this.filterText);
    });
  }

  sendFilter() {
  this.router.navigate(['/blog'], {
    queryParams: { name: this.filterText ? this.filterText.toLowerCase() : null }
  });
  this.name.emit(this.filterText);
}
}
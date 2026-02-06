import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService } from '../../services/data';
import { Location } from '@angular/common';

@Component({
  selector: 'app-blog-item-details',
  standalone: true,
  imports: [RouterModule],
  template: `
  @if (image) {
    <div class="container mt-5">
      <h1 class="mb-4">{{ title }}</h1> 
      <img [src]="image" class="img-fluid mb-3" alt="Blog image">
      <p class="lead">{{ text }}</p>
      <button (click)="goBack()" class="btn btn-secondary">Wróć</button>
    </div>
  }
`
})
export class BlogItemDetailsComponent implements OnInit {
  public image: string = '';
  public text: string = '';
  public title: string = '';

  private service = inject(DataService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private location = inject(Location);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.service.getById(id).subscribe((res: any) => {
          this.image = res.image;
          this.text = res.text;
          this.title = res.title;
          this.cdr.detectChanges();
        });
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
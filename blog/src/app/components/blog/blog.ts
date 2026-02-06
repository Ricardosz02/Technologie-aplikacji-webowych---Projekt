import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { DataService } from "../../services/data";
import { BlogItemComponent } from "../blog-item/blog-item";
import { CommonModule } from "@angular/common";
import { PaginationComponent } from "../pagination/pagination";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [BlogItemComponent, CommonModule, PaginationComponent],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})
export class BlogComponent implements OnInit, OnChanges {
  @Input() filterText: string = '';
  public items$: any[] = [];
  public totalItems: number = 0;

  public itemsPerPage = 5;
  public currentPage = 1;

  constructor(
    private service: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentPage = parseInt(params['page']) || 1;
      this.itemsPerPage = parseInt(params['limit']) || 5;
      this.getAll();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterText'] && !changes['filterText'].firstChange) {
      this.currentPage = 1;
      this.updateUrlAndFetch();
    }
  }

  getAll() {
    this.service.getAll(this.filterText, this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.items$ = response.posts;
        this.totalItems = response.totalPosts;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Błąd podczas pobierania postów:', err);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateUrlAndFetch();
    window.scrollTo(0, 0);
  }

  private updateUrlAndFetch(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage,
        limit: this.itemsPerPage
      },
      queryParamsHandling: 'merge'
    });
  }
}
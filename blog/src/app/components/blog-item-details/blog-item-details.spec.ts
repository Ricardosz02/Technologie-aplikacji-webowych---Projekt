import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogItemDetails } from './blog-item-details';

describe('BlogItemDetails', () => {
  let component: BlogItemDetails;
  let fixture: ComponentFixture<BlogItemDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogItemDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogItemDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

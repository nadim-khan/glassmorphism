import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  allProducts: any;

  constructor(private apiService: ApiService) {

  }

  ngOnInit() {
    this.apiService.getAllProducts().subscribe((res: any) => {
      this.allProducts = res;
    })

  }
}

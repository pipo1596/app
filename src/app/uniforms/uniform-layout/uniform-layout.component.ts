import { Component } from '@angular/core';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-uniform-layout',
  standalone: false,
  templateUrl: './uniform-layout.component.html',
  styleUrl: './uniform-layout.component.css'
})

export class UniformLayoutComponent {
constructor(public layout: LayoutService) {}
}

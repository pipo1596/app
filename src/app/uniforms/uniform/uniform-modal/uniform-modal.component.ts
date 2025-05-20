import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-uniform-modal',
  standalone: false,
  templateUrl: './uniform-modal.component.html',
  styleUrl: './uniform-modal.component.css'
})
export class UniformModalComponent {
  @Output() close = new EventEmitter<void>();
  closePopup() {
	  this.close.emit();
  }

}

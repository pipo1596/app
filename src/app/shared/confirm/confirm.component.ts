import { Component, EventEmitter, Input, Output } from '@angular/core';
import { closeModal, openModal } from '../utils';

@Component({
  selector: 'app-confirm',
  standalone: false,
  
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent {
  @Input() title : string | undefined;
  @Input() body : string | undefined;
  @Input() id : string | undefined;
  
  @Input('hideCancel') hideCancel : boolean|undefined = false;
  @Input('continueLabel') continueLabel : string|undefined = 'CONTINUE';
  @Output() notify = new EventEmitter();
  @Output() notifyCancel = new EventEmitter();


  close(){
    if(this.notifyCancel)
      this.notifyCancel.emit({ response : false });
    if(this.id) closeModal(this.id);
  }
  Proceed(){
    this.notify.emit({ response : true });
    if(this.id) closeModal(this.id);
  }
}

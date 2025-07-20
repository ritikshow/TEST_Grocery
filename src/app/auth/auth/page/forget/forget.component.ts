import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent {
  constructor(public activeModal: NgbActiveModal) {}

  closeModal(result?: any) {
    this.activeModal.close(result);
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dual-rules',
  templateUrl: './dual-rules.component.html',
  styleUrls: ['./dual-rules.component.css']
})
export class DualRulesComponent implements OnInit {

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  language: number = 0;

  constructor() { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));
  }

  changeLanguage(language: number) {
    this.language = language;
  }
  
  close() {
    this.onClose.emit();
  }
}

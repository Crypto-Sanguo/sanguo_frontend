import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-treasure-rules',
  templateUrl: './treasure-rules.component.html',
  styleUrls: ['./treasure-rules.component.css']
})
export class TreasureRulesComponent implements OnInit {

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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-price-box',
  templateUrl: './price-box.component.html',
  styleUrls: ['./price-box.component.css']
})
export class PriceBoxComponent implements OnInit {

  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onChoose: EventEmitter<any> = new EventEmitter();

  language: number = 0;

  constructor() { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));
  }

  changeLanguage(language: number) {
    this.language = language;
  }

  choose(value: number) {
    this.onChoose.emit({
      value: value
    });
  }

  close() {
    this.onClose.emit();
  }
}

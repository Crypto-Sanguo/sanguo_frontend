import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-gear-filter',
  templateUrl: './gear-filter.component.html',
  styleUrls: ['./gear-filter.component.css']
})
export class GearFilterComponent implements OnInit {

  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  sortBy: number = 0;
  filterBy: number = 0;

  language: number = 0;

  constructor() { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));
  }

  filter() {
    this.onFilter.emit({
      sortBy: this.sortBy,
      filterBy: this.filterBy
    });
  }

  close() {
    this.onClose.emit();
  }

  changeLanguage(language: number) {
    this.language = language;
  }
}

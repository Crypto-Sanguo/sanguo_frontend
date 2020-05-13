import { Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';

import { GateService } from '../gate.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard-message',
  templateUrl: './dashboard-message.component.html',
  styleUrls: ['./dashboard-message.component.css']
})
export class DashboardMessageComponent implements OnInit {

  @Input() titleCN: string;
  @Input() titleEN: string;
  @Input() urlCN: string;
  @Input() urlEN: string;

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  language: number = 0;

  bodyCN: string = "";
  bodyEN: string = "";

  constructor(private gateService: GateService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.gateService.loadUrl(this.urlCN).subscribe(body => {
      this.bodyCN = body;
    });

    this.gateService.loadUrl(this.urlEN).subscribe(body => {
      this.bodyEN = body;
    });
  }

  changeLanguage(language: number) {
    this.language = language;
  }

  close() {
    this.onClose.emit();
  }
}

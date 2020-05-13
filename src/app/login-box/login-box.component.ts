import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ContractService } from '../contract.service';

@Component({
  selector: 'app-login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.css']
})
export class LoginBoxComponent implements OnInit {

  @Input() profile: any;
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  waiting: boolean = false;

  referredBy: string = '';

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));
  }

  changeLanguage(language: number) {
    this.language = language;
  }

  getUrlVars() {
    var vars = {};
    var href: string = window["location"]["href"];
    var parts = href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value):string => {
      vars[key] = value;
      return value;
    });
    return vars;
  }

  getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
      urlparameter = this.getUrlVars()[parameter];
    }
    return urlparameter;
  }

  startGame() {
    this.waiting = true;
    const channel = this.getUrlParam('r', undefined) || 'sg';

    this.contractService.startGame(channel, this.referredBy).then(_ => {
      this.waiting = false;
      window['location'].reload();
    }, err => {
      this.waiting = false;
    });
  }

  close() {
    this.onClose.emit();
  }
}

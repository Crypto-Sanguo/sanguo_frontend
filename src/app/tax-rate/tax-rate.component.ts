import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
  
import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tax-rate',
  templateUrl: './tax-rate.component.html',
  styleUrls: ['./tax-rate.component.css']
})
export class TaxRateComponent implements OnInit {

  @Input() cityId: number;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @ViewChild('alertMessage') alertMessage;

  taxRate: number = 0;
  waiting: boolean = false;

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));
  }

  changeTaxRate() {
    this.waiting = true;

    this.contractService.setCityTax(this.cityId, this.taxRate).then(_ => {
      this.showAlert('设置成功', 'Changed successfully', '', '');
      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('no more change in 7 days') >= 0) {
        this.showAlert('7天内不可更改', 'No more change in 7 days',
            '', '');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
            err, err);
      }

      this.waiting = false;
    });
  }

  changeLanguage(language: number) {
    this.language = language;

    if (this.alertMessage) {
      this.alertMessage.changeLanguage(language);
    }
  }

  close() {
    this.onClose.emit();
  }

  showAlert(titleCN: string, titleEN: string, bodyCN: string, bodyEN: string) {
    this.alertTitleCN = titleCN;
    this.alertTitleEN = titleEN;
    this.alertBodyCN = bodyCN;
    this.alertBodyEN = bodyEN;
    this.willShowAlertMessage = true;
  }

  closeAlert() {
    this.willShowAlertMessage = false;
    this.onClose.emit();
  }
}

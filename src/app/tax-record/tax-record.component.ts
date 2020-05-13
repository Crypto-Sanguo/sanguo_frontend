import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { environment } from '../../environments/environment';

import { ContractService } from '../contract.service';

import { LandManager } from '../land-manager';


@Component({
  selector: 'app-tax-record',
  templateUrl: './tax-record.component.html',
  styleUrls: ['./tax-record.component.css']
})
export class TaxRecordComponent implements OnInit {

  @Input() cityId: number;
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  language: number = 0;

  landManager: any = null;

  taxRecords: Array<any> = [];

  waiting: boolean = false;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.landManager = new LandManager(this.contractService.myIOST);

    this.reload();
  }

  async reload() {
    this.waiting = true;
    this.taxRecords = await this.landManager.getTaxRecord(this.cityId);
    this.waiting = false;
  }

  close() {
    this.onClose.emit();
  }

  changeLanguage(language: number) {
    this.language = language;
  }
}

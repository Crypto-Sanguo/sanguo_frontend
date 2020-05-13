import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.css']
})
export class BottomBarComponent implements OnInit {

  @Input() walletReady: boolean;
  @Input() profile: any;
  @ViewChild('assetManagement') assetManagement;

  language: number = 0;

  showAssetManagement: boolean = false;

  constructor(private contractService: ContractService) {
  }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));
  }

  refresh() {
  }

  formatNumber(x: number) {
    if (x >= 10000000000) {
      return (x / 1000000000).toFixed(0) + ' B';
    } else if (x >= 1000000000) {
      return +(x / 1000000000).toFixed(1) + ' B';
    } else if (x >= 10000000) {
      return (x / 1000000).toFixed(0) + ' M';
    } else if (x >= 1000000) {
      return +(x / 1000000).toFixed(1) + ' M';
    } else if (x >= 10000) {
      return (x / 1000.0).toFixed(0) + ' K';
    } else if (x >= 1000) {
      return +(x / 1000.0).toFixed(1) + ' K';
    } else if (x > 10) {
      return +(x * 1).toFixed(1);
    } else if (x > 1) {
      return +(x * 1).toFixed(2);
    } else if (x > 0) {
      return +(x * 1).toFixed(2);
    } else {
      return '0';
    }
  }

  openAssetManagement() {
    if (!this.profile.walletReady) return;

    this.showAssetManagement = true;
  }

  onCloseAssetManagement() {
    this.showAssetManagement = false;
  }

  changeLanguage(language: number) {
    this.language = language;

    if (this.assetManagement) {
      this.assetManagement.changeLanguage(language);
    }
  }
}

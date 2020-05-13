import { Component, OnInit } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css']
})
export class ReferralComponent implements OnInit {

  gameUrl: string = environment.gameUrl;
  myName: string = "";

  tier1Bonus: number = 0;
  tier2Bonus: number = 0;
  tier3Bonus: number = 0;
  bonus: number = 0;

  language: number = 0;

  copied: boolean = false;

  page: number = 0;
  level: number = -1;
  teamByLevel = {};

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));
    
    this.goToLevel(0);
  }

  copyToClipboard() {
    const el = document.createElement('textarea');
    el.value = this.myName;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    this.copied = true;
    setTimeout(()=>{
      this.copied = false;
    }, 300);
  }

  goToLevel(level: number) {
    if (level == this.level) return;

    this.level = level;
    this.page = 0;
    this.loadTeam(level, 10, 0);
  }

  goToNext() {
    ++this.page;
    this.loadTeam(this.level, 10, this.page);
  }

  goToPrev() {
    if (this.page == 0) return;
    --this.page;
    this.loadTeam(this.level, 10, this.page);
  }

  goToFirst() {
    if (this.page == 0) return;
    this.page = 0;
    this.loadTeam(this.level, 10, this.page);
  }

  loadTeam(level: number, limit: number, page: number) {
    this.teamByLevel[level] = [];
  }

  changeLanguage(language: number) {
    this.language = language;
  }

  formatNumber(x: number) {
    if (x >= 10000000000) {
      return (x / 1000000000).toFixed(0) + ' B';
    } else if (x >= 1000000000) {
      return (x / 1000000000).toFixed(1) + ' B';
    } else if (x >= 10000000) {
      return (x / 1000000).toFixed(0) + ' M';
    } else if (x >= 1000000) {
      return (x / 1000000).toFixed(1) + ' M';
    } else if (x >= 10000) {
      return (x / 1000.0).toFixed(0) + ' K';
    } else if (x >= 1000) {
      return (x / 1000.0).toFixed(1) + ' K';
    } else if (x > 10) {
      return (x * 1).toFixed(0);
    } else if (x > 1) {
      return (x * 1).toFixed(1);
    } else if (x > 0) {
      return (x * 1).toFixed(2);
    } else {
      return '0';
    }
  }
}

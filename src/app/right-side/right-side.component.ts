import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-right-side',
  templateUrl: './right-side.component.html',
  styleUrls: ['./right-side.component.css']
})
export class RightSideComponent implements OnInit {

  @Input() profile: any;
  @ViewChild('land') land;
  @ViewChild('place') place;
  @ViewChild('market') market;
  @ViewChild('dailyTreasure') dailyTreasure;
  @ViewChild('referral') referral;
  @ViewChild('leaderboard') leaderboard;

  @Input() tabId: number;
  @Output() onSetTeams: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  setTeams($event) {
    this.onSetTeams.emit($event);
  }

  changeLanguage(language: number) {
    if (this.place) {
      this.place.changeLanguage(language);
    }

    if (this.market) {
      this.market.changeLanguage(language);
    }

    if (this.land) {
      this.land.changeLanguage(language);
    }

    if (this.dailyTreasure) {
      this.dailyTreasure.changeLanguage(language);
    }

    if (this.referral) {
      this.referral.changeLanguage(language);
    }

    if (this.leaderboard) {
      this.leaderboard.changeLanguage(language);
    }
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  @Input() profile: any;
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  language: number = 0;

  notifications: Array<any> = [];

  constructor() { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.notifications = this.profile.notifications.map(n => {
      const d = new Date(n[0] * 1000);
      const timeText = d.getFullYear() + '-' + this._addZero(d.getMonth() + 1) +
          '-' + this._addZero(d.getDate()) +
          ' ' + this._addZero(d.getHours()) + ':' +
          this._addZero(d.getMinutes()) + ':' + this._addZero(d.getSeconds());

      if (n[1] == 0) {
        return {
          bodyCN: '您的<span class="sanguo">' + environment.unitData[n[2]].nameCN + '</span>成功卖出, 获得 <span class="gold">' + n[3] + ' <i class="icon-iost"></i></span>',
          bodyEN: 'Sold <span class="sanguo">' + environment.unitData[n[2]].nameEN + '</span>, and received <span class="gold">' + n[3] + ' <i class="icon-iost"></i></span>',
          timeText: timeText
        };
      } else if (n[1] == 1) {
        return {
          bodyCN: '您的<span class="sanguo">' + environment.itemData[n[2]].nameCN + '</span>成功卖出, 获得 <span class="gold">' + n[3] + ' <i class="icon-iost"></i></span>',
          bodyEN: 'Sold <span class="sanguo">' + environment.itemData[n[2]].nameEN + '</span>, and received <span class="gold">' + n[3] + ' <i class="icon-iost"></i></span>',
          timeText: timeText
        };
      } else if (n[1] == 2) {
        return {
          bodyCN: '您的<span class="sanguo">土地#' + n[2] + '</span>成功卖出, 获得 <span class="gold">' + n[3] + ' <i class="icon-iost"></i></span>',
          bodyEN: 'Sold <span class="sanguo">Land ' + n[2] + '</span>, and received <span class="gold">' + n[3] + ' <i class="icon-iost"></i></span>',
          timeText: timeText
        };
      } else if (n[1] == 3) {
        return {
          bodyCN: '您的<span class="sanguo">土地#' + n[2] + '</span>成功出租, 获得 <span class="gold">' + n[3] + ' <i class="icon-iost"></i></span>',
          bodyEN: 'Rented out <span class="sanguo">Land ' + n[2] + '</span>, and received <span class="gold">' + n[3] + ' <i class="icon-iost"></i></span>',
          timeText: timeText
        };
      }
    });
  }

  _addZero(n: number) {
    if (n <= 9) {
      return '0' + n.toString();
    } else {
      return n.toString();
    }
  }

  close() {
    this.onClose.emit();
  }

  changeLanguage(language: number) {
    this.language = language;
  }
}

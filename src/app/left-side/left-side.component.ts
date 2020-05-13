import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-left-side',
  templateUrl: './left-side.component.html',
  styleUrls: ['./left-side.component.css']
})
export class LeftSideComponent implements OnInit {

  @Output() onRefreshBottomBar: EventEmitter<any> = new EventEmitter();
  @Output() onTopBarGotoTab: EventEmitter<any> = new EventEmitter();

  @ViewChild('gear') gear;
  @ViewChild('profile') profile;

  showIndex: number = 0;

  constructor() { }

  ngOnInit() {
  }

  show(index: any) {
    this.showIndex = index * 1;
  }

  topBarGotoTab($event: any) {
    this.onTopBarGotoTab.emit({tabId: $event.tabId});
  }

  refresh() {
    if (this.showIndex == 0) {
      this.profile.refreshAll();
    } else if (this.showIndex == 1) {
      this.gear.refreshAllItems();
    }
  }

  refreshBottomBar($event: any) {
    this.onRefreshBottomBar.emit();
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ContractService } from '../contract.service';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.css']
})
export class StartGameComponent implements OnInit {

  @Output() onStart: EventEmitter<any> = new EventEmitter();

  constructor(private contractService: ContractService) { }

  ngOnInit() {
  }

  startGame() {
    if (!this.contractService.getUserAddress()) {
      alert("请先安装并登录TronLink钱包");
      return;
    }

    this.onStart.emit();
  }
}

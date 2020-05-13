import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { LeftSideComponent } from './left-side/left-side.component';
import { RightSideComponent } from './right-side/right-side.component';
import { BottomBarComponent } from './bottom-bar/bottom-bar.component';
import { PlaceComponent } from './place/place.component';
import { PlayerProfileComponent } from './player-profile/player-profile.component';
import { ConversationComponent } from './conversation/conversation.component';
import { PlayerGearComponent } from './player-gear/player-gear.component';
import { PlayerGearSelectionComponent } from './player-gear-selection/player-gear-selection.component';
import { MarketComponent } from './market/market.component';
import { BattleComponent } from './battle/battle.component';
import { StartGameComponent } from './start-game/start-game.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ReferralComponent } from './referral/referral.component';
import { DualComponent } from './dual/dual.component';
import { DailyTreasureComponent } from './daily-treasure/daily-treasure.component';
import { PlayerTeamComponent } from './player-team/player-team.component';
import { TeamSelectionComponent } from './team-selection/team-selection.component';
import { MarketSellUnitComponent } from './market-sell-unit/market-sell-unit.component';
import { GearRecycleComponent } from './gear-recycle/gear-recycle.component';
import { TreasureRulesComponent } from './treasure-rules/treasure-rules.component';
import { DualRulesComponent } from './dual-rules/dual-rules.component';
import { TreasureDividendOneComponent } from './treasure-dividend-one/treasure-dividend-one.component';
import { TreasureDividendTwoComponent } from './treasure-dividend-two/treasure-dividend-two.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlayerFillEnergyComponent } from './player-fill-energy/player-fill-energy.component';
import { GearSynthesiseComponent } from './gear-synthesise/gear-synthesise.component';
import { MarketInfoComponent } from './market-info/market-info.component';
import { PlayerRecycleComponent } from './player-recycle/player-recycle.component';
import { DashboardMessageComponent } from './dashboard-message/dashboard-message.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { MarketSellItemComponent } from './market-sell-item/market-sell-item.component';
import { LoadingBoxComponent } from './loading-box/loading-box.component';
import { LoginBoxComponent } from './login-box/login-box.component';
import { AssetManagementComponent } from './asset-management/asset-management.component';
import { WechatBoxComponent } from './wechat-box/wechat-box.component';
import { NotificationComponent } from './notification/notification.component';
import { EpicComponent } from './epic/epic.component';
import { MarketItemInfoComponent } from './market-item-info/market-item-info.component';
import { MarketFilterComponent } from './market-filter/market-filter.component';
import { GearUpgradeComponent } from './gear-upgrade/gear-upgrade.component';
import { GearFilterComponent } from './gear-filter/gear-filter.component';
import { GearMountComponent } from './gear-mount/gear-mount.component';
import { ReferralProgramComponent } from './referral-program/referral-program.component';
import { TreasureDividendThreeComponent } from './treasure-dividend-three/treasure-dividend-three.component';
import { GearCooldownComponent } from './gear-cooldown/gear-cooldown.component';
import { GearInfoComponent } from './gear-info/gear-info.component';
import { GearSellComponent } from './gear-sell/gear-sell.component';
import { MarketBuyItemComponent } from './market-buy-item/market-buy-item.component';
import { LandComponent } from './land/land.component';
import { CreateCityComponent } from './create-city/create-city.component';
import { LandLandComponent } from './land-land/land-land.component';
import { LandRentComponent } from './land-rent/land-rent.component';
import { LandSellComponent } from './land-sell/land-sell.component';
import { ChangeCityComponent } from './change-city/change-city.component';
import { BattleRecordComponent } from './battle-record/battle-record.component';
import { TreasureDividendFourComponent } from './treasure-dividend-four/treasure-dividend-four.component';
import { PriceBoxComponent } from './price-box/price-box.component';
import { TaxRateComponent } from './tax-rate/tax-rate.component';
import { TaxRecordComponent } from './tax-record/tax-record.component';
import { XmasLotteryComponent } from './xmas-lottery/xmas-lottery.component';
import { TournamentComponent } from './tournament/tournament.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    LeftSideComponent,
    RightSideComponent,
    BottomBarComponent,
    PlaceComponent,
    ConversationComponent,
    PlayerProfileComponent,
    PlayerGearComponent,
    PlayerGearSelectionComponent,
    MarketComponent,
    BattleComponent,
    StartGameComponent,
    LeaderboardComponent,
    ReferralComponent,
    DualComponent,
    DailyTreasureComponent,
    PlayerTeamComponent,
    TeamSelectionComponent,
    MarketSellUnitComponent,
    GearRecycleComponent,
    TreasureRulesComponent,
    DualRulesComponent,
    TreasureDividendOneComponent,
    TreasureDividendTwoComponent,
    DashboardComponent,
    PlayerFillEnergyComponent,
    GearSynthesiseComponent,
    MarketInfoComponent,
    PlayerRecycleComponent,
    DashboardMessageComponent,
    AlertMessageComponent,
    MarketSellItemComponent,
    LoadingBoxComponent,
    LoginBoxComponent,
    AssetManagementComponent,
    WechatBoxComponent,
    NotificationComponent,
    EpicComponent,
    MarketItemInfoComponent,
    MarketFilterComponent,
    GearUpgradeComponent,
    GearFilterComponent,
    GearMountComponent,
    ReferralProgramComponent,
    TreasureDividendThreeComponent,
    GearCooldownComponent,
    GearInfoComponent,
    GearSellComponent,
    MarketBuyItemComponent,
    LandComponent,
    CreateCityComponent,
    LandLandComponent,
    LandRentComponent,
    LandSellComponent,
    ChangeCityComponent,
    BattleRecordComponent,
    TreasureDividendFourComponent,
    PriceBoxComponent,
    TaxRateComponent,
    TaxRecordComponent,
    XmasLotteryComponent,
    TournamentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

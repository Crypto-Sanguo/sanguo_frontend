// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  stageManager: "Contract83WAEpQtgoUpS3K6k846oChU1Q3mnSRWHUyDdqRCQmr3",
  account: "Contract65e7ZvJpbDKpePQg88PRG8iKreP9vYkxqwGajqf9EE2Q",
  battle: "Contract5Fm3fumyyd6qJNtMJ87M3F4JH5qmxBsstwTG5tg2PFCn",
  unitManager: "ContractBztX8DoQLZxjtkUF4swjLPLPRXYhg4QSDSwkeAcZhKsX",
  itemManager: "ContractDZ7XmhrhDzFpj6jvZxNJpfoG8sWbWP8wBCx1X7a3uPCq",
  treasureManager: "Contract3a5jpKWhY1m3gsHGfcqfTpEJjPjxWKfDJRLsXDVVNvja",
  rankManager: "ContractEATaSmrrarzHpChZNtS87s5PwtjR3MzwYdWRHP8zp49H",
  lotteryManager: "Contract6X3dqZMUSxVMDaH3cUAYCviTdXdE89hTDmTMUAuBeHWL",
  notificationManager: "ContractCdEmmrmaXd7NpmQwESFZ82pMBUPnZBG538mHSXwxqhLm",
  epicManager: "ContractPEuLJ5ewzfUvmSLLFRMeSzto6VFDedFyhorGGAqYbye",
  tournamentManager: "Contract7UQKvDbtteNNYEgRa1R9YkRCK9yWZ3XMtY3gpfPxjqZ6",
  landManager: "ContractEaZuHUF1uQjTgSNeC3avwt7hqzynMWzs8DAq3MTpFTYd",
  symbol: "sgt",
  stageIdArray: [1, 2, 3, 4, 5],
  stageData: [{
    nameCN: '黄巾之乱',
    nameEN: 'Yellow Turban Rebellion',
    imagePath: '/assets/images/stages/huangjin.jpg',
    places: [
      {
        nameCN: '大兴山',
        nameEN: 'Daxing Shan',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '黄巾贼',
            npcNameEN: 'Yellow Turban Soldier',
            npcImagePath: '/assets/images/npcs/huangjinzei.jpg',
            npcTextCN: '从未见过有官兵们敢来！小的们，送官兵们归西！',
            npcTextEN: 'I have never seen any people dare to come! Lets send these fools to the death!'
          }],
          afterWords: [{
            npcNameCN: '黄巾贼',
            npcNameEN: 'Yellow Turban Soldier',
            npcImagePath: '/assets/images/npcs/huangjinzei.jpg',
            npcTextCN: '不行，得回去告诉大哥！快撤！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '程远志',
            npcNameEN: 'Cheng Zhi Yuan',
            npcImagePath: '/assets/images/npcs/chengzhiyuan.jpg',
            npcTextCN: '死神附体犹不知，地狱无门偏要闯！就让我为尔等打开黄泉之门吧。',
            npcTextEN: 'Looks like you want to go to hell?'
          }],
          afterWords: [{
            npcNameCN: '程远志',
            npcNameEN: 'Cheng Zhi Yuan',
            npcImagePath: '/assets/images/npcs/chengzhiyuan.jpg',
            npcTextCN: '快逃，从未见过如此强的人。',
            npcTextEN: 'You are way stronger than I expected!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
      {
        nameCN: '铁门峡',
        nameEN: 'Tiemen Xia',
        imagePath: '/assets/images/places/tiemenxia.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '黄巾贼',
            npcNameEN: 'Yellow Turban Soldier',
            npcImagePath: '/assets/images/npcs/huangjinzei.jpg',
            npcTextCN: '从未见过有官兵们敢来！小的们，送官兵们归西！',
            npcTextEN: 'I have never seen any people dare to come! Lets send these fools to the death!'
          }],
          afterWords: [{
            npcNameCN: '黄巾贼',
            npcNameEN: 'Yellow Turban Soldier',
            npcImagePath: '/assets/images/npcs/huangjinzei.jpg',
            npcTextCN: '不行，得回去告诉大哥！快撤！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '张梁',
            npcNameEN: 'Zhang Liang',
            npcImagePath: '/assets/images/npcs/zhangliang.jpg',
            npcTextCN: '小贼胆敢闯入此地，看尔等送你归西！',
            npcTextEN: 'How dare you guys enter our terretory, just wait for your death!'
          }],
          afterWords: [{
            npcNameCN: '张梁',
            npcNameEN: 'Zhang Liang',
            npcImagePath: '/assets/images/npcs/zhangliang.jpg',
            npcTextCN: '此人非等闲之辈，赶紧撤退！',
            npcTextEN: 'You are not an ordinary commander!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
      {
        nameCN: '青州',
        nameEN: 'Qingzhou',
        imagePath: '/assets/images/places/qingzhou.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '赵弘',
            npcNameEN: 'Zhao Hong',
            npcImagePath: '/assets/images/npcs/zhaohong.jpg',
            npcTextCN: '从未见过有官兵们敢来！小的们，送官兵们归西！',
            npcTextEN: 'I have never seen any people dare to come! Lets send these fools to the death!'
          }],
          afterWords: [{
            npcNameCN: '赵弘',
            npcNameEN: 'Zhao Hong',
            npcImagePath: '/assets/images/npcs/zhaohong.jpg',
            npcTextCN: '不行，得回去告诉大哥！快撤！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '张宝',
            npcNameEN: 'Zhang Bao',
            npcImagePath: '/assets/images/npcs/zhangbao.jpg',
            npcTextCN: '终于到这儿来了嘛？吾弟等不可与吾并论！让尔等尝尝我的厉害！',
            npcTextEN: 'You are finally here, lets see if I am stronger than my little brothers.'
          }],
          afterWords: [{
            npcNameCN: '张宝',
            npcNameEN: 'Zhang Bao',
            npcImagePath: '/assets/images/npcs/zhangbao.jpg',
            npcTextCN: '未曾料到尔等如此之强。。。敌不过，快逃！',
            npcTextEN: 'I can\'t take you by myself, need more reinforcement from brothers',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
      {
        nameCN: '徐州',
        nameEN: 'Xuzhou',
        imagePath: '/assets/images/places/xuzhou.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '邓茂',
            npcNameEN: 'Deng Mao',
            npcImagePath: '/assets/images/npcs/dengmao.jpg',
            npcTextCN: '从未见过有官兵们敢来！小的们，送官兵们归西！',
            npcTextEN: 'I have never seen any people dare to come! Lets send these fools to the death!'
          }],
          afterWords: [{
            npcNameCN: '邓茂',
            npcNameEN: 'Deng Mao',
            npcImagePath: '/assets/images/npcs/dengmao.jpg',
            npcTextCN: '不行，得回去告诉大哥！快撤！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '张角',
            npcNameEN: 'Zhang Jiao',
            npcImagePath: '/assets/images/npcs/zhangjiao.jpg',
            npcTextCN: '什么？！敌军已经到这儿来了么？为了黄天之世，就让尔等去死吧！',
            npcTextEN: 'What？！Enemy has already come here？For the sake of Yellow Turban, accept your death!'
          }],
          afterWords: [{
            npcNameCN: '张角',
            npcNameEN: 'Zhang Jiao',
            npcImagePath: '/assets/images/npcs/zhangjiao.jpg',
            npcTextCN: '没想到尔等黄巾之势，却只能止步于此。。',
            npcTextEN: 'I did\'t expect our Yellow Turban will end here today...',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      }
    ]
  },
  {
    nameCN: '讨伐董卓',
    nameEN: 'War Against Dong Zhuo',
    imagePath: '/assets/images/stages/dongzhuo.jpg',
    places: [
      {
        nameCN: '汜水关',
        nameEN: 'Sishui Guan',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '汉朝普通士兵',
            npcNameEN: 'Han soldier',
            npcImagePath: '/assets/images/npcs/hanbing.jpg',
            npcTextCN: '从未见过有官兵们敢来！小的们，送官兵们归西！',
            npcTextEN: 'I have never seen any people dare to come! Lets send these fools to the death!'
          }],
          afterWords: [{
            npcNameCN: '汉朝普通士兵',
            npcNameEN: 'Han soldier',
            npcImagePath: '/assets/images/npcs/hanbing.jpg',
            npcTextCN: '不行，得回去告诉大哥！快撤！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '华雄',
            npcNameEN: 'Hua Xiong',
            npcImagePath: '/assets/images/npcs/huaxiong.jpg',
            npcTextCN: '愚蠢之辈，敢于董太师为敌。我华雄定将尔等杀个片甲不留！',
            npcTextEN: 'Stupid fools, how dare to be an enemy of Dong Taishi?'
          }],
          afterWords: [{
            npcNameCN: '华雄',
            npcNameEN: 'Hua Xiong',
            npcImagePath: '/assets/images/npcs/huaxiong.jpg',
            npcTextCN: '尔等非等贤之辈，快撤！',
            npcTextEN: 'Retreat, we are no match with them.',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
      {
        nameCN: '虎牢关',
        nameEN: 'Hulao Guan',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '汉朝普通士兵',
            npcNameEN: 'Han soldier',
            npcImagePath: '/assets/images/npcs/hanbing.jpg',
            npcTextCN: '联军来了吗！这就送尔等见阎王！',
            npcTextEN: 'The opponent troops has come? Lets send them to the hell!'
          }],
          afterWords: [{
            npcNameCN: '汉朝普通士兵',
            npcNameEN: 'Han soldier',
            npcImagePath: '/assets/images/npcs/hanbing.jpg',
            npcTextCN: '不行，得回去告诉大哥！快撤！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '吕布',
            npcNameEN: 'Lv Bu',
            npcImagePath: '/assets/images/npcs/lvbu.jpg',
            npcTextCN: '我乃吕布！非华雄之辈可比。尔等小辈，何足挂齿！不怕死的尽管来！',
            npcTextEN: 'Hahahaha, there is no word of defeat in my dictionary.'
          }],
          afterWords: [{
            npcNameCN: '吕布',
            npcNameEN: 'Lv Bu',
            npcImagePath: '/assets/images/npcs/lvbu.jpg',
            npcTextCN: '我吕布天下无敌！怎么可能。。',
            npcTextEN: 'I was the top fighter but now...',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
      {
        nameCN: '洛阳',
        nameEN: 'Luoyang',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 3,
        battles: [{
          preWords: [{
            npcNameCN: '李傕',
            npcNameEN: 'Li Jue',
            npcImagePath: '/assets/images/npcs/lijue.jpg',
            npcTextCN: '由我李傕做尔等的对手！',
            npcTextEN: 'Let me Li Jue be your opponent!'
          }],
          afterWords: [{
            npcNameCN: '李傕',
            npcNameEN: 'Li Jue',
            npcImagePath: '/assets/images/npcs/lijue.jpg',
            npcTextCN: '从未见过如此厉害之人。',
            npcTextEN: 'Have not see a good fighter like you for a while',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '郭汜',
            npcNameEN: 'Guo Si',
            npcImagePath: '/assets/images/npcs/guosi.jpg',
            npcTextCN: '联军如此纠缠不清，看我一口气收拾尔等！',
            npcTextEN: 'Just wait for me to wipe you guys at once!'
          }],
          afterWords: [{
            npcNameCN: '郭汜',
            npcNameEN: 'Guo Si',
            npcImagePath: '/assets/images/npcs/guosi.jpg',
            npcTextCN: '没想到我等却只能止步于此。',
            npcTextEN: 'Never realize I will be stopped by you guys..',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '贾诩',
            npcNameEN: 'Jia Xu',
            npcImagePath: '/assets/images/npcs/jiaxu.jpg',
            npcTextCN: '就凭这点儿兵力就想攻下洛阳？可笑至极！',
            npcTextEN: 'You want to conquer Luoyong with these poor troops? Dont make me laugh!'
          }],
          afterWords: [{
            npcNameCN: '贾诩',
            npcNameEN: 'Jia Xu',
            npcImagePath: '/assets/images/npcs/jiaxu.jpg',
            npcTextCN: '全军退回长安，重整旗鼓！',
            npcTextEN: 'All troops back to chang\'an, lets reorganize our formation.',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
      {
        nameCN: '长安',
        nameEN: 'Chang\'an',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '汉朝普通士兵',
            npcNameEN: 'Han soldier',
            npcImagePath: '/assets/images/npcs/hanbing.jpg',
            npcTextCN: '联军来了吗！这就送尔等见阎王！',
            npcTextEN: 'The opponent troops has come? Lets send them to the hell!'
          }],
          afterWords: [{
            npcNameCN: '汉朝普通士兵',
            npcNameEN: 'Han soldier',
            npcImagePath: '/assets/images/npcs/hanbing.jpg',
            npcTextCN: '不行，得回去告诉大哥！快撤！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '董卓',
            npcNameEN: 'Dong Zhuo',
            npcImagePath: '/assets/images/npcs/dongzhuo.jpg',
            npcTextCN: '敢于我和我儿奉先为敌！',
            npcTextEN: 'How dare you can challenge me and my son?'
          }],
          afterWords: [{
            npcNameCN: '董卓',
            npcNameEN: 'Dong Zhuo',
            npcImagePath: '/assets/images/npcs/dongzhuo.jpg',
            npcTextCN: '不，不可能。。',
            npcTextEN: 'No.. Impossible!!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
    ]
  },
  {
    nameCN: '官渡之战',
    nameEN: 'Battle of Guandu',
    imagePath: '/assets/images/stages/guandu.jpg',
    places: [
      {
        nameCN: '黎阳',
        nameEN: 'Li Yang',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '袁军普通士兵',
            npcNameEN: 'Yuan Soldier',
            npcImagePath: '/assets/images/heroes/yuanshaojun.jpg',
            npcTextCN: '我们的任务是保护主公！',
            npcTextEN: 'Our mission is to protect our lord!'
          }],
          afterWords: [{
            npcNameCN: '袁军普通士兵',
            npcNameEN: 'Yuan Soldier',
            npcImagePath: '/assets/images/heroes/yuanshaojun.jpg',
            npcTextCN: '呜呜呜，大哥饶命。。。',
            npcTextEN: 'I beg you not killing me...',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '田丰',
            npcNameEN: 'Tian Feng',
            npcImagePath: '/assets/images/heroes/tianfeng.jpg',
            npcTextCN: '识时务者为俊杰，将军何不加入我军？',
            npcTextEN: 'In stead of fighting, you wanna join us?'
          }],
          afterWords: [{
            npcNameCN: '田丰',
            npcNameEN: 'Tian Feng',
            npcImagePath: '/assets/images/heroes/tianfeng.jpg',
            npcTextCN: '尔等非等贤之辈，快撤！',
            npcTextEN: 'Retreat, we are no match with them.',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
      {
        nameCN: '白马',
        nameEN: 'Hulao Guan',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '袁军普通士兵',
            npcNameEN: 'Yuan Soldier',
            npcImagePath: '/assets/images/heroes/yuanshaojun.jpg',
            npcTextCN: '我们的任务是保护主公！',
            npcTextEN: 'Our mission is to protect our lord!'
          }],
          afterWords: [{
            npcNameCN: '袁军普通士兵',
            npcNameEN: 'Yuan Soldier',
            npcImagePath: '/assets/images/heroes/yuanshaojun.jpg',
            npcTextCN: '呜呜呜，大哥饶命。。。',
            npcTextEN: 'I beg you not killing me...',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '颜良',
            npcNameEN: 'Yan Liang',
            npcImagePath: '/assets/images/heroes/yanliang.jpg',
            npcTextCN: '我乃颜良! 尔等小辈，何足挂齿！不怕死的尽管来！',
            npcTextEN: 'Hahahaha, there is no word of defeat in my dictionary.'
          }],
          afterWords: [{
            npcNameCN: '颜良',
            npcNameEN: 'Yan Liang',
            npcImagePath: '/assets/images/heroes/yanliang.jpg',
            npcTextCN: '我被杀了吗。。',
            npcTextEN: 'I am killed...',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
      {
        nameCN: '官渡',
        nameEN: 'Luoyang',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '袁军普通士兵',
            npcNameEN: 'Yuan Soldier',
            npcImagePath: '/assets/images/heroes/yuanshaojun.jpg',
            npcTextCN: '我们的任务是保护主公！',
            npcTextEN: 'Our mission is to protect our lord!'
          }],
          afterWords: [{
            npcNameCN: '袁军普通士兵',
            npcNameEN: 'Yuan Soldier',
            npcImagePath: '/assets/images/heroes/yuanshaojun.jpg',
            npcTextCN: '呜呜呜，大哥饶命。。。',
            npcTextEN: 'I beg you not killing me...',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '文丑',
            npcNameEN: 'Wen Chou',
            npcImagePath: '/assets/images/heroes/wenchou.jpg',
            npcTextCN: '无名小辈，胆敢与我军为敌？',
            npcTextEN: 'Who the hell you think you are?'
          }],
          afterWords: [{
            npcNameCN: '文丑',
            npcNameEN: 'Wen Chou',
            npcImagePath: '/assets/images/heroes/wenchou.jpg',
            npcTextCN: '没想到我等却只能止步于此。',
            npcTextEN: 'Never realize I will be stopped by you guys..',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
      {
        nameCN: '乌巢',
        nameEN: 'Chang\'an',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '淳于琼',
            npcNameEN: 'Chunyu Qiong',
            npcImagePath: '/assets/images/heroes/chunyuqiong.jpg',
            npcTextCN: '我乃大将军淳于琼，不怕死的就上！',
            npcTextEN: 'The opponent troops has come? Lets send them to the hell!'
          }],
          afterWords: [{
            npcNameCN: '淳于琼',
            npcNameEN: 'Chunyu Qiong',
            npcImagePath: '/assets/images/heroes/chunyuqiong.jpg',
            npcTextCN: '撤退！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '袁绍',
            npcNameEN: 'Yuan Shao',
            npcImagePath: '/assets/images/heroes/yuanshao.jpg',
            npcTextCN: '我军兵多将广，不要鸡蛋碰石头！',
            npcTextEN: 'How dare you can challenge me? I have so many soldiers'
          }],
          afterWords: [{
            npcNameCN: '袁绍',
            npcNameEN: 'Yuan Shao',
            npcImagePath: '/assets/images/heroes/yuanshao.jpg',
            npcTextCN: '不，不可能。。',
            npcTextEN: 'No.. Impossible!!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      }
    ]
  },
  {
    nameCN: '血战荆州',
    nameEN: 'Battle of Jingzhou',
    imagePath: '/assets/images/stages/jingzhou.jpg',
    places: [
      {
        nameCN: '樊城',
        nameEN: 'Fancheng',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '曹仁',
            npcNameEN: 'Cao Ren',
            npcImagePath: '/assets/images/heroes/caoren.jpg',
            npcTextCN: '无名小辈，报上名来！',
            npcTextEN: 'What\'s your name?'
          }],
          afterWords: [{
            npcNameCN: '曹仁',
            npcNameEN: 'Cao Ren',
            npcImagePath: '/assets/images/heroes/caoren.jpg',
            npcTextCN: '可恶。',
            npcTextEN: 'Fuxx...',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '李典',
            npcNameEN: 'Li Dian',
            npcImagePath: '/assets/images/heroes/lidian.jpg',
            npcTextCN: '识时务者为俊杰，将军何不加入我军？',
            npcTextEN: 'In stead of fighting, you wanna join us?'
          }],
          afterWords: [{
            npcNameCN: '李典',
            npcNameEN: 'lidian',
            npcImagePath: '/assets/images/heroes/lidian.jpg',
            npcTextCN: '尔等非等贤之辈，快撤！',
            npcTextEN: 'Retreat, we are no match with them.',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
      {
        nameCN: '博望坡',
        nameEN: 'Bowang Po',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '乐进',
            npcNameEN: 'Le Jin',
            npcImagePath: '/assets/images/heroes/lejin.jpg',
            npcTextCN: '终于轮到我登场了！',
            npcTextEN: 'Now it\'s my show time!'
          }],
          afterWords: [{
            npcNameCN: '乐进',
            npcNameEN: 'Le Jin',
            npcImagePath: '/assets/images/heroes/lejin.jpg',
            npcTextCN: '呜呜呜，大哥饶命。。。',
            npcTextEN: 'I beg you not killing me...',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '夏侯渊',
            npcNameEN: 'Xiahou Yuan',
            npcImagePath: '/assets/images/heroes/xiahouyuan.jpg',
            npcTextCN: '我乃夏侯渊！',
            npcTextEN: 'Here I am.'
          }],
          afterWords: [{
            npcNameCN: '夏侯渊',
            npcNameEN: 'Xiahou Yuan',
            npcImagePath: '/assets/images/heroes/xiahouyuan.jpg',
            npcTextCN: '我的兄弟会帮我报仇！',
            npcTextEN: 'My brother will kill you.',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
      {
        nameCN: '新野',
        nameEN: 'Xinye',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '于禁',
            npcNameEN: 'Yu Jin',
            npcImagePath: '/assets/images/heroes/yujin.jpg',
            npcTextCN: '终于轮到我登场了！',
            npcTextEN: 'Now it\'s my show time!'
          }],
          afterWords: [{
            npcNameCN: '于禁',
            npcNameEN: 'Yu Jin',
            npcImagePath: '/assets/images/heroes/yujin.jpg',
            npcTextCN: '呜呜呜，大哥饶命。。。',
            npcTextEN: 'I beg you not killing me...',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '夏侯惇',
            npcNameEN: 'Xiahou Dun',
            npcImagePath: '/assets/images/heroes/xiahoudun.jpg',
            npcTextCN: '我乃夏侯惇！',
            npcTextEN: 'Here I am.'
          }],
          afterWords: [{
            npcNameCN: '夏侯惇',
            npcNameEN: 'Xiahou Dun',
            npcImagePath: '/assets/images/heroes/xiahoudun.jpg',
            npcTextCN: '父精母血，不可弃也！',
            npcTextEN: 'My eye...',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
      {
        nameCN: '长板桥',
        nameEN: 'Changban Bridge',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '淳于琼',
            npcNameEN: 'Chunyu Qiong',
            npcImagePath: '/assets/images/heroes/chunyuqiong.jpg',
            npcTextCN: '我们在哪儿见过？',
            npcTextEN: 'We have meet somewhere?'
          }],
          afterWords: [{
            npcNameCN: '淳于琼',
            npcNameEN: 'Chunyu Qiong',
            npcImagePath: '/assets/images/heroes/chunyuqiong.jpg',
            npcTextCN: '天哪！',
            npcTextEN: 'You killed me!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '张绣',
            npcNameEN: 'Zhang Xiu',
            npcImagePath: '/assets/images/heroes/zhangxiu.jpg',
            npcTextCN: '神枪张绣，说的就是我！',
            npcTextEN: 'I\'m the gold of spear'
          }],
          afterWords: [{
            npcNameCN: '张绣',
            npcNameEN: 'Zhang Xiu',
            npcImagePath: '/assets/images/heroes/zhangxiu.jpg',
            npcTextCN: '不，不可能。。',
            npcTextEN: 'No.. Impossible!!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
      {
        nameCN: '汉津',
        nameEN: 'Hanjin',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 2,
        battles: [{
          preWords: [{
            npcNameCN: '张辽',
            npcNameEN: 'Zhang Liao',
            npcImagePath: '/assets/images/heroes/zhangliao.jpg',
            npcTextCN: '你跑不了了！',
            npcTextEN: 'You will die here!'
          }],
          afterWords: [{
            npcNameCN: '张辽',
            npcNameEN: 'Zhang Liao',
            npcImagePath: '/assets/images/heroes/zhangliao.jpg',
            npcTextCN: '撤退！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }, {
          preWords: [{
            npcNameCN: '曹操',
            npcNameEN: 'Cao Cao',
            npcImagePath: '/assets/images/heroes/caocao.jpg',
            npcTextCN: '这一次，老夫亲自领兵。',
            npcTextEN: 'I\'m the final boss.'
          }],
          afterWords: [{
            npcNameCN: '曹操',
            npcNameEN: 'Cao Cao',
            npcImagePath: '/assets/images/heroes/caocao.jpg',
            npcTextCN: '好吧，让你跑了。',
            npcTextEN: 'Ok, see you next time.',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
    ]
  }, {
    nameCN: '火烧赤壁',
    nameEN: 'Battle of Red Cliffs',
    imagePath: '/assets/images/stages/chibi.jpg',
    places: [
      {
        nameCN: '江岸',
        nameEN: 'River Bank',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 4,
        battles: [{
          preWords: [{
            npcNameCN: '曹军普通士兵',
            npcNameEN: 'Cao Soldier',
            npcImagePath: '/assets/images/heroes/yuanshaojun.jpg',
            npcTextCN: '这一次我们不会轻敌！',
            npcTextEN: 'This time, we won\'t retreat.'
          }],
          afterWords: [{
            npcNameCN: '曹军普通士兵',
            npcNameEN: 'Cao Soldier',
            npcImagePath: '/assets/images/heroes/yuanshaojun.jpg',
            npcTextCN: '快撤！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        },
        {
          preWords: [{
            npcNameCN: '曹军普通士兵',
            npcNameEN: 'Cao Soldier',
            npcImagePath: '/assets/images/heroes/yuanshaojun.jpg',
            npcTextCN: '这一次我们不会轻敌！',
            npcTextEN: 'This time, we won\'t retreat.'
          }],
          afterWords: [{
            npcNameCN: '曹军普通士兵',
            npcNameEN: 'Cao Soldier',
            npcImagePath: '/assets/images/heroes/yuanshaojun.jpg',
            npcTextCN: '快撤！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        },
        {
          preWords: [{
            npcNameCN: '曹军普通士兵',
            npcNameEN: 'Cao Soldier',
            npcImagePath: '/assets/images/heroes/yuanshaojun.jpg',
            npcTextCN: '这一次我们不会轻敌！',
            npcTextEN: 'This time, we won\'t retreat.'
          }],
          afterWords: [{
            npcNameCN: '曹军普通士兵',
            npcNameEN: 'Cao Soldier',
            npcImagePath: '/assets/images/heroes/yuanshaojun.jpg',
            npcTextCN: '快撤！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        },
        {
          preWords: [{
            npcNameCN: '曹军普通士兵',
            npcNameEN: 'Cao Soldier',
            npcImagePath: '/assets/images/heroes/yuanshaojun.jpg',
            npcTextCN: '这一次我们不会轻敌！',
            npcTextEN: 'This time, we won\'t retreat.'
          }],
          afterWords: [{
            npcNameCN: '曹军普通士兵',
            npcNameEN: 'Cao Soldier',
            npcImagePath: '/assets/images/heroes/yuanshaojun.jpg',
            npcTextCN: '快撤！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      },
      {
        nameCN: '江上',
        nameEN: 'On the River',
        imagePath: '/assets/images/places/daxingshan.png',
        battleCount: 4,
        battles: [{
          preWords: [{
            npcNameCN: '曹仁',
            npcNameEN: 'Cao Ren',
            npcImagePath: '/assets/images/heroes/caoren.jpg',
            npcTextCN: '背水一战！',
            npcTextEN: 'This is final battle.'
          }],
          afterWords: [{
            npcNameCN: '曹仁',
            npcNameEN: 'Cao Ren',
            npcImagePath: '/assets/images/heroes/caoren.jpg',
            npcTextCN: '快撤！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        },
        {
          preWords: [{
            npcNameCN: '夏侯渊',
            npcNameEN: 'Xiahou Yuan',
            npcImagePath: '/assets/images/heroes/xiahouyuan.jpg',
            npcTextCN: '好大的火！',
            npcTextEN: 'The fire is getting bigger.'
          }],
          afterWords: [{
            npcNameCN: '夏侯渊',
            npcNameEN: 'Xiahou Yuan',
            npcImagePath: '/assets/images/heroes/xiahouyuan.jpg',
            npcTextCN: '快撤！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        },
        {
          preWords: [{
            npcNameCN: '夏侯惇',
            npcNameEN: 'Xiahou Dun',
            npcImagePath: '/assets/images/heroes/xiahoudun.jpg',
            npcTextCN: '我要生吃你的肉！',
            npcTextEN: 'I wanna eat your meat.'
          }],
          afterWords: [{
            npcNameCN: '夏侯惇',
            npcNameEN: 'Xiahou Dun',
            npcImagePath: '/assets/images/heroes/xiahoudun.jpg',
            npcTextCN: '快撤！',
            npcTextEN: 'No, we should retreat!',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        },
        {
          preWords: [{
            npcNameCN: '曹操',
            npcNameEN: 'Cao Cao',
            npcImagePath: '/assets/images/heroes/caocao.jpg',
            npcTextCN: '不要小看老夫！',
            npcTextEN: 'Don\'t look down upon me.'
          }],
          afterWords: [{
            npcNameCN: '曹操',
            npcNameEN: 'Cao Cao',
            npcImagePath: '/assets/images/heroes/caocao.jpg',
            npcTextCN: '哎...',
            npcTextEN: 'I\'t over...',
            npcTextCN2: '不堪一击！',
            npcTextEN2: 'Dude, you are too weak!'
          }]
        }]
      }
    ]
  }],
  branchData: [{
    nameCN: '决战徐州',
    nameEN: 'Battle of Xuzhou',
    imagePath: '/assets/images/stages/hulao.jpg',
    places: []
  }],
  itemData: {
    1: {
      nameCN: '木',
      nameEN: 'Wood',
      imagePath: '/assets/images/items/mu.jpg',
      descriptionCN: '基础材料',
      descriptionEN: 'Basic Materials',
      isMountable: false
    },
    2: {
      nameCN: '布',
      nameEN: 'Cloth',
      imagePath: '/assets/images/items/bu.jpg',
      descriptionCN: '基础材料',
      descriptionEN: 'Basic Materials',
      isMountable: false
    },
    3: {
      nameCN: '皮',
      nameEN: 'Fur',
      imagePath: '/assets/images/items/pi.jpg',
      descriptionCN: '基础材料',
      descriptionEN: 'Basic Materials',
      isMountable: false
    },
    4: {
      nameCN: '铁',
      nameEN: 'Iron',
      imagePath: '/assets/images/items/tie.jpg',
      descriptionCN: '基础材料',
      descriptionEN: 'Basic Materials',
      isMountable: false
    },
    5: {
      nameCN: '木棍',
      nameEN: 'Wooden Stick',
      imagePath: '/assets/images/items/mugun.jpg',
      descriptionCN: '攻击 +6',
      descriptionEN: 'ATK +6',
      isMountable: true
    },
    6: {
      nameCN: '木盾',
      nameEN: 'Wooden Shield',
      imagePath: '/assets/images/items/mudun.jpg',
      descriptionCN: '防御 +6',
      descriptionEN: 'DEF +6',
      isMountable: true
    },
    7: {
      nameCN: '布服',
      nameEN: 'Suits',
      imagePath: '/assets/images/items/bufu.jpg',
      descriptionCN: '防御 +6\n敏捷 +4',
      descriptionEN: 'DEF +6\nAGI +4',
      isMountable: true,
    },
    8: {
      nameCN: '铁剑',
      nameEN: 'Iron Sword',
      imagePath: '/assets/images/items/tiejian.jpg',
      descriptionCN: '攻击 +10',
      descriptionEN: 'Attack +10',
      isMountable: true
    },
    9: {
      nameCN: '蛇矛',
      nameEN: 'Snake spear',
      imagePath: '/assets/images/items/shemao.jpg',
      descriptionCN: '攻击 +12\n敏捷 +2',
      descriptionEN: 'ATK +12\nAGI +2',
      isMountable: true
    },
    10: {
      nameCN: '护心镜',
      nameEN: 'Mirror Armour',
      imagePath: '/assets/images/items/huxinjing.jpg',
      descriptionCN: '防御 +16\n血量 +20',
      descriptionEN: 'DEF +16\nHP +20',
      isMountable: true
    },
    11: {
      nameCN: '银胄',
      nameEN: 'Silver Mail',
      imagePath: '/assets/images/items/yinzhou.jpg',
      descriptionCN: '防御 +20\n敏捷 +2\n幸运 +2',
      descriptionEN: 'DEF +20\nAGI +2\nLUCK +2',
      isMountable: true
    },
    12: {
      nameCN: '寒冰剑',
      nameEN: 'Frost Sword',
      imagePath: '/assets/images/items/hanbingjian.jpg',
      descriptionCN: '攻击 +20\n防御 +8',
      descriptionEN: 'ATK +20\nDEF +8',
      isMountable: true
    },
    13: {
      nameCN: '太平要术',
      nameEN: 'Tai Ping Scroll',
      imagePath: '/assets/images/items/taipingyaoshu.jpg',
      descriptionCN: '智力 +20\n敏捷 +5',
      descriptionEN: 'INT +20\nAGI +3\nLUCK +5',
      isMountable: true
    },
    14: {
      nameCN: '方天画戟',
      nameEN: 'Fang Tian Hua Ji',
      imagePath: '/assets/images/items/fangtianhuaji.jpg',
      descriptionCN: '攻击 +30\n敏捷 +8',
      descriptionEN: 'ATK +30\AGI +8',
      isMountable: true
    },

    20: {
      nameCN: '银',
      nameEN: 'Silver',
      imagePath: '/assets/images/items/yin.jpg',
      descriptionCN: '基础材料',
      descriptionEN: 'Basic Materials',
      isMountable: false
    },
    21: {
      nameCN: '金',
      nameEN: 'Gold',
      imagePath: '/assets/images/items/jin.jpg',
      descriptionCN: '基础材料',
      descriptionEN: 'Basic Materials',
      isMountable: false
    },
    22: {
      nameCN: '象牙',
      nameEN: 'Ivory',
      imagePath: '/assets/images/items/xiangya.jpg',
      descriptionCN: '基础材料',
      descriptionEN: 'Basic Materials',
      isMountable: false
    },
    23: {
      nameCN: '绿宝石',
      nameEN: 'Emerald',
      imagePath: '/assets/images/items/lvbaoshi.jpg',
      descriptionCN: '基础材料',
      descriptionEN: 'Basic Materials',
      isMountable: false
    },
    24: {
      nameCN: '玄铁',
      nameEN: 'XuanTie',
      imagePath: '/assets/images/items/xuantie.jpg',
      descriptionCN: '基础材料',
      descriptionEN: 'Basic Materials',
      isMountable: false
    },
    25: {
      nameCN: '青铜',
      nameEN: 'Bronze',
      imagePath: '/assets/images/items/qingtong.jpg',
      descriptionCN: '基础材料',
      descriptionEN: 'Basic Materials',
      isMountable: false
    },

    26: {
      nameCN: '红宝石',
      nameEN: 'Ruby',
      imagePath: '/assets/images/items/hongbaoshi.jpg',
      descriptionCN: '基础材料',
      descriptionEN: 'Basic Materials',
      isMountable: false
    },
    27: {
      nameCN: '蓝宝石',
      nameEN: 'Sapphire',
      imagePath: '/assets/images/items/lanbaoshi.jpg',
      descriptionCN: '基础材料',
      descriptionEN: 'Basic Materials',
      isMountable: false
    },
    28: {
      nameCN: '水晶',
      nameEN: 'Crystal',
      imagePath: '/assets/images/items/shuijing.jpg',
      descriptionCN: '基础材料',
      descriptionEN: 'Basic Materials',
      isMountable: false
    },
    29: {
      nameCN: '羽毛',
      nameEN: 'Feather',
      imagePath: '/assets/images/items/yumao.jpg',
      descriptionCN: '基础材料',
      descriptionEN: 'Basic Materials',
      isMountable: false
    },

    100: {
      nameCN: '木剑',
      nameEN: 'Wooden Sword',
      imagePath: '/assets/images/items/mujian.jpg',
      descriptionCN: '攻击 +9',
      descriptionEN: 'ATK +9',
      isMountable: true
    },
    101: {
      nameCN: '战鼓',
      nameEN: 'Battle Drum',
      imagePath: '/assets/images/items/gu.jpg',
      descriptionCN: '攻击 +4\n敏捷 +3',
      descriptionEN: 'ATK +4\nAGI +3',
      isMountable: true
    },
    102: {
      nameCN: '头巾',
      nameEN: 'Scarf',
      imagePath: '/assets/images/items/toujin.jpg',
      descriptionCN: '防御 +15\n敏捷 +5',
      descriptionEN: 'DEF +15\nAGI +5',
      isMountable: true
    },
    103: {
      nameCN: '小斧',
      nameEN: 'Small Axe',
      imagePath: '/assets/images/items/xiaofu.jpg',
      descriptionCN: '攻击 +12\n敏捷 +5',
      descriptionEN: 'ATK +12\nAGI +5',
      isMountable: true
    },
    104: {
      nameCN: '腰带',
      nameEN: 'Belt',
      imagePath: '/assets/images/items/yaodai.jpg',
      descriptionCN: '防御 +12\n敏捷 +3',
      descriptionEN: 'DEF +12\nAGI +3',
      isMountable: true
    },
    105: {
      nameCN: '战袍',
      nameEN: 'Robe',
      imagePath: '/assets/images/items/zhanpao.jpg',
      descriptionCN: '防御 +20',
      descriptionEN: 'DEF +20',
      isMountable: true
    },
    106: {
      nameCN: '贯石斧',
      nameEN: 'Guan Shi Axe',
      imagePath: '/assets/images/items/guanshifu.jpg',
      descriptionCN: '攻击 +25\n防御 +10',
      descriptionEN: 'ATK +25\nDEF +10',
      isMountable: true
    },
    107: {
      nameCN: '古锭刀',
      nameEN: 'Gu Ding Dao',
      imagePath: '/assets/images/items/gudingdao.jpg',
      descriptionCN: '攻击 +20\n敏捷 +15',
      descriptionEN: 'ATK +20\nAGI +15',
      isMountable: true
    },
    108: {
      nameCN: '流云弓',
      nameEN: 'Liu Yun Archer',
      imagePath: '/assets/images/items/liuyungong.jpg',
      descriptionCN: '敏捷 +15\n攻击 +18',
      descriptionEN: 'AGI +15\nATK +18',
      isMountable: true
    },
    109: {
      nameCN: '青虹剑',
      nameEN: 'Qing Hong Sword',
      imagePath: '/assets/images/items/qinghongjian.jpg',
      descriptionCN: '敏捷 +10\n攻击 +20',
      descriptionEN: 'AGI +10\nATK +20',
      isMountable: true
    },
    110: {
      nameCN: '青龙偃月刀',
      nameEN: 'Qing Long Yan Yue Dao',
      imagePath: '/assets/images/items/qinglongyanyuedao.jpg',
      descriptionCN: '敏捷 +15\n攻击 +30',
      descriptionEN: 'LUCK +15\nAGI +30',
      isMountable: true
    },
    111: {
      nameCN: '道符',
      nameEN: 'Dao Amulet',
      imagePath: '/assets/images/items/hushenfu1.jpg',
      descriptionCN: '用于突破级别',
      descriptionEN: 'To break through level limits',
      isMountable: true
    },
    112: {
      nameCN: '八卦符',
      nameEN: 'Yin Yang Amulet',
      imagePath: '/assets/images/items/hushenfu2.jpg',
      descriptionCN: '幸运 +5\n智力 +12',
      descriptionEN: 'LUCK +5\nINT +12',
      isMountable: true
    },
    113: {
      nameCN: '翡翠锦囊',
      nameEN: 'Emrald Amulet',
      imagePath: '/assets/images/items/hushenfu3.jpg',
      descriptionCN: '幸运 +5\n智力 +8\n敏捷 +4',
      descriptionEN: 'LUCK +5\nINT +8\AGI +4',
      isMountable: true
    },
    114: {
      nameCN: '金色锦囊',
      nameEN: 'Golden Amulet',
      imagePath: '/assets/images/items/hushenfu4.jpg',
      descriptionCN: '幸运 +4\n智力 +10\n防御 +3',
      descriptionEN: 'LUCK +4\nINT +10\nAGI +3',
      isMountable: true
    },
    115: {
      nameCN: '孙子兵法',
      nameEN: 'The art of War',
      imagePath: '/assets/images/items/sunzibingfa.jpg',
      descriptionCN: '智力 +15\n敏捷 +3',
      descriptionEN: 'INT +15\nAGI +3',
      isMountable: true
    },

    117: {
      nameCN: '孟德新书',
      nameEN: 'Meng De Scroll',
      imagePath: '/assets/images/items/mengdexinshu.jpg',
      descriptionCN: '幸运 +15\n智力 +18',
      descriptionEN: 'LUCK +15\nINT +18',
      isMountable: true
    },
    118: {
      nameCN: '乱世头盔',
      nameEN: 'Chaos Helmet',
      imagePath: '/assets/images/items/luanshikuijia.jpg',
      descriptionCN: '防御 +15\n敏捷 +8',
      descriptionEN: 'DEF +15\nAGI +8',
      isMountable: true
    },
    119: {
      nameCN: '飞龙头盔',
      nameEN: 'Wyvern Helmet',
      imagePath: '/assets/images/items/feilongtoukui.jpg',
      descriptionCN: '血量 + 15\n防御 +15\n智力 +15',
      descriptionEN: 'HP +15\nDEF +15\nINT +15',
      isMountable: true
    },
    120: {
      nameCN: '火神头盔',
      nameEN: 'Fire Empperor Helmet',
      imagePath: '/assets/images/items/huoshentoukui.jpg',
      descriptionCN: '防御 +20\n幸运 +15',
      descriptionEN: 'DEF +20\nLUCK +15',
      isMountable: true
    },
    121: {
      nameCN: '战士盔甲',
      nameEN: 'Warrior Armor',
      imagePath: '/assets/images/items/zhanshikuijia.jpg',
      descriptionCN: '防御 +25\n敏捷 +10',
      descriptionEN: 'DEF +25\nAGI +10',
      isMountable: true
    },
    122: {
      nameCN: '金玉铠甲',
      nameEN: 'Jin Yu Armor',
      imagePath: '/assets/images/items/jinyukuijia.jpg',
      descriptionCN: '幸运 +12\n防御 +24',
      descriptionEN: 'LUCK +12\nAGI +24',
      isMountable: true
    },
    123: {
      nameCN: '正龙盔甲',
      nameEN: 'Dragon Armor',
      imagePath: '/assets/images/items/zhenglongkuijia.jpg',
      descriptionCN: '防御 +25\n攻击 +20',
      descriptionEN: 'DEF +25\nATK +20',
      isMountable: true
    },
  },
  unitData: {
    1: {
      nameCN: '关羽',
      nameEN: 'Guan Yu',
      imagePath: '/assets/images/heroes/guanyu.jpg',
      descriptionCN: '对生命值少于30%的敌人造成20%的额外伤害。',
      descriptionEN: 'On any enemy with less than 30% hp, inflict additional 20% damage.'
    },
    2: {
      nameCN: '张飞',
      nameEN: 'Zhang Fei',
      imagePath: '/assets/images/heroes/zhangfei.jpg',
      descriptionCN: '每三次攻击会对第三名敌人造成额外20%的伤害。',
      descriptionEN: 'In every 3 attacks, inflict additional 20% damage on the 3rd one.'
    },
    3: {
      nameCN: '典韦',
      nameEN: 'Dian Wei',
      imagePath: '/assets/images/heroes/dianwei.jpg',
      descriptionCN: '对中间的敌人造成额外20%的伤害。',
      descriptionEN: 'Inflict 20% additional damage on the middle enemy.'
    },
    4: {
      nameCN: '夏侯惇',
      nameEN: 'Xia Hou Dun',
      imagePath: '/assets/images/heroes/xiahoudun.jpg',
      descriptionCN: '低于50%血量时，接下来的攻击会对全部敌人造成群体伤害。',
      descriptionEN: 'After losing 50% HP, the next attack will be applied on all enemies.'
    },
    5: {
      nameCN: '太史慈',
      nameEN: 'Tai Shi Ci',
      imagePath: '/assets/images/heroes/taishici.jpg',
      descriptionCN: '20%几率会对使敌人晕眩一回合',
      descriptionEN: 'With 20% chance, stun one enemy for one round.'
    },
    6: {
      nameCN: '孙坚',
      nameEN: 'Sun Jian',
      imagePath: '/assets/images/heroes/sunjian.jpg',
      descriptionCN: '三次攻击之后会增加自身20%的敏捷度。',
      descriptionEN: 'Increase agility by 20% after 3 attacks'
    },
    7: {
      nameCN: '甘宁',
      nameEN: 'Gan Ning',
      imagePath: '/assets/images/heroes/ganning.jpg',
      descriptionCN: '当己方队友全部阵亡时，自己的造成的伤害会增加20%。',
      descriptionEN: 'After all allies die, inflict additional 20% damage on the next attack.'
    },
    8: {
      nameCN: '简雍',
      nameEN: 'Jian Yong',
      imagePath: '/assets/images/heroes/jianyong.jpg',
      descriptionCN: '当攻击敌人时，每次攻击会降低敌人20%的防御力。',
      descriptionEN: 'When attacking, decrease enemy\'s defense by 20% every time.'
    },
    9: {
      nameCN: '荀彧',
      nameEN: 'Xun Yu',
      imagePath: '/assets/images/heroes/xunyu.jpg',
      descriptionCN: '当攻击敌人时，每次攻击会降低敌人20%敏捷度。',
      descriptionEN: 'When attacking,  decrease enemy\'s agility by 20%.'
    },
    10: {
      nameCN: '郭嘉',
      nameEN: 'Guo Jia',
      imagePath: '/assets/images/heroes/guojia.jpg',
      descriptionCN: '治疗一个当前血量最少的队友，回复20%的HP。',
      descriptionEN: 'Heals the ally with the least HP by 20%.'
    },
    11: {
      nameCN: '陈宫',
      nameEN: 'Chen Gong',
      imagePath: '/assets/images/heroes/chengong.jpg',
      descriptionCN: '增加全队5%的敏捷度。',
      descriptionEN: 'Increase all allies agility by 5%.'
    },
    18: {
      imagePath: '/assets/images/npcs/huangjinzei.jpg'
    },
    12: {
      imagePath: '/assets/images/npcs/chengzhiyuan.jpg'
    },
    13: {
      imagePath: '/assets/images/npcs/zhaohong.jpg'
    },
    14: {
      imagePath: '/assets/images/npcs/dengmao.jpg'
    },
    15: {
      imagePath: '/assets/images/npcs/zhangliang.jpg'
    },
    16: {
      imagePath: '/assets/images/npcs/zhangbao.jpg'
    },
    17: {
      imagePath: '/assets/images/npcs/zhangjiao.jpg'
    },
    19: {
      nameCN: '刘备',
      nameEN: 'Liu Bei',
      imagePath: '/assets/images/heroes/liubei.jpg',
      descriptionCN: '免伤来自敌人的第三次攻击。',
      descriptionEN: 'Dodges the 3rd attack from emenies.'
    },
    20: {
      nameCN: '曹操',
      nameEN: 'Cao Cao',
      imagePath: '/assets/images/heroes/caocao.jpg',
      descriptionCN: '临死前对敌人反弹一次伤害。',
      descriptionEN: 'Returns damage back to enemies before being killed.'
    },
    21: {
      nameCN: '吕布',
      nameEN: 'Lv Bu',
      imagePath: '/assets/images/heroes/lvbu.jpg',
      descriptionCN: '以30%的几率在一局中攻击2次。',
      descriptionEN: 'Attacks twice in one round with 30% chance.'
    },
    22: {
      imagePath: '/assets/images/heroes/hanbing.jpg'
    },
    23: {
      imagePath: '/assets/images/heroes/huaxiong.jpg'
    },
    24: {
      imagePath: '/assets/images/heroes/lijue.jpg'
    },
    25: {
      imagePath: '/assets/images/heroes/guosi.jpg'
    },
    26: {
      imagePath: '/assets/images/heroes/jiaxu.jpg'
    },
    27: {
      imagePath: '/assets/images/heroes/dongzhuo.jpg'
    },
    28: {
      nameCN: '许褚',
      nameEN: 'Xu Chu',
      imagePath: '/assets/images/heroes/xuchu.jpg',
      descriptionCN: '第一次时攻击晕眩敌人。',
      descriptionEN: 'Stuns one enemy in the first attack.'
    },
    29: {
      nameCN: '赵云',
      nameEN: 'Zhao Yun',
      imagePath: '/assets/images/heroes/zhaoyun.jpg',
      descriptionCN: '每次被攻击，增加15% - 30% 防御。以100为基数，每50点智力提升以上数值1%。',
      descriptionEN: 'Every time being attacked, gains 15% - 30% DEF. Starting from 100, every 50 INT increases 1% DEF.'
    },
    30: {
      nameCN: '孙尚香',
      nameEN: 'Sun Shang Xiang',
      imagePath: '/assets/images/heroes/sunshangxiang.jpg',
      descriptionCN: '以一定的概率，对血量少于50%的敌人一击必杀。概率等于双方的智力比值除以3',
      descriptionEN: 'With certain chance, kills an enemy with less than 50% hp directly. The chance equals your intelligence / enemy\'s intelligence / 3'
    },
    31: {
      nameCN: '周瑜',
      nameEN: 'Zhou Yu',
      imagePath: '/assets/images/heroes/zhouyu.jpg',
      descriptionCN: '每一次进攻，都有50%的几率点燃一个敌人；被点燃的敌人每次进攻被减血。减血值 = 我方智力 / 敌方智力 * 10% 敌方HP，30%封顶',
      descriptionEN: 'With 50% chance, starts fire on an enemy; the fire will inflict continuous damage every time the enemy attacks. damage = min(30%, your_INT / enemy_INT * 10%) * enemy_HP '
    },
    32: {
      nameCN: '徐晃',
      nameEN: 'Xu Huang',
      imagePath: '/assets/images/heroes/xuhuang.jpg',
      descriptionCN: '每一次进攻，都进攻血量最少的敌人。',
      descriptionEN: 'Every time, attacks the enemy with the least HP.'
    },
    33: {
      nameCN: '貂蝉',
      nameEN: 'Diao Chan',
      imagePath: '/assets/images/heroes/diaochan.jpg',
      descriptionCN: '闭月羞花，每次进攻，有30%概率群攻并眩晕全部敌人。以100智力为基数，智力每提升（或减少）20点，以上概率增加（或减少）1%，最高50%封顶。',
      descriptionEN: 'Every time, with 30% - 50% chance stuns all enemies (depends on intelligence).'
    },
    34: {
      imagePath: '/assets/images/heroes/yuanshaojun.jpg'
    },
    35: {
      imagePath: '/assets/images/heroes/tianfeng.jpg'
    },
    36: {
      nameCN: '颜良',
      nameEN: 'Yan Liang',
      imagePath: '/assets/images/heroes/yanliang.jpg',
      descriptionCN: '勇冠三军，第三次进攻时，无论敌人的防御力多少，至少砍掉敌人30%的血量。',
      descriptionEN: 'In the 3rd attack, regardless the enemy\'s defense, deals at least a damage of 30% HP.'
    },
    37: {
      nameCN: '文丑',
      nameEN: 'Wen Chou',
      imagePath: '/assets/images/heroes/wenchou.jpg',
      descriptionCN: '一夫当关，第一次被攻击，治疗自己50%所受伤害；第三次被攻击，治疗自己25%所受伤害。',
      descriptionEN: 'In the 1st defense, heals 50% of the damage; in the 3rd defense, heals 25% of the damage'
    },
    38: {
      imagePath: '/assets/images/heroes/chunyuqiong.jpg'
    },
    39: {
      nameCN: '袁绍',
      nameEN: 'Yuan Shao',
      imagePath: '/assets/images/heroes/yuanshao.jpg',
      descriptionCN: '神鬼出击，第一次攻击时，将群体攻击所有敌人；第三次攻击时，将晕厥一个敌人。',
      descriptionEN: 'In the 1st attack, attacks all enemies; in the 3rd attack, stuns one enemy'
    },
    40: {
      nameCN: '小乔',
      nameEN: 'Xiao Qiao',
      imagePath: '/assets/images/heroes/xiaoqiao.jpg',
      descriptionCN: '甜蜜恋风，每次进攻，以30%概率治愈我军全部英雄20%血量。以100智力为基数，智力每提升（或减少）20点，治愈血量值提升（或减少）1%，最高50%封顶。',
      descriptionEN: 'Every time, with 30% chance heals all allies hp by 20% to 50% (depends on intelligence).'
    },
    41: {
      nameCN: '大乔',
      nameEN: 'Da Qiao',
      imagePath: '/assets/images/heroes/daqiao.jpg',
      descriptionCN: '一笑倾城，第三次攻击前触发，可提升我方全部英雄攻击力30%一回合。以100智力为基数，智力每提升（或减少）20点，以上攻击力提升值增加（或减少）1%，最高50%封顶。',
      descriptionEN: 'On the 3rd attack, increases all allies attack by 30% to 50% for one round (depends on intelligence).'
    },
    42: {
      nameCN: '甄姬',
      nameEN: 'Zhen Ji',
      imagePath: '/assets/images/heroes/zhenji.jpg',
      descriptionCN: '洛神之歌，第三次攻击时，把我方血量最少的一名英雄血量补满。智力对该技能无提升效果。',
      descriptionEN: 'On the 3rd attack, heals the ally with the least hp to full.'
    },
    43: {
      imagePath: '/assets/images/heroes/caoren.jpg'
    },
    44: {
      imagePath: '/assets/images/heroes/lidian.jpg'
    },
    45: {
      imagePath: '/assets/images/heroes/lejin.jpg'
    },
    46: {
      imagePath: '/assets/images/heroes/xiahouyuan.jpg'
    },
    47: {
      imagePath: '/assets/images/heroes/yujin.jpg'
    },
    48: {
      imagePath: '/assets/images/heroes/zhangxiu.jpg'
    },
    49: {
      imagePath: '/assets/images/heroes/zhangliao.jpg'
    },
    50: {
      nameCN: '马超',
      nameEN: 'Ma Chao',
      imagePath: '/assets/images/heroes/machao.jpg',
      descriptionCN: '西凉之刃，每次一次攻击到同一个敌人，下一次攻击都将增加10%到40%的伤害。以100智力和10%加成为基数；智力每增加10点，以上加成增加1%。',
      descriptionEN: 'Every time attacking the same enemy, afflicts additional 10% - 40% damage (depends on intelligence)'
    }
  },
  unitsForSell: [{
    unitId: 1
  }, {
    unitId: 2
  }, {
    unitId: 3
  }, {
    unitId: 4
  }, {
    unitId: 5
  }, {
    unitId: 6
  }, {
    unitId: 7
  }, {
    unitId: 8
  }, {
    unitId: 9
  }, {
    unitId: 10
  }, {
    unitId: 11
  }, {
    unitId: 28
  }, {
    unitId: 29
  }, {
    unitId: 36
  }, {
    unitId: 37
  }],
  bigCityNames: [
    ['洛阳','Luoyang'],
    ['青州','Qingzhou'],
    ['幽州','Youzhou'],
    ['兖州','Qiuzhou'],
    ['徐州','Xuzhou'],
    ['扬州','Yangzhou'],
    ['荆州','Jingzhou'],
    ['交州','Jiaozhou'],
    ['益州','Yizhou'],
    ['冀州','Jizhou'],
    ['豫州','Yuzhou'],
    ['并州','Bingzhou']
  ],
  smallCityNames: [
    ['北平','Beiping'],
    ['涿郡','Zhuojun'],
    ['代郡','Daijun'],
    ['上谷','Shanggu'],
    ['渔阳','Yuyang'],
    ['辽西','Liaoxi'],
    ['昌黎','Changli'],
    ['玄菟','Xuantu'],
    ['辽东','Liaodong'],
    ['乐浪','Lelang'],
    ['带方','Daifang'],
    ['安平','Anping'],
    ['中山','Zhongshan'],
    ['常山','Changshan'],
    ['巨鹿','Julu'],
    ['广平','Guangping'],
    ['魏郡','Weijun'],
    ['阳平','Yangping'],
    ['清河','Qinghe'],
    ['平原','Pingyuan'],
    ['乐陵','Leling'],
    ['渤海','Bohai'],
    ['河间','Hejian']
  ],
  gateUrl: 'http://sg.unseenmagic.com',
  blockExplorerUrl: 'https://shasta.tronscan.org/#/address/',
  gameUrl: 'http://crypto3g.io'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

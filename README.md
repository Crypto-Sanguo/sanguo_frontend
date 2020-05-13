# Background and Restrictions

This is the frontend of the Crypto Sanguo game (http://sanguo.pk).

Per the request of some players, I open source Cypto Sanguo with the following restrictions:


1) The license of the code will be GPL, that any forked project also need to be open source, and give some credit to Crypto Sanguo.

2) The code will open source, but the art assets won't be. I will reserve all the art assets for my future games, and they are still **proprietary**.

3) The forked project can't be another Sanguo game. The forked one needs to use some new theme.

At some point in the future I will create Cypto Sanguo II, but for now, I decide to give away the Sanguo code for free for the good of the community.

If someone got inspired by Crypto Sanguo, and can create some better game I will be very happy.


# Instructions

The frontend is developed by AngularJS.

To deploy, do the following:

1) Change all the assets (As I said, they are proprietary).

2) Compile the **Battlefield** code (with Cocos Creator 2D), and copy the built content to replace src/assets/battlefield

3) Change content in src/environment/environment.prod.ts (for production) and src/environment/environment.ts (for testing), link them to the correct smart contract address.

4) Compile with AngularJS 

  `npm install`

  `ng build --prod`

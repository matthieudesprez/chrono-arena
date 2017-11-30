# Chrono Arena

[Demo](http://www.edistra.com/chrono_arena/)

:information_source: this is a work in progress, please feel free to create issues or contact me if you encounter errors in the demo or if you have any question related to this project.

## Presentation
In Chrono Arena, players build their team of characters, who got different skills, and confront each other on a tilemap in a simultaneous turn based strategy game.
Simultaneous, because each player give orders to their characters in an "Order Phase", without knowing what their opponents are planning to do, and when all players have confirmed their "Order Phase", the game engine process all given orders and generates a multiple steps timeline corresponding of what actually happens in the battlefield.
This part holds an important place in the game strategy : 
* instead of classical turn-based game, where the first player has the advantage to start moving or dealing damage, and where the game design has to compensate in giving the second player some kind of extra bonus, the simultaneous resolution gives as many balance between players than a Real Time Strategy Game, except it's turn based so players can think longer about what they are gonna do.
* players don't see what their opponents are planning to do, they have to guess and surprise them, knowing they will probably do the same.
* the issue of the turn, resulting from the game engine, might be completly different from what was expected.

The generated timeline is then read in a way that each player can see the result and navigate between the steps to have a clear overview of how their plan came out.
Once a player has finished consulting the turn result, he can moves on the next "Order Phase", and so on...

## Technical decisions
Chrono Arena is Mobile First oriented in its size & UI design, but still playable in a web browser on Desktop.
This choice is made to promote the ease of access of the game, in an online multiplayer vision, which is kind of the purpose of the game at long term (a functionnal prototype was achieved but need to be reimplemented due to major changes in the client code, see https://gitlab.com/Edistra/chrono-arena-server for the Heroku NodeJS back-end project)

The game exploits the [PhaserJS game framework](https://phaser.io/) and the [TypeScript language](https://www.typescriptlang.org/)
Unit Tests are run on a [Karma sever](https://karma-runner.github.io/1.0/index.html), using [PhantomJS](http://phantomjs.org/) browser and [Jasmine framework](https://jasmine.github.io/)

## Credits
Characters Sprites : https://github.com/makrohn/Universal-LPC-spritesheet
Spritesheets are generated using free version of [Texture Packer](https://www.codeandweb.com/texturepacker)
Golden UI from https://opengameart.org/users/buch
Free Fantasy Game GUI from https://www.gameart2d.com/free-fantasy-game-gui.html
Map Tilesets from RPG Maker free resources
Maps are generated using [Tiled Map Editor](http://www.mapeditor.org/)
UI Skill Icons from [DGHZ Fantasy Icon Pack Free Sample](https://dghz.itch.io/fantasy-icon-pack)


tl;dr : Frozen Synapse meets some Grid-Based Tactical-RPG style in a Mobile First PhaserJS game.


## Install project

Run those following commands to install dependencies :

```
npm install
```
```
bower install
```

## Develop

For creating the build folder with the compiled javascript + assets :

```
npm run build
```

For serving the project :
```
npm run serve
```

For watching the src/*.ts files (with auto-reload) :
```
npm run watch
```

If you change something in the src/assets/ folder you have to run the following command to update the build folder :
```
npm run cp
```

To run unit tests :
```
npm run test
```

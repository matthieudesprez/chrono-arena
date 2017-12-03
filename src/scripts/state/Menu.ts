module TacticArena.State {
    export class Menu extends TacticArena.State.BaseState {
        slideGroup;
        slides;
        slideButtons;
        selectedTeamGroup;
        selectedCharactersGroup;
        charactersGroup;
        selectedMapTextGroup;
        currentMapIndex;
        mapPreviewGroup;
        selectedMap;

        create() {
            this.slides = {};
            this.slideGroup = this.game.add.group();
            let slidesX = {
                home: 0,
                team: this.game.world.width * -1,
                settings: this.game.world.width
            };
            Object.keys(slidesX).forEach(slideName => {
                this.slides[slideName] = this.game.add.group();
                this.slides[slideName].x = slidesX[slideName];
                this.slideGroup.add(this.slides[slideName]);
            });

            //HOME
            let logo = this.game.make.image(this.centerX, 10, 'logo-image');
            logo.anchor.set(0.5, 0);
            let buttonsGroup = this.game.add.group();
            buttonsGroup.x = this.centerX;
            buttonsGroup.y = this.game.height - 260;
            let singleplayerButton = this.game.make.button(0, 0, 'big-button', function () {
            }, this, 'background-button', 'background-button-clicked');
            singleplayerButton.anchor.set(0.5, 0);
            singleplayerButton.scale.set(0.7);
            singleplayerButton.inputEnabled = true;
            singleplayerButton.events.onInputDown.add(this.startSinglePlayer, this, 0);
            let singleplayerButtonLabel = this.game.add.text(0, 42, 'BATTLE', {
                font: '20px Press Start 2P',
                fill: '#ffffff',
                boundsAlignH: 'right',
                boundsAlignV: 'top',
            });
            singleplayerButtonLabel.anchor.set(0.5, 0);
            buttonsGroup.add(singleplayerButton);
            buttonsGroup.add(singleplayerButtonLabel);

            this.currentMapIndex = 0;
            this.selectedMapTextGroup = new Phaser.Group(this.game);
            this.mapPreviewGroup = new Phaser.Group(this.game);
            let mapSelectorGroup = new Phaser.Group(this.game);
            mapSelectorGroup.x = this.game.world.centerX - 189 / 2;
            mapSelectorGroup.y = 200;
            mapSelectorGroup.width = this.game.world.width;
            let mapSelectorBackground = new Phaser.Image(this.game, 0, 0, 'grey-plank');
            mapSelectorGroup.add(mapSelectorBackground);

            let buttonPrevious = new Phaser.Button(this.game, -80, 0, 'left-button', function () {
                this.selectMap(-1);
            }, this, 'normal', 'disabled');
            let buttonNext = new Phaser.Button(this.game, 199, 0, 'right-button', function () {
                this.selectMap(1);
            }, this, 'normal', 'disabled');
            mapSelectorGroup.add(buttonPrevious);
            mapSelectorGroup.add(buttonNext);

            (this.game as Game).player.getMaps().forEach((mapClass, index) => {
                let map = new mapClass();
                let mapPreview = new Phaser.Image(this.game, 0, 0, map.name + '-preview');
                this.mapPreviewGroup.add(mapPreview);
                let mapText = new Phaser.Text(this.game, 0, 5, map.label, {
                        font: '20px Press Start 2P',
                        fill: '#333333',
                        boundsAlignH: 'center',
                        boundsAlignV: 'middle'
                    }
                );
                mapText.setTextBounds(0, 0, 189, 64);
                mapText.visible = false;
                this.selectedMapTextGroup.add(mapText);
            });
            mapSelectorGroup.add(this.selectedMapTextGroup);

            this.slides['home'].add(logo);
            this.slides['home'].add(mapSelectorGroup);
            this.slides['home'].add(buttonsGroup);

            //TEAM
            let teamBackground = new Phaser.Image(this.game, this.centerX, 20, 'team-background');
            teamBackground.anchor.set(0.5, 0);
            let ribbon = new Phaser.Image(this.game, this.centerX, 5, 'ribbon');
            ribbon.anchor.set(0.5, 0);
            let ribbonText = new Phaser.Text(this.game, 0, 7, 'PARTY', {
                font: '20px Press Start 2P',
                fill: '#333333',
                boundsAlignH: 'center',
                boundsAlignV: 'top',
            });
            ribbonText.setTextBounds(0, 20, this.game.world.width, 20);

            this.selectedTeamGroup = new Phaser.Group(this.game);
            this.selectedTeamGroup.y = 90;
            let teamSelectedBackground = new Phaser.Image(this.game, this.centerX, 0, 'selected-party-background');
            teamSelectedBackground.anchor.set(0.5, 0);
            this.selectedTeamGroup.add(teamSelectedBackground);
            this.selectedCharactersGroup = new Phaser.Group(this.game, this.selectedTeamGroup, 'selected-characters');
            this.selectedCharactersGroup.x = 55;
            this.selectedCharactersGroup.y = 30;

            this.slides['team'].add(teamBackground);
            this.slides['team'].add(ribbon);
            this.slides['team'].add(ribbonText);
            this.slides['team'].add(this.selectedTeamGroup);

            this.charactersGroup = new Phaser.Group(this.game, this.slides['team'], 'characters');
            this.charactersGroup.x = 20;
            this.charactersGroup.y = 280;
            (this.game as Game).player.getCharacters().forEach((character, index) => {
                let frameGroup = new Phaser.Group(this.game);
                let pawn = new character(this, new Position(0, 0, 'S'), 0, 0);
                let sprite = new pawn.spriteClass(this, 8, 32, 'S', pawn.type);
                let partyFrame = new Phaser.Image(this.game, 0, 0, 'frame-' + pawn.type);

                partyFrame.inputEnabled = true;
                partyFrame.events.onInputOver.add(this.overCharacter, this, 0, sprite);
                partyFrame.events.onInputOut.add(this.outCharacter, this, 0, sprite);
                partyFrame.events.onInputDown.add(this.selectCharacter, this, 0, frameGroup, character);

                frameGroup.add(partyFrame);
                frameGroup.add(sprite);
                this.charactersGroup.add(frameGroup);

                if ((this.game as Game).player.isInBattleParty(pawn._name)) {
                    this.selectCharacter(null, null, frameGroup);
                }
            });
            this.charactersGroup.align(4, 2, 90, 120);

            //GENERAL
            let bottomGroup = this.game.add.group();
            bottomGroup.y = this.game.height - 110;
            let frame = this.game.make.sprite(this.game.world.centerX, 0, 'frame-bottom');
            frame.anchor.set(0.5, 0);
            let slideButtonsX = {
                home: this.game.world.centerX,
                team: this.game.world.centerX - 100,
                settings: this.game.world.centerX + 100
            };
            this.slideButtons = {};
            Object.keys(this.slides).forEach(slideName => {
                this.slideButtons[slideName] = this.game.make.button(slideButtonsX[slideName], 12, slideName + '-button', function () {
                }, this, 'normal', 'disabled');
                this.slideButtons[slideName].anchor.set(0.5, 0);
                this.slideButtons[slideName].inputEnabled = true;
                this.slideButtons[slideName].events.onInputDown.add(this.slide, this, 0, slideName);
            });
            bottomGroup.add(frame);
            Object.values(this.slideButtons).forEach(button => {
                bottomGroup.add(button);
            });

            let overlay = new Phaser.Graphics(this.game, this.game.world.width, this.game.world.height);
            overlay.beginFill(0x000000, 0.5);
            overlay.drawRect(0, 0, this.game.world.width, this.game.world.height);
            overlay.x = 0;
            overlay.y = 0;

            this.worldGroup.add(this.mapPreviewGroup);
            this.worldGroup.add(overlay);
            this.worldGroup.add(this.slideGroup);
            this.worldGroup.add(bottomGroup);

            this.slide(null, null, 'home');

            this.selectMap(0);

            //this.startSinglePlayer();
        }

        startSinglePlayer() {
            this.game.state.start('mainsolooffline', true, false, {
                players: [
                    new Player.Bot('Bender'),
                    (this.game as Game).player
                ],
                map: this.selectedMap
            }, null);
        }

        slide(buttonSprite, pointer, slideName) {
            this.deselectedButtons();
            this.slideButtons[slideName].setFrames('normal', 'normal', 'normal');
            this.game.add.tween(this.slideGroup).to({x: this.slides[slideName].x * -1}, 300, Phaser.Easing.Linear.None, true);

        }

        deselectedButtons() {
            Object.values(this.slideButtons).forEach(button => {
                button.setFrames('normal', 'disabled', 'normal');
            });
        }

        overCharacter(buttonSprite, pointer, sprite) {
            sprite.walk();
        }

        outCharacter(buttonSprite, pointer, sprite) {
            sprite.stand();
        }

        selectCharacter(frame, pointer, group, character=null) {
            if (group.parent.name == 'characters') {
                if (this.selectedCharactersGroup.countLiving() < 3) {
                    this.selectedCharactersGroup.add(group);
                    if (character) {
                        (this.game as Game).player.addCharacterToParty(character);
                    }
                }
            } else {
                if (this.selectedCharactersGroup.countLiving() > 1) {
                    this.charactersGroup.add(group);
                    if (character) {
                        (this.game as Game).player.removeCharacterFromParty(character);
                    }
                }
            }
            this.selectedCharactersGroup.align(3, 1, 95, 124);
            this.charactersGroup.align(4, 2, 90, 120);
        }

        selectMap(step) {
            let maps = (this.game as Game).player.getMaps();
            let newIndex = this.currentMapIndex + step;
            if (newIndex >= maps.length) {
                newIndex = 0;
            }
            else if (newIndex < 0) {
                newIndex = maps.length - 1;
            }
            this.selectedMap = maps[newIndex];
            let index = 0;
            this.selectedMapTextGroup.forEach(text => {
                (text as Phaser.Text).visible = (index == newIndex);
                index++;
            });
            index = 0;
            this.mapPreviewGroup.forEach(preview => {
                (preview as Phaser.Image).visible = (index == newIndex);
                index++;
            });
            this.currentMapIndex = newIndex;
        }

    }
}

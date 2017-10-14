module TacticArena.State {
    export class Menu extends TacticArena.State.BaseState {
        slideGroup;
        slides;
        slideButtons;
        selectedTeamGroup;
        selectedCharactersGroup;
        charactersGroup;

        create() {
            this.slides = {};
            this.slideGroup = this.game.add.group();
            let slidesX = {
                home: 0,
                team: this.game.world.width * -1,
                settings: this.game.world.width
            };
            Object.keys(slidesX).forEach( slideName => {
                this.slides[slideName] = this.game.add.group();
                this.slides[slideName].x = slidesX[slideName];
                this.slideGroup.add(this.slides[slideName]);
            });

            //HOME
            let logo = this.game.make.image(this.centerX, 150, 'logo3');
            logo.anchor.set(0.5);
            let buttonsGroup = this.game.add.group();
            buttonsGroup.x = this.centerX;
            buttonsGroup.y = 300;
            let singleplayerButton = this.game.make.button(0, 0, 'big-button', function() {}, this, 'background-button', 'background-button-clicked');
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
            this.slides['home'].add(logo);
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
                let pawn = new character(this, 0, 0, 'S', 0, false, 0);
                pawn.sprite.x = 8;
                pawn.sprite.y = 32;
                let partyFrame = new Phaser.Image(this.game, 0, 0, 'frame-' + pawn.type);

                partyFrame.inputEnabled = true;
                partyFrame.events.onInputOver.add(this.overCharacter, this, 0, pawn.sprite);
                partyFrame.events.onInputOut.add(this.outCharacter, this, 0, pawn.sprite);
                partyFrame.events.onInputDown.add(this.selectCharacter, this, 0, frameGroup);

                frameGroup.add(partyFrame);
                frameGroup.add(pawn.sprite);
                this.charactersGroup.add(frameGroup);

                if((this.game as Game).player.isInBattleParty(pawn._name)) {
                    this.selectCharacter(null, null, frameGroup);
                }
            });
            this.charactersGroup.align(4, 2, 90, 120);

            //GENERAL
            let background = this.game.make.image(this.centerX, 0, 'bg');
            background.anchor.set(0.5, 0);
            background.scale.set(0.9);
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
            Object.keys(this.slides).forEach( slideName => {
                this.slideButtons[slideName] = this.game.make.button(slideButtonsX[slideName], 12, slideName + '-button', function() {}, this, 'normal', 'disabled');
                this.slideButtons[slideName].anchor.set(0.5, 0);
                this.slideButtons[slideName].inputEnabled = true;
                this.slideButtons[slideName].events.onInputDown.add(this.slide, this, 0, slideName);
            });
            bottomGroup.add(frame);
            Object.values(this.slideButtons).forEach( button => { bottomGroup.add(button); });

            this.worldGroup.add(background);
            this.worldGroup.add(this.slideGroup);
            this.worldGroup.add(bottomGroup);

            this.slide(null, null, 'team');

            //this.startSinglePlayer();
        }

        startSinglePlayer() {
            this.game.state.start('mainsolooffline', true, false, {
                players: [
                    {name: 'BOT 01', faction: 'evil', player: false},
                    (this.game as Game).player
                ]
            }, null);
        }

        slide(buttonSprite, pointer, slideName) {
            this.deselectedButtons();
            this.slideButtons[slideName].setFrames('normal', 'normal', 'normal');
            this.game.add.tween(this.slideGroup).to({x: this.slides[slideName].x * -1}, 300, Phaser.Easing.Linear.None, true);

        }

        deselectedButtons() {
            Object.values(this.slideButtons).forEach( button => {
                button.setFrames('normal', 'disabled', 'normal');
            });
        }

        overCharacter(buttonSprite, pointer, sprite) {
            sprite.walk();
        }
        outCharacter(buttonSprite, pointer, sprite) {
            sprite.stand();
        }

        selectCharacter(frame, pointer, group) {
            if(group.parent.name == 'characters') {
                if(this.selectedCharactersGroup.countLiving() < 2) {
                    this.selectedCharactersGroup.add(group);
                }
            } else {
                if(this.selectedCharactersGroup.countLiving() > 1) {
                    this.charactersGroup.add(group);
                }
            }
            this.selectedCharactersGroup.align(3, 1, 95, 124);
            this.charactersGroup.align(4, 2, 90, 120);
        }

    }
}

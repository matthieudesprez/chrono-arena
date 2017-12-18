module TacticArena.UI {
    export class TimelineMenu {
        game;
        mainGroup;
        isOver;
        timelineGroup;
        steps_number;
        turnsNumbers;
        stepsColors;
        btnPause;
        btnExit;
        exiting;
        exitingPromises;

        constructor(game) {
            this.isOver = false;
            this.exiting = 0;
            this.exitingPromises = [];
            this.game = game;
            this.mainGroup = this.game.add.group();
            this.timelineGroup = this.game.add.group();
            this.turnsNumbers = this.game.add.group();

            let frame = this.game.make.sprite(this.game.world.centerX, 0, 'frame-bottom');
            frame.anchor.set(0.5, 0);
            frame.inputEnabled = true;
            frame.events.onInputOver.add(this.over, this);
            frame.events.onInputOut.add(this.out, this);
            this.mainGroup.add(frame);

            this.btnExit = this.game.make.image(this.game.width - 32, -32 + 4, 'icon-exit');
            this.btnExit.inputEnabled = true;
            this.btnExit.events.onInputDown.addOnce(() => {
                this.exiting++;
                setTimeout( () => {
                    if(this.exiting === 1) {
                        this.exit();
                    }
                }, 300);
            }, this);
            this.mainGroup.add(this.btnExit);
            this.btnExit.anchor.set(0.5);

            this.btnPause = this.game.make.image(32, -32 + 4, 'icon-pause');
            this.btnPause.inputEnabled = true;
            this.btnPause.events.onInputDown.add(this.togglePause, this);
            this.mainGroup.add(this.btnPause);
            this.btnPause.anchor.set(0.5);
            this.updateBtnPause();

            this.mainGroup.x = 0;
            this.mainGroup.y = this.game.height - 100;

            this.game.uiGroup.add(this.mainGroup);
        }

        init(steps_number: Number): Promise<any> {
            this.steps_number = steps_number;
            return new Promise((resolve, reject) => {
                var self = this;
                this.stepsColors = [];
                for (let i = 0; i < this.steps_number; i++) {
                    let key = 'step';
                    if (i == 0) {
                        key = 'step-first';
                    }
                    else if (i == this.steps_number - 1) {
                        key = 'step-last';
                    }

                    let stepGroup = this.game.add.group();
                    let step = self.game.make.sprite(0, 0, key);
                    step.anchor.set(0);

                    step.inputEnabled = true;
                    step.events.onInputDown.add(this.goToStep, this, 0, i);

                    stepGroup.add(step);
                    stepGroup.x = i * 36;
                    stepGroup.y = 0;
                    this.stepsColors.push(stepGroup.add(this.game.add.group())); // pour gérer la couleur au dessus

                    this.timelineGroup.add(stepGroup);

                    if (i < this.steps_number - 1) {
                        let join = self.game.make.sprite(i * 36 + 14, 3, 'step-join');
                        join.anchor.set(0);
                        this.timelineGroup.add(join);
                    }
                }

                this.timelineGroup.scale.setTo(1.5, 1.5);
                this.timelineGroup.x = this.game.world.width / 2 - this.timelineGroup.width / 2;
                this.timelineGroup.y = 39;
                this.mainGroup.add(this.timelineGroup);

                let buttonPrevious = self.game.make.sprite(30, 33, 'button-square-previous');
                buttonPrevious.anchor.set(0);

                let buttonNext = self.game.make.sprite(this.game.world.width - 65, 33, 'button-square-next');
                buttonNext.anchor.set(0);

                buttonPrevious.inputEnabled = true;
                buttonPrevious.events.onInputDown.add(this.previous, this);
                buttonNext.inputEnabled = true;
                buttonNext.events.onInputDown.add(this.next, this);

                this.mainGroup.add(buttonPrevious);
                this.mainGroup.add(buttonNext);

                // TODO handle the current played turn
                let startTurn = Math.max(0, this.game.resolveManager.turnIndex - 4);
                for (let i = 0; i < 8; i++) {
                    let turnNumber = i + startTurn;

                    let turn = this.game.add.text(i * 32, 0, turnNumber, {
                        font: '14px Press Start 2P',
                        fill: (turnNumber === this.game.resolveManager.turnIndex) ? "#6daa2c" : "#ffffff",
                        boundsAlignH: 'left',
                        boundsAlignV: 'top',
                        stroke: '#000000',
                        strokeThickness: 7
                    });
                    turn.anchor.set(0.5);

                    if (turnNumber > this.game.logManager.logs.length - 1) {
                        turn.alpha = 0.5;
                    } else {
                        turn.inputEnabled = true;
                        turn.events.onInputDown.add(this.playTurn, this, 0, turnNumber);
                    }
                    this.turnsNumbers.add(turn);
                }
                this.turnsNumbers.x = 80;
                this.turnsNumbers.y = -9;
                this.mainGroup.add(this.turnsNumbers);

                resolve(true);
            });
        }

        update(current) {
            let self = this;
            this.stepsColors.forEach((stepColor: Phaser.Group, index) => {
                stepColor.removeAll(true);
                if (index > current) {
                    return;
                }

                let key = (index < current) ? 'step-old' : 'step-active';
                let color = self.game.make.sprite(3, 3, key);
                color.anchor.set(0);
                stepColor.update();
                stepColor.add(color);
            });
        }

        clean() {
            this.mainGroup.destroy();
        }

        over() {
            this.isOver = true;
        }

        out() {
            this.isOver = false;
        }

        next() {
            Action.Timeline.GoForward.process(this.game);
        }

        previous() {
            Action.Timeline.GoBackward.process(this.game);
        }

        async goToStep(clickedSprite, pointer, index): Promise<any> {
            if (index != this.game.resolveManager.currentIndex) {
                if (!this.game.isPaused) {
                    this.togglePause(null, null);
                }
                return this.game.resolveManager.processSteps(index, false, index < this.game.resolveManager.currentIndex);
            }
            return Promise.resolve(true);
        }

        async playTurn(sprite, pointer, turnNumber) {
            if (!this.game.isPaused) {
                this.togglePause(null, null);
            }
            await this.game.resolveManager.isReady();
            Action.PlayTurn.process(this.game, turnNumber);
        }

        togglePause(sprite, pointer) {
            Action.Timeline.TogglePause.process(this.game);
            this.updateBtnPause();
        }

        updateBtnPause() {
            this.btnPause.loadTexture(this.game.isPaused ? 'icon-play' : 'icon-pause');
        }

        async exit() {
            let lastTurnIndex = this.game.logManager.logs.length - 1;
            await this.playTurn(null, null, lastTurnIndex);
            await this.game.resolveManager.isReady();
            await this.goToStep(null, null, this.game.logManager.logs[lastTurnIndex].length - 1);
            await this.goToStep(null, null, this.game.logManager.logs[lastTurnIndex].length);
        }
    }
}

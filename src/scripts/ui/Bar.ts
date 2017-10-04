module TacticArena.UI {
    export class Bar extends Phaser.Group {
        menu;
        element;
        text;
        game;
        config;
        barSprite;
        bgSprite;
        x;
        y;
        value;
        frameSprite;

        constructor(game, providedConfig) {
            super(game);
            this.game = game;
            this.setupConfiguration(providedConfig);
            if(this.config.frame) {
                this.frameSprite = this.game.make.sprite(this.config.frameOffsetX, this.config.frameOffsetY, this.config.frame);
                this.frameSprite.anchor.set(0);
                this.add(this.frameSprite);
            }
            this.setPosition(this.config.x, this.config.y);
            this.setValue(this.config.value);
            this.drawBackground();
            this.drawBar();
            if(this.config.text) {
                this.drawText();
            }
            //this.setFixedToCamera(this.config.isFixedToCamera);
        }

        setValue(value) {
            this.value = value;
        }

        updateValue(value) {
            this.setValue(value);
            this.updateText();
            this.setPercent((this.value / this.config.max) * 100);
        }

        setupConfiguration(providedConfig) {
            this.config = this.mergeWithDefaultConfiguration(providedConfig);
        }

        mergeWithDefaultConfiguration(newConfig) {
            var defaultConfig = {
                width: 250,
                height: 40,
                x: 0,
                y: 0,
                bg: {
                    color: '#651828'
                },
                bar: {
                    color: '#FEFF03'
                },
                animationDuration: 200,
                isFixedToCamera: false,
                text: false,
                max: 0,
                unit: '',
                textStyle: '12px Iceland',
                value: 0
            };

            return this.mergeObjects(defaultConfig, newConfig);
        }

        mergeObjects(targetObj, newObj) {
            for (var p in newObj) {
                try {
                    targetObj[p] = newObj[p].constructor == Object ? this.mergeObjects(targetObj[p], newObj[p]) : newObj[p];
                } catch (e) {
                    targetObj[p] = newObj[p];
                }
            }
            return targetObj;
        }

        drawBackground() {
            var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
            bmd.ctx.fillStyle = this.config.bg.color;
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, this.config.width, this.config.height);
            bmd.ctx.fill();
            bmd.update();

            this.bgSprite = this.game.make.sprite(0, 0, bmd);
            this.bgSprite.anchor.set(0);
            this.add(this.bgSprite);
        }

        drawBar() {
            var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
            bmd.ctx.fillStyle = this.config.bar.color;
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, this.config.width, this.config.height);
            bmd.ctx.fill();
            bmd.update();

            this.barSprite = this.game.make.sprite(0, 0, bmd);
            this.barSprite.anchor.set(0);
            this.add(this.barSprite);
        }

        drawText() {
            this.text = this.game.add.text(0, 0, '', {
                font: this.config.textStyle,
                fill: '#ffffff',
                boundsAlignH: 'center',
                boundsAlignV: 'top',
            }, this);
            this.text.setTextBounds(0, 0, this.width, this.height);
            this.updateText();
            //this.add(this.text);
        }

        updateText() {
            this.text.text = this.value + ' / ' + this.config.max + ' ' + this.config.unit;
        }

        setPosition(x, y) {
            this.x = x;
            this.y = y;

            //if (this.bgSprite !== undefined && this.barSprite !== undefined) {
            //    this.bgSprite.position.x = x;
            //    this.bgSprite.position.y = y;
            //
            //    this.barSprite.position.x = x - this.config.width / 2;
            //    this.barSprite.position.y = y;
            //}
        }

        setPercent(newValue) {
            if (newValue < 0) newValue = 0;
            if (newValue > 100) newValue = 100;

            var newWidth = (newValue * this.config.width) / 100;

            this.setWidth(newWidth);
        }

        setBarColor(newColor) {
            var bmd = this.barSprite.key;
            bmd.update();

            var currentRGBColor = bmd.getPixelRGB(0, 0);
            var newRGBColor = this.hexToRgb(newColor);
            bmd.replaceRGB(currentRGBColor.r,
                currentRGBColor.g,
                currentRGBColor.b,
                255,

                newRGBColor.r,
                newRGBColor.g,
                newRGBColor.b,
                255);
        }

        setWidth(newWidth) {
            this.game.add.tween(this.barSprite).to({width: newWidth}, this.config.animationDuration, Phaser.Easing.Linear.None, true);
        }

        setFixedToCamera(fixedToCamera) {
            this.bgSprite.fixedToCamera = fixedToCamera;
            this.barSprite.fixedToCamera = fixedToCamera;
        }

        kill() {
            this.bgSprite.kill();
            this.barSprite.kill();
        }

        hexToRgb(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
    }
}
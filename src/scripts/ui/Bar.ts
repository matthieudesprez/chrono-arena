module TacticArena.UI {
    export class Bar extends Phaser.Group {
        menu;
        element;
        text;
        game;
        config;
        bgSprite;
        barSprite;
        x;
        y;
        value;

        constructor(game, providedConfig) {
            super(game.game);
            this.game = game;
            this.setupConfiguration(providedConfig);
            this.setPosition(this.config.x, this.config.y);
            this.setValue(0);
            this.drawBackground();
            this.drawBar();
            this.drawText();
            console.log(this.config);
            //this.setFixedToCamera(this.config.isFixedToCamera);
        }

        setValue(value) {
            this.value = value;
        }

        updateValue(value) {
            this.setValue(value);
            this.updateText();
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
                max: 0,
                unit: ''
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

            this.bgSprite = this.game.make.sprite(this.x, this.y, bmd);
            this.bgSprite.anchor.set(0);
            //this.add(bmd);
        }

        drawBar() {
            var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
            bmd.ctx.fillStyle = this.config.bar.color;
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, this.config.width, this.config.height);
            bmd.ctx.fill();
            bmd.update();

            this.barSprite = this.game.make.sprite(this.x, this.y, bmd);
            this.barSprite.anchor.set(0);
            //this.add(bmd);
        }

        drawText() {
            this.text = this.game.add.text(this.x, this.y, '', {
                font: '12px Iceland',
                fill: '#ffffff',
                boundsAlignH: 'center',
                boundsAlignV: 'top',
            });
            this.text.setTextBounds(0, 0, this.bgSprite.width, this.bgSprite.height);
            this.updateText();
            //this.add(this.text);
        }

        updateText() {
            this.text.text = this.value + ' / ' + this.config.max + ' ' + this.config.unit;
        }

        setPosition(x, y) {
            this.x = x;
            this.y = y;

            if (this.bgSprite !== undefined && this.barSprite !== undefined) {
                this.bgSprite.position.x = x;
                this.bgSprite.position.y = y;

                this.barSprite.position.x = x - this.config.width / 2;
                this.barSprite.position.y = y;
            }
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
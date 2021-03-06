module TacticArena.UI {
    export class Dialog {
        //element;
        parentGame;
        state;
        game;

        constructor(state) {
            var self = this;
            this.state = state;
            this.game = state.game;
            this.game.modals = {};

            this.createModal({
                type: "modal1",
                includeBackground: true,
                fixedToCamera: true,
                itemsArr: [
                    {
                        type: "image",
                        content: "background-modal",
                        offsetY: -50,
                        contentScale: 1
                    },
                    {
                        type: "text",
                        content: "Pause",
                        fontFamily: "Press Start 2P",
                        fontSize: 21,
                        color: "0x000000",
                        offsetY: -225
                    },
                    {
                        type: "button",
                        atlasParent: "small-button",
                        content: "background-button",
                        buttonHover: "background-button-hover",
                        offsetY: -90,
                        contentScale: 0.7,
                        callback: function () {
                            self.state.uiManager.ingamemenuUI.close();
                        }
                    },
                    {
                        type: "text",
                        content: "Resume",
                        fontFamily: "Press Start 2P",
                        fontSize: 18,
                        color: "0x000000",
                        offsetY: -90
                    },
                    {
                        type: "button",
                        atlasParent: "small-button",
                        content: "background-button",
                        buttonHover: "background-button-hover",
                        offsetY: 0,
                        contentScale: 0.7,
                        callback: function () {
                            self.game.state.start('menu');
                        }
                    },
                    {
                        type: "text",
                        content: "Quit",
                        fontFamily: "Press Start 2P",
                        fontSize: 18,
                        color: "0x000000",
                        offsetY: 0
                    },
                ]
            });
        }

        createModal(options) {
            var self = this;
            var type = options.type || ''; // must be unique
            var includeBackground = options.includeBackground; // maybe not optional
            var backgroundColor = options.backgroundColor || "0x000000";
            var backgroundOpacity = options.backgroundOpacity === undefined ? 0.7 : options.backgroundOpacity;
            var modalCloseOnInput = options.modalCloseOnInput || false;
            var modalBackgroundCallback = options.modalBackgroundCallback || false;
            var vCenter = options.vCenter || true;
            var hCenter = options.hCenter || true;
            var itemsArr = options.itemsArr || [];
            var fixedToCamera = options.fixedToCamera || false;

            var modal;
            var modalGroup = this.game.add.group();
            this.state.worldGroup.add(modalGroup);
            if (fixedToCamera === true) {
                modalGroup.fixedToCamera = true;
                modalGroup.cameraOffset.x = 0;
                modalGroup.cameraOffset.y = 0;
            }

            if (includeBackground === true) {
                modal = this.game.add.graphics(this.game.width, this.game.height);
                modal.beginFill(backgroundColor, backgroundOpacity);
                modal.x = 0;
                modal.y = 0;

                modal.drawRect(0, 0, this.game.width, this.game.height);

                if (modalCloseOnInput === true) {

                    var innerModal = this.game.add.sprite(0, 0);
                    innerModal.inputEnabled = true;
                    innerModal.width = this.game.width;
                    innerModal.height = this.game.height;
                    innerModal.type = type;
                    innerModal.input.priorityID = 0;
                    innerModal.events.onInputDown.add(function (e, pointer) {
                        this.hideModal(e.type);
                    }, self, 2);

                    modalGroup.add(innerModal);
                } else {

                    modalBackgroundCallback = true;
                }
            }

            if (modalBackgroundCallback) {
                var _innerModal = this.game.add.sprite(0, 0);
                _innerModal.inputEnabled = true;
                _innerModal.width = this.game.width;
                _innerModal.height = this.game.height;
                _innerModal.type = type;
                _innerModal.input.priorityID = 0;

                modalGroup.add(_innerModal);
            }

            if (includeBackground) {
                modalGroup.add(modal);
            }

            var modalLabel;
            for (var i = 0; i < itemsArr.length; i += 1) {
                var item = itemsArr[i];
                var itemType = item.type || 'text';
                var itemColor = item.color || 0x000000;
                var itemFontfamily = item.fontFamily || 'Arial';
                var itemFontSize = item.fontSize || 32;
                var itemStroke = item.stroke || '0x000000';
                var itemStrokeThickness = item.strokeThickness || 0;
                var itemAlign = item.align || 'center';
                var offsetX = item.offsetX || 0;
                var offsetY = item.offsetY || 0;
                var contentScale = item.contentScale || 1;
                var content = item.content || "";
                var callback = item.callback || false;
                var textAlign = item.textAlign || "left";
                var atlasParent = item.atlasParent || "";
                var buttonHover = item.buttonHover || content;
                var buttonActive = item.buttonActive || content;
                var graphicColor = item.graphicColor || 0xffffff;
                var graphicOpacity = item.graphicOpacity || 1;
                var graphicW = item.graphicWidth || 200;
                var graphicH = item.graphicHeight || 200;
                var graphicRadius = item.graphicRadius || 0;
                var lockPosition = item.lockPosition || false;

                var itemAnchor = item.anchor || {x: 0, y: 0};
                var itemAngle = item.angle || 0;
                var itemX = item.x || 0;
                var itemY = item.y || 0;
                var imageFrame = item.frame || null;
                var tileSpriteWidth = item.tileSpriteWidth || this.game.width;
                var tileSpriteHeight = item.tileSpriteHeight || this.game.height;

                modalLabel = null;

                if (itemType === "text" || itemType === "bitmapText") {
                    if (itemType === "text") {
                        var re = new RegExp(/[\{\}]/, 'g');
                        var arrOfBold = [];
                        var newLineOffset = 0;
                        if (content.match(re) !== null) {
                            for (var k = 0; k < content.length; k++) {
                                var boldStartPos = content[k].indexOf('{');
                                var boldEndPos = content[k].indexOf('}');
                                var lengthOfString = content[k].match(/(\r\n|\n|\r)/);
                                if (lengthOfString !== null) {
                                    newLineOffset += 1;
                                }
                                if (boldStartPos != -1 || boldEndPos != -1) {
                                    arrOfBold.push(k - newLineOffset);
                                }
                            }
                            content = content.replace(re, "");
                        }
                        modalLabel = this.game.make.text(0, 0, content, {
                            font: itemFontSize + 'px ' + itemFontfamily,
                            fill: "#" + String(itemColor).replace("0x", ""),
                            stroke: "#" + String(itemStroke).replace("0x", ""),
                            strokeThickness: itemStrokeThickness,
                            align: itemAlign
                        });
                        modalLabel.contentType = 'text';
                        modalLabel.update();
                        var indexMissing = 0;
                        for (var j = 0; j < arrOfBold.length; j += 2) {
                            modalLabel.addFontWeight("bold", arrOfBold[j] - indexMissing);
                            modalLabel.addFontWeight("normal", arrOfBold[j + 1] - indexMissing);
                            indexMissing += 2;
                        }
                        modalLabel.x = (this.state.centerX - (modalLabel.width / 2)) + offsetX;
                        modalLabel.y = (this.state.centerY - (modalLabel.height / 2)) + offsetY;
                    } else {
                        modalLabel = this.game.make.bitmapText(0, 0, itemFontfamily, String(content), itemFontSize);
                        modalLabel.contentType = 'bitmapText';
                        modalLabel.align = textAlign;
                        modalLabel.updateText();
                        modalLabel.x = (this.state.centerX - (modalLabel.width / 2)) + offsetX;
                        modalLabel.y = (this.state.centerY - (modalLabel.height / 2)) + offsetY;
                    }

                } else if (itemType === "image") {
                    modalLabel = this.game.make.image(0, 0, content);
                    modalLabel.scale.setTo(contentScale, contentScale);
                    modalLabel.contentType = 'image';
                    modalLabel.x = (this.state.centerX - ((modalLabel.width) / 2)) + offsetX;
                    modalLabel.y = (this.state.centerY - ((modalLabel.height) / 2)) + offsetY;
                } else if (itemType === "tileSprite") {
                    modalLabel = this.game.make.tileSprite(itemX, itemY,
                        tileSpriteWidth, tileSpriteHeight, content, imageFrame);
                    modalLabel.scale.setTo(contentScale, contentScale);
                    modalLabel.anchor.setTo(itemAnchor.x, itemAnchor.y);
                    modalLabel.angle = itemAngle;
                    modalLabel.contentType = 'tileSprite';
                } else if (itemType === "sprite") {
                    modalLabel = this.game.make.sprite(0, 0, atlasParent, content);
                    modalLabel.scale.setTo(contentScale, contentScale);
                    modalLabel.contentType = 'sprite';
                    modalLabel.x = (this.state.centerX - ((modalLabel.width) / 2)) + offsetX;
                    modalLabel.y = (this.state.centerY - ((modalLabel.height) / 2)) + offsetY;
                } else if (itemType === "button") {
                    modalLabel = this.game.make.button(0, 0, atlasParent, callback,
                        this, buttonHover, content, buttonActive, content);
                    modalLabel.scale.setTo(contentScale, contentScale);
                    modalLabel.contentType = 'button';
                    modalLabel.x = (this.state.centerX - ((modalLabel.width) / 2)) + offsetX;
                    modalLabel.y = (this.state.centerY - ((modalLabel.height) / 2)) + offsetY;
                } else if (itemType === "graphics") {
                    modalLabel = this.game.make.graphics(graphicW, graphicH);
                    modalLabel.beginFill(graphicColor, graphicOpacity);
                    if (graphicRadius <= 0) {
                        modalLabel.drawRect(0, 0, graphicW, graphicH);
                    } else {
                        modalLabel.drawRoundedRect(0, 0, graphicW, graphicH, graphicRadius);
                    }
                    modalLabel.endFill();
                    modalLabel.x = (this.state.centerX - ((modalLabel.width) / 2)) + offsetX;
                    modalLabel.y = (this.state.centerY - ((modalLabel.height) / 2)) + offsetY;
                }

                modalLabel["_offsetX"] = 0;
                modalLabel["_offsetY"] = 0;
                modalLabel.lockPosition = lockPosition;
                modalLabel._offsetX = offsetX;
                modalLabel._offsetY = offsetY;

                if (callback !== false && itemType !== "button") {
                    modalLabel.inputEnabled = true;
                    modalLabel.pixelPerfectClick = true;
                    modalLabel.priorityID = 10;
                    modalLabel.events.onInputDown.add(callback, modalLabel);
                }

                if (itemType !== "bitmapText" && itemType !== "graphics") {
                    modalLabel.bringToTop();
                    modalGroup.add(modalLabel);
                    modalLabel.bringToTop();
                    modalGroup.bringToTop(modalLabel);
                } else {
                    modalGroup.add(modalLabel);
                    modalGroup.bringToTop(modalLabel);
                }
            }

            modalGroup.visible = false;
            this.game.modals[type] = modalGroup;
        }

        updateModalValue(value, type, index, id) {
            var item;
            if (index !== undefined && index !== null) {
                item = this.game.modals[type].getChildAt(index);
            } else if (id !== undefined && id !== null) {

            }

            if (item.contentType === "text") {
                item.text = value;
                item.update();
                if (item.lockPosition === true) {

                } else {
                    item.x = (this.state.centerX - (item.width / 2)) + item._offsetX;
                    item.y = (this.state.centerY - (item.height / 2)) + item._offsetY;
                }
            } else if (item.contentType === "bitmapText") {
                item.text = value;
                item.updateText();
                if (item.lockPosition === true) {

                } else {
                    item.x = (this.state.centerX - (item.width / 2)) + item._offsetX;
                    item.y = (this.state.centerY - (item.height / 2)) + item._offsetY;
                }
            } else if (item.contentType === "image") {
                item.loadTexture(value);
            }
        }

        getModalItem(type, index) {
            return this.game.modals[type].getChildAt(index);
        }

        showModal(type) {
            this.game.world.bringToTop(this.game.modals[type]);
            this.game.modals[type].visible = true;
            this.state.process = true;
            // you can add animation here
        }

        hideModal(type) {
            this.game.modals[type].visible = false;
            this.state.process = false;
            // you can add animation here
        }

        destroyModal(type) {
            this.game.modals[type].destroy();
            delete this.game.modals[type];
        }
    }
}

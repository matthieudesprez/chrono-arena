module TacticArena.Entity {
    export class Pawn {
        game;
        _id;
        _name;
        _ap;
        _hp;
        _mp;
        _apMax;
        _hpMax;
        _mpMax;
        type;
        selected;
        team;
        spriteClass:typeof Entity.Sprite;
        skills;
        position:Position; // during Order Phase = initial position, during Resolve Phase = current step position (TODO beware of moved)
        direction; // during Order Phase = initial direction, during Resolve Phase = current step direction

        constructor(game, x, y, direction, type, id, team, name = "", spriteClass:typeof Entity.Sprite = Entity.Sprite) {
            this.game = game;
            this._id = id;
            this._name = name;
            this.type = type;
            this.position = new Position(x, y);
            this.direction = direction;
            let tint = null; //team != this.game.playerTeam ? this.game.teamColors[team-1] : null;
            //TODO séparer pawn et sprite pour avoir des pawns serializable (sans le game de phaser)
            this.spriteClass = spriteClass;
            this._hp = 4;
            this._ap = 0;
            this._mp = 0;
            this._hpMax = 4;
            this._apMax = 3;
            this._mpMax = 2;
            this.selected = false;
            this.team = team;
            this.skills = [];
        }

        isAlive() {
            return this._hp > 0;
        }

        destroyProjection() {
            this.game.spritesManager.destroyProjection(this);
        }

        getPosition() {
            return this.position;
        }

        setPosition(position) {
            this.position = position;
        }

        getDirection() {
            return this.direction;
            //return this.game.spritesManager.sprites[this._id]._ext;
        }

        setDirection(direction) {
            this.direction = direction;
        }

        getAp() {
            return this._ap;
        }

        setAp(ap, dispatch=true) {
            this._ap = ap;
            if(dispatch) {
                this.game.signalManager.onApChange.dispatch(this);
            }
        }

        getMp() {
            return this._mp;
        }

        setMp(mp, dispatch=true) {
            this._mp = mp;
            if(dispatch) {
                this.game.signalManager.onMpChange.dispatch(this);
            }
        }

        getHp() {
            return this._hp;
        }

        setHp(hp, forceAnimation=false) {
            if ((this.isAlive() || forceAnimation) && hp <= 0) {
                this.game.spritesManager.sprites[this._id].die();
            }
            this._hp = (hp > this._hpMax) ? this._hpMax : hp;
            this.game.signalManager.onHpChange.dispatch(this);
        }

        export() {
            return {
                _id: this._id,
                direction: this.direction,
                position: this.position,
                hp: this.getHp(),
                name: this._name,
                type: this.type,
                spriteClass: this.spriteClass
            }
        }
    }
}

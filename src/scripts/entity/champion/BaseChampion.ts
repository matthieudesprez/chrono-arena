module TacticArena.Champion {
    export class BaseChampion {
        state;
        _id: number;
        _name: string;
        _ap: number;
        _hp: number;
        _mp: number;
        _apMax: number;
        _hpMax: number;
        _mpMax: number;
        type: string;
        team: number;
        spriteClass: typeof Sprite.BaseSprite;
        skills: Skill.BaseSkill[];
        position: Position; // during Order Phase = initial position, during Resolve Phase = current step position (TODO beware of moved -> see ResolveManager)
        direction; // during Order Phase = initial direction, during Resolve Phase = current step direction

        constructor(state, x, y, direction, type, id, team, name = "", spriteClass: typeof Sprite.BaseSprite = Sprite.BaseSprite) {
            this.state = state;
            this._id = id;
            this._name = name;
            this.type = type;
            this.position = new Position(x, y);
            this.direction = direction;
            this.spriteClass = spriteClass;
            this._hp = 4;
            this._ap = 0;
            this._mp = 0;
            this._hpMax = 4;
            this._apMax = 3;
            this._mpMax = 2;
            this.team = team;
            this.skills = [];
        }

        isAlive() {
            return this._hp > 0;
        }

        getPosition() {
            return this.position;
        }

        setPosition(position) {
            this.position = position;
        }

        getDirection() {
            return this.direction;
        }

        setDirection(direction) {
            this.direction = direction;
        }

        getAp() {
            return this._ap;
        }

        setAp(ap, dispatch = true) {
            this._ap = ap;
            if (dispatch) {
                this.state.signalManager.onApChange.dispatch(this);
            }
        }

        getMp() {
            return this._mp;
        }

        setMp(mp, dispatch = true) {
            this._mp = mp;
            if (dispatch) {
                this.state.signalManager.onMpChange.dispatch(this);
            }
        }

        getHp() {
            return this._hp;
        }

        setHp(hp, forceAnimation = false) {
            this._hp = (hp > this._hpMax) ? this._hpMax : hp;
            this.state.signalManager.onHpChange.dispatch(this, forceAnimation);
        }
    }
}

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
        playerId: number;
        spriteClass: typeof Sprite.BaseSprite;
        skills: Skill.BaseSkill[];
        position: Position; // during Order Phase = initial position, during Resolve Phase = current step position

        constructor(state, position: Position, type, id, team, name = "", spriteClass: typeof Sprite.BaseSprite = Sprite.BaseSprite) {
            this.state = state;
            this._id = id;
            this._name = name;
            this.type = type;
            this.position = position.clone();
            this.spriteClass = spriteClass;
            this._hp = 4;
            this._ap = 0;
            this._mp = 0;
            this._hpMax = 4;
            this._apMax = 3;
            this._mpMax = 2;
            this.playerId = team;
            this.skills = [];
        }

        isAlive() {
            return this._hp > 0;
        }

        getPosition() {
            return this.position;
        }

        setPosition(position) {
            this.position.set(position);
        }

        getDirection() {
            return this.position.d;
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

        setHp(hp, triggerDispatchMenu = false, triggerDispatchAnimation = false, forceAnimation = false) {
            this._hp = (hp > this._hpMax) ? this._hpMax : hp;
            if(triggerDispatchMenu) {
                this.state.signalManager.onHpChangeMenu.dispatch(this);
            }
            if(triggerDispatchAnimation) {
                this.state.signalManager.onHpChangeAnimation.dispatch(this, forceAnimation);
            }
        }
    }
}

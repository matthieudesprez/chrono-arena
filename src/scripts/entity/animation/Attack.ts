module TacticArena.Animation {
    export class Attack extends BaseAnimation {
        target;

        constructor(pawn, target) {
            super(pawn);
            this.target = target;
        }

        get() {
            return this.pawn.attack(this.target).then((res) => {
                return res;
            });
        }
    }
}

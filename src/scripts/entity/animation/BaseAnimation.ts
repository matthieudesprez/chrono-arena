module TacticArena.Animation {
    export abstract class BaseAnimation {
        state:State.BasePlayable; // reference to current state, BasePlayable because can be played outside a battle
        pawn:Champion.BaseChampion; // pawn doing the animation
        order:Order.BaseOrder; // origin of the action

        constructor(state:State.BasePlayable, pawn:Champion.BaseChampion, order:Order.BaseOrder) {
            this.state = state;
            this.pawn = pawn;
            this.order = order;
        }

        get():Promise<any> {
            return null;
        }

        handleBackward(animation:Promise<any>):Promise<any> {
            let result;
            let spritePosition:Position = this.state.spritesManager.getReal(this.pawn).getPosition();
            if (!spritePosition.equals(this.order.position)) {
                result = this.state.spritesManager.getReal(this.pawn).moveTo(this.order.position.x, this.order.position.y, null, false);
                result.then((res) => {
                    return animation;
                });
            } else {
                result = animation;
            }
            return result;
        }
    }
}

module TacticArena.Animation {
    export class Die extends BaseAnimation {

        get(): Promise<any> {
            return new Promise((resolve, reject) => {
                // No more dying animation from here because it would happen too soon (before cast animations) in the step resolving
                // It's played in the onHpChange signal after the Promises.all() from the ResolveManager
                resolve(true);
            });
        }
    }
}

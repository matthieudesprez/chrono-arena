module TacticArena.UI {
    export class Dialog {
        menu;
        element;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            $('body').append('<div id="dialog-confirm" class="ui-dialog" title=""><p></p></div>');
            this.element = $('#dialog-confirm');
        }

        show(title, message, confirmTitle, cancelTitle, confirmFunction, cancelFunction) {
            console.log('show');
            $("#dialog-confirm").attr('title', title);
            $("#dialog-confirm p").html(message);
            $("#dialog-confirm").dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: [
                    {
                        text: confirmTitle,
                        click: confirmFunction
                    },
                    {
                        text: cancelTitle,
                        click: cancelFunction
                    }
                ]
            });
        }
    }
}

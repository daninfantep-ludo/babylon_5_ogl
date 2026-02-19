export default class babylon_5_ogl_hojaItem extends foundry.applications.sheets.ItemSheetV2 {

    static DEFAULT_OPTIONS = {
        classes: ["babylon_5_ogl", "sheet", "item"],
        position: {
            width: 580,
            height: 500
        },
        window: {
            resizable: true
        }
    };

    static PARTS = {
        sheet: {
            template: "systems/babylon_5_ogl/html/item_caracteristica_sheet.hbs"
        }
    };

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        
        // Use a safe clone of the item data for further operations.
        const itemData = this.document.toObject(false);

        context.system = itemData.system;
        context.flags = itemData.flags;
        context.document = this.document;
        
        return context;
    }

    getItemOnItemId(event)
    {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.document.items.get(itemId);
        return item;
    }

}

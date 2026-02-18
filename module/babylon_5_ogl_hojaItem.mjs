export default class babylon_5_ogl_hojaItem extends ItemSheet{

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
          classes: ["babylon_5_ogl", "sheet", "item"]
          ,tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "general" }]
          ,width: 580
          ,height: 500
        });
      }

    get template(){
        const path = 'systems/babylon_5_ogl/html';
        
        return path + '/item_' + this.item.type +'_sheet.hbs';
    }
    getData()
    {
        const data = super.getData();
//        data.config = CONFIG.ad6_robotech;
        // Use a safe clone of the item data for further operations.
        const itemData = this.document.toObject(false);

        data.system = itemData.system;
        data.flags = itemData.flags;

        return data;
    }

    getItemOnItemId(event)
    {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        return item;
    }


}
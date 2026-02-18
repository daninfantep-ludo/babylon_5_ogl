export default class babylon_5_ogl_hojaPersonaje extends ActorSheet{
    
    static get defaultOptions() {
  
        
        return foundry.utils.mergeObject(super.defaultOptions, {
          classes: ["babylon-", "sheet", "actor"],
          template: "systems/babylon_5_ogl/html/babylon_5_ogl_PJ.hbs",
          width: 890,
          height: 890,                    
          scrollY:[".habs-scroll"],
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }]
        });
        

    }

    get template(){
        switch(this.actor.type)
        {
            case "PJ": this.position.height = 890; break;
            case "PNJ": this.position.height = 550; break;
            case "Nave": this.position.height = 620; break;
            default: this.position.height=890;
        }

        const path = 'systems/babylon_5_ogl/html';
        return path + '/babylon_5_ogl_' + this.actor.type +'.hbs';
    }


    getData()
    {
        const data = super.getData();
        data.config = CONFIG.babylon_5_ogl;


        data.system = this.actor.system;
        data.caracteristicas = this.actor.items.filter(function(item){return item.type=="caracteristica"});
        data.habilidades = this.actor.items.filter(function(item){return item.type=="habilidad"});
        data.salvaciones = this.actor.items.filter(function(item){return item.type=="salvacion"});

        data.type = this.actor.type;
        data.flags = this.actor.flags;


        return data;
       
        
    }

    activateListeners(html)
    {
        super.activateListeners(html);
        html.find(".change").change(this._onTextChange.bind(this));     
        html.find(".carac-roll").click(this._onRollCarac.bind(this));    
        html.find(".chkClick").click(this._chkClick.bind(this));   

    }

    _chkClick(event)
    {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let target = element.closest(".item").dataset.target;
        let item = this.actor.items.get(itemId);

        if(target=="system.de_clase"){
            item.update({"system.de_clase":!item.system.de_clase});
        }
    }

    async _onTextChange(event)
    {
        // como los itemes embebidos se modifican en línea (en la misma hoja) es necesario poner un on text change para que cambie el valor del item
        // porque no es de la hoja, es de una lista

        // ojo: es acá, cuando cambie un valor temporal, que se deba recalcular el modificador y todos los modificadores de habilidad
        // de las habilidades correspondientes
        const skillsTab = this.element.find('.tab[data-tab="habilidades"]')[0];
        const scrollPos = skillsTab ? skillsTab.scrollTop : 0;


        let item = this.getItemOnItemId(event);
        let element = event.currentTarget;
        let field = element.closest(".item").dataset.field;   
        let updated = null;
        console.log(element.closest(".item").dataset);
        console.log("-",element);
        console.log("-",event.target.value);
        console.log("-",field);
        console.log("-",item.type);
        switch(item.type)
        {
            case "caracteristica":
                switch(field)
                {
                    case "system.valor":
                        item.update({"system.valor":parseInt(event.target.value) ||0, 
                                        "system.mod":this.abilityModifier(event.target.value)}); 
                        break;
                    case "system.valor_tmp":
                        item.update({"system.valor_tmp":event.target.value}); 
                        await item.update({"system.mod_tmp":this.abilityModifier(event.target.value)}); 
                        updated = this.actor.items.get(item.id);
                        this.actualizarSalvaciones(updated);
                        this.actualizarHabilidades(updated);
                        break;
                }
                break;
            case "salvacion": 
                switch(field)
                {
                  case "system.mod_clase":
                        await item.update({"system.mod_clase":parseInt(event.target.value) ||0});
                    break;
                    case "system.mod_miscelaneo":
                        await item.update({"system.mod_miscelaneo":parseInt(event.target.value) ||0});
                    break; 
                }
                updated = this.actor.items.get(item.id);
                await updated.update({"system.mod":this.sumarSalvacion(updated)});
                break;
            case "habilidad":
                switch(field)
                {
                  case "system.mod_otros":
                        await item.update({"system.mod_otros":parseInt(event.target.value) ||0});
                    break;
                  case "system.de_clase":
                    await item.update({"system.de_clase":parseInt(event.target.value) ||0});
                    break;
                  case "system.mod_rangos":
                    await item.update({"system.mod_rangos":parseInt(event.target.value) ||0});
                    break; 
                  case "system.descriptor":
                    
                    await item.update({"system.descriptor":event.target.value});
                    break
                }
                    updated = this.actor.items.get(item.id);
                    await updated.update({"system.mod":this.sumarHabilidad(updated)});
                break;
        }

          setTimeout(() => {
                if (skillsTab) skillsTab.scrollTop = scrollPos;
            }, 50);
    }

    async actualizarHabilidades(item)
    {
        let habilidades = this.actor.items.filter(function(item){return (item.type=="habilidad")});
        
        for(const hab of habilidades)
        {   
            if(hab.system.caracteristica == item.system.abrevia)
            {
                await hab.update({"system.mod_caracteristica":parseInt(item.system.mod_tmp)});
                let updated = this.actor.items.get(hab.id);
                await updated.update({"system.mod":this.sumarHabilidad(updated)});
            }
        }
    }
    sumarHabilidad(item)
    {
        let total = 0;
        total = Number(item.system?.mod_rangos??0) + Number(item.system?.mod_caracteristica??0) + Number(item.system?.mod_otros??0); 
        return total;
    }

    async actualizarSalvaciones(item)
    {
        let salvaciones = this.actor.items.filter(function(item){return (item.type=="salvacion")});
        
        for(const salva of salvaciones)
        {   
            if(salva.system.caracteristica == item.system.abrevia)
            {
                await salva.update({"system.mod_caracteristica":parseInt(item.system.mod_tmp)});
                let updated = this.actor.items.get(salva.id);
                await updated.update({"system.mod":this.sumarSalvacion(updated)});
            }
        }

    }
    sumarSalvacion(item)
    {
        let total = 0;
        total = Number(item.system?.mod_clase??0) + Number(item.system?.mod_caracteristica??0) + Number(item.system?.mod_miscelaneo??0); 
        return total;
    }

    getItemOnItemId(event)
    {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = null;
        item = this.actor.items.get(itemId);
        return item;
    }

    abilityModifier(score) 
    {
        if (score < 1) score = 1;  // Mínimo 1 según reglas [file:1]
        return Math.floor((score - 10) / 2);
    }



    async _onRollCarac(event) {
        event.preventDefault();

        const element = event.currentTarget.closest(".item");
        const itemId = element.dataset.itemId;
        const item = this.actor.items.get(itemId);
        
        if (!item) return;

        let  label = item.name || element.dataset.label || "Característica";
        let mod = 0;
        switch(item.type)
        {
            case "caracteristica":
                mod = Number(item.system?.mod_tmp ?? 0);
                break;
            case "salvacion","habilidad":
                mod = Number(item.system?.mod ?? 0);
                if(item.type=="habilidad")
                {
                    if(item.system.usa_descriptor)
                        label = label + " [" + item.system.descriptor + "]";

                }
                break
        }
        

        // ✅ V12: Sin opciones async
        const roll = new Roll("1d20 + @mod", { mod });
        await roll.evaluate();  // ← Solo esto

        // Chat message
        const speaker = ChatMessage.getSpeaker({ actor: this.actor });
        await ChatMessage.create({
            speaker,
            flavor: `Prueba de ${label}`,
            roll: roll,  // ← Añade el roll completo
            content: `<strong>${label}</strong>: 1d20 [${roll.dice[0].results[0].result}]${mod >= 0 ? "+" : ""}${mod} = <strong>${roll.total}</strong>`,
            sound: "sounds/dice.wav"
        });
        }


}
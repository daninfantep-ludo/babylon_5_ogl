export default class babylon_5_ogl_hojaPersonaje extends foundry.applications.sheets.ActorSheetV2 {
    
    static DEFAULT_OPTIONS = {
        classes: ["babylon-", "sheet", "actor"],
        position: {
            width: 890,
            height: 890
        },
        actions: {
            rollCarac: this.prototype._onRollCarac,
            chkClick: this.prototype._chkClick,
            textChange: this.prototype._onTextChange
        },
        window: {
            resizable: true
        },
        form: {
            closeOnSubmit: false,
            submitOnChange: true
        }
    };

    static PARTS = {
        sheet: {
            template: "systems/babylon_5_ogl/html/babylon_5_ogl_PJ.hbs",
            scrollable: [".habs-scroll"]
        }
    };

    // Get the correct template path based on actor type
    _getPartTemplate(partId) {
        if (partId === "sheet") {
            const templatePath = `systems/babylon_5_ogl/html/babylon_5_ogl_${this.document.type}.hbs`;
            console.log("Loading template:", templatePath);
            return templatePath;
        }
        return super._getPartTemplate(partId);
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        
        // Set window height based on actor type
        switch(this.document.type) {
            case "PJ": 
                this.options.position.height = 890; 
                break;
            case "PNJ": 
                this.options.position.height = 550; 
                break;
            case "Nave": 
                this.options.position.height = 620; 
                break;
            default: 
                this.options.position.height = 890;
        }
        
        return context;
    }

    async _preparePartContext(partId, context, options) {
        context = await super._preparePartContext(partId, context, options);
        
        // Prepare context for the sheet part
        if (partId === "sheet") {
            context.config = CONFIG.babylon_5_ogl;
            context.system = this.document.system;
            context.caracteristicas = this.document.items.filter(item => item.type === "caracteristica");
            context.habilidades = this.document.items.filter(item => item.type === "habilidad");
            context.salvaciones = this.document.items.filter(item => item.type === "salvacion");
            context.type = this.document.type;
            context.flags = this.document.flags;
        }
        
        return context;
    }

    _onRender(context, options) {
        super._onRender(context, options);
        
        // Add event listeners
        this.element.querySelectorAll(".change").forEach(el => {
            el.addEventListener("change", this._onTextChange.bind(this));
        });
        
        this.element.querySelectorAll(".carac-roll").forEach(el => {
            el.addEventListener("click", this._onRollCarac.bind(this));
        });
        
        this.element.querySelectorAll(".chkClick").forEach(el => {
            el.addEventListener("click", this._chkClick.bind(this));
        });
    }

    _chkClick(event)
    {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let target = element.closest(".item").dataset.target;
        let item = this.document.items.get(itemId);

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
        const skillsTab = this.element.querySelector('.tab[data-tab="habilidades"]');
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
                        updated = this.document.items.get(item.id);
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
                updated = this.document.items.get(item.id);
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
                    updated = this.document.items.get(item.id);
                    await updated.update({"system.mod":this.sumarHabilidad(updated)});
                break;
        }

          setTimeout(() => {
                if (skillsTab) skillsTab.scrollTop = scrollPos;
            }, 50);
    }

    async actualizarHabilidades(item)
    {
        let habilidades = this.document.items.filter(function(item){return (item.type=="habilidad")});
        
        for(const hab of habilidades)
        {   
            if(hab.system.caracteristica == item.system.abrevia)
            {
                await hab.update({"system.mod_caracteristica":parseInt(item.system.mod_tmp)});
                let updated = this.document.items.get(hab.id);
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
        let salvaciones = this.document.items.filter(function(item){return (item.type=="salvacion")});
        
        for(const salva of salvaciones)
        {   
            if(salva.system.caracteristica == item.system.abrevia)
            {
                await salva.update({"system.mod_caracteristica":parseInt(item.system.mod_tmp)});
                let updated = this.document.items.get(salva.id);
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
        item = this.document.items.get(itemId);
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
        const item = this.document.items.get(itemId);
        
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
        const speaker = ChatMessage.getSpeaker({ actor: this.document });
        await ChatMessage.create({
            speaker,
            flavor: `Prueba de ${label}`,
            roll: roll,  // ← Añade el roll completo
            content: `<strong>${label}</strong>: 1d20 [${roll.dice[0].results[0].result}]${mod >= 0 ? "+" : ""}${mod} = <strong>${roll.total}</strong>`,
            sound: "sounds/dice.wav"
        });
        }


}
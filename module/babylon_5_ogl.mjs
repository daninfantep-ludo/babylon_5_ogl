import babylon_5_ogl_hojaPersonaje from './babylon_5_ogl_hojaPersonaje.mjs';
import babylon_5_ogl_hojaItem from './babylon_5_ogl_hojaItem.mjs';

// al crear un PJ, asignarle la lista de habilidades que corresponden
// la lista de habilidades vive aquí porque soy pajero

Hooks.on("createActor", async (actor, options, userId) => {
  // Solo para actores de tipo "character", por ejemplo
  if (actor.type !== "PJ") return;
  console.log(actor);
  // Lista de características de la hoja para un PJ

  const CARACTERISTICAS = [
    {name: "Fuerza", type: "Característica", system:{abrevia:"FUE"}},
    {name: "Destreza", type: "Característica", system:{abrevia:"DES"}},
    {name: "Constitución", type: "Característica", system:{abrevia:"CON"}},
    {name: "Inteligencia", type: "Característica", system:{abrevia:"INT"}},
    {name: "Sabiduría", type: "Característica", system:{abrevia:"SAB"}},
    {name: "Carisma", type: "Característica", system:{abrevia:"CAR"}},

  ];
  // Crea los items embebidos en el actor
  await actor.createEmbeddedDocuments("Item", CARACTERISTICAS);

  //Crea las tiradas de salvación para el personaje
  const SALVACION = [
    {name:"Fortaleza", type:"Salvación", system:{caracteristica:"CON"}},
    {name:"Reflejos", type:"Salvación", system:{caracteristica:"DES"}},
    {name:"Voluntad", type:"Salvación", system:{caracteristica:"SAB"}}
  ];
  // Crea los items embebidos en el actor
  await actor.createEmbeddedDocuments("Item", SALVACION);

  // Lista de habilidades de la hoja para un PJ
  // faltan las de saber, operaciones y profesión que estarán en compedios o 
  // se crearán directamente en la hoja, porque además son todas que no se usan
  // entrenadas, así que tampoco tiene sentido que estén
  const HABILIDADES = [
    { name: "Acrobacias", type: "Habilidad", system: {  caracteristica: "DES", pen_armadura: true} },
    { name: "Atletismo", type: "Habilidad", system: {  caracteristica: "FUE", pen_armadura:true} },
    { name: "Computadoras", type: "Habilidad", system: {  caracteristica: "INT"} },
    { name: "Concentración", type: "Habilidad", system: {  caracteristica: "CON"} },
    { name: "Conducir", type: "Habilidad", system: {  caracteristica: "DES", pen_armadura:true} },
    { name: "Descubrir", type: "Habilidad", system: {  caracteristica: "SAB"} },
    { name: "Diplomacia", type: "Habilidad", system: {  caracteristica: "CAR"} },
    { name: "Engañar", type: "Habilidad", system: {  caracteristica: "CAR"} },
    { name: "Intimidar", type: "Habilidad", system: {  caracteristica: "CAR"} },
    { name: "Intriga", type: "Habilidad", system: {  caracteristica: "CAR"} },
    { name: "Investigar", type: "Habilidad", system: {  caracteristica: "INT"} },
    { name: "Linguística", type: "Habilidad", system: {  caracteristica: "INT"} },
    { name: "Medicina", type: "Habilidad", system: {  caracteristica: "INT", solo_entrenada: true} },
    { name: "Operaciones", type: "Habilidad", system: {  caracteristica: "INT", solo_entrenada:true, usa_descriptor:true } },
    { name: "Operaciones", type: "Habilidad", system: {  caracteristica: "INT", solo_entrenada:true, usa_descriptor:true } },
    { name: "Operaciones", type: "Habilidad", system: {  caracteristica: "INT", solo_entrenada:true, usa_descriptor:true } },
    { name: "Perspicacia", type: "Habilidad", system: {  caracteristica: "SAB"} },    
    { name: "Pilotar", type: "Habilidad", system: {  caracteristica: "DES", pen_armadura:true } },
    { name: "Profesión", type: "Habilidad", system: {  caracteristica: "INT", solo_entrenada:true, usa_descriptor:true } },
    { name: "Profesión", type: "Habilidad", system: {  caracteristica: "SAB", solo_entrenada:true, usa_descriptor:true } },
    { name: "Profesión", type: "Habilidad", system: {  caracteristica: "CAR", solo_entrenada:true, usa_descriptor:true } },
    { name: "Saber", type: "Habilidad", system: {  caracteristica: "INT",de_clase: true, usa_descriptor:true, descriptor:"Cultura propia"} },
    { name: "Saber", type: "Habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true } },
    { name: "Saber", type: "Habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true } },
    { name: "Saber", type: "Habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true } },
    { name: "Saber", type: "Habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true } },
    { name: "Saber", type: "Habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true } },
    { name: "Sigilo", type: "Habilidad", system: {  caracteristica: "DES", pen_armadura: true} },
    { name: "Subterfugio", type: "Habilidad", system: {  caracteristica: "DES"} },
    { name: "Tasación", type: "Habilidad", system: {  caracteristica: "INT"} },
    { name: "Técnica", type: "Habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true, descriptor:"Electrónica" } },
    { name: "Técnica", type: "Habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true, descriptor:"Ingeniería" } },
    { name: "Técnica", type: "Habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true, descriptor:"Mecánica" } },
    { name: "Telepatía", type: "Habilidad", system: {  caracteristica: "CAR", solo_entrenada:true} }

  ];

  // Crea los items embebidos en el actor
  await actor.createEmbeddedDocuments("Item", HABILIDADES);
});

// Validate that only one Raza item exists per PJ
Hooks.on("preCreateItem", async (item, options, userId) => {
  // Only validate if item is being created in a PJ actor
  if (item.parent?.type !== "PJ") return;
  
  // Check if trying to create a Raza item
  if (item.type !== "Raza") return;
  
  // Check if a Raza item already exists
  const existingRaza = item.parent.items.find(i => i.type === "Raza");
  
  if (existingRaza) {
    ui.notifications.warn("Un personaje solo puede tener una raza. Elimina la anterior primero.");
    return false;
  }
});


Hooks.once("init", function(){
    console.log("BABYLON 5 - Cargando Hooks Once Init")
  

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("babylon_5_ogl",babylon_5_ogl_hojaItem,{ makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("babylon_5_ogl",babylon_5_ogl_hojaPersonaje,{ makeDefault: true});

    preloadHandlebarsTemplates();
});


// Función para cargar los html parciales de cada cosa de la hoja y demases
    async function preloadHandlebarsTemplates() {
        return loadTemplates([
        // Main actor sheets
        'systems/babylon_5_ogl/html/babylon_5_ogl_PJ.hbs'
        ,'systems/babylon_5_ogl/html/babylon_5_ogl_PNJ.hbs'
        ,'systems/babylon_5_ogl/html/babylon_5_ogl_Nave.hbs'
        // Actor partials.
        ,'systems/babylon_5_ogl/html/PJ/caracteristicas.hbs'
        ,'systems/babylon_5_ogl/html/PJ/caracteristica_fila.hbs'
        ,'systems/babylon_5_ogl/html/PJ/habilidades.hbs'
        ,'systems/babylon_5_ogl/html/PJ/habilidad_fila.hbs'
        ,'systems/babylon_5_ogl/html/PJ/salvaciones.hbs'
        ,'systems/babylon_5_ogl/html/PJ/salvacion_fila.hbs'
        ,'systems/babylon_5_ogl/html/PJ/clases.hbs'
        ,'systems/babylon_5_ogl/html/PJ/razas.hbs'
      
      ]);
    }
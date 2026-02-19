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
    {name: "Fuerza", type: "caracteristica", system:{abrevia:"FUE"}},
    {name: "Destreza", type: "caracteristica", system:{abrevia:"DES"}},
    {name: "Constitución", type: "caracteristica", system:{abrevia:"CON"}},
    {name: "Inteligencia", type: "caracteristica", system:{abrevia:"INT"}},
    {name: "Sabiduría", type: "caracteristica", system:{abrevia:"SAB"}},
    {name: "Carisma", type: "caracteristica", system:{abrevia:"CAR"}},

  ];
  // Crea los items embebidos en el actor
  await actor.createEmbeddedDocuments("Item", CARACTERISTICAS);

  //Crea las tiradas de salvación para el personaje
  const SALVACION = [
    {name:"Fortaleza", type:"salvacion", system:{caracteristica:"CON"}},
    {name:"Reflejos", type:"salvacion", system:{caracteristica:"DES"}},
    {name:"Voluntad", type:"salvacion", system:{caracteristica:"SAB"}}
  ];
  // Crea los items embebidos en el actor
  await actor.createEmbeddedDocuments("Item", SALVACION);

  // Lista de habilidades de la hoja para un PJ
  // faltan las de saber, operaciones y profesión que estarán en compedios o 
  // se crearán directamente en la hoja, porque además son todas que no se usan
  // entrenadas, así que tampoco tiene sentido que estén
  const HABILIDADES = [
    { name: "Acrobacias", type: "habilidad", system: {  caracteristica: "DES", pen_armadura: true} },
    { name: "Atletismo", type: "habilidad", system: {  caracteristica: "FUE", pen_armadura:true} },
    { name: "Computadoras", type: "habilidad", system: {  caracteristica: "INT"} },
    { name: "Concentración", type: "habilidad", system: {  caracteristica: "CON"} },
    { name: "Conducir", type: "habilidad", system: {  caracteristica: "DES", pen_armadura:true} },
    { name: "Descubrir", type: "habilidad", system: {  caracteristica: "SAB"} },
    { name: "Diplomacia", type: "habilidad", system: {  caracteristica: "CAR"} },
    { name: "Engañar", type: "habilidad", system: {  caracteristica: "CAR"} },
    { name: "Intimidar", type: "habilidad", system: {  caracteristica: "CAR"} },
    { name: "Intriga", type: "habilidad", system: {  caracteristica: "CAR"} },
    { name: "Investigar", type: "habilidad", system: {  caracteristica: "INT"} },
    { name: "Linguística", type: "habilidad", system: {  caracteristica: "INT"} },
    { name: "Medicina", type: "habilidad", system: {  caracteristica: "INT", solo_entrenada: true} },
    { name: "Operaciones", type: "habilidad", system: {  caracteristica: "INT", solo_entrenada:true, usa_descriptor:true } },
    { name: "Operaciones", type: "habilidad", system: {  caracteristica: "INT", solo_entrenada:true, usa_descriptor:true } },
    { name: "Operaciones", type: "habilidad", system: {  caracteristica: "INT", solo_entrenada:true, usa_descriptor:true } },
    { name: "Perspicacia", type: "habilidad", system: {  caracteristica: "SAB"} },    
    { name: "Pilotar", type: "habilidad", system: {  caracteristica: "DES", pen_armadura:true } },
    { name: "Profesión", type: "habilidad", system: {  caracteristica: "INT", solo_entrenada:true, usa_descriptor:true } },
    { name: "Profesión", type: "habilidad", system: {  caracteristica: "SAB", solo_entrenada:true, usa_descriptor:true } },
    { name: "Profesión", type: "habilidad", system: {  caracteristica: "CAR", solo_entrenada:true, usa_descriptor:true } },
    { name: "Saber", type: "habilidad", system: {  caracteristica: "INT",de_clase: true, usa_descriptor:true, descriptor:"Cultura propia"} },
    { name: "Saber", type: "habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true } },
    { name: "Saber", type: "habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true } },
    { name: "Saber", type: "habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true } },
    { name: "Saber", type: "habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true } },
    { name: "Saber", type: "habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true } },
    { name: "Sigilo", type: "habilidad", system: {  caracteristica: "DES", pen_armadura: true} },
    { name: "Subterfugio", type: "habilidad", system: {  caracteristica: "DES"} },
    { name: "Tasación", type: "habilidad", system: {  caracteristica: "INT"} },
    { name: "Técnica", type: "habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true, descriptor:"Electrónica" } },
    { name: "Técnica", type: "habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true, descriptor:"Ingeniería" } },
    { name: "Técnica", type: "habilidad", system: {  caracteristica: "INT",solo_entrenada: true, usa_descriptor:true, descriptor:"Mecánica" } },
    { name: "Telepatía", type: "habilidad", system: {  caracteristica: "CAR", solo_entrenada:true} }

  ];

  // Crea los items embebidos en el actor
  await actor.createEmbeddedDocuments("Item", HABILIDADES);
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
      
      ]);
    }
import { photos, type ObraPhoto } from "@/config/photos";

/**
 * SERVICES — content for the service pages.
 * Copy is intentionally distinct per service: different intent, doubts,
 * process, scope, FAQs. No invented claims.
 *
 * `todos`: any content that still needs validation with the provider.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServiceSection {
  heading: string;
  body: string;
  /** Optional list of specific points. Do NOT invent capabilities. */
  points?: string[];
}

export interface ServiceDifferentiator {
  kicker: string;
  title: string;
  body: string;
}

export interface Service {
  /** Route key, also used for internal links. */
  slug: string;
  /** Short name for navigation (e.g. "Cocinas"). */
  shortName: string;
  /** Full service name. */
  name: string;
  /** Hero eyebrow. */
  category: string;
  /** Title for the H1. */
  h1: string;
  /** Subcopy under the H1. */
  intro: string;
  /** Meta title (SEO). */
  metaTitle: string;
  /** Meta description (SEO). */
  metaDescription: string;
  /** One line used on cards. */
  cardLine: string;
  /**
   * Real before/after pair from one of our obras, used as the page hero and
   * as the comparison block. No stock photography on these pages.
   */
  photos: { before: ObraPhoto; after: ObraPhoto };
  /** Body sections. */
  sections: ServiceSection[];
  /** FAQ specific to this service. */
  faqs: FaqItem[];
  /** Exclusive editorial block that differentiates this landing. */
  differentiator: ServiceDifferentiator;
  /** Internal links to related services (SEO + UX). */
  related: { label: string; href: string }[];
  /** Honest notes still requiring provider confirmation. */
  todos?: string[];
}

export const services: Service[] = [
  {
    slug: "reformas-integrales-madrid",
    shortName: "Reformas integrales",
    name: "Reformas integrales",
    category: "Reforma integral · Madrid",
    h1: "Reformas integrales en Madrid, con un plan claro de principio a fin",
    intro:
      "Una reforma integral reúne en un solo proyecto demoliciones, instalaciones y acabados. Nuestro trabajo es que tengas un único interlocutor que coordine cada fase, un presupuesto detallado por partidas antes de empezar y una casa que se devuelve terminada, no a medias.",
    metaTitle:
      "Reformas integrales en Madrid | Presupuesto por partidas | KOFLAT",
    metaDescription:
      "Reformas integrales de viviendas en Madrid. Un único interlocutor, presupuesto detallado por partidas y coordinación de todas las fases de la obra. Pide tu valoración sin compromiso.",
    cardLine:
      "Toda la obra, coordinada por un único interlocutor, con presupuesto detallado por partidas.",
    photos: { before: photos.salonAntes, after: photos.salonDespues },
    sections: [
      {
        heading: "Qué incluye una reforma integral",
        body: "Una reforma integral agrupa todos los trabajos necesarios para dejar una vivienda en condiciones de uso: redistribución de espacios, renovación de instalaciones, acabados y carpintería. No sustituimos tu proyecto ni tomamos decisiones por ti; ordenamos el proceso para que las decisiones se tomen en el momento adecuado.",
        points: [
          "Fase de planificación y toma de datos antes de comenzar",
          "Un único interlocutor para coordinar oficios y fases",
          "Presupuesto desglosado por partidas antes del arranque de obra",
        ],
      },
      {
        heading: "Por dónde se empieza",
        body: "Empezamos por escuchar qué quieres conseguir y qué restricciones tiene la vivienda. Con esa información se valora el alcance, se visita la vivienda si procede y se prepara un presupuesto. No hay dos viviendas iguales, y el precio no se puede saber sin ver las condiciones reales de la obra.",
      },
    ],
    faqs: [
      {
        question: "¿Cuánto cuesta una reforma integral en Madrid?",
        answer:
          "Depende del estado de la vivienda, los metros, el alcance y los acabados. No podemos dar una cifra genérica que sea honesta. Te lo decimos claro: pedimos la información básica, vemos la vivienda y te entregamos un presupuesto por escrito, desglosado por partidas.",
      },
      {
        question: "¿Qué incluye el presupuesto de una reforma integral?",
        answer:
          "El presupuesto incluye las partidas necesarias para ejecutar el alcance acordado. Antes de firmar, revisamos contigo qué cubre y qué no, para que no haya interpretaciones a mitad de obra. TODO: confirmar el desglose exacto de partidas con el proveedor.",
      },
      {
        question: "¿Tengo que vaciar la casa antes de empezar?",
        answer:
          "En una reforma integral suele ser necesario desocupar la vivienda durante la obra, aunque cada caso es distinto. Se valora en la fase de toma de datos. TODO: confirmar condiciones de desocupación con el proveedor.",
      },
      {
        question: "¿Cuánto tarda una reforma integral?",
        answer:
          "La duración depende del alcance y del estado de la vivienda. No damos plazos genéricos: se fija un calendario realista por escrito antes de empezar y se va actualizando durante la obra.",
      },
    ],
    related: [
      { label: "Reformas de pisos", href: "/reformas-pisos-madrid" },
      { label: "Reformas de cocinas", href: "/reformas-cocinas-madrid" },
      { label: "Reformas de baños", href: "/reformas-banos-madrid" },
    ],
    differentiator: {
      kicker: "Proceso",
      title: "Todo empieza antes de empezar la obra.",
      body:
        "Una reforma integral bien ejecutada se decide en el papel: qué se mantiene, qué se mueve y en qué orden se trabaja. Eso se ordena antes de tocar una pared.",
    },
    todos: [
      "Confirmar con el proveedor el desglose de partidas estándar de un presupuesto integral.",
      "Confirmar plazos de obra orientativos por tipología.",
      "Confirmar política de desocupación de vivienda.",
    ],
  },
  {
    slug: "reformas-pisos-madrid",
    shortName: "Reformas de pisos",
    name: "Reformas de pisos",
    category: "Reforma de piso · Madrid",
    h1: "Reformas de pisos en Madrid: renovación o redistribución, sin fricciones",
    intro:
      "Reformar un piso en Madrid plantea retos concretos: comunidades, normativa, espacios contenidos y vecinos. Trabajamos para que la obra se resuelva con orden, se informe a la comunidad cuando corresponda y no se convierta en una fuente de conflictos.",
    metaTitle: "Reformas de pisos en Madrid | KOFLAT",
    metaDescription:
      "Reforma de pisos en Madrid: renovación completa o redistribución de espacios. Presupuesto por partidas, un único interlocutor y coordinación con la comunidad. Pide valoración sin compromiso.",
    cardLine:
      "Renovación o redistribución de vivienda, coordinada con la comunidad y la normativa.",
    photos: { before: photos.pasilloAntes, after: photos.pasilloDespues },
    sections: [
      {
        heading: "Reformar un piso: qué hay que tener en cuenta",
        body: "Reformar un piso exige conocer las condiciones del edificio: antigüedad, instalaciones comunitarias, normativa municipal y acuerdos de la comunidad. No se trata solo de estética; se trata de que la obra encaje con el edificio en el que se ejecuta.",
        points: [
          "Revisión de la normativa y la documentación del edificio",
          "Coordinación con la comunidad cuando la obra lo requiere",
          "Protección de zonas comunes y gestión de escombros",
        ],
      },
      {
        heading: "Redistribuir o renovar",
        body: "Si el proyecto implica mover tabiques o cambiar la distribución, entran en juego consideraciones estructurales y de instalaciones. Si se trata de renovar acabados e instalaciones manteniendo la distribución, el proceso es más directo. Te ayudamos a entender qué implica cada opción antes de decidir.",
      },
    ],
    faqs: [
      {
        question: "¿Necesito permiso para reformar mi piso en Madrid?",
        answer:
          "Depende del alcance: hay obras que solo requieren comunicación y otras que necesitan licencia. Lo valoramos en cada caso con la información del edificio. TODO: confirmar con el proveedor los casos habituales de comunicación vs. licencia.",
      },
      {
        question: "¿Se puede reformar un piso habitado?",
        answer:
          "En reformas parciales puede ser viable; en reformas integrales suele ser necesario desocupar. Se valora según el alcance y las condiciones de la vivienda.",
      },
      {
        question: "¿Trabajáis con la comunidad de vecinos?",
        answer:
          "Sí. Cuando la obra afecta a zonas comunes o requiere comunicación a la comunidad, gestionamos la documentación y avisamos con la antelación necesaria.",
      },
      {
        question: "¿Qué antigüedad de edificio estáis acostumbrados a reformar?",
        answer:
          "Trabajamos con pisos de distintas épocas. Cada antigüedad tiene sus particularidades, que se detectan en la visita de toma de datos antes de presupuestar.",
      },
    ],
    related: [
      { label: "Reformas integrales", href: "/reformas-integrales-madrid" },
      { label: "Reformas de cocinas", href: "/reformas-cocinas-madrid" },
      { label: "Reformas de baños", href: "/reformas-banos-madrid" },
    ],
    differentiator: {
      kicker: "Redistribución",
      title: "Redistribuir cambia mucho más que los metros.",
      body:
        "En un piso de edificio existente, cada decisión convive con comunidad, zonas comunes y normativa. El orden y la documentación importan tanto como la demolición.",
    },
    todos: [
      "Confirmar con el proveedor los casos de comunicación previa vs. licencia según normativa municipal.",
      "Confirmar política de reformas en vivienda ocupada.",
    ],
  },
  {
    slug: "reformas-cocinas-madrid",
    shortName: "Reformas de cocinas",
    name: "Reformas de cocinas",
    category: "Reforma de cocina · Madrid",
    h1: "Reformas de cocinas en Madrid, coordinadas con oficios que encajan",
    intro:
      "Una cocina concentra instalaciones de agua, electricidad, gas y extracción en muy pocos metros. Ese es el motivo por el que una reforma de cocina depende tanto de la coordinación. Nos encargamos de que fontanería, electricidad y carpintería encajen desde el primer día.",
    metaTitle: "Reformas de cocinas en Madrid | Instalaciones y acabados | KOFLAT",
    metaDescription:
      "Reforma de cocinas en Madrid con coordinación de instalaciones de agua, gas y electricidad. Presupuesto detallado por partidas y un único interlocutor. Pide tu valoración.",
    cardLine:
      "Instalaciones, distribución y acabados de cocina coordinados en un solo proyecto.",
    photos: { before: photos.cocinaAntes, after: photos.cocinaDespues },
    sections: [
      {
        heading: "Una cocina es, sobre todo, instalaciones",
        body: "El diseño de una cocina es importante, pero lo que decide si la obra sale bien es cómo se ordenan las instalaciones: dónde entra el agua, por dónde sale la extracción, cómo se alimentan los electrodomésticos. Planificamos eso antes de hablar de estética.",
        points: [
          "Revisión de instalaciones de agua, gas y electricidad",
          "Planificación de extracción y ventilación",
          "Coordinación de la secuencia: obra, instalaciones, mueble",
        ],
      },
      {
        heading: "La secuencia correcta",
        body: "El orden importa: demolición, instalaciones, solados y alicatados, mueble y encimera, electrodomésticos, y remates. Si esa secuencia se rompe, los defectos aparecen más tarde. Nuestro trabajo es mantenerla.",
      },
    ],
    faqs: [
      {
        question: "¿Cuánto cuesta reformar una cocina en Madrid?",
        answer:
          "Depende de los metros, el estado de las instalaciones, el tipo de mueble y la encimera. Pedimos los datos básicos, vemos la cocina y entregamos un presupuesto desglosado que distingue obra, instalaciones y mobiliario.",
      },
      {
        question: "¿Incluye el presupuesto el mueble de cocina?",
        answer:
          "Suele tratarse como una partida diferenciada, porque el mueble tiene un peso muy grande en el precio final. Se define y se presupuesta por separado para que no haya sorpresas. TODO: confirmar cómo presupuesta el proveedor la partida de mobiliario.",
      },
      {
        question: "¿Qué pasa con la instalación de gas?",
        answer:
          "La instalación de gas tiene normativa específica y solo puede ejecutarla personal habilitado. Lo coordinamos como parte del proyecto y te informamos de qué necesita la vivienda. TODO: confirmar con el proveedor la gestión de instalaciones de gas.",
      },
      {
        question: "¿Puedo vivir en casa mientras reforman la cocina?",
        answer:
          "Es posible en algunos casos, pero la cocina sin uso durante la obra complica la convivencia. Se valora el alcance y las alternativas de cada caso.",
      },
    ],
    related: [
      { label: "Reformas integrales", href: "/reformas-integrales-madrid" },
      { label: "Reformas de pisos", href: "/reformas-pisos-madrid" },
      { label: "Reformas de baños", href: "/reformas-banos-madrid" },
    ],
    differentiator: {
      kicker: "Instalaciones",
      title: "Lo que hace funcionar una cocina ocurre detrás de los muebles.",
      body:
        "Una cocina es donde más oficios se cruzan en menos espacio. El diseño visible importa; que agua, electricidad, gas y extracción encajen importa más.",
    },
    todos: [
      "Confirmar cómo presupuesta el proveedor la partida de mobiliario de cocina.",
      "Confirmar la gestión de instalaciones de gas y personal habilitado.",
    ],
  },
  {
    slug: "reformas-banos-madrid",
    shortName: "Reformas de baños",
    name: "Reformas de baños",
    category: "Reforma de baño · Madrid",
    h1: "Reformas de baños en Madrid donde la impermeabilización no es un detalle",
    intro:
      "Un baño bien reformado es el que nunca vuelve a dar problemas de humedad. La diferencia está en las fases que no se ven: demolición, impermeabilización, saneamiento y pruebas antes de los acabados. Eso es lo que planificamos primero.",
    metaTitle: "Reformas de baños en Madrid | Impermeabilización | KOFLAT",
    metaDescription:
      "Reforma de baños en Madrid con impermeabilización y saneamiento bien resueltos. Presupuesto detallado por partidas y un único interlocutor. Pide tu valoración sin compromiso.",
    cardLine:
      "Impermeabilización, saneamiento y acabados bien resueltos antes de vestir el baño.",
    photos: { before: photos.banoAntes, after: photos.banoDespues },
    sections: [
      {
        heading: "Lo que decide que un baño no dé problemas",
        body: "Antes de elegir sanitarios o revestimientos, hay que resolver las bases: demolición limpia, saneamiento y bajantes revisados, impermeabilización correcta y pruebas de estanqueidad. Si esas fases se hacen deprisa, los problemas aparecen en los meses siguientes.",
        points: [
          "Revisión de saneamiento y bajantes antes de cerrar",
          "Impermeabilización y pruebas de estanqueidad",
          "Ventilación e instalaciones eléctricas seguras",
        ],
      },
      {
        heading: "Redistribuir un baño en un edificio",
        body: "Mover la posición de los sanitarios implica tocar bajantes y forjado. No siempre es posible o conveniente, y conviene saberlo antes de diseñar. Te decimos qué es realista en tu vivienda antes de comprometerte con un diseño.",
      },
    ],
    faqs: [
      {
        question: "¿Cuánto cuesta reformar un baño en Madrid?",
        answer:
          "Varía según los metros, el estado de las instalaciones y la calidad de sanitarios y revestimientos. Se valora con los datos del baño y, si procede, una visita. El presupuesto se entrega desglosado por partidas.",
      },
      {
        question: "¿Puedo cambiar la posición del inodoro o la ducha?",
        answer:
          "A veces sí y a veces no, según bajantes, forjado y comunidad. Lo comprobamos antes de presupuestar el diseño para que no planifiques algo inviable. TODO: confirmar criterios de redistribución con el proveedor.",
      },
      {
        question: "¿Cuánto tarda una reforma de baño?",
        answer:
          "Suele ser de las reformas más rápidas, pero el plazo depende del alcance y del edificio. Se fija un calendario por escrito antes de empezar.",
      },
      {
        question: "¿Qué pasa con los problemas de humedad que ya existen?",
        answer:
          "Si el baño tiene humedades, hay que identificar el origen antes de reformar, porque si no, vuelven a aparecer. Eso se analiza en la fase de toma de datos.",
      },
    ],
    related: [
      { label: "Reformas integrales", href: "/reformas-integrales-madrid" },
      { label: "Reformas de pisos", href: "/reformas-pisos-madrid" },
      { label: "Reformas de cocinas", href: "/reformas-cocinas-madrid" },
      { label: "Tratamiento de humedades", href: "/reformas-humedades-madrid" },
    ],
    differentiator: {
      kicker: "Proceso",
      title: "Lo que no se ve evita problemas después.",
      body:
        "Un baño no se juzga solo por cómo queda: se juzga por si nunca vuelve a dar problemas de humedad. Eso se decide en las capas que no se ven.",
    },
    todos: [
      "Confirmar con el proveedor los criterios técnicos de redistribución de baños.",
      "Confirmar el tratamiento de humedades previas a la reforma.",
    ],
  },
  {
    slug: "reformas-humedades-madrid",
    shortName: "Humedades",
    name: "Tratamiento de humedades",
    category: "Humedades · Madrid",
    h1: "Tratamiento de humedades en Madrid: primero el origen, después la pared",
    intro:
      "Una humedad no se arregla pintando encima. Antes de reparar hay que saber de dónde viene el agua: una filtración, capilaridad del muro, condensación o una instalación. Identificamos el origen, saneamos el soporte y reparamos para que no vuelva a aparecer.",
    metaTitle:
      "Tratamiento de humedades en Madrid | Diagnóstico y reparación | KOFLAT",
    metaDescription:
      "Diagnóstico y tratamiento de humedades en Madrid: filtraciones, capilaridad y condensación. Presupuesto detallado por partidas y un único interlocutor.",
    cardLine:
      "Diagnóstico del origen, saneado del soporte y reparación para que la humedad no vuelva.",
    photos: { before: photos.humedadAntes, after: photos.humedadDespues },
    sections: [
      {
        heading: "Por qué una humedad vuelve a aparecer",
        body: "Casi siempre vuelve porque se reparó el síntoma y no la causa. Una mancha en la pared puede venir de una filtración exterior, de una bajante, de capilaridad del terreno o de condensación interior; cada origen se trata de forma distinta. Por eso el trabajo empieza identificando de dónde viene el agua y no tapando la pared.",
        points: [
          "Identificación del origen antes de presupuestar la reparación",
          "Saneado del soporte: se retira pintura y revoque levantados",
          "Reparación y acabado, con rodapié y pintura repuestos",
        ],
      },
      {
        heading: "Qué se valora en la visita",
        body: "En la visita se revisa la extensión de la humedad, los materiales de la pared y el entorno: instalaciones cercanas, orientación y ventilación de la estancia. Con eso se decide qué tratamiento tiene sentido y cuál no. TODO: confirmar el alcance exacto del diagnóstico con el proveedor.",
      },
    ],
    faqs: [
      {
        question: "¿Se puede pintar directamente sobre una humedad?",
        answer:
          "No es recomendable. Si el origen sigue activo, la pintura vuelve a levantarse en pocos meses. Primero se identifica y se corrige el origen, se sanea el soporte y después se pinta.",
      },
      {
        question: "¿Cuánto cuesta quitar una humedad?",
        answer:
          "Depende del origen, de la superficie afectada y de si hay que intervenir en la instalación o en el exterior. Con los datos y una visita se entrega un presupuesto desglosado por partidas.",
      },
      {
        question: "¿Qué tipos de humedad tratáis?",
        answer:
          "Filtraciones, capilaridad y condensación, que se diagnostican y se tratan de forma distinta. TODO: confirmar con el proveedor los sistemas concretos de tratamiento que aplica.",
      },
      {
        question: "¿La reparación tiene garantía?",
        answer:
          "La garantía se entrega por escrito con el presupuesto. TODO: confirmar la garantía específica que ofrece el proveedor para tratamientos de humedad.",
      },
    ],
    related: [
      { label: "Reformas de baños", href: "/reformas-banos-madrid" },
      { label: "Reformas de pisos", href: "/reformas-pisos-madrid" },
      { label: "Reformas integrales", href: "/reformas-integrales-madrid" },
    ],
    differentiator: {
      kicker: "Diagnóstico",
      title: "El origen no está donde aparece la mancha.",
      body:
        "Reparar una humedad sin encontrar su origen es tirar el dinero. El trabajo empieza averiguando de dónde viene el agua, no tapando la pared.",
    },
    todos: [
      "Confirmar con el proveedor los sistemas de tratamiento que aplica (inyección, impermeabilización, ventilación…).",
      "Confirmar si el diagnóstico incluye pruebas específicas de humedad.",
      "Confirmar la garantía que se ofrece por escrito.",
    ],
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);

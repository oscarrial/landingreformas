import type { FaqItem } from "@/config/services";

/** Process steps (home timeline). A real sequence — numbering applies. */
export const processSteps = [
  {
    number: "01",
    title: "Cuéntanos tu proyecto",
    body: "Explícanos qué quieres transformar y qué necesidades tiene tu vivienda.",
  },
  {
    number: "02",
    title: "Visitamos la vivienda",
    body: "Analizamos el espacio, las posibilidades y los condicionantes de la reforma.",
  },
  {
    number: "03",
    title: "Proyecto + presupuesto",
    body: "Definimos distribución, materiales, alcance y valoración.",
  },
  {
    number: "04",
    title: "Ejecutamos la reforma",
    body: "Coordinamos los trabajos y realizamos seguimiento durante toda la obra.",
  },
  {
    number: "05",
    title: "Entrega",
    body: "Revisamos los últimos detalles y entregamos la vivienda terminada.",
  },
];

/** FAQ (home + FAQ schema). Answers are prudent; never invent terms. */
export const homeFaqs: FaqItem[] = [
  {
    question: "¿Cuánto cuesta una reforma integral en Madrid?",
    answer:
      "Depende del estado de la vivienda, los metros, el alcance y los acabados. No damos cifras genéricas que no sean honestas: con tus datos y una visita preparamos un presupuesto desglosado por partidas.",
  },
  {
    question: "¿Cuánto tiempo tarda una reforma integral?",
    answer:
      "La duración depende del alcance y de las condiciones de la vivienda. Se planifican las fases de obra antes de empezar y se fija un calendario realista por escrito.",
  },
  {
    question: "¿Qué incluye el presupuesto?",
    answer:
      "El presupuesto recoge las partidas necesarias para ejecutar el alcance acordado. Antes de firmar, revisamos contigo qué cubre y qué no, para que no haya interpretaciones a mitad de obra.",
  },
  {
    question: "¿Os encargáis de las licencias?",
    answer:
      "Según el alcance, algunas obras requieren comunicación previa o licencia municipal. Lo valoramos con la información de la vivienda y lo gestionamos dentro del proyecto. TODO: confirmar la gestión exacta de licencias con el proveedor.",
  },
  {
    question: "¿Puedo elegir los materiales?",
    answer:
      "Sí. Los materiales y acabados se definen en la fase de proyecto y presupuesto, con opciones para cada partida. Así sabes exactamente qué se instala antes de que empiece la obra.",
  },
  {
    question: "¿Cómo se realizan los pagos?",
    answer:
      "Los pagos se vinculan a la evolución de la obra. Los hitos de pago se detallan en el presupuesto que firmas antes de empezar. TODO: confirmar el calendario de pagos concreto con el proveedor.",
  },
  {
    question: "¿Qué ocurre si aparece un imprevisto durante la obra?",
    answer:
      "Si aparece una circunstancia no contemplada (por ejemplo, una instalación en peor estado del esperado), se te informa antes de actuar, se documenta y se acuerda el coste y la solución. Nada se decide a tus espaldas.",
  },
  {
    question: "¿Qué garantía tiene la reforma?",
    answer:
      "La garantía se entrega por escrito con el proyecto. Los plazos y el alcance exactos se confirman antes de firmar. TODO: confirmar la garantía específica que ofrece el proveedor.",
  },
];

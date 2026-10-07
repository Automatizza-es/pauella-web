import type { Dictionary } from "./types";

export const es: Dictionary = {
  nav: {
    menu: "Menú",
    extras: "Extras",
    learn: "Clase de Cocina",
    about: "Sobre Pau",
    contact: "Contacto",
    bookEvent: "Reserva tu evento",
  },
  hero: {
    tagline: "Paella en vivo para eventos en Los Ángeles",
    bookEvent: "Reserva tu evento",
    seeExperience: "Ver la experiencia",
  },
  concept: {
    eyebrow: "Esto no es catering",
    title: "Es fuego, una paellera y Pau cocinando delante de ti.",
    body: "Pau llega a tu evento, enciende el fuego y cocina la paella desde cero delante de tus invitados. Sin bandejas de mantenimiento, sin cocina escondida: cocinar es parte de la fiesta, de principio a fin.",
  },
  experience: {
    eyebrow: "La Experiencia",
    title: "Así se vive",
    subtitle: "De la llegada al último plato servido, cada paso forma parte de la experiencia.",
    steps: [
      {
        step: "01",
        title: "Llegada",
        description: "Llegamos con la paellera, el montaje y todo lo necesario.",
      },
      {
        step: "02",
        title: "Preparación",
        description: "Los ingredientes frescos se preparan al momento.",
      },
      {
        step: "03",
        title: "Cocina en directo",
        description: "La paella cobra vida sobre el fuego.",
      },
      {
        step: "04",
        title: "Servicio",
        description: "Se sirve recién hecha, directa de la paellera.",
      },
      {
        step: "05",
        title: "El momento",
        description: "Más que una comida. Un momento que se recuerda.",
      },
    ],
  },
  menu: {
    eyebrow: "El Menú",
    title: "Tres caminos hasta la mesa",
    intro:
      "Empieza por un clásico, sube de nivel con una paellera signature, o trae tu propia idea y deja que Pau se encargue del resto.",
  },
  paellas: {
    name: "Los Clásicos",
    description:
      "Recetas de toda la vida, cocinadas al fuego como siempre se ha hecho. Sabores de siempre, mesas inolvidables.",
    cta: "Pregunta por esta",
    watchLabel: "Ver la paella",
    blackLabel: "Pídela en negro",
    blackActiveLabel: "Versión negra",
    items: [
      {
        name: "Pauella",
        description:
          "La favorita de Pau: pollo, setas y verduras, con la profundidad del Pedro Ximénez.",
      },
      {
        name: "The Original",
        description: "Un homenaje a la paella valenciana tradicional, cocinada como debe ser.",
      },
      {
        name: "The Señorito",
        description: "Paella de marisco mediterráneo, preparada sin cáscara para comer sin esfuerzo.",
        blackOption:
          "La tinta de calamar tiñe el arroz de negro: el mismo marisco, con un toque más profundo y salino.",
      },
    ],
  },
  specials: {
    name: "Paelleras Signature",
    description:
      "Pensadas para ir un paso más allá. Un poco más de fuego, un poco más de espectáculo, una paellera que nadie olvida.",
    cta: "Pregunta por esta",
    watchLabel: "Ver la paella",
    items: [
      {
        name: "The Showstopper",
        description: "El bogavante toma el centro de la paellera. Pensada para ser el momento de la noche.",
      },
      {
        name: "The Tomahawk",
        description:
          "Chuletón tomahawk a la brasa, cortado junto a la paellera, con setas y berenjena.",
      },
    ],
  },
  customIdea: {
    name: "Paella a Medida",
    description: "Tus ingredientes, tus ideas. Una paellera pensada enteramente a tu gusto.",
    title: "Cuéntanos qué te apetece.",
    body: "Pau diseña una paella a partir de tu idea.",
    tags: ["Carne", "Picante", "Trufa", "Sorpréndeme"],
    cta: "Cuéntale tu idea a Pau",
    modal: {
      title: "Cuéntale tu idea a Pau",
      body: "Unos pocos detalles ayudan a Pau a dar forma a la propuesta para tu evento.",
      picks: "Lo que has elegido",
      email: "Email",
      ingredients: "Ingredientes favoritos",
      dislikes: "¿Algo que no te guste?",
      guestCount: "Número de invitados",
      idea: "Cuéntanos tu idea",
      submit: "Enviar mi idea",
      submitting: "Enviando…",
      success: "Gracias. Pau ya tiene tu idea y te enviará una propuesta para tu evento.",
      error: "Algo salió mal. Inténtalo de nuevo o escríbenos directamente.",
    },
  },
  extras: {
    eyebrow: "Hazlo Tuyo",
    title: "¿Un extra más?",
    subtitle: "Añade algunos detalles para que la experiencia sea todavía más tuya.",
    items: [
      {
        name: "Jamón",
        points: ["Jamón serrano", "Jamón ibérico", "Cortador en directo"],
      },
      {
        name: "Aperitivos",
        points: ["Aceitunas", "Manchego", "Pan con tomate"],
      },
      {
        name: "Servicio",
        points: ["Camareros", "Aperitivos servidos en sala", "Servicio de mesa"],
      },
      {
        name: "Foto y Vídeo",
        points: ["Cobertura del evento", "Fotos espontáneas", "Vídeo resumen"],
      },
    ],
  },
  about: {
    eyebrow: "Con Pau",
    title: "Un español en California",
    body: "Cocinando una fiesta a la vez. Pau creció rodeado de la paella valenciana y sabe exactamente cuándo respetar la tradición, cuándo reinterpretarla y cuándo ir un paso más allá.",
    quote: "La vida es corta. Haz paella.",
  },
  learnToCook: {
    eyebrow: "Clase De Cocina",
    teaser: {
      title: "Aprende a hacer paella.",
      body: "Elige tu paella. Pau trae el kit y te enseña cómo se hace.",
      cta: "Cocina con Pau",
    },
    title: "Cocina con Pau.",
    body: "Elige tu paella, aprende el fuego y llévate lo aprendido a casa.",
    steps: ["Elige tu paella", "Recibe tu kit", "Cocina con Pau", "Hazla tuya"],
    kitTitle: "Tu Kit De Paella",
    kit: [
      "Paellera",
      "Quemador y equipo de cocina",
      "Herramientas esenciales",
      "Ingredientes para la sesión",
      "Experiencia de cocina uno a uno con Pau",
      "Tu receta para repetirla",
    ],
    cta: "Empieza a cocinar",
  },
  serviceArea: {
    eyebrow: "Dónde Cocinamos",
    title: "Los Ángeles y el Sur de California",
    body: "Pauella tiene su base en Los Ángeles y se desplaza a eventos privados por todo el Sur de California. Cuéntanos dónde es tu evento al solicitarlo y confirmaremos disponibilidad.",
  },
  faq: {
    eyebrow: "Preguntas",
    title: "Lo que debes saber",
    items: [
      {
        question: "¿Cómo funciona un evento de paella en vivo?",
        answer:
          "Pau llega a tu evento con la paellera, los ingredientes y el equipo de fuego, y cocina la paella delante de tus invitados de principio a fin. Normalmente son unas cuatro horas en total, incluyendo montaje, cocción, servicio y recogida.",
      },
      {
        question: "¿Dónde cocinas? ¿Traes tu propio equipo?",
        answer:
          "Sí. Pau trae la paellera, el quemador y todo lo necesario para cocinar in situ, ya sea en un jardín, una azotea, un showroom u otro espacio privado.",
      },
      {
        question: "¿Qué zonas cubrís?",
        answer:
          "Pauella tiene su base en Los Ángeles y cubre eventos por todo el Sur de California. Cuéntanos la ubicación de tu evento al solicitarlo y confirmaremos disponibilidad.",
      },
      {
        question: "¿Qué paella debería elegir?",
        answer:
          "Depende de tus invitados y de tu evento. Tenemos opciones tradicionales, de marisco y con bogavante. Cuéntanos sobre tu evento y te ayudamos a elegir, o combinamos varias para grupos grandes.",
      },
      {
        question: "¿Podéis adaptaros a restricciones alimentarias?",
        answer:
          "Cuéntanos cualquier alergia o necesidad especial al solicitar tu evento y lo adaptamos en el menú.",
      },
      {
        question: "¿Con cuánta antelación debo reservar?",
        answer:
          "Cuanto antes tengas la fecha. Los fines de semana y la temporada alta se llenan primero, así que cuanto antes nos escribas, más flexibilidad tendremos.",
      },
    ],
  },
  contact: {
    eyebrow: "Reserva Tu Evento",
    title: "Pongamos fuego en tu jardín.",
    body: "Cuéntanos algunos detalles y te responderemos para hablar de menú, horarios y logística.",
    form: {
      name: "Nombre",
      email: "Email",
      phone: "Teléfono",
      eventDate: "Fecha del evento",
      eventTime: "Hora del evento",
      eventLocation: "Ubicación del evento",
      guestCount: "Número de invitados",
      eventType: "Tipo de evento",
      eventTypeOptions: {
        privateParty: "Fiesta privada",
        wedding: "Boda",
        corporate: "Evento corporativo",
        other: "Otro",
      },
      message: "Cuéntanos sobre tu evento",
      askingAbout: "Preguntando por",
      addAnother: "+ Añadir otra paella",
      cookingClass: "Clase de cocina con Pau",
      submit: "Solicitar tu evento",
      submitting: "Enviando…",
      success: "Gracias. Hemos recibido tu solicitud. Te contactaremos pronto para hablar de los detalles.",
      error: "Algo salió mal. Inténtalo de nuevo o escríbenos directamente.",
    },
  },
  footer: {
    rights: "Los Ángeles, CA.",
  },
};

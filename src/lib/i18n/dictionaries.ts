export type Locale = "en" | "es";

export interface Dictionary {
  nav: {
    services: string;
    portfolio: string;
    process: string;
    testimonials: string;
    contact: string;
    whatsapp: string;
    book: string;
  };
  hero: {
    kicker: string;
    title1: string;
    title2: string;
    subtitle: string;
    cta1: string;
    cta2: string;
    scroll: string;
  };
  about: {
    kicker: string;
    title: string;
    body: string;
    stat1: string;
    stat1Label: string;
    stat2: string;
    stat2Label: string;
    stat3: string;
    stat3Label: string;
    quote: string;
  };
  services: {
    kicker: string;
    title: string;
    items: { name: string; desc: string }[];
    cta: string;
  };
  portfolio: {
    kicker: string;
    title: string;
    filterAll: string;
  };
  process: {
    kicker: string;
    title: string;
    steps: { name: string; desc: string }[];
  };
  testimonials: {
    kicker: string;
    title: string;
    items: { name: string; role: string; quote: string }[];
  };
  contact: {
    kicker: string;
    title: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      phone: string;
      eventType: string;
      date: string;
      guests: string;
      budget: string;
      message: string;
      submit: string;
      submitting: string;
      submitted: string;
      error: string;
    };
    or: string;
    whatsapp: string;
    email: string;
    call: string;
  };
  footer: {
    tagline: string;
    rights: string;
    madeWith: string;
    admin: string;
  };
  chat: {
    cta: string;
    title: string;
    subtitle: string;
    placeholder: string;
    greeting: string;
    quickActions: {
      planEvent: string;
      exploreServices: string;
      viewPortfolio: string;
      checkAvailability: string;
      weddings: string;
      corporateEvents: string;
      bookConsultation: string;
    };
    suggestedPrompts: string[];
    closeChat: string;
    listening: string;
    scrollUp: string;
    scrollDown: string;
    sendMessage: string;
    startVoice: string;
    stopVoice: string;
    connectionError: string;
    notConnected: string;
    apiError: string;
    followUp: string;
    defaultReply: string;
    alreadyPendingSlot: string;
  };
  whatsappMessage: string;
}

const eventTypesEn = ["Wedding", "Corporate Event", "Private Party", "Baby Shower", "Anniversary"];
const eventTypesEs = ["Boda", "Evento Corporativo", "Fiesta Privada", "Baby Shower", "Aniversario"];
const budgetsEn = ["< $5,000", "$5,000 - $10,000", "$10,000 - $20,000", "$20,000 - $40,000", "$40,000 - $60,000", "$60,000+"];
const budgetsEs = ["< $5,000", "$5,000 - $10,000", "$10,000 - $20,000", "$20,000 - $40,000", "$40,000 - $60,000", "$60,000+"];

export const eventTypeOptions: Record<Locale, string[]> = { en: eventTypesEn, es: eventTypesEs };
export const budgetOptions: Record<Locale, string[]> = { en: budgetsEn, es: budgetsEs };
export const guestOptions = ["< 50", "50 - 100", "100 - 200", "200+"];

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: {
      services: "Services",
      portfolio: "Portfolio",
      process: "Process",
      testimonials: "Testimonials",
      contact: "Contact",
      whatsapp: "Chat on WhatsApp",
      book: "Book a Consultation",
    },
    hero: {
      kicker: "Weddings · Celebrations · Destination Events",
      title1: "Every Detail,",
      title2: "Beautifully Told.",
      subtitle: "Your Vision, Flawlessly Brought to Life",
      cta1: "Start Planning",
      cta2: "Ask Our Assistant",
      scroll: "Scroll to explore",
    },
    about: {
      kicker: "We don't plan events. We compose experiences",
      title: "A decade of crafting unforgettable days",
      body: "We're a team of event designers and planners with a love for atmosphere, styling, and the small details that make a celebration unforgettable. From intimate gatherings to grand affairs, we bring creativity, warmth, and precision to every event we design.",
      stat1: "150+",
      stat1Label: "Events Designed",
      stat2: "10",
      stat2Label: "Years of Craft",
      stat3: "25+",
      stat3Label: "Cities / Destinations Served",
      quote: "The Studio",
    },
    services: {
      kicker: "What We Create",
      title: "Services, tailored to every celebration",
      items: [
        { name: "Weddings", desc: "Full-service design and coordination for the most important day of your life — from intimate elopements to grand château affairs." },
        { name: "Corporate Events", desc: "Product launches, galas and executive retreats engineered to reflect your brand with polish and impact." },
        { name: "Private Parties", desc: "Milestone birthdays, engagement dinners and intimate soirées designed around you and your guests." },
        { name: "Baby Showers", desc: "Soft, joyful celebrations styled with a delicate eye for detail, colour and comfort." },
        { name: "Anniversaries", desc: "Honouring years of love with celebrations as timeless as the milestone itself." },
      ],
      cta: "Explore package",
    },
    portfolio: {
      kicker: "Our Work",
      title: "A gallery of unforgettable days",
      filterAll: "All",
    },
    process: {
      kicker: "How We Work",
      title: "From first conversation to final flourish",
      steps: [
        { name: "Consultation", desc: "We listen — to your story, your vision, your must-haves. This shapes everything that follows." },
        { name: "Concept", desc: "A tailored creative direction: mood, palette, narrative arc, presented as a bespoke concept board." },
        { name: "Design", desc: "Florals, décor, lighting, table-scapes and vendor selection refined down to the smallest detail." },
        { name: "Execution", desc: "Contracts, logistics, timelines and vendor management handled meticulously behind the scenes." },
        { name: "Event Day", desc: "We disappear into the background so you can fully live the moment — every cue, perfectly timed." },
      ],
    },
    testimonials: {
      kicker: "Kind Words",
      title: "Loved by our clients",
      items: [
        { name: "Camille & Antoine", role: "Wedding, Wilmington, DE", quote: "The Event Masterpiece Plus team turned our wedding into something out of a dream. Every detail felt like us, elevated." },
        { name: "Sophie Laurent", role: "CEO, Laurent & Co.", quote: "Our product launch was flawless. Guests are still talking about the atmosphere they created." },
        { name: "Yasmine B.", role: "Baby Shower, Philadelphia, PA", quote: "So soft, so joyful, so effortless — for us at least. The team handled every single detail." },
        { name: "Elise & Marc", role: "30th Anniversary", quote: "A celebration as elegant and enduring as our marriage. We are endlessly grateful." },
      ],
    },
    contact: {
      kicker: "Let's Create Together",
      title: "Tell us about your celebration",
      subtitle: "Share a few details and our team will respond within 24 hours with tailored recommendations.",
      form: {
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        eventType: "Event Type",
        date: "Preferred Date",
        guests: "Estimated Guests",
        budget: "Budget Range",
        message: "Tell us about your vision",
        submit: "Send Inquiry",
        submitting: "Sending…",
        submitted: "Thank you — your inquiry has been received. We'll be in touch within 24 hours.",
        error: "Something went wrong. Please try again or WhatsApp us directly.",
      },
      or: "or reach us directly",
      whatsapp: "Chat on WhatsApp",
      email: "Email Us",
      call: "Call Us",
    },
    footer: {
      tagline: "Every Detail, Beautifully Told.",
      rights: "All rights reserved.",
      madeWith: "Designed with love in the USA",
      admin: "Studio Login",
    },
    chat: {
      cta: "Ask EMP — Your AI Event Planner",
      title: "Ask EMP",
      subtitle: "Your AI Event Planner",
      placeholder: "Type your message…",
      greeting:
        "Hello ✨ I'm the Event Masterpiece Plus assistant, here to help you plan your event. I can help you explore our services, discover inspiration, answer your questions, or book a consultation with our team. What are you planning?",
      quickActions: {
        planEvent: "Plan My Event",
        exploreServices: "Explore Services",
        viewPortfolio: "View Portfolio",
        checkAvailability: "Check Availability",
        weddings: "Weddings",
        corporateEvents: "Corporate Events",
        bookConsultation: "Book a Consultation",
      },
      suggestedPrompts: [
        "Plan my wedding",
        "What's your pricing?",
        "Book a consultation",
        "Show me your wedding portfolio",
        "What services do you offer?",
        "I need a corporate event",
      ],
      closeChat: "Close chat",
      listening: "Listening…",
      scrollUp: "Scroll up",
      scrollDown: "Scroll down",
      sendMessage: "Send message",
      startVoice: "Start voice input",
      stopVoice: "Stop voice input",
      connectionError:
        "I'm having trouble connecting right now. Please reach out via the contact form or WhatsApp and our team will follow up personally.",
      notConnected:
        "Thank you for reaching out! Our AI concierge isn't fully connected yet, but our team would love to help — please use the contact form below or message us on WhatsApp and we'll respond personally.",
      apiError:
        "I'm having trouble connecting right now. Please reach out via the contact form or WhatsApp and our team will follow up personally.",
      followUp: "Let me have our event team follow up on this personally — could you share the best way to reach you?",
      defaultReply: "I'm here to help — could you tell me more about your event?",
      alreadyPendingSlot: "You've already picked {date} at {time} ✨ Just share your name, email, and phone number above to lock it in!",
    },
    whatsappMessage: "Hi Event Masterpiece Plus, I'd like to inquire about an event.",
  },
  es: {
    nav: {
      services: "Servicios",
      portfolio: "Portafolio",
      process: "Proceso",
      testimonials: "Testimonios",
      contact: "Contacto",
      whatsapp: "Chatear por WhatsApp",
      book: "Reservar una Consulta",
    },
    hero: {
      kicker: "Bodas · Celebraciones · Eventos de Destino",
      title1: "Cada Detalle,",
      title2: "Bellamente Contado.",
      subtitle: "Tu Visión, Hecha Realidad a la Perfección",
      cta1: "Empezar a Planear",
      cta2: "Pregúntale a Nuestra Asistente",
      scroll: "Desliza para explorar",
    },
    about: {
      kicker: "No planeamos eventos. Componemos experiencias",
      title: "Una década creando días inolvidables",
      body: "Somos un equipo de diseñadores y organizadores de eventos apasionados por la atmósfera, el estilo y los pequeños detalles que hacen inolvidable una celebración. Desde reuniones íntimas hasta grandes eventos, aportamos creatividad, calidez y precisión a cada evento que diseñamos.",
      stat1: "150+",
      stat1Label: "Eventos Diseñados",
      stat2: "10",
      stat2Label: "Años de Experiencia",
      stat3: "25+",
      stat3Label: "Ciudades / Destinos Atendidos",
      quote: "El Estudio",
    },
    services: {
      kicker: "Lo Que Creamos",
      title: "Servicios a la medida de cada celebración",
      items: [
        { name: "Bodas", desc: "Diseño y coordinación integral para el día más importante de tu vida — desde fugas íntimas hasta grandes recepciones de castillo." },
        { name: "Eventos Corporativos", desc: "Lanzamientos de productos, galas y retiros ejecutivos pensados para reflejar tu marca con estilo e impacto." },
        { name: "Fiestas Privadas", desc: "Cumpleaños importantes, cenas de compromiso y veladas íntimas diseñadas alrededor de ti y tus invitados." },
        { name: "Baby Showers", desc: "Celebraciones suaves y alegres, estilizadas con un ojo delicado para el detalle, el color y la comodidad." },
        { name: "Aniversarios", desc: "Honrando años de amor con celebraciones tan atemporales como el momento mismo." },
      ],
      cta: "Explorar paquete",
    },
    portfolio: {
      kicker: "Nuestro Trabajo",
      title: "Una galería de días inolvidables",
      filterAll: "Todos",
    },
    process: {
      kicker: "Cómo Trabajamos",
      title: "De la primera conversación al toque final",
      steps: [
        { name: "Consulta", desc: "Escuchamos tu historia, tu visión, tus imprescindibles. Esto da forma a todo lo que sigue." },
        { name: "Concepto", desc: "Una dirección creativa a la medida: ambiente, paleta, hilo narrativo, presentado como un tablero de concepto personalizado." },
        { name: "Diseño", desc: "Flores, decoración, iluminación, montaje de mesas y selección de proveedores, refinados hasta el más mínimo detalle." },
        { name: "Ejecución", desc: "Contratos, logística, cronogramas y gestión de proveedores manejados meticulosamente entre bastidores." },
        { name: "Día del Evento", desc: "Nos desvanecemos en el fondo para que vivas plenamente el momento — cada detalle, perfectamente sincronizado." },
      ],
    },
    testimonials: {
      kicker: "Palabras Amables",
      title: "Amados por nuestros clientes",
      items: [
        { name: "Camille & Antoine", role: "Boda, Wilmington, DE", quote: "El equipo de Event Masterpiece Plus convirtió nuestra boda en algo salido de un sueño. Cada detalle se sintió como nosotros, elevado." },
        { name: "Sophie Laurent", role: "CEO, Laurent & Co.", quote: "El lanzamiento de nuestro producto fue impecable. Los invitados todavía hablan del ambiente que crearon." },
        { name: "Yasmine B.", role: "Baby Shower, Filadelfia, PA", quote: "Tan suave, tan alegre, tan sin esfuerzo — para nosotros al menos. El equipo se encargó de cada detalle." },
        { name: "Elise & Marc", role: "30 Aniversario", quote: "Una celebración tan elegante y duradera como nuestro matrimonio. Estamos eternamente agradecidos." },
      ],
    },
    contact: {
      kicker: "Creemos Juntos",
      title: "Cuéntanos sobre tu celebración",
      subtitle: "Comparte algunos detalles y nuestro equipo responderá en 24 horas con recomendaciones personalizadas.",
      form: {
        name: "Nombre Completo",
        email: "Correo Electrónico",
        phone: "Número de Teléfono",
        eventType: "Tipo de Evento",
        date: "Fecha Preferida",
        guests: "Invitados Estimados",
        budget: "Rango de Presupuesto",
        message: "Cuéntanos sobre tu visión",
        submit: "Enviar Consulta",
        submitting: "Enviando…",
        submitted: "Gracias — hemos recibido tu consulta. Nos pondremos en contacto en 24 horas.",
        error: "Algo salió mal. Inténtalo de nuevo o escríbenos por WhatsApp.",
      },
      or: "o contáctanos directamente",
      whatsapp: "Chatear por WhatsApp",
      email: "Escríbenos",
      call: "Llámanos",
    },
    footer: {
      tagline: "Cada Detalle, Bellamente Contado.",
      rights: "Todos los derechos reservados.",
      madeWith: "Diseñado con amor en EE. UU.",
      admin: "Acceso del Estudio",
    },
    chat: {
      cta: "Pregúntale a EMP — Tu Planificadora de Eventos IA",
      title: "Pregúntale a EMP",
      subtitle: "Tu Planificadora de Eventos IA",
      placeholder: "Escribe tu mensaje…",
      greeting:
        "¡Hola! ✨ Soy la asistente de Event Masterpiece Plus, aquí para ayudarte a planear tu evento. Puedo ayudarte a explorar nuestros servicios, descubrir inspiración, responder tus preguntas o reservar una consulta con nuestro equipo. ¿Qué estás planeando?",
      quickActions: {
        planEvent: "Planear mi Evento",
        exploreServices: "Explorar Servicios",
        viewPortfolio: "Ver Portafolio",
        checkAvailability: "Consultar Disponibilidad",
        weddings: "Bodas",
        corporateEvents: "Eventos Corporativos",
        bookConsultation: "Reservar una Consulta",
      },
      suggestedPrompts: [
        "Planear mi boda",
        "¿Cuáles son sus precios?",
        "Reservar una consulta",
        "Muéstrame su portafolio de bodas",
        "¿Qué servicios ofrecen?",
        "Necesito un evento corporativo",
      ],
      closeChat: "Cerrar chat",
      listening: "Escuchando…",
      scrollUp: "Desplazar hacia arriba",
      scrollDown: "Desplazar hacia abajo",
      sendMessage: "Enviar mensaje",
      startVoice: "Iniciar entrada de voz",
      stopVoice: "Detener entrada de voz",
      connectionError:
        "Tengo problemas de conexión en este momento. Por favor contáctanos por el formulario o WhatsApp y nuestro equipo te responderá personalmente.",
      notConnected:
        "¡Gracias por contactarnos! Nuestra asistente de IA aún no está completamente conectada, pero a nuestro equipo le encantaría ayudarte — usa el formulario de contacto abajo o escríbenos por WhatsApp y te responderemos personalmente.",
      apiError:
        "Tengo problemas de conexión en este momento. Por favor contáctanos por el formulario o WhatsApp y nuestro equipo te responderá personalmente.",
      followUp: "Deja que nuestro equipo de eventos te dé seguimiento personalmente — ¿cuál es la mejor forma de contactarte?",
      defaultReply: "Estoy aquí para ayudar — ¿puedes contarme más sobre tu evento?",
      alreadyPendingSlot: "Ya elegiste el {date} a las {time} ✨ ¡Solo comparte tu nombre, correo y teléfono arriba para confirmarlo!",
    },
    whatsappMessage: "Hola Event Masterpiece Plus, me gustaría preguntar sobre un evento.",
  },
} as const;

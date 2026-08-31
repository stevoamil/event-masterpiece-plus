export type Locale = "en" | "fr";

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
  };
  whatsappMessage: string;
}

const eventTypesEn = ["Wedding", "Corporate Event", "Private Party", "Baby Shower", "Anniversary"];
const eventTypesFr = ["Mariage", "Événement d'entreprise", "Fête privée", "Baby Shower", "Anniversaire"];
const budgetsEn = ["< $5,000", "$5,000 - $10,000", "$10,000 - $20,000", "$20,000 - $40,000", "$40,000 - $60,000", "$60,000+"];
const budgetsFr = ["< 5 000 $", "5 000 $ - 10 000 $", "10 000 $ - 20 000 $", "20 000 $ - 40 000 $", "40 000 $ - 60 000 $", "60 000 $+"];

export const eventTypeOptions: Record<Locale, string[]> = { en: eventTypesEn, fr: eventTypesFr };
export const budgetOptions: Record<Locale, string[]> = { en: budgetsEn, fr: budgetsFr };
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
      cta2: "Ask Marina's Assistant",
      scroll: "Scroll to explore",
    },
    about: {
      kicker: "The Studio",
      title: "A decade of crafting unforgettable days",
      body: "I'm an event designer and planner with a love for atmosphere, styling, and the small details that make a celebration unforgettable. From intimate gatherings to grand affairs, I bring creativity, warmth, and precision to every event I design.",
      stat1: "150+",
      stat1Label: "Events Designed",
      stat2: "10",
      stat2Label: "Years of Craft",
      stat3: "25+",
      stat3Label: "Cities / Destinations Served",
      quote: '"We don\'t plan events. We compose experiences."',
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
        { name: "Camille & Antoine", role: "Wedding, Château de Vaux", quote: "Marina and her team turned our wedding into something out of a dream. Every detail felt like us, elevated." },
        { name: "Sophie Laurent", role: "CEO, Laurent & Co.", quote: "Our product launch was flawless. Guests are still talking about the atmosphere she created." },
        { name: "Yasmine B.", role: "Baby Shower, Cannes", quote: "So soft, so joyful, so effortless — for us at least. Marina handled every single detail." },
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
      cta: "Ask Marina — Your AI Event Planner",
      title: "Ask Marina",
      subtitle: "Your AI Event Planner",
      placeholder: "Type your message…",
      greeting:
        "Hello ✨ I'm Marina's assistant, here to help you plan your event. I can help you explore our services, discover inspiration, answer your questions, or book a consultation with our team. What are you planning?",
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
    },
    whatsappMessage: "Hi Events By Marina, I'd like to inquire about an event.",
  },
  fr: {
    nav: {
      services: "Services",
      portfolio: "Portfolio",
      process: "Processus",
      testimonials: "Témoignages",
      contact: "Contact",
      whatsapp: "Discuter sur WhatsApp",
      book: "Réserver une consultation",
    },
    hero: {
      kicker: "Mariages · Célébrations · Événements de Destination",
      title1: "Chaque Détail,",
      title2: "Magnifiquement Raconté.",
      subtitle: "Votre vision, réalisée à la perfection",
      cta1: "Commencer",
      cta2: "Demander à l'assistante de Marina",
      scroll: "Faites défiler",
    },
    about: {
      kicker: "Le Studio",
      title: "Une décennie à créer des jours inoubliables",
      body: "Je suis designer et organisatrice d'événements, passionnée par l'ambiance, le style et les petits détails qui rendent une célébration inoubliable. Des rassemblements intimes aux grandes réceptions, j'apporte créativité, chaleur et précision à chaque événement que je conçois.",
      stat1: "150+",
      stat1Label: "Événements conçus",
      stat2: "10",
      stat2Label: "Années d'expertise",
      stat3: "25+",
      stat3Label: "Villes / Destinations desservies",
      quote: "« Nous ne planifions pas des événements. Nous composons des expériences. »",
    },
    services: {
      kicker: "Ce Que Nous Créons",
      title: "Des services sur-mesure pour chaque célébration",
      items: [
        { name: "Mariages", desc: "Conception et coordination complètes pour le jour le plus important de votre vie — de l'élopement intime aux grandes réceptions de château." },
        { name: "Événements d'entreprise", desc: "Lancements de produits, galas et séminaires pensés pour refléter votre marque avec impact." },
        { name: "Fêtes Privées", desc: "Anniversaires marquants, dîners de fiançailles et soirées intimes conçus autour de vous et vos invités." },
        { name: "Baby Showers", desc: "Des célébrations douces et joyeuses, stylées avec un regard délicat sur le détail et la couleur." },
        { name: "Anniversaires de Mariage", desc: "Honorer des années d'amour avec des célébrations aussi intemporelles que l'événement lui-même." },
      ],
      cta: "Découvrir l'offre",
    },
    portfolio: {
      kicker: "Nos Réalisations",
      title: "Une galerie de jours inoubliables",
      filterAll: "Tout",
    },
    process: {
      kicker: "Notre Méthode",
      title: "De la première conversation à la touche finale",
      steps: [
        { name: "Consultation", desc: "Nous écoutons votre histoire, votre vision, vos incontournables. Tout part de là." },
        { name: "Concept", desc: "Une direction créative sur-mesure : ambiance, palette, narration, présentée sous forme de moodboard." },
        { name: "Design", desc: "Fleurs, décor, lumière, art de la table et sélection des prestataires, affinés dans les moindres détails." },
        { name: "Exécution", desc: "Contrats, logistique, plannings et gestion des prestataires gérés méticuleusement en coulisses." },
        { name: "Jour J", desc: "Nous nous effaçons pour que vous viviez pleinement l'instant — chaque timing, parfaitement orchestré." },
      ],
    },
    testimonials: {
      kicker: "Ils Nous Font Confiance",
      title: "Adoré par nos clients",
      items: [
        { name: "Camille & Antoine", role: "Mariage, Château de Vaux", quote: "Marina et son équipe ont transformé notre mariage en un rêve. Chaque détail nous ressemblait, sublimé." },
        { name: "Sophie Laurent", role: "PDG, Laurent & Co.", quote: "Notre lancement produit était parfait. Nos invités parlent encore de l'ambiance créée." },
        { name: "Yasmine B.", role: "Baby Shower, Cannes", quote: "Si doux, si joyeux, si simple — pour nous en tout cas. Marina a géré chaque détail." },
        { name: "Elise & Marc", role: "30 ans de mariage", quote: "Une célébration aussi élégante et durable que notre union. Nous sommes infiniment reconnaissants." },
      ],
    },
    contact: {
      kicker: "Créons Ensemble",
      title: "Parlez-nous de votre célébration",
      subtitle: "Partagez quelques détails et notre équipe vous répondra sous 24h avec des recommandations sur-mesure.",
      form: {
        name: "Nom complet",
        email: "Adresse e-mail",
        phone: "Numéro de téléphone",
        eventType: "Type d'événement",
        date: "Date souhaitée",
        guests: "Nombre d'invités estimé",
        budget: "Budget estimé",
        message: "Parlez-nous de votre vision",
        submit: "Envoyer la demande",
        submitting: "Envoi…",
        submitted: "Merci — votre demande a bien été reçue. Nous vous répondrons sous 24h.",
        error: "Une erreur est survenue. Réessayez ou contactez-nous sur WhatsApp.",
      },
      or: "ou contactez-nous directement",
      whatsapp: "Discuter sur WhatsApp",
      email: "Nous écrire",
      call: "Nous appeler",
    },
    footer: {
      tagline: "Chaque détail, magnifiquement raconté.",
      rights: "Tous droits réservés.",
      madeWith: "Conçu avec amour aux États-Unis",
      admin: "Espace Studio",
    },
    chat: {
      cta: "Demandez à Marina — Votre Planificatrice IA",
      title: "Demandez à Marina",
      subtitle: "Votre Planificatrice IA",
      placeholder: "Écrivez votre message…",
      greeting:
        "Bonjour ✨ Je suis l'assistante de Marina, ici pour vous aider à planifier votre événement. Je peux vous aider à découvrir nos services, trouver de l'inspiration, répondre à vos questions ou réserver une consultation avec notre équipe. Que planifiez-vous ?",
      quickActions: {
        planEvent: "Planifier mon événement",
        exploreServices: "Découvrir nos services",
        viewPortfolio: "Voir le portfolio",
        checkAvailability: "Vérifier les disponibilités",
        weddings: "Mariages",
        corporateEvents: "Événements d'entreprise",
        bookConsultation: "Réserver une consultation",
      },
      suggestedPrompts: [
        "Planifier mon mariage",
        "Quels sont vos tarifs ?",
        "Réserver une consultation",
        "Montrez-moi votre portfolio de mariages",
        "Quels services proposez-vous ?",
        "J'organise un événement d'entreprise",
      ],
      closeChat: "Fermer le chat",
      listening: "Écoute en cours…",
      scrollUp: "Défiler vers le haut",
      scrollDown: "Défiler vers le bas",
      sendMessage: "Envoyer le message",
      startVoice: "Démarrer la saisie vocale",
      stopVoice: "Arrêter la saisie vocale",
      connectionError:
        "J'ai un problème de connexion en ce moment. Merci de nous contacter via le formulaire ou WhatsApp — notre équipe vous répondra personnellement.",
      notConnected:
        "Merci de nous avoir contactés ! Notre assistante IA n'est pas encore pleinement connectée, mais notre équipe serait ravie de vous aider — merci d'utiliser le formulaire de contact ci-dessous ou de nous écrire sur WhatsApp, nous vous répondrons personnellement.",
      apiError:
        "J'ai un problème de connexion en ce moment. Merci de nous contacter via le formulaire ou WhatsApp — notre équipe vous répondra personnellement.",
      followUp: "Laissez notre équipe événementielle assurer le suivi personnellement — quel est le meilleur moyen de vous contacter ?",
      defaultReply: "Je suis là pour vous aider — pouvez-vous m'en dire plus sur votre événement ?",
    },
    whatsappMessage: "Bonjour Events By Marina, je souhaite me renseigner sur un événement.",
  },
} as const;

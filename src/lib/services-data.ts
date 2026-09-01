import type { Locale } from "@/lib/i18n/dictionaries";

export interface ServiceCategory {
  slug: string;
  image: string;
  en: { name: string; shortDesc: string; longDesc: string };
  es: { name: string; shortDesc: string; longDesc: string };
}

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "weddings",
    image: "/images/services/weddings.png",
    en: {
      name: "Weddings",
      shortDesc: "End-to-end design and coordination for the biggest day on your calendar.",
      longDesc:
        "From an intimate elopement to a full château celebration, we handle every layer of your wedding — concept, florals, lighting, tablescapes, vendor coordination and day-of execution — so all you have to do is show up and enjoy it.",
    },
    es: {
      name: "Bodas",
      shortDesc: "Diseño y coordinación integral para el día más importante de tu calendario.",
      longDesc:
        "De una fuga íntima a una gran celebración en un castillo, nos encargamos de cada capa de tu boda — concepto, flores, iluminación, montaje de mesas, coordinación de proveedores y ejecución el día del evento — para que solo tengas que llegar y disfrutar.",
    },
  },
  {
    slug: "engagements",
    image: "/images/services/engagements.png",
    en: {
      name: "Engagements",
      shortDesc: "Thoughtfully designed moments to open the next chapter of your story.",
      longDesc:
        "From a private proposal setting to a lively engagement party, we shape the atmosphere, the details and the timing — giving this first milestone the same care as the wedding still to come.",
    },
    es: {
      name: "Compromisos",
      shortDesc: "Momentos diseñados con cuidado para abrir el próximo capítulo de tu historia.",
      longDesc:
        "Desde un escenario de propuesta privada hasta una animada fiesta de compromiso, damos forma al ambiente, los detalles y el tiempo — dándole a este primer hito el mismo cuidado que la boda que aún vendrá.",
    },
  },
  {
    slug: "bridal-events",
    image: "/images/services/bridal-events.png",
    en: {
      name: "Bridal Events",
      shortDesc: "Showers, send-offs and every gathering built around the bride.",
      longDesc:
        "From bridal showers to bachelorette weekends, we style each celebration around the bride-to-be with soft florals, considered tablescapes and a warmth that fits the occasion.",
    },
    es: {
      name: "Eventos de Novia",
      shortDesc: "Showers, despedidas y cada reunión pensada alrededor de la novia.",
      longDesc:
        "De los showers nupciales a los fines de semana de despedida de soltera, estilizamos cada celebración alrededor de la futura novia con flores suaves, montajes de mesa cuidados y una calidez acorde a la ocasión.",
    },
  },
  {
    slug: "family-events",
    image: "/images/services/family-events.png",
    en: {
      name: "Family Events",
      shortDesc: "Gatherings that bring generations together around one table.",
      longDesc:
        "Reunions, milestone celebrations and multi-generational get-togethers — we design events that give everyone, from grandparents to the youngest cousins, a beautiful reason to gather.",
    },
    es: {
      name: "Eventos Familiares",
      shortDesc: "Reuniones que unen generaciones alrededor de una misma mesa.",
      longDesc:
        "Reuniones familiares, celebraciones importantes y encuentros multigeneracionales — diseñamos eventos que le dan a todos, desde los abuelos hasta los primos más pequeños, una hermosa razón para reunirse.",
    },
  },
  {
    slug: "kids-birthdays",
    image: "/images/services/kids-birthdays.png",
    en: {
      name: "Kids Birthdays",
      shortDesc: "Imaginative, beautifully styled parties built for little ones.",
      longDesc:
        "A children's party deserves the same craft as any other celebration. We design tasteful themes, charming details and an atmosphere that keeps kids and parents equally delighted.",
    },
    es: {
      name: "Cumpleaños Infantiles",
      shortDesc: "Fiestas imaginativas y bellamente estilizadas, pensadas para los más pequeños.",
      longDesc:
        "Una fiesta infantil merece el mismo cuidado que cualquier otra celebración. Diseñamos temáticas elegantes, detalles encantadores y un ambiente que deleita por igual a niños y padres.",
    },
  },
  {
    slug: "luxury-dinners",
    image: "/images/services/luxury-dinners.png",
    en: {
      name: "Luxury Dinners",
      shortDesc: "Candlelit dining moments built around exceptional table design.",
      longDesc:
        "For private dinners, milestone toasts and small gatherings, we craft the full sensory experience — tablescape, lighting, florals and pacing — so every course feels part of one considered evening.",
    },
    es: {
      name: "Cenas de Lujo",
      shortDesc: "Momentos gastronómicos a la luz de las velas, construidos alrededor de un diseño de mesa excepcional.",
      longDesc:
        "Para cenas privadas, brindis memorables y pequeñas reuniones, creamos la experiencia sensorial completa — montaje de mesa, iluminación, flores y ritmo — para que cada plato forme parte de una velada cuidadosamente pensada.",
    },
  },
  {
    slug: "product-launches",
    image: "/images/services/product-launches.png",
    en: {
      name: "Product Launches",
      shortDesc: "Launch events engineered to land your brand's moment perfectly.",
      longDesc:
        "We design product launches and brand activations that carry your identity with precision — from concept and staging through to guest experience — so your moment makes exactly the impact you intended.",
    },
    es: {
      name: "Lanzamientos de Producto",
      shortDesc: "Eventos de lanzamiento diseñados para que el momento de tu marca aterrice a la perfección.",
      longDesc:
        "Diseñamos lanzamientos de producto y activaciones de marca que llevan tu identidad con precisión — desde el concepto y la escenografía hasta la experiencia del invitado — para que tu momento tenga exactamente el impacto que buscabas.",
    },
  },
  {
    slug: "corporate-events",
    image: "/images/services/corporate-events.png",
    en: {
      name: "Corporate Events",
      shortDesc: "Galas, retreats and launches produced with brand-perfect polish.",
      longDesc:
        "From executive retreats to company galas, we manage the full production — venue, design, logistics and vendor coordination — so your event carries your brand with the polish it deserves.",
    },
    es: {
      name: "Eventos Corporativos",
      shortDesc: "Galas, retiros y lanzamientos producidos con un acabado perfecto para tu marca.",
      longDesc:
        "Desde retiros ejecutivos hasta galas corporativas, gestionamos la producción completa — sede, diseño, logística y coordinación de proveedores — para que tu evento lleve tu marca con el refinamiento que merece.",
    },
  },
  {
    slug: "private-events",
    image: "/images/services/private-events.png",
    en: {
      name: "Private Events",
      shortDesc: "Milestone celebrations and intimate evenings designed around you.",
      longDesc:
        "Milestone birthdays, private soirées and personal celebrations of every kind — each one designed around you and your guests, with the same craft we bring to our largest productions.",
    },
    es: {
      name: "Eventos Privados",
      shortDesc: "Celebraciones importantes y veladas íntimas diseñadas alrededor de ti.",
      longDesc:
        "Cumpleaños importantes, veladas privadas y celebraciones personales de todo tipo — cada una diseñada alrededor de ti y tus invitados, con el mismo cuidado que aportamos a nuestras producciones más grandes.",
    },
  },
  {
    slug: "baby-showers",
    image: "/images/services/baby-showers.png",
    en: {
      name: "Baby Showers",
      shortDesc: "Gentle, joyful celebrations styled down to the smallest detail.",
      longDesc:
        "We style baby showers with a soft, joyful touch — tender palettes, delicate florals and thoughtful details that celebrate this new chapter with comfort and warmth.",
    },
    es: {
      name: "Baby Showers",
      shortDesc: "Celebraciones suaves y alegres, estilizadas hasta el más mínimo detalle.",
      longDesc:
        "Estilizamos los baby showers con un toque suave y alegre — paletas tiernas, flores delicadas y detalles cuidados que celebran este nuevo capítulo con comodidad y calidez.",
    },
  },
  {
    slug: "gala-luxury-events",
    image: "/images/services/gala-luxury-events.png",
    en: {
      name: "Gala & Luxury Events",
      shortDesc: "Grand-scale black-tie evenings, designed to be unforgettable.",
      longDesc:
        "For black-tie galas and large-scale luxury events, we bring together dramatic florals, considered lighting and flawless production for an evening your guests will keep talking about.",
    },
    es: {
      name: "Galas y Eventos de Lujo",
      shortDesc: "Veladas de gala a gran escala, de etiqueta, diseñadas para ser inolvidables.",
      longDesc:
        "Para galas de etiqueta y eventos de lujo a gran escala, reunimos flores dramáticas, iluminación cuidada y una producción impecable para una velada de la que tus invitados seguirán hablando.",
    },
  },
  {
    slug: "event-styling-decor",
    image: "/images/services/event-styling-decor.png",
    en: {
      name: "Event Styling & Décor",
      shortDesc: "Bespoke florals, lighting and table design layered onto any event.",
      longDesc:
        "Our styling and décor service covers florals, table design, lighting and every visual layer in between — a fully bespoke design pass you can add to any celebration, large or small.",
    },
    es: {
      name: "Estilismo y Decoración",
      shortDesc: "Flores, iluminación y diseño de mesa a medida, aplicados a cualquier evento.",
      longDesc:
        "Nuestro servicio de estilismo y decoración cubre flores, diseño de mesa, iluminación y cada capa visual intermedia — un diseño completamente a medida que puedes añadir a cualquier celebración, grande o pequeña.",
    },
  },
  {
    slug: "event-entertainment",
    image: "/images/services/event-entertainment.png",
    en: {
      name: "Event Entertainment",
      shortDesc: "Live music, performers and entertainment curated to fit your event.",
      longDesc:
        "We source and coordinate live music, performers and curated entertainment that match the tone of your event precisely — building a programme that keeps guests engaged from the first toast to the last dance.",
    },
    es: {
      name: "Entretenimiento para Eventos",
      shortDesc: "Música en vivo, artistas y entretenimiento seleccionados para tu evento.",
      longDesc:
        "Buscamos y coordinamos música en vivo, artistas y entretenimiento seleccionado que se ajusta con precisión al tono de tu evento — construyendo un programa que mantiene a los invitados comprometidos desde el primer brindis hasta el último baile.",
    },
  },
  {
    slug: "event-production",
    image: "/images/services/event-production.png",
    en: {
      name: "Event Production",
      shortDesc: "Full technical and logistical production, handled from start to finish.",
      longDesc:
        "Staging, sound, lighting, rigging and on-site logistics — our production team runs the technical backbone of your event so nothing is left to chance on the day.",
    },
    es: {
      name: "Producción de Eventos",
      shortDesc: "Producción técnica y logística completa, gestionada de principio a fin.",
      longDesc:
        "Escenografía, sonido, iluminación, rigging y logística en sitio — nuestro equipo de producción maneja la columna vertebral técnica de tu evento para que nada se deje al azar el día del evento.",
    },
  },
  {
    slug: "anniversaries",
    image: "/images/about-4.webp",
    en: {
      name: "Anniversaries",
      shortDesc: "Celebrations as lasting and elegant as the years they honour.",
      longDesc:
        "Whether it's a first year or a fiftieth, we design anniversary celebrations that honour the years behind you with a warmth and elegance as enduring as the milestone itself.",
    },
    es: {
      name: "Aniversarios de Boda",
      shortDesc: "Celebraciones tan duraderas y elegantes como los años que honran.",
      longDesc:
        "Ya sea un primer año o un quincuagésimo aniversario, diseñamos celebraciones que honran los años vividos con una calidez y elegancia tan duraderas como el hito mismo.",
    },
  },
];

export function getServiceBySlug(slug: string) {
  return serviceCategories.find((s) => s.slug === slug);
}

export function serviceContent(service: ServiceCategory, locale: Locale) {
  return service[locale];
}

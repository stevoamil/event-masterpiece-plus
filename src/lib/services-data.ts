import type { Locale } from "@/lib/i18n/dictionaries";

export interface ServiceCategory {
  slug: string;
  image: string;
  en: { name: string; shortDesc: string; longDesc: string };
  fr: { name: string; shortDesc: string; longDesc: string };
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
    fr: {
      name: "Mariages",
      shortDesc: "Conception et coordination de bout en bout pour le jour le plus important de votre calendrier.",
      longDesc:
        "D'un élopement intime à une grande réception de château, nous prenons en charge chaque couche de votre mariage — concept, fleurs, lumière, art de la table, coordination des prestataires et exécution le jour J — pour que vous n'ayez plus qu'à profiter de l'instant.",
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
    fr: {
      name: "Fiançailles",
      shortDesc: "Des moments pensés avec soin pour ouvrir le prochain chapitre de votre histoire.",
      longDesc:
        "D'une mise en scène de demande en mariage privée à une fête de fiançailles animée, nous façonnons l'ambiance, les détails et le timing — pour que ce premier jalon reçoive autant d'attention que le mariage à venir.",
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
    fr: {
      name: "Événements de Mariée",
      shortDesc: "Douches nuptiales, célébrations de départ et tous les rassemblements pensés pour la mariée.",
      longDesc:
        "Des douches nuptiales aux week-ends d'enterrement de vie de jeune fille, nous stylons chaque célébration autour de la future mariée avec des fleurs délicates, un art de la table soigné et une chaleur adaptée à l'occasion.",
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
    fr: {
      name: "Événements Familiaux",
      shortDesc: "Des rassemblements qui réunissent les générations autour d'une même table.",
      longDesc:
        "Réunions de famille, célébrations marquantes et retrouvailles intergénérationnelles — nous concevons des événements qui donnent à chacun, des grands-parents aux plus jeunes cousins, une belle raison de se retrouver.",
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
    fr: {
      name: "Anniversaires Enfants",
      shortDesc: "Des fêtes pleines d'imagination, joliment stylées, pensées pour les tout-petits.",
      longDesc:
        "Une fête d'enfant mérite le même savoir-faire que toute autre célébration. Nous concevons des thèmes raffinés, des détails charmants et une ambiance qui ravit petits et grands.",
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
    fr: {
      name: "Dîners de Luxe",
      shortDesc: "Des dîners aux chandelles construits autour d'un art de la table d'exception.",
      longDesc:
        "Pour les dîners privés, les toasts marquants et les petits rassemblements, nous créons l'expérience sensorielle complète — art de la table, lumière, fleurs et rythme — pour que chaque service s'inscrive dans une soirée pensée dans son ensemble.",
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
    fr: {
      name: "Lancements de Produits",
      shortDesc: "Des événements de lancement pensés pour faire vivre votre marque avec impact.",
      longDesc:
        "Nous concevons des lancements de produits et activations de marque qui portent votre identité avec précision — du concept à la scénographie jusqu'à l'expérience invité — pour que votre moment ait exactement l'impact recherché.",
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
    fr: {
      name: "Événements d'Entreprise",
      shortDesc: "Galas, séminaires et lancements produits avec un fini parfaitement à l'image de votre marque.",
      longDesc:
        "Des séminaires exécutifs aux galas d'entreprise, nous gérons la production complète — lieu, design, logistique et coordination des prestataires — pour que votre événement porte votre marque avec tout le raffinement qu'elle mérite.",
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
    fr: {
      name: "Événements Privés",
      shortDesc: "Des célébrations marquantes et des soirées intimes conçues autour de vous.",
      longDesc:
        "Anniversaires marquants, soirées privées et célébrations personnelles de toute nature — chacune conçue autour de vous et de vos invités, avec le même savoir-faire que nos plus grandes productions.",
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
    fr: {
      name: "Baby Showers",
      shortDesc: "Des célébrations douces et joyeuses, stylées jusque dans les moindres détails.",
      longDesc:
        "Nous stylons les baby showers avec une touche douce et joyeuse — palettes tendres, fleurs délicates et détails pensés pour célébrer ce nouveau chapitre dans le confort et la chaleur.",
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
    fr: {
      name: "Galas & Événements de Luxe",
      shortDesc: "Des soirées de gala grandioses, en tenue de soirée, pensées pour marquer les esprits.",
      longDesc:
        "Pour les galas en tenue de soirée et les événements de luxe à grande échelle, nous réunissons fleurs spectaculaires, éclairage soigné et production sans faille pour une soirée dont vos invités se souviendront longtemps.",
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
    fr: {
      name: "Styling & Décoration",
      shortDesc: "Fleurs, lumière et art de la table sur-mesure, ajoutés à n'importe quel événement.",
      longDesc:
        "Notre service de styling et décoration couvre les fleurs, l'art de la table, la lumière et chaque couche visuelle entre les deux — une passe de design entièrement sur-mesure que vous pouvez ajouter à toute célébration, petite ou grande.",
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
    fr: {
      name: "Animation d'Événement",
      shortDesc: "Musique live, artistes et animations sélectionnés pour votre événement.",
      longDesc:
        "Nous sélectionnons et coordonnons musique live, artistes et animations qui correspondent précisément au ton de votre événement — en construisant une programmation qui garde vos invités engagés du premier toast à la dernière danse.",
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
    fr: {
      name: "Production d'Événement",
      shortDesc: "Production technique et logistique complète, gérée du début à la fin.",
      longDesc:
        "Scénographie, son, lumière, rigging et logistique sur site — notre équipe de production gère l'ossature technique de votre événement pour que rien ne soit laissé au hasard le jour J.",
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
    fr: {
      name: "Anniversaires de Mariage",
      shortDesc: "Des célébrations aussi durables et élégantes que les années qu'elles célèbrent.",
      longDesc:
        "Qu'il s'agisse d'une première année ou d'un cinquantième anniversaire, nous concevons des célébrations qui honorent les années passées avec une chaleur et une élégance aussi durables que l'événement lui-même.",
    },
  },
];

export function getServiceBySlug(slug: string) {
  return serviceCategories.find((s) => s.slug === slug);
}

export function serviceContent(service: ServiceCategory, locale: Locale) {
  return service[locale];
}

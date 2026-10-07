export type Locale = "en" | "es";

export interface Dictionary {
  nav: {
    menu: string;
    extras: string;
    learn: string;
    about: string;
    contact: string;
    bookEvent: string;
  };
  hero: {
    tagline: string;
    bookEvent: string;
    seeExperience: string;
  };
  concept: {
    eyebrow: string;
    title: string;
    body: string;
  };
  experience: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: { step: string; title: string; description: string }[];
  };
  menu: {
    eyebrow: string;
    title: string;
    intro: string;
  };
  paellas: {
    name: string;
    description: string;
    cta: string;
    watchLabel: string;
    blackLabel: string;
    blackActiveLabel: string;
    items: { name: string; description: string; blackOption?: string }[];
  };
  specials: {
    name: string;
    description: string;
    cta: string;
    watchLabel: string;
    items: { name: string; description: string }[];
  };
  customIdea: {
    name: string;
    description: string;
    title: string;
    body: string;
    tags: string[];
    cta: string;
    modal: {
      title: string;
      body: string;
      picks: string;
      email: string;
      ingredients: string;
      dislikes: string;
      guestCount: string;
      idea: string;
      submit: string;
      submitting: string;
      success: string;
      error: string;
    };
  };
  extras: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { name: string; points: string[] }[];
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    quote: string;
  };
  learnToCook: {
    eyebrow: string;
    teaser: {
      title: string;
      body: string;
      cta: string;
    };
    title: string;
    body: string;
    steps: string[];
    kitTitle: string;
    kit: string[];
    cta: string;
  };
  serviceArea: {
    eyebrow: string;
    title: string;
    body: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { question: string; answer: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    form: {
      name: string;
      email: string;
      phone: string;
      eventDate: string;
      eventTime: string;
      eventLocation: string;
      guestCount: string;
      eventType: string;
      eventTypeOptions: {
        privateParty: string;
        wedding: string;
        corporate: string;
        other: string;
      };
      message: string;
      askingAbout: string;
      addAnother: string;
      cookingClass: string;
      submit: string;
      submitting: string;
      success: string;
      error: string;
    };
  };
  footer: {
    rights: string;
  };
}

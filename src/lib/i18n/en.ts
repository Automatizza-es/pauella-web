import type { Dictionary } from "./types";

export const en: Dictionary = {
  nav: {
    menu: "Menu",
    extras: "Extras",
    photoVideo: "Photo & Video",
    about: "About",
    contact: "Contact",
    bookEvent: "Book your event",
  },
  hero: {
    tagline: "Live paella catering in Los Angeles",
    bookEvent: "Book your event",
    seeExperience: "See the experience",
  },
  concept: {
    eyebrow: "Not just catering",
    title: "This is a fire, a pan, and Pau, cooking in front of you.",
    body: "Pau comes to your place, lights the fire, and cooks paella from scratch in front of your guests. No chafing dishes, no back of house. The cooking is part of the party, start to finish.",
  },
  experience: {
    eyebrow: "The Experience",
    title: "How it unfolds",
    subtitle: "From arrival to the final serving, each step becomes part of the experience.",
    steps: [
      {
        step: "01",
        title: "Arrival",
        description: "We arrive with the pan, the setup and everything needed.",
      },
      {
        step: "02",
        title: "Preparation",
        description: "Fresh ingredients are prepared right there.",
      },
      {
        step: "03",
        title: "Live cooking",
        description: "The paella comes to life over open fire.",
      },
      {
        step: "04",
        title: "Serving",
        description: "Served fresh, straight from the pan.",
      },
      {
        step: "05",
        title: "The moment",
        description: "More than a meal. A moment people remember.",
      },
    ],
  },
  menu: {
    eyebrow: "The Menu",
    title: "Three ways to the table",
    intro:
      "Start with a classic, go bigger with a signature pan, or bring your own idea and let Pau build the rest.",
  },
  paellas: {
    name: "The Classics",
    description:
      "Time-honored recipes, cooked the traditional way over an open flame. Familiar flavors, unforgettable tables.",
    cta: "Ask about this one",
    watchLabel: "Watch the paella",
    blackLabel: "Make it black",
    blackActiveLabel: "Black version",
    items: [
      {
        name: "Pauella",
        description:
          "Pau's favorite, with chicken, mushrooms and vegetables, deepened with Pedro Ximénez.",
      },
      {
        name: "The Original",
        description: "A tribute to traditional Valencian paella, cooked the way it's meant to be.",
      },
      {
        name: "The Señorito",
        description: "Mediterranean seafood paella, prepared shell-free for effortless eating.",
        blackOption:
          "Squid ink turns the rice jet black. Same seafood, a deeper, briny finish.",
      },
    ],
  },
  specials: {
    name: "Signature Paellas",
    description:
      "Built for events that want to go further. A little more fire, a little more spectacle, a pan nobody forgets.",
    cta: "Ask about this one",
    watchLabel: "Watch the paella",
    items: [
      {
        name: "The Showstopper",
        description: "Lobster takes the center of the pan. Built to be the moment of the night.",
      },
      {
        name: "The Tomahawk",
        description:
          "Grilled tomahawk steak, sliced tableside over the pan, with mushrooms and eggplant.",
      },
    ],
  },
  customIdea: {
    name: "Custom Paella",
    description: "Your ingredients, your ideas. A pan designed entirely around what you love.",
    title: "Tell us what you love.",
    body: "Pau designs a pan around your idea.",
    tags: ["Meat", "Spicy", "Truffle", "Surprise me"],
    cta: "Tell Pau your idea",
    modal: {
      title: "Tell Pau your idea",
      body: "A few details help Pau shape the right proposal for your event.",
      picks: "Your picks",
      email: "Email",
      ingredients: "Favorite ingredients",
      dislikes: "Anything you don't like?",
      guestCount: "Number of guests",
      idea: "Tell us your idea",
      submit: "Send my idea",
      submitting: "Sending…",
      success: "Thank you. Pau has your idea and will follow up with a proposal for your event.",
      error: "Something went wrong. Please try again, or email us directly.",
    },
  },
  extras: {
    eyebrow: "Make It Yours",
    title: "A little extra?",
    subtitle: "Add a few things to make the experience even more yours.",
    items: [
      {
        name: "Jamón",
        points: ["Jamón serrano", "Jamón ibérico", "Live carving station"],
      },
      {
        name: "Small Bites",
        points: ["Olives", "Manchego", "Pan con tomate"],
      },
      {
        name: "Staff",
        points: ["Waiters", "Passed appetizers", "Table service"],
      },
      {
        name: "Something Special",
        points: ["Extras tailored to your event"],
      },
    ],
  },
  about: {
    eyebrow: "Hosted by Pau",
    title: "A Spaniard in California",
    body: "Cooking one party at a time. Pau grew up around Valencian paella, and knows exactly when to respect the tradition, when to reinterpret it, and when to go one step further.",
    quote: "Life is short. Make paella.",
  },
  photoVideo: {
    eyebrow: "Capture The Day",
    title: "Make your day unforgettable.",
    body: "Beyond the live cooking, we can capture the best moments of your event in photo and video, so you can relive them.",
    points: [
      {
        name: "Event coverage",
        description: "We capture the atmosphere and the moments that matter.",
      },
      {
        name: "Candid photography",
        description: "Guests, details and real moments.",
      },
      {
        name: "Highlight video",
        description: "A short film to remember the day.",
      },
    ],
    cta: "Add photo & video",
  },
  learnToCook: {
    eyebrow: "Learn To Cook",
    teaser: {
      title: "Your turn at the pan.",
      body: "Pick your paella. Pau brings the kit and shows you how it's done.",
      cta: "Cook with Pau",
    },
    title: "Cook it with Pau.",
    body: "Pick your paella, learn the fire and take the know-how home.",
    steps: ["Pick your paella", "Get your kit", "Cook with Pau", "Make it yours"],
    kitTitle: "Your Paella Kit",
    kit: [
      "Paella pan",
      "Burner and cooking setup",
      "Essential tools",
      "Ingredients for the session",
      "One-to-one cooking experience with Pau",
      "Your recipe to make it again",
    ],
    cta: "Start cooking",
  },
  serviceArea: {
    eyebrow: "Where We Cook",
    title: "Los Angeles & Southern California",
    body: "Pauella is based in Los Angeles and travels to private venues across Southern California. Tell us your event location when you request your event, and we'll confirm availability.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Good to know",
    items: [
      {
        question: "How does a live paella catering event work?",
        answer:
          "Pau arrives at your venue with the pan, ingredients and fire setup, and cooks the paella in front of your guests from start to finish. It usually takes around four hours total, including setup, cooking, serving and cleanup.",
      },
      {
        question: "Where do you cook, and do you bring your own equipment?",
        answer:
          "Yes. Pau brings the paella pan, the burner and everything needed to cook on site, whether that's a backyard, a rooftop, a showroom or another private venue.",
      },
      {
        question: "What areas do you serve?",
        answer:
          "Pauella is based in Los Angeles and serves events across Southern California. Share your event location when you request your event and we'll confirm availability.",
      },
      {
        question: "Which paella should I choose?",
        answer:
          "It depends on your guests and your event. We offer traditional, seafood and a lobster-centered option. Tell us about your event and we'll help you pick the right one, or mix a couple for larger groups.",
      },
      {
        question: "Can you accommodate dietary restrictions?",
        answer:
          "Let us know about any allergies or dietary needs when you request your event, and we'll work with you on the menu.",
      },
      {
        question: "How far in advance should I book?",
        answer:
          "As soon as you have a date. Weekends and peak season fill up first, so the earlier you reach out, the more flexibility we'll have.",
      },
    ],
  },
  contact: {
    eyebrow: "Book Your Event",
    title: "Let's put a fire in your backyard.",
    body: "Share a few details and we'll get back to you to talk menu, timing and logistics.",
    form: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      eventDate: "Event date",
      eventLocation: "Event location",
      guestCount: "Number of guests",
      eventType: "Event type",
      eventTypeOptions: {
        privateParty: "Private party",
        wedding: "Wedding",
        corporate: "Corporate event",
        other: "Other",
      },
      message: "Tell us about your event",
      askingAbout: "Asking about",
      addAnother: "+ Add another paella",
      cookingClass: "Cooking class with Pau",
      submit: "Request your event",
      submitting: "Sending…",
      success: "Thank you. Your request is in. We'll get back to you shortly to talk details.",
      error: "Something went wrong. Please try again, or email us directly.",
    },
  },
  footer: {
    rights: "Los Angeles, CA.",
  },
};

export type Locale = "th" | "en";

export interface Dictionary {
  common: {
    brandName: string;
    tagline: string;
    startProject: string;
    viewWorks: string;
    viewCaseStudy: string;
    allWorks: string;
    contactUs: string;
    learnMore: string;
    backToHome: string;
    backToWorks: string;
    viewDetails: string;
    loading: string;
    error: string;
    success: string;
    send: string;
    sending: string;
    optional: string;
    required: string;
  };
  nav: {
    services: string;
    works: string;
    process: string;
    about: string;
    contact: string;
    admin: string;
  };
  hero: {
    badge: string;
    headlineLine1: string;
    headlineLine2: string;
    headlineLine3: string;
    subtext: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  servicesSection: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      number: string;
      title: string;
      description: string;
      features: string[];
    }[];
  };
  worksSection: {
    badge: string;
    title: string;
    subtitle: string;
    allCategories: string;
    viewAllWorks: string;
    categoryWeb: string;
    categoryMobile: string;
    categoryBusiness: string;
    categorySaas: string;
    categoryDashboard: string;
  };
  processSection: {
    badge: string;
    title: string;
    subtitle: string;
    steps: {
      number: string;
      title: string;
      subtitle: string;
      description: string;
    }[];
  };
  aboutSection: {
    badge: string;
    title: string;
    leadText: string;
    description: string;
    principles: {
      title: string;
      description: string;
    }[];
    techHeadline: string;
  };
  aiEngineeringSection: {
    badge: string;
    title: string;
    subtitle: string;
    features: {
      title: string;
      description: string;
      tag: string;
    }[];
    securityBadge: string;
    securityGuarantee: string;
  };
  ctaSection: {
    badge: string;
    headline: string;
    subtext: string;
    button: string;
  };
  contactPage: {
    badge: string;
    title: string;
    subtitle: string;
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      company: string;
      companyPlaceholder: string;
      projectType: string;
      projectTypePlaceholder: string;
      projectTypes: { value: string; label: string }[];
      budget: string;
      budgetPlaceholder: string;
      budgetOptions: { value: string; label: string }[];
      message: string;
      messagePlaceholder: string;
      submitButton: string;
      submitting: string;
      successTitle: string;
      successMessage: string;
      sendAnother: string;
      errorMessage: string;
    };
    info: {
      directEmail: string;
      location: string;
      workingHours: string;
      responseGuarantee: string;
      facebookPage: string;
      facebookMessenger: string;
    };
  };
  messengerWidget: {
    floatingTooltip: string;
    onlineStatus: string;
    title: string;
    subtitle: string;
    greeting: string;
    quickQuestionsTitle: string;
    quickQuestions: { label: string; text: string }[];
    openMessenger: string;
    chatWithDeveloper: string;
    otherChannels: string;
    close: string;
  };
  caseStudy: {
    overview: string;
    challenge: string;
    solution: string;
    keyFeatures: string;
    technologies: string;
    screenshots: string;
    result: string;
    client: string;
    year: string;
    category: string;
    ctaHeadline: string;
    ctaSubtext: string;
    ctaButton: string;
  };
  footer: {
    tagline: string;
    rights: string;
    navigationTitle: string;
    servicesTitle: string;
    connectTitle: string;
    socialTitle: string;
  };
}

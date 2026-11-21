/* ------------------------------------------------------------------
   Types
------------------------------------------------------------------- */
export interface SocialLinks {
  github: string;
  linkedin: string;
  instagram: string;
  facebook: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
}

export interface SkillGroup {
  id: string;
  label: string;
  tags: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  credentialUrl: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  repoUrl: string;
}

export interface SectionCopy {
  /** Small red uppercase mono label above the heading. */
  label: string;
  heading: string;
  subtext?: string;
}

export type InterestKey = 'games' | 'animation' | 'moviesTv';

export interface PersonalItem {
  id: string;
  title: string;
  genre: string;
  note: string;
  /** Image path under /public, e.g. /media/games/game-1.jpg */
  image: string;
  /** Optional alt text. Falls back to the title when omitted. */
  imageAlt?: string;
}

export type CurrentlyKind = 'playing' | 'watching' | 'reading';

export interface CurrentlyItem {
  id: string;
  kind: CurrentlyKind;
  title: string;
  /** Short progress label, e.g. "Chapter 12", "S2 E5", "Level 34". */
  progressLabel: string;
  /** 0 to 100. Drives the progress bar. */
  progress: number;
}

export interface PersonalStat {
  id: string;
  label: string;
  /** Digits are counted up, e.g. "24" or "5+". Text such as "[00]" is kept as written. */
  value: string;
}

/** A row in a "Plan to Play" / "Plan to Watch" list. */
export interface PlanItem {
  id: string;
  title: string;
  note: string;
  /** Optional status pill shown on the right of the row. */
  tag?: string;
}


/** Small red labels above the two columns of each interest section. */
export interface PersonalColumns {
  favorites: string;
  planToPlay: string;
  planToWatch: string;
}

export interface Quote {
  text: string;
  author: string;
}

/* "Others" section */
export type OthersKey = 'photography' | 'languages' | 'books';

export interface PhotoItem {
  id: string;
  title: string;
  caption: string;
  /** Path under /public, e.g. /photography/photo-1.jpg */
  src: string;
  alt: string;
}

export type LanguageLevel = 'native' | 'fluent' | 'learning';

export interface LanguageItem {
  id: string;
  name: string;
  level: LanguageLevel;
  /** 0 to 100. Drives the width of the proficiency bar. */
  proficiency: number;
}

export type BookStatus = 'reading' | 'finished' | 'want-to-read';

export interface BookItem {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
}

export interface OthersContent {
  /** Heading block for the whole "Others" section. */
  copy: SectionCopy;
  /** Sub-heading for each of the three subsections. */
  sections: Record<OthersKey, SectionCopy>;
  levelLabels: Record<LanguageLevel, string>;
  statusLabels: Record<BookStatus, string>;
  photography: PhotoItem[];
  languages: LanguageItem[];
  books: BookItem[];
}

export interface PersonalContent {
  /** Small red label above the page h1. */
  label: string;
  /** Page h1. */
  heading: string;
  intro: string;
  /** Heading block for the interests area. */
  interests: SectionCopy;
  /** Heading block for each interest category. */
  sections: Record<InterestKey, SectionCopy>;
  columns: PersonalColumns;
  games: PersonalItem[];
  animation: PersonalItem[];
  moviesTv: PersonalItem[];
  planToPlay: PlanItem[];
  planToWatchAnimation: PlanItem[];
  planToWatchMoviesTv: PlanItem[];
  others: OthersContent;
  currently: CurrentlyItem[];
  stats: PersonalStat[];
  quote: Quote;
}

export interface ContactLine {
  id: string;
  label: string;
  value: string;
  href: string;
}

export interface ContactFormErrors {
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  messageRequired: string;
  /** Use {min} as a placeholder for the minimum length. */
  messageTooShort: string;
}

export interface ContactFormCopy {
  placeholders: {
    name: string;
    email: string;
    message: string;
  };
  submit: string;
  /** Screen-reader status text while the form is sending. */
  submitting: string;
  minMessageLength: number;
  errors: ContactFormErrors;
  success: {
    title: string;
    body: string;
    reset: string;
  };
}

export interface ContactContent {
  currentPosition: string;
  directLines: ContactLine[];
  from: string;
  languages: string[];
  availableForHire: boolean;
  formIntro: string;
  /** Accessible label prefix for the copy buttons, e.g. "Copy Email". */
  copyLabel: string;
  /** Screen-reader confirmation after copying. */
  copiedLabel: string;
  /** Label shown on the status card when availableForHire is false. */
  unavailableLabel: string;
  availabilityNote: string;
  form: ContactFormCopy;
}

export type PageKey = 'professional' | 'personal' | 'contact';

export interface PageMeta {
  path: string;
  navLabel: string;
  title: string;
  heading: string;
}

export type SectionKey =
  | 'education'
  | 'experience'
  | 'skills'
  | 'certifications'
  | 'projects';

export interface UiStrings {
  skipToContent: string;
  github: string;
  liveSite: string;
  viewCredential: string;
  footerNote: string;
}

export interface SiteContent {
  name: string;
  role: string;
  bio: string;
  age: string;
  yearsExp: string;
  projectsDone: string;
  socials: SocialLinks;
  cvUrl: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillGroup[];
  certifications: Certification[];
  projects: Project[];
  personal: PersonalContent;
  contact: ContactContent;
  sections: Record<SectionKey, SectionCopy>;
  ui: UiStrings;
}

/* ------------------------------------------------------------------
   Pages (routes, nav labels, document titles, page headings)
------------------------------------------------------------------- */
export const pages: Record<PageKey, PageMeta> = {
  professional: {
    path: '/',
    navLabel: 'Professional',
    title: 'Muhammad Hamza — AI/ML Engineer',
    heading: 'Muhammad Hamza',
  },
  personal: {
    path: '/personal',
    navLabel: 'Personal',
    title: 'Personal — Muhammad Hamza',
    heading: 'Personal',
  },
  contact: {
    path: '/contact',
    navLabel: 'Contact',
    title: 'Contact — Muhammad Hamza',
    heading: 'Contact',
  },
};

export const pageList: PageMeta[] = [
  pages.professional,
  pages.personal,
  pages.contact,
];

/* ------------------------------------------------------------------
   Content. Every value below is a placeholder: replace anything in [brackets].
------------------------------------------------------------------- */
export const content: SiteContent = {
  name: 'Muhammad Hamza',
  role: 'AI/ML Engineer',
  bio: "Hello I'm a passionate AI/ML engineer dedicated to building scalable and efficient digital solutions. I blend technical precision with creative problem-solving.",

  // Stats. Replace with plain numbers as strings, e.g. "24".
  age: '24',
  yearsExp: '03+',
  projectsDone: '05',

  socials: {
    github: 'https://github.com/MuhammadHamza-7035',
    linkedin: 'https://www.linkedin.com/in/muhammad-hamza-5cs/',
    instagram: 'https://www.instagram.com/hamzaali_8',
    facebook: 'https://www.facebook.com/muhammad.hamza.759834',
  },

  cvUrl: '/MuhammadHamza_CV.pdf',

  education: [
    {
      id: 'edu-1',
      institution: 'University of Engineering and Technology, Peshawar',
      degree: 'BS Computer Science',
      period: '2024 - 2028',
      description: 'Doing my undergraduate studies in computer science, focusing on software development, algorithms, and data structures.',
    },
    {
      id: 'edu-2',
      institution: 'Peshawar Model Degree College',
      degree: 'FSc Pre-Medical',
      period: '2022 - 2024',
      description: 'Completed my intermediate education with a focus on science and medical subjects, preparing for further studies in computer science or Medical Field.',
    },
    {
      id: 'edu-3',
      institution: 'Peshawar Model School Boys 3',
      degree: 'SSC',
      period: '2020 - 2022',
      description: 'Completed my secondary education with a focus on science and mathematics.',
    },
  ],

  experience: [
    {
      id: 'exp-1',
      company: 'Horquva',
      role: 'AI/ML Intern',
      period: 'July 2026 - October 2026',
      location: 'Remote',
      summary: 'As an AI/ML intern at Horquva, I worked on developing and implementing machine learning models to solve real-world problems.',
      highlights: [
        'Engineered organizational simulation models and forecasting algorithms for the Enterprise Ontology Platform.',
        'Designed and implemented strict data contracts and core simulation logic using Pydantic to ensure robust and scalable platform architecture',
        'Authored detailed technical implementation plans and contributed to the platforms development through consistent code reviews and pull requests.',
      ],
    },
    {
      id: 'exp-2',
      company: 'CETQAP',
      role: 'PkTron Ambassador',
      period: 'July 2026 - September 2026',
      location: 'Remote',
      summary: 'As a PkTron Ambassador, I promoted awareness and engagement in emerging technologies, contributing to community building initiatives and supporting the growth of the PkTron community.',
      highlights: [
        'Selected as an Ambassador to promote awareness and engagement in emerging technologies in collaboration with CETQAP.',
        'Successfully fulfilled all program requirements and community building initiatives, earning the Certificate.',
        'Promoted and supported the growth of the PkTron community through various outreach and engagement activities.',
      ],
    },
    // Can add more when needed
  ],

  skills: [
    {
      id: 'skills-1',
      label: 'Programming Languages & Frameworks',
      tags: ['C & C++', 'Python', 'JavaScript', 'Java'],
    },
    {
      id: 'skills-2',
      label: 'Machine Learning & AI',
      tags: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'TensorFlow'],
    },
    {
      id: 'skills-3',
      label: 'Web & App Development',
      tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Flutter'],
    },
    {
      id: 'skills-4',
      label: 'Data Analysis & Visualization',
      tags: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
    },
  ],

  certifications: [
    {
      id: 'cert-1',
      title: 'IBM AI Engineering',
      issuer: 'IBM',
      year: '2025',
      credentialUrl: 'https://[credential-link].example',
    },
    {
      id: 'cert-2',
      title: 'IBM AI Developer',
      issuer: 'IBM',
      year: '2025',
      credentialUrl: 'https://[credential-link].example',
    },
    {
      id: 'cert-3',
      title: 'Crash Course on Python',
      issuer: 'Coursera',
      year: '2023',
      credentialUrl: 'https://[credential-link].example',
    },
  ],

  projects: [
    {
      id: 'project-1',
      title: 'Gaming Benchmark Estimator',
      description: 'A small project that estimates the performance of gaming benchmarks using machine learning techniques. It analyzes various parameters and predicts the expected benchmark scores for different hardware configurations.',
      tags: ['Python', 'ML', 'Matplotlib'],
      repoUrl: 'https://github.com/[username]/[repo-name]',
      image: '/images/p1.jpg',
    },
    {
      id: 'project-2',
      title: 'Movie WatchList App',
      description: 'University Project for Database Management System using Python and MySQL',
      tags: ['MySQL', 'Python', 'Flask'],
      repoUrl: 'https://github.com/[username]/[repo-name]',
      image: '/images/p2.webp',
    },
    {
      id: 'project-3',
      title: 'Artistic Style MediaPlayer',
      description: 'University Project for java. A simple media player having artistic style.',
      tags: ['Java', 'JavaFX', 'UI/UX'],
      repoUrl: 'https://github.com/[username]/[repo-name]',
      image: '/images/p3.webp',
    },
    {
      id: 'project-4',
      title: 'FieldSync: A Field Data Collection App',
      description: 'A mobile application for collecting and managing field data offline, with synchronization capabilities when an internet connection is available. It is designed for use in remote areas where connectivity may be limited.',
      tags: ['React Native', 'Firebase', 'Mapbox'],
      repoUrl: 'https://github.com/[username]/[repo-name]',
      image: '/images/p4.jpg',
    },
  ],

  personal: {
    label: 'Personal',
    heading: 'Beyond the Code',
    intro: 'An exploration of the quiet moments, the high peaks, and the stories told between the lines of a terminal window.',
    interests: {
      label: 'Off the clock',
      heading: 'Interests',
    },
    sections: {
      games: { label: 'Play', heading: 'Games' },
      animation: { label: 'Watch', heading: 'Animation' },
      moviesTv: { label: 'Screen', heading: 'Movies and TV Series' },
    },
    columns: {
      favorites: 'FAVORITES',
      planToPlay: 'PLAN TO PLAY',
      planToWatch: 'PLAN TO WATCH',
    },
    games: [
      { id: 'game-1', title: 'Dark Souls Trilogy', genre: 'Soulsborne', note: 'Loved the Challenge', image: '/media/games/G1.jpeg' },
      { id: 'game-2', title: 'Sekiro', genre: 'Action-Adventure', note: 'The combat is intense and rewarding', image: '/media/games/G2.jpg' },
      { id: 'game-3', title: 'Hollow Knight and Silksong', genre: 'Metroidvania', note: 'The atmosphere is captivating', image: '/media/games/G3.jpg' },
      { id: 'game-4', title: 'Witcher 3 Wild Hunt', genre: 'RPG', note: 'The story is engaging and well-developed', image: '/media/games/G4.jpg' },
    ],
    animation: [
      { id: 'anim-1', title: 'Naruto', genre: 'Shounen', note: 'Compeling Story', image: '/media/animation/A1.jpg' },
      { id: 'anim-2', title: 'Arcane', genre: 'Animation', note: 'Stunning Animation and Story', image: '/media/animation/A2.jpg' },
      { id: 'anim-3', title: 'Coyboy Bebop', genre: 'Space Opera', note: 'Classic Animation', image: '/media/animation/A3.png' },
      { id: 'anim-4', title: 'Howls Moving Castle', genre: 'Fantasy', note: 'Beautiful and Heart Warming', image: '/media/animation/A4.png' },
    ],
    moviesTv: [
      { id: 'mtv-1', title: 'The Mentalist', genre: 'Crime Drama', note: 'Great Mystery Crime Drama', image: '/media/movies-tv/M1.jpg' },
      { id: 'mtv-2', title: 'Lord of the Rings Trilogy', genre: 'Fantasy', note: 'Epic Adventure', image: '/media/movies-tv/M2.jpg' },
      { id: 'mtv-3', title: 'Dark', genre: 'Crime Thriller', note: 'Intense and Thought-Provoking', image: '/media/movies-tv/M3.jpg' },
      { id: 'mtv-4', title: 'Harry Potter', genre: 'Fantasy', note: 'Magical and Entertaining', image: '/media/movies-tv/M4.jpg' },
    ],
    planToPlay: [
      { id: 'plan-play-1', title: 'Outer Wilds', note: 'Complex Story'},
      { id: 'plan-play-2', title: 'Phantom Blade Zero', note: 'Amazing Action'},
      { id: 'plan-play-3', title: 'Bloodborne', note: 'Unique World'},
      { id: 'plan-play-4', title: 'Katana Zero', note: 'Intense and Challenging'},
      { id: 'plan-play-5', title: 'Resident Evil', note: 'Horror and Survival'},
      { id: 'plan-play-6', title: 'Blue Prince', note: 'Action and Adventure' },
    ],
    planToWatchAnimation: [
      { id: 'plan-anim-1', title: 'Samurai Champloo', note: 'Unique Style and Story' },
      { id: 'plan-anim-2', title: 'Cyberpunk Edgerunners Season 2', note: 'Futuristic and Gritty'},
      { id: 'plan-anim-3', title: 'Wildwood', note: 'Laika Studio best work' },
      { id: 'plan-anim-4', title: 'The Iron Giant', note: 'Classic' },
      { id: 'plan-anim-5', title: 'Legend of Vox Machina', note: 'Interesting' },
    ],
    planToWatchMoviesTv: [
      { id: 'plan-mtv-1', title: 'The Mandalorian', note: 'Great Star Wars Content'},
      { id: 'plan-mtv-2', title: 'Godzilla minus one', note: 'Unique take on the classic monster' },
      { id: 'plan-mtv-3', title: 'House', note: 'Medical Drama' },
      { id: 'plan-mtv-4', title: 'The Office', note: 'Comedy' },
      { id: 'plan-mtv-5', title: 'Better Call Saul', note: 'Character Development' },
      { id: 'plan-mtv-6', title: 'The Host', note: 'Sci-Fi Thriller' },
    ],
    others: {
      copy: {
        label: 'OTHERS',
        heading: 'More About Me',
      },
      sections: {
        photography: { label: 'Capture', heading: 'Photography' },
        languages: { label: 'Speak', heading: 'Languages' },
        books: { label: 'Read', heading: 'Books' },
      },
      levelLabels: {
        native: 'Native',
        fluent: 'Fluent',
        learning: 'Learning',
      },
      statusLabels: {
        reading: 'Reading',
        finished: 'Finished',
        'want-to-read': 'Want to Read',
      },
      // Add your images to public/photography/ using these file names, or edit the paths.
      photography: [
        { id: 'photo-1', title: 'Kashmir Point', caption: '', src: '/photography/photo-1.jpeg', alt: '' },
        { id: 'photo-2', title: 'Forest and Hills', caption: '', src: '/photography/photo-2.jpeg', alt: '' },
        { id: 'photo-3', title: 'Pipeline Track', caption: '', src: '/photography/photo-3.jpeg', alt: '' },
        { id: 'photo-4', title: 'Beautiful Hills', caption: '', src: '/photography/photo-4.jpeg', alt: '' },
        { id: 'photo-5', title: 'Murre Road', caption: '', src: '/photography/photo-5.jpeg', alt: '' },
        { id: 'photo-6', title: 'Clouds', caption: '', src: '/photography/photo-6.jpeg', alt: '' },
        { id: 'photo-7', title: 'Church in Fog', caption: '', src: '/photography/photo-7.jpeg', alt: '' },
        { id: 'photo-8', title: 'Small Waterfall', caption: '', src: '/photography/photo-8.jpg', alt: '' },
        { id: 'photo-9', title: 'View from a Resturant', caption: '', src: '/photography/photo-9.jpg', alt: '' },
      ],
      // proficiency is a placeholder number from 0 to 100.
      languages: [
        { id: 'lang-1', name: 'Pashto', level: 'native', proficiency: 100 },
        { id: 'lang-2', name: 'Urdu', level: 'native', proficiency: 100 },
        { id: 'lang-3', name: 'English', level: 'fluent', proficiency: 90 },
        { id: 'lang-4', name: 'Russian', level: 'learning', proficiency: 30 },
      ],
      books: [
        { id: 'book-1', title: 'Atomic Habits', author: 'James Clear', status: 'finished' },
        { id: 'book-2', title: 'How Nations Fall', author: 'Niall Ferguson', status: 'reading' },
        { id: 'book-3', title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey', status: 'want-to-read' },
        { id: 'book-4', title: 'The Art of War', author: 'Sun Tzu', status: 'reading' },
        { id: 'book-5', title: 'Deep Work', author: 'Cal Newport', status: 'want-to-read' },
      ],
      
    },
    currently: [
      { id: 'now-1', kind: 'playing', title: '[Game Title]', progressLabel: '[Level 00]', progress: 40 },
      { id: 'now-2', kind: 'watching', title: '[Show or Anime Title]', progressLabel: '[S0 E0]', progress: 60 },
      { id: 'now-3', kind: 'reading', title: '[Book Title]', progressLabel: '[Chapter 00]', progress: 25 },
    ],
    stats: [
      { id: 'stat-1', label: 'Games played', value: '[00]' },
      { id: 'stat-2', label: 'Anime watched', value: '[00]' },
      { id: 'stat-3', label: 'Books read', value: '[00]' },
    ],
    quote: {
      text: 'A fool who knows he is a fool is wiser than a fool who thinks himself wise.',
      author: 'Some Author',
    },
  },

  contact: {
    currentPosition: ' CS Student at UET Peshawar',
    directLines: [
      {
        id: 'line-email',
        label: 'Email',
        value: 'muhammadhamza6191619@gmail.com',
        href: 'mailto:muhammadhamza6191619@gmail.com',
      },
      {
        id: 'line-phone',
        label: 'Phone',
        value: '0333-9818689',
        href: 'tel:0333-9818689',
      },
      {
        id: 'line-chat',
        label: 'WhatsApp',
        value: '0333-9818689',
        href: 'https://wa.me/0333-9818689',
      },
    ],
    from: 'Peshawar, Pakistan',
    languages: ['English', 'Urdu', 'Pushto'],
    availableForHire: true,
    formIntro: "I'm currently accepting new projects and collaborations. Drop a line and let's build something exceptional.",
    copyLabel: 'Copy',
    copiedLabel: 'Copied to clipboard',
    unavailableLabel: 'Not currently available',
    availabilityNote: 'Open to AI/ML engineering roles and full-stack development projects.',
    form: {
      placeholders: {
        name: 'Your name',
        email: 'you@example.com',
        message: 'Tell me about your project or question',
      },
      submit: 'Send message',
      submitting: 'Sending your message',
      minMessageLength: 10,
      errors: {
        nameRequired: 'Please enter your name.',
        emailRequired: 'Please enter your email address.',
        emailInvalid: 'Please enter a valid email address.',
        messageRequired: 'Please write a message.',
        messageTooShort: 'Your message needs at least {min} characters.',
      },
      success: {
        title: 'Message sent',
        body: 'Thank you for getting in touch. I will get back to you as soon as possible.',
        reset: 'Send another message',
      },
    },
  },

  sections: {
    education: {
      label: 'Background',
      heading: 'Education',
    },
    experience: {
      label: 'Career',
      heading: 'My Experience',
    },
    skills: {
      label: 'Toolkit',
      heading: 'Core Skills',
    },
    certifications: {
      label: 'Credentials',
      heading: 'Certifications',
    },
    projects: {
      label: 'Selected work',
      heading: 'Featured Projects',
    },
  },

  ui: {
    skipToContent: 'Skip to content',
    github: 'GitHub',
    liveSite: 'Live',
    viewCredential: 'View credential',
    footerNote: 'All rights reserved.',
  },
};
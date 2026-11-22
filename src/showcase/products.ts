/**
 * Every product on the home showcase, in the order they're presented.
 * Each one links to its full case study. Screens fall back to a branded card until the file exists,
 * so a product can be listed before its recordings are added (Ariane Studio, today).
 */
export interface ShowcaseProduct {
  id: string;
  name: string;
  route: string;
  /** Accent colour for the stage glow, chips and numbers. */
  accent: string;
  /** A deeper shade of the accent for the stage gradient. */
  accentDeep: string;
  category: string;
  status: { label: string; tone: 'live' | 'soon' | 'building' };
  /** Where the status pill links (a store, TestFlight or the live site). */
  statusHref?: string;
  line: string;
  summary: string;
  stack: string[];
  /** Three numbers or facts a reviewer reads first. */
  specs: { value: string; label: string }[];
  /**
   * The line-up's three phones, centre first: the app's screenshots (or `scene`, a live screen ported
   * from the app itself, run on the 3D phone).
   */
  screens: { image: string; video?: string; scene?: 'ariane-welcome'; barCleaned?: boolean }[];
  /** What the hero's phone plays for this product: a looping clip, or the live scene. */
  hero: { image: string; video?: string; scene?: 'ariane-welcome'; barCleaned?: boolean };
  /** One letter for the placeholder screen. */
  monogram: string;
}

export const PRODUCTS: ShowcaseProduct[] = [
  {
    id: 'arianestudio',
    name: 'Ariane Studio',
    route: '/arianestudio',
    accent: '#e9c98f',
    accentDeep: '#3b2a17',
    category: '3D + AR · Fine porcelain',
    status: { label: 'iOS beta on TestFlight', tone: 'live' },
    statusHref: 'https://testflight.apple.com/join/JGRKuyUa',
    line: 'The client’s porcelain in 3D — customised with your designs, logos or artwork, then placed on your real table in AR.',
    summary: 'Products shown in a real-time 3D dining room, plate customisation with designs, logos and artwork, AI food visuals and true-to-size AR, built in Expo React Native.',
    stack: ['React Native', 'Expo', 'three.js', 'AR', 'Kotlin + Swift'],
    specs: [
      { value: 'Solo', label: 'developed for a client' },
      { value: '< 2 mo', label: 'from requirements to app' },
      { value: '3 cm', label: 'AR lock-on precision' }
    ],
    screens: [
      // The app's real Welcome: its 3D photo, dust and logo, tilting with the phone.
      // The still is rendered from the same scene, for the CSS phones and browsers without WebGL.
      { image: '/Mockups/ariane-welcome.webp', scene: 'ariane-welcome' },
      // Screens from the app's App Store mockups (store-assets/play-mockups), cropped to the glass.
      { image: '/Mockups/ariane-room.webp', barCleaned: true },
      { image: '/Mockups/ariane-ar.webp', barCleaned: true }
    ],
    hero: { image: '/Mockups/ariane-welcome.webp', scene: 'ariane-welcome' },
    monogram: 'A'
  },
  {
    id: 'crave',
    name: 'CRAVE',
    route: '/crave',
    // The app's own blue (#0a35d8), lifted to read on the page.
    accent: '#7f9bff',
    accentDeep: '#0c1a52',
    category: 'AI sales automation · AI agents, backend & mobile',
    status: { label: 'Live · crave.webshark.tech', tone: 'live' },
    statusHref: 'https://crave.webshark.tech/',
    line: 'An AI sales employee on calls, WhatsApp and web chat — it answers every lead, researches their company, rates them and books the meeting.',
    summary: 'Core engineer: every AI agent flow, the NestJS backend, and the mobile app whose Kotlin caller ID hands a business call to a Sarvam voice AI agent, while OpenAI qualifies the lead.',
    stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Expo React Native', 'Kotlin', 'Pipecat'],
    specs: [
      { value: 'All', label: 'AI agent flows, built by me' },
      { value: '~0.4 s', label: 'typical AI voice reply' },
      { value: '1 tap', label: 'ringing call → AI agent' }
    ],
    // From the app's Play Store screenshots, cropped to the glass.
    screens: [
      { image: '/Mockups/crave-caller-id.webp', barCleaned: true },
      { image: '/Mockups/crave-leads.webp', barCleaned: true },
      { image: '/Mockups/crave-call.webp', barCleaned: true }
    ],
    hero: { image: '/Mockups/crave-caller-id.webp', barCleaned: true },
    monogram: 'C'
  },
  {
    id: 'postcard',
    name: 'Postcard®',
    route: '/postcard',
    // The app's own theme: its teal (#10a3aa, lifted to read on the page) over a deep violet.
    accent: '#3cc8cf',
    accentDeep: '#26114d',
    category: 'Social discovery',
    status: { label: 'Live on Google Play', tone: 'live' },
    line: 'Helping people discover hidden gems through community.',
    summary: 'Explore cafés, viewpoints and places maps miss — shared by real people, not generic ratings.',
    stack: ['React Native', 'Firebase', 'Maps', 'Auth', 'Product design'],
    specs: [
      { value: 'Live', label: 'shipped on Google Play' },
      { value: 'Founder', label: 'designed and built it' },
      { value: '6', label: 'core product flows' }
    ],
    screens: [
      { image: '/Mockups/postcard-welcome.png' },
      { image: '/Mockups/postcard-discover.png' },
      { image: '/Mockups/postcard-share.png' }
    ],
    // Scrolling the feed, then Navigate into Google Maps; recorded on the phone, its status bar
    // cleaned out of the file, trimmed and cross-faded into a seamless loop.
    hero: { image: '/videos/posters/postcard-feed-map.jpg', video: '/videos/postcard-feed-map.mp4', barCleaned: true },
    monogram: 'P'
  },
  {
    id: 'tender9',
    name: 'Tender9',
    route: '/tender9',
    // The app's own indigo (#4C39DD), lifted to read on the page.
    accent: '#a196ff',
    accentDeep: '#1f1763',
    category: 'Procurement intelligence',
    status: { label: 'Coming soon on Google Play & iOS', tone: 'soon' },
    line: 'From a government tender notice to a decision, on the phone in your hand.',
    summary: 'Tender discovery, AI document briefs, competitor analytics and push alerts for suppliers to government.',
    stack: ['Expo React Native', 'TypeScript', 'Laravel', 'Google Vision OCR', 'Razorpay'],
    specs: [
      { value: 'Solo', label: 'developed for a client' },
      { value: 'AI', label: 'tender documents to briefs' },
      { value: 'Author', label: 'of the published whitepaper' }
    ],
    // Captured from the app's own build; the status bar area is left clear for the phone's clean one.
    screens: [
      { image: '/Mockups/tender9-welcome.png', barCleaned: true },
      { image: '/Mockups/tender9-home.png', barCleaned: true },
      { image: '/Mockups/tender9-brief.png', barCleaned: true }
    ],
    hero: { image: '/Mockups/tender9-welcome.png', barCleaned: true },
    monogram: 'T'
  },
  {
    id: 'washadmin',
    name: 'WashDesk',
    route: '/washadmin',
    accent: '#8cc8ff',
    accentDeep: '#0f2440',
    category: 'Operations platform',
    status: { label: 'Customer app + admin', tone: 'building' },
    line: 'Bookings, subscriptions and wash bays — run in real time from one platform.',
    summary: 'A customer mobile app paired with a live admin dashboard for running a car-wash business.',
    stack: ['Expo React Native', 'TypeScript', 'Appwrite', 'PostgreSQL', 'Razorpay'],
    specs: [
      { value: '2 apps', label: 'customer mobile + admin' },
      { value: 'Live', label: 'real-time bays & bookings' },
      { value: 'Auto', label: 'subscriptions & billing' }
    ],
    screens: [
      { image: '/Mockups/washadmin-mobile-home.png' },
      { image: '/Mockups/washadmin-mobile-plans.png' },
      { image: '/Mockups/washadmin-mobile-history.png' }
    ],
    // QR check-in to a finished wash (bay-management-mobile, first 20.5s at 1.6×, looped).
    hero: { image: '/videos/posters/washdesk-bay-loop.jpg', video: '/videos/washdesk-bay-loop.mp4', barCleaned: true },
    monogram: 'W'
  },
  {
    id: 'cliniko',
    name: 'Cliniko',
    route: '/cliniko',
    accent: '#86efd0',
    accentDeep: '#0d302a',
    category: 'AI healthcare SaaS',
    status: { label: 'Patient, staff & admin', tone: 'building' },
    line: 'Patient care, live queues and AI prescription digitisation in one clinical ecosystem.',
    summary: 'A patient app, a staff app and an admin dashboard that keep a clinic moving with zero lag.',
    stack: ['React', 'Appwrite', 'Gemini API', 'Razorpay', 'Node.js'],
    specs: [
      { value: '3 apps', label: 'patient, staff, admin' },
      { value: 'AI', label: 'prescriptions digitised' },
      { value: 'Live', label: 'real-time patient queue' }
    ],
    screens: [
      { image: '/Mockups/clinko-mobile-booking.png' },
      { image: '/Mockups/clinko-mobile-queue.png' },
      { image: '/Mockups/clinko-mobile-reminders.png' }
    ],
    // Booking, payment and check-in to a cabin (clinko-queue-mobile, first 52s at 1.5×, looped).
    hero: { image: '/videos/posters/cliniko-queue-loop.jpg', video: '/videos/cliniko-queue-loop.mp4', barCleaned: true },
    monogram: 'C'
  }
];

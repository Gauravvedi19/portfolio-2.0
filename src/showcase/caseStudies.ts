/**
 * The case studies' content, one entry per product (keyed by the product's id in products.ts, which
 * supplies the name, colours, line, stack and specs). Gathered from the original case-study pages; the
 * template in components/case renders every one of them the same way.
 *
 * Media: a flow plays `mobile` on the 3D phone and `desktop` in a browser window beside it. A file that
 * hasn't been added yet shows a "coming soon" card in its place, so flows can be listed before their
 * recordings exist (Ariane Studio's, today: drop them into public/videos under these names).
 */

export interface Media {
  video?: string;
  image?: string;
  /** A live screen ported from the app itself (Ariane's Welcome). */
  scene?: 'ariane-welcome';
  /** The recording's status bar was already cleaned out of the file. */
  barCleaned?: boolean;
  /** The recording's status bar was cropped off, so the app starts at the very top: it's moved down beneath a clean one. */
  barInset?: boolean;
}

export interface Flow {
  tag: string;
  title: string;
  /** One line under the title. */
  summary: string;
  desc: string;
  steps: string[];
  highlights: string[];
  /** Why it matters. */
  why?: string;
  mobile?: Media;
  desktop?: Media;
}

export interface CaseStudy {
  id: string;
  /** e.g. "Client · Ariane Fine Porcelain". */
  eyebrow: string;
  pitch: string;
  intro: string;
  /** A single standout line under the intro. */
  hook?: string;
  facts: { label: string; value: string }[];
  links?: { label: string; href: string }[];
  /** The hero's own screen on the 3D phone. */
  heroScreen: Media;
  flows: Flow[];
  workflow: { title: string; sub: string; steps: { name: string; desc?: string }[] };
  architecture?: { layers: { name: string; note?: string; accent?: boolean }[] };
  /** Engineering challenges; `how` adds a "How I solved it" reveal. */
  engineering?: { title: string; sub?: string; howLabel?: string; items: { title: string; plain: string; how?: string; badge?: string }[] };
  /** A published paper behind the project: read in the browser or download. */
  whitepaper?: { title: string; subtitle: string; series: string; href: string; note: string; facts: { value: string; label: string }[] };
  /** The hardest problem, told as problem → what I did → result. */
  story?: { eyebrow: string; title: string; body: string; steps: { title: string; text: string }[]; result: string };
  portal?: { title: string; sub: string; cards: { title: string; desc: string; chips: string[]; image: string; wide?: boolean }[] };
  /** Store screenshots (tall mockups), in a row; any one opens full screen. */
  gallery?: { eyebrow: string; title: string; sub: string; images: { src: string; alt: string }[] };
  closing: string;
}

const TESTFLIGHT = 'https://testflight.apple.com/join/JGRKuyUa';
const WHITEPAPER = '/whitepapers/webshark-decision-intelligence-whitepaper-2026.pdf';

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'arianestudio',
    eyebrow: 'Client · Ariane Fine Porcelain · Solo developed',
    pitch: 'See the client’s porcelain in 3D, make it your own, and place it on your real table in AR.',
    intro:
      'A mobile app that shows Ariane Fine Porcelain’s products in a real-time 3D dining room. Restaurants and hotels customise the pieces with their own designs, logos or artwork on the plates, see them set on a table in 3D, place them on a real table with AR, and send an enquiry in one tap.',
    hook: 'Real-time 3D and AR usually need a game engine. I built both in React Native — solo, in under 2 months.',
    facts: [
      { label: 'Role', value: 'Solo developer, for a client' },
      { label: 'Timeline', value: 'Under 2 months' },
      { label: 'Platform', value: 'iOS & Android · Expo' },
      { label: 'Status', value: 'iOS beta on TestFlight' }
    ],
    links: [{ label: 'Try the iOS beta on TestFlight', href: TESTFLIGHT }],
    heroScreen: { scene: 'ariane-welcome', image: '/Mockups/ariane-welcome.webp' },
    flows: [
      {
        tag: 'Onboarding',
        title: 'Welcome & Sign Up',
        summary: 'A first impression that feels like the product.',
        desc: 'A living photo of a fine-dining room that moves as you tilt the phone, then a quick sign-up that asks who you are and what you’re opening.',
        steps: ['Welcome', 'Sign up', 'About you', 'Establishment'],
        highlights: ['Tilt-reactive 3D welcome', 'Smooth, animated forms', 'Role-based onboarding'],
        mobile: { scene: 'ariane-welcome', image: '/Mockups/ariane-welcome.webp' }
      },
      {
        tag: 'Setup',
        title: 'Concept & Table',
        summary: 'Fine dining to café & bistro — then the table shape and seats.',
        desc: 'Choose the kind of restaurant, shown as full-screen photos with real depth, then a round, rectangle or square table and the number of seats. Your choices build the 3D room you design in.',
        steps: ['Pick concept', 'Pick shape', 'Pick seats', 'Generate room'],
        highlights: ['Depth photos made with AI', '10 restaurant concepts', '2 to 12+ seats'],
        mobile: { image: '/Mockups/ariane-concept.webp', barCleaned: true }
      },
      {
        tag: 'Core experience',
        title: 'The 3D Dining Room',
        summary: 'Set the table, walk around it, sit down.',
        desc: 'A real-time 3D restaurant around your table. Add a piece and it appears at every seat in the right place; move, rotate or stack it. Then walk the room, sit at any seat to see it as a guest would, and switch between day and night.',
        steps: ['Set the table', 'Walk', 'Sit at a seat', 'Day / night'],
        highlights: ['Smart auto-placement', 'Guest’s-eye view', 'Day & night lighting'],
        mobile: { image: '/Mockups/ariane-room.webp', barCleaned: true }
      },
      {
        tag: 'Catalogue',
        title: 'Catalogue & Wishlist',
        summary: 'Shop the range without leaving your table.',
        desc: 'Plates, bowls, cups, cutlery and barware slide up over the room. Spin any product in 3D and save favourites to a wishlist.',
        steps: ['Open catalogue', 'View in 3D', 'Add to wishlist'],
        highlights: ['3D product viewer', 'Persistent wishlist', 'Opens instantly'],
        mobile: { image: '/Mockups/ariane-collection.webp', barCleaned: true }
      },
      {
        tag: 'Customisation',
        title: 'Customise the Plate',
        summary: 'Your patterns, logo and artwork on the real product.',
        desc: 'Add rim patterns, your logo or your own artwork to a real 3D-scanned plate, then save the design — it appears on the table, in AR and in the enquiry.',
        steps: ['Customise', 'Pattern / logo / image', 'Position', 'Save'],
        highlights: ['Brand logo on plates', 'Rim line patterns', 'Same design everywhere'],
        mobile: { image: '/Mockups/ariane-customise.webp', barCleaned: true }
      },
      {
        tag: 'AI',
        title: 'Food Visualisation',
        summary: 'See the menu on the plates.',
        desc: 'Serve dishes onto the plates — choose from ready-made dishes or describe one and let AI create it — to see how the food looks on the tableware.',
        steps: ['Pick plates', 'Choose or describe a dish', 'Serve'],
        highlights: ['AI-generated dishes', 'Sized to each plate', 'Realistic shadows'],
        mobile: { image: '/Mockups/ariane-food.webp', barCleaned: true }
      },
      {
        tag: 'Augmented reality',
        title: 'See Your Table Setting in AR',
        summary: 'The complete setting, at real size, on your own table.',
        desc: 'Point your phone at a real table — the app finds it by itself — and the whole table setting you designed appears on it at true size. Walk around it, move pieces and rotate them.',
        steps: ['View in AR', 'Point at your table', 'Table setting appears', 'Walk around & adjust'],
        highlights: ['Complete table setting in AR', 'True-to-size', 'No setup — just point'],
        mobile: { image: '/Mockups/ariane-ar.webp', barCleaned: true }
      },
      {
        tag: 'Conversion',
        title: 'Preview & Enquiry',
        summary: 'From a designed table to a quote request.',
        desc: 'Review every product with pictures of your table, choose quantities, then export a PDF or send the enquiry — and track its status from your account.',
        steps: ['Preview', 'Choose products', 'Export PDF', 'Send enquiry', 'Track'],
        highlights: ['Auto-generated PDF', 'Pictures of your table', 'Enquiry tracking'],
        mobile: { image: '/Mockups/ariane-enquiry.webp', barCleaned: true }
      }
    ],
    workflow: {
      title: 'The journey',
      sub: 'From the first screen to a quote request.',
      steps: [
        { name: 'Concept' }, { name: 'Table' }, { name: '3D room' }, { name: 'Catalogue' }, { name: 'Customise' },
        { name: 'Set the table' }, { name: 'Food' }, { name: 'View in AR' }, { name: 'Enquire' }
      ]
    },
    architecture: {
      layers: [
        { name: 'Expo React Native app', note: 'Animations and gestures on the native UI thread' },
        { name: 'three.js renderer', note: 'A frame pump synced to the display', accent: true },
        { name: 'Native modules · Kotlin & Swift', note: 'Device tiers, frame-rate and thermal watch' },
        { name: 'AR surface detection', note: 'Locks only when 6 readings agree within 3cm' },
        { name: 'Model pipeline', note: 'Scene parts merged 378 → 15' }
      ]
    },
    story: {
      eyebrow: 'The hardest problem',
      title: 'Keeping a 3D app fluid on a single JavaScript thread',
      body:
        'In Expo React Native, the interface, the app logic and the entire 3D renderer share one JavaScript thread. Anything heavy on it freezes the room and makes touches feel late. On a real phone, JavaScript was sending 73 frames a second while the screen could only show 35–51 — the backlog turned into lag and jitter.',
      steps: [
        { title: 'Animations off the JS thread', text: 'Every animation, gesture and glass effect runs on the native UI thread, so React’s work can never freeze them.' },
        { title: 'A frame pump synced to the screen', text: 'I replaced the 3D render loop with one driven by the display itself. It draws only when something changes and never sends frames faster than the GPU can show them.' },
        { title: 'Heavy work waits for the motion', text: 'Big updates land after a transition finishes, pages are built before they’re needed, and 3D models load through native file reads instead of JavaScript.' }
      ],
      result: 'A full 3D restaurant that runs smoothly on a mid-range phone — inside Expo Go, with no custom native code.'
    },
    engineering: {
      title: 'What made it work',
      sub: 'Open any card to see how I solved it.',
      items: [
        {
          badge: 'My own research',
          title: 'AR surface detection I built myself',
          plain: 'Point the phone at a table and it locks on in seconds — the most accurate surface detection I’ve worked with.',
          how: 'Stock plane detection drifted and misjudged height, so I replaced it. The app samples the surface continuously, waits out the sensor’s settling period, and locks only when 6 readings agree within 3cm. After that, placement is pure geometry against the locked plane, with drag input smoothed by an adaptive filter — so pieces never float, sink or slide.'
        },
        {
          title: 'Adapts to every phone',
          plain: 'The app senses what the phone can handle and lowers quality automatically before it lags or overheats.',
          how: 'A native module in Kotlin and Swift sorts the device into 3 performance tiers, then watches frame rate and temperature live. A sustained drop below 55fps, or thermal throttling, steps quality down — and it never steps back up mid-session.'
        },
        {
          title: 'Studio-quality models that load fast',
          plain: 'Detailed product models load quickly and look right on a phone.',
          how: 'An automated pipeline resizes textures to a safe size, rebuilds broken shading, and merges hundreds of scene parts into a few (378 → 15) without losing any geometry.'
        },
        {
          title: 'One design, everywhere',
          plain: 'A customised plate looks identical in the 3D room, in AR and in the enquiry PDF.',
          how: 'The design is exported as a real 3D file on the phone itself. That meant writing my own image encoder, because React Native has no browser canvas to encode textures with.'
        },
        {
          title: 'A premium feel over live 3D',
          plain: 'Every transition stays smooth while the 3D room runs underneath it.',
          how: 'Graphics surfaces are built before they’re shown and only redraw when they change. Each multi-part animation runs on one shared clock, so nothing pops, flickers or jumps.'
        },
        {
          title: 'Fast feedback from the client',
          plain: 'The client tested every new build on their own phone in seconds.',
          how: 'Everything except AR runs inside Expo Go with no custom native code. AR loads only in the full build.'
        }
      ]
    },
    gallery: {
      eyebrow: 'On the App Store',
      title: 'The store screenshots',
      sub: 'Eight screens from the App Store listing, from the first welcome to the enquiry. The iOS beta is open on TestFlight.',
      images: [
        { src: '/Mockups/store/ariane-01.webp', alt: 'Your table, before it’s laid: the welcome screen' },
        { src: '/Mockups/store/ariane-02.webp', alt: 'Start with your concept: room, table shape and seats' },
        { src: '/Mockups/store/ariane-03.webp', alt: 'Discover the collection: plates, bowls, platters and cups' },
        { src: '/Mockups/store/ariane-04.webp', alt: 'Make every plate yours: rim colours, logo or artwork' },
        { src: '/Mockups/store/ariane-05.webp', alt: 'See the dish on the plate: AI food visualisation' },
        { src: '/Mockups/store/ariane-06.webp', alt: 'Walk your table in 3D: a true-to-scale dining room' },
        { src: '/Mockups/store/ariane-07.webp', alt: 'See it on your table: the setting in AR' },
        { src: '/Mockups/store/ariane-08.webp', alt: 'Enquire in a single tap: quantities by the case' }
      ]
    },
    closing: 'A full 3D restaurant, and the client’s table on your own — built solo, in React Native, in under two months.'
  },

  {
    id: 'crave',
    eyebrow: 'Webshark · AI sales automation · Core engineer',
    pitch: 'An AI sales employee that answers every lead in seconds — on WhatsApp, on the phone and on the website.',
    intro:
      'CRAVE is an AI sales employee for businesses. Its AI agents answer every new lead in seconds on phone calls, WhatsApp and website chat, learn the business from its own website and documents, qualify and rate each lead, book meetings and follow up. Around them: a built-in CRM (leads, pipeline, meetings, tasks), lead-flow automations, custom lead forms, and an AI e-commerce agent for Shopify stores that tracks orders and recovers abandoned carts. I was a core engineer: I built every AI agent flow, the NestJS backend behind them, and the mobile app end to end.',
    hook: 'A missed business call becomes a qualified lead: the app detects the caller, CRAVE calls them back through a Sarvam voice AI agent, and OpenAI reads the conversation, researches their company on the web, rates the lead and books the meeting with the owner.',
    facts: [
      { label: 'Role', value: 'Core engineer · AI agents, backend & mobile' },
      { label: 'Status', value: 'Live at crave.webshark.tech' },
      { label: 'Stack', value: 'Next.js · NestJS · PostgreSQL · Expo · Kotlin' },
      { label: 'AI agents', value: 'Call agent, chatbot & WhatsApp: built by me' }
    ],
    links: [{ label: 'Visit crave.webshark.tech', href: 'https://crave.webshark.tech/' }],
    heroScreen: { image: '/Mockups/crave-caller-id.webp', barCleaned: true },
    flows: [
      {
        tag: 'Native Android',
        title: 'Caller ID & AI Call-Back',
        summary: 'A ringing business call, handed to a voice AI agent in one tap.',
        desc: 'The app detects every call to the business number and shows a CRAVE card over the phone’s own call screen, with the caller’s name, company and lead rating. “Transfer to AI agent” sends a request to the CRAVE backend, which calls the person back by passing their number to a Sarvam voice AI agent. The agent talks to them; then OpenAI reads the transcript, qualifies the lead with a web search on their company, and books a meeting with the owner.',
        steps: ['Call detected', 'Caller card', 'Transfer to AI', 'Sarvam agent calls back', 'OpenAI qualifies', 'Meeting booked'],
        highlights: ['Card drawn over the call screen', 'Works with the app closed', 'Business SIM only on dual-SIM phones'],
        why: 'Calls are where small businesses lose leads. The owner can’t answer every one, and now every caller gets a conversation, a rating and, if they are a good fit, a meeting.',
        mobile: { image: '/Mockups/crave-caller-id.webp', barCleaned: true }
      },
      {
        tag: 'CRM on mobile',
        title: 'Every Lead, in Your Pocket',
        summary: 'The lead sheet, replaced.',
        desc: 'Every lead from WhatsApp, calls, website chat and forms in one list, with its source, company and AI rating. Search, filters, sorting and pull to refresh, with new leads added from the phone.',
        steps: ['All leads', 'Search & filter', 'Open a lead', 'New lead'],
        highlights: ['AI lead rating', 'Source on every lead', 'Delete with undo'],
        mobile: { image: '/Mockups/crave-leads.webp', barCleaned: true }
      },
      {
        tag: 'Lead',
        title: 'One Tap to Act',
        summary: 'Call, WhatsApp, email, book or instruct the AI.',
        desc: 'A lead opens on its contact details and the AI’s requirement summary, with one-tap Call, WhatsApp, Email, Meeting and Instruct. Its activity and email threads are a swipe away, and “Stop AI call-back” keeps the AI off a number.',
        steps: ['Overview', 'Act', 'Activity', 'Emails'],
        highlights: ['Requirement summary by AI', 'Status and qualification', 'Per-number AI call-back switch'],
        mobile: { image: '/Mockups/crave-lead.webp', barCleaned: true }
      },
      {
        tag: 'Voice AI',
        title: 'AI Call Logs',
        summary: 'What the AI did with every call.',
        desc: 'Every AI call and call-back with who rang, how long it lasted and what they need, grouped by date. It refreshes itself while a call is still running.',
        steps: ['Call logs', 'Filter by time', 'Open a call'],
        highlights: ['Live while a call runs', 'Need in one line', 'Rating next to every caller'],
        mobile: { image: '/Mockups/crave-calls.webp', barCleaned: true }
      },
      {
        tag: 'Voice AI',
        title: 'The Call, Summarised',
        summary: 'Summary, key points, next steps and the recording.',
        desc: 'Each call opens on what the AI learned: a summary, intent and sentiment, key points and next steps, then the recording with playback and sharing. Dial, start another AI call, or instruct the agent from the same screen.',
        steps: ['Summary', 'Key points', 'Next steps', 'Recording'],
        highlights: ['Written by the AI after every call', 'Recording playback & export', 'Every call with this number'],
        mobile: { image: '/Mockups/crave-call.webp', barCleaned: true }
      },
      {
        tag: 'Scheduling',
        title: 'Meetings',
        summary: 'What the AI booked, by day.',
        desc: 'Meetings the AI booked on calls and chats, on a calendar and by day, with one-tap Join for video meetings and a reminder for any meeting still waiting for its outcome.',
        steps: ['Calendar', 'Day view', 'Join', 'Record outcome'],
        highlights: ['Booked by the AI', 'Join from the list', 'Outcome reminders'],
        mobile: { image: '/Mockups/crave-meetings.webp', barCleaned: true }
      }
    ],
    workflow: {
      title: 'From first message to booked meeting',
      sub: 'What CRAVE does with a lead, wherever it comes in.',
      steps: [
        { name: 'Lead arrives', desc: 'A call, WhatsApp, website chat or a form.' },
        { name: 'AI replies', desc: 'In seconds, from the business’s own website and documents.' },
        { name: 'Qualifies', desc: 'Asks the business’s qualifying questions.' },
        { name: 'Researches', desc: 'OpenAI reads the conversation and looks up the lead’s company on the web.' },
        { name: 'Rates', desc: 'Excellent, Good or Poor, with the reason.' },
        { name: 'Books', desc: 'A meeting with the owner when the lead is a fit.' },
        { name: 'Follows up', desc: 'Lead-flow automations, reminders and call-backs.' }
      ]
    },
    story: {
      eyebrow: 'The hardest problem',
      title: 'Making an AI phone call feel like a conversation',
      body: 'A voice agent is a chain: the phone line streams audio, speech becomes text, a language model replies, and the reply becomes speech again. Every link adds delay, and over a second of silence after someone stops talking makes a call feel robotic.',
      steps: [
        { title: 'Our own voice bridge', text: 'Calls stream from Twilio and Vobiz straight into a Pipecat bridge, one endpoint that detects the provider from its first messages. CRAVE decides everything about the call: prompt, voice, tools and hand-over.' },
        { title: 'Measure every turn', text: 'The bridge logs the wait, the model’s time and the voice’s time for every reply, so each model and voice could be compared on real calls instead of guessed.' },
        { title: 'Choose by the numbers', text: 'Moving to a Sarvam conversational model with streaming Sarvam voices, and warming the model up before the call starts, took the typical reply wait from about 1.3 s to about 0.4 s.' }
      ],
      result: 'The AI answers in about 0.4 seconds on real calls, in English and Indian languages, books meetings and hands over to a person when asked.'
    },
    engineering: {
      title: 'The engineering I did',
      sub: 'Web portal, backend, mobile and AI. Open any card to see how it works.',
      items: [
        {
          badge: 'AI agents',
          title: 'Every AI agent flow',
          plain: 'The call agent, the website chatbot and the WhatsApp agent: each replies, qualifies the lead and books the meeting.',
          how: 'All three run on one set of rules in the backend: the business’s prompt and tone, answers from its own knowledge base (website and documents), lead qualification and scoring, meeting booking, order lookups for stores, and a hand-over to a person when the AI is unsure or the plan’s limit is reached. Every conversation ends in the CRM with a summary and next steps.'
        },
        {
          badge: 'AI qualification',
          title: 'Leads qualified from the conversation and the web',
          plain: 'After every call or chat, the AI rates the lead and says why, using what they said and who they work for.',
          how: 'OpenAI reads the transcript against the business’s qualifying questions. When the company check is on, a web search (OpenAI’s web search tool) looks up the lead’s company once per company, sending only the company and its likely country, and its result is part of one ranking: Excellent, Good or Poor. A qualified lead gets a meeting with the owner.'
        },
        {
          badge: 'Backend',
          title: 'A multi-tenant NestJS backend',
          plain: 'One API behind the web portal, the mobile app, the chat widget and the voice agent.',
          how: 'NestJS with PostgreSQL and Prisma, Redis and BullMQ queues for calls and follow-ups, and WebSocket notifications. Every business’s data is kept apart, and the web portal and mobile app share the same endpoints and rules. Deployed on a Linux VPS with Docker and Nginx.'
        },
        {
          title: 'The agent features in the web portal',
          plain: 'Where a business sets up its AI agents and puts them to work.',
          how: 'The AI call agent and chat settings, call campaigns from the Leads page, and the website chat widget a business embeds with one script line, which also looks up Shopify and WooCommerce orders for customers.'
        },
        {
          badge: 'Native Kotlin',
          title: 'A caller ID that works with the app closed',
          plain: 'The app detects every business call, even when CRAVE isn’t open, and one tap has the backend call the person back through a Sarvam voice AI agent.',
          how: 'A local Expo module in Kotlin. A call screening service (CRAVE as the phone’s “Caller ID & spam” app) and a phone-state receiver both feed one call tracker, which drives a card drawn over other apps without taking focus, so the phone’s own call screen keeps working. A call that ends while the phone is locked shows the card over the lock screen. The module talks to the API with the phone’s own device key, not the sign-in session.'
        },
        {
          title: 'Call-backs that are never lost',
          plain: 'If the app is killed or the phone restarts, the AI still calls the person back.',
          how: 'The call-back is a saved WorkManager job: it survives restarts, waits for a connection and retries. The server places one call per event, so a retry can never call someone twice, and a call-back hours late is dropped rather than confusing the caller.'
        },
        {
          title: 'Transfer before the phone rings',
          plain: 'On a forwarding SIM, “Transfer to AI agent” can send the call on before the phone even rings.',
          how: 'Android waits for the call screening answer before ringing. The tracker holds that answer for a moment, so a tap rejects the call and the network’s “forward when busy” rule takes it to the AI number.'
        },
        {
          title: 'Caller ID that checks on itself',
          plain: 'Phone makers can quietly take permissions back. The app notices and tells the owner.',
          how: 'A background job twice a day checks every permission, the overlay, battery settings and that the server still accepts the phone’s key, and notifies the owner once per set of problems.'
        },
        {
          badge: 'Native Kotlin',
          title: 'Talking live to the AI assistant',
          plain: 'Sales reps talk to their AI assistant out loud, interrupt it, and have it act on the CRM.',
          how: 'A second native module streams the microphone as 16 kHz PCM and plays the assistant’s voice as it arrives, in voice-call mode so the echo canceller keeps the assistant’s own voice out of the microphone on speaker. The assistant knows which lead is open, so “call him” means that person, and every action it proposes waits for confirm, with undo.'
        },
        {
          title: 'The AI voice agent pipeline',
          plain: 'Real phone calls answered and placed by AI: on Sarvam’s voice agents, or on our own Pipecat bridge, with each step measured.',
          how: 'Twilio and Vobiz audio streams into a Pipecat bridge (speech to text, the language model, Sarvam voice), which reports every turn, tool call and the end of the call to the NestJS API. There the call is analysed, the lead scored and the follow-ups created.'
        },
        {
          title: 'AI automation behind the CRM',
          plain: 'Leads scored, summarised and followed up without anyone typing.',
          how: 'AI lead scoring, call and chat summaries, lead-flow automations and an agent set up by chat (Agent Studio) instead of forms, on the same API the web dashboard uses.'
        },
        {
          title: 'A secure, fast mobile client',
          plain: 'Signs in once, stays fast, and locks itself when you step away.',
          how: 'A typed fetch client keeps tokens in SecureStore and refreshes the 15-minute access token on its own. TanStack Query hooks mirror the web dashboard’s, and an app lock asks for fingerprint, face or PIN after a minute away.'
        }
      ]
    },
    architecture: {
      layers: [
        { name: 'Web portal & chat widget', note: 'Next.js · TypeScript' },
        { name: 'CRAVE mobile app', note: 'Expo React Native · TypeScript · TanStack Query', accent: true },
        { name: 'Native modules · Kotlin', note: 'Caller ID, call-back jobs, live audio' },
        { name: 'NestJS API', note: 'PostgreSQL · Prisma · Redis · BullMQ · WebSockets', accent: true },
        { name: 'Voice AI agents', note: 'Sarvam Voice Agents · Pipecat bridge (Twilio / Vobiz)', accent: true },
        { name: 'Lead qualification', note: 'OpenAI on the transcript · web search on the company' },
        { name: 'AI agents', note: 'WhatsApp, web chat and phone, on OpenAI and Sarvam models' }
      ]
    },
    gallery: {
      eyebrow: 'On Google Play',
      title: 'The store screenshots',
      sub: 'Six screens from the mobile app’s store listing.',
      images: [
        { src: '/Mockups/store/crave-01.webp', alt: 'Call logs: what the AI did with every call' },
        { src: '/Mockups/store/crave-02.webp', alt: 'A call: summary, key points, next steps and recording' },
        { src: '/Mockups/store/crave-03.webp', alt: 'Caller ID: transfer a ringing call to the AI agent' },
        { src: '/Mockups/store/crave-04.webp', alt: 'Leads: every lead with its source and AI rating' },
        { src: '/Mockups/store/crave-05.webp', alt: 'A lead: one-tap call, WhatsApp, email and meeting' },
        { src: '/Mockups/store/crave-06.webp', alt: 'Meetings booked by the AI' }
      ]
    },
    closing: 'No lead waits, no call goes unanswered — the AI and the phone in your pocket work as one.'
  },

  {
    id: 'postcard',
    eyebrow: 'Flagship product · Founder',
    pitch: 'Helping people discover hidden gems through community.',
    intro:
      'A social discovery platform where people explore hidden places, share experiences, and discover cities through real people instead of generic ratings. Built to make discovery feel more personal, social, and meaningful.',
    facts: [
      { label: 'Role', value: 'Founder — design & engineering' },
      { label: 'Status', value: 'Live on Google Play' },
      { label: 'Platform', value: 'Android · React Native' },
      { label: 'Core', value: 'Community, maps & geo-discovery' }
    ],
    links: [{ label: 'Get it on Google Play', href: 'https://play.google.com/store/apps/details?id=com.gauravvedi18.postcard&pcampaignid=web_share' }],
    heroScreen: { video: '/videos/postcard-feed-map.mp4', image: '/videos/posters/postcard-feed-map.jpg', barCleaned: true },
    flows: [
      {
        tag: 'Onboarding',
        title: 'Login Flow',
        summary: 'Seamless onboarding, your way.',
        desc: 'Sign in effortlessly using Google or email and personalize your experience from the very first interaction. Designed to make discovery feel instant, familiar, and intuitive while minimizing friction during onboarding.',
        steps: ['Login', 'Profile setup', 'Onboarding', 'Home'],
        highlights: ['Google & Email Authentication', 'Personalized onboarding journey', 'Preference-based discovery setup', 'Instant account access'],
        why: 'Instead of overwhelming setup screens, Postcard gradually personalizes discovery through lightweight onboarding, profile customization, and preference-based experiences — users move from authentication to meaningful exploration in seconds.',
        mobile: { video: '/videos/personalized-experience.mp4' }
      },
      {
        tag: 'Social',
        title: 'Community & Browsing',
        summary: 'Experience discovery powered by people.',
        desc: 'Explore hidden gems shared by real people through a social-first discovery experience. Browse authentic recommendations, open immersive posts, engage with likes and discussions, and save memorable places into personal collections.',
        steps: ['Browse homepage', 'Open posts', 'Community reviews', 'Likes & comments', 'Saved collections'],
        highlights: ['Community-powered recommendations', 'Immersive hidden place discovery', 'Save locations to collections', 'Real experiences over ratings'],
        why: 'Unlike review platforms that rely on ratings, Postcard focuses on authentic discovery through people and storytelling — meaningful places found through trusted community experiences rather than generic algorithms.',
        mobile: { video: '/videos/community-browsing.mp4', barInset: true }
      },
      {
        tag: 'Core feature',
        title: 'Discover Hidden Places',
        summary: 'Community-driven exploration around you.',
        desc: 'Discover extraordinary places through an interactive geo-location experience designed for real-world exploration. Filter nearby hidden gems, uncover trending spots, read recommendations from locals, browse community guestbooks, and save discoveries for later.',
        steps: ['Open app', 'Map exploration', 'Geo-location filtering', 'Discover hidden places', 'Community guestbook', 'Save & navigate'],
        highlights: ['Interactive map exploration', 'Geo-location powered discovery', 'Trending nearby & global spots', 'Community guestbooks', 'Navigation support'],
        why: 'This is the core experience of Postcard. The geo-intelligent map system makes exploration feel personal, local, and authentic.',
        mobile: { video: '/videos/discover-places.mp4' }
      },
      {
        tag: 'Creation',
        title: 'Create & Share Experience',
        summary: 'Turn experiences into discoveries.',
        desc: 'Transform memorable places into meaningful discoveries through a creator-first publishing experience. Upload photos, tag precise locations, share authentic recommendations, and publish hidden gems that help others explore.',
        steps: ['Create post', 'Upload media', 'Geo-location tagging', 'Write recommendation', 'Publish post'],
        highlights: ['Rich media uploads', 'Precise geo-location tagging', 'Authentic storytelling', 'Creator-first publishing'],
        why: 'Postcard grows through authentic experiences shared by real people — discovery stories that help communities uncover memorable places through trust, context, and local knowledge.',
        mobile: { video: '/videos/create-share.mp4' }
      },
      {
        tag: 'Discovery',
        title: 'Explore & Geo Discovery',
        summary: 'Location-aware discovery, personalized to you.',
        desc: 'Discover what’s happening around you through Postcard’s geo-discovery engine. Explore trending hidden gems nearby, filter places by location, uncover local and global hotspots, and follow the top community hunters shaping discovery across regions.',
        steps: ['Open Explore', 'Set geo-location', 'Nearby trending places', 'Global discoveries', 'Top hunters', 'Global rankings'],
        highlights: ['Geo-location powered filtering', 'Nearby & global trends', 'Top community hunters', 'Location-aware exploration'],
        why: 'Combining geo-awareness, community behaviour and trend-based exploration turns Postcard into a location-intelligent platform — places that feel relevant to where you are.',
        mobile: { video: '/videos/explore-geo-discovery.mp4' }
      },
      {
        tag: 'Identity',
        title: 'Profile & Personalization',
        summary: 'Your discovery journey, all in one place.',
        desc: 'Manage your entire discovery identity through a personalized profile. Explore created posts, revisit saved bucket lists, track quests and achievements, customize themes, and shape the platform around your own exploration style.',
        steps: ['Open profile', 'Created posts', 'Bucket list', 'Track quests', 'Customize theme'],
        highlights: ['Personal discovery profile', 'Saved bucket lists', 'Quest & progression system', 'Theme personalization'],
        why: 'Identity, saved experiences, achievements and personalization make Postcard a long-term companion rather than a one-time discovery app.',
        mobile: { video: '/videos/profile-personalization.mp4' }
      }
    ],
    workflow: {
      title: 'How discovery works',
      sub: 'From a stranger’s photo to standing in the place.',
      steps: [
        { name: 'Sign in', desc: 'Google or email, in seconds.' },
        { name: 'Browse', desc: 'Hidden gems shared by real people.' },
        { name: 'Discover', desc: 'Filter the map around you.' },
        { name: 'Navigate', desc: 'Straight into Google Maps.' },
        { name: 'Share', desc: 'Post your own find, geo-tagged.' },
        { name: 'Rank', desc: 'Climb the top-hunter boards.' }
      ]
    },
    architecture: {
      layers: [
        { name: 'React Native app', note: 'Feed, map, explore, create, profile' },
        { name: 'Firebase', note: 'Authentication, data and media', accent: true },
        { name: 'Maps & geo-location', note: 'Nearby filtering and navigation hand-off' }
      ]
    },
    closing: 'Discovery that feels personal — shipped and live on Google Play, designed and engineered by its founder.'
  },

  {
    id: 'tender9',
    eyebrow: 'Client project · Solo developed',
    pitch: 'From a government tender notice to a decision, on the phone in your hand.',
    intro:
      'A procurement-intelligence platform for suppliers to government. The mobile app brings tender discovery, AI-generated document briefs, competitor analytics and real-time push alerts to Android and iOS.',
    hook: 'I developed it solo for the client, then wrote the whitepaper on what it taught me: the value of AI comes less from the model than from the pipeline around it.',
    facts: [
      { label: 'Role', value: 'Solo developer, for a client' },
      { label: 'Status', value: 'Coming soon on Google Play & iOS' },
      { label: 'Platform', value: 'Android & iOS · Expo React Native' },
      { label: 'Published', value: 'From Documents to Decisions, 2026' }
    ],
    links: [{ label: 'Read the whitepaper', href: WHITEPAPER }],
    heroScreen: { image: '/Mockups/tender9-welcome.png', barCleaned: true },
    flows: [
      {
        tag: 'Onboarding',
        title: 'Welcome & Sign Up',
        summary: 'Unlock opportunities in government and business contracts.',
        desc: 'The app opens on one clear promise and two choices. New suppliers sign up with Google or email, verify by one-time code, then complete their profile before they reach a single tender.',
        steps: ['Welcome', 'Google or email', 'Verify code', 'Complete profile'],
        highlights: ['Google Sign-In', 'One-time code verification', 'Unfinished profiles routed back to setup'],
        why: 'A signed-in supplier with an unfinished profile always lands back on setup, even after restarting the app, because one guard at the app root checks every route.',
        mobile: { image: '/Mockups/tender9-welcome.png', barCleaned: true }
      },
      {
        tag: 'Discovery',
        title: 'Every Open Tender',
        summary: 'Search, filter and follow, without visiting a dozen portals.',
        desc: 'Active and archived tenders in one feed, with category chips, search, advanced filters and the closing date on every card. Following a tender saves it to your list.',
        steps: ['Browse', 'Filter', 'Follow', 'View details'],
        highlights: ['Active & archived tabs', 'Server-side advanced search', 'Budget and closing date up front'],
        why: 'Discovery should not depend on what someone remembered to search for. This feed is the pull half; push alerts are the other.',
        mobile: { image: '/Mockups/tender9-home.png', barCleaned: true }
      },
      {
        tag: 'AI',
        title: 'The AI Tender Brief',
        summary: 'A long tender document, read in minutes.',
        desc: 'One tap turns a tender’s documents into a brief with fixed sections, so the overview, technical eligibility and criteria are in the same place every time. Specification tables stay tables, and the phone shows progress while the work runs on the server.',
        steps: ['Summarize using AI', 'Processed on the server', 'Overview', 'Eligibility', 'Criteria'],
        highlights: ['Fixed-template sections', 'Tables rendered natively', 'Usage metered per plan'],
        why: 'Consistency across thousands of documents matters more than eloquence in any one. A supplier knows exactly where the eligibility criteria will be.',
        mobile: { image: '/Mockups/tender9-brief.png', barCleaned: true }
      },
      {
        tag: 'Outcomes',
        title: 'Results & Competitors',
        summary: 'Who won, at what price, against whom.',
        desc: 'Awarded tenders with the winner, the stage reached, the estimate against the contract value and the full bidder list. Reports, competitor search and company comparison build on the same normalized data.',
        steps: ['Tender results', 'List of bidders', 'Competitor search', 'Compare companies'],
        highlights: ['Winner, stage & contract value', 'Bidder ranks', 'One registry behind every comparison'],
        why: 'What was offered and what happened are stored separately and joined, which is what lets a supplier learn from the market’s history.',
        mobile: { image: '/Mockups/tender9-results.png', barCleaned: true }
      }
    ],
    workflow: {
      title: 'Six pillars, one pipeline.',
      sub: 'How a tender moves through Tender9: each step consumes the output of the last.',
      steps: [
        { name: 'Ingest', desc: 'Tender portal exports, de-duplicated by bid number.' },
        { name: 'Structure', desc: 'Change history on every record; awards tied to one bidder registry.' },
        { name: 'Understand', desc: 'Documents harvested and converted to a fixed-section brief.' },
        { name: 'Alert', desc: 'Push on a match, reminders before deadlines, outcome notifications.' },
        { name: 'Assist', desc: '“Apply” opens a specialist-assisted ticket; nothing is submitted for you.' },
        { name: 'Measure', desc: 'Outcomes recorded and joined back to the tenders behind them.' }
      ]
    },
    story: {
      eyebrow: 'The real problem',
      title: 'Suppliers weren’t short of data. They were short of time to read it.',
      body: 'The gap is decision latency: the distance between information arriving and a qualified person acting on it. A summarizer bolted onto an inbox helps one person. Closing the gap took all three parts of it.',
      steps: [
        { title: 'Discovery', text: 'How long until the right person knows a tender exists. Alerts match every new record against what a supplier said they care about.' },
        { title: 'Comprehension', text: 'How long until they understand what it requires. A fixed brief puts scope, eligibility and criteria in known places.' },
        { title: 'Action', text: 'How long until something happens, correctly and with a record. Applying becomes a tracked ticket with a specialist.' }
      ],
      result: 'A system that decides what reaches a person, when it reaches them, and what they can do about it from the device in their hand.'
    },
    engineering: {
      title: 'The problems behind the screens.',
      sub: 'The hard problems in this app and how they were handled, discussed in more depth in the whitepaper.',
      howLabel: 'How Tender9 handles it',
      items: [
        {
          title: 'Identity chaos',
          plain: 'The same company appears under several spellings across sources. Without normalization, every count and competitor view is wrong.',
          how: 'Award data is normalized to a single bidder registry, so competitor and pricing views stay consistent.'
        },
        {
          title: 'Messy, repeated imports',
          plain: 'Tender data arrives as portal exports with inconsistent formats, and operators load the same file again and again.',
          how: 'Tens of thousands of notices are ingested and de-duplicated by bid number, with change history on every record. Loading a file twice updates records; it never duplicates them.'
        },
        {
          title: 'Unreadable documents',
          plain: 'The facts that decide a bid are buried in long, often scanned documents, and go/no-go calls get made on the first page.',
          how: 'A queued pipeline runs Google Vision OCR, splits the text into overview, technical and financial parts, and has a language model write a fixed-template brief. The source text is kept alongside it for audit.'
        },
        {
          title: 'Discovery by luck',
          plain: 'People find what they search for. What they don’t think to search for, they miss.',
          how: 'Subscribers declare target regions and categories and get a push alert on a match, so the system watches every new notice for them.'
        },
        {
          title: 'Missed windows',
          plain: 'Bids are time-boxed. Late discovery turns directly into lost revenue, or a rushed, weaker submission.',
          how: 'Deadline reminders go out before a tender closes, and outcome notifications close the loop, each one opening the exact tender in the app.'
        },
        {
          title: 'Automation without gradation',
          plain: 'Teams swing between everything manual and a model acting alone. A bid is too consequential for the second.',
          how: 'The “apply” action opens a specialist-assisted ticket and never submits on the user’s behalf. That keeps a person accountable and the action reversible.'
        },
        {
          title: 'Controlling AI cost and access',
          plain: 'Document AI is expensive per use, and some fields are commercially sensitive. Neither can be left open.',
          how: 'Access to sensitive fields is tiered and AI usage is metered per plan. The API decides on every request, and the app reflects it with locked fields and quota states.'
        },
        {
          title: 'Pilots that don’t scale',
          plain: 'A summarizer works for one team, then stalls because the pipeline around it was never built.',
          how: 'Web, mobile and internal operations are served from one rule set: the same decisions, three channels. On mobile, a token-authenticated API reuses the website’s own search and gating logic.'
        }
      ]
    },
    architecture: {
      layers: [
        { name: 'Tender9 mobile app', note: 'Expo React Native · TypeScript · TanStack Query', accent: true },
        { name: 'REST API', note: 'Laravel · Sanctum token auth' },
        { name: 'Rules & data', note: 'Search, plan gating, bidder registry · MySQL' },
        { name: 'Document pipeline', note: 'Queued jobs · Google Vision OCR · LLM briefs' },
        { name: 'Alerts & payments', note: 'Firebase push · Razorpay subscriptions' }
      ]
    },
    whitepaper: {
      title: 'From Documents to Decisions',
      subtitle: 'A Practical Framework for AI-Powered Decision Intelligence in the Enterprise',
      series: 'Webshark · Enterprise Insights Series, Vol. 1 · 2026',
      href: WHITEPAPER,
      note: 'Written by me from building Tender9’s mobile app. Tender9 is the worked example in section 7.2, on page 20.',
      facts: [
        { value: '27', label: 'pages' },
        { value: '6', label: 'pillar framework' },
        { value: '4', label: 'tier automation ladder' }
      ]
    },
    closing: 'Build the pipeline before chasing the model.'
  },
  {
    id: 'washadmin',
    eyebrow: 'Car wash operations platform',
    pitch: 'A full-stack mobile + operations platform for managing bookings, subscriptions, bays, and business operations in real time.',
    intro:
      'A complete ecosystem: a customer-facing mobile application and a real-time admin dashboard for managing car wash operations.',
    facts: [
      { label: 'Scope', value: 'Customer app, admin portal & backend' },
      { label: 'Platforms', value: 'Expo React Native · ReactJS' },
      { label: 'Backend', value: 'Appwrite · PostgreSQL' },
      { label: 'Payments', value: 'Razorpay subscriptions & pay-per-wash' }
    ],
    heroScreen: { video: '/videos/customer-booking-mobile.mp4', image: '/Mockups/washadmin-mobile-home.png' },
    flows: [
      {
        tag: 'Onboarding',
        title: 'Customer Journey & Smart Booking',
        summary: 'From sign-up to a confirmed wash, frictionless.',
        desc: 'Customers authenticate, register their vehicles, purchase subscriptions, and book available time slots in real time.',
        steps: ['Login & OTP', 'Add Vehicle', 'Buy Subscription', 'Book a Wash', 'Real-time Updates'],
        highlights: ['Phone number authentication', 'Seamless vehicle registration', 'Instant subscription purchases', 'Real-time booking updates'],
        why: 'Keeps the customer experience modern and fast, lowering the barrier to booking and driving more consistent wash volume.',
        mobile: { video: '/videos/customer-booking-mobile.mp4', image: '/Mockups/washadmin-mobile-home.png' }
      },
      {
        tag: 'Core workflow',
        title: 'Smart Check-In Experience',
        summary: 'Scan, pay, and the queue updates live.',
        desc: 'Customers check in instantly with a QR code and pay per wash via Razorpay, while administrators monitor the queue and trigger manual check-ins when needed.',
        steps: ['QR Check-in', 'Razorpay Integration', 'Manual Portal Check-in', 'Live Queue Updates'],
        highlights: ['Instant QR check-in', 'Secure Razorpay checkouts', 'Live admin queue sync'],
        why: 'Bridges the physical and digital experience, removing bottlenecks at the wash site and giving operators a clear view of the queue.',
        mobile: { video: '/videos/checkin-mobile.mp4' },
        desktop: { video: '/videos/checkin-desktop.mp4' }
      },
      {
        tag: 'Automation',
        title: 'Auto Bay Intelligence',
        summary: 'Bays assign themselves.',
        desc: 'Server-side automation assigns bays based on real-time availability and wash type. Customers see live bay status while the system runs the background operations.',
        steps: ['Cronjob Automation', 'Auto Bay Assignment', 'Live Status Tracking', 'Completion Notifications'],
        highlights: ['Automated bay routing', 'Intelligent cron scheduling', 'Push notifications', 'Zero manual assignment'],
        why: 'Removes human error from wash operations: automated bay logistics maximise throughput and minimise idle time.',
        mobile: { video: '/videos/bay-management-mobile.mp4' },
        desktop: { video: '/videos/bay-management-desktop.mp4' }
      },
      {
        tag: 'Administration',
        title: 'Operations Configuration Engine',
        summary: 'The whole business, configurable.',
        desc: 'Operators configure pricing models, subscription tiers, bay logic, booking rules and payment controls — all updating the customer app in real time.',
        steps: ['Manage Pricing', 'Configure Subscriptions', 'Set Booking Rules', 'Payment Controls'],
        highlights: ['Dynamic pricing controls', 'Flexible subscription builder', 'Custom bay logic', 'Real-time syncing'],
        why: 'Wash businesses iterate on their business model instantly, without a fresh app release.',
        desktop: { video: '/videos/config-desktop.mp4' }
      },
      {
        tag: 'Growth',
        title: 'Customer Management & Growth',
        summary: 'Retention, wallets and subscriptions.',
        desc: 'Administrators track customer habits, manage wallet recharges and analyse subscription behaviour, while customers use a clean mobile wallet and history.',
        steps: ['Marketing Tab', 'Wallet Recharges', 'Subscription Management', 'Booking History'],
        highlights: ['Customer retention insights', 'Integrated wallet system', 'Subscription health monitoring', 'Full transaction history'],
        why: 'Shifts the business from one-off transactions to predictable recurring revenue.',
        desktop: { video: '/videos/customer-growth-desktop.mp4' }
      },
      {
        tag: 'Analytics',
        title: 'Analytics & Business Intelligence',
        summary: 'What owners learn about their business.',
        desc: 'An analytics dashboard inside the admin portal: revenue, peak hours, retention and wash volume at a glance.',
        steps: ['Revenue Dashboards', 'Peak Hour Analytics', 'Retention Tracking', 'Wash Volume Metrics'],
        highlights: ['Live revenue tracking', 'Peak hour identification', 'Actionable retention data', 'Operational health tracking'],
        why: 'Owners make staffing, promotion and operations decisions from data instead of guesswork.',
        desktop: { video: '/videos/analytics-desktop.mp4' }
      }
    ],
    workflow: {
      title: 'How the platform works',
      sub: 'One workflow, for customers and operators alike.',
      steps: [
        { name: 'Sign up', desc: 'The customer registers.' },
        { name: 'Add vehicle', desc: 'Vehicle details saved.' },
        { name: 'Subscribe', desc: 'Billing through Razorpay.' },
        { name: 'Book a slot', desc: 'Picks an available window.' },
        { name: 'QR check-in', desc: 'A scan begins the wash.' },
        { name: 'Bay assigned', desc: 'Cron jobs allocate bays by live availability and wash duration.' },
        { name: 'Wash complete', desc: 'The customer is notified.' }
      ]
    },
    architecture: {
      layers: [
        { name: 'Mobile app', note: 'Expo React Native' },
        { name: 'Appwrite backend', note: 'Auth + database + APIs', accent: true },
        { name: 'Realtime sync', note: 'Bookings reflect in operations instantly' },
        { name: 'Admin portal', note: 'ReactJS' },
        { name: 'Cron-based bay allocation', note: 'Server-side scheduling' }
      ]
    },
    engineering: {
      title: 'Engineering challenges solved',
      items: [
        { title: 'Realtime synchronization', plain: 'Customer bookings instantly reflect inside admin operations.' },
        { title: 'Automated bay assignment', plain: 'Cron-based scheduling manages wash flow and timing.' },
        { title: 'Subscription commerce', plain: 'Razorpay integration powers recurring plans and pay-per-wash.' },
        { title: 'Configurable business rules', plain: 'Admins change business logic without redeploying the app.' }
      ]
    },
    portal: {
      title: 'The real-time operations dashboard',
      sub: 'A production-grade admin portal for bookings, subscriptions, bays, customers and profitability.',
      cards: [
        { title: 'Real-time bay management', desc: 'Manages wash bays automatically from live booking data and time-based automation.', chips: ['Auto-clear bays', 'Queue management', 'Vehicle tracking'], image: '/Screenshots/washadmin-admin-bay.png', wide: true },
        { title: 'Business intelligence', desc: 'Revenue forecasting, profitability, customer metrics and burn rate.', chips: ['Revenue', 'Profitability', 'Burn rate'], image: '/Screenshots/washadmin-admin-analytics.png' },
        { title: 'Slot-based booking engine', desc: 'Occupancy and booking availability, visualised in real time.', chips: ['Live capacity', 'Booking status'], image: '/Screenshots/washadmin-admin-slot.png' },
        { title: 'Booking operations', desc: 'Customer bookings, check-ins and operational flow.', chips: ['Live bookings', 'Scheduling'], image: '/Screenshots/washadmin-admin-bookings.png', wide: true },
        { title: 'Fully configurable operations', desc: 'Hours, subscriptions, payments, slot rules and wash operations — no code.', chips: ['Razorpay config', 'Slot duration', 'Dynamic plans', 'Bay automation'], image: '/Screenshots/washadmin-admin-config.png', wide: true }
      ]
    },
    closing: 'Designed and engineered as a production-ready car wash operating system.'
  },

  {
    id: 'cliniko',
    eyebrow: 'AI-powered healthcare SaaS',
    pitch: 'A full-scale clinical ecosystem for patient care, AI prescription digitization, and operational workflows.',
    intro:
      'A patient app, a dedicated staff mobile app, and an enterprise admin dashboard that streamline clinical operations with zero latency.',
    facts: [
      { label: 'Scope', value: 'Patient app, staff app & admin portal' },
      { label: 'AI', value: 'Gemini prescription digitization' },
      { label: 'Backend', value: 'Appwrite · Node.js' },
      { label: 'Payments', value: 'Razorpay' }
    ],
    heroScreen: { video: '/videos/clinko-booking-mobile.mp4', image: '/Mockups/clinko-mobile-booking.png' },
    flows: [
      {
        tag: 'Onboarding',
        title: 'Smart Patient Journey & Onboarding',
        summary: 'A patient joins, and their profile is ready.',
        desc: 'The patient creates an account and securely enters their medical profile details, natively on their phone.',
        steps: ['Install App', 'Create Account', 'Enter Profile Details', 'Secure Onboarding', 'Patient Dashboard'],
        highlights: ['Mobile first', 'Secure profile', 'Seamless onboarding'],
        why: 'Shows how the system removes friction from the moment a patient joins the platform.',
        mobile: { video: '/videos/clinko-booking-mobile.mp4', image: '/Mockups/clinko-mobile-booking.png' }
      },
      {
        tag: 'Core workflow',
        title: 'Smart Queue & Cabin Intelligence',
        summary: 'Real-time clinic orchestration & live booking sync.',
        desc: 'A booking made on the phone appears instantly on the clinic portal; staff then manage the smart queue, assign cabins and complete the consultation.',
        steps: ['New Booking', 'Instant Portal Sync', 'Patient Check-in', 'Live Wait Estimation', 'Cabin Allocation', 'Complete Consultation'],
        highlights: ['Real-time sync', 'Algorithmic wait', 'Auto cabin allotment'],
        why: 'Replaces a chaotic waiting room with predictable flow, in sync across every device.',
        mobile: { video: '/videos/clinko-queue-mobile.mp4' },
        desktop: { video: '/videos/clinko-queue-desktop.mp4' }
      },
      {
        tag: 'AI processing',
        title: 'AI Prescription Intelligence',
        summary: 'Handwritten notes into structured schedules.',
        desc: 'Staff snap a photo of any handwritten prescription. Gemini extracts the medicine schedule, a human verifies it for safety, and it syncs to the patient’s app as reminders.',
        steps: ['Upload Prescription', 'Gemini Processing', 'Medicine Extraction', 'Structured Schedule', 'Patient Reminder'],
        highlights: ['Gemini AI API', 'Image to JSON', 'Human validated'],
        why: 'Real-world AI solving a real healthcare problem: unreadable handwriting leading to missed medications.',
        mobile: { video: '/videos/clinko-ai-mobile.mp4' },
        desktop: { video: '/videos/clinko-ai-desktop.mp4' }
      },
      {
        tag: 'Customization',
        title: 'Clinic Configuration Engine',
        summary: 'Every clinic runs differently.',
        desc: 'Operating hours, slot intervals, capacity logic, consultation timing and automated payment controls — all configurable.',
        steps: ['Operating Hours', 'Slot Logic', 'Cabin Capacity', 'Consultation Timing', 'Payments', 'Automation Rules'],
        highlights: ['Razorpay integration', 'Interval logic'],
        why: 'Enterprise SaaS maturity: the configuration engine adapts to each clinic’s way of working.',
        desktop: { video: '/videos/clinko-config-desktop.mp4' }
      },
      {
        tag: 'Administration',
        title: 'Staff Access & Role Management',
        summary: 'Scalable collaboration and access control.',
        desc: 'The administrator adds staff, generates unique IDs, and assigns portal permissions to doctors, receptionists or admins.',
        steps: ['Add Staff', 'Assign Role', 'Permission Control', 'Portal Access', 'Operational Sync'],
        highlights: ['RBAC', 'Multi-user'],
        why: 'Hierarchical role-based access control on a multi-user architecture that scales.',
        desktop: { image: '/Screenshots/clinko-admin-config.png' }
      },
      {
        tag: 'Analytics',
        title: 'Analytics & Clinic Intelligence',
        summary: 'Data-driven decisions for the clinic.',
        desc: 'Revenue growth, patient retention, medicine inventory and loyalty metrics, tracked in one place.',
        steps: ['Clinic Overview', 'Growth Trends', 'Financial Analytics', 'Inventory Insights', 'Patient Satisfaction'],
        highlights: ['Business intelligence', 'Retention tracking'],
        why: 'Moves the product from a management tool to a growth-oriented SaaS.',
        desktop: { video: '/videos/clinko-analytics-desktop.mp4' }
      }
    ],
    workflow: {
      title: 'How the ecosystem works',
      sub: 'An uninterrupted digital bridge between clinical staff and patient care.',
      steps: [
        { name: 'Prioritized booking', desc: 'Normal or emergency slots.' },
        { name: 'Smart check-in', desc: 'Remote self check-in joins the live queue.' },
        { name: 'Cabin allotment', desc: 'Calculated from live flow.' },
        { name: 'Consultation', desc: 'The doctor captures the prescription on a staff device.' },
        { name: 'AI digitization', desc: 'Gemini turns handwriting into structured JSON.' },
        { name: 'Human validated', desc: 'Reception verifies and approves.' },
        { name: 'Auto-reminders', desc: 'Medication alerts on the patient’s app.' }
      ]
    },
    architecture: {
      layers: [
        { name: 'Clinical ecosystem', note: 'Staff + patient interfaces' },
        { name: 'Appwrite backend', note: 'Auth + realtime DB + functions', accent: true },
        { name: 'Gemini parsing pipeline', note: 'Handwriting to structured JSON' },
        { name: 'Admin verification portal', note: 'Human in the loop' },
        { name: 'Cron & push schedulers', note: 'Reminders and notifications' }
      ]
    },
    engineering: {
      title: 'Engineering challenges solved',
      items: [
        { title: 'AI prescription pipeline', plain: 'Remote web-socket triggers for staff phone cameras, connected to Gemini multimodal extraction, parsing unreadable handwriting into strict JSON.' },
        { title: 'Real-time queue reshuffling', plain: 'Booking capacity windows that shift waiting estimates when emergency patients are inserted.' },
        { title: 'Dynamic RBAC constraints', plain: 'Nested, clinic-defined role mapping, so each clinic toggles features to match its hierarchy.' },
        { title: 'Automatic cabin allotment', plain: 'Server-side functions map live cabin states to doctor availability and consultation durations.' }
      ]
    },
    portal: {
      title: 'The enterprise administration portal',
      sub: 'AI-assisted workflows, real-time queues and deep analytics, in place of legacy hospital software.',
      cards: [
        { title: 'AI prescription digitization', desc: 'Handwritten notes, captured on staff phones, translated by Gemini into structured JSON and audited before syncing to patients.', chips: ['Gemini', 'JSON parsing', 'Human-in-the-loop'], image: '/Screenshots/clinko-admin-ai.png', wide: true },
        { title: 'Queue & cabin intelligence', desc: 'Live check-ins, wait estimates, emergency priorities and automatic cabin dispersal.', chips: ['Live queue', 'Cabin flow'], image: '/Screenshots/clinko-admin-queue.png' },
        { title: 'Enterprise analytics', desc: 'Burn rate, inventory forecasting, medication success and capacity utilisation.', chips: ['Medication insights', 'Inventory'], image: '/Screenshots/clinko-admin-analytics.png' },
        { title: 'Patient re-engagement', desc: 'Clinical touchpoints, follow-up campaigns, retention profiles and satisfaction.', chips: ['Loyalty', 'Retention', 'Feedback'], image: '/Screenshots/clinko-admin-patients.png', wide: true },
        { title: 'RBAC & configuration engine', desc: 'Multi-level access control, slot intervals, Razorpay and operating hours — each clinic’s own logic.', chips: ['Custom RBAC', 'Slot architecture', 'Payments'], image: '/Screenshots/clinko-admin-config.png', wide: true }
      ]
    },
    closing: 'Human unpredictability, turned into systemic operational precision.'
  }
];

export function caseStudyFor(id: string) {
  return CASE_STUDIES.find((c) => c.id === id);
}

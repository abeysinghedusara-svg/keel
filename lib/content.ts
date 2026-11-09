export const navigation = [
  ["Services", "services"],
  ["Why Keel", "why"],
  ["How it works", "how"],
  ["FAQs", "faq"],
] as const;

export const services = [
  {
    id: "legal",
    label: "Legal support",
    title: "More time for the work only you can do.",
    description:
      "A legally trained team member who understands the detail, keeps things moving, and works under your direction.",
    items: [
      "Legal administration & firm operations",
      "Inbox, calendar & task management",
      "Case files, deadlines & documents",
      "Drafting, proofreading & legal research",
      "Client intake & follow-ups",
      "Billing support & invoicing",
    ],
  },
  {
    id: "compliance",
    label: "Compliance support",
    title: "Careful work. Consistent standards.",
    description:
      "Detail-oriented support for your compliance workflows, trained on your procedures and the systems you approve.",
    items: [
      "KYC & KYB onboarding reviews",
      "AML screening & alert review support",
      "Compliance records & documentation",
      "Policy & procedure drafting support",
    ],
  },
] as const;

export const steps = [
  {
    time: "DAY 01",
    title: "First, we listen.",
    description:
      "A 30-minute discovery call to understand your workload, tools, and working hours.",
    note: "Your needs. A clear brief.",
    kind: "discovery",
  },
  {
    time: "WITHIN 2 WEEKS",
    title: "Meet your shortlist.",
    description:
      "We send you 2–3 vetted candidates. You interview them and choose the right person.",
    note: "Vetted by us. Chosen by you.",
    kind: "shortlist",
  },
  {
    time: "FIRST 2 WEEKS",
    title: "Set up for success.",
    description:
      "We train your new team member on your tools and processes, with close support from day one.",
    note: "Your systems. Your way of working.",
    kind: "onboarding",
  },
  {
    time: "EVERY DAY",
    title: "Steady, ongoing support.",
    description:
      "Daily updates, regular check-ins, and one point of contact. We stay with you as your needs grow.",
    note: "A team behind your team member.",
    kind: "support",
  },
] as const;

export const faqs = [
  [
    "Are your team members lawyers?",
    "Our team members are law graduates. They are not licensed to practise law in your jurisdiction and do not give legal advice. They work under the direction and supervision of your lawyers.",
  ],
  [
    "Can I interview candidates before deciding?",
    "Yes. We send you a shortlist of vetted candidates, with their profiles, writing samples, test results, interview notes, and availability. You interview them and choose the person you want.",
  ],
  [
    "What hours do they work?",
    "Full time, with most of their day overlapping with yours. They can start a few hours before you, so your inbox and task list are ready when you sit down. We agree the schedule with you during discovery.",
  ],
  [
    "Will they use our software?",
    "Yes. We train them on your practice management system, document and billing tools, and your way of working. Day-to-day communication happens in your tools, such as email, Slack, or Teams.",
  ],
  [
    "How does pricing work?",
    "A simple monthly fee per team member, based on the role and hours. Keel Talent engages and pays the team member, handling hiring, payroll, and HR administration. Book a call for a clear quote.",
  ],
  [
    "What if it’s not the right fit?",
    "There is a trial period to make sure the fit is right. Tell us if something is not working: we will work with you to fix it or find a replacement. We offer simple monthly terms with no long lock-in.",
  ],
  [
    "How do you keep our data safe?",
    "Every team member signs a confidentiality agreement, works on company accounts with two-factor login, and uses only the systems you approve. No client files are kept on personal storage.",
  ],
  [
    "Where do you work with firms?",
    "We support law firms and growing businesses around the world, including the US, the UK, Australia, Canada, and New Zealand. Our team is based in Colombo, Sri Lanka.",
  ],
] as const;

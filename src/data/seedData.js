export const wards = [
  {
    id: 1,
    name: "Ward 1",
    population: 5400,
    highlights: ["Heritage Trail", "Community Library"],
    needs: ["Drainage upgrade", "Playground lighting"],
  },
  {
    id: 2,
    name: "Ward 2",
    population: 6200,
    highlights: ["Tech Hub", "Public Health Center"],
    needs: ["Road resurfacing", "Smart water meters"],
  },
  {
    id: 3,
    name: "Ward 3",
    population: 4800,
    highlights: ["Urban Farm", "Mothers Group"],
    needs: ["Waste segregation", "Street security cameras"],
  },
];

export const sponsorSpots = [
  {
    id: "s1",
    name: "Ganga Fashion Creation",
    imageURL: "/images/ganga-fashion.png",
    link: "#",
    priority: "top",
    startDate: "2025-01-10",
    endDate: "2025-04-30",
  },
  {
    id: "s2",
    name: "Community FM",
    imageURL: "/images/sponsor-fm.png",
    link: "#",
    priority: "middle",
    startDate: "2025-02-01",
    endDate: "2025-08-15",
  },
  {
    id: "s3",
    name: "Eco Waste",
    imageURL: "/images/sponsor-eco.png",
    link: "#",
    priority: "footer",
    startDate: "2025-03-10",
    endDate: "2025-12-31",
  },
];

export const documents = [
  {
    id: "birth-certificate",
    title: "Birth Certificate Registration",
    requirements: [
      "Parent citizenship copies",
      "Marriage certificate",
      "Witness signature",
    ],
    processingTime: "3 working days",
    fee: "Rs. 200",
    office: "Ward Registration Desk",
    contact: "01-5550133",
    workflow: ["Fill form", "Submit documents", "Verification", "Pickup"],
    faqs: [
      {
        q: "Can I apply online?",
        a: "Fill the pre-form on HamroWard and visit the ward office to verify.",
      },
    ],
  },
  {
    id: "marriage-registration",
    title: "Marriage Registration",
    requirements: [
      "Citizenship copies of bride and groom",
      "Passport size photos",
      "Two witness IDs",
    ],
    processingTime: "5 working days",
    fee: "Rs. 700",
    office: "Legal Affairs Desk",
    contact: "01-5550144",
    workflow: ["Verification", "Interview", "Documentation", "Certificate"],
    faqs: [
      {
        q: "What if partner is abroad?",
        a: "Provide power of attorney and notarized passport copy.",
      },
    ],
  },
  {
    id: "migration-certificate",
    title: "Migration Certificate",
    requirements: [
      "Citizenship copy",
      "Land-lord recommendation",
      "Utility bill",
    ],
    processingTime: "2 working days",
    fee: "Rs. 300",
    office: "Citizens Service Center",
    contact: "01-5550155",
    workflow: [
      "Submit form",
      "Ward field verification",
      "Approval",
      "Certificate",
    ],
    faqs: [
      {
        q: "Is police verification needed?",
        a: "Only for inter-district migration.",
      },
    ],
  },
];

export const issueCategories = [
  "Road",
  "Drinking Water",
  "Drainage",
  "Electricity",
  "Public Service",
  "Waste Management",
  "Community Safety",
];

export const sampleIssues = [
  {
    id: "iss-1",
    title: "Potholes near school",
    category: "Road",
    ward: 2,
    status: "inprogress",
    reportedAt: "2025-01-14",
  },
  {
    id: "iss-2",
    title: "Overflowing drainage",
    category: "Drainage",
    ward: 3,
    status: "pending",
    reportedAt: "2025-01-15",
  },
];

export const sampleVideos = [
  {
    id: "vid-1",
    title: "Community cleanup",
    ward: 1,
    user: "Sita",
    likes: 120,
    status: "approved",
  },
  {
    id: "vid-2",
    title: "Ward tech meetup",
    ward: 2,
    user: "Ramesh",
    likes: 64,
    status: "pending",
  },
];

export const quickStats = {
  totalIssues: 86,
  pendingIssues: 23,
  inProgressIssues: 41,
  resolvedIssues: 22,
  activeSponsors: 6,
};


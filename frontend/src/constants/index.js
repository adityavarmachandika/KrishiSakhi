const navLinks = [
  {
    name: "About",
    link: "#about",
  },
  {
    name: "Weather",
    link: "#weather",
  },
  {
    name: "Chat",
    link: "#chat",
  },
  {
    name: "News",
    link: "#news",
  },

];
// Mock Farmer Tasks Data
const farmerTasksData = [
  {
    task: "Irrigation of Wheat Field",
    date: "2025-09-25",
    duration: "2 hours",
    notes: "Ensure the water reaches all corners of the field. Avoid overwatering to prevent soil erosion. Check the pump pressure before starting.",
  },
  {
    task: "Fertilization of Corn",
    date: "2025-09-26",
    duration: "3 hours",
    notes: "Use nitrogen-rich fertilizer for better growth. Wear protective gloves during application. Spread evenly across the field.",
  },
  {
    task: "Pest Control in Tomato Crop",
    date: "2025-09-27",
    duration: "1.5 hours",
    notes: "Apply organic pesticide to reduce chemical usage. Spray early in the morning for better absorption. Monitor plants for remaining pests after 24 hours.",
  },
  {
    task: "Harvesting Wheat",
    date: "2025-10-01",
    duration: "3 days",
    notes: "Check moisture levels before harvesting. Use the combine harvester carefully to avoid grain loss. Store grains in a dry, ventilated area.",
  },
  {
    task: "Soil Testing",
    date: "2025-09-28",
    duration: "1 day",
    notes: "Collect samples from four different parts of the field. Label samples properly for lab testing. Analyze results to plan next crop cycle.",
  },
];

const LatestNews = [
  {
    status: "ok",
    totalResults: 1,
    articles: [
      {
        source: {
          id: null,
          name: "Thehillstimes.in",
        },
        author: "The Hills Times",
        title:
          "Morigaon Agriculture Dept. Hosts Two-Day Farmer-Scientist Meet to Boost Awareness and Technical Training",
        description:
          "HT, Digital Morigaon , Sept 04: Morigaon District Agriculture Department in collaboration with CSS_ Agricultural Technology Management Agency, Morigaon (ATMA), has organized a two day awareness programme on ‘Farmer-Scientist meet and Interaction session’…",
        url: "https://thehillstimes.in/assam/morigaon-agriculture-dept-hosts-two-day-farmer-scientist-meet-to-boost-awareness-and-technical-training",
        urlToImage:
          "https://thehillstimes.in/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-05-at-11.32.51-PM.jpeg",
        publishedAt: "2025-09-05T08:30:00Z",
        content:
          "HT, Digital\r\nMorigaon , Sept 04: Morigaon District Agriculture Department in collaboration with CSS_ Agricultural Technology Management Agency, Morigaon (ATMA), has organized a two day awareness … [+1230 chars]",
      },
    ],
  },
];


export { navLinks, farmerTasksData, LatestNews };
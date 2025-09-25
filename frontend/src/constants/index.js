import { faComments, faChartLine, faCloud, faTasks } from '@fortawesome/free-solid-svg-icons';
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
  {
    "status": "ok",
    "totalResults": 6,
    "articles": [
        {
            "source": {
                "id": null,
                "name": "The Hindu BusinessLine"
            },
            "author": "G Naga Sridhar",
            "title": "NABARD projects ₹2.43 lakh crore credit potential for Andhra Pradesh farm sector",
            "description": "The National Bank for Agriculture and Rural Development (NABARD) has pegged the priority sector credit potential for Andhra Pradesh for the year 2025-26 at ₹2.43 lakh crore, with a significant focus on the farm credit and agriculture infrastructure.",
            "url": "https://www.thehindubusinessline.com/economy/agri-business/nabard-projects-243-lakh-crore-credit-potential-for-ap-farm-sector/article67605969.ece",
            "publishedAt": "2025-09-24T05:00:00Z",
            "content": "The National Bank for Agriculture and Rural Development (NABARD) has pegged the priority sector credit potential for Andhra Pradesh at ₹2.43 lakh crore for the upcoming fiscal year, placing a strong emphasis on boosting the farm sector… [+1650 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "Krishi Jagran"
            },
            "author": "KJ Staff",
            "title": "ICAR Develops Drought-Tolerant Chickpea Variety to Boost Farmer Incomes",
            "description": "The Indian Council of Agricultural Research (ICAR) has successfully developed a new variety of chickpea that is drought-tolerant and resistant to fusarium wilt. This innovation is expected to significantly enhance crop yield and income for farmers in water-scarce regions.",
            "url": "https://krishijagran.com/agriculture-world/icar-develops-drought-tolerant-chickpea-variety/",
            "publishedAt": "2025-09-23T12:20:00Z",
            "content": "In a major breakthrough for Indian agriculture, scientists at the Indian Council of Agricultural Research (ICAR) have developed a new chickpea variety with enhanced tolerance to drought conditions. The variety, Pusa JG 16… [+1400 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "Press Information Bureau"
            },
            "author": "Ministry of Agriculture & Farmers Welfare",
            "title": "Government releases SOPs for use of Drones in Agriculture for crop protection and nutrient application",
            "description": "To promote precision farming in the country, the Ministry of Agriculture & Farmers Welfare has released Standard Operating Procedures (SOPs) for the use of drones in spraying pesticides, soil nutrients, and crop assessment.",
            "url": "https://pib.gov.in/PressReleasePage.aspx?PRID=1783226",
            "publishedAt": "2025-09-23T09:45:00Z",
            "content": "With the aim of making drone technology affordable to the farmers and other stakeholders of this sector, the Ministry of Agriculture and Farmers’ Welfare has released the Standard Operating Procedures (SOPs) for drone application… [+1900 chars]"
        },
        
    ]
}
];

  const features = [
    {
      id: 1,
      icon: faComments,
      title: "AI Chat Assistant",
      description: "Get instant farming advice and solutions powered by AI",
      color: "from-green-400 to-green-600",
      delay: "0s"
    },
    {
      id: 2,
      icon: faChartLine,
      title: "Activity Logging",
      description: "Track and analyze your farming activities efficiently",
      color: "from-blue-400 to-blue-600", 
      delay: "0.2s"
    },
    {
      id: 3,
      icon: faCloud,
      title: "Weather Insights",
      description: "Real-time weather updates for better crop planning",
      color: "from-purple-400 to-purple-600",
      delay: "0.4s"
    },
    {
      id: 4,
      icon: faTasks,
      title: "Task Management",
      description: "Organize and prioritize your farm tasks effectively",
      color: "from-orange-400 to-orange-600",
      delay: "0.6s"
    }
  ];

export { navLinks, farmerTasksData, LatestNews, features };
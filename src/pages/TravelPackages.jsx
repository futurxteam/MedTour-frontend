import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Compass, 
  MapPin, 
  Clock, 
  Users, 
  X, 
  Check, 
  ChevronDown, 
  Car, 
  Languages, 
  Hotel, 
  Calendar, 
  Map, 
  ShieldCheck, 
  ArrowRight, 
  Heart,
  Activity,
  Smile,
  Compass as TravelIcon
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./styles/TravelPackages.css";

// Import local images from components/images
import athirappillyImg from "../components/images/athirappilly.jpg";
import kochiImg from "../components/images/kochi.jpg";
import kovalamImg from "../components/images/kovalam.jpg";
import kumarakomImg from "../components/images/kumarakom.jpg";
import munnarImg from "../components/images/munnar.jpg";
import thekkadyImg from "../components/images/thekkady.jpg";
import wagamonImg from "../components/images/wagamon.jpg";
import wayanadImg from "../components/images/wayanad.jpg";

// ---------------- MOCK DATA ----------------
const KERALA_HERO_SLIDES = [
  {
    image: munnarImg,
    title: "Munnar",
    tagline: "Rolling tea gardens and crisp mountain air"
  },
  {
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000&auto=format&fit=crop",
    title: "Alleppey Backwaters",
    tagline: "Emerald waters and luxury houseboats"
  },
  {
    image: kovalamImg,
    title: "Kovalam Beach",
    tagline: "Golden sands and ancient Ayurveda"
  },
  {
    image: athirappillyImg,
    title: "Athirappilly Waterfalls",
    tagline: "Majestic cascades amidst tropical rainforests"
  },
  {
    image: kochiImg,
    title: "Kochi Waterfront",
    tagline: "Historic Chinese fishing nets and cultural fusion"
  },
  {
    image: wayanadImg,
    title: "Wayanad Hills",
    tagline: "Mist-covered peaks and pristine nature"
  }
];

const DESTINATIONS = [
  {
    id: "munnar",
    name: "Munnar",
    image: munnarImg,
    shortDesc: "Breathtaking hill station covered in emerald tea plantations and enveloped in mist.",
    duration: "3-4 Days recommended",
    perfectFor: "Relaxation & Nature Lovers",
    scenicBadge: "Mountain Retreat",
    highlights: ["Tea plantations", "Eravikulam National Park", "Tea Museum", "Mountain resorts", "Fresh climate"],
    overview: "Munnar rises 1,600 meters above sea level, situated at the confluence of three mountain streams. Formerly the summer resort of the British Government in South India, it is world-renowned for its sprawling tea estates, colonial bungalows, and diverse flora and fauna, including the rare Nilgiri Tahr.",
    whyVisit: "The crisp cool climate and serene green landscapes offer a perfect, stress-free setting for patient recovery and deep relaxation.",
    attractions: ["Mattupetty Dam", "Anamudi Peak", "Eravikulam National Park", "Lakkam Waterfalls"],
    bestSeason: "September to May",
    suitableFor: ["Families", "Solo travellers", "Nature lovers"],
    gallery: [
      munnarImg,
      athirappillyImg,
      kovalamImg
    ]
  },
  {
    id: "alleppey",
    name: "Alleppey (Alappuzha)",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop",
    shortDesc: "The Venetian capital of Kerala, famed for its labyrinth of canals and luxury houseboats.",
    duration: "2-3 Days recommended",
    perfectFor: "Serene Water Journeys",
    scenicBadge: "Backwater Paradise",
    highlights: ["Luxury houseboats", "Backwaters", "Village life", "Ayurvedic experiences", "Sunset cruises"],
    overview: "Best known for houseboat cruises along the rustic Kerala backwaters, Alleppey is a network of canals, lagoons, and palm-fringed lakes. The slow-paced water life lets you observe local village activities, fishing, and coir-making directly from your private floating resort.",
    whyVisit: "Floating along calm waters on a luxury houseboat provides unparalleled tranquility, gentle breezes, and total privacy for recuperating visitors.",
    attractions: ["Alappuzha Beach", "Vembanad Lake", "Pathiramanal Island", "Marari Beach"],
    bestSeason: "October to March",
    suitableFor: ["Families", "Elderly", "Solo travellers"],
    gallery: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800",
      "https://images.unsplash.com/photo-1588668214407-6eb952709904?q=80&w=800",
      "https://images.unsplash.com/photo-1616501261358-15024479532c?q=80&w=800"
    ]
  },
  {
    id: "kochi",
    name: "Kochi (Cochin)",
    image: kochiImg,
    shortDesc: "A historic coastal port city blending colonial history with premium modern lifestyle.",
    duration: "2-3 Days recommended",
    perfectFor: "Culture & Shopping",
    scenicBadge: "Coastal History",
    highlights: ["Fort Kochi", "Jew Town", "Mattancherry Palace", "Marine Drive", "Chinese Fishing Nets", "Shopping"],
    overview: "Kochi has been a vibrant trading hub for centuries. Fort Kochi showcases Portuguese, Dutch, and British history, while Mattancherry Palace and Jew Town offer colorful local culture. Modern Kochi also boasts premier shopping malls, wellness centers, and fine dining.",
    whyVisit: "Excellent proximity to major MedTour hospitals, making it the perfect gateway for short weekend excursions before or after surgery.",
    attractions: ["Chinese Fishing Nets", "St. Francis Church", "Lulu Mall", "Cherai Beach"],
    bestSeason: "All Year Round (Best October to April)",
    suitableFor: ["Families", "Elderly", "Solo travellers"],
    gallery: [
      kochiImg,
      wayanadImg,
      kovalamImg
    ]
  },
  {
    id: "kovalam",
    name: "Kovalam",
    image: kovalamImg,
    shortDesc: "An internationally renowned beach destination with three adjacent crescent beaches.",
    duration: "3-4 Days recommended",
    perfectFor: "Beach & Wellness",
    scenicBadge: "Oceanic Sanctuary",
    highlights: ["Beaches", "Lighthouse", "Seafood", "Wellness spas", "Sunsets"],
    overview: "Kovalam is a scenic coastal town characterized by coconut groves, sandy beaches, and luxury resorts. The landmark red-and-white striped lighthouse offers stunning vistas of the Arabian Sea. It is also an epicentre for Ayurvedic therapy and yoga resorts.",
    whyVisit: "Gentle sea breeze, beach walks, and specialized spa therapies work wonders for physical rehabilitation and psychological rejuvenation.",
    attractions: ["Lighthouse Beach", "Hawa Beach", "Samudra Beach", "Vellayani Lake"],
    bestSeason: "September to March",
    suitableFor: ["Families", "Elderly", "Solo travellers", "Nature lovers"],
    gallery: [
      kovalamImg,
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800",
      munnarImg
    ]
  },
  {
    id: "thekkady",
    name: "Thekkady",
    image: thekkadyImg,
    shortDesc: "Vibrant wildlife hub surrounding the Periyar Lake, famous for wild elephants and spices.",
    duration: "2-3 Days recommended",
    perfectFor: "Wildlife & Spice Trails",
    scenicBadge: "Forest Haven",
    highlights: ["Periyar Wildlife Sanctuary", "Boating", "Spice plantations", "Forest walks", "Elephant experiences"],
    overview: "Thekkady is situated near the Kerala-Tamil Nadu border. The Periyar National Park is one of the most prominent tiger reserves in India, centered around an artificial lake where elephants, deer, and bison gather on the shores.",
    whyVisit: "Immerse yourself in clean, oxygen-rich forest air. Slow plantation strolls help regain physical stamina gently.",
    attractions: ["Periyar Lake Boat Cruise", "Mangala Devi Temple", "Pandikuzhi", "Anakkara Spice Farms"],
    bestSeason: "October to May",
    suitableFor: ["Families", "Solo travellers", "Nature lovers"],
    gallery: [
      thekkadyImg,
      athirappillyImg,
      wayanadImg
    ]
  },
  {
    id: "wayanad",
    name: "Wayanad",
    image: wayanadImg,
    shortDesc: "High-altitude wilderness area dotted with mist-laden peaks, ancient caves, and treehouses.",
    duration: "3-4 Days recommended",
    perfectFor: "Adventure & Isolation",
    scenicBadge: "Misty Highlands",
    highlights: ["Waterfalls", "Edakkal Caves", "Tea estates", "Tree houses", "Adventure"],
    overview: "Wayanad is a gorgeous upland region on the Western Ghats. It has a rich history with Neolithic rock carvings at Edakkal Caves, alongside wild cardamom, pepper, and tea estates. It offers a remote feeling of pristine, quiet nature.",
    whyVisit: "Excellent for accompanying family members seeking refreshing climate, hiking paths, and isolated eco-resorts.",
    attractions: ["Banasura Sagar Dam", "Chembra Peak", "Edakkal Caves", "Soochipara Falls"],
    bestSeason: "October to May",
    suitableFor: ["Families", "Solo travellers", "Nature lovers"],
    gallery: [
      wayanadImg,
      munnarImg,
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800"
    ]
  },
  {
    id: "athirappilly",
    name: "Athirappilly",
    image: athirappillyImg,
    shortDesc: "Home to India's most majestic, breathtaking waterfall amidst luxury rainforest scenery.",
    duration: "1-2 Days recommended",
    perfectFor: "Stunning Landscapes",
    scenicBadge: "Rainforest Magic",
    highlights: ["Waterfalls", "Rainforest", "Nature photography", "Scenic drives"],
    overview: "Athirappilly falls stand 80 feet high, pouring into the Chalakudy River. Surrounded by dense Sholayar forests, it is home to many endangered hornbills and other tropical bird species, providing a cinematic view of wild nature.",
    whyVisit: "The negative ions generated by the massive waterfalls provide a natural mood boost and respiratory refresh, ideal for a short post-treatment day trip.",
    attractions: ["Athirappilly Falls", "Vazhachal Falls", "Thumboormuzhy Dam", "Charpa Falls"],
    bestSeason: "June to January",
    suitableFor: ["Families", "Solo travellers", "Nature lovers"],
    gallery: [
      athirappillyImg,
      kochiImg,
      thekkadyImg
    ]
  },
  {
    id: "kumarakom",
    name: "Kumarakom",
    image: kumarakomImg,
    shortDesc: "A premium resort village on Vembanad Lake, famed for its luxury bird sanctuary and quietude.",
    duration: "2-3 Days recommended",
    perfectFor: "Premium Resort Pampering",
    scenicBadge: "Luxury Lagoon",
    highlights: ["Backwaters", "Bird sanctuary", "Luxury resorts", "Village experiences"],
    overview: "Kumarakom is a cluster of little islands on the Vembanad Lake. It is home to a wide variety of migratory birds, including Siberian storks. Famed for its ultra-luxurious heritage resorts offering custom spa retreats and wellness packages.",
    whyVisit: "Matches perfectly with five-star recovery wellness, offering private villas, floating pools, and specialized care assistance.",
    attractions: ["Kumarakom Bird Sanctuary", "Bay Island Driftwood Museum", "Vembanad Lake", "Aruvikkuzhi Waterfall"],
    bestSeason: "September to March",
    suitableFor: ["Families", "Elderly", "Solo travellers", "Nature lovers"],
    gallery: [
      kumarakomImg,
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800",
      kovalamImg
    ]
  },
  {
    id: "vagamon",
    name: "Vagamon",
    image: wagamonImg,
    shortDesc: "A quiet, offbeat hill station with rolling green meadows, pine forests, and cool breezes.",
    duration: "2 Days recommended",
    perfectFor: "Peaceful Serenity",
    scenicBadge: "Meadow Highlands",
    highlights: ["Pine forests", "Rolling hills", "Tea gardens", "Paragliding", "Peaceful atmosphere"],
    overview: "Vagamon is an untouched sanctuary of green meadows, pine forests, and tea estates. Free from heavy commercialization, it offers quiet walking trails, cool winds, and panoramic viewpoints that soothe the soul.",
    whyVisit: "Its peaceful, unhurried atmosphere provides an ideal environment for meditation, gentle walks, and stress-free convalescence.",
    attractions: ["Vagamon Pine Forest", "Vagamon Meadows", "Kurisumala Ashram", "Marmala Waterfall"],
    bestSeason: "September to May",
    suitableFor: ["Families", "Solo travellers", "Nature lovers"],
    gallery: [
      wagamonImg,
      munnarImg,
      athirappillyImg
    ]
  }
];

const KERALA_EXPERIENCES = [
  {
    title: "Ayurvedic Wellness",
    desc: "Ancient healing therapies and detox programs tailored for wellness and holistic recovery.",
    image: kovalamImg,
    icon: Heart
  },
  {
    title: "Luxury Houseboats",
    desc: "Glide gracefully through tranquil emerald waters in premium private floating villas.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600",
    icon: TravelIcon
  },
  {
    title: "Tea Plantation Walks",
    desc: "Stroll leisurely through refreshing cool estates while inhaling fresh mountain air.",
    image: munnarImg,
    icon: Map
  },
  {
    title: "Wildlife Safaris",
    desc: "Observe wild elephant herds and unique flora on private guided sanctuary tours.",
    image: thekkadyImg,
    icon: Compass
  },
  {
    title: "Traditional Kathakali Shows",
    desc: "Witness ancient storytelling art with expressive facial makeup and dramatic colors.",
    image: kochiImg,
    icon: Smile
  },
  {
    title: "Martial Arts (Kalaripayattu)",
    desc: "Marvel at the fluid agility and discipline of one of the oldest fighting arts on Earth.",
    image: wayanadImg,
    icon: Activity
  },
  {
    title: "Village Tours",
    desc: "Connect with locals, watch traditional weaving, and enjoy rustic backwater life.",
    image: kumarakomImg,
    icon: Users
  },
  {
    title: "Sunset Cruises",
    desc: "Bask in golden hour glory over the vast, calm Arabian Sea or serene Vembanad Lake.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600",
    icon: Clock
  },
  {
    title: "Local Cuisine Experiences",
    desc: "Indulge in flavorful organic dishes, fresh local spices, served traditionally on banana leaves.",
    image: wagamonImg,
    icon: Check
  },
  {
    title: "Spice Plantation Visits",
    desc: "Trek through aromatic gardens of green cardamom, cloves, cinnamon, and black pepper.",
    image: athirappillyImg,
    icon: MapPin
  }
];

const GALLERY_PHOTOS = [
  munnarImg,
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800",
  kovalamImg,
  athirappillyImg,
  kochiImg,
  wayanadImg,
  kumarakomImg,
  wagamonImg
];

const WHY_MEDTOUR_TRAVEL = [
  {
    title: "Curated Destinations",
    desc: "Handpicked locations featuring clean environment, low noise levels, and relaxing vibes."
  },
  {
    title: "Medical-Friendly Itineraries",
    desc: "Schedules paced carefully to avoid physical fatigue, aligned fully with your doctor's advice."
  },
  {
    title: "Private Transportation Arrangements",
    desc: "Chauffeur-driven luxury vehicles pre-equipped for comfort and patient support."
  },
  {
    title: "Multilingual Assistance",
    desc: "Dedicated care assistants fluent in your language accompanying your travel."
  },
  {
    title: "Comfort-Focused Planning",
    desc: "Minimized walking distances, wheelchair-accessible trails, and custom rest breaks."
  },
  {
    title: "Luxury Accommodation Recommendations",
    desc: "Elite partnerships with premium hotels offering round-the-clock medical assistance."
  },
  {
    title: "Airport Pickup Guidance",
    desc: "Seamless transfers from regional international airports directly to your hotel."
  },
  {
    title: "Family-Friendly Experiences",
    desc: "Diverse options ensuring accompanying relatives are entertained and comfortable."
  },
  {
    title: "Personalized Travel Advice",
    desc: "One-on-one travel experts helping to shape itineraries according to recovery progress."
  }
];

const ITINERARIES = [
  {
    title: "3-Day Relaxation",
    subtitle: "Coastal & Backwater rejuvenation",
    stops: [
      { name: "Kochi", desc: "Arrive at historic harbor, explore Jewish quarter and heritage architecture." },
      { name: "Alleppey", desc: "Board private houseboat, cruise serene canals at a peaceful, slow pace." },
      { name: "Backwaters", desc: "Unwind on the lagoon deck, enjoy fresh traditional cuisine and sunsets." }
    ]
  },
  {
    title: "5-Day Nature Escape",
    subtitle: "Highland wellness & wildlife trail",
    stops: [
      { name: "Munnar", desc: "Wake up amidst misty mountains, walk green tea hills, visit tea factory." },
      { name: "Thekkady", desc: "Enjoy calm wildlife boat tour on Periyar lake, take mild spice garden walks." },
      { name: "Kumarakom", desc: "Check into premium lake resort, relax with specialized Ayurvedic therapies." }
    ]
  },
  {
    title: "7-Day Kerala Highlights",
    subtitle: "Ultimate recovery and cultural voyage",
    stops: [
      { name: "Kochi", desc: "Explore local cultural heritage and enjoy high-end waterfront dining." },
      { name: "Munnar", desc: "Experience panoramic hill stations, colonial history, and fresh climate." },
      { name: "Thekkady", desc: "Private spice plantation trail and peaceful nature photography tours." },
      { name: "Alleppey", desc: "Spend the night in an ultra-luxurious houseboat with dedicated crew." },
      { name: "Kovalam", desc: "Relax on pristine golden sands, complete your recovery with Ayurvedic spa." }
    ]
  },
  {
    title: "Family Vacation",
    subtitle: "Comfort & wonder for all generations",
    stops: [
      { name: "Wayanad", desc: "Reside in luxury treehouses, explore ancient caves with gentle pathways." },
      { name: "Athirappilly", desc: "Witness massive waterfalls, enjoy scenic drives and rainforest resorts." },
      { name: "Kochi", desc: "Fun traditional Kathakali performances, city shopping, and family-friendly cruises." }
    ]
  }
];

const TESTIMONIALS = [
  {
    quote: "After my dental treatment in Kochi, spending three days in Munnar made my recovery truly memorable. The fresh air and private hills were perfect.",
    author: "Amelie Dubois",
    role: "Patient from France",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150"
  },
  {
    quote: "My husband underwent surgery in Kerala. While he rested in the private villa, MedTour organized a wonderful Alleppey houseboat tour for me and our kids. Exceptional service!",
    author: "Sarah Al-Mansoori",
    role: "Accompanying Family Member, UAE",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150"
  },
  {
    quote: "Highly recommend their travel assistance. The private transportation was so gentle, and the driver knew exactly how to avoid bumpy roads for my post-op comfort.",
    author: "Johnathan Miller",
    role: "Orthopedic Patient, UK",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150"
  }
];

const FAQS = [
  {
    q: "Can these trips be customized?",
    a: "Absolutely. Every single itinerary we show is a placeholder suggestion. We tailor every aspect of travel—locations, hotels, driving duration, and activities—directly around the patient's specific medical timeline and energy levels."
  },
  {
    q: "Can family members travel separately?",
    a: "Yes. While patients rest and recover post-op, we can arrange beautiful day trips or overnight excursions for accompanying family members to ensure their trip to Kerala is rich and enjoyable."
  },
  {
    q: "Can travel happen after treatment?",
    a: "Yes, travel can be planned either before the clinical procedures (to relax and adjust to the timezone) or after treatment, once the doctor has cleared the patient for light local travel."
  },
  {
    q: "Do you help plan sightseeing?",
    a: "Yes. MedTour acts as a coordinator, matching you with premium transport providers, local bilingual travel assistants, and luxury hotel packages to ensure your sightseeing is seamless."
  },
  {
    q: "Are destinations suitable for elderly travellers?",
    a: "We curate our recommended routes specifically for healthcare travelers. Destinations like Alleppey (floating houseboats) and Kumarakom (flat, premium resorts) require minimal walking and are fully suitable for seniors."
  }
];

export default function TravelPackages() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Hero Carousel State
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % KERALA_HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Modal State
  const [selectedDest, setSelectedDest] = useState(null);

  // Lightbox State
  const [lightboxImg, setLightboxImg] = useState(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Selected Itinerary category state
  const [activeItinerary, setActiveItinerary] = useState(0);

  return (
    <div className="travel-packages-root">
      <Header />

      {/* HERO SECTION */}
      <section className="tp-hero">
        <div className="tp-hero-bg-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIdx}
              className="tp-hero-slide"
              style={{ backgroundImage: `url(${KERALA_HERO_SLIDES[heroIdx].image})` }}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            />
          </AnimatePresence>
          <div className="tp-hero-overlay" />
        </div>

        <div className="tp-container tp-hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="tp-hero-text"
          >
            <span className="tp-hero-badge">Curated Recuperative Tourism</span>
            <h1>Recover. Relax. <br />Rediscover Kerala.</h1>
            <p>
              MedTour integrates premier healthcare with world-class travel experiences in 
              God's Own Country. Designed especially for international patients and their families 
              before or after clinical treatments.
            </p>
            <div className="tp-hero-btns">
              <a href="#destinations" className="tp-btn-primary">
                Explore Destinations
              </a>
              <Link to="/contact" className="tp-btn-secondary">
                Contact MedTour
              </Link>
            </div>
          </motion.div>

          {/* Floating Slide Info indicator */}
          <div className="tp-hero-slide-info">
            <span className="tp-hero-slide-title">{KERALA_HERO_SLIDES[heroIdx].title}</span>
            <span className="tp-hero-slide-desc">{KERALA_HERO_SLIDES[heroIdx].tagline}</span>
            <div className="tp-hero-dots">
              {KERALA_HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  className={`tp-hero-dot ${idx === heroIdx ? "active" : ""}`}
                  onClick={() => setHeroIdx(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION SECTION */}
      <section className="tp-intro-section tp-section-padding">
        <div className="tp-container tp-intro-grid">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="tp-intro-image-container"
          >
            <img 
              src={kumarakomImg} 
              alt="Serene Kerala Backwaters" 
              className="tp-intro-img"
            />
            <div className="tp-intro-floating-card">
              <span className="number">100%</span>
              <span className="label">Customized Around Your Recovery</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="tp-intro-text"
          >
            <span className="tp-section-subtitle">Wellness & Leisure Combined</span>
            <h2>God's Own Country Awaits Your Healing Journey</h2>
            <p>
              Kerala is celebrated worldwide as a sanctuary for healing, lush greenery, and peace. 
              Because medical travels often span several weeks, we believe recovery shouldn't be 
              confined to hospital rooms.
            </p>
            <p>
              MedTour works carefully with family members to design relaxed local travel plans. 
              Whether it is the mist-covered hills of Munnar or the slow drift of Alleppey’s backwaters, 
              we adapt every itinerary around the patient's recovery speed, comfort, and mobility.
            </p>
            
            <div className="tp-intro-features">
              <div className="tp-intro-feat-item">
                <div className="icon-box"><ShieldCheck size={24} /></div>
                <div>
                  <h4>Medical Clearance Priority</h4>
                  <p>All travels are cleared and coordinated with your surgical team.</p>
                </div>
              </div>
              <div className="tp-intro-feat-item">
                <div className="icon-box"><Car size={24} /></div>
                <div>
                  <h4>Zero-Stress Transit</h4>
                  <p>Comfort-tuned luxury rides with professional bilingual escorts.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section id="destinations" className="tp-destinations-section tp-section-padding">
        <div className="tp-container">
          <div className="tp-section-header">
            <span className="tp-section-subtitle">Handpicked Hideaways</span>
            <h2>Inspirational Destinations</h2>
            <p>Explore gorgeous environments across Kerala. Each card offers sample highlights for you and your family.</p>
          </div>

          <div className="tp-destinations-grid">
            {DESTINATIONS.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="tp-destination-card"
              >
                <div className="card-image-wrapper">
                  <img src={dest.image} alt={dest.name} className="card-img" />
                  <span className="card-badge">{dest.scenicBadge}</span>
                </div>
                <div className="card-body">
                  <span className="card-perfect">{dest.perfectFor}</span>
                  <h3>{dest.name}</h3>
                  <p className="card-desc">{dest.shortDesc}</p>
                  
                  <div className="card-highlights">
                    {dest.highlights.slice(0, 3).map((hl, i) => (
                      <span key={i} className="highlight-tag">
                        <Check size={12} className="check-icon" /> {hl}
                      </span>
                    ))}
                  </div>

                  <div className="card-footer">
                    <span className="card-duration">
                      <Clock size={14} /> {dest.duration}
                    </span>
                    <button 
                      onClick={() => setSelectedDest(dest)} 
                      className="card-btn"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* KERALA EXPERIENCE SECTION */}
      <section className="tp-experience-section tp-section-padding">
        <div className="tp-container">
          <div className="tp-section-header light">
            <span className="tp-section-subtitle">Immersive Tourism</span>
            <h2>Authentic Kerala Experiences</h2>
            <p>Curated leisure and lifestyle moments that let you taste local legacy in total comfort.</p>
          </div>

          <div className="tp-experiences-grid">
            {KERALA_EXPERIENCES.map((exp, index) => {
              const IconComp = exp.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="tp-exp-card"
                >
                  <div className="tp-exp-img-box">
                    <img src={exp.image} alt={exp.title} />
                    <div className="tp-exp-overlay" />
                    <div className="tp-exp-icon"><IconComp size={24} /></div>
                  </div>
                  <div className="tp-exp-content">
                    <h4>{exp.title}</h4>
                    <p>{exp.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SUGGESTED ITINERARIES */}
      <section className="tp-itinerary-section tp-section-padding">
        <div className="tp-container">
          <div className="tp-section-header">
            <span className="tp-section-subtitle">Sample Timelines</span>
            <h2>Inspirational Itineraries</h2>
            <p>Select a route concept designed to accommodate patient recovery speed and accompanying family leisure.</p>
          </div>

          <div className="tp-itinerary-nav">
            {ITINERARIES.map((iti, idx) => (
              <button
                key={idx}
                className={`tp-iti-nav-btn ${idx === activeItinerary ? "active" : ""}`}
                onClick={() => setActiveItinerary(idx)}
              >
                {iti.title}
              </button>
            ))}
          </div>

          <div className="tp-itinerary-content">
            <motion.div
              key={activeItinerary}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="tp-iti-showcase"
            >
              <div className="tp-iti-header">
                <h3>{ITINERARIES[activeItinerary].title}</h3>
                <span className="iti-subtitle">{ITINERARIES[activeItinerary].subtitle}</span>
              </div>

              <div className="tp-iti-timeline">
                {ITINERARIES[activeItinerary].stops.map((stop, sIdx) => (
                  <div key={sIdx} className="tp-iti-node">
                    <div className="node-marker">
                      <span>{sIdx + 1}</span>
                    </div>
                    <div className="node-details">
                      <h4>{stop.name}</h4>
                      <p>{stop.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY TRAVEL WITH MEDTOUR */}
      <section className="tp-why-section tp-section-padding">
        <div className="tp-container">
          <div className="tp-section-header text-center">
            <span className="tp-section-subtitle">Medically Safe Travel</span>
            <h2>Why Choose MedTour Travel Packages?</h2>
            <p>We blend luxury holiday planning with healthcare support, ensuring safety at every step.</p>
          </div>

          <div className="tp-why-grid">
            {WHY_MEDTOUR_TRAVEL.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="tp-why-card"
              >
                <div className="why-bullet" />
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MASONRY GALLERY */}
      <section className="tp-gallery-section tp-section-padding">
        <div className="tp-container">
          <div className="tp-section-header">
            <span className="tp-section-subtitle">Visual Splendor</span>
            <h2>Moments in God's Own Country</h2>
            <p>Click any photo to open full-screen and immerse yourself in the natural aesthetics of Kerala.</p>
          </div>

          <div className="tp-gallery-masonry">
            {GALLERY_PHOTOS.map((src, index) => (
              <div 
                key={index} 
                className="tp-gallery-item"
                onClick={() => setLightboxImg(src)}
              >
                <img src={src} alt={`Kerala Landscape ${index + 1}`} />
                <div className="tp-gallery-hover">
                  <Compass size={32} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="tp-testimonials-section tp-section-padding">
        <div className="tp-container">
          <div className="tp-section-header">
            <span className="tp-section-subtitle">Accompanying Experiences</span>
            <h2>Loved by Our Visitors</h2>
            <p>Read fictional examples of how patients and family members spent their recovery weeks in Kerala.</p>
          </div>

          <div className="tp-testimonials-grid">
            {TESTIMONIALS.map((tst, idx) => (
              <div key={idx} className="tp-testimonial-card">
                <div className="tst-icon">“</div>
                <p className="tst-text">"{tst.quote}"</p>
                <div className="tst-author-box">
                  <img src={tst.avatar} alt={tst.author} />
                  <div>
                    <h5>{tst.author}</h5>
                    <span>{tst.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="tp-faq-section tp-section-padding">
        <div className="tp-container">
          <div className="tp-section-header">
            <span className="tp-section-subtitle">Got Questions?</span>
            <h2>Frequently Asked Questions</h2>
            <p>Understand the logistics of combining medical treatment with restorative travel packages.</p>
          </div>

          <div className="tp-faq-list">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`tp-faq-item ${isOpen ? "open" : ""}`}>
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="tp-faq-q"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={20} className="arrow" />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="tp-faq-a"
                      >
                        <p>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="tp-final-cta">
        <div className="tp-cta-overlay" />
        <div className="tp-container tp-cta-content">
          <h2>Experience Kerala Beyond Your Treatment</h2>
          <p>
            Ready to combine clinical excellence with peaceful natural wonders? Let our advisors 
            help customize a perfect journey for you and your family.
          </p>
          <div className="tp-cta-btns">
            <Link to="/services" className="tp-btn-primary">
              Explore Treatments
            </Link>
            <Link to="/contact" className="tp-btn-secondary">
              Contact MedTour
            </Link>
          </div>
        </div>
      </section>

      {/* DESTINATION DETAIL MODAL */}
      <AnimatePresence>
        {selectedDest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="tp-modal-overlay"
            onClick={() => setSelectedDest(null)}
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              transition={{ type: "spring", damping: 25 }}
              className="tp-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedDest(null)} 
                className="tp-modal-close"
              >
                <X size={24} />
              </button>

              <div className="tp-modal-banner" style={{ backgroundImage: `url(${selectedDest.image})` }}>
                <div className="tp-modal-banner-overlay" />
                <div className="tp-modal-banner-info">
                  <span className="badge">{selectedDest.scenicBadge}</span>
                  <h2>{selectedDest.name}</h2>
                  <p>{selectedDest.perfectFor}</p>
                </div>
              </div>

              <div className="tp-modal-body">
                <div className="tp-modal-info-grid">
                  <div className="info-main">
                    <h3>Overview</h3>
                    <p className="overview-text">{selectedDest.overview}</p>

                    <h3>Why Patients Love It</h3>
                    <p className="why-text">{selectedDest.whyVisit}</p>

                    <h3>Popular Attractions</h3>
                    <div className="attraction-tags">
                      {selectedDest.attractions.map((att, i) => (
                        <span key={i} className="att-tag">{att}</span>
                      ))}
                    </div>

                    <h3>Scenery Gallery</h3>
                    <div className="modal-gallery">
                      {selectedDest.gallery.map((img, i) => (
                        <img 
                          key={i} 
                          src={img} 
                          alt="Gallery item" 
                          onClick={() => setLightboxImg(img)}
                          className="clickable-gallery-img"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="info-sidebar">
                    <div className="sidebar-card">
                      <h4>Quick Details</h4>
                      
                      <div className="side-detail-item">
                        <Clock size={18} className="side-icon" />
                        <div>
                          <strong>Suggested Duration</strong>
                          <span>{selectedDest.duration}</span>
                        </div>
                      </div>

                      <div className="side-detail-item">
                        <Calendar size={18} className="side-icon" />
                        <div>
                          <strong>Best Season</strong>
                          <span>{selectedDest.bestSeason}</span>
                        </div>
                      </div>

                      <div className="side-detail-item">
                        <Users size={18} className="side-icon" />
                        <div>
                          <strong>Suitable For</strong>
                          <div className="suit-tags">
                            {selectedDest.suitableFor.map((tag, idx) => (
                              <span key={idx} className="suit-tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sidebar-note">
                      <h5>Coordinated Care</h5>
                      <p>Our dedicated care managers will coordinate transport, accessibility accommodations, and medical clearances directly with your surgical team.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX FOR IMAGES */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="tp-lightbox-overlay"
            onClick={() => setLightboxImg(null)}
          >
            <button className="tp-lightbox-close" onClick={() => setLightboxImg(null)}>
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightboxImg}
              alt="Enlarged Kerala Landscape"
              className="tp-lightbox-img"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

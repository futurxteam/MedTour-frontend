// src/pages/demoData.js

export const testimonials = [
    {
        id: 1,
        name: "James",
        country: "United Kingdom",
        surgery: "Hip Replacement",
        review: "Everything from the initial consultation to the recovery was handled with extreme professionalism. I saved over 60% compared to UK prices.",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
        id: 2,
        name: "Abdel",
        country: "UAE",
        surgery: "Cardiac Bypass",
        review: "The medical care in Kerala is world-class. My doctor was very patient and explained everything clearly. Highly recommended!",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
        id: 3,
        name: "Sarah",
        country: "USA",
        surgery: "Dental Implants",
        review: "I combined my treatment with a vacation in Munnar. It was the most relaxing recovery ever. MedTour assistants are amazing.",
        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
    }
];

export const experts = [
    {
        id: 1,
        name: "Dr. Thomas Mathew",
        specialty: "Chief Cardiac Surgeon",
        quote: "Precision medicine is our standard. Using robotics and legacy expertise, we achieve success rates comparable to best global centers."
    },
    {
        id: 2,
        name: "Dr. Lakshmi Nair",
        specialty: "Orthopedic Consultant",
        quote: "Kerala offers a unique balance of surgical excellence and natural recovery environments, which accelerates patient healing significantly."
    }
];

export const comparisonData = [
    { procedure: "Knee Replacement", usa: "$40,000", india: "$5,500", uk: "$18,000" },
    { procedure: "Cardiac Bypass", usa: "$120,000", india: "$8,000", uk: "$35,000" },
    { procedure: "IVF Treatment", usa: "$15,000", india: "$2,500", uk: "$8,000" },
    { procedure: "Dental Implants", usa: "$5,000", india: "$900", uk: "$3,000" }
];

export const kochiHospitals = [
    {
        id: 1,
        slug: "aster-medcity",
        name: "Aster Medcity",
        location: "Cheranelloor, Kochi",
        description: "One of the most advanced healthcare destinations in South Asia, spread over 40 acres.",
        img: "https://images.unsplash.com/photo-1586773860418-d3b979781a39?auto=format&fit=crop&w=800&q=80",
        doctors: ["Dr. Thomas (Cardiac)", "Dr. Sarah (Neurology)"]
    },
    {
        id: 2,
        slug: "amrita-hospital",
        name: "Amrita Hospital",
        location: "Edappally, Kochi",
        description: "A premier institute with 1300 beds and ultra-modern surgical facilities.",
        img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
        doctors: ["Dr. Raj (Oncology)", "Dr. Anita (Gastro)"]
    },
    {
        id: 3,
        slug: "rajagiri-hospital",
        name: "Rajagiri Hospital",
        location: "Aluva, Kochi",
        description: "Focuses on providing affordable yet high-end tertiary care. Excellent patient support.",
        img: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80",
        doctors: ["Dr. Nair (Orthopedic)", "Dr. John (Urology)"]
    }
];

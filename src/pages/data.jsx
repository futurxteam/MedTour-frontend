// src/data/surgeryData.jsx
export const surgeryData = [
  {
    id: "proctology",
    title: "Proctology",
    description:
      "Specialised & advanced treatment for anorectal diseases including laser surgery for piles (hemorrhoids), anal fissures, fistulas, and pilonidal sinus.",
    image: "/images/proctology.jpg",
    doctors: [
      {
        id: "doc-proc-1",
        name: "Dr. Rajesh Menon",
        specialization: "Proctologist",
        experience: "15 Years",
        qualifications: "MBBS, MS (General Surgery)",
        hospital: "City Care Hospital",
        rating: 4.8,
        about:
          "Expert in minimally invasive laser proctology procedures including hemorrhoidectomy, fistulotomy, and fissure surgery with over 5000 successful cases.",
        availability: "Mon - Sat | 10:00 AM - 6:00 PM",
      },
      {
        id: "doc-proc-2",
        name: "Dr. Anil Kumar",
        specialization: "Colorectal Surgeon",
        experience: "12 Years",
        qualifications: "MBBS, MS, MCh",
        hospital: "LifeLine Hospital",
        rating: 4.6,
        about:
          "Specializes in laser treatment for piles, anal fissures, and fistula-in-ano with high success rates.",
        availability: "Mon - Fri | 9:00 AM - 5:00 PM",
      },
      {
        id: "doc-proc-3",
        name: "Dr. Sunita Sharma",
        specialization: "Proctologist",
        experience: "10 Years",
        qualifications: "MBBS, MS (General Surgery)",
        hospital: "MedLife Procto Center",
        rating: 4.7,
        about:
          "Focuses on advanced treatments for pilonidal sinus and complex anal fistulas using minimally invasive techniques.",
        availability: "Tue - Sun | 10:00 AM - 5:00 PM",
      },
    ],
  },
  {
    id: "laparoscopy",
    title: "Laparoscopy",
    description:
      "Minimally invasive keyhole surgery for abdominal disorders including cholecystectomy, appendectomy, hernia repair, and colectomy with faster recovery.",
    image: "/images/laparoscopy.jpg",
    doctors: [
      {
        id: "doc-lap-1",
        name: "Dr. Sneha Iyer",
        specialization: "Laparoscopic Surgeon",
        experience: "14 Years",
        qualifications: "MBBS, MS (Lap Surgery)",
        hospital: "Apollo Surgical Center",
        rating: 4.9,
        about:
          "Renowned for advanced laparoscopic procedures like gallbladder removal, hernia repair, and bariatric surgeries.",
        availability: "Mon - Sat | 11:00 AM - 7:00 PM",
      },
      {
        id: "doc-lap-2",
        name: "Dr. Vikram Singh",
        specialization: "General & Laparoscopic Surgeon",
        experience: "18 Years",
        qualifications: "MBBS, MS, Fellowship in Minimal Access Surgery",
        hospital: "Fortis Hospital",
        rating: 4.8,
        about:
          "Expert in laparoscopic appendectomy, colectomy, and hiatal hernia repair.",
        availability: "Mon - Fri | 9:00 AM - 6:00 PM",
      },
    ],
  },
  {
    id: "gynaecology",
    title: "Gynaecology",
    description:
      "Advanced treatment for female reproductive issues including hysterectomy, myomectomy, ovarian cystectomy, and endometriosis surgery.",
    image: "/images/gynaecology.jpg",
    doctors: [
      {
        id: "doc-gyn-1",
        name: "Dr. Priya Nair",
        specialization: "Gynecologist",
        experience: "18 Years",
        qualifications: "MBBS, MD (OBG)",
        hospital: "Women Care Hospital",
        rating: 4.7,
        about:
          "Expert in high-risk pregnancies, laparoscopic hysterectomy, and minimally invasive gynecologic surgeries.",
        availability: "Mon - Sat | 9:00 AM - 4:00 PM",
      },
      {
        id: "doc-gyn-2",
        name: "Dr. Anjali Gupta",
        specialization: "Gynecologic Surgeon",
        experience: "15 Years",
        qualifications: "MBBS, MS (OBG), Fellowship in Laparoscopy",
        hospital: "Max Women's Health",
        rating: 4.8,
        about:
          "Specializes in fibroid removal (myomectomy), ovarian cystectomy, and endometriosis treatment.",
        availability: "Mon - Fri | 10:00 AM - 5:00 PM",
      },
    ],
  },
  {
    id: "ent",
    title: "ENT (Ear, Nose, Throat)",
    description:
      "Minimal access surgery for ear, nose, and throat disorders including tonsillectomy, septoplasty, sinus surgery (FESS), and tympanoplasty.",
    image: "/images/ent.jpg",
    doctors: [
      {
        id: "doc-ent-1",
        name: "Dr. Vikram Rao",
        specialization: "ENT Specialist",
        experience: "20 Years",
        qualifications: "MBBS, MS (ENT)",
        hospital: "Sound Health Clinic",
        rating: 4.8,
        about:
          "Specialist in functional endoscopic sinus surgery (FESS), tonsillectomy, and hearing restoration procedures.",
        availability: "Tue - Sun | 10:00 AM - 6:00 PM",
      },
      {
        id: "doc-ent-2",
        name: "Dr. Meena Desai",
        specialization: "Otorhinolaryngologist",
        experience: "12 Years",
        qualifications: "MBBS, DLO, MS (ENT)",
        hospital: "ENT Care Center",
        rating: 4.7,
        about:
          "Expert in septoplasty, adenoidectomy, and ear tube insertion.",
        availability: "Mon - Sat | 9:00 AM - 5:00 PM",
      },
    ],
  },
  {
    id: "urology",
    title: "Urology",
    description:
      "Surgical treatment for urogenital issues including kidney stone removal (PCNL/URS), prostatectomy, cystoscopy, and vasectomy.",
    image: "/images/urology.jpg",
    doctors: [
      {
        id: "doc-uro-1",
        name: "Dr. Arjun Patel",
        specialization: "Urologist",
        experience: "16 Years",
        qualifications: "MBBS, MS, MCh (Urology)",
        hospital: "MedLife Hospital",
        rating: 4.9,
        about:
          "Specializes in laser kidney stone removal, TURP for prostate, and minimally invasive urologic oncology.",
        availability: "Mon - Fri | 10:00 AM - 6:00 PM",
      },
      {
        id: "doc-uro-2",
        name: "Dr. Rohan Mehta",
        specialization: "Urologic Surgeon",
        experience: "14 Years",
        qualifications: "MBBS, MS, MCh",
        hospital: "Apollo Urology Center",
        rating: 4.8,
        about:
          "Expert in percutaneous nephrolithotomy (PCNL), ureteroscopy, and bladder procedures.",
        availability: "Tue - Sat | 11:00 AM - 7:00 PM",
      },
    ],
  },
  {
    id: "vascular",
    title: "Vascular",
    description:
      "Surgical treatment of arteries, veins, and lymphatic system including varicose vein laser treatment, bypass surgery, and aneurysm repair.",
    image: "/images/vascular.jpg",
    doctors: [
      {
        id: "doc-vas-1",
        name: "Dr. Suresh Pillai",
        specialization: "Vascular Surgeon",
        experience: "22 Years",
        qualifications: "MBBS, MS, MCh (Vascular Surgery)",
        hospital: "Heart & Vein Center",
        rating: 4.8,
        about:
          "Expert in endovenous laser treatment for varicose veins, carotid endarterectomy, and aortic aneurysm repair.",
        availability: "Mon - Sat | 10:00 AM - 5:00 PM",
      },
      {
        id: "doc-vas-2",
        name: "Dr. Kavita Reddy",
        specialization: "Vascular & Endovascular Surgeon",
        experience: "13 Years",
        qualifications: "MBBS, MS, Fellowship in Vascular Surgery",
        hospital: "Vascular Care Hospital",
        rating: 4.7,
        about:
          "Specializes in peripheral artery bypass, angioplasty, and stenting.",
        availability: "Mon - Fri | 9:00 AM - 6:00 PM",
      },
    ],
  },
  {
    id: "aesthetics",
    title: "Aesthetics",
    description:
      "Cosmetic procedures for reconstruction and improvement including liposuction, rhinoplasty, breast augmentation, and facelift.",
    image: "/images/aesthetics.jpg",
    doctors: [
      {
        id: "doc-aes-1",
        name: "Dr. Meera Shah",
        specialization: "Cosmetic Surgeon",
        experience: "13 Years",
        qualifications: "MBBS, MS (Cosmetic Surgery)",
        hospital: "Glow Aesthetic Clinic",
        rating: 4.7,
        about:
          "Specializes in body contouring (liposuction), rhinoplasty, and anti-aging facelifts.",
        availability: "Mon - Fri | 11:00 AM - 7:00 PM",
      },
      {
        id: "doc-aes-2",
        name: "Dr. Amit Kapoor",
        specialization: "Plastic & Aesthetic Surgeon",
        experience: "16 Years",
        qualifications: "MBBS, MS, MCh (Plastic Surgery)",
        hospital: "Beauty Enhance Center",
        rating: 4.9,
        about:
          "Expert in breast augmentation, abdominoplasty (tummy tuck), and blepharoplasty.",
        availability: "Mon - Sat | 10:00 AM - 6:00 PM",
      },
    ],
  },
  {
    id: "orthopedics",
    title: "Orthopedics (Bone & Joint)",
    description:
      "Treatment of musculoskeletal injuries including joint replacement (knee/hip), arthroscopy, and fracture fixation.",
    image: "/images/orthopedics.jpg",
    doctors: [
      {
        id: "doc-ortho-1",
        name: "Dr. Karthik Reddy",
        specialization: "Orthopedic Surgeon",
        experience: "17 Years",
        qualifications: "MBBS, MS (Ortho)",
        hospital: "Bone & Joint Hospital",
        rating: 4.8,
        about:
          "Specialist in total knee/hip replacement, ACL reconstruction, and sports injury management.",
        availability: "Mon - Sat | 9:00 AM - 6:00 PM",
      },
      {
        id: "doc-ortho-2",
        name: "Dr. Pooja Malhotra",
        specialization: "Orthopedic Surgeon",
        experience: "12 Years",
        qualifications: "MBBS, MS (Ortho), Fellowship in Joint Replacement",
        hospital: "Ortho Care Clinic",
        rating: 4.7,
        about:
          "Focuses on shoulder arthroscopy, spine surgery, and revision joint replacements.",
        availability: "Mon - Fri | 10:00 AM - 5:00 PM",
      },
    ],
  },
  {
    id: "ophthalmology",
    title: "Ophthalmology",
    description:
      "Diagnosis and treatment of eye conditions including cataract surgery, LASIK, glaucoma surgery, and retinal procedures.",
    image: "/images/ophthalmology.jpg",
    doctors: [
      {
        id: "doc-eye-1",
        name: "Dr. Neha Kapoor",
        specialization: "Ophthalmologist",
        experience: "14 Years",
        qualifications: "MBBS, MS (Ophthalmology)",
        hospital: "Vision Plus Eye Center",
        rating: 4.9,
        about:
          "Expert in phacoemulsification cataract surgery, LASIK refractive correction, and vitreoretinal surgery.",
        availability: "Mon - Fri | 10:00 AM - 5:00 PM",
      },
      {
        id: "doc-eye-2",
        name: "Dr. Sanjay Verma",
        specialization: "Eye Surgeon",
        experience: "19 Years",
        qualifications: "MBBS, DO, DNB (Ophthalmology)",
        hospital: "Clear Vision Hospital",
        rating: 4.8,
        about:
          "Specializes in glaucoma trabeculectomy, corneal transplant, and pediatric ophthalmology.",
        availability: "Tue - Sun | 9:00 AM - 6:00 PM",
      },
    ],
  },
  {
    id: "fertility",
    title: "Fertility",
    description:
      "Advanced treatments for infertility including IVF, IUI, ICSI, egg freezing, and ovarian stimulation.",
    image: "/images/fertility.jpg",
    doctors: [
      {
        id: "doc-fer-1",
        name: "Dr. Ritu Malhotra",
        specialization: "Fertility Specialist",
        experience: "19 Years",
        qualifications: "MBBS, MD, Fellowship in IVF",
        hospital: "Hope Fertility Center",
        rating: 4.8,
        about:
          "Specializes in in-vitro fertilization (IVF), intracytoplasmic sperm injection (ICSI), and embryo transfer.",
        availability: "Mon - Sat | 9:30 AM - 4:30 PM",
      },
      {
        id: "doc-fer-2",
        name: "Dr. Vivek Agarwal",
        specialization: "Reproductive Endocrinologist",
        experience: "15 Years",
        qualifications: "MBBS, MS, Fellowship in Reproductive Medicine",
        hospital: "Bloom IVF Clinic",
        rating: 4.7,
        about:
          "Expert in intrauterine insemination (IUI), fertility preservation, and male infertility treatments.",
        availability: "Mon - Fri | 10:00 AM - 6:00 PM",
      },
    ],
  },
  {
    id: "weight-loss",
    title: "Weight Loss",
    description:
      "Advanced bariatric procedures including gastric sleeve, Roux-en-Y gastric bypass, and gastric balloon placement.",
    image: "/images/weightloss.jpg",
    doctors: [
      {
        id: "doc-wl-1",
        name: "Dr. Sameer Joshi",
        specialization: "Bariatric Surgeon",
        experience: "11 Years",
        qualifications: "MBBS, MS (Bariatric Surgery)",
        hospital: "FitLife Hospital",
        rating: 4.7,
        about:
          "Expert in sleeve gastrectomy, gastric bypass, and revisional bariatric surgery.",
        availability: "Mon - Fri | 10:00 AM - 6:00 PM",
      },
      {
        id: "doc-wl-2",
        name: "Dr. Lakshmi Nair",
        specialization: "Bariatric & Metabolic Surgeon",
        experience: "14 Years",
        qualifications: "MBBS, MS, Fellowship in Bariatrics",
        hospital: "Weight Wellness Center",
        rating: 4.8,
        about:
          "Specializes in minimally invasive gastric sleeve and adjustable gastric banding.",
        availability: "Mon - Sat | 9:00 AM - 5:00 PM",
      },
    ],
  },
  {
    id: "dermatology",
    title: "Dermatology",
    description:
      "Surgical and cosmetic treatment for skin conditions including mole removal, acne scar revision, skin cancer excision, and laser therapy.",
    image: "/images/dermatology.jpg",
    doctors: [
      {
        id: "doc-derm-1",
        name: "Dr. Ayesha Khan",
        specialization: "Dermatologist",
        experience: "10 Years",
        qualifications: "MBBS, MD (Dermatology)",
        hospital: "SkinCare Clinic",
        rating: 4.6,
        about:
          "Specialist in Mohs surgery for skin cancer, chemical peels, and laser treatments for pigmentation.",
        availability: "Mon - Sat | 11:00 AM - 6:00 PM",
      },
      {
        id: "doc-derm-2",
        name: "Dr. Rajiv Bhatia",
        specialization: "Dermatosurgeon",
        experience: "16 Years",
        qualifications: "MBBS, DDVL, Fellowship in Cosmetic Dermatology",
        hospital: "Derma Glow Hospital",
        rating: 4.8,
        about:
          "Expert in cryosurgery, excision biopsies, and acne scar treatments using dermabrasion.",
        availability: "Tue - Sun | 10:00 AM - 7:00 PM",
      },
    ],
  },
];
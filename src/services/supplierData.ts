export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number; // in INR (₹)
  unit: string; // e.g. "kg", "ton", "piece", "box", "meter"
  quantityAvailable: number;
  qualityGrade: 'Premium' | 'Grade A' | 'Standard' | 'High Grade' | 'Superfine';
  location: string;
  businessName: string;
  contactNumber: string;
  availability: string; // e.g., "Immediate", "Within 2 days"
  businessHours: string;
}

export interface Supplier {
  id: string;
  businessName: string;
  rating: number; // e.g. 4.8
  trustScore: number; // e.g. 96 (%)
  location: string;
  contactNumber: string;
  businessHours: string;
  products: Product[];
}

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: "00000000-0000-0000-0001-000000000001",
    businessName: "Ganesh Enterprises",
    rating: 4.1,
    trustScore: 86,
    location: "Vijayawada, Andhra Pradesh",
    contactNumber: "+91 90001 88001",
    businessHours: "09:00 AM - 06:00 PM",
    products: [
      {
        id: "00000000-0000-0000-0002-000000000001",
        name: "Bulk Superfine Basmati Rice",
        category: "Rice",
        description: "1121 long grain aged basmati rice, perfect for biryanis and fine dining.",
        price: 90,
        unit: "kg",
        quantityAvailable: 613,
        qualityGrade: "Superfine",
        location: "Vijayawada, Andhra Pradesh",
        businessName: "Ganesh Enterprises",
        contactNumber: "+91 90001 88001",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      },
      {
        id: "00000000-0000-0000-0002-000000000002",
        name: "Sona Masoori Rice",
        category: "Rice",
        description: "Aged Sona Masoori raw rice, low moisture, direct from mills.",
        price: 55,
        unit: "kg",
        quantityAvailable: 726,
        qualityGrade: "Premium",
        location: "Vijayawada, Andhra Pradesh",
        businessName: "Ganesh Enterprises",
        contactNumber: "+91 90001 88001",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      }
    ]
  },
  {
    id: "00000000-0000-0000-0001-000000000002",
    businessName: "Rahul Traders",
    rating: 4.2,
    trustScore: 87,
    location: "Visakhapatnam, Andhra Pradesh",
    contactNumber: "+91 90002 88002",
    businessHours: "09:00 AM - 06:00 PM",
    products: [
      {
        id: "00000000-0000-0000-0002-000000000005",
        name: "Bulk Premium Shankar-6 Cotton",
        category: "Cotton",
        description: "High staple length combed cotton fiber, suitable for fine spinning.",
        price: 170,
        unit: "kg",
        quantityAvailable: 1065,
        qualityGrade: "Premium",
        location: "Visakhapatnam, Andhra Pradesh",
        businessName: "Rahul Traders",
        contactNumber: "+91 90002 88002",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      },
      {
        id: "00000000-0000-0000-0002-000000000006",
        name: "Bulk Combed Cotton Bales",
        category: "Cotton",
        description: "Standard 170kg compressed cotton bales, organic certified.",
        price: 31900,
        unit: "bale",
        quantityAvailable: 1178,
        qualityGrade: "Premium",
        location: "Visakhapatnam, Andhra Pradesh",
        businessName: "Rahul Traders",
        contactNumber: "+91 90002 88002",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      }
    ]
  },
  {
    id: "00000000-0000-0000-0001-000000000003",
    businessName: "Divya Corporation",
    rating: 4.3,
    trustScore: 88,
    location: "Chennai, Tamil Nadu",
    contactNumber: "+91 90003 88003",
    businessHours: "09:00 AM - 06:00 PM",
    products: [
      {
        id: "00000000-0000-0000-0002-000000000009",
        name: "Premium Structural Fe 550D TMT Rebars",
        category: "Steel",
        description: "High ductile steel bars for structural reinforcement, seismic-resistant.",
        price: 49700,
        unit: "ton",
        quantityAvailable: 1517,
        qualityGrade: "High Grade",
        location: "Chennai, Tamil Nadu",
        businessName: "Divya Corporation",
        contactNumber: "+91 90003 88003",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      },
      {
        id: "00000000-0000-0000-0002-00000000000a",
        name: "Bulk Mild Steel Structural Pipes",
        category: "Steel",
        description: "Galvanized hollow circular pipes for structural frameworks.",
        price: 55,
        unit: "kg",
        quantityAvailable: 1630,
        qualityGrade: "Standard",
        location: "Chennai, Tamil Nadu",
        businessName: "Divya Corporation",
        contactNumber: "+91 90003 88003",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      }
    ]
  },
  {
    id: "00000000-0000-0000-0001-000000000004",
    businessName: "Sandhya Steel Mart",
    rating: 4.4,
    trustScore: 89,
    location: "Bengaluru, Karnataka",
    contactNumber: "+91 90004 88004",
    businessHours: "09:00 AM - 06:00 PM",
    products: [
      {
        id: "00000000-0000-0000-0002-00000000000d",
        name: "Premium Corrugated Shipping Cartons",
        category: "Packaging",
        description: "3-ply heavy-duty cardboard boxes, ideal for bulk shipping.",
        price: 20,
        unit: "piece",
        quantityAvailable: 1969,
        qualityGrade: "Standard",
        location: "Bengaluru, Karnataka",
        businessName: "Sandhya Steel Mart",
        contactNumber: "+91 90004 88004",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      },
      {
        id: "00000000-0000-0000-0002-00000000000e",
        name: "Premium Cushion Bubble Wrap Rolls",
        category: "Packaging",
        description: "Industrial strength bubble wrap rolls for safety wrapping.",
        price: 660,
        unit: "roll",
        quantityAvailable: 2082,
        qualityGrade: "Premium",
        location: "Bengaluru, Karnataka",
        businessName: "Sandhya Steel Mart",
        contactNumber: "+91 90004 88004",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      }
    ]
  },
  {
    id: "00000000-0000-0000-0001-000000000005",
    businessName: "Bhargav Packaging Solutions",
    rating: 4.5,
    trustScore: 90,
    location: "Warangal, Telangana",
    contactNumber: "+91 90005 88005",
    businessHours: "09:00 AM - 06:00 PM",
    products: [
      {
        id: "00000000-0000-0000-0002-000000000011",
        name: "Ordinary Portland Cement OPC-53",
        category: "Cement",
        description: "Roofing and foundation grade high-strength OPC cement bag (50kg).",
        price: 380,
        unit: "bag",
        quantityAvailable: 2421,
        qualityGrade: "High Grade",
        location: "Warangal, Telangana",
        businessName: "Bhargav Packaging Solutions",
        contactNumber: "+91 90005 88005",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      },
      {
        id: "00000000-0000-0000-0002-000000000012",
        name: "Premium Portland Pozzolana Cement PPC",
        category: "Cement",
        description: "Fly-ash based PPC cement, excellent durability and crack resistance.",
        price: 365,
        unit: "bag",
        quantityAvailable: 2534,
        qualityGrade: "Premium",
        location: "Warangal, Telangana",
        businessName: "Bhargav Packaging Solutions",
        contactNumber: "+91 90005 88005",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      }
    ]
  },
  {
    id: "00000000-0000-0000-0001-000000000006",
    businessName: "Nikhil Agro Products",
    rating: 4.6,
    trustScore: 91,
    location: "Mumbai, Maharashtra",
    contactNumber: "+91 90006 88006",
    businessHours: "09:00 AM - 06:00 PM",
    products: [
      {
        id: "00000000-0000-0000-0002-000000000015",
        name: "Bulk Teak Wood Planks",
        category: "Wood",
        description: "Seasoned Indian teak timber planks, moisture-treated for high quality furniture.",
        price: 3100,
        unit: "cubic-foot",
        quantityAvailable: 2873,
        qualityGrade: "Premium",
        location: "Mumbai, Maharashtra",
        businessName: "Nikhil Agro Products",
        contactNumber: "+91 90006 88006",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      },
      {
        id: "00000000-0000-0000-0002-000000000016",
        name: "Rosewood Lumber",
        category: "Wood",
        description: "Premium Indian Rosewood (Sisu) lumber, dark grain, kiln dried.",
        price: 4500,
        unit: "cubic-foot",
        quantityAvailable: 2986,
        qualityGrade: "Premium",
        location: "Mumbai, Maharashtra",
        businessName: "Nikhil Agro Products",
        contactNumber: "+91 90006 88006",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      }
    ]
  },
  {
    id: "00000000-0000-0000-0001-000000000007",
    businessName: "Vikram Logistics",
    rating: 4.7,
    trustScore: 92,
    location: "Pune, Maharashtra",
    contactNumber: "+91 90007 88007",
    businessHours: "09:00 AM - 06:00 PM",
    products: [
      {
        id: "00000000-0000-0000-0002-000000000019",
        name: "Bulk Microcontroller Boards Uno",
        category: "Electronics",
        description: "ATmega328P compatible prototyping boards for custom electronics.",
        price: 370,
        unit: "piece",
        quantityAvailable: 3325,
        qualityGrade: "High Grade",
        location: "Pune, Maharashtra",
        businessName: "Vikram Logistics",
        contactNumber: "+91 90007 88007",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      },
      {
        id: "00000000-0000-0000-0002-00000000001a",
        name: "Bulk Connector Jumper Cables Pack",
        category: "Electronics",
        description: "Breadboard hookup ribbon cable wires, male to female, 40 pins.",
        price: 80,
        unit: "pack",
        quantityAvailable: 3438,
        qualityGrade: "Standard",
        location: "Pune, Maharashtra",
        businessName: "Vikram Logistics",
        contactNumber: "+91 90007 88007",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      }
    ]
  },
  {
    id: "00000000-0000-0000-0001-000000000008",
    businessName: "Priya Tech Circuits",
    rating: 4.8,
    trustScore: 93,
    location: "Ahmedabad, Gujarat",
    contactNumber: "+91 90008 88008",
    businessHours: "09:00 AM - 06:00 PM",
    products: [
      {
        id: "00000000-0000-0000-0002-00000000001d",
        name: "Premium Premium Turmeric Powder",
        category: "Turmeric",
        description: "Pure organic turmeric powder with high curcumin content, direct from local farms.",
        price: 130,
        unit: "kg",
        quantityAvailable: 3777,
        qualityGrade: "Premium",
        location: "Ahmedabad, Gujarat",
        businessName: "Priya Tech Circuits",
        contactNumber: "+91 90008 88008",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      },
      {
        id: "00000000-0000-0000-0002-00000000001e",
        name: "Bulk Organic Turmeric Fingers",
        category: "Turmeric",
        description: "Sun-dried organic finger turmeric bulbs, high curcumin, unpolished.",
        price: 100,
        unit: "kg",
        quantityAvailable: 3890,
        qualityGrade: "Premium",
        location: "Ahmedabad, Gujarat",
        businessName: "Priya Tech Circuits",
        contactNumber: "+91 90008 88008",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      }
    ]
  },
  {
    id: "00000000-0000-0000-0001-000000000009",
    businessName: "Anil Supply Corp",
    rating: 4.9,
    trustScore: 94,
    location: "Coimbatore, Tamil Nadu",
    contactNumber: "+91 90009 88009",
    businessHours: "09:00 AM - 06:00 PM",
    products: [
      {
        id: "00000000-0000-0000-0002-000000000021",
        name: "Premium Superfine Basmati Rice",
        category: "Rice",
        description: "1121 long grain aged basmati rice, perfect for biryanis and fine dining.",
        price: 100,
        unit: "kg",
        quantityAvailable: 4229,
        qualityGrade: "Superfine",
        location: "Coimbatore, Tamil Nadu",
        businessName: "Anil Supply Corp",
        contactNumber: "+91 90009 88009",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      },
      {
        id: "00000000-0000-0000-0002-000000000022",
        name: "Premium Sona Masoori Rice",
        category: "Rice",
        description: "Aged Sona Masoori raw rice, low moisture, direct from mills.",
        price: 65,
        unit: "kg",
        quantityAvailable: 4342,
        qualityGrade: "Premium",
        location: "Coimbatore, Tamil Nadu",
        businessName: "Anil Supply Corp",
        contactNumber: "+91 90009 88009",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      }
    ]
  },
  {
    id: "00000000-0000-0000-0001-00000000000a",
    businessName: "Karan Industries",
    rating: 5.0,
    trustScore: 95,
    location: "Hyderabad, Telangana",
    contactNumber: "+91 90010 88010",
    businessHours: "09:00 AM - 06:00 PM",
    products: [
      {
        id: "00000000-0000-0000-0002-000000000025",
        name: "Premium Shankar-6 Cotton",
        category: "Cotton",
        description: "High staple length combed cotton fiber, suitable for fine spinning.",
        price: 180,
        unit: "kg",
        quantityAvailable: 4681,
        qualityGrade: "High Grade",
        location: "Hyderabad, Telangana",
        businessName: "Karan Industries",
        contactNumber: "+91 90010 88010",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      },
      {
        id: "00000000-0000-0000-0002-000000000026",
        name: "Premium Combed Cotton Bales",
        category: "Cotton",
        description: "Standard 170kg compressed cotton bales, organic certified.",
        price: 32100,
        unit: "bale",
        quantityAvailable: 4794,
        qualityGrade: "Premium",
        location: "Hyderabad, Telangana",
        businessName: "Karan Industries",
        contactNumber: "+91 90010 88010",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      }
    ]
  }
];

export const getStoredSuppliers = (): Supplier[] => {
  const stored = localStorage.getItem("supply_market_suppliers");
  if (!stored) {
    localStorage.setItem("supply_market_suppliers", JSON.stringify(INITIAL_SUPPLIERS));
    return INITIAL_SUPPLIERS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_SUPPLIERS;
  }
};

export const saveSuppliers = (suppliers: Supplier[]) => {
  localStorage.setItem("supply_market_suppliers", JSON.stringify(suppliers));
};

export const getAllProducts = (): Product[] => {
  const suppliers = getStoredSuppliers();
  const allProds: Product[] = [];
  suppliers.forEach(sup => {
    sup.products.forEach(p => {
      allProds.push({
        ...p,
        businessName: sup.businessName,
        rating: sup.rating,
        trustScore: sup.trustScore,
        contactNumber: sup.contactNumber,
        businessHours: sup.businessHours
      } as any);
    });
  });
  return allProds;
};

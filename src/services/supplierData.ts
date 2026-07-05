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
    id: "sup_1",
    businessName: "ABC Traders",
    rating: 4.8,
    trustScore: 97,
    location: "Vijayawada, Andhra Pradesh",
    contactNumber: "+91 98450 12345",
    businessHours: "09:00 AM - 07:00 PM",
    products: [
      {
        id: "prod_1_1",
        name: "Premium Turmeric Powder",
        category: "Turmeric",
        description: "Pure organic turmeric powder with high curcumin content, direct from local farms.",
        price: 120,
        unit: "kg",
        quantityAvailable: 8500,
        qualityGrade: "Premium",
        location: "Vijayawada, Andhra Pradesh",
        businessName: "ABC Traders",
        contactNumber: "+91 98450 12345",
        availability: "Immediate",
        businessHours: "09:00 AM - 07:00 PM"
      },
      {
        id: "prod_1_2",
        name: "Superfine Basmati Rice",
        category: "Rice",
        description: "1121 long grain aged basmati rice, perfect for biryanis and fine dining.",
        price: 95,
        unit: "kg",
        quantityAvailable: 12000,
        qualityGrade: "Superfine",
        location: "Vijayawada, Andhra Pradesh",
        businessName: "ABC Traders",
        contactNumber: "+91 98450 12345",
        availability: "Immediate",
        businessHours: "09:00 AM - 07:00 PM"
      }
    ]
  },
  {
    id: "sup_2",
    businessName: "Sri Lakshmi Enterprises",
    rating: 4.7,
    trustScore: 96,
    location: "Hyderabad, Telangana",
    contactNumber: "+91 94430 56789",
    businessHours: "08:00 AM - 08:00 PM",
    products: [
      {
        id: "prod_2_1",
        name: "Sona Masoori Rice",
        category: "Rice",
        description: "Aged Sona Masoori raw rice, low moisture, direct from mills.",
        price: 55,
        unit: "kg",
        quantityAvailable: 25000,
        qualityGrade: "Grade A",
        location: "Hyderabad, Telangana",
        businessName: "Sri Lakshmi Enterprises",
        contactNumber: "+91 94430 56789",
        availability: "Within 2 days",
        businessHours: "08:00 AM - 08:00 PM"
      },
      {
        id: "prod_2_2",
        name: "Premium Shankar-6 Cotton",
        category: "Cotton",
        description: "High staple length combed cotton fiber, suitable for fine spinning.",
        price: 180,
        unit: "kg",
        quantityAvailable: 15000,
        qualityGrade: "High Grade",
        location: "Hyderabad, Telangana",
        businessName: "Sri Lakshmi Enterprises",
        contactNumber: "+91 94430 56789",
        availability: "Immediate",
        businessHours: "08:00 AM - 08:00 PM"
      }
    ]
  },
  {
    id: "sup_3",
    businessName: "Green Harvest Suppliers",
    rating: 4.6,
    trustScore: 94,
    location: "Visakhapatnam, Andhra Pradesh",
    contactNumber: "+91 91234 98765",
    businessHours: "09:00 AM - 06:00 PM",
    products: [
      {
        id: "prod_3_1",
        name: "Organic Turmeric Fingers",
        category: "Turmeric",
        description: "Sun-dried organic finger turmeric bulbs, high curcumin, unpolished.",
        price: 110,
        unit: "kg",
        quantityAvailable: 9000,
        qualityGrade: "Premium",
        location: "Visakhapatnam, Andhra Pradesh",
        businessName: "Green Harvest Suppliers",
        contactNumber: "+91 91234 98765",
        availability: "Within 2 days",
        businessHours: "09:00 AM - 06:00 PM"
      },
      {
        id: "prod_3_2",
        name: "Combed Cotton bales",
        category: "Cotton",
        description: "Standard 170kg compressed cotton bales, organic certified.",
        price: 32000,
        unit: "bale",
        quantityAvailable: 400,
        qualityGrade: "Grade A",
        location: "Visakhapatnam, Andhra Pradesh",
        businessName: "Green Harvest Suppliers",
        contactNumber: "+91 91234 98765",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      }
    ]
  },
  {
    id: "sup_4",
    businessName: "RK Steel Mart",
    rating: 4.9,
    trustScore: 98,
    location: "Chennai, Tamil Nadu",
    contactNumber: "+91 98111 55566",
    businessHours: "09:30 AM - 06:30 PM",
    products: [
      {
        id: "prod_4_1",
        name: "Structural Fe 550D TMT Rebars",
        category: "Steel",
        description: "High ductile steel bars for structural reinforcement, seismic-resistant.",
        price: 49500,
        unit: "ton",
        quantityAvailable: 150,
        qualityGrade: "High Grade",
        location: "Chennai, Tamil Nadu",
        businessName: "RK Steel Mart",
        contactNumber: "+91 98111 55566",
        availability: "Immediate",
        businessHours: "09:30 AM - 06:30 PM"
      },
      {
        id: "prod_4_2",
        name: "Mild Steel Structural Pipes",
        category: "Steel",
        description: "Galvanized hollow circular pipes for structural frameworks.",
        price: 65,
        unit: "kg",
        quantityAvailable: 8000,
        qualityGrade: "Standard",
        location: "Chennai, Tamil Nadu",
        businessName: "RK Steel Mart",
        contactNumber: "+91 98111 55566",
        availability: "Immediate",
        businessHours: "09:30 AM - 06:30 PM"
      }
    ]
  },
  {
    id: "sup_5",
    businessName: "Sai Packaging",
    rating: 4.5,
    trustScore: 92,
    location: "Bengaluru, Karnataka",
    contactNumber: "+91 93456 11223",
    businessHours: "09:00 AM - 08:00 PM",
    products: [
      {
        id: "prod_5_1",
        name: "Corrugated Shipping Cartons",
        category: "Packaging",
        description: "3-ply heavy-duty cardboard boxes, ideal for bulk shipping.",
        price: 15,
        unit: "piece",
        quantityAvailable: 45000,
        qualityGrade: "Standard",
        location: "Bengaluru, Karnataka",
        businessName: "Sai Packaging",
        contactNumber: "+91 93456 11223",
        availability: "Immediate",
        businessHours: "09:00 AM - 08:00 PM"
      },
      {
        id: "prod_5_2",
        name: "Cushion Bubble Wrap Rolls",
        category: "Packaging",
        description: "Industrial strength bubble wrap rolls for safety wrapping.",
        price: 650,
        unit: "roll",
        quantityAvailable: 250,
        qualityGrade: "Premium",
        location: "Bengaluru, Karnataka",
        businessName: "Sai Packaging",
        contactNumber: "+91 93456 11223",
        availability: "Within 2 days",
        businessHours: "09:00 AM - 08:00 PM"
      }
    ]
  },
  {
    id: "sup_6",
    businessName: "Warangal Cement Agency",
    rating: 4.6,
    trustScore: 93,
    location: "Warangal, Telangana",
    contactNumber: "+91 97555 88990",
    businessHours: "08:00 AM - 07:00 PM",
    products: [
      {
        id: "prod_6_1",
        name: "Ordinary Portland Cement OPC-53",
        category: "Cement",
        description: "Roofing and foundation grade high-strength OPC cement bag.",
        price: 380,
        unit: "bag", // 50kg bag
        quantityAvailable: 15000,
        qualityGrade: "High Grade",
        location: "Warangal, Telangana",
        businessName: "Warangal Cement Agency",
        contactNumber: "+91 97555 88990",
        availability: "Immediate",
        businessHours: "08:00 AM - 07:00 PM"
      }
    ]
  },
  {
    id: "sup_7",
    businessName: "Mysore Teakwood Corp",
    rating: 4.8,
    trustScore: 96,
    location: "Bengaluru, Karnataka",
    contactNumber: "+91 99888 77665",
    businessHours: "10:00 AM - 06:00 PM",
    products: [
      {
        id: "prod_7_1",
        name: "Teak Wood Planks",
        category: "Wood",
        description: "Seasoned Indian teak timber planks, moisture-treated for high quality furniture.",
        price: 3200,
        unit: "cubic-foot",
        quantityAvailable: 600,
        qualityGrade: "Premium",
        location: "Bengaluru, Karnataka",
        businessName: "Mysore Teakwood Corp",
        contactNumber: "+91 99888 77665",
        availability: "Within 2 days",
        businessHours: "10:00 AM - 06:00 PM"
      }
    ]
  },
  {
    id: "sup_8",
    businessName: "Warangal Tech Circuits",
    rating: 4.7,
    trustScore: 95,
    location: "Warangal, Telangana",
    contactNumber: "+91 99111 22334",
    businessHours: "09:00 AM - 06:00 PM",
    products: [
      {
        id: "prod_8_1",
        name: "Microcontroller Boards Uno",
        category: "Electronics",
        description: "ATmega328P compatible prototyping boards for custom electronics.",
        price: 380,
        unit: "piece",
        quantityAvailable: 12000,
        qualityGrade: "High Grade",
        location: "Warangal, Telangana",
        businessName: "Warangal Tech Circuits",
        contactNumber: "+91 99111 22334",
        availability: "Immediate",
        businessHours: "09:00 AM - 06:00 PM"
      },
      {
        id: "prod_8_2",
        name: "Connector Jumper Cables",
        category: "Electronics",
        description: "Breadboard hookup ribbon cable wires, male to female.",
        price: 85,
        unit: "pack",
        quantityAvailable: 25000,
        qualityGrade: "Standard",
        location: "Warangal, Telangana",
        businessName: "Warangal Tech Circuits",
        contactNumber: "+91 99111 22334",
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

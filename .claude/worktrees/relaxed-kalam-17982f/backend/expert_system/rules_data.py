"""
Static knowledge base — 25 expert IF-THEN rules for agriculture.
These rules are seeded into MongoDB on first startup.

Rule structure:
  conditions: { soilType, weather, season }   ← IF part
  output:     { crop, fertilizer, pestControl,
                waterRequirement, expectedYield,
                tips, confidence }             ← THEN part
"""

EXPERT_RULES = [
    # ── Rule 1 ──
    {
        "rule_id": 1,
        "conditions": {"soilType": "sandy", "weather": "hot", "season": "kharif"},
        "output": {
            "crop": "Pearl Millet (Bajra)",
            "cropEmoji": "🌾",
            "fertilizer": "Urea 100 kg/acre + DAP 50 kg/acre",
            "pestControl": "Neem-based spray for downy mildew prevention",
            "waterRequirement": "Low – 400-500 mm per season",
            "expectedYield": "1.5 – 2.5 tons/hectare",
            "tips": "Ideal for arid regions. Plant at 45 cm x 15 cm spacing.",
            "confidence": 95,
        },
    },
    # ── Rule 2 ──
    {
        "rule_id": 2,
        "conditions": {"soilType": "sandy", "weather": "dry", "season": "rabi"},
        "output": {
            "crop": "Wheat",
            "cropEmoji": "🌿",
            "fertilizer": "DAP 50 kg/acre at sowing + Urea split dose",
            "pestControl": "Propiconazole spray for rust prevention",
            "waterRequirement": "Moderate – 450-650 mm",
            "expectedYield": "3 – 5 tons/hectare",
            "tips": "Sow in October-November. Timely irrigation at crown-root stage is critical.",
            "confidence": 88,
        },
    },
    # ── Rule 3 ──
    {
        "rule_id": 3,
        "conditions": {"soilType": "clay", "weather": "humid", "season": "kharif"},
        "output": {
            "crop": "Rice (Paddy)",
            "cropEmoji": "🍚",
            "fertilizer": "Nitrogen 120 kg/ha + Potash 60 kg/ha",
            "pestControl": "Carbofuran granules for stem borer; Tricyclazole for blast",
            "waterRequirement": "High – 1200-1500 mm",
            "expectedYield": "4 – 6 tons/hectare",
            "tips": "Maintain 5 cm standing water during tillering stage.",
            "confidence": 97,
        },
    },
    # ── Rule 4 ──
    {
        "rule_id": 4,
        "conditions": {"soilType": "clay", "weather": "rainy", "season": "kharif"},
        "output": {
            "crop": "Rice (Paddy)",
            "cropEmoji": "🍚",
            "fertilizer": "Nitrogen 100 kg/ha + Potassium 40 kg/ha",
            "pestControl": "Fungicide spray for leaf blast; BPH management",
            "waterRequirement": "High – rain-fed conditions suitable",
            "expectedYield": "3.5 – 5.5 tons/hectare",
            "tips": "Use short-duration varieties in rainfed areas.",
            "confidence": 93,
        },
    },
    # ── Rule 5 ──
    {
        "rule_id": 5,
        "conditions": {"soilType": "loamy", "weather": "hot", "season": "kharif"},
        "output": {
            "crop": "Cotton",
            "cropEmoji": "🌸",
            "fertilizer": "NPK 80:40:40 kg/ha + micronutrients",
            "pestControl": "Bollworm pheromone traps + Spinosad spray",
            "waterRequirement": "Moderate – 700-1000 mm",
            "expectedYield": "2 – 3 tons/hectare (seed cotton)",
            "tips": "Maintain proper plant population; use Bt cotton hybrids.",
            "confidence": 91,
        },
    },
    # ── Rule 6 ──
    {
        "rule_id": 6,
        "conditions": {"soilType": "loamy", "weather": "humid", "season": "rabi"},
        "output": {
            "crop": "Wheat",
            "cropEmoji": "🌿",
            "fertilizer": "DAP 75 kg/acre + Urea top-dress at tillering",
            "pestControl": "Herbicide (Isoproturon) for weed control",
            "waterRequirement": "Moderate – 4-5 irrigations",
            "expectedYield": "4 – 6 tons/hectare",
            "tips": "Loamy soil gives best wheat yield. Avoid waterlogging.",
            "confidence": 94,
        },
    },
    # ── Rule 7 ──
    {
        "rule_id": 7,
        "conditions": {"soilType": "loamy", "weather": "rainy", "season": "kharif"},
        "output": {
            "crop": "Maize (Corn)",
            "cropEmoji": "🌽",
            "fertilizer": "Urea 150 kg/ha split in 3 doses + DAP basal",
            "pestControl": "Fall Armyworm: Emamectin benzoate spray",
            "waterRequirement": "Moderate – 500-800 mm",
            "expectedYield": "5 – 8 tons/hectare",
            "tips": "Ridge and furrow planting improves drainage in rainy season.",
            "confidence": 89,
        },
    },
    # ── Rule 8 ──
    {
        "rule_id": 8,
        "conditions": {"soilType": "black", "weather": "hot", "season": "kharif"},
        "output": {
            "crop": "Soybean",
            "cropEmoji": "🫘",
            "fertilizer": "Phosphorus 80 kg/ha + Rhizobium seed treatment",
            "pestControl": "Thiamethoxam seed treatment for aphids; fungicide for rust",
            "waterRequirement": "Moderate – 450-700 mm",
            "expectedYield": "1.5 – 2.5 tons/hectare",
            "tips": "Black (regur) soil retains moisture well. Avoid over-irrigation.",
            "confidence": 90,
        },
    },
    # ── Rule 9 ──
    {
        "rule_id": 9,
        "conditions": {"soilType": "black", "weather": "rainy", "season": "kharif"},
        "output": {
            "crop": "Cotton",
            "cropEmoji": "🌸",
            "fertilizer": "NPK 100:50:50 kg/ha; FYM 10 tons/ha",
            "pestControl": "Bollworm pheromone traps + Chlorpyrifos spray",
            "waterRequirement": "Moderate – rain-fed suitable in black soil",
            "expectedYield": "2.5 – 3.5 tons/hectare",
            "tips": "Black soil water-holding capacity reduces irrigation needs.",
            "confidence": 92,
        },
    },
    # ── Rule 10 ──
    {
        "rule_id": 10,
        "conditions": {"soilType": "silt", "weather": "humid", "season": "rabi"},
        "output": {
            "crop": "Mustard",
            "cropEmoji": "🌻",
            "fertilizer": "Potash 40 kg/ha + Sulphur 20 kg/ha",
            "pestControl": "Aphid control: Dimethoate 0.03% spray",
            "waterRequirement": "Low – 2-3 irrigations",
            "expectedYield": "1.2 – 1.8 tons/hectare",
            "tips": "Sow in October. Flower drop reduces yield—avoid excess irrigation.",
            "confidence": 86,
        },
    },
    # ── Rule 11 ──
    {
        "rule_id": 11,
        "conditions": {"soilType": "sandy", "weather": "rainy", "season": "kharif"},
        "output": {
            "crop": "Groundnut (Peanut)",
            "cropEmoji": "🥜",
            "fertilizer": "Gypsum 200 kg/ha + DAP 50 kg/ha basal",
            "pestControl": "Thiram seed treatment; Mancozeb for tikka disease",
            "waterRequirement": "Moderate – 500-600 mm",
            "expectedYield": "1.5 – 2.5 tons/hectare",
            "tips": "Sandy loam soil is ideal. Earth up after 30 days for pegging.",
            "confidence": 87,
        },
    },
    # ── Rule 12 ──
    {
        "rule_id": 12,
        "conditions": {"soilType": "clay", "weather": "dry", "season": "rabi"},
        "output": {
            "crop": "Barley",
            "cropEmoji": "🌾",
            "fertilizer": "DAP 40 kg/acre + Urea 25 kg/acre",
            "pestControl": "Fungicide spray for smut and powdery mildew",
            "waterRequirement": "Low – 2 irrigations sufficient",
            "expectedYield": "2.5 – 4 tons/hectare",
            "tips": "Barley tolerates drought and saline conditions better than wheat.",
            "confidence": 85,
        },
    },
    # ── Rule 13 ──
    {
        "rule_id": 13,
        "conditions": {"soilType": "loamy", "weather": "cool", "season": "rabi"},
        "output": {
            "crop": "Potato",
            "cropEmoji": "🥔",
            "fertilizer": "NPK 120:80:100 kg/ha + FYM 20 tons/ha",
            "pestControl": "Mancozeb for late blight; Imidacloprid for aphids",
            "waterRequirement": "High – frequent irrigation at 7-10 day intervals",
            "expectedYield": "20 – 30 tons/hectare",
            "tips": "Earth up 30-35 days after planting. Harvest before skin hardens.",
            "confidence": 93,
        },
    },
    # ── Rule 14 ──
    {
        "rule_id": 14,
        "conditions": {"soilType": "black", "weather": "humid", "season": "rabi"},
        "output": {
            "crop": "Chickpea (Gram)",
            "cropEmoji": "🫘",
            "fertilizer": "Phosphorus 60 kg/ha + Rhizobium inoculant",
            "pestControl": "Pod borer: Chlorpyrifos + cypermethrin spray",
            "waterRequirement": "Low – 1-2 irrigations only",
            "expectedYield": "1 – 1.8 tons/hectare",
            "tips": "Chickpea fixes atmospheric nitrogen—benefits next crop.",
            "confidence": 88,
        },
    },
    # ── Rule 15 ──
    {
        "rule_id": 15,
        "conditions": {"soilType": "silt", "weather": "hot", "season": "kharif"},
        "output": {
            "crop": "Sugarcane",
            "cropEmoji": "🎋",
            "fertilizer": "Nitrogen 250 kg/ha split 5 times + K2O 120 kg/ha",
            "pestControl": "Pyrilla: Parasitoid release; Borers: Furadan granules",
            "waterRequirement": "Very High – 1500-2500 mm",
            "expectedYield": "70 – 100 tons/hectare",
            "tips": "18-month crop. Ratoon crop reduces cost by 40%.",
            "confidence": 91,
        },
    },
    # ── Rule 16 ──
    {
        "rule_id": 16,
        "conditions": {"soilType": "sandy", "weather": "cool", "season": "zaid"},
        "output": {
            "crop": "Watermelon",
            "cropEmoji": "🍉",
            "fertilizer": "NPK 80:60:60 kg/ha + boron spray at flowering",
            "pestControl": "Aphid: Yellow sticky traps + neem oil spray",
            "waterRequirement": "Moderate – drip irrigation preferred",
            "expectedYield": "25 – 40 tons/hectare",
            "tips": "Sandy soil ensures good drainage essential for vine crops.",
            "confidence": 84,
        },
    },
    # ── Rule 17 ──
    {
        "rule_id": 17,
        "conditions": {"soilType": "clay", "weather": "cool", "season": "zaid"},
        "output": {
            "crop": "Cucumber",
            "cropEmoji": "🥒",
            "fertilizer": "DAP 50 kg/acre + Potash 30 kg/acre",
            "pestControl": "Red spider mite: Abamectin; Downy mildew: Ridomil",
            "waterRequirement": "Moderate – 400-500 mm",
            "expectedYield": "15 – 20 tons/hectare",
            "tips": "Use trellis for climbing; harvest frequently for more fruit set.",
            "confidence": 82,
        },
    },
    # ── Rule 18 ──
    {
        "rule_id": 18,
        "conditions": {"soilType": "loamy", "weather": "dry", "season": "zaid"},
        "output": {
            "crop": "Sunflower",
            "cropEmoji": "🌻",
            "fertilizer": "NPK 90:60:30 kg/ha + boron 1 kg/ha",
            "pestControl": "Whitefly: Yellow sticky traps; Alternaria blight: fungicide",
            "waterRequirement": "Low to Moderate – 500-700 mm",
            "expectedYield": "1.5 – 2 tons/hectare (seeds)",
            "tips": "Hand pollination in morning improves seed setting by 20%.",
            "confidence": 86,
        },
    },
    # ── Rule 19 ──
    {
        "rule_id": 19,
        "conditions": {"soilType": "black", "weather": "dry", "season": "rabi"},
        "output": {
            "crop": "Sorghum (Jowar)",
            "cropEmoji": "🌾",
            "fertilizer": "Urea 80 kg/ha basal + 40 kg/ha top dress",
            "pestControl": "Stem borer: Endosulfan spray; Shoot fly: Carbofuran",
            "waterRequirement": "Low – tolerates dry spells",
            "expectedYield": "2 – 4 tons/hectare",
            "tips": "Black soil retains residual moisture ideal for rainy-season Jowar.",
            "confidence": 87,
        },
    },
    # ── Rule 20 ──
    {
        "rule_id": 20,
        "conditions": {"soilType": "silt", "weather": "rainy", "season": "kharif"},
        "output": {
            "crop": "Jute",
            "cropEmoji": "🌿",
            "fertilizer": "Nitrogen 60 kg/ha + Phosphorus 30 kg/ha",
            "pestControl": "Fungicide for stem rot (Cercospora); Semilooper: Endosulfan",
            "waterRequirement": "High – 1000-1200 mm; tolerates flooding",
            "expectedYield": "2 – 3 tons/hectare (dry fibre)",
            "tips": "Harvest at 50% flowering for best fibre quality. Ret in water.",
            "confidence": 83,
        },
    },
    # ── Rule 21 ──
    {
        "rule_id": 21,
        "conditions": {"soilType": "sandy", "weather": "humid", "season": "rabi"},
        "output": {
            "crop": "Onion",
            "cropEmoji": "🧅",
            "fertilizer": "Potash 100 kg/ha + Sulphur 30 kg/ha",
            "pestControl": "Thrips: Blue sticky traps + Spinosad; Purple blotch: Mancozeb",
            "waterRequirement": "Moderate – stop irrigation 10 days before harvest",
            "expectedYield": "15 – 25 tons/hectare",
            "tips": "Sandy soil prevents bulb rot. Proper curing extends shelf life.",
            "confidence": 89,
        },
    },
    # ── Rule 22 ──
    {
        "rule_id": 22,
        "conditions": {"soilType": "clay", "weather": "hot", "season": "zaid"},
        "output": {
            "crop": "Brinjal (Eggplant)",
            "cropEmoji": "🍆",
            "fertilizer": "NPK 100:60:60 kg/ha + micronutrient mix",
            "pestControl": "Shoot & fruit borer: Spinosad; Bacterial wilt: Copper fungicide",
            "waterRequirement": "Moderate – regular irrigation every 5-7 days",
            "expectedYield": "20 – 35 tons/hectare",
            "tips": "Use grafted seedlings on resistant rootstock for wilt management.",
            "confidence": 85,
        },
    },
    # ── Rule 23 ──
    {
        "rule_id": 23,
        "conditions": {"soilType": "loamy", "weather": "hot", "season": "zaid"},
        "output": {
            "crop": "Tomato",
            "cropEmoji": "🍅",
            "fertilizer": "NPK 120:80:80 kg/ha + micronutrient foliar spray",
            "pestControl": "Leaf curl virus: Imidacloprid (vector); Early blight: Mancozeb",
            "waterRequirement": "Moderate – drip irrigation 4-5 L/plant/day",
            "expectedYield": "25 – 50 tons/hectare",
            "tips": "Stake plants. Remove suckers weekly for better fruit size.",
            "confidence": 92,
        },
    },
    # ── Rule 24 ──
    {
        "rule_id": 24,
        "conditions": {"soilType": "black", "weather": "cool", "season": "zaid"},
        "output": {
            "crop": "Sweet Sorghum (Jowar)",
            "cropEmoji": "🌾",
            "fertilizer": "Urea 60 kg/ha + K2O 30 kg/ha",
            "pestControl": "Aphid colony: Dimethoate spray; Stem fly: Seed treatment",
            "waterRequirement": "Low – 1-2 irrigations in cool season",
            "expectedYield": "2.5 – 3.5 tons/hectare",
            "tips": "Sweet sorghum can be used as biofuel feedstock additionally.",
            "confidence": 80,
        },
    },
    # ── Rule 25 ──
    {
        "rule_id": 25,
        "conditions": {"soilType": "silt", "weather": "dry", "season": "rabi"},
        "output": {
            "crop": "Lentil (Masoor)",
            "cropEmoji": "🫘",
            "fertilizer": "Phosphorus 40 kg/ha + Zinc 25 kg/ha",
            "pestControl": "Aphid: Neem oil 0.5%; Rust: Mancozeb 75WP spray",
            "waterRequirement": "Low – 1-2 irrigations; sensitive to waterlogging",
            "expectedYield": "0.8 – 1.5 tons/hectare",
            "tips": "Short-duration variety (60-70 days). Excellent protein source.",
            "confidence": 82,
        },
    },
]

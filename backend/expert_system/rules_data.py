"""
Static knowledge base — 75 expert IF-THEN rules for agriculture.
Covers ALL 75 combinations: 5 soils × 5 weathers × 3 seasons.
These rules are seeded into MongoDB on first startup.

Rule structure:
  conditions: { soilType, weather, season }   ← IF part
  output:     { crop, fertilizer, pestControl,
                waterRequirement, expectedYield,
                tips, confidence }             ← THEN part
"""

EXPERT_RULES = [
    # ══════════════════════════════════════════════════════════════════════════
    # SANDY SOIL  (5 weathers × 3 seasons = 15 rules)
    # ══════════════════════════════════════════════════════════════════════════

    # ── Rule 1 ── sandy | hot | kharif
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
    # ── Rule 2 ── sandy | dry | rabi
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
    # ── Rule 3 ── sandy | humid | rabi
    {
        "rule_id": 3,
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
    # ── Rule 4 ── sandy | rainy | kharif
    {
        "rule_id": 4,
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
    # ── Rule 5 ── sandy | cool | zaid
    {
        "rule_id": 5,
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
    # ── Rule 6 ── sandy | hot | rabi
    {
        "rule_id": 6,
        "conditions": {"soilType": "sandy", "weather": "hot", "season": "rabi"},
        "output": {
            "crop": "Chickpea (Gram)",
            "cropEmoji": "🫘",
            "fertilizer": "Phosphorus 60 kg/ha + Rhizobium inoculant + Zinc 25 kg/ha",
            "pestControl": "Pod borer: Bt spray + Chlorpyrifos; wilt: Trichoderma soil drench",
            "waterRequirement": "Low – 2-3 protective irrigations",
            "expectedYield": "0.8 – 1.5 tons/hectare",
            "tips": "Chickpea tolerates hot dry conditions; sandy soil ensures good drainage preventing root rot.",
            "confidence": 83,
        },
    },
    # ── Rule 7 ── sandy | hot | zaid
    {
        "rule_id": 7,
        "conditions": {"soilType": "sandy", "weather": "hot", "season": "zaid"},
        "output": {
            "crop": "Muskmelon (Kharbooja)",
            "cropEmoji": "🍈",
            "fertilizer": "NPK 80:60:80 kg/ha + boron 1 kg/ha at flowering",
            "pestControl": "Fruit fly: pheromone traps; Red spider mite: Abamectin spray",
            "waterRequirement": "Moderate – drip irrigation; reduce before harvest for sweetness",
            "expectedYield": "15 – 25 tons/hectare",
            "tips": "Sandy soil warms quickly, accelerating fruit development. Stop irrigation 10-15 days before harvest.",
            "confidence": 88,
        },
    },
    # ── Rule 8 ── sandy | dry | kharif
    {
        "rule_id": 8,
        "conditions": {"soilType": "sandy", "weather": "dry", "season": "kharif"},
        "output": {
            "crop": "Pearl Millet (Bajra)",
            "cropEmoji": "🌾",
            "fertilizer": "Urea 80 kg/ha + DAP 40 kg/ha basal",
            "pestControl": "Downy mildew: Metalaxyl seed treatment; ergot: roguing infected panicles",
            "waterRequirement": "Very Low – 350-450 mm; most drought-tolerant cereal",
            "expectedYield": "1.0 – 2.0 tons/hectare",
            "tips": "Bajra is the king of arid kharif. Grow in 45×15 cm spacing; harvest when grain hard.",
            "confidence": 92,
        },
    },
    # ── Rule 9 ── sandy | dry | zaid
    {
        "rule_id": 9,
        "conditions": {"soilType": "sandy", "weather": "dry", "season": "zaid"},
        "output": {
            "crop": "Sesame (Til)",
            "cropEmoji": "🌿",
            "fertilizer": "NPK 30:30:30 kg/ha; avoid excess nitrogen",
            "pestControl": "Leaf roller: Malathion 50EC spray; phyllody: leafhopper control with Imidacloprid",
            "waterRequirement": "Low – 4-5 light irrigations; avoid waterlogging",
            "expectedYield": "0.5 – 0.9 tons/hectare",
            "tips": "Sandy soil + dry summer = ideal sesame. Harvest early morning to prevent capsule shattering.",
            "confidence": 85,
        },
    },
    # ── Rule 10 ── sandy | humid | kharif
    {
        "rule_id": 10,
        "conditions": {"soilType": "sandy", "weather": "humid", "season": "kharif"},
        "output": {
            "crop": "Cowpea (Lobia)",
            "cropEmoji": "🫘",
            "fertilizer": "Phosphorus 40 kg/ha + Rhizobium inoculant; minimal N as legume fixes N",
            "pestControl": "Pod borer: neem oil 0.5% spray; aphids: Imidacloprid seed treatment",
            "waterRequirement": "Moderate – 500-600 mm",
            "expectedYield": "0.8 – 1.5 tons/hectare",
            "tips": "Sandy soil prevents waterlogging common in humid conditions. Cowpea improves soil nitrogen for next crop.",
            "confidence": 82,
        },
    },
    # ── Rule 11 ── sandy | humid | zaid
    {
        "rule_id": 11,
        "conditions": {"soilType": "sandy", "weather": "humid", "season": "zaid"},
        "output": {
            "crop": "Bitter Gourd (Karela)",
            "cropEmoji": "🥒",
            "fertilizer": "NPK 80:60:60 kg/ha + FYM 10 t/ha",
            "pestControl": "Fruit fly: neem spray + bait traps; mosaic virus: aphid control with neem",
            "waterRequirement": "Moderate – furrow/drip irrigation every 5-7 days",
            "expectedYield": "8 – 14 tons/hectare",
            "tips": "Train on vertical trellis to maximize yield. Sandy soil prevents root rot common in humid conditions.",
            "confidence": 80,
        },
    },
    # ── Rule 12 ── sandy | rainy | rabi
    {
        "rule_id": 12,
        "conditions": {"soilType": "sandy", "weather": "rainy", "season": "rabi"},
        "output": {
            "crop": "Mustard (Rapeseed)",
            "cropEmoji": "🌻",
            "fertilizer": "NPK 60:30:30 kg/ha + Sulphur 20 kg/ha",
            "pestControl": "Aphid: Dimethoate 0.03% spray; Alternaria blight: Mancozeb 75WP",
            "waterRequirement": "Moderate – rainy conditions reduce irrigation needs",
            "expectedYield": "1.0 – 1.8 tons/hectare",
            "tips": "Sandy soil prevents waterlogging in rainy rabi. Flower drop risk with excess moisture—ensure drainage.",
            "confidence": 81,
        },
    },
    # ── Rule 13 ── sandy | rainy | zaid
    {
        "rule_id": 13,
        "conditions": {"soilType": "sandy", "weather": "rainy", "season": "zaid"},
        "output": {
            "crop": "Green Gram (Moong)",
            "cropEmoji": "🫘",
            "fertilizer": "Rhizobium inoculant + Phosphorus 40 kg/ha; minimal N (legume)",
            "pestControl": "MYMV (yellow mosaic): whitefly control with Thiamethoxam; pod borer: neem spray",
            "waterRequirement": "Low to Moderate – rainy conditions sufficient",
            "expectedYield": "0.8 – 1.4 tons/hectare",
            "tips": "Short-duration crop (60-70 days), ideal for sandy soils. Excellent as catch crop between seasons.",
            "confidence": 84,
        },
    },
    # ── Rule 14 ── sandy | cool | kharif
    {
        "rule_id": 14,
        "conditions": {"soilType": "sandy", "weather": "cool", "season": "kharif"},
        "output": {
            "crop": "Maize (Corn)",
            "cropEmoji": "🌽",
            "fertilizer": "Urea 120 kg/ha split 3 doses + DAP 60 kg/ha basal",
            "pestControl": "Fall armyworm: Emamectin benzoate; stem borer: Carbofuran 3G at whorl",
            "waterRequirement": "Moderate – 500-700 mm",
            "expectedYield": "3 – 5 tons/hectare",
            "tips": "Sandy soil with cool kharif (hill areas) gives good drainage. Use hill-adapted varieties for best yield.",
            "confidence": 79,
        },
    },
    # ── Rule 15 ── sandy | cool | rabi
    {
        "rule_id": 15,
        "conditions": {"soilType": "sandy", "weather": "cool", "season": "rabi"},
        "output": {
            "crop": "Barley",
            "cropEmoji": "🌾",
            "fertilizer": "DAP 50 kg/acre + Urea 30 kg/acre top-dress at tillering",
            "pestControl": "Powdery mildew: Propiconazole spray; loose smut: Carbendazim seed treatment",
            "waterRequirement": "Low – 2-3 irrigations; drought tolerant",
            "expectedYield": "2.5 – 4.0 tons/hectare",
            "tips": "Barley handles sandy soils better than wheat. Shorter season and more drought tolerant.",
            "confidence": 85,
        },
    },

    # ══════════════════════════════════════════════════════════════════════════
    # CLAY SOIL  (5 weathers × 3 seasons = 15 rules)
    # ══════════════════════════════════════════════════════════════════════════

    # ── Rule 16 ── clay | humid | kharif
    {
        "rule_id": 16,
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
    # ── Rule 17 ── clay | rainy | kharif
    {
        "rule_id": 17,
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
    # ── Rule 18 ── clay | dry | rabi
    {
        "rule_id": 18,
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
    # ── Rule 19 ── clay | cool | zaid
    {
        "rule_id": 19,
        "conditions": {"soilType": "clay", "weather": "cool", "season": "zaid"},
        "output": {
            "crop": "Cucumber",
            "cropEmoji": "🥒",
            "fertilizer": "DAP 50 kg/acre + Potash 30 kg/acre",
            "pestControl": "Red spider mite: Abamectin; Downy mildew: Ridomil Gold",
            "waterRequirement": "Moderate – 400-500 mm",
            "expectedYield": "15 – 20 tons/hectare",
            "tips": "Use trellis for climbing; harvest frequently for more fruit set.",
            "confidence": 82,
        },
    },
    # ── Rule 20 ── clay | hot | zaid
    {
        "rule_id": 20,
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
    # ── Rule 21 ── clay | hot | kharif
    {
        "rule_id": 21,
        "conditions": {"soilType": "clay", "weather": "hot", "season": "kharif"},
        "output": {
            "crop": "Rice (Heat-Tolerant Variety)",
            "cropEmoji": "🍚",
            "fertilizer": "Nitrogen 100 kg/ha + Potash 50 kg/ha + Zinc 25 kg/ha",
            "pestControl": "Stem borer: Carbofuran 3G; BPH: Monocrotophos; blast: Tricyclazole",
            "waterRequirement": "High – 1000-1400 mm; clay retains water in heat",
            "expectedYield": "3.5 – 5.0 tons/hectare",
            "tips": "Use heat-tolerant varieties (ADT 43, MTU 1010). Clay soil retains water even in hot kharif.",
            "confidence": 86,
        },
    },
    # ── Rule 22 ── clay | hot | rabi
    {
        "rule_id": 22,
        "conditions": {"soilType": "clay", "weather": "hot", "season": "rabi"},
        "output": {
            "crop": "Chickpea (Gram)",
            "cropEmoji": "🫘",
            "fertilizer": "Phosphorus 60 kg/ha + Zinc 25 kg/ha + Rhizobium inoculant",
            "pestControl": "Pod borer: Chlorpyrifos + Cypermethrin; wilt: Trichoderma application",
            "waterRequirement": "Low – 1-2 protective irrigations; avoid excess",
            "expectedYield": "1.0 – 1.8 tons/hectare",
            "tips": "Clay soil retains moisture during hot rabi. Use raised beds to avoid waterlogging. Chickpea enriches soil N.",
            "confidence": 84,
        },
    },
    # ── Rule 23 ── clay | dry | kharif
    {
        "rule_id": 23,
        "conditions": {"soilType": "clay", "weather": "dry", "season": "kharif"},
        "output": {
            "crop": "Sorghum (Jowar)",
            "cropEmoji": "🌾",
            "fertilizer": "Urea 80 kg/ha basal + 40 kg/ha top-dress; DAP 40 kg/ha",
            "pestControl": "Stem borer: Endosulfan spray; Shoot fly: Carbofuran seed treatment",
            "waterRequirement": "Low to Moderate – clay retains residual moisture",
            "expectedYield": "2.0 – 3.5 tons/hectare",
            "tips": "Clay moisture retention helps jowar through dry kharif spells. Avoid soil compaction with tillage.",
            "confidence": 87,
        },
    },
    # ── Rule 24 ── clay | dry | zaid
    {
        "rule_id": 24,
        "conditions": {"soilType": "clay", "weather": "dry", "season": "zaid"},
        "output": {
            "crop": "Bitter Gourd (Karela)",
            "cropEmoji": "🥒",
            "fertilizer": "NPK 80:60:60 kg/ha + FYM 10 t/ha",
            "pestControl": "Fruit fly: protein bait traps; powdery mildew: Karathane",
            "waterRequirement": "Moderate – clay holds moisture between irrigations well",
            "expectedYield": "10 – 16 tons/hectare",
            "tips": "Clay soil holds moisture between irrigations. Ridge planting prevents waterlogging in dry zaid.",
            "confidence": 80,
        },
    },
    # ── Rule 25 ── clay | humid | rabi
    {
        "rule_id": 25,
        "conditions": {"soilType": "clay", "weather": "humid", "season": "rabi"},
        "output": {
            "crop": "Mustard (Rapeseed)",
            "cropEmoji": "🌻",
            "fertilizer": "Nitrogen 60 kg/ha + Sulphur 30 kg/ha + Boron 1 kg/ha",
            "pestControl": "Mustard aphid: Dimethoate 0.03%; Alternaria blight: Mancozeb 75WP",
            "waterRequirement": "Low to Moderate – 2-3 irrigations in humid rabi",
            "expectedYield": "1.2 – 2.0 tons/hectare",
            "tips": "Ensure good drainage on clay in humid rabi to prevent stem canker. Sulphur critical for oil content.",
            "confidence": 83,
        },
    },
    # ── Rule 26 ── clay | humid | zaid
    {
        "rule_id": 26,
        "conditions": {"soilType": "clay", "weather": "humid", "season": "zaid"},
        "output": {
            "crop": "Taro (Arbi / Colocasia)",
            "cropEmoji": "🌿",
            "fertilizer": "NPK 80:40:120 kg/ha + FYM 20 t/ha",
            "pestControl": "Leaf blight: Copper oxychloride spray; Taro beetle: Chlorpyrifos soil drench",
            "waterRequirement": "High – frequent irrigation every 7-10 days; loves humidity",
            "expectedYield": "18 – 30 tons/hectare",
            "tips": "Taro loves clay soil with high humidity. Partial shade improves corm size. Harvest 6-8 months after planting.",
            "confidence": 79,
        },
    },
    # ── Rule 27 ── clay | rainy | rabi
    {
        "rule_id": 27,
        "conditions": {"soilType": "clay", "weather": "rainy", "season": "rabi"},
        "output": {
            "crop": "Oats",
            "cropEmoji": "🌾",
            "fertilizer": "DAP 60 kg/acre + Urea 40 kg/acre top-dress at tillering",
            "pestControl": "Crown rust: Propiconazole; Loose smut: Carbendazim seed treatment",
            "waterRequirement": "Low to Moderate – rainy season reduces irrigation need",
            "expectedYield": "2.0 – 4.0 tons/hectare",
            "tips": "Oats tolerate waterlogged clay soils better than wheat. Excellent fodder + grain dual-use crop.",
            "confidence": 80,
        },
    },
    # ── Rule 28 ── clay | rainy | zaid
    {
        "rule_id": 28,
        "conditions": {"soilType": "clay", "weather": "rainy", "season": "zaid"},
        "output": {
            "crop": "Pumpkin (Kaddu)",
            "cropEmoji": "🎃",
            "fertilizer": "NPK 100:60:80 kg/ha + Boron foliar spray at flowering",
            "pestControl": "Powdery mildew: Carbendazim; Fruit borer: Spinosad spray",
            "waterRequirement": "Moderate – rainy conditions reduce irrigation need",
            "expectedYield": "20 – 40 tons/hectare",
            "tips": "Clay soil retains moisture; raise beds for drainage. Train vines on trellis to save space.",
            "confidence": 81,
        },
    },
    # ── Rule 29 ── clay | cool | kharif
    {
        "rule_id": 29,
        "conditions": {"soilType": "clay", "weather": "cool", "season": "kharif"},
        "output": {
            "crop": "Maize (Corn)",
            "cropEmoji": "🌽",
            "fertilizer": "Urea 140 kg/ha split 3 doses + DAP 80 kg/ha basal",
            "pestControl": "Fall armyworm: Emamectin benzoate; Stem borer: Carbofuran 3G",
            "waterRequirement": "Moderate – 600-800 mm",
            "expectedYield": "4 – 6 tons/hectare",
            "tips": "Clay soil with cool temperatures in hill areas gives excellent maize. Avoid waterlogging with ridges.",
            "confidence": 83,
        },
    },
    # ── Rule 30 ── clay | cool | rabi
    {
        "rule_id": 30,
        "conditions": {"soilType": "clay", "weather": "cool", "season": "rabi"},
        "output": {
            "crop": "Wheat",
            "cropEmoji": "🌿",
            "fertilizer": "DAP 75 kg/acre + Urea 75 kg/acre split 3 doses",
            "pestControl": "Yellow/brown rust: Propiconazole; Karnal bunt: Carbendazim seed treatment",
            "waterRequirement": "Moderate – 5-6 irrigations at critical stages",
            "expectedYield": "3.5 – 5.5 tons/hectare",
            "tips": "Clay soil retains moisture well for rabi wheat. Avoid over-irrigation at heading stage.",
            "confidence": 88,
        },
    },

    # ══════════════════════════════════════════════════════════════════════════
    # LOAMY SOIL  (5 weathers × 3 seasons = 15 rules)
    # ══════════════════════════════════════════════════════════════════════════

    # ── Rule 31 ── loamy | hot | kharif
    {
        "rule_id": 31,
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
    # ── Rule 32 ── loamy | humid | rabi
    {
        "rule_id": 32,
        "conditions": {"soilType": "loamy", "weather": "humid", "season": "rabi"},
        "output": {
            "crop": "Wheat",
            "cropEmoji": "🌿",
            "fertilizer": "DAP 75 kg/acre + Urea top-dress at tillering",
            "pestControl": "Herbicide (Isoproturon) for weed control; Rust: Propiconazole",
            "waterRequirement": "Moderate – 4-5 irrigations",
            "expectedYield": "4 – 6 tons/hectare",
            "tips": "Loamy soil gives best wheat yield. Avoid waterlogging.",
            "confidence": 94,
        },
    },
    # ── Rule 33 ── loamy | rainy | kharif
    {
        "rule_id": 33,
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
    # ── Rule 34 ── loamy | cool | rabi
    {
        "rule_id": 34,
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
    # ── Rule 35 ── loamy | dry | zaid
    {
        "rule_id": 35,
        "conditions": {"soilType": "loamy", "weather": "dry", "season": "zaid"},
        "output": {
            "crop": "Sunflower",
            "cropEmoji": "🌻",
            "fertilizer": "NPK 90:60:30 kg/ha + boron 1 kg/ha",
            "pestControl": "Whitefly: Yellow sticky traps; Alternaria blight: Mancozeb",
            "waterRequirement": "Low to Moderate – 500-700 mm",
            "expectedYield": "1.5 – 2 tons/hectare (seeds)",
            "tips": "Hand pollination in morning improves seed setting by 20%.",
            "confidence": 86,
        },
    },
    # ── Rule 36 ── loamy | hot | rabi
    {
        "rule_id": 36,
        "conditions": {"soilType": "loamy", "weather": "hot", "season": "rabi"},
        "output": {
            "crop": "Barley",
            "cropEmoji": "🌾",
            "fertilizer": "DAP 50 kg/acre + Urea 30 kg/acre; split application",
            "pestControl": "Stem rust: Propiconazole; Aphid: Imidacloprid at tillering",
            "waterRequirement": "Low – 2-3 irrigations; heat-tolerant cereal",
            "expectedYield": "3.0 – 5.0 tons/hectare",
            "tips": "Barley matures faster in hot rabi. Loamy soil gives good tilth for root development.",
            "confidence": 84,
        },
    },
    # ── Rule 37 ── loamy | hot | zaid
    {
        "rule_id": 37,
        "conditions": {"soilType": "loamy", "weather": "hot", "season": "zaid"},
        "output": {
            "crop": "Tomato",
            "cropEmoji": "🍅",
            "fertilizer": "NPK 120:80:80 kg/ha + micronutrient foliar spray",
            "pestControl": "Leaf curl virus: Imidacloprid (vector control); Early blight: Mancozeb",
            "waterRequirement": "Moderate – drip irrigation 4-5 L/plant/day",
            "expectedYield": "25 – 50 tons/hectare",
            "tips": "Stake plants. Remove suckers weekly for better fruit size.",
            "confidence": 92,
        },
    },
    # ── Rule 38 ── loamy | dry | kharif
    {
        "rule_id": 38,
        "conditions": {"soilType": "loamy", "weather": "dry", "season": "kharif"},
        "output": {
            "crop": "Pearl Millet (Bajra)",
            "cropEmoji": "🌾",
            "fertilizer": "Urea 100 kg/ha + DAP 50 kg/ha; split application",
            "pestControl": "Downy mildew: Metalaxyl 35WS seed treatment; Ergot: roguing at emergence",
            "waterRequirement": "Very Low – 350-500 mm; excellent drought tolerance",
            "expectedYield": "2.0 – 3.0 tons/hectare",
            "tips": "Loamy soil with NPK compensates for dryness. Use open-pollinated varieties in drought-prone zones.",
            "confidence": 87,
        },
    },
    # ── Rule 39 ── loamy | dry | rabi
    {
        "rule_id": 39,
        "conditions": {"soilType": "loamy", "weather": "dry", "season": "rabi"},
        "output": {
            "crop": "Mustard (Rapeseed)",
            "cropEmoji": "🌻",
            "fertilizer": "NPK 80:40:40 kg/ha + Sulphur 20 kg/ha",
            "pestControl": "Aphid: Dimethoate 0.03%; White rust: Metalaxyl + Mancozeb mix",
            "waterRequirement": "Low – 2-3 irrigations",
            "expectedYield": "1.5 – 2.2 tons/hectare",
            "tips": "Loamy soil gives best mustard yield. Sulphur application critical for oil content improvement.",
            "confidence": 88,
        },
    },
    # ── Rule 40 ── loamy | humid | kharif
    {
        "rule_id": 40,
        "conditions": {"soilType": "loamy", "weather": "humid", "season": "kharif"},
        "output": {
            "crop": "Sugarcane",
            "cropEmoji": "🎋",
            "fertilizer": "N 250 kg/ha split 5 times + P 80 kg/ha + K 100 kg/ha",
            "pestControl": "Pyrilla: parasitoid release; Early shoot borer: Chlorpyrifos granules",
            "waterRequirement": "Very High – 1500-2000 mm",
            "expectedYield": "65 – 90 tons/hectare",
            "tips": "Loamy soil ideal for sugarcane. Humid kharif boosts growth. Ratoon crop reduces costs by 40%.",
            "confidence": 90,
        },
    },
    # ── Rule 41 ── loamy | humid | zaid
    {
        "rule_id": 41,
        "conditions": {"soilType": "loamy", "weather": "humid", "season": "zaid"},
        "output": {
            "crop": "Cucumber",
            "cropEmoji": "🥒",
            "fertilizer": "NPK 100:60:80 kg/ha + micronutrient foliar spray",
            "pestControl": "Downy mildew: Ridomil Gold; Red spider mite: Abamectin",
            "waterRequirement": "Moderate – drip irrigation preferred in humid zaid",
            "expectedYield": "18 – 28 tons/hectare",
            "tips": "Loamy soil with good drainage is ideal. Trellis cultivation gives better quality fruit.",
            "confidence": 85,
        },
    },
    # ── Rule 42 ── loamy | rainy | rabi
    {
        "rule_id": 42,
        "conditions": {"soilType": "loamy", "weather": "rainy", "season": "rabi"},
        "output": {
            "crop": "Oats",
            "cropEmoji": "🌾",
            "fertilizer": "Urea 80 kg/ha + DAP 50 kg/ha basal",
            "pestControl": "Crown rust: Propiconazole; Aphid: Imidacloprid at booting",
            "waterRequirement": "Low – rainy rabi reduces irrigation significantly",
            "expectedYield": "2.5 – 4.5 tons/hectare",
            "tips": "Oats handle rainy rabi conditions well. Excellent dual-use: grain + green fodder.",
            "confidence": 82,
        },
    },
    # ── Rule 43 ── loamy | rainy | zaid
    {
        "rule_id": 43,
        "conditions": {"soilType": "loamy", "weather": "rainy", "season": "zaid"},
        "output": {
            "crop": "Bottle Gourd (Lauki)",
            "cropEmoji": "🥬",
            "fertilizer": "NPK 100:60:80 kg/ha + FYM 15 t/ha",
            "pestControl": "Fruit fly: neem-based bait; Mosaic virus: aphid control with neem",
            "waterRequirement": "Moderate – rainy season reduces irrigation need",
            "expectedYield": "25 – 40 tons/hectare",
            "tips": "Loamy soil gives excellent bottle gourd. Trellis or ground cultivation both work well.",
            "confidence": 83,
        },
    },
    # ── Rule 44 ── loamy | cool | kharif
    {
        "rule_id": 44,
        "conditions": {"soilType": "loamy", "weather": "cool", "season": "kharif"},
        "output": {
            "crop": "Soybean",
            "cropEmoji": "🫘",
            "fertilizer": "Phosphorus 80 kg/ha + Rhizobium inoculant + Zinc 25 kg/ha",
            "pestControl": "Girdle beetle: Chlorpyrifos; Leaf eating caterpillar: Spinosad",
            "waterRequirement": "Moderate – 500-700 mm",
            "expectedYield": "2.0 – 3.0 tons/hectare",
            "tips": "Cool kharif onset gives ideal germination conditions. Harvest when 85% pods turn brown.",
            "confidence": 86,
        },
    },
    # ── Rule 45 ── loamy | cool | zaid
    {
        "rule_id": 45,
        "conditions": {"soilType": "loamy", "weather": "cool", "season": "zaid"},
        "output": {
            "crop": "Muskmelon (Kharbooja)",
            "cropEmoji": "🍈",
            "fertilizer": "NPK 80:60:80 kg/ha + Boron foliar at flowering",
            "pestControl": "Fruit fly: pheromone traps; Powdery mildew: Karathane",
            "waterRequirement": "Moderate – stop irrigation 10-15 days before harvest",
            "expectedYield": "15 – 24 tons/hectare",
            "tips": "Sandy loam gives sweetest muskmelon. Stop irrigation before harvest for maximum sweetness.",
            "confidence": 83,
        },
    },

    # ══════════════════════════════════════════════════════════════════════════
    # BLACK SOIL  (5 weathers × 3 seasons = 15 rules)
    # ══════════════════════════════════════════════════════════════════════════

    # ── Rule 46 ── black | hot | kharif
    {
        "rule_id": 46,
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
    # ── Rule 47 ── black | rainy | kharif
    {
        "rule_id": 47,
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
    # ── Rule 48 ── black | humid | rabi
    {
        "rule_id": 48,
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
    # ── Rule 49 ── black | dry | rabi
    {
        "rule_id": 49,
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
    # ── Rule 50 ── black | cool | zaid
    {
        "rule_id": 50,
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
    # ── Rule 51 ── black | hot | rabi
    {
        "rule_id": 51,
        "conditions": {"soilType": "black", "weather": "hot", "season": "rabi"},
        "output": {
            "crop": "Sunflower",
            "cropEmoji": "🌻",
            "fertilizer": "NPK 90:60:60 kg/ha + Boron 1.5 kg/ha",
            "pestControl": "Whitefly: Yellow sticky traps + Imidacloprid; Alternaria blight: Mancozeb 75WP",
            "waterRequirement": "Moderate – 3-4 irrigations; black soil retains moisture",
            "expectedYield": "1.5 – 2.5 tons/hectare (seeds)",
            "tips": "Black soil moisture retention excellent for rabi sunflower. Hand-pollinate in morning for better seed set.",
            "confidence": 85,
        },
    },
    # ── Rule 52 ── black | hot | zaid
    {
        "rule_id": 52,
        "conditions": {"soilType": "black", "weather": "hot", "season": "zaid"},
        "output": {
            "crop": "Sesame (Til)",
            "cropEmoji": "🌿",
            "fertilizer": "Nitrogen 40 kg/ha + Phosphorus 25 kg/ha",
            "pestControl": "Leaf roller: Malathion 50EC; Phyllody disease: leafhopper control with Imidacloprid",
            "waterRequirement": "Low – 4-5 irrigations; avoid waterlogging",
            "expectedYield": "0.6 – 1.2 tons/hectare",
            "tips": "Black soil water retention reduces sesame irrigation. Harvest early morning to prevent capsule shattering.",
            "confidence": 82,
        },
    },
    # ── Rule 53 ── black | dry | kharif
    {
        "rule_id": 53,
        "conditions": {"soilType": "black", "weather": "dry", "season": "kharif"},
        "output": {
            "crop": "Pearl Millet (Bajra)",
            "cropEmoji": "🌾",
            "fertilizer": "Urea 80 kg/ha + DAP 30 kg/ha",
            "pestControl": "Ergot: roguing; Smut: seed treatment; Downy mildew: Metalaxyl",
            "waterRequirement": "Very Low – 350-500 mm; black soil retains monsoon moisture",
            "expectedYield": "2.0 – 3.0 tons/hectare",
            "tips": "Black soil conserves kharif monsoon moisture giving bajra a yield advantage over sandy soils.",
            "confidence": 86,
        },
    },
    # ── Rule 54 ── black | dry | zaid
    {
        "rule_id": 54,
        "conditions": {"soilType": "black", "weather": "dry", "season": "zaid"},
        "output": {
            "crop": "Sorghum (Jowar)",
            "cropEmoji": "🌾",
            "fertilizer": "Urea 80 kg/ha split + Potash 30 kg/ha",
            "pestControl": "Shoot fly: Carbofuran seed treatment; Stem borer: Endosulfan spray",
            "waterRequirement": "Low – 2-3 irrigations; black soil residual moisture sufficient",
            "expectedYield": "2.5 – 4.0 tons/hectare",
            "tips": "Black soil residual moisture from previous season supports dry zaid jowar. Use hybrid varieties.",
            "confidence": 84,
        },
    },
    # ── Rule 55 ── black | humid | kharif
    {
        "rule_id": 55,
        "conditions": {"soilType": "black", "weather": "humid", "season": "kharif"},
        "output": {
            "crop": "Soybean",
            "cropEmoji": "🫘",
            "fertilizer": "Phosphorus 80 kg/ha + Rhizobium + Zinc 25 kg/ha",
            "pestControl": "Yellow mosaic virus: whitefly control; Girdle beetle: Chlorpyrifos",
            "waterRequirement": "Moderate – 450-700 mm; black soil reduces drainage issues",
            "expectedYield": "2.0 – 3.0 tons/hectare",
            "tips": "Black soil + humid kharif = ideal for soybean in MP/Vidarbha. Inter-crop with corn for best returns.",
            "confidence": 91,
        },
    },
    # ── Rule 56 ── black | humid | zaid
    {
        "rule_id": 56,
        "conditions": {"soilType": "black", "weather": "humid", "season": "zaid"},
        "output": {
            "crop": "Okra (Lady's Finger / Bhindi)",
            "cropEmoji": "🌿",
            "fertilizer": "NPK 100:60:60 kg/ha + FYM 20 t/ha",
            "pestControl": "YVMV: whitefly control with Thiamethoxam; Aphid: Imidacloprid; leaf caterpillar: neem",
            "waterRequirement": "Moderate – every 5-7 days",
            "expectedYield": "10 – 18 tons/hectare",
            "tips": "Black soil fertility excellent for okra. Harvest pods at 5-6 cm stage every 2 days for maximum yield.",
            "confidence": 84,
        },
    },
    # ── Rule 57 ── black | rainy | rabi
    {
        "rule_id": 57,
        "conditions": {"soilType": "black", "weather": "rainy", "season": "rabi"},
        "output": {
            "crop": "Chickpea (Gram)",
            "cropEmoji": "🫘",
            "fertilizer": "Phosphorus 60 kg/ha + Zinc 25 kg/ha + Rhizobium inoculant",
            "pestControl": "Pod borer: Chlorpyrifos + Cypermethrin; wilt: Trichoderma soil application",
            "waterRequirement": "Low – 1-2 protective irrigations; avoid excess moisture",
            "expectedYield": "1.2 – 2.0 tons/hectare",
            "tips": "Black soil is traditional chickpea soil in MP. Use raised beds or ridges to avoid waterlogging in rainy rabi.",
            "confidence": 86,
        },
    },
    # ── Rule 58 ── black | rainy | zaid
    {
        "rule_id": 58,
        "conditions": {"soilType": "black", "weather": "rainy", "season": "zaid"},
        "output": {
            "crop": "Bottle Gourd (Lauki)",
            "cropEmoji": "🥬",
            "fertilizer": "NPK 100:60:80 kg/ha + FYM 20 t/ha",
            "pestControl": "Fruit fly: protein bait traps; Powdery mildew: Carbendazim spray",
            "waterRequirement": "Moderate – rainy conditions reduce irrigation need",
            "expectedYield": "20 – 35 tons/hectare",
            "tips": "Black soil nutrition supports vigorous bottle gourd vines. Trellis recommended for better aeration.",
            "confidence": 80,
        },
    },
    # ── Rule 59 ── black | cool | kharif
    {
        "rule_id": 59,
        "conditions": {"soilType": "black", "weather": "cool", "season": "kharif"},
        "output": {
            "crop": "Maize (Corn)",
            "cropEmoji": "🌽",
            "fertilizer": "Urea 150 kg/ha split 3 doses + DAP 80 kg/ha basal",
            "pestControl": "Fall armyworm: Emamectin benzoate; Ear rot: avoid lodging + fungicide",
            "waterRequirement": "Moderate – 600-800 mm",
            "expectedYield": "5 – 8 tons/hectare",
            "tips": "Black soil with cool kharif gives excellent maize yield in Deccan plateau and hill areas.",
            "confidence": 84,
        },
    },
    # ── Rule 60 ── black | cool | rabi
    {
        "rule_id": 60,
        "conditions": {"soilType": "black", "weather": "cool", "season": "rabi"},
        "output": {
            "crop": "Lentil (Masoor)",
            "cropEmoji": "🫘",
            "fertilizer": "Phosphorus 50 kg/ha + Zinc 20 kg/ha + Rhizobium inoculant",
            "pestControl": "Rust: Mancozeb 75WP spray; Aphid: neem oil 0.5%; wilt: Trichoderma",
            "waterRequirement": "Very Low – 1-2 irrigations; cool weather reduces evapotranspiration",
            "expectedYield": "0.8 – 1.5 tons/hectare",
            "tips": "Cool black soil conditions ideal for late-sown masoor. Short-duration legume improves soil N.",
            "confidence": 82,
        },
    },

    # ══════════════════════════════════════════════════════════════════════════
    # SILT SOIL  (5 weathers × 3 seasons = 15 rules)
    # ══════════════════════════════════════════════════════════════════════════

    # ── Rule 61 ── silt | humid | rabi
    {
        "rule_id": 61,
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
    # ── Rule 62 ── silt | hot | kharif
    {
        "rule_id": 62,
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
    # ── Rule 63 ── silt | rainy | kharif
    {
        "rule_id": 63,
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
    # ── Rule 64 ── silt | dry | rabi
    {
        "rule_id": 64,
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
    # ── Rule 65 ── silt | hot | rabi
    {
        "rule_id": 65,
        "conditions": {"soilType": "silt", "weather": "hot", "season": "rabi"},
        "output": {
            "crop": "Onion",
            "cropEmoji": "🧅",
            "fertilizer": "NPK 100:60:60 kg/ha + Potash 80 kg/ha at bulbing stage",
            "pestControl": "Thrips: Blue sticky traps + Spinosad; Purple blotch: Mancozeb 75WP",
            "waterRequirement": "Moderate – stop irrigation 15 days before harvest",
            "expectedYield": "20 – 30 tons/hectare",
            "tips": "Silt alluvial soil gives large, uniform bulbs. Hot rabi promotes bulbing. Cure properly after harvest.",
            "confidence": 87,
        },
    },
    # ── Rule 66 ── silt | hot | zaid
    {
        "rule_id": 66,
        "conditions": {"soilType": "silt", "weather": "hot", "season": "zaid"},
        "output": {
            "crop": "Okra (Lady's Finger / Bhindi)",
            "cropEmoji": "🌿",
            "fertilizer": "NPK 100:60:60 kg/ha + micronutrient foliar spray",
            "pestControl": "YVMV: whitefly control with yellow sticky traps + Thiamethoxam",
            "waterRequirement": "Moderate – every 5-7 days; silt retains moisture well",
            "expectedYield": "12 – 20 tons/hectare",
            "tips": "Silt alluvial soil provides high fertility. Hot zaid is peak okra season in India.",
            "confidence": 86,
        },
    },
    # ── Rule 67 ── silt | dry | kharif
    {
        "rule_id": 67,
        "conditions": {"soilType": "silt", "weather": "dry", "season": "kharif"},
        "output": {
            "crop": "Sorghum (Jowar)",
            "cropEmoji": "🌾",
            "fertilizer": "Urea 80 kg/ha + DAP 30 kg/ha; top-dress at knee height",
            "pestControl": "Stem borer: Endosulfan spray; Charcoal rot: seed treatment with Trichoderma",
            "waterRequirement": "Low – 400-600 mm; silt retains moisture well",
            "expectedYield": "2.0 – 3.5 tons/hectare",
            "tips": "Silt soil high fertility helps jowar in dry kharif. Use hybrid varieties for better yield.",
            "confidence": 83,
        },
    },
    # ── Rule 68 ── silt | dry | zaid
    {
        "rule_id": 68,
        "conditions": {"soilType": "silt", "weather": "dry", "season": "zaid"},
        "output": {
            "crop": "Sesame (Til)",
            "cropEmoji": "🌿",
            "fertilizer": "NPK 30:30:30 kg/ha; balanced nutrition",
            "pestControl": "Leaf roller: Malathion 50EC; Phyllody disease: leafhopper control",
            "waterRequirement": "Low – 4-5 light irrigations",
            "expectedYield": "0.5 – 1.0 tons/hectare",
            "tips": "Dry zaid + silt soil = good drainage for sesame. Harvest carefully to avoid capsule shattering.",
            "confidence": 80,
        },
    },
    # ── Rule 69 ── silt | humid | kharif
    {
        "rule_id": 69,
        "conditions": {"soilType": "silt", "weather": "humid", "season": "kharif"},
        "output": {
            "crop": "Banana",
            "cropEmoji": "🍌",
            "fertilizer": "N 200 kg/ha + P 60 kg/ha + K 300 kg/ha split monthly",
            "pestControl": "Panama wilt: Trichoderma soil treatment; nematodes: Carbofuran 3G",
            "waterRequirement": "Very High – 1200-2000 mm",
            "expectedYield": "35 – 55 tons/hectare",
            "tips": "Silt alluvial soil gives highest banana yield. Prop plants against wind. Harvest 13-14 months after planting.",
            "confidence": 88,
        },
    },
    # ── Rule 70 ── silt | humid | zaid
    {
        "rule_id": 70,
        "conditions": {"soilType": "silt", "weather": "humid", "season": "zaid"},
        "output": {
            "crop": "Bottle Gourd (Lauki)",
            "cropEmoji": "🥬",
            "fertilizer": "NPK 100:60:80 kg/ha + FYM 15 t/ha",
            "pestControl": "Fruit fly: attract-and-kill bait; Mosaic virus: aphid management with neem",
            "waterRequirement": "Moderate – silt holds moisture well in humid conditions",
            "expectedYield": "28 – 45 tons/hectare",
            "tips": "Silt soil fertility excellent. Humid conditions support vigorous vine growth. Trellis preferred.",
            "confidence": 83,
        },
    },
    # ── Rule 71 ── silt | rainy | rabi
    {
        "rule_id": 71,
        "conditions": {"soilType": "silt", "weather": "rainy", "season": "rabi"},
        "output": {
            "crop": "Mustard (Rapeseed)",
            "cropEmoji": "🌻",
            "fertilizer": "NPK 80:40:40 kg/ha + Sulphur 20 kg/ha",
            "pestControl": "Aphid: Dimethoate 0.03% spray; Alternaria blight: Iprodione",
            "waterRequirement": "Low – rainy conditions provide most irrigation needs",
            "expectedYield": "1.2 – 2.0 tons/hectare",
            "tips": "Silt alluvial soil gives high mustard yield in Bihar/Bengal. Rainy rabi reduces irrigation costs.",
            "confidence": 84,
        },
    },
    # ── Rule 72 ── silt | rainy | zaid
    {
        "rule_id": 72,
        "conditions": {"soilType": "silt", "weather": "rainy", "season": "zaid"},
        "output": {
            "crop": "Pumpkin (Kaddu)",
            "cropEmoji": "🎃",
            "fertilizer": "NPK 100:80:100 kg/ha + Boron foliar spray",
            "pestControl": "Fruit borer: Spinosad spray; Powdery mildew: Karathane",
            "waterRequirement": "Moderate – rainy conditions sufficient",
            "expectedYield": "25 – 45 tons/hectare",
            "tips": "Silt soil water retention and fertility ideal for pumpkin. Vines can sprawl on trellises or ground.",
            "confidence": 82,
        },
    },
    # ── Rule 73 ── silt | cool | kharif
    {
        "rule_id": 73,
        "conditions": {"soilType": "silt", "weather": "cool", "season": "kharif"},
        "output": {
            "crop": "Maize (Corn)",
            "cropEmoji": "🌽",
            "fertilizer": "Urea 120 kg/ha split + DAP 60 kg/ha basal + Zinc 25 kg/ha",
            "pestControl": "Fall armyworm: Emamectin benzoate; Helminthosporium leaf blight: Mancozeb",
            "waterRequirement": "Moderate – 500-700 mm",
            "expectedYield": "4 – 6 tons/hectare",
            "tips": "Silt soil in cool kharif areas (Himachal, Uttarakhand) gives good yields. High-value sweetcorn variety possible.",
            "confidence": 83,
        },
    },
    # ── Rule 74 ── silt | cool | rabi
    {
        "rule_id": 74,
        "conditions": {"soilType": "silt", "weather": "cool", "season": "rabi"},
        "output": {
            "crop": "Wheat",
            "cropEmoji": "🌿",
            "fertilizer": "DAP 75 kg/acre + Urea 100 kg/acre split 3 doses",
            "pestControl": "Yellow rust: Propiconazole; Karnal bunt: Carbendazim; Aphid: Imidacloprid",
            "waterRequirement": "Moderate to High – 5-7 irrigations at critical stages",
            "expectedYield": "4.5 – 6.5 tons/hectare",
            "tips": "Silt alluvial soil of Punjab/Haryana gives India's highest wheat yields. Timely sowing in Nov is critical.",
            "confidence": 96,
        },
    },
    # ── Rule 75 ── silt | cool | zaid
    {
        "rule_id": 75,
        "conditions": {"soilType": "silt", "weather": "cool", "season": "zaid"},
        "output": {
            "crop": "Cucumber",
            "cropEmoji": "🥒",
            "fertilizer": "NPK 100:60:80 kg/ha + micronutrient foliar spray",
            "pestControl": "Downy mildew: Ridomil Gold; Red spider mite: Abamectin; Powdery mildew: Karathane",
            "waterRequirement": "Moderate – 400-600 mm; silt retention reduces irrigation",
            "expectedYield": "15 – 25 tons/hectare",
            "tips": "Silt soil water retention reduces irrigation frequency. Cool temperatures prevent bitter fruit.",
            "confidence": 84,
        },
    },
]

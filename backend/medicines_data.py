MEDICINES_DATABASE = [
    {
        "name": "Paracetamol",
        "generic_name": "Acetaminophen",
        "indications": ["fever", "headache", "body pain", "toothache", "muscle pain", "arthritis pain"],
        "contraindications": ["severe liver disease", "chronic alcoholism"],
        "allergens": ["acetaminophen allergy"],
        "interactions": ["warfarin", "isoniazid"],
        "dosage": "500-1000mg every 4-6 hours (max 4g/day)",
        "category": "Analgesic/Antipyretic"
    },
    {
        "name": "Ibuprofen",
        "generic_name": "Ibuprofen",
        "indications": ["fever", "headache", "toothache", "menstrual cramps", "muscle pain", "arthritis", "inflammation"],
        "contraindications": ["stomach ulcers", "bleeding disorders", "severe kidney disease", "heart disease", "asthma"],
        "allergens": ["ibuprofen allergy", "aspirin allergy", "NSAID allergy"],
        "interactions": ["aspirin", "warfarin", "blood pressure medications", "lithium"],
        "dosage": "200-400mg every 4-6 hours (max 1.2g/day)",
        "category": "NSAID"
    },
    {
        "name": "Aspirin",
        "generic_name": "Acetylsalicylic acid",
        "indications": ["fever", "headache", "muscle pain", "toothache", "arthritis", "inflammation"],
        "contraindications": ["stomach ulcers", "bleeding disorders", "hemophilia", "children under 12", "asthma"],
        "allergens": ["aspirin allergy", "salicylate allergy"],
        "interactions": ["warfarin", "ibuprofen", "methotrexate"],
        "dosage": "300-900mg every 4-6 hours (max 4g/day)",
        "category": "NSAID"
    },
    {
        "name": "Cetirizine",
        "generic_name": "Cetirizine",
        "indications": ["allergies", "hay fever", "runny nose", "sneezing", "itching", "watery eyes", "hives"],
        "contraindications": ["severe kidney disease"],
        "allergens": ["cetirizine allergy", "hydroxyzine allergy"],
        "interactions": ["sedatives", "alcohol"],
        "dosage": "10mg once daily",
        "category": "Antihistamine"
    },
    {
        "name": "Loratadine",
        "generic_name": "Loratadine",
        "indications": ["allergies", "hay fever", "runny nose", "sneezing", "itching", "hives"],
        "contraindications": ["severe liver disease"],
        "allergens": ["loratadine allergy"],
        "interactions": ["ketoconazole", "erythromycin"],
        "dosage": "10mg once daily",
        "category": "Antihistamine"
    },
    {
        "name": "Diphenhydramine",
        "generic_name": "Diphenhydramine",
        "indications": ["allergies", "hay fever", "runny nose", "sneezing", "itching", "insomnia", "motion sickness"],
        "contraindications": ["asthma", "glaucoma", "enlarged prostate", "urinary retention"],
        "allergens": ["diphenhydramine allergy"],
        "interactions": ["sedatives", "alcohol", "MAO inhibitors"],
        "dosage": "25-50mg every 4-6 hours (max 300mg/day)",
        "category": "Antihistamine"
    },
    {
        "name": "Omeprazole",
        "generic_name": "Omeprazole",
        "indications": ["heartburn", "acid reflux", "stomach pain", "GERD"],
        "contraindications": ["hypersensitivity to proton pump inhibitors"],
        "allergens": ["omeprazole allergy"],
        "interactions": ["clopidogrel", "warfarin", "diazepam"],
        "dosage": "20mg once daily",
        "category": "Proton Pump Inhibitor"
    },
    {
        "name": "Ranitidine",
        "generic_name": "Ranitidine",
        "indications": ["heartburn", "acid reflux", "stomach pain", "indigestion"],
        "contraindications": ["kidney disease", "porphyria"],
        "allergens": ["ranitidine allergy"],
        "interactions": ["warfarin", "ketoconazole"],
        "dosage": "150mg twice daily or 300mg at bedtime",
        "category": "H2 Blocker"
    },
    {
        "name": "Loperamide",
        "generic_name": "Loperamide",
        "indications": ["diarrhea"],
        "contraindications": ["bloody diarrhea", "high fever", "inflammatory bowel disease", "bacterial infection"],
        "allergens": ["loperamide allergy"],
        "interactions": ["quinidine", "ritonavir"],
        "dosage": "4mg initially, then 2mg after each loose stool (max 16mg/day)",
        "category": "Anti-diarrheal"
    },
    {
        "name": "Dextromethorphan",
        "generic_name": "Dextromethorphan",
        "indications": ["cough", "dry cough"],
        "contraindications": ["chronic cough", "asthma", "emphysema"],
        "allergens": ["dextromethorphan allergy"],
        "interactions": ["MAO inhibitors", "SSRIs"],
        "dosage": "10-20mg every 4 hours or 30mg every 6-8 hours (max 120mg/day)",
        "category": "Cough Suppressant"
    },
    {
        "name": "Guaifenesin",
        "generic_name": "Guaifenesin",
        "indications": ["cough", "chest congestion", "mucus"],
        "contraindications": [],
        "allergens": ["guaifenesin allergy"],
        "interactions": [],
        "dosage": "200-400mg every 4 hours (max 2.4g/day)",
        "category": "Expectorant"
    },
    {
        "name": "Pseudoephedrine",
        "generic_name": "Pseudoephedrine",
        "indications": ["nasal congestion", "sinus congestion", "stuffy nose"],
        "contraindications": ["severe hypertension", "severe heart disease", "MAO inhibitor use"],
        "allergens": ["pseudoephedrine allergy"],
        "interactions": ["MAO inhibitors", "blood pressure medications"],
        "dosage": "60mg every 4-6 hours (max 240mg/day)",
        "category": "Decongestant"
    },
    {
        "name": "Bismuth Subsalicylate",
        "generic_name": "Bismuth Subsalicylate",
        "indications": ["diarrhea", "nausea", "heartburn", "indigestion", "stomach upset"],
        "contraindications": ["bleeding disorders", "children under 12", "flu or chickenpox"],
        "allergens": ["aspirin allergy", "salicylate allergy"],
        "interactions": ["aspirin", "warfarin", "tetracycline"],
        "dosage": "524mg every 30-60 minutes (max 4.2g/day)",
        "category": "Antacid/Anti-diarrheal"
    },
    {
        "name": "Meclizine",
        "generic_name": "Meclizine",
        "indications": ["nausea", "vomiting", "dizziness", "motion sickness", "vertigo"],
        "contraindications": ["asthma", "glaucoma", "enlarged prostate"],
        "allergens": ["meclizine allergy"],
        "interactions": ["sedatives", "alcohol"],
        "dosage": "25-50mg once daily",
        "category": "Antiemetic"
    },
    {
        "name": "Dimenhydrinate",
        "generic_name": "Dimenhydrinate",
        "indications": ["nausea", "vomiting", "motion sickness"],
        "contraindications": ["asthma", "glaucoma", "enlarged prostate"],
        "allergens": ["dimenhydrinate allergy"],
        "interactions": ["sedatives", "alcohol"],
        "dosage": "50-100mg every 4-6 hours (max 400mg/day)",
        "category": "Antiemetic"
    }
]

SYMPTOMS_LIST = [
    "fever", "headache", "body pain", "toothache", "muscle pain", "arthritis pain",
    "menstrual cramps", "inflammation", "allergies", "hay fever", "runny nose",
    "sneezing", "itching", "watery eyes", "hives", "insomnia", "motion sickness",
    "heartburn", "acid reflux", "stomach pain", "GERD", "indigestion", "diarrhea",
    "nausea", "vomiting", "cough", "dry cough", "chest congestion", "mucus",
    "nasal congestion", "sinus congestion", "stuffy nose", "stomach upset",
    "dizziness", "vertigo"
]
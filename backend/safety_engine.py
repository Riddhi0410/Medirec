from typing import List, Dict
from medicines_data import MEDICINES_DATABASE


class SafetyEngine:
    def __init__(self):
        self.medicines_db = {med['name']: med for med in MEDICINES_DATABASE}
    
    def check_safety(
        self, 
        medicine_name: str, 
        allergies: List[str], 
        chronic_conditions: List[str],
        current_medications: List[str],
        age: int,
        gender: str
    ) -> Dict:
        """Check safety of a medicine for a user"""
        
        if medicine_name not in self.medicines_db:
            return {
                'status': 'unknown',
                'warnings': [f'Medicine {medicine_name} not found in database']
            }
        
        medicine = self.medicines_db[medicine_name]
        warnings = []
        status = 'safe'
        
        # Check allergies
        user_allergies_lower = [a.lower() for a in allergies]
        for allergen in medicine['allergens']:
            if any(allergy in allergen.lower() or allergen.lower() in allergy 
                   for allergy in user_allergies_lower):
                warnings.append(f"⚠️ Allergy Alert: You may be allergic to {allergen}")
                status = 'unsafe'
        
        # Check contraindications
        conditions_lower = [c.lower() for c in chronic_conditions]
        for contraindication in medicine['contraindications']:
            if any(condition in contraindication.lower() or contraindication.lower() in condition
                   for condition in conditions_lower):
                warnings.append(f"🚫 Contraindication: Not recommended for {contraindication}")
                if status != 'unsafe':
                    status = 'caution'
        
        # Check drug interactions
        current_meds_lower = [m.lower() for m in current_medications]
        for interaction in medicine['interactions']:
            if any(med in interaction.lower() or interaction.lower() in med
                   for med in current_meds_lower):
                warnings.append(f"⚡ Drug Interaction: May interact with {interaction}")
                if status == 'safe':
                    status = 'caution'
        
        # Age-specific checks
        if age < 12:
            if medicine_name in ['Aspirin', 'Bismuth Subsalicylate']:
                warnings.append("⚠️ Age Restriction: Not recommended for children under 12")
                status = 'unsafe'
        
        # Special warnings
        if not warnings:
            warnings.append("✅ No contraindications found")
        
        return {
            'status': status,
            'warnings': warnings
        }
    
    def get_medicine_details(self, medicine_name: str) -> Dict:
        """Get full details of a medicine"""
        if medicine_name in self.medicines_db:
            return self.medicines_db[medicine_name]
        return None
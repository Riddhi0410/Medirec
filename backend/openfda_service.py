import aiohttp
import logging
from typing import List, Dict, Optional
import asyncio

logger = logging.getLogger(__name__)


class OpenFDAService:
    def __init__(self):
        self.base_url = "https://api.fda.gov"
        self.session = None
    
    async def get_session(self):
        """Get or create aiohttp session"""
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession()
        return self.session
    
    async def close_session(self):
        """Close aiohttp session"""
        if self.session and not self.session.closed:
            await self.session.close()
    
    async def search_drug_by_name(self, drug_name: str) -> Optional[Dict]:
        """Search for drug information by name using OpenFDA API"""
        try:
            session = await self.get_session()
            
            # Search in drug labels
            url = f"{self.base_url}/drug/label.json"
            params = {
                "search": f'openfda.brand_name:"{drug_name}" OR openfda.generic_name:"{drug_name}"',
                "limit": 1
            }
            
            async with session.get(url, params=params, timeout=10) as response:
                if response.status == 200:
                    data = await response.json()
                    if data.get('results'):
                        return self._parse_drug_label(data['results'][0])
                else:
                    logger.warning(f"OpenFDA API returned status {response.status} for {drug_name}")
        except asyncio.TimeoutError:
            logger.error(f"Timeout searching for drug: {drug_name}")
        except Exception as e:
            logger.error(f"Error searching OpenFDA for {drug_name}: {str(e)}")
        
        return None
    
    def _parse_drug_label(self, label_data: Dict) -> Dict:
        """Parse OpenFDA drug label data"""
        openfda = label_data.get('openfda', {})
        
        return {
            "brand_names": openfda.get('brand_name', []),
            "generic_name": openfda.get('generic_name', []),
            "manufacturer": openfda.get('manufacturer_name', []),
            "substance_name": openfda.get('substance_name', []),
            "product_type": openfda.get('product_type', []),
            "route": openfda.get('route', []),
            "indications": label_data.get('indications_and_usage', []),
            "dosage": label_data.get('dosage_and_administration', []),
            "warnings": label_data.get('warnings', []),
            "contraindications": label_data.get('contraindications', []),
            "adverse_reactions": label_data.get('adverse_reactions', []),
            "drug_interactions": label_data.get('drug_interactions', []),
            "purpose": label_data.get('purpose', [])
        }
    
    async def get_drug_interactions(self, drug_name: str, other_drugs: List[str]) -> List[str]:
        """Get drug interactions for a specific drug with other drugs"""
        interactions = []
        
        try:
            drug_info = await self.search_drug_by_name(drug_name)
            if not drug_info:
                return interactions
            
            interaction_text = drug_info.get('drug_interactions', [])
            if not interaction_text:
                return interactions
            
            # Parse interaction text for mentions of other drugs
            interaction_str = ' '.join(interaction_text).lower()
            
            for other_drug in other_drugs:
                if other_drug.lower() in interaction_str:
                    interactions.append(
                        f"Potential interaction with {other_drug} found in FDA data"
                    )
        except Exception as e:
            logger.error(f"Error getting drug interactions: {str(e)}")
        
        return interactions
    
    async def search_adverse_events(self, drug_name: str, limit: int = 5) -> List[Dict]:
        """Search for adverse events related to a drug"""
        try:
            session = await self.get_session()
            
            url = f"{self.base_url}/drug/event.json"
            params = {
                "search": f'patient.drug.openfda.generic_name:"{drug_name}"',
                "limit": limit
            }
            
            async with session.get(url, params=params, timeout=10) as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get('results', [])
        except Exception as e:
            logger.error(f"Error searching adverse events: {str(e)}")
        
        return []
    
    async def enrich_medicine_data(self, medicine_name: str, existing_data: Dict) -> Dict:
        """Enrich existing medicine data with OpenFDA information"""
        fda_data = await self.search_drug_by_name(medicine_name)
        
        if fda_data:
            # Merge FDA data with existing data
            enriched = existing_data.copy()
            
            # Add FDA-specific information
            enriched['fda_data'] = {
                'brand_names': fda_data.get('brand_names', []),
                'manufacturer': fda_data.get('manufacturer', []),
                'product_type': fda_data.get('product_type', []),
                'route': fda_data.get('route', []),
                'fda_warnings': fda_data.get('warnings', [])[:1] if fda_data.get('warnings') else [],
                'adverse_reactions': fda_data.get('adverse_reactions', [])[:1] if fda_data.get('adverse_reactions') else []
            }
            
            return enriched
        
        return existing_data


# Global instance
openfda_service = OpenFDAService()
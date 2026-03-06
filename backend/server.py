from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from medicines_data import MEDICINES_DATABASE, SYMPTOMS_LIST
from ml_model import MedicineRecommendationModel
from safety_engine import SafetyEngine
from openfda_service import openfda_service


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize ML model and safety engine
ml_model = MedicineRecommendationModel()
safety_engine = SafetyEngine()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class RecommendationRequest(BaseModel):
    disease: Optional[str] = None
    symptoms: List[str]
    age: int
    gender: str
    allergies: List[str] = []
    chronic_conditions: List[str] = []
    current_medications: List[str] = []

class MedicineRecommendation(BaseModel):
    name: str
    generic_name: str
    confidence: float
    category: str
    dosage: str
    indications: List[str]
    safety_status: str
    warnings: List[str]
    fda_data: Optional[dict] = None

class RecommendationResponse(BaseModel):
    recommendations: List[MedicineRecommendation]
    total_found: int

class Medicine(BaseModel):
    name: str
    generic_name: str
    indications: List[str]
    contraindications: List[str]
    allergens: List[str]
    interactions: List[str]
    dosage: str
    category: str

class SymptomsResponse(BaseModel):
    symptoms: List[str]


@api_router.get("/")
async def root():
    return {"message": "AI Medicine Recommender API", "version": "1.0"}


@api_router.get("/symptoms", response_model=SymptomsResponse)
async def get_symptoms():
    """Get list of available symptoms"""
    return {"symptoms": sorted(SYMPTOMS_LIST)}


@api_router.get("/medicines", response_model=List[Medicine])
async def get_medicines():
    """Get all medicines in database"""
    return MEDICINES_DATABASE


@api_router.post("/recommend", response_model=RecommendationResponse)
async def recommend_medicines(request: RecommendationRequest):
    """Get medicine recommendations based on symptoms and health profile"""
    
    try:
        # Get ML predictions
        predictions = ml_model.predict(request.symptoms)
        
        recommendations = []
        for pred in predictions:
            medicine_name = pred['name']
            confidence = pred['confidence']
            
            # Get medicine details
            medicine_details = safety_engine.get_medicine_details(medicine_name)
            if not medicine_details:
                continue
            
            # Check safety
            safety_check = safety_engine.check_safety(
                medicine_name=medicine_name,
                allergies=request.allergies,
                chronic_conditions=request.chronic_conditions,
                current_medications=request.current_medications,
                age=request.age,
                gender=request.gender
            )
            
            # Enrich with OpenFDA data (async, non-blocking)
            fda_data = None
            try:
                enriched_data = await openfda_service.enrich_medicine_data(
                    medicine_name, 
                    medicine_details
                )
                fda_data = enriched_data.get('fda_data')
            except Exception as e:
                logger.warning(f"Could not enrich {medicine_name} with FDA data: {str(e)}")
            
            recommendation = MedicineRecommendation(
                name=medicine_details['name'],
                generic_name=medicine_details['generic_name'],
                confidence=confidence,
                category=medicine_details['category'],
                dosage=medicine_details['dosage'],
                indications=medicine_details['indications'],
                safety_status=safety_check['status'],
                warnings=safety_check['warnings'],
                fda_data=fda_data
            )
            recommendations.append(recommendation)
        
        # Sort by safety status (safe first) then confidence
        def sort_key(rec):
            status_priority = {'safe': 0, 'caution': 1, 'unsafe': 2, 'unknown': 3}
            return (status_priority.get(rec.safety_status, 3), -rec.confidence)
        
        recommendations.sort(key=sort_key)
        
        return RecommendationResponse(
            recommendations=recommendations,
            total_found=len(recommendations)
        )
    
    except Exception as e:
        logging.error(f"Error in recommend_medicines: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/train-model")
async def train_model():
    """Train or retrain the ML model"""
    try:
        ml_model.train()
        return {"message": "Model trained successfully", "status": "success"}
    except Exception as e:
        logging.error(f"Error training model: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    model_loaded = ml_model.model is not None
    if not model_loaded:
        model_loaded = ml_model.load_model()
    
    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "medicines_count": len(MEDICINES_DATABASE),
        "symptoms_count": len(SYMPTOMS_LIST)
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    """Load or train model on startup"""
    logger.info("Starting AI Medicine Recommender API...")
    if not ml_model.load_model():
        logger.info("Model not found, training new model...")
        ml_model.train()
    logger.info("Model ready!")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    await openfda_service.close_session()
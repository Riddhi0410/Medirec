import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.multioutput import MultiOutputClassifier
import joblib
import os
from medicines_data import MEDICINES_DATABASE, SYMPTOMS_LIST


class MedicineRecommendationModel:
    def __init__(self):
        self.model = None
        self.symptom_encoder = None
        self.medicine_encoder = None
        self.symptom_to_medicines = {}
        self.model_path = '/app/backend/models/medicine_model.pkl'
        self.encoders_path = '/app/backend/models/encoders.pkl'
        
    def generate_training_data(self):
        """Generate training data from medicines database"""
        training_data = []
        
        # Create symptom to medicines mapping
        for medicine in MEDICINES_DATABASE:
            for symptom in medicine['indications']:
                if symptom not in self.symptom_to_medicines:
                    self.symptom_to_medicines[symptom] = []
                self.symptom_to_medicines[symptom].append(medicine['name'])
        
        # Generate samples
        for _ in range(1000):
            # Randomly select 1-5 symptoms
            num_symptoms = np.random.randint(1, 6)
            symptoms = np.random.choice(SYMPTOMS_LIST, size=num_symptoms, replace=False).tolist()
            
            # Get relevant medicines for these symptoms
            medicines = set()
            for symptom in symptoms:
                if symptom in self.symptom_to_medicines:
                    medicines.update(self.symptom_to_medicines[symptom])
            
            if medicines:
                training_data.append({
                    'symptoms': symptoms,
                    'medicines': list(medicines)
                })
        
        return training_data
    
    def train(self):
        """Train the machine learning model"""
        print("Generating training data...")
        training_data = self.generate_training_data()
        
        # Prepare data
        symptoms_list = [item['symptoms'] for item in training_data]
        medicines_list = [item['medicines'] for item in training_data]
        
        # Encode symptoms and medicines
        self.symptom_encoder = MultiLabelBinarizer()
        X = self.symptom_encoder.fit_transform(symptoms_list)
        
        self.medicine_encoder = MultiLabelBinarizer()
        y = self.medicine_encoder.fit_transform(medicines_list)
        
        print(f"Training with {len(training_data)} samples...")
        print(f"Features: {X.shape}, Labels: {y.shape}")
        
        # Train model
        base_classifier = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.model = MultiOutputClassifier(base_classifier, n_jobs=-1)
        self.model.fit(X, y)
        
        print("Training completed!")
        
        # Save model
        self.save_model()
    
    def save_model(self):
        """Save trained model and encoders"""
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)
        joblib.dump({
            'symptom_encoder': self.symptom_encoder,
            'medicine_encoder': self.medicine_encoder,
            'symptom_to_medicines': self.symptom_to_medicines
        }, self.encoders_path)
        print(f"Model saved to {self.model_path}")
    
    def load_model(self):
        """Load trained model and encoders"""
        if os.path.exists(self.model_path) and os.path.exists(self.encoders_path):
            self.model = joblib.load(self.model_path)
            encoders = joblib.load(self.encoders_path)
            self.symptom_encoder = encoders['symptom_encoder']
            self.medicine_encoder = encoders['medicine_encoder']
            self.symptom_to_medicines = encoders['symptom_to_medicines']
            print("Model loaded successfully!")
            return True
        return False
    
    def predict(self, symptoms):
        """Predict medicines for given symptoms"""
        if not self.model:
            if not self.load_model():
                self.train()
        
        # Encode symptoms
        X = self.symptom_encoder.transform([symptoms])
        
        # Get predictions with probabilities
        predictions = self.model.predict(X)[0]
        
        # Get confidence scores
        confidences = []
        for i, estimator in enumerate(self.model.estimators_):
            proba = estimator.predict_proba(X)[0]
            if len(proba) > 1:
                confidences.append(proba[1])
            else:
                confidences.append(0.0)
        
        # Get predicted medicines
        predicted_medicines = []
        for i, pred in enumerate(predictions):
            if pred == 1:
                medicine_name = self.medicine_encoder.classes_[i]
                confidence = float(confidences[i])
                predicted_medicines.append({
                    'name': medicine_name,
                    'confidence': confidence
                })
        
        # Sort by confidence
        predicted_medicines.sort(key=lambda x: x['confidence'], reverse=True)
        
        return predicted_medicines[:10]  # Return top 10


if __name__ == "__main__":
    model = MedicineRecommendationModel()
    model.train()
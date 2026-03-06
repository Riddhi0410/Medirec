import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { API } from "../App";
import { 
  Activity, 
  AlertCircle, 
  Pill, 
  Shield,
  Stethoscope,
  Plus,
  X
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    disease: "",
    symptoms: [],
    age: "",
    gender: "",
    allergies: [],
    chronic_conditions: [],
    current_medications: []
  });
  
  // Temporary input states
  const [allergyInput, setAllergyInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");
  const [medicationInput, setMedicationInput] = useState("");

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const response = await axios.get(`${API}/symptoms`);
      setAvailableSymptoms(response.data.symptoms);
    } catch (error) {
      console.error("Error fetching symptoms:", error);
    }
  };

  const handleSymptomToggle = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const addItem = (field, value, setValue) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setValue("");
    }
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.symptoms.length === 0) {
      alert("Please select at least one symptom");
      return;
    }
    
    if (!formData.age || !formData.gender) {
      alert("Please fill in age and gender");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age)
      };

      const response = await axios.post(`${API}/recommend`, payload);
      
      // Navigate to results page with data
      navigate('/results', { 
        state: { 
          results: response.data,
          formData: formData
        } 
      });
    } catch (error) {
      console.error("Error getting recommendations:", error);
      alert("Error getting recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Noise Texture */}
      <div className="noise-texture"></div>
      
      {/* Abstract Background */}
      <div className="molecule-bg w-96 h-96 bg-primary rounded-full absolute top-20 right-10 -z-10"></div>
      <div className="molecule-bg w-64 h-64 bg-accent rounded-full absolute bottom-20 left-10 -z-10"></div>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12 max-w-7xl"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-primary/10 p-6 rounded-2xl">
              <Stethoscope className="w-16 h-16 text-primary" strokeWidth={1.5} />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-manrope text-primary mb-4">
            AI Medicine Recommender
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
            Get safe, personalized over-the-counter medication recommendations based on your symptoms and health profile.
          </p>
        </div>

        {/* Main Form */}
        <Card className="glass-card max-w-3xl mx-auto rounded-2xl shadow-xl" data-testid="recommendation-form">
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-manrope text-primary flex items-center gap-2">
              <Activity className="w-8 h-8" />
              Health Assessment
            </CardTitle>
            <CardDescription className="text-base">
              Fill in your information to get personalized medicine recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Disease (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="disease" className="text-sm font-medium uppercase tracking-wider text-slate-500">
                  Disease (Optional)
                </Label>
                <Input
                  id="disease"
                  data-testid="disease-input"
                  placeholder="e.g., Common Cold, Flu"
                  value={formData.disease}
                  onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                  className="rounded-xl h-12"
                />
              </div>

              {/* Symptoms */}
              <div className="space-y-3">
                <Label className="text-sm font-medium uppercase tracking-wider text-slate-500">
                  Symptoms * (Select all that apply)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-4 bg-slate-50 rounded-xl">
                  {availableSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        data-testid={`symptom-${symptom}`}
                        checked={formData.symptoms.includes(symptom)}
                        onCheckedChange={() => handleSymptomToggle(symptom)}
                      />
                      <label
                        htmlFor={symptom}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {symptom}
                      </label>
                    </div>
                  ))}
                </div>
                {formData.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.symptoms.map((symptom) => (
                      <Badge key={symptom} variant="secondary" className="px-3 py-1">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Age and Gender */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium uppercase tracking-wider text-slate-500">
                    Age *
                  </Label>
                  <Input
                    id="age"
                    data-testid="age-input"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="rounded-xl h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium uppercase tracking-wider text-slate-500">
                    Gender *
                  </Label>
                  <select
                    id="gender"
                    data-testid="gender-select"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-xl border-slate-200 bg-white/50 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 px-3"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Allergies */}
              <div className="space-y-2">
                <Label className="text-sm font-medium uppercase tracking-wider text-slate-500">
                  Known Allergies
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter an allergy and press Add"
                    data-testid="allergy-input"
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('allergies', allergyInput, setAllergyInput))}
                    className="rounded-xl h-12"
                  />
                  <Button
                    type="button"
                    data-testid="add-allergy-btn"
                    onClick={() => addItem('allergies', allergyInput, setAllergyInput)}
                    className="rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.allergies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2" data-testid="allergies-list">
                    {formData.allergies.map((allergy, index) => (
                      <Badge key={index} className="px-3 py-1 bg-rose-100 text-rose-800 border-rose-200 flex items-center gap-1">
                        {allergy}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeItem('allergies', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Chronic Conditions */}
              <div className="space-y-2">
                <Label className="text-sm font-medium uppercase tracking-wider text-slate-500">
                  Chronic Conditions
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a condition and press Add"
                    data-testid="condition-input"
                    value={conditionInput}
                    onChange={(e) => setConditionInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('chronic_conditions', conditionInput, setConditionInput))}
                    className="rounded-xl h-12"
                  />
                  <Button
                    type="button"
                    data-testid="add-condition-btn"
                    onClick={() => addItem('chronic_conditions', conditionInput, setConditionInput)}
                    className="rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.chronic_conditions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2" data-testid="conditions-list">
                    {formData.chronic_conditions.map((condition, index) => (
                      <Badge key={index} className="px-3 py-1 bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                        {condition}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeItem('chronic_conditions', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Current Medications */}
              <div className="space-y-2">
                <Label className="text-sm font-medium uppercase tracking-wider text-slate-500">
                  Current Medications
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a medication and press Add"
                    data-testid="medication-input"
                    value={medicationInput}
                    onChange={(e) => setMedicationInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('current_medications', medicationInput, setMedicationInput))}
                    className="rounded-xl h-12"
                  />
                  <Button
                    type="button"
                    data-testid="add-medication-btn"
                    onClick={() => addItem('current_medications', medicationInput, setMedicationInput)}
                    className="rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.current_medications.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2" data-testid="medications-list">
                    {formData.current_medications.map((medication, index) => (
                      <Badge key={index} className="px-3 py-1 bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
                        {medication}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeItem('current_medications', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  data-testid="submit-recommendation-btn"
                  disabled={loading}
                  className="w-full rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl h-14 text-lg font-semibold"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Activity className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Pill className="w-5 h-5" />
                      Get Recommendations
                    </span>
                  )}
                </Button>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Medical Disclaimer:</strong> This tool provides informational recommendations only and is not a substitute for professional medical advice. Always consult with a healthcare provider before taking any medication.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto"
        >
          <Card className="glass-card rounded-2xl hover-lift">
            <CardContent className="pt-6 text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold font-manrope mb-2">Safety First</h3>
              <p className="text-slate-600 text-sm">
                Comprehensive safety checks for allergies, contraindications, and drug interactions
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl hover-lift">
            <CardContent className="pt-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-blue-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold font-manrope mb-2">AI-Powered</h3>
              <p className="text-slate-600 text-sm">
                Machine learning model trained on medical data for accurate recommendations
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl hover-lift">
            <CardContent className="pt-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="w-8 h-8 text-purple-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold font-manrope mb-2">OTC Medicines</h3>
              <p className="text-slate-600 text-sm">
                Focus on safe over-the-counter medications with clear dosage information
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default HomePage;
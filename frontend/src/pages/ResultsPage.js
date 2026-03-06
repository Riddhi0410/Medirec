import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ArrowLeft,
  Pill,
  Info,
  Search,
  Filter
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Input } from "../components/ui/input";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const results = location.state?.results;
  const formData = location.state?.formData;

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [safetyFilter, setSafetyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Get unique categories
  const categories = useMemo(() => {
    if (!results) return [];
    const cats = new Set(results.recommendations.map(m => m.category));
    return Array.from(cats).sort();
  }, [results]);

  // Filter and search logic
  const filteredResults = useMemo(() => {
    if (!results) return [];
    return results.recommendations.filter(medicine => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.generic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Safety filter
      const matchesSafety = safetyFilter === "all" || 
        medicine.safety_status === safetyFilter;

      // Category filter
      const matchesCategory = categoryFilter === "all" || 
        medicine.category === categoryFilter;

      return matchesSearch && matchesSafety && matchesCategory;
    });
  }, [results, searchTerm, safetyFilter, categoryFilter]);

  if (!results) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg text-slate-600 mb-4">No results found</p>
        <Button onClick={() => navigate('/')}>Go Back</Button>
      </div>
    );
  }

  const getSafetyIcon = (status) => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="w-6 h-6 text-emerald-600" />;
      case 'caution':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case 'unsafe':
        return <XCircle className="w-6 h-6 text-rose-600" />;
      default:
        return <Info className="w-6 h-6 text-slate-600" />;
    }
  };

  const getSafetyBadgeClass = (status) => {
    switch (status) {
      case 'safe':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'caution':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'unsafe':
        return 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getSafetyMessage = (status) => {
    switch (status) {
      case 'safe':
        return 'Safe to use';
      case 'caution':
        return 'Use with caution';
      case 'unsafe':
        return 'Not recommended';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Noise Texture */}
      <div className="noise-texture"></div>
      
      {/* Abstract Background */}
      <div className="molecule-bg w-96 h-96 bg-primary rounded-full absolute top-20 left-10 -z-10"></div>
      <div className="molecule-bg w-64 h-64 bg-accent rounded-full absolute bottom-20 right-10 -z-10"></div>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12 max-w-7xl"
      >
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            data-testid="back-btn"
            className="mb-4 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Search
          </Button>
          
          <div className="glass-card rounded-2xl p-6 mb-6">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-manrope text-primary mb-4">
              Your Medicine Recommendations
            </h1>
            <p className="text-base leading-relaxed text-slate-600">
              Based on your symptoms: <strong>{formData?.symptoms.join(', ')}</strong>
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Found {results.total_found} recommendation{results.total_found !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">Search & Filter Results</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search medicines..."
                  data-testid="medicine-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl h-12"
                />
              </div>

              {/* Safety Filter */}
              <select
                value={safetyFilter}
                onChange={(e) => setSafetyFilter(e.target.value)}
                data-testid="safety-filter"
                className="w-full rounded-xl border-slate-200 bg-white/50 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 px-3"
              >
                <option value="all">All Safety Levels</option>
                <option value="safe">✓ Safe to use</option>
                <option value="caution">⚠ Use with caution</option>
                <option value="unsafe">✗ Not recommended</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                data-testid="category-filter"
                className="w-full rounded-xl border-slate-200 bg-white/50 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 px-3"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-slate-600">
              Showing <strong>{filteredResults.length}</strong> of <strong>{results.total_found}</strong> medicines
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="space-y-6" data-testid="results-list">
          {filteredResults.length === 0 ? (
            <Card className="glass-card rounded-2xl p-8 text-center">
              <p className="text-lg text-slate-600">No medicines match your filters. Try adjusting your search criteria.</p>
            </Card>
          ) : (
            filteredResults.map((medicine, index) => (
            <motion.div
              key={medicine.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card rounded-2xl shadow-lg hover-lift" data-testid={`medicine-card-${medicine.name}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Pill className="w-8 h-8 text-primary" />
                        <div>
                          <CardTitle className="text-2xl font-bold font-manrope text-primary">
                            {medicine.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {medicine.generic_name} • {medicine.category}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    
                    {/* Safety Badge */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        {getSafetyIcon(medicine.safety_status)}
                      </div>
                      <Badge 
                        className={`${getSafetyBadgeClass(medicine.safety_status)} px-3 py-1`}
                        data-testid={`safety-badge-${medicine.name}`}
                      >
                        {getSafetyMessage(medicine.safety_status)}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Confidence Score */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-600">Confidence Score</span>
                      <span className="text-sm font-bold text-primary">{(medicine.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${medicine.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Warnings Section */}
                  {medicine.warnings && medicine.warnings.length > 0 && (
                    <div 
                      className={`mb-6 p-4 rounded-xl border-2 ${
                        medicine.safety_status === 'unsafe' 
                          ? 'bg-rose-50 border-rose-200' 
                          : medicine.safety_status === 'caution'
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-emerald-50 border-emerald-200'
                      }`}
                      data-testid={`warnings-${medicine.name}`}
                    >
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        {getSafetyIcon(medicine.safety_status)}
                        Safety Information
                      </h4>
                      <ul className="space-y-1">
                        {medicine.warnings.map((warning, idx) => (
                          <li key={idx} className="text-sm">
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Details Accordion */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="details">
                      <AccordionTrigger className="text-base font-semibold">
                        Medicine Details
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {/* Dosage */}
                          <div>
                            <h5 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mb-2">
                              Recommended Dosage
                            </h5>
                            <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                              {medicine.dosage}
                            </p>
                          </div>

                          {/* Indications */}
                          <div>
                            <h5 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mb-2">
                              Used For
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {medicine.indications.map((indication, idx) => (
                                <Badge key={idx} variant="outline" className="px-3 py-1">
                                  {indication}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* FDA Data if available */}
                          {medicine.fda_data && (
                            <div className="border-t pt-4">
                              <h5 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                FDA Database Information
                              </h5>
                              
                              {medicine.fda_data.brand_names && medicine.fda_data.brand_names.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-xs text-slate-500">Brand Names:</p>
                                  <p className="text-sm">{medicine.fda_data.brand_names.slice(0, 3).join(', ')}</p>
                                </div>
                              )}
                              
                              {medicine.fda_data.manufacturer && medicine.fda_data.manufacturer.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-xs text-slate-500">Manufacturer:</p>
                                  <p className="text-sm">{medicine.fda_data.manufacturer[0]}</p>
                                </div>
                              )}

                              {medicine.fda_data.route && medicine.fda_data.route.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-xs text-slate-500">Route:</p>
                                  <p className="text-sm capitalize">{medicine.fda_data.route.join(', ')}</p>
                                </div>
                              )}
                              
                              <p className="text-xs text-slate-400 mt-2">
                                ✓ Data sourced from FDA OpenFDA Database
                              </p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          ))
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 glass-card rounded-2xl p-6 border-2 border-amber-200">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-2">Important Medical Disclaimer</h3>
              <p className="text-sm text-slate-700">
                These recommendations are generated by an AI system for informational purposes only. 
                They do not constitute medical advice, diagnosis, or treatment. Always consult with a 
                qualified healthcare provider before starting any new medication. If you experience 
                severe symptoms or a medical emergency, seek immediate professional medical attention.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ResultsPage;

import { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faRulerCombined, faWater, faMapMarkerAlt, faSpinner, faCheck, faExclamationTriangle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import API from '../context/api';

export default function CropDetailsForm() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [formData, setFormData] = useState({
    soil_type: '',
    feild_size: '',
    irrigation_type: '',
    present_crop: '',
    previous_crop: '',
    location: {
      latitude: null,
      
      longitude: null
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        p => resolve(p.coords),
        err => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const handleGetLocation = async () => {
    setLocationLoading(true);
    setLocationError('');
    
    try {
      const coords = await getLocation();
      setFormData(prev => ({
        ...prev,
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude
        }
      }));
      toast.success('Location captured successfully!');
    } catch (error) {
      setLocationError('Failed to get location. Please try again.');
      toast.error('Unable to get your location. Please check your browser settings.');
      console.error('Location error:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => prev - 1);
  
  const handleSubmit = async () => {
    if (!formData.location.latitude || !formData.location.longitude) {
      toast.error('Please capture your location before submitting.');
      return;
    }

    if (!user?.id) {
      toast.error('User not found. Please login again.');
      navigate('/login');
      return;
    }

    try {
      const cropData = {
        farmer_id: user.id,
        soil_type: formData.soil_type,
        feild_size: parseFloat(formData.feild_size),
        irrigation_type: formData.irrigation_type,
        present_crops: formData.present_crop,
        previous_crops: formData.previous_crop,
        location: {
          latitude: formData.location.latitude,
          longitude: formData.location.longitude
        }
      };

      const response = await API.post('/crop/details_input', cropData);
      
      if (response.data) {
        toast.success('Crop details saved successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save crop details. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[#365949] font-semibold flex items-center gap-2">
                <FontAwesomeIcon icon={faLeaf} />
                Soil Type
              </label>
              <input
                type="text"
                value={formData.soil_type}
                onChange={(e) => handleInputChange('soil_type', e.target.value)}
                placeholder="Enter soil type (e.g., Clay, Sandy, Loamy)"
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#365949] font-semibold flex items-center gap-2">
                <FontAwesomeIcon icon={faRulerCombined} />
                Field Size (acres)
              </label>
              <input
                type="number"
                value={formData.feild_size}
                onChange={(e) => handleInputChange('feild_size', e.target.value)}
                placeholder="Enter field size in acres"
                min="0"
                step="0.01"
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleNext}
                className="flex-1 bg-[#365949] text-white py-3 rounded-lg font-semibold hover:bg-[#2d4a3a] transition"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[#365949] font-semibold flex items-center gap-2">
                <FontAwesomeIcon icon={faWater} />
                Irrigation Method
              </label>
              <input
                type="text"
                value={formData.irrigation_type}
                onChange={(e) => handleInputChange('irrigation_type', e.target.value)}
                placeholder="Enter irrigation method (e.g., Drip, Sprinkler, Flood)"
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#365949] font-semibold flex items-center gap-2">
                <FontAwesomeIcon icon={faLeaf} />
                Present Crop
              </label>
              <input
                type="text"
                value={formData.present_crop}
                onChange={(e) => handleInputChange('present_crop', e.target.value)}
                placeholder="Enter soil type (e.g., Clay, Sandy, Loamy)"
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#365949] font-semibold flex items-center gap-2">
                <FontAwesomeIcon icon={faLeaf} />
                Previous Crop
              </label>
              <input
                type="text"
                value={formData.previous_crop}
                onChange={(e) => handleInputChange('previous_crop', e.target.value)}
                placeholder="Enter soil type (e.g., Clay, Sandy, Loamy)"
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20"
              />
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={handleBack}
                className="flex-1 border-2 border-[#365949] text-[#365949] py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-[#365949] text-white py-3 rounded-lg font-semibold hover:bg-[#2d4a3a] transition"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <label className="text-[#365949] font-semibold flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                Location
              </label>
              
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <button
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    locationLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#365949] hover:bg-[#2d4a3a] text-white'
                  }`}
                >
                  {locationLoading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      Get My Location
                    </>
                  )}
                </button>
                
                {formData.location.latitude && formData.location.longitude && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <FontAwesomeIcon icon={faCheck} />
                      <span className="font-semibold">Location Captured!</span>
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      Lat: {formData.location.latitude.toFixed(6)}, 
                      Lng: {formData.location.longitude.toFixed(6)}
                    </div>
                  </div>
                )}
                
                {locationError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <FontAwesomeIcon icon={faExclamationTriangle} />
                      <span className="font-semibold">Error</span>
                    </div>
                    <div className="text-sm text-red-600 mt-1">{locationError}</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between gap-4">
              <button
                onClick={handleBack}
                className="flex-1 border-2 border-[#365949] text-[#365949] py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#365949] text-white py-3 rounded-lg font-semibold hover:bg-[#2d4a3a] transition"
                disabled={!formData.location.latitude || !formData.location.longitude}
              >
                Submit
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 font-sans pt-24">
      <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-lg">
        {/* Back Button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-[#365949] hover:bg-gray-100 rounded-full transition-colors mr-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
          <h2 className="text-3xl font-bold text-[#365949] flex-1 text-center">
            Crop Details
          </h2>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="mb-6">
          <div className="flex justify-between relative">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center z-10 relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition ${
                    step <= currentStep ? 'bg-[#365949] text-white' : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                <div className={`text-xs font-medium text-center ${step <= currentStep ? 'text-[#365949]' : 'text-gray-400'}`}>
                  {step === 1 ? 'Field Info' : step === 2 ? 'Irrigation' : 'Location'}
                </div>
              </div>
            ))}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-300 z-0"></div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-[#365949] mb-6">
          Step {currentStep} of 3: {currentStep === 1 ? 'Field Information' : currentStep === 2 ? 'Crop Details' : 'Location Details'}
        </h3>

        {renderStep()}
      </div>
    </div>
  );
}

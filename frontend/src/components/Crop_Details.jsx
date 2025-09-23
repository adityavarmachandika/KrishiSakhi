import { useState } from 'react';

export default function CropDetailsForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    soilType: '',
    fieldSize: '',
    cropPattern: '',
    anotherField: '',
    fertilizer: '',
    irrigation: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => prev - 1);
  const handleSubmit = () => {
    console.log('Form Data:', formData);
    alert('Form submitted! Check the console for details.');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[#365949] font-semibold">Soil Type</label>
              <input
                type="text"
                value={formData.soilType}
                onChange={(e) => handleInputChange('soilType', e.target.value)}
                placeholder="Enter soil type (e.g., Clay, Sandy, Loamy)"
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#365949] font-semibold">Size of Field (acres)</label>
              <input
                type="number"
                value={formData.fieldSize}
                onChange={(e) => handleInputChange('fieldSize', e.target.value)}
                placeholder="Enter field size in acres"
                min="0"
                step="0.1"
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
              <label className="text-[#365949] font-semibold">Crop Pattern</label>
              <input
                type="text"
                value={formData.cropPattern}
                onChange={(e) => handleInputChange('cropPattern', e.target.value)}
                placeholder="Enter crop pattern (e.g., Monoculture, Rotation)"
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#365949] font-semibold">Previous Crop</label>
              <input
                type="text"
                value={formData.anotherField}
                onChange={(e) => handleInputChange('anotherField', e.target.value)}
                placeholder="Enter previous crop grown"
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
            <div className="flex flex-col gap-2">
              <label className="text-[#365949] font-semibold">Fertilizer Type</label>
              <input
                type="text"
                value={formData.fertilizer}
                onChange={(e) => handleInputChange('fertilizer', e.target.value)}
                placeholder="Enter fertilizer type (e.g., Organic, NPK)"
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#365949] font-semibold">Irrigation Method</label>
              <input
                type="text"
                value={formData.irrigation}
                onChange={(e) => handleInputChange('irrigation', e.target.value)}
                placeholder="Enter irrigation method (e.g., Drip, Sprinkler)"
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
                onClick={handleSubmit}
                className="flex-1 bg-[#365949] text-white py-3 rounded-lg font-semibold hover:bg-[#2d4a3a] transition"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-[#365949] text-center mb-8">
          Crop Details
        </h2>

        <div className="mb-8">
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
                  {step === 1 ? 'Field Info' : step === 2 ? 'Crop Info' : 'Resources'}
                </div>
              </div>
            ))}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-300 z-0"></div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-[#365949] mb-6">
          Step {currentStep} of 3: {currentStep === 1 ? 'Field Information' : currentStep === 2 ? 'Crop Information' : 'Resource Details'}
        </h3>

        {renderStep()}
      </div>
    </div>
  );
}

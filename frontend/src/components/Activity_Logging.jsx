import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faCalendarAlt, 
  faClipboardList, 
  faLeaf, 
  faSeedling, 
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import API from '../context/api';

const Activity_Logging = () => {
  const { user, cropDetails, fetchCropDetails } = useContext(UserContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    log: '',
    crop_condition: ''
  });

  // Fetch activities on component mount
  useEffect(() => {
    if (user?.id) {
      fetchActivities();
      // Also fetch crop details if not available
      if (!cropDetails) {
        fetchCropDetails(user.id);
      }
    }
  }, [user, cropDetails]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/activity/fetch_activities/${user.id}`);
      setActivities(response.data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.log.trim() || !formData.crop_condition.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!user?.id) {
      toast.error('Please login to add activities');
      return;
    }

    // Handle cropDetails as array or object
    const cropData = Array.isArray(cropDetails) ? cropDetails[0] : cropDetails;
    
    if (!cropData?._id && !cropData?.id) {
      toast.error('Crop details not found. Trying to fetch crop information...');
      
      // Try to fetch crop details
      try {
        const details = await fetchCropDetails(user.id);
        const detailsData = Array.isArray(details) ? details[0] : details;
        if (!detailsData?._id && !detailsData?.id) {
          toast.error('No crop information found. Please add crop details first.');
          return;
        }
      } catch (error) {
        console.error('Failed to fetch crop details:', error);
        toast.error('Failed to retrieve crop information. Please try again.');
        return;
      }
    }

    try {
      setSubmitting(true);
      
      // Get the most current crop details (might have been just fetched)
      const currentCropDetails = cropDetails || (await fetchCropDetails(user.id));
      const cropData = Array.isArray(currentCropDetails) ? currentCropDetails[0] : currentCropDetails;
      
      const activityData = {
        farmer_id: user.id,
        log: formData.log.trim(),
        crop_condition: formData.crop_condition.trim(),
        crop_id: cropData?._id || cropData?.id
      };

      const response = await API.post('/activity/log', activityData);
      
      if (response.data) {
        toast.success('Activity logged successfully!');
        setFormData({ log: '', crop_condition: '' });
        setShowForm(false);
        // Refresh activities list
        await fetchActivities();
      }
    } catch (error) {
      console.error('Error logging activity:', error);
      toast.error(error.response?.data?.message || 'Failed to log activity');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getConditionIcon = (condition) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('good') || lowerCondition.includes('healthy') || lowerCondition.includes('excellent')) {
      return { icon: faCheckCircle, color: 'text-green-500' };
    } else if (lowerCondition.includes('warning') || lowerCondition.includes('moderate') || lowerCondition.includes('fair')) {
      return { icon: faExclamationTriangle, color: 'text-yellow-500' };
    } else if (lowerCondition.includes('poor') || lowerCondition.includes('bad') || lowerCondition.includes('critical')) {
      return { icon: faTimesCircle, color: 'text-red-500' };
    } else {
      return { icon: faInfoCircle, color: 'text-blue-500' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#365949] flex items-center gap-3">
                <FontAwesomeIcon icon={faClipboardList} />
                Activity Logging
              </h1>
              <p className="text-gray-600 mt-2">Track your farming activities and crop conditions</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#365949] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2d4a3a] transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              Add Activity
            </button>
          </div>
        </div>

        {/* Add Activity Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#365949] mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} />
              Log New Activity
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Activity Log */}
                <div className="md:col-span-2">
                  <label className="text-[#365949] font-semibold mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faClipboardList} />
                    Activity Log
                  </label>
                  <textarea
                    value={formData.log}
                    onChange={(e) => handleInputChange('log', e.target.value)}
                    placeholder="Describe your farming activity (e.g., Applied fertilizer to wheat field, Irrigated tomato plants...)"
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20 resize-vertical"
                    required
                  />
                </div>

                {/* Crop Condition */}
                <div className="md:col-span-2">
                  <label className="text-[#365949] font-semibold mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faLeaf} />
                    Crop Condition
                  </label>
                  <select
                    value={formData.crop_condition}
                    onChange={(e) => handleInputChange('crop_condition', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#365949] focus:ring-2 focus:ring-[#365949]/20"
                    required
                  >
                    <option value="">Select crop condition</option>
                    <option value="Excellent - Thriving crops with no issues">Excellent - Thriving crops with no issues</option>
                    <option value="Good - Healthy growth with minor concerns">Good - Healthy growth with minor concerns</option>
                    <option value="Fair - Average condition, needs attention">Fair - Average condition, needs attention</option>
                    <option value="Poor - Struggling crops, immediate action needed">Poor - Struggling crops, immediate action needed</option>
                    <option value="Critical - Severe issues, risk of crop loss">Critical - Severe issues, risk of crop loss</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-[#365949] text-white rounded-lg font-semibold hover:bg-[#2d4a3a] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Logging...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPlus} />
                      Log Activity
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activities List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-[#365949] mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarAlt} />
            Recent Activities
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-[#365949] mb-4" />
              <p className="text-gray-500">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FontAwesomeIcon icon={faSeedling} className="text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No activities logged yet</p>
              <p className="text-gray-400">Start by adding your first farming activity!</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-[#365949] text-white px-6 py-2 rounded-lg hover:bg-[#2d4a3a] transition-colors"
              >
                Add First Activity
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const conditionInfo = getConditionIcon(activity.crop_condition);
                return (
                  <div
                    key={activity._id || index}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#365949] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-[#365949]" />
                        <span className="text-sm text-gray-500 font-medium">
                          {formatDate(activity.date)}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 ${conditionInfo.color}`}>
                        <FontAwesomeIcon icon={conditionInfo.icon} />
                        <span className="text-sm font-medium">Condition Status</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h3 className="text-[#365949] font-semibold mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faClipboardList} />
                        Activity Log
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{activity.log}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-[#365949] font-semibold mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faLeaf} />
                        Crop Condition
                      </h3>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${conditionInfo.color} bg-opacity-10`}>
                        <FontAwesomeIcon icon={conditionInfo.icon} />
                        {activity.crop_condition}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity_Logging;
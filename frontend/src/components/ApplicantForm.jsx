import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Save, Shield, ChevronDown } from 'lucide-react';

const ApplicantForm = ({ applicant, onClose }) => {
  const [formData, setFormData] = useState({
    control_number: '',
    first_name: '',
    last_name: '',
    city: 'Bacolod City',
    is_blacklisted: false,
    status: 'Pending'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locations, setLocations] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({
    control_number: '',
    first_name: '',
    last_name: ''
  });
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityDropdownRef = useRef(null);

  useEffect(() => {
    fetchLocations();
    if (applicant) {
      setFormData({
        control_number: applicant.control_number,
        first_name: applicant.first_name,
        last_name: applicant.last_name,
        city: applicant.city,
        is_blacklisted: applicant.is_blacklisted,
        status: applicant.status || 'Pending'
      });
      setCitySearch(applicant.city);
    }
  }, [applicant]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Validation functions
  const validateControlNumber = (value) => {
    // Format: Letters, numbers, hyphens only, 5-20 characters
    const regex = /^[A-Z0-9-]{5,20}$/;
    if (!value) return 'Control number is required';
    if (!regex.test(value.toUpperCase())) {
      return 'Control number must be 5-20 characters (letters, numbers, hyphens only)';
    }
    return '';
  };

  const validateName = (value, fieldName) => {
    // Only letters, spaces, dots, and hyphens allowed, 2-50 characters
    const regex = /^[A-Za-zÑñ.\s-]{2,50}$/;
    if (!value) return `${fieldName} is required`;
    if (!regex.test(value)) {
      return `${fieldName} must be 2-50 characters (letters only, no numbers or special characters)`;
    }
    if (value.trim().length < 2) {
      return `${fieldName} must be at least 2 characters`;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    let error = '';

    // Real-time validation and sanitization
    if (name === 'control_number') {
      // Only allow alphanumeric and hyphens, convert to uppercase
      newValue = value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20);
      error = validateControlNumber(newValue);
    } else if (name === 'first_name' || name === 'last_name') {
      // Only allow letters, spaces, dots, and hyphens
      newValue = value.replace(/[^A-Za-zÑñ.\s-]/g, '').slice(0, 50);
      error = validateName(newValue, name === 'first_name' ? 'First name' : 'Last name');
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Filter cities based on search term
  const getFilteredCities = () => {
    if (!citySearch) return locations;
    
    return locations.filter(city => 
      city.toLowerCase().includes(citySearch.toLowerCase())
    );
  };

  // Group filtered cities by province
  const getGroupedFilteredCities = () => {
    const filtered = getFilteredCities();
    
    const occidentalCities = ['Bacolod City', 'Bago City', 'Cadiz City', 'Escalante City', 'Himamaylan City',
      'Kabankalan City', 'La Carlota City', 'Sagay City', 'San Carlos City', 'Silay City',
      'Sipalay City', 'Talisay City', 'Victorias City'];
    
    const occidentalMunicipalities = ['Binalbagan', 'Calatrava', 'Candoni', 'Cauayan', 'Enrique B. Magalona',
      'Hinigaran', 'Hinoba-an', 'Ilog', 'Isabela', 'La Castellana',
      'Manapla', 'Moises Padilla', 'Murcia', 'Pontevedra', 'Pulupandan',
      'Salvador Benedicto', 'San Enrique', 'Toboso', 'Valladolid'];
    
    const orientalCities = ['Dumaguete City', 'Bais City', 'Canlaon City', 'Guihulngan City', 'Tanjay City'];
    
    const orientalMunicipalities = ['Amlan', 'Ayungon', 'Bacong', 'Basay', 'Bayawan',
      'Bindoy', 'Dauin', 'Jimalalud', 'La Libertad', 'Mabinay',
      'Manjuyod', 'Pamplona', 'San Jose', 'Santa Catalina', 'Siaton',
      'Sibulan', 'Tayasan', 'Valencia', 'Vallehermoso', 'Zamboanguita'];
    
    return {
      occidental: filtered.filter(loc => occidentalCities.includes(loc) || occidentalMunicipalities.includes(loc)),
      oriental: filtered.filter(loc => orientalCities.includes(loc) || orientalMunicipalities.includes(loc))
    };
  };

  const handleCitySelect = (city) => {
    setFormData(prev => ({ ...prev, city }));
    setCitySearch(city);
    setShowCityDropdown(false);
  };

  const handleCitySearchChange = (e) => {
    setCitySearch(e.target.value);
    setShowCityDropdown(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const controlNumError = validateControlNumber(formData.control_number);
    const firstNameError = validateName(formData.first_name, 'First name');
    const lastNameError = validateName(formData.last_name, 'Last name');

    setFieldErrors({
      control_number: controlNumError,
      first_name: firstNameError,
      last_name: lastNameError
    });

    // Check if any errors exist
    if (controlNumError || firstNameError || lastNameError) {
      setError('Please fix all validation errors before submitting');
      return;
    }

    setLoading(true);

    try {
      if (applicant) {
        // Update existing applicant
        await axios.put(`http://localhost:5000/api/applicants/${applicant.id}`, formData);
      } else {
        // Create new applicant
        await axios.post('http://localhost:5000/api/applicants', formData);
      }
      onClose();
    } catch (err) {
      console.error('Error saving applicant:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to save applicant. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl border border-border w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text">
            {applicant ? 'Edit Applicant' : 'Add New Applicant'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-text transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Control Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Control Number *
            </label>
            <input
              type="text"
              name="control_number"
              value={formData.control_number}
              onChange={handleChange}
              required
              className={`w-full bg-background text-text px-4 py-3 rounded-lg border ${
                fieldErrors.control_number ? 'border-danger' : 'border-border'
              } focus:outline-none focus:border-accent`}
              placeholder="e.g., CN-2024-001"
            />
            {fieldErrors.control_number && (
              <p className="text-danger text-sm mt-1">{fieldErrors.control_number}</p>
            )}
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className={`w-full bg-background text-text px-4 py-3 rounded-lg border ${
                fieldErrors.first_name ? 'border-danger' : 'border-border'
              } focus:outline-none focus:border-accent`}
              placeholder="Juan"
            />
            {fieldErrors.first_name && (
              <p className="text-danger text-sm mt-1">{fieldErrors.first_name}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className={`w-full bg-background text-text px-4 py-3 rounded-lg border ${
                fieldErrors.last_name ? 'border-danger' : 'border-border'
              } focus:outline-none focus:border-accent`}
              placeholder="Dela Cruz"
            />
            {fieldErrors.last_name && (
              <p className="text-danger text-sm mt-1">{fieldErrors.last_name}</p>
            )}
          </div>

          {/* City - Searchable Dropdown */}
          <div className="relative" ref={cityDropdownRef}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City/Municipality *
            </label>
            <div className="relative">
              <input
                type="text"
                value={citySearch}
                onChange={handleCitySearchChange}
                onFocus={() => setShowCityDropdown(true)}
                placeholder="Search city or municipality..."
                required
                className="w-full bg-background text-text px-4 py-3 pr-10 rounded-lg border border-border focus:outline-none focus:border-accent"
              />
              <ChevronDown 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                size={20} 
              />
            </div>
            
            {/* Dropdown List */}
            {showCityDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {locations.length === 0 ? (
                  <div className="px-4 py-3 text-gray-400 text-sm">Loading locations...</div>
                ) : getFilteredCities().length === 0 ? (
                  <div className="px-4 py-3 text-gray-400 text-sm">No cities found</div>
                ) : (
                  <>
                    {/* Negros Occidental */}
                    {getGroupedFilteredCities().occidental.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 bg-background sticky top-0">
                          Negros Occidental
                        </div>
                        {getGroupedFilteredCities().occidental.map((city) => (
                          <div
                            key={city}
                            onClick={() => handleCitySelect(city)}
                            className="px-4 py-2 hover:bg-background cursor-pointer text-text transition-colors"
                          >
                            {city}
                          </div>
                        ))}
                      </>
                    )}
                    
                    {/* Negros Oriental */}
                    {getGroupedFilteredCities().oriental.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 bg-background sticky top-0">
                          Negros Oriental
                        </div>
                        {getGroupedFilteredCities().oriental.map((city) => (
                          <div
                            key={city}
                            onClick={() => handleCitySelect(city)}
                            className="px-4 py-2 hover:bg-background cursor-pointer text-text transition-colors"
                          >
                            {city}
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Application Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background text-text rounded-lg border border-border focus:outline-none focus:border-accent"
            >
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          {/* Blacklist Toggle */}
          <div className="bg-background rounded-lg p-4 border border-border">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="text-danger" size={20} />
                <div>
                  <span className="block text-sm font-medium text-text">
                    Blacklist Account
                  </span>
                  <span className="text-xs text-gray-400">
                    Restricts control number modifications
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                name="is_blacklisted"
                checked={formData.is_blacklisted}
                onChange={handleChange}
                className="w-5 h-5 rounded border-border text-danger focus:ring-danger focus:ring-offset-0"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-background hover:bg-border text-text rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent hover:bg-accentHover text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicantForm;

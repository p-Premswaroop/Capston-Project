import { useState } from 'react';
import axiosInstance from '../lib/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Toast } from '../components/Toast';

const Create = () => {
  const [errorMessage, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createServiceRequest = async (e) => {
    e.preventDefault();
    const formData = {
      description: e.target[0].value,
      details: e.target[1].value
    };
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/CreateNewSerRequest', formData);
      setSuccessMessage('Service request submitted successfully!');
      setTimeout(() => {
        navigate('/serviceRequests');
      }, 1000);
    } catch (error) {
      console.error('Failed to create service request:', error);
      setError(error.response?.data?.message || 'Failed to create service request. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ maxWidth: '640px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/serviceRequests" className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
            <i className="ri-arrow-left-line"></i>
            <span>Back to Requests</span>
          </Link>

          <div className="page-title-group">
            <h1>
              New Service Request
            </h1>
          </div>
        </div>

        {errorMessage && (
          <div className="alert-banner error">
            <i className="alert-icon ri-error-warning-fill"></i>
            <div>{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <Toast type="success" title="Request Created" message={successMessage} />
        )}

        <div className="card-panel">
          <form onSubmit={createServiceRequest}>
            <div className="form-group">
              <label className="form-label" htmlFor="descriptionInput">
                Description
              </label>
              <input
                id="descriptionInput"
                type="text"
                className="input-field"
                placeholder="Enter the description..."
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="detailsInput">
                Details
              </label>
              <textarea
                id="detailsInput"
                className="textarea-field"
                placeholder="Enter the details..."
                required
                disabled={loading}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Request</span>
                  </>
                )}
              </button>

              <Link to="/serviceRequests" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Create;

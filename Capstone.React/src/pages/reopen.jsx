import React, { useEffect, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Toast } from '../components/Toast';
import { dateFormatter } from '../lib';

const Reopen = () => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getRequestById(id);
  }, [id]);

  const getRequestById = async (requestId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/GetRequestById?requestId=${requestId}`);
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      setRequest(response.data);
    } catch (err) {
      console.error('Failed to fetch request:', err);
      setError('Failed to fetch request details for reopening.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const justificationText = e.target.elements[0].value;

    if (!justificationText || !justificationText.trim()) {
      setError('Please provide a valid justification for reopening the request.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const updatedRequest = { ...request, justification: justificationText };
      const response = await axiosInstance.post(`/reopen`, updatedRequest);
      if (response.status === 200) {
        setSuccessMessage(`Service Request #${id} reopened successfully!`);
        setTimeout(() => {
          navigate('/serviceRequests');
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to reopen request:', err);
      setError(err.response?.data?.message || 'Failed to reopen request. Please try again.');
    } finally {
      setSubmitting(false);
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
              Reopen Request
            </h1>
          </div>
        </div>

        {error && (
          <div className="alert-banner error">
            <i className="alert-icon ri-error-warning-fill"></i>
            <div>{error}</div>
          </div>
        )}

        {successMessage && (
          <Toast type="success" title="Request Reopened" message={successMessage} />
        )}

        <div className="card-panel">
          {loading ? (
            <div className="loading-container" style={{ padding: '2rem' }}>
              <div className="spinner"></div>
              <p>Loading request details...</p>
            </div>
          ) : (
            <>
              <div className="details-list">
                <div className="detail-item">
                  <span className="detail-label">Request ID</span>
                  <span className="detail-value" style={{ color: '#818cf8', fontWeight: 700 }}>#{request?.requestId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Description</span>
                  <span className="detail-value">{request?.description || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Details</span>
                  <span className="detail-value">{request?.details || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Creation Date</span>
                  <span className="detail-value">{dateFormatter(request?.raisedOn) || 'N/A'}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="justification">
                    Justification
                  </label>
                  <textarea
                    id="justification"
                    className="textarea-field"
                    placeholder="Enter justification..."
                    required
                    disabled={submitting}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button type="submit" className="btn btn-purple" style={{ flex: 1 }} disabled={submitting}>
                    {submitting ? (
                      <>
                        <span>Reopening Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Reopen Request</span>
                      </>
                    )}
                  </button>

                  <Link to="/serviceRequests" className="btn btn-secondary">
                    Cancel
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reopen;
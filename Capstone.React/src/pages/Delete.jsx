import React, { useState, useEffect } from 'react';
import { getRequestById } from '../api/serviceRequest';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axiosInstance';
import Navbar from '../components/Navbar';
import { Toast } from '../components/Toast';
import { dateFormatter } from '../lib';

const Delete = () => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      await getRequestById(id, setRequest);
    } catch (err) {
      console.error('Error fetching request details:', err);
      setError('Failed to fetch request details.');
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (requestId) => {
    try {
      setDeleting(true);
      setError('');
      const response = await axiosInstance.delete(`/Delete?id=${requestId}`);
      if (response.status === 200) {
        setSuccessMessage(`Service Request #${requestId} deleted successfully.`);
        setTimeout(() => {
          navigate('/serviceRequests');
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to delete request:', err);
      setError('Failed to delete request. Please try again.');
    } finally {
      setDeleting(false);
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
        </div>

        {error && (
          <div className="alert-banner error">
            <i className="alert-icon ri-error-warning-fill"></i>
            <div>{error}</div>
          </div>
        )}

        {successMessage && (
          <Toast type="success" title="Deleted" message={successMessage} />
        )}

        <div className="card-panel">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Are you sure you want to delete?
            </p>
          </div>

          {loading ? (
            <div className="loading-container" style={{ padding: '2rem' }}>
              <div className="spinner"></div>
              <p>Loading request details...</p>
            </div>
          ) : (
            <>
              <div className="details-list">
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

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ flex: 1 }}
                  disabled={deleting}
                  onClick={() => deleteRequest(id)}
                >
                  {deleting ? (
                    <>
                      <span className="spinner"></span>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-delete-bin-line"></i>
                      <span>Confirm Delete</span>
                    </>
                  )}
                </button>

                <Link to="/serviceRequests" className="btn btn-secondary">
                  Cancel
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Delete;

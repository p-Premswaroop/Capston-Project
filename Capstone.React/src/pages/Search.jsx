import { useState } from 'react';
import axiosInstance from '../lib/axiosInstance';
import { STATUS } from '../lib/index';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ToastContainer } from '../components/Toast';

const SearchByName = () => {
  const [serviceRequests, setServiceRequests] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState([]);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm || !searchTerm.trim()) {
      setError('Please enter a username to search service requests.');
      addToast('warning', 'Input Required', 'Please enter a username to search.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/GetRequestByuserName?userName=${searchTerm.trim()}`);
      setServiceRequests(response.data || []);
      // if (!response.data || response.data.length === 0) {
      //   addToast('info', 'No Results', `No service requests found for user "${searchTerm}".`);
      // } else {
      //   addToast('success', 'Search Complete', `Found ${response.data.length} request(s) for "${searchTerm}".`);
      // }
    } catch (err) {
      console.error('Failed to search requests:', err);
      setError(err.response?.data?.message || 'Failed to search service requests. Please verify the username.');
      addToast('error', 'Search Error', 'Failed to retrieve service requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setServiceRequests(null);
    setError(null);
  };

  const handleCloseRequest = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      const response = await axiosInstance.get(`/CloseRequest?requestId=${requestId}`);
      if (response.status === 200) {
        addToast('success', 'Request Closed', `Service Request #${requestId} closed successfully.`);
        if (searchTerm) {
          handleSearch();
        }
      }
    } catch (err) {
      console.error('Failed to close request:', err);
      addToast('error', 'Action Failed', `Failed to close request #${requestId}.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadgeClass = (statusNum) => {
    const statusText = STATUS[statusNum] || 'NEW';
    switch (statusText.toUpperCase()) {
      case 'CLOSED':
        return 'status-badge closed';
      case 'REOPEN':
        return 'status-badge reopen';
      default:
        return 'status-badge new';
    }
  };

  const role = localStorage.getItem("role");

  return (
    <div className="app-container">
      <Navbar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <main className="main-content">
        <div className="page-header">
          <div className="page-title-group">
            <h1>
              Search Service Requests
            </h1>
          </div>

          <Link to="/serviceRequests" className="btn btn-secondary btn-sm">
            <i className="ri-arrow-left-line"></i>
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Search Filter Panel */}
        <div className="card-panel" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Enter username (e.g. john_doe)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-search-line"></i>
                    <span>Search</span>
                  </>
                )}
              </button>

              {searchTerm && (
                <button type="button" className="btn btn-secondary" onClick={handleClear} disabled={loading}>
                  <i className="ri-close-line"></i>
                  <span>Clear</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert-banner error">
            <i className="alert-icon ri-error-warning-fill"></i>
            <div>{error}</div>
          </div>
        )}

        {/* Search Results */}
        {loading ? (
          <div className="card-panel loading-container">
            <div className="spinner spinner-lg"></div>
            <p>Searching requests for user...</p>
          </div>
        ) : serviceRequests !== null && (
          <div className="table-container">
            {serviceRequests.length === 0 ? (
              <div className="empty-state">
                <i className="empty-state-icon ri-search-line"></i>
                <h3>No Matching Requests</h3>
                <p>No service requests were found for username "{searchTerm}".</p>
              </div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Req ID</th>
                    <th>Description</th>
                    <th>Details</th>
                    <th>Raised By</th>
                    <th>Raised On</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRequests.map((request) => (
                    <tr key={request.requestId}>
                      <td>
                        <span style={{ fontWeight: 700, color: '#818cf8' }}>#{request.requestId}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{request.description}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{request.details}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <i className="ri-user-3-line" style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}></i>
                          {request.raisedBy}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{request.raisedOn}</td>
                      <td>
                        <span className={getStatusBadgeClass(request.reqStatus)}>
                          {STATUS[request.reqStatus] || 'NEW'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {request.reqStatus === 1 && role === "Admin" && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            disabled={actionLoadingId === request.requestId}
                            onClick={() => handleCloseRequest(request.requestId)}
                          >
                            {actionLoadingId === request.requestId ? (
                              <span className="spinner"></span>
                            ) : (
                              <i className="ri-close-circle-line"></i>
                            )}
                            <span>Close Request</span>
                          </button>
                        )}

                        {request.reqStatus === 1 && role !== "Admin" && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => window.location.href = `/Delete/${request.requestId}`}
                          >
                            <i className="ri-delete-bin-line"></i>
                            <span>Delete</span>
                          </button>
                        )}

                        {request.reqStatus === 2 && role !== "Admin" && (
                          <Link to={`/reOpen/${request.requestId}`} className="btn btn-purple btn-sm">
                            <i className="ri-refresh-line"></i>
                            <span>Reopen</span>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {serviceRequests === null && !loading && (
          <div className="card-panel empty-state">
            <i className="empty-state-icon ri-user-search-line"></i>
            <h3>Search Requests by Username</h3>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchByName;
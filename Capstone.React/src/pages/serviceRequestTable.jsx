import { useState, useEffect } from 'react';
import axiosInstance from '../lib/axiosInstance';
import { dateFormatter, STATUS } from '../lib/index';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ToastContainer } from '../components/Toast';

const ServiceRequestTable = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const role = localStorage.getItem("role");
      const userName = localStorage.getItem("userName");
      const redirectURL = role === "Admin" ? "/GetAllRequest" : `/GetRequestByuserName?userName=${userName}`;
      const response = await axiosInstance.get(redirectURL);
      setServiceRequests(response.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch service requests.');
      addToast('error', 'Fetch Failed', 'Unable to retrieve service requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRequest = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      const response = await axiosInstance.get(`/CloseRequest?requestId=${requestId}`);
      if (response.status === 200) {
        addToast('success', 'Request Closed', `Service Request #${requestId} has been closed successfully.`);
        fetchServiceRequests();
      }
    } catch (err) {
      console.error('Failed to close request:', err);
      addToast('error', 'Action Failed', `Failed to close request #${requestId}.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // const deleteRequest = async (requestId) => {
  //   try {
  //     setActionLoadingId(requestId);
  //     const response = await axiosInstance.delete(`/Delete?id=${requestId}`);
  //     if (response.status === 200) {
  //       addToast('success', 'Request Deleted', `Service Request #${requestId} has been deleted.`);
  //       fetchServiceRequests();
  //     }
  //   } catch (err) {
  //     console.error('Failed to delete request:', err);
  //     addToast('error', 'Action Failed', `Failed to delete request #${requestId}.`);
  //   } finally {
  //     setActionLoadingId(null);
  //   }
  // };

  // const reopenRequest = async (requestId) => {
  //   try {
  //     setActionLoadingId(requestId);
  //     const response = await axiosInstance.post(`/reopen?requestId=${requestId}`);
  //     if (response.status === 200) {
  //       addToast('success', 'Request Reopened', `Service Request #${requestId} has been reopened.`);
  //       fetchServiceRequests();
  //     }
  //   } catch (err) {
  //     console.error('Failed to reopen request:', err);
  //     addToast('error', 'Action Failed', `Failed to reopen request #${requestId}.`);
  //   } finally {
  //     setActionLoadingId(null);
  //   }
  // };

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

  // const totalCount = serviceRequests.length;
  // const newCount = serviceRequests.filter(r => r.reqStatus === 1).length;
  // const closedCount = serviceRequests.filter(r => r.reqStatus === 2).length;
  // const reopenCount = serviceRequests.filter(r => r.reqStatus === 3).length;

  const role = localStorage.getItem("role");

  return (
    <div className="app-container">
      <Navbar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <main className="main-content">
        <div className="page-header">
          <div className="page-title-group">
            <h1>
              Service Requests Table
            </h1>
           
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {role !== "Admin" ? (
              <Link to="/Create" className="btn btn-primary">
                <i className="ri-add-line"></i>
                <span>Create New Request</span>
              </Link>
            ) : (
              <Link to="/search" className="btn btn-secondary">
                <i className="ri-search-2-line"></i>
                <span>Search by User</span>
              </Link>
            )}
          </div>
        </div>

        

        {/* Error Notification */}
        {error && (
          <div className="alert-banner error">
            <i className="alert-icon ri-error-warning-fill"></i>
            <div>{error}</div>
          </div>
        )}

        {/* Table Container */}
        {loading ? (
          <div className="card-panel loading-container">
            <div className="spinner spinner-lg"></div>
            <p>Loading service requests...</p>
          </div>
        ) : !error && (
          <div className="table-container">
            {serviceRequests.length === 0 ? (
              <div className="empty-state">
                <i className="empty-state-icon ri-inbox-archive-line"></i>
                <h3>No Service Requests Found</h3>
                <p>There are no service requests to display at this time.</p>
                {role !== "Admin" && (
                  <Link to="/Create" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
                    <i className="ri-add-line"></i>
                    <span>Create Request</span>
                  </Link>
                )}
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
                          {request.raisedBy}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
{dateFormatter(request.raisedOn)}
</td>
                      <td>
                        <span className={getStatusBadgeClass(request.reqStatus)}>
                          {STATUS[request.reqStatus] || 'NEW'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {(request.reqStatus === 1 || request.reqStatus === 3) && role === "Admin" && (
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

                        {(request.reqStatus === 1 || request.reqStatus === 3) && role !== "Admin" && (
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
      </main>
    </div>
  );
};

export default ServiceRequestTable;
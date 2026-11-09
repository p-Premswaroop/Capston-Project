import { useState } from 'react';
import axiosInstance from "../lib/axiosInstance";
import { Toast } from "../components/Toast";

function App() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault();
      //console.log('Form submitted:', e.target.usernameInput.value);
    const formData = {
        userName: e.target[0].value,
      password: e.target[1].value
    };
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
     const response = await axiosInstance.get('/Authenticate', { params: formData });
     if (response.status === 200) {
       const { token, userName, roleName } = response.data;
       localStorage.setItem("token", token);
       localStorage.setItem("userName", userName);
       localStorage.setItem("role", roleName);
        
       setSuccessMessage('Login successful! Redirecting...');
       setTimeout(() => {
         window.location.href = "/serviceRequests";
       }, 600);
     }
    } catch (error) {
     console.error('Login error:', error);
     setErrorMessage(error.response?.data?.message || 'Invalid username or password. Please try again.');
    } finally {
     setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">

          <h2>Login Page</h2>
        </div>

        {errorMessage && (
          <div className="alert-banner error">
            <i className="alert-icon ri-error-warning-fill"></i>
            <div>{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <Toast type="success" title="Authentication Granted" message={successMessage} />
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="usernameInput">Username</label>
            <div style={{ position: 'relative' }}>
              <input
                id="usernameInput"
                type="text"
                className="input-field"
                placeholder="Enter your username"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="passwordInput">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="passwordInput"
                type="password"
                className="input-field"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <i className="ri-arrow-right-line"></i>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;

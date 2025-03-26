import './Spinner.scss';

export const Spinner = () => (
  <div className="spinner-overlay">
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Loading delicious treats...</p>
    </div>
  </div>
);

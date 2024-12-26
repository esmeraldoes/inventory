import React from "react";
import "./Card.css";

const NotificationCard = ({
  id,
  title,
  companyName,
  product,
  stockAdded,
  description,
  dayAgo,
  icon,
  actionIcon
}) => {
  return (
    <div className="card-container">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <div className="card-header">
          <span className="stock-added-text">{title}</span>
        </div>
        <div className="card-details">
          <div className="detail-item">
            <span className="detail-label">ID:</span> {id}
          </div>
          <div className="detail-item">
            <span className="detail-label">Company Name:</span> {companyName}
          </div>
          <div className="detail-item">
            <span className="detail-label">Product:</span> {product}
          </div>
          <div className="detail-item">
            <span className="detail-label">Stock Added:</span> {stockAdded}
            <span className="detail-icon">{actionIcon}</span>
          </div>
        </div>
        <div className="card-description">{description}</div>
      </div>
      <div className="card-footer">
        <span className="day-ago-text">{dayAgo}</span>
      </div>
    </div>
  );
};

export default NotificationCard;



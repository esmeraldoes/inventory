import React, { useState, useEffect } from 'react';
import NotificationCard from './NotificationCard';
import AsideMenu from '../utils/AsideMenu';
import Navbar from '../utils/Navbar';
import { menuItems, navbarButtons } from './navbarItems';
import { invoke } from '@tauri-apps/api/core';

const Notification = () => {
  const [activeItem, setActiveItem] = useState('Notifications');
  const [notifications, setNotifications] = useState([]);
  const [companyNames, setCompanyNames] = useState({}); // State to store company names by companyId

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const data = await invoke('get_notifications');
        setNotifications(data); 

        // Fetch company names for each notification
        const names = {};
        for (const notification of data) {
          if (notification.companyId && !names[notification.companyId]) {
            const companyName = await getCompanyNameById(notification.companyId);
            names[notification.companyId] = companyName;
          }
        }
        setCompanyNames(names);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    }

    fetchNotifications();
  }, []);

  const getCompanyNameById = async (companyId) => {
    try {
      // Call the Tauri command with the company ID
      const response = await invoke("get_company_by_id", { id: companyId });
      console.log("NLA: ", response)
      // Check if the backend responded successfully
      if (response.success) {
        return response.data.name; // Return the company name
      } else {
        console.error("Failed to fetch company:", response.error);
        return null;
      }
    } catch (error) {
      console.error("Error occurred while fetching company:", error);
      return null;
    }
  };

  // Function to calculate the time difference (in days) between now and the notification's creation time
  const timeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffTime = Math.abs(now - notificationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
    return diffDays === 0 ? 'Today' : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Main Content Wrapper */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <Navbar buttons={navbarButtons} />

        {/* Dashboard Content */}
        <div style={{ display: 'flex', flex: 1 }}>
          {/* Sidebar */}
          <AsideMenu
            items={menuItems}
            activeItem={activeItem}
            onSelect={(label) => setActiveItem(label)}
          />

          {/* Notifications Container */}
          <div style={{ flex: 1, padding: '20px', marginTop: '50px' }}>
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                marginLeft: '300px',
                marginRight: '30px',
              }}
            >
              <div className="notifications-header">Notifications</div>

              {notifications.map((notification, index) => {
                // Fetch company name from state (or undefined if not fetched yet)
                const companyName = companyNames[notification.company_id] || 'Loading...';

                // Determine background color based on title
                const bgColor = notification.title === 'Low Stock' ? '#E0F9E0' : '#FFEBEB'; // Red for 'Low Stock', Green for others

                return (
                  <NotificationCard
                    key={index}
                    id={notification.id}
                    title={notification.title}
                    companyName={companyName} // Pass the fetched company name
                    product={notification.product}
                    description={notification.description}
                    stockAdded={notification.stockAdded || ''}
                    dayAgo={timeAgo(notification.created_at)} // Convert to relative time
                    icon={
                      notification.type === 'success' ? (
                        <svg
                          width="24"
                          height="24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21 3H3V9H21V3ZM19 7H5V5H19V7ZM14.5 11C14.78 11 15 11.22 15 11.5V13H9V11.5C9 11.22 9.22 11 9.5 11H14.5ZM18 13.09V10H20V13.09C19.67 13.04 19.34 13 19 13C18.66 13 18.33 13.04 18 13.09ZM13 19C13 19.7 13.13 20.37 13.35 21H4V10H6V19H13ZM22.5 17.25L17.75 22L15 19L16.16 17.84L17.75 19.43L21.34 15.84L22.5 17.25Z"
                            fill="#1A932E"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 20C7.34784 20 4.8043 18.9464 2.92893 17.0711C1.05357 15.1957 0 12.6522 0 10C0 7.34784 1.05357 4.8043 2.92893 2.92893C4.8043 1.05357 7.34784 0 10 0C12.6522 0 15.1957 1.05357 17.0711 2.92893C18.9464 4.8043 20 7.34784 20 10C20 12.6522 18.9464 15.1957 17.0711 17.0711C15.1957 18.9464 12.6522 20 10 20ZM8 15L17 6.5L15.5 5L8 12L4.5 8.5L3 10L8 15Z"
                            fill="#10A242"
                          />
                        </svg>
                      )
                    }
                    actionIcon={
                      notification.title === 'Low Stock' && (
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 20C7.34784 20 4.8043 18.9464 2.92893 17.0711C1.05357 15.1957 0 12.6522 0 10C0 7.34784 1.05357 4.8043 2.92893 2.92893C4.8043 1.05357 7.34784 0 10 0C12.6522 0 15.1957 1.05357 17.0711 2.92893C18.9464 4.8043 20 7.34784 20 10C20 12.6522 18.9464 15.1957 17.0711 17.0711C15.1957 18.9464 12.6522 20 10 20ZM8 15L17 6.5L15.5 5L8 12L4.5 8.5L3 10L8 15Z"
                            fill="#FF0000"
                          />
                        </svg>
                      )
                    }
                    style={{
                      backgroundColor: bgColor, // Set background color dynamically
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;


'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';


interface ProductImage {
  url: string;
}

interface Product {
    productId: string
  title: string;
  images?: ProductImage[];
}

interface Notification {
  id: string;
  productId: string;
  message: string;
  createdAt: string;
  product?: Product;
}

const NotificationPanel = () => {
  // Add type annotations to state variables
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notification');
      if (response.ok) {
        const data = await response.json();

        // Validate the data structure
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          console.error('Invalid data format received from server.');
        }
      } else {
        console.error('Failed to fetch notifications.');
      }
    } catch (error: unknown) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchNotifications(); 
    const intervalId = setInterval(() => {
      fetchNotifications(); 
    }, 30000); 
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="notification-panel p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
           <Link
  key={notification.id}
  href={`/dashboard/products/update-products/${notification.productId}`}
>
                <li  className="flex items-start space-x-4 p-2 border-b last:border-b-0">
                  {notification.product?.images?.[0]?.url && (
                    <Image
                      src={notification.product.images[0].url}
                      alt={notification.product.title}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
           </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPanel;
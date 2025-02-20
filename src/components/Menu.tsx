import { useState, useEffect } from 'react';
import styles from '../styles/Menu.module.css';

interface MenuItem {
  id: number;
  name: string;
  function: string;
}

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/menu');
        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        setMenuItems(data);
        setError(null);
      } catch (error) {
        setMenuItems([]); // Set empty array on error
        setError('Unable to fetch data from server');
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleTeleport = () => {
    alert('Teleport in progress');
  };

  const handleNavigate = () => {
    alert('Navigate in progress');
  };

  return (
    <div className={styles.menuContainer}>
      <button 
        className={styles.menuButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
      </button>
      
      {isOpen && (
        <div className={styles.menuItems}>
          {error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={item.function === 'handleTeleport' ? handleTeleport : handleNavigate}
              >
                {item.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Menu; 
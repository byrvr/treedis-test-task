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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const endpoint = searchQuery
          ? `http://localhost:5001/api/search`
          : 'http://localhost:5001/api/menu';
        const response = await fetch(endpoint, {
          method: searchQuery ? 'POST' : 'GET',
          headers: searchQuery ? {
            'Content-Type': 'application/json',
          } : undefined,
          body: searchQuery ? JSON.stringify({ query: searchQuery }) : undefined,
        });
        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        setMenuItems(data);
        setError(null);
      } catch (error) {
        setMenuItems([]);
        setError('Unable to fetch data from server');
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, [searchQuery]);

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
          {/* Search input field */}
          <input 
            type="text" 
            placeholder="Search menu items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          
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

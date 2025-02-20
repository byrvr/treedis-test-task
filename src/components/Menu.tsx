import { useState, useEffect } from 'react';
import styles from '../styles/Menu.module.css';
import { MatterportSDK, initializeMatterportSdk, handleTeleport, handleNavigate } from '../utils/matterportUtils';

interface MenuItem {
  id: number;
  name: string;
  function: string;
}

interface MenuProps {
  showcaseWindow: Window | null;
}

interface SweepInfo {
  sid: string;
  position: { x: number; y: number; z: number };
  floorInfo: { sequence: number };
}

const Menu = ({ showcaseWindow }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mpSdk, setMpSdk] = useState<MatterportSDK | null>(null);
  const [currentPose, setCurrentPose] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize Matterport SDK
  useEffect(() => {
    const init = async () => {
      const sdk = await initializeMatterportSdk(showcaseWindow);
      setMpSdk(sdk);
    };
    init();
  }, [showcaseWindow]);

  // Fetch menu items
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

  // Add Camera pose subscription
  useEffect(() => {
    if (!mpSdk) return;

    mpSdk.Camera.pose.subscribe((pose) => {
      setCurrentPose(pose.rotation);
    });
  }, [mpSdk]);

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
                onClick={() => 
                  item.function === 'handleTeleport' 
                    ? handleTeleport(mpSdk)
                    : handleNavigate(mpSdk, currentPose)
                }
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

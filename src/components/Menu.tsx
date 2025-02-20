import { useState } from 'react';
import styles from '../styles/Menu.module.css';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <button onClick={handleTeleport}>
            Teleport to office
          </button>
          <button onClick={handleNavigate}>
            Navigate to office
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu; 
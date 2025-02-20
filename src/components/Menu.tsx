import { useState, useEffect } from 'react';
import styles from '../styles/Menu.module.css';

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

interface MatterportSDK {
  Sweep: {
    current: {
      subscribe: (callback: (sweep: SweepInfo) => void) => void;
    };
    Transition: {
      INSTANT: string;
      FLY: string;
    };
    moveTo: (sweepId: string, options: {
      rotation: { x: number; y: number };
      transition: string;
      transitionTime: number;
    }) => Promise<void>;
    createGraph: () => Promise<any>;
  };
  Graph: {
    createAStarRunner: (graph: any, start: any, end: any) => { exec: () => any[] };
  };
  Camera: {
    pose: {
      subscribe: (callback: (pose: { rotation: { x: number; y: number } }) => void) => void;
    };
  };
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
    const initializeSdk = async () => {
      if (!showcaseWindow) return;

      try {
        const sdk = await (showcaseWindow as any).MP_SDK.connect(showcaseWindow);
        setMpSdk(sdk);

        // Track the current position of sweep and console log it (for debugging)
        sdk.Sweep.current.subscribe(function (currentSweep: SweepInfo) {
          if (currentSweep.sid === '') {
            console.log('Not currently stationed at a sweep position');
          } else {
            console.log('Currently at sweep', currentSweep.sid);
            console.log('Current position', currentSweep.position);
            console.log('On floor', currentSweep.floorInfo.sequence);
          }
        }
      );
      } catch (error) {
        console.error('Failed to initialize Matterport SDK:', error);
      }
    };

    initializeSdk();
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

  const handleTeleport = async () => {
    const sweepId = '88f2h8zsa0e28txst3ahsyp3d';
    
    if (!mpSdk) {
      alert('Matterport SDK not ready');
      return;
    }

    try {
      const rotation = { x: 0, y: 140 };
      const transition = mpSdk.Sweep.Transition.FLY;
      const transitionTime = 2000;

      await mpSdk.Sweep.moveTo(sweepId, {
        rotation: rotation,
        transition: transition,
        transitionTime: transitionTime,
      });
      console.log('Arrived at sweep ' + sweepId);
    } catch (error) {
      console.error('Teleport failed:', error);
      alert('Teleport failed');
    }
  };

  const handleNavigate = async () => {
    if (!mpSdk) {
      alert('Matterport SDK not ready');
      return;
    }

    try {
      // Target sweep ID for the office
      const targetSweepId = '88f2h8zsa0e28txst3ahsyp3d';

      // Create graph and find path
      const graph = await mpSdk.Sweep.createGraph();
      const currentSweep = await new Promise<SweepInfo>((resolve) => {
        mpSdk.Sweep.current.subscribe(resolve);
      });

      const aStarRunner = mpSdk.Graph.createAStarRunner(
        graph,
        graph.vertex(currentSweep.sid),
        graph.vertex(targetSweepId)
      );
      
      const result = aStarRunner.exec();
      const path = result.path;

      // Navigate through each sweep in the path
      for (const sweep of path) {
        await mpSdk.Sweep.moveTo(sweep.id, {
          rotation: currentPose,
          transition: mpSdk.Sweep.Transition.FLY,
          transitionTime: 1000,
        });
        
        // Wait a bit between movements for smooth navigation
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // Clean up
      graph.dispose();
    } catch (error) {
      console.error('Navigation failed:', error);
      alert('Navigation failed');
    }
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

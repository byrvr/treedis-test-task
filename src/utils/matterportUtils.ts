export interface SweepInfo {
  sid: string;
  position: { x: number; y: number; z: number };
  floorInfo: { sequence: number };
}

export interface MatterportSDK {
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

export const initializeMatterportSdk = async (showcaseWindow: Window | null): Promise<MatterportSDK | null> => {
  if (!showcaseWindow) return null;

  try {
    const sdk = await (showcaseWindow as any).MP_SDK.connect(showcaseWindow);
    
    // Track the current position of sweep and console log it (for debugging)
    sdk.Sweep.current.subscribe((currentSweep: SweepInfo) => {
      if (currentSweep.sid === '') {
        console.log('Not currently stationed at a sweep position');
      } else {
        console.log('Currently at sweep', currentSweep.sid);
        console.log('Current position', currentSweep.position);
        console.log('On floor', currentSweep.floorInfo.sequence);
      }
    });

    return sdk;
  } catch (error) {
    console.error('Failed to initialize Matterport SDK:', error);
    return null;
  }
};

export const handleTeleport = async (mpSdk: MatterportSDK | null) => {
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

export const handleNavigate = async (mpSdk: MatterportSDK | null, currentPose: { x: number; y: number }) => {
  if (!mpSdk) {
    alert('Matterport SDK not ready');
    return;
  }

  try {
    const targetSweepId = '88f2h8zsa0e28txst3ahsyp3d';
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

    // Navigate through each sweep in the result
    for (const sweep of path) {
      await mpSdk.Sweep.moveTo(sweep.id, {
        rotation: currentPose,
        transition: mpSdk.Sweep.Transition.FLY,
        transitionTime: 1000,
      });
      
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    graph.dispose();
  } catch (error) {
    console.error('Navigation failed:', error);
    alert('Navigation failed');
  }
}; 
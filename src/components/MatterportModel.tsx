import { useEffect } from 'react';

interface MatterportModelProps {
  showcaseWindow: Window;
}

export const MatterportModel = ({ showcaseWindow }: MatterportModelProps) => {
  useEffect(() => {
    const initialize3DModel = async () => {
      let mpSdk;
      try {
        mpSdk = await (showcaseWindow as any).MP_SDK.connect(showcaseWindow);
      } catch(e) {
        console.error(e);
        return;
      }

      try {
        const [sceneObject] = await mpSdk.Scene.createObjects(1);
        const modelNode = sceneObject.addNode();
        const lights = sceneObject.addNode();
        
        const lightComponent = lights.addComponent('mp.lights');
        
        const directionalLightConfig = {
          enabled: true,
          color: { r: 0.8, g: 0.8, b: 1.0 },
          intensity: 2.0,
          position: { x: 1, y: 5, z: 1 },
          target: { x: 0, y: 0, z: 0 },
          debug: false
        };
        const directionalLight = lights.addComponent('mp.directionalLight', directionalLightConfig);
        
        const ambientLightConfig = {
          intensity: 0.7,
          color: { r: 0.8, g: 0.8, b: 1.0 }
        };
        const ambientLight = lights.addComponent('mp.ambientLight', ambientLightConfig);

        const fbxComponent = modelNode.addComponent(mpSdk.Scene.Component.FBX_LOADER, {
          url: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/fbx/stanford-bunny.fbx',
        });

        fbxComponent.inputs.localScale = {
          x: 0.00002,
          y: 0.00002,
          z: 0.00002
        };

        modelNode.obj3D.castShadow = true;
        modelNode.obj3D.receiveShadow = true;

        lights.start();

        modelNode.obj3D.position.set(
          -11.197123527526855,
          0.3,
          -4.567655563354492 
        );

        if (!modelNode.started) {
          modelNode.start();
        }

        console.log('3D model setup completed with adjusted scale');
      } catch (error) {
        console.error('Error setting up 3D scene:', error);
      }
    };

    initialize3DModel();
  }, [showcaseWindow]);

  return null;
}; 
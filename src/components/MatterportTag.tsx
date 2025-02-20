import { useEffect } from 'react';

interface MatterportTagProps {
  showcaseWindow: Window;
}

export const MatterportTag = ({ showcaseWindow }: MatterportTagProps) => {
  useEffect(() => {
    const initializeTag = async () => {
      let mpSdk;
      try {
        mpSdk = await (showcaseWindow as any).MP_SDK.connect(showcaseWindow);
      } catch(e) {
        console.error(e);
        return;
      }

      try {
        await mpSdk.Tag.add({
          label: 'Office',
          description: 'This tag was added through the Matterport SDK',
          anchorPosition: {
            x: 30,
            y: 0,
            z: -2,
          },
          stemVector: {
            x: 0,
            y: 0.30,
            z: 0,
          },
          color: {
            r: 0.0,
            g: 0.0,
            b: 1.0,
          },
        });
        console.log('Tag added successfully');
      } catch (error) {
        console.error('Error adding tag:', error);
      }
    };

    initializeTag();
  }, [showcaseWindow]);

  return null;
}; 
"use client";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";

export default function Home() {
  const sdkKey = process.env.MATTERPORT_SDK_KEY;
  const modelSid = process.env.MATTERPORT_MODEL_SID;

  useEffect(() => {
    const showcase = document.getElementById('showcase') as HTMLIFrameElement;
    if (!showcase) return;
    const showcaseWindow = showcase.contentWindow;
    if (!showcaseWindow) return;
    
    showcase.addEventListener('load', async function() {
      let mpSdk;
      try {
        mpSdk = await (showcaseWindow as any).MP_SDK.connect(showcaseWindow);
      }
      catch(e) {
        console.error(e);
        return;
      }

      console.log('Hello Bundle SDK', mpSdk);
      
      try {
        await mpSdk.Tag.add({
          label: 'Office',
          description: 'This tag was added through the Matterport SDK',
          anchorPosition: {
            x: 30,
            y: 0,
            z: -2,
          },
          stemVector: { // make the Tag stick straight up and make it 0.30 meters (~1 foot) tall
            x: 0,
            y: 0.30,
            z: 0,
          },
          color: { // blue disc
            r: 0.0,
            g: 0.0,
            b: 1.0,
          },
         });
        console.log('Tag added successfully');
      } catch (error) {
        console.error('Error adding tag:', error);
      }
    });
  }, []); 

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <iframe 
          id="showcase" 
          width="1110" 
          height="720" 
          src={`/matterport-sdk/showcase.html?m=${modelSid}&applicationKey=${sdkKey}`}
          frameBorder="0" 
          allowFullScreen 
          allow="vr"
        />
      </main>
    </div>
  );
}


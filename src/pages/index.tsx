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


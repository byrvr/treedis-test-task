"use client";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { MatterportTag } from "../components/MatterportTag";
import { MatterportModel } from "../components/MatterportModel";

export default function Home() {
  const sdkKey = process.env.MATTERPORT_SDK_KEY;
  const modelSid = process.env.MATTERPORT_MODEL_SID;
  const [showcaseWindow, setShowcaseWindow] = useState<Window | null>(null);

  useEffect(() => {
    const showcase = document.getElementById('showcase') as HTMLIFrameElement;
    if (!showcase) return;
    const window = showcase.contentWindow;
    if (!window) return;
    
    showcase.addEventListener('load', () => {
      setShowcaseWindow(window);
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
        {showcaseWindow && (
          <>
            <MatterportTag showcaseWindow={showcaseWindow} />
            <MatterportModel showcaseWindow={showcaseWindow} />
          </>
        )}
      </main>
    </div>
  );
}

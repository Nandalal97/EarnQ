// GoogleAd.jsx
import { useEffect } from "react";

function GoogleAd({ adSlot }) {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("Ad load error:", e);
    }
  }, []);

  return (
    <div style={{ maxWidth: "100%", margin: "10px 0", textAlign: "center" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"  // replace with your ID
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

export default GoogleAd;

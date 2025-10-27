import { useEffect } from "react";
import { registerSW } from "virtual:pwa-register";

function UpdatePrompt() {
  useEffect(() => {
    registerSW({
      onNeedRefresh() {
        // detect হলেই সঙ্গে সঙ্গে reload
        window.location.reload();
      },
      onOfflineReady() {
        console.log("App ready to work offline");
      },
    });
  }, []);

  return null; // UI দরকার নেই
}

export default UpdatePrompt;

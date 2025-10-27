import { useEffect } from 'react';

function AntiInspect() {
  useEffect(() => {
    // Disable right-click
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener('contextmenu', disableRightClick);

    // Disable shortcuts
    const disableShortcuts = (e) => {
      // DevTools shortcuts
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') ||
        (e.ctrlKey && e.key.toLowerCase() === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'j') ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c')
      ) {
        e.preventDefault();
        alert('Inspecting or viewing source is disabled.');
        return false;
      }

      // Disable copy / paste / cut
      if (
        (e.ctrlKey && ['c', 'v', 'x'].includes(e.key.toLowerCase())) ||
        (e.metaKey && ['c', 'v', 'x'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        alert('Copy/Paste/Cut is disabled on this site.');
        return false;
      }

      // Disable printing
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        alert('Printing is disabled on this site.');
        return false;
      }

      // Disable "Save Page As"
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        alert('Saving this page is disabled.');
        return false;
      }
    };
    document.addEventListener('keydown', disableShortcuts);

    // Detect PrintScreen key (Windows mostly)
    const detectPrintScreen = (e) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText(''); // clears clipboard
        alert('Screenshots are disabled!');
      }
    };
    document.addEventListener('keyup', detectPrintScreen);

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableShortcuts);
      document.removeEventListener('keyup', detectPrintScreen);
    };
  }, []);

  return null; // No UI component
}

export default AntiInspect;

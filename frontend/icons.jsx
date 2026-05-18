/* PENTA · Icon set — line icons, 24×24, 1.6 stroke */
const ICON = (path, opts = {}) => (props) => {
  const { size = 18, stroke = 1.7, ...rest } = props || {};
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={stroke}
         strokeLinecap="round" strokeLinejoin="round"
         {...rest}>{path}</svg>
  );
};

const Icons = {
  Home:     ICON(<><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9.5a.5.5 0 0 0 .5.5H9v-6h6v6h3.5a.5.5 0 0 0 .5-.5V10"/></>),
  Library:  ICON(<><rect x="3" y="4" width="5" height="16" rx="1.4"/><rect x="10" y="4" width="5" height="16" rx="1.4"/><path d="m17.5 5.4 3.6 1 .4 14-3.6-1z"/></>),
  Star:     ICON(<path d="M12 3.5 14.4 9l5.6.5-4.3 3.7 1.3 5.6L12 15.9 7 18.8l1.3-5.6L4 9.5 9.6 9z"/>),
  Share:    ICON(<><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="m8 10.8 8-3.6M8 13.2l8 3.6"/></>),
  Sparkle:  ICON(<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5 8 8M16 16l2.5 2.5M5.5 18.5 8 16M16 8l2.5-2.5"/></>),
  Settings: ICON(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>),
  Search:   ICON(<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>),
  Plus:     ICON(<><path d="M12 5v14M5 12h14"/></>),
  Filter:   ICON(<path d="M4 5h16l-6 8v6l-4 1v-7z"/>),
  Sort:     ICON(<><path d="M7 4v16M3 16l4 4 4-4"/><path d="M17 20V4M21 8l-4-4-4 4"/></>),
  Grid:     ICON(<><rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/></>),
  List:     ICON(<><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>),
  Code:     ICON(<><path d="m9 8-5 4 5 4M15 8l5 4-5 4M14 4l-4 16"/></>),
  Text:     ICON(<><path d="M4 6h16M4 12h10M4 18h16"/></>),
  Prompt:   ICON(<><path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12Z"/><path d="M9 10h6M9 13h4"/></>),
  Copy:     ICON(<><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></>),
  History:  ICON(<><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></>),
  Bolt:     ICON(<path d="M13 3 4 14h6l-1 7 9-11h-6z"/>),
  ChevR:    ICON(<path d="m9 6 6 6-6 6"/>),
  ChevD:    ICON(<path d="m6 9 6 6 6-6"/>),
  ChevL:    ICON(<path d="m15 6-6 6 6 6"/>),
  Close:    ICON(<><path d="M6 6l12 12M18 6 6 18"/></>),
  Min:      ICON(<path d="M5 12h14"/>),
  Max:      ICON(<><path d="M4 4h6M4 4v6M20 4h-6M20 4v6M4 20h6M4 20v-6M20 20h-6M20 20v-6"/></>),
  Send:     ICON(<path d="M4 12 21 4l-7 17-2.5-7z"/>),
  Folder:   ICON(<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2h9A1.5 1.5 0 0 1 21 8.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>),
  Tag:      ICON(<><path d="M3 12V4.5A1.5 1.5 0 0 1 4.5 3H12l9 9-7.5 7.5z"/><circle cx="7.5" cy="7.5" r="1.2"/></>),
  Bell:     ICON(<><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/></>),
  Sun:      ICON(<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></>),
  Moon:     ICON(<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>),
  Globe:    ICON(<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>),
  User:     ICON(<><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></>),
  Logout:   ICON(<><path d="M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M10 17l-5-5 5-5M5 12h11"/></>),
  Pin:      ICON(<><path d="M12 17v5"/><path d="M9 3h6l-1.5 5 3.5 4H7l3.5-4z"/></>),
  Lock:     ICON(<><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>),
  Down:     ICON(<><path d="M12 4v12M6 14l6 6 6-6"/></>),
  Cmd:      ICON(<><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 9V6a2 2 0 1 0-2 2h2M15 9V6a2 2 0 1 1 2 2h-2M9 15v3a2 2 0 1 1-2-2h2M15 15v3a2 2 0 1 0 2-2h-2"/></>),
  Variable: ICON(<><path d="M7 4a8 8 0 0 0 0 16M17 4a8 8 0 0 1 0 16"/><path d="m10 9 4 6M14 9l-4 6"/></>),
  Arrow:    ICON(<path d="M5 12h14m-4-4 4 4-4 4"/>),
};

window.Icons = Icons;

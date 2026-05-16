// Hybrid storage: localStorage first (instant), Supabase sync in background
// Falls back to localStorage-only if no Supabase config or if offline

const SUPABASE_URL = "https://smukvgygjhlgwvsbojpr.supabase.co";
const SUPABASE_KEY = "sb_publishable_9b91GwJUfEPVb9-d0CZvZA_DE7vKl5o";

const HEADERS = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

// Queue of pending writes when offline
const pendingWrites = [];
let syncInProgress = false;

async function sbWrite(key, value) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/family_data?on_conflict=key`;
    const res = await fetch(url, {
      method: "POST",
      headers: { ...HEADERS, "Prefer": "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ key, value: JSON.parse(value) })
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

async function sbRead(key) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/family_data?key=eq.${encodeURIComponent(key)}&select=value`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) return null;
    return JSON.stringify(data[0].value);
  } catch (e) {
    return null;
  }
}

async function sbDelete(key) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/family_data?key=eq.${encodeURIComponent(key)}`;
    await fetch(url, { method: "DELETE", headers: HEADERS });
  } catch (e) {}
}

async function flushPendingWrites() {
  if (syncInProgress || !navigator.onLine) return;
  syncInProgress = true;
  while (pendingWrites.length > 0) {
    const { key, value } = pendingWrites[0];
    const ok = await sbWrite(key, value);
    if (!ok) break; // Stop on failure, try again later
    pendingWrites.shift();
  }
  syncInProgress = false;
}

// Sync pending writes every 5 seconds and when coming back online
setInterval(flushPendingWrites, 5000);
window.addEventListener("online", flushPendingWrites);

if (!window.storage) {
  window.storage = {
    get: async function(key) {
      // Try cloud first if online (for fresh data across devices)
      if (navigator.onLine) {
        const cloudVal = await sbRead(key);
        if (cloudVal !== null) {
          try { localStorage.setItem(key, cloudVal); } catch(e) {}
          return { key, value: cloudVal };
        }
      }
      // Fallback to local
      try {
        const val = localStorage.getItem(key);
        return val !== null ? { key, value: val } : null;
      } catch(e) { return null; }
    },
    set: async function(key, value) {
      // Write to local immediately (instant UX)
      try { localStorage.setItem(key, value); } catch(e) {}
      // Queue cloud sync
      if (navigator.onLine) {
        const ok = await sbWrite(key, value);
        if (!ok) pendingWrites.push({ key, value });
      } else {
        pendingWrites.push({ key, value });
      }
      return { key, value };
    },
    delete: async function(key) {
      try { localStorage.removeItem(key); } catch(e) {}
      if (navigator.onLine) sbDelete(key);
      return { key, deleted: true };
    },
    list: async function(prefix) {
      try {
        prefix = prefix || "";
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(prefix)) keys.push(k);
        }
        return { keys };
      } catch(e) { return { keys: [] }; }
    }
  };
}

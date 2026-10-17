(() => {
  const CONSENT_KEY = 'quran-analytics-consent-v1';
  let tracker = null;
  let ready = false;
  let loading = false;
  let currentPage = null;
  let currentSurah = null;
  let pageProvider = null;

  function configured() {
    const c = window.CONFIG || {};
    const securePage = location.protocol === 'https:' || (location.protocol === 'http:' && location.hostname === 'localhost');
    if (!c.UMAMI_WEBSITE_ID || !securePage) return false;
    try {
      return new URL(c.UMAMI_SCRIPT_URL).protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  function consent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
      return true;
    } catch (e) {
      console.warn('Analytics consent could not be saved.', e);
      setStatus('تعذّر حفظ اختيارك. لم يبدأ جمع التحليلات.');
      return false;
    }
  }

  function setStatus(text) {
    const status = document.querySelector('#analyticsStatus');
    if (status) status.textContent = text;
  }

  function track(name, data) {
    if (!ready || !window.umami || typeof window.umami.track !== 'function') return;
    const safe = {};
    Object.entries(data || {}).forEach(([key, value]) => {
      if (typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) safe[key] = value;
      else if (typeof value === 'string') safe[key] = value.slice(0, 80);
    });
    try {
      window.umami.track(name, safe);
    } catch (e) {
      console.warn('Analytics event could not be sent.', e);
    }
  }

  function page(pageNumber, surahNumber) {
    if (!ready || !window.umami || typeof window.umami.track !== 'function') return;
    const page = Number(pageNumber);
    const surah = Number(surahNumber);
    if (!Number.isFinite(page) || !Number.isFinite(surah)) return;
    if (page === currentPage) return;
    currentPage = page;
    try {
      window.umami.track(() => ({ url: '/reader/page/' + page, title: 'Quran reader' }));
    } catch (e) {
      console.warn('Analytics page view could not be sent.', e);
    }
    track('reader_page', { page, surah });
    if (surah !== currentSurah) {
      currentSurah = surah;
      track('surah_open', { surah });
    }
  }

  function loadTracker() {
    if (!configured() || consent() !== 'granted' || ready || loading) return;
    if (window.umami && typeof window.umami.track === 'function') {
      ready = true;
      track('app_session_start');
      if (pageProvider) {
        const current = pageProvider();
        page(current.page, current.surah);
      }
      setStatus('مفعّلة بموافقتك — يمكنك تغيير اختيارك هنا.');
      return;
    }
    loading = true;
    const script = document.createElement('script');
    tracker = script;
    script.src = window.CONFIG.UMAMI_SCRIPT_URL;
    script.async = true;
    script.dataset.websiteId = window.CONFIG.UMAMI_WEBSITE_ID;
    script.dataset.autoTrack = 'false';
    script.dataset.domains = location.hostname;
    script.onload = () => {
      loading = false;
      if (consent() !== 'granted') {
        script.remove();
        if (tracker === script) tracker = null;
        return;
      }
      ready = !!(window.umami && typeof window.umami.track === 'function');
      if (!ready) {
        console.warn('Analytics tracker loaded without its tracking API.');
        setStatus('تعذّر تهيئة التحليلات؛ سيظل التطبيق يعمل دونها.');
        return;
      }
      track('app_session_start');
      if (pageProvider) {
        const current = pageProvider();
        page(current.page, current.surah);
      }
      setStatus('مفعّلة بموافقتك — يمكنك تغيير اختيارك هنا.');
    };
    script.onerror = () => {
      loading = false;
      if (tracker === script) tracker = null;
      console.warn('Analytics tracker could not be loaded.');
      setStatus('تعذّر الاتصال بمنصة التحليلات؛ سيظل التطبيق يعمل دونها.');
    };
    document.head.appendChild(script);
  }

  function closeDialog() {
    const dialog = document.querySelector('#analyticsConsent');
    if (!dialog) return;
    dialog.classList.remove('on');
    dialog.setAttribute('aria-hidden', 'true');
  }

  function openDialog() {
    const dialog = document.querySelector('#analyticsConsent');
    if (!dialog) return;
    if (!configured()) {
      setStatus('التحليلات غير مهيّأة أو أن التطبيق ليس على HTTPS. أضف معرّف Umami إلى config.js.');
      return;
    }
    dialog.classList.add('on');
    dialog.setAttribute('aria-hidden', 'false');
    document.querySelector('#analyticsAccept').focus();
  }

  function choose(value) {
    if (!saveConsent(value)) return;
    if (value === 'granted') {
      loadTracker();
      setStatus('جارٍ تفعيل التحليلات بموافقتك.');
    } else {
      ready = false;
      loading = false;
      if (tracker) tracker.remove();
      tracker = null;
      currentPage = null;
      currentSurah = null;
      setStatus('متوقفة — لم يُحمّل متعقّب التحليلات.');
    }
    closeDialog();
  }

  document.querySelector('#analyticsAccept').addEventListener('click', () => choose('granted'));
  document.querySelector('#analyticsReject').addEventListener('click', () => choose('denied'));
  document.querySelector('#analyticsClose').addEventListener('click', closeDialog);
  window.addEventListener('error', e => track('app_error', { source: 'runtime', kind: e.error && e.error.name || 'error' }));
  window.addEventListener('unhandledrejection', e => track('app_error', { source: 'promise', kind: e.reason && e.reason.name || 'rejection' }));

  window.QuranAnalytics = {
    init(provider) {
      pageProvider = provider;
      if (!configured()) {
        setStatus('غير مهيّأة. أضف معرّف Umami إلى config.js وانشر التطبيق عبر HTTPS.');
        return;
      }
      if (consent() === 'granted') loadTracker();
      else if (consent() !== 'denied') openDialog();
      else setStatus('متوقفة — لم يُحمّل متعقّب التحليلات.');
    },
    manage: openDialog,
    track,
    page
  };
})();

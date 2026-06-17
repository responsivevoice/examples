(() => {
  if (typeof window === 'undefined') return;
  if (typeof window.rvApiKey !== 'undefined') return;

  const STORAGE_KEY_API_KEY = 'rv:examples:apiKey';
  const STORAGE_KEY_API_ENDPOINT = 'rv:examples:apiEndpoint';
  const DEFAULT_API_ENDPOINT = 'https://texttospeech.responsivevoice.org/v2';
  const REGISTER_URL = 'https://responsivevoice.org/register';

  function safeGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_e) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_e) {
      /* ignore */
    }
  }

  function safeRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (_e) {
      /* ignore */
    }
  }

  const storedKey = safeGet(STORAGE_KEY_API_KEY);
  const storedEndpoint = safeGet(STORAGE_KEY_API_ENDPOINT);
  if (storedKey) window.rvApiKey = storedKey;
  if (storedEndpoint) window.rvApiEndpoint = storedEndpoint;

  const ATTR_HANDLERS = {
    class: (node, value) => {
      node.className = value;
    },
    text: (node, value) => {
      node.textContent = value;
    },
    html: (node, value) => {
      node.innerHTML = value;
    },
  };

  function setAttr(node, name, value) {
    const handler = ATTR_HANDLERS[name];
    if (handler) handler(node, value);
    else node.setAttribute(name, value);
  }

  function applyAttrs(node, attrs) {
    for (const name in attrs) {
      // biome-ignore lint/suspicious/noPrototypeBuiltins: Object.hasOwn is ES2022; IIFE target is Safari 12+ (ES2017).
      if (Object.prototype.hasOwnProperty.call(attrs, name)) {
        setAttr(node, name, attrs[name]);
      }
    }
  }

  function appendChildren(node, children) {
    for (const child of children) {
      if (child) node.appendChild(child);
    }
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) applyAttrs(node, attrs);
    if (children) appendChildren(node, children);
    return node;
  }

  function renderPreKey(root) {
    const card = el('div', { class: 'rv-key-card rv-key-card--prekey' });

    card.appendChild(
      el('p', { class: 'rv-key-lede' }, [
        document.createTextNode("You're hearing your browser's default voice. "),
        el('strong', {
          text: 'A free ResponsiveVoice API key unlocks premium voices on every demo.',
        }),
      ])
    );

    card.appendChild(
      el('a', {
        class: 'rv-key-cta',
        href: REGISTER_URL,
        target: '_blank',
        rel: 'noopener',
        text: 'Get your free API key',
      })
    );
    card.appendChild(el('p', { class: 'rv-key-cta-note', text: 'Free signup — under a minute.' }));

    card.appendChild(el('hr', { class: 'rv-key-divider' }));

    card.appendChild(
      el('p', { class: 'rv-key-paste-heading', text: 'Already have a key? Paste it below:' })
    );

    const keyInput = el('input', {
      type: 'password',
      class: 'rv-key-input',
      placeholder: 'Paste your API key',
      autocomplete: 'off',
      spellcheck: 'false',
    });
    card.appendChild(keyInput);

    const details = el('details', { class: 'rv-key-advanced' });
    details.appendChild(el('summary', { text: 'Advanced settings' }));
    details.appendChild(
      el('label', { class: 'rv-key-label', for: 'rv-key-endpoint', text: 'TTS server URL' })
    );
    const endpointInput = el('input', {
      type: 'text',
      id: 'rv-key-endpoint',
      class: 'rv-key-input',
      value: DEFAULT_API_ENDPOINT,
      placeholder: DEFAULT_API_ENDPOINT,
      autocomplete: 'off',
      spellcheck: 'false',
    });
    details.appendChild(endpointInput);
    details.appendChild(
      el('p', {
        class: 'rv-key-helper',
        text: 'Default works for production. Pre-launch testers can edit the subdomain.',
      })
    );
    card.appendChild(details);

    const saveBtn = el('button', { type: 'button', class: 'rv-key-save', text: 'Save key' });
    card.appendChild(saveBtn);

    saveBtn.addEventListener('click', () => {
      const key = (keyInput.value || '').trim();
      if (!key) {
        keyInput.focus();
        return;
      }
      safeSet(STORAGE_KEY_API_KEY, key);
      const endpoint = (endpointInput.value || '').trim();
      if (endpoint && endpoint !== DEFAULT_API_ENDPOINT) {
        safeSet(STORAGE_KEY_API_ENDPOINT, endpoint);
      } else {
        safeRemove(STORAGE_KEY_API_ENDPOINT);
      }
      window.location.reload();
    });

    keyInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        saveBtn.click();
      }
    });

    root.appendChild(card);
  }

  function renderPostKey(root, endpoint) {
    const card = el('div', { class: 'rv-key-card rv-key-card--postkey' });
    card.appendChild(
      el('p', { class: 'rv-key-confirm', text: 'Premium voices enabled — using your API key.' })
    );
    if (endpoint) {
      card.appendChild(el('p', { class: 'rv-key-server', text: `Server: ${endpoint}` }));
    }
    const changeBtn = el('button', {
      type: 'button',
      class: 'rv-key-link',
      text: 'Change settings',
    });
    card.appendChild(changeBtn);
    changeBtn.addEventListener('click', () => {
      safeRemove(STORAGE_KEY_API_KEY);
      safeRemove(STORAGE_KEY_API_ENDPOINT);
      window.location.reload();
    });
    root.appendChild(card);
  }

  function mount() {
    const anchor = document.querySelector('.subtitle') || document.querySelector('.header');
    // biome-ignore lint/complexity/useOptionalChain: optional chaining is ES2020; IIFE target is Safari 12+ (ES2017).
    if (!anchor || !anchor.parentNode) return;

    const host = el('div', { class: 'rv-key-scaffold' });
    anchor.parentNode.insertBefore(host, anchor.nextSibling);

    if (storedKey) {
      renderPostKey(host, storedEndpoint);
    } else {
      renderPreKey(host);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

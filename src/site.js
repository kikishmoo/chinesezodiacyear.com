/* ============================================
   ChineseZodiacYear.com — Site JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Base Path Detection (for GitHub Pages subpath) --- */
  const basePath = (function() {
    const link = document.querySelector('link[rel="stylesheet"][href*="styles.css"]');
    if (link) {
      const m = link.getAttribute('href').match(/^(\/[^/]+\/)?styles\.css/);
      if (m && m[1]) return m[1].replace(/\/$/, '');
    }
    return '';
  })();

  /* --- Mobile Navigation Toggle --- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    const toggleBodyScroll = (lock) => {
      document.body.style.overflow = lock ? 'hidden' : '';
    };
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      toggleBodyScroll(isOpen);
    });
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        toggleBodyScroll(false);
      }
    });
  }

  /* --- Nav Dropdown Toggle --- */
  document.querySelectorAll('.nav-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = btn.parentElement;
      const wasOpen = dropdown.classList.contains('open');
      document.querySelectorAll('.nav-dropdown').forEach(d => {
        d.classList.remove('open');
        var toggle = d.querySelector('.nav-dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        dropdown.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown').forEach(d => {
      d.classList.remove('open');
      var toggle = d.querySelector('.nav-dropdown-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* --- Zodiac Calculator --- */
  const zodiacData = [
    { animal: 'Rat',     emoji: '🐀', cn: '鼠', traits: 'Quick-witted, resourceful, versatile' },
    { animal: 'Ox',      emoji: '🐂', cn: '牛', traits: 'Diligent, dependable, determined' },
    { animal: 'Tiger',   emoji: '🐅', cn: '虎', traits: 'Brave, confident, competitive' },
    { animal: 'Rabbit',  emoji: '🐇', cn: '兔', traits: 'Gentle, quiet, elegant' },
    { animal: 'Dragon',  emoji: '🐉', cn: '龍', traits: 'Confident, ambitious, charismatic' },
    { animal: 'Snake',   emoji: '🐍', cn: '蛇', traits: 'Enigmatic, wise, intuitive' },
    { animal: 'Horse',   emoji: '🐎', cn: '馬', traits: 'Energetic, free-spirited, warm' },
    { animal: 'Goat',    emoji: '🐐', cn: '羊', traits: 'Calm, gentle, sympathetic' },
    { animal: 'Monkey',  emoji: '🐒', cn: '猴', traits: 'Sharp, curious, inventive' },
    { animal: 'Rooster', emoji: '🐓', cn: '雞', traits: 'Observant, hardworking, courageous' },
    { animal: 'Dog',     emoji: '🐕', cn: '狗', traits: 'Loyal, honest, amiable' },
    { animal: 'Pig',     emoji: '🐖', cn: '豬', traits: 'Compassionate, generous, diligent' }
  ];

  /* Famous historical figures for each zodiac animal (index 0=Rat, 1=Ox, ... 11=Pig).
     Each entry: { name, cn, born, title, story }. Birth years verified via ((year-4)%12+12)%12. */
  const famousFigures = [
    /* 0 Rat */   { name: 'Du Fu', cn: '杜甫', born: '712-770 CE', title: 'The Poet Sage (詩聖)', story: 'Du Fu is revered as the greatest realist poet in Chinese history. His works document the devastation of the An Lushan Rebellion and the suffering of common people with unmatched compassion and technical mastery.' },
    /* 1 Ox */    { name: 'Su Shi', cn: '蘇軾', born: '1037-1101 CE', title: 'Song Dynasty Polymath', story: 'Su Shi (Su Dongpo) was a poet, painter, calligrapher, statesman, and gastronome. He is considered one of the greatest poets of the Song Dynasty and invented Dongpo Pork, still beloved today.' },
    /* 2 Tiger */ { name: 'Qin Shi Huang', cn: '秦始皇', born: '259-210 BCE', title: 'First Emperor of China', story: 'Qin Shi Huang unified China, standardised writing, weights, and currency, built the Great Wall, and created the Terracotta Army. He ended centuries of warring states to forge one empire.' },
    /* 3 Rabbit */{ name: 'Emperor Qianlong', cn: '乾隆帝', born: '1711-1799 CE', title: 'Qing Dynasty Zenith Emperor', story: 'The Qianlong Emperor presided over the height of Qing power and prosperity. A prolific poet and art collector, his 60-year reign saw territorial expansion and cultural flourishing.' },
    /* 4 Dragon */{ name: 'Zhu Yuanzhang', cn: '朱元璋', born: '1328-1398 CE', title: 'Ming Dynasty Founder (洪武帝)', story: 'From orphaned beggar monk to Emperor. Zhu Yuanzhang overthrew the Mongol Yuan Dynasty and founded the Ming, one of the greatest rags-to-riches stories in world history.' },
    /* 5 Snake */ { name: 'Zhu Xi', cn: '朱熹', born: '1130-1200 CE', title: 'Neo-Confucian Philosopher', story: 'Zhu Xi synthesised Confucian thought into Neo-Confucianism, which became China\'s state ideology for 700 years. He compiled the Four Books that shaped East Asian education.' },
    /* 6 Horse */ { name: 'Emperor Taizong', cn: '唐太宗 李世民', born: '598-649 CE', title: 'Tang Dynasty Golden Age Ruler', story: 'Li Shimin established the Zhenguan era, widely regarded as the pinnacle of Chinese civilisation. His openness to foreign cultures and meritocratic governance made Tang Chang\'an the world\'s greatest city.' },
    /* 7 Goat */  { name: 'Cao Cao', cn: '曹操', born: '155-220 CE', title: 'Warlord, Poet & Strategist', story: 'Cao Cao unified northern China during the Three Kingdoms era. Beyond his military genius, he was also one of the finest poets of the Jian\'an period, bringing emotional depth to verse.' },
    /* 8 Monkey */{ name: 'Li Bai', cn: '李白', born: '701-762 CE', title: 'The Immortal of Poetry (詩仙)', story: 'Li Bai is the most celebrated Romantic poet in Chinese history. His vivid imagination, love of wine and moonlight, and spontaneous genius produced some of the most beloved poems ever written in Chinese.' },
    /* 9 Rooster*/{ name: 'Zhuge Liang', cn: '諸葛亮', born: '181-234 CE', title: 'The Sleeping Dragon (臥龍)', story: 'Zhuge Liang was the legendary strategist of Shu Han during the Three Kingdoms. His brilliance in statecraft and warfare made him the Chinese archetype of wisdom and loyalty.' },
    /* 10 Dog */  { name: 'Emperor Wu of Han', cn: '漢武帝', born: '156-87 BCE', title: 'Expansionist Emperor', story: 'Emperor Wu (漢武帝) transformed the Han Dynasty into a continental power, opening the Silk Road, establishing Confucianism as state ideology, and extending Chinese influence deep into Central Asia.' },
    /* 11 Pig */  { name: 'Bao Zheng', cn: '包拯', born: '999-1062 CE', title: 'Incorruptible Judge (包青天)', story: 'Bao Zheng (包青天, "Blue Sky Bao") is China\'s legendary symbol of justice and incorruptibility. As a Song Dynasty official, he was famed for his impartial judgements regardless of rank or power.' }
  ];

  const elements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
  const heavenlyStems = ['Jia 甲', 'Yi 乙', 'Bing 丙', 'Ding 丁', 'Wu 戊', 'Ji 己', 'Geng 庚', 'Xin 辛', 'Ren 壬', 'Gui 癸'];

  /* Lichun (立春) dates: month and day for each year 1900-2100.
     Lichun marks the true start of the Chinese zodiac year in BaZi tradition.
     Format: year: [month, day] — almost always February 3, 4, or 5. */
  const lichunDates = {
    1900:[2,4],1901:[2,4],1902:[2,5],1903:[2,5],1904:[2,5],1905:[2,4],1906:[2,4],1907:[2,5],1908:[2,5],1909:[2,4],
    1910:[2,4],1911:[2,5],1912:[2,5],1913:[2,4],1914:[2,4],1915:[2,5],1916:[2,5],1917:[2,4],1918:[2,4],1919:[2,5],
    1920:[2,5],1921:[2,4],1922:[2,4],1923:[2,5],1924:[2,5],1925:[2,4],1926:[2,4],1927:[2,5],1928:[2,5],1929:[2,4],
    1930:[2,4],1931:[2,5],1932:[2,5],1933:[2,4],1934:[2,4],1935:[2,5],1936:[2,5],1937:[2,4],1938:[2,4],1939:[2,5],
    1940:[2,5],1941:[2,4],1942:[2,4],1943:[2,5],1944:[2,5],1945:[2,4],1946:[2,4],1947:[2,5],1948:[2,5],1949:[2,4],
    1950:[2,4],1951:[2,4],1952:[2,5],1953:[2,4],1954:[2,4],1955:[2,4],1956:[2,5],1957:[2,4],1958:[2,4],1959:[2,4],
    1960:[2,5],1961:[2,4],1962:[2,4],1963:[2,4],1964:[2,5],1965:[2,4],1966:[2,4],1967:[2,4],1968:[2,5],1969:[2,4],
    1970:[2,4],1971:[2,4],1972:[2,5],1973:[2,4],1974:[2,4],1975:[2,4],1976:[2,5],1977:[2,4],1978:[2,4],1979:[2,4],
    1980:[2,5],1981:[2,4],1982:[2,4],1983:[2,4],1984:[2,4],1985:[2,4],1986:[2,4],1987:[2,4],1988:[2,4],1989:[2,4],
    1990:[2,4],1991:[2,4],1992:[2,4],1993:[2,4],1994:[2,4],1995:[2,4],1996:[2,4],1997:[2,4],1998:[2,4],1999:[2,4],
    2000:[2,4],2001:[2,4],2002:[2,4],2003:[2,4],2004:[2,4],2005:[2,4],2006:[2,4],2007:[2,4],2008:[2,4],2009:[2,4],
    2010:[2,4],2011:[2,4],2012:[2,4],2013:[2,4],2014:[2,4],2015:[2,4],2016:[2,4],2017:[2,3],2018:[2,4],2019:[2,4],
    2020:[2,4],2021:[2,3],2022:[2,4],2023:[2,4],2024:[2,4],2025:[2,3],2026:[2,4],2027:[2,4],2028:[2,4],2029:[2,3],
    2030:[2,4],2031:[2,4],2032:[2,4],2033:[2,3],2034:[2,4],2035:[2,4],2036:[2,4],2037:[2,4],2038:[2,4],2039:[2,4],
    2040:[2,4],2041:[2,3],2042:[2,4],2043:[2,4],2044:[2,4],2045:[2,3],2046:[2,4],2047:[2,4],2048:[2,4],2049:[2,3],
    2050:[2,4],2051:[2,4],2052:[2,4],2053:[2,3],2054:[2,4],2055:[2,4],2056:[2,4],2057:[2,3],2058:[2,4],2059:[2,4],
    2060:[2,4],2061:[2,3],2062:[2,4],2063:[2,4],2064:[2,4],2065:[2,3],2066:[2,4],2067:[2,4],2068:[2,4],2069:[2,3],
    2070:[2,4],2071:[2,4],2072:[2,4],2073:[2,3],2074:[2,4],2075:[2,4],2076:[2,4],2077:[2,3],2078:[2,4],2079:[2,4],
    2080:[2,4],2081:[2,3],2082:[2,4],2083:[2,4],2084:[2,4],2085:[2,3],2086:[2,4],2087:[2,4],2088:[2,4],2089:[2,3],
    2090:[2,4],2091:[2,4],2092:[2,4],2093:[2,3],2094:[2,4],2095:[2,4],2096:[2,4],2097:[2,3],2098:[2,4],2099:[2,4],
    2100:[2,4]
  };

  /** Returns the zodiac year adjusted for Lichun boundary.
      If birthday is before Lichun of that year, the zodiac year is previous year. */
  function getZodiacYear(year, month, day) {
    if (!month || !day) return year; // no month/day → fall back to year-only
    const lc = lichunDates[year];
    if (!lc) return year; // outside table range
    const lcMonth = lc[0], lcDay = lc[1];
    if (month < lcMonth || (month === lcMonth && day < lcDay)) {
      return year - 1;
    }
    return year;
  }

  function getZodiac(year) {
    const idx = ((year - 4) % 12 + 12) % 12;
    return zodiacData[idx];
  }

  function getElement(year) {
    const idx = ((year - 4) % 10 + 10) % 10;
    return elements[idx];
  }

  function getHeavenlyStem(year) {
    const idx = ((year - 4) % 10 + 10) % 10;
    return heavenlyStems[idx];
  }

  const calcForm = document.getElementById('zodiac-calc-form');
  const calcResult = document.getElementById('calc-result');
  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const yearInput = document.getElementById('birth-year');
      const monthSelect = document.getElementById('birth-month');
      const dayInput = document.getElementById('birth-day');
      const year = parseInt(yearInput.value);
      const month = monthSelect ? parseInt(monthSelect.value) || 0 : 0;
      const day = dayInput ? parseInt(dayInput.value) || 0 : 0;

      if (isNaN(year) || year < 1900 || year > 2100) {
        alert('Please enter a valid year between 1900 and 2100.');
        return;
      }

      // Determine zodiac year using Lichun boundary when birthday is provided
      const zodiacYear = getZodiacYear(year, month, day);
      const yearOnlyZodiac = getZodiac(year);
      const zodiac = getZodiac(zodiacYear);
      const element = getElement(zodiacYear);
      const stem = getHeavenlyStem(zodiacYear);
      const elementClass = 'element-' + element.toLowerCase();

      // Check if Lichun adjustment changed the result
      const lichunAdjusted = (month && day && zodiacYear !== year);

      let lichunNote = '';
      if (lichunAdjusted) {
        const lc = lichunDates[year];
        const lcDateStr = 'February ' + lc[1];
        lichunNote = `
          <div class="lichun-note">
            <strong>Lichun Adjustment (立春):</strong> Your birthday falls before Lichun (${lcDateStr}, ${year}), the traditional start of the Chinese zodiac year in BaZi astrology. Based on your birth year alone, you would be a ${yearOnlyZodiac.animal} (${yearOnlyZodiac.cn}). However, since you were born before the solar new year transition, your zodiac animal is the ${zodiac.animal} (${zodiac.cn}) of ${zodiacYear}. This follows the classical BaZi convention used in Four Pillars of Destiny calculations, where the year pillar changes at Lichun rather than at Chinese New Year.
          </div>`;
      } else if (month && day && month <= 2) {
        // Birthday is in Jan/Feb but after Lichun — reassure the user
        lichunNote = `
          <div class="lichun-note lichun-note-ok">
            <strong>Lichun Check (立春):</strong> Your birthday falls on or after Lichun for ${year}, so your zodiac animal matches the year. No adjustment needed.
          </div>`;
      }

      const zodiacIdx = ((zodiacYear - 4) % 12 + 12) % 12;
      const figure = famousFigures[zodiacIdx];
      const figureCard = figure ? `
        <div class="famous-person-card">
          <div class="famous-person-label">Famous ${zodiac.animal} in History</div>
          <div class="famous-person-info">
            <h4>${figure.name} <span class="chinese-char">${figure.cn}</span></h4>
            <div class="famous-person-dates">${figure.title} &middot; ${figure.born}</div>
            <p class="famous-person-story">${figure.story}</p>
          </div>
        </div>` : '';

      calcResult.innerHTML = `
        <div class="calc-result-animal">${zodiac.emoji}</div>
        <h3>${zodiac.animal} <span class="chinese-char">${zodiac.cn}</span></h3>
        <p class="calc-result-element ${elementClass}">${element} ${zodiac.animal}</p>
        <p class="mt-md" style="color:var(--graphite);font-size:0.95rem;margin:1rem auto 0;max-width:400px;">
          <strong>Heavenly Stem:</strong> ${stem}<br>
          <strong>Traits:</strong> ${zodiac.traits}
        </p>
        ${lichunNote}
        ${figureCard}
        <p style="margin-top:1rem;"><a href="${basePath}/zodiac/" style="font-weight:600;">Read more about the ${zodiac.animal} &rarr;</a></p>
      `;
      calcResult.classList.add('show');
      calcResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      // Close all siblings
      item.parentElement.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        var b = i.querySelector('.faq-question');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --- Clickable Article Cards --- */
  /* Makes entire .article-card clickable by delegating to the primary link inside */
  document.querySelectorAll('.article-card').forEach(card => {
    const link = card.querySelector('h2 a, h3 a, .card-title a');
    if (!link) return;
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // Don't intercept if the user clicked an actual link or button inside the card
      if (e.target.closest('a, button')) return;
      link.click();
    });
  });

  /* --- Directory & News Filter --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const listingCards = document.querySelectorAll('.directory-card[data-category], .article-card[data-category]');
  const noResultsMsgs = document.querySelectorAll('.news-no-results');

  function applyFilter(cat) {
    filterBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.filter === cat);
    });
    var visibleCount = 0;
    listingCards.forEach(card => {
      var show = (cat === 'all' || card.dataset.category === cat);
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });
    noResultsMsgs.forEach(msg => {
      msg.hidden = (visibleCount > 0);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      var cat = btn.dataset.filter;
      applyFilter(cat);
      if (cat && cat !== 'all') {
        history.replaceState(null, '', '#category=' + cat);
      } else {
        history.replaceState(null, '', window.location.pathname);
      }
    });
  });

  /* Apply filter from URL hash on page load */
  (function() {
    var hash = window.location.hash;
    if (hash && hash.indexOf('#category=') === 0) {
      var cat = hash.replace('#category=', '');
      if (cat) applyFilter(cat);
    }
  })();

  /* "Show all" buttons inside no-results messages */
  document.querySelectorAll('.news-show-all-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyFilter('all');
      history.replaceState(null, '', window.location.pathname);
    });
  });

  /* --- Directory Search --- */
  const searchInput = document.getElementById('directory-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      listingCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  /* --- Scroll Animations --- */
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  /* --- Zodiac Wheel Positioning --- */
  const wheelAnimals = document.querySelectorAll('.wheel-animal');
  if (wheelAnimals.length) {
    const radius = 145;
    wheelAnimals.forEach((el, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = 170 + radius * Math.cos(angle);
      const y = 170 + radius * Math.sin(angle);
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    });
  }

  /* --- Active Nav Highlight --- */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || href === currentPath.replace(/\/$/, '') || currentPath === basePath + '/' && (href === basePath + '/' || href === '/')) {
      link.classList.add('active');
    }
  });

  /* --- Language-Aware Nav Links ---
     When the page is on a language-prefixed path (/zh-hant/ or /zh-hans/),
     rewrite internal nav links so that clicking them preserves the current
     language instead of falling back to the English base URL. */
  (function() {
    var prefix = '';
    var p = window.location.pathname;
    if (p.indexOf('/zh-hant') === 0) prefix = '/zh-hant';
    else if (p.indexOf('/zh-hans') === 0) prefix = '/zh-hans';
    if (!prefix) return;
    document.querySelectorAll('.main-nav a, .site-logo, .header-search-link, .site-footer a').forEach(function(link) {
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '/' || href.indexOf('/zh-hant') === 0 || href.indexOf('/zh-hans') === 0) return;
      /* Skip non-HTML resources (e.g. /sitemap.xml, /feed.xml) */
      if (/\.\w{2,4}$/.test(href)) return;
      link.setAttribute('href', prefix + href);
    });
  })();

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --- Newsletter Form (Beehiiv / Formsubmit Fallback) --- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      if (!emailInput || !emailInput.value) return;

      const email = emailInput.value;
      /* Walk up to the nearest container that holds both form and messages */
      const section = form.closest('.newsletter-content')
                   || form.closest('.email-popup')
                   || form.closest('.content-upgrade')
                   || form.parentElement;
      /* Find success/error by class (works for footer, popup, and content-upgrade) */
      const successEl = section.querySelector('.newsletter-message:not(.newsletter-message--error)');
      const errorEl   = section.querySelector('.newsletter-message--error');
      const originalBtnHTML = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing\u2026';

      const showSuccess = () => {
        form.style.display = 'none';
        if (successEl) { successEl.hidden = false; successEl.style.display = ''; }
        if (errorEl) { errorEl.hidden = true; errorEl.style.display = 'none'; }
      };
      const showError = () => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        if (errorEl) { errorEl.hidden = false; errorEl.style.display = ''; }
        if (successEl) { successEl.hidden = true; successEl.style.display = 'none'; }
      };

      if (form.dataset.beehiiv) {
        /* Beehiiv — POST via hidden iframe to avoid CORS */
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.name = 'beehiiv-frame-' + Date.now();
        document.body.appendChild(iframe);
        const proxyForm = document.createElement('form');
        proxyForm.method = 'POST';
        proxyForm.action = form.action;
        proxyForm.target = iframe.name;
        proxyForm.style.display = 'none';
        const input = document.createElement('input');
        input.name = 'email';
        input.value = email;
        proxyForm.appendChild(input);
        /* Copy hidden fields */
        form.querySelectorAll('input[type="hidden"]').forEach(h => {
          const clone = document.createElement('input');
          clone.type = 'hidden';
          clone.name = h.name;
          clone.value = h.value;
          proxyForm.appendChild(clone);
        });
        document.body.appendChild(proxyForm);
        proxyForm.submit();
        setTimeout(() => {
          showSuccess();
          try { document.body.removeChild(iframe); document.body.removeChild(proxyForm); } catch (ex) {}
        }, 1500);
      } else {
        /* Formsubmit.co fallback — AJAX POST */
        const formData = { email: email };
        form.querySelectorAll('input[type="hidden"], input[name="_honey"]').forEach(f => {
          if (f.name) formData[f.name] = f.value;
        });
        fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(formData)
        })
        .then(res => { if (res.ok) showSuccess(); else showError(); })
        .catch(() => showError());
      }
    });
  });

  /* --- Site Search (/search?q=) --- */
  const searchForm = document.getElementById('site-search-form');
  const siteSearchInput = document.getElementById('site-search-input');
  const searchResults = document.getElementById('search-results');
  const searchStatus = document.getElementById('search-status');

  if (searchForm && siteSearchInput && searchResults) {
    let searchIndex = null;

    const loadIndex = () => {
      if (searchIndex) return Promise.resolve(searchIndex);
      return fetch(basePath + '/search-index.json')
        .then(r => r.json())
        .then(data => { searchIndex = data; return data; });
    };

    const scoreMatch = (item, terms) => {
      let score = 0;
      const title = (item.title || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const keywords = (item.keywords || '').toLowerCase();
      const body = (item.body || '').toLowerCase();
      for (const t of terms) {
        if (title.includes(t)) score += 10;
        if (title.startsWith(t) || title.includes(' ' + t)) score += 5;
        if (keywords.includes(t)) score += 4;
        if (desc.includes(t)) score += 2;
        if (body.includes(t)) score += 1;
      }
      return score;
    };

    const runSearch = (query) => {
      const q = query.trim().toLowerCase();
      if (!q) {
        searchResults.innerHTML = '';
        if (searchStatus) searchStatus.hidden = true;
        return;
      }
      const terms = q.split(/\s+/).filter(Boolean);
      loadIndex().then(data => {
        const scored = data
          .map(item => ({ ...item, score: scoreMatch(item, terms) }))
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score);

        if (searchStatus) {
          searchStatus.hidden = false;
          searchStatus.textContent = scored.length
            ? scored.length + ' result' + (scored.length > 1 ? 's' : '') + ' for \u201c' + query.trim() + '\u201d'
            : 'No results for \u201c' + query.trim() + '\u201d';
        }

        searchResults.innerHTML = scored.length
          ? scored.map(item =>
            '<a href="' + item.url + '" class="search-result-card">' +
              '<span class="search-result-title">' + escapeHtml(item.title) + '</span>' +
              (item.description ? '<span class="search-result-desc">' + escapeHtml(item.description.slice(0, 160)) + '</span>' : '') +
              '<span class="search-result-url">' + item.url + '</span>' +
            '</a>'
          ).join('')
          : '<p class="search-no-results">Try different keywords or browse the <a href="/zodiac/">encyclopedia</a>.</p>';
      }).catch(() => {
        if (searchStatus) { searchStatus.hidden = false; searchStatus.textContent = 'Search unavailable. Please try again later.'; }
      });
    };

    const escapeHtml = (str) => str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

    /* Handle ?q= on page load */
    const params = new URLSearchParams(window.location.search);
    const initialQ = params.get('q');
    if (initialQ) {
      siteSearchInput.value = initialQ;
      runSearch(initialQ);
    }

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = siteSearchInput.value.trim();
      if (q) {
        window.history.replaceState(null, '', '/search?q=' + encodeURIComponent(q));
        runSearch(q);
      }
    });

    /* Live search with debounce */
    let debounceTimer;
    siteSearchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = siteSearchInput.value.trim();
        if (q.length >= 2) runSearch(q);
        else { searchResults.innerHTML = ''; if (searchStatus) searchStatus.hidden = true; }
      }, 300);
    });
  }

  /* --- Dark Mode Toggle --- */
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('czy-theme', next);
    });
  }

  /* --- Compatibility Checker --- */
  const compatForm = document.getElementById('compat-form');
  const compatResult = document.getElementById('compat-result');
  if (compatForm && compatResult) {
    // Animals indexed 0-11: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig
    const sixHarmonies = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
    const threeHarmonies = [[8,0,4],[2,6,10],[5,9,1],[11,3,7]];
    const sixClashes = [[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]];
    const sixHarms = [[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]];
    const selfPenalty = [0,4,6,9]; // self-punishment animals

    function findRelation(a, b) {
      const relations = [];
      if (a === b) {
        relations.push({type:'same', label:'Same Animal', icon:'&#9775;', cls:'tag-culture',
          desc:'You share the same zodiac animal. This can mean deep understanding and natural rapport, but also shared blind spots. During a Ben Ming Nian (本命年), both may face similar challenges simultaneously.'});
        if (selfPenalty.includes(a)) {
          relations.push({type:'self-penalty', label:'Self-Punishment', icon:'&#9888;', cls:'tag-bazi',
            desc:'This animal carries a self-punishment (自刑) relationship. When doubled, the tendency toward self-sabotage or internal conflict may be amplified. Awareness is the key to managing this energy.'});
        }
      }
      for (const [x,y] of sixHarmonies) {
        if ((a===x&&b===y)||(a===y&&b===x)) {
          relations.push({type:'harmony6', label:'Six Harmony (六合)', icon:'&#9829;', cls:'tag-zodiac',
            desc:'This is one of the six most compatible pairings in Chinese astrology. Your Earthly Branches combine to create harmonious elemental energy. This relationship is characterised by natural ease, mutual support, and complementary strengths.'});
        }
      }
      for (const triad of threeHarmonies) {
        if (triad.includes(a) && triad.includes(b)) {
          const triNames = triad.map(i => zodiacData[i].animal);
          const elMap = {0:'Water',1:'Wood',2:'Fire',3:'Metal'};
          const triEl = elMap[threeHarmonies.indexOf(triad)];
          relations.push({type:'harmony3', label:'Three Harmony (三合)', icon:'&#9733;', cls:'tag-fengshui',
            desc:'You belong to the same Three Harmony triad ('+triNames.join(', ')+'), sharing '+triEl+' elemental affinity. This creates natural cooperation, shared goals, and intuitive understanding between you.'});
        }
      }
      for (const [x,y] of sixClashes) {
        if ((a===x&&b===y)||(a===y&&b===x)) {
          relations.push({type:'clash', label:'Six Clash (六衝)', icon:'&#9876;', cls:'tag-bazi',
            desc:'Your animals sit directly opposite each other on the zodiac wheel. This clash can produce tension, disagreements, and opposing life philosophies. However, awareness of these dynamics allows you to transform conflict into complementary growth.'});
        }
      }
      for (const [x,y] of sixHarms) {
        if ((a===x&&b===y)||(a===y&&b===x)) {
          relations.push({type:'harm', label:'Six Harm (六害)', icon:'&#9888;', cls:'tag-business',
            desc:'This pairing falls under the Six Harms — subtle friction that develops gradually rather than overt conflict. Hidden resentments or misunderstandings may build over time. Open communication is essential to prevent erosion of trust.'});
        }
      }
      if (relations.length === 0) {
        relations.push({type:'neutral', label:'Neutral Relationship', icon:'&#9676;', cls:'tag-culture',
          desc:'No specific classical relationship (harmony, clash, or harm) exists between these two animals. This means neither strong natural affinity nor inherent friction — the relationship depends more on individual character and effort than zodiac dynamics.'});
      }
      return relations;
    }

    compatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ya = parseInt(document.getElementById('year-a').value);
      const yb = parseInt(document.getElementById('year-b').value);
      if (isNaN(ya)||isNaN(yb)||ya<1900||ya>2100||yb<1900||yb>2100) {
        alert('Please enter valid years between 1900 and 2100.'); return;
      }
      const zA = getZodiac(ya), zB = getZodiac(yb);
      const eA = getElement(ya), eB = getElement(yb);
      const iA = ((ya-4)%12+12)%12, iB = ((yb-4)%12+12)%12;
      const relations = findRelation(iA, iB);

      let html = '<div style="text-align:center;margin-bottom:1.5rem;">';
      html += '<div style="display:flex;justify-content:center;align-items:center;gap:1.5rem;flex-wrap:wrap;">';
      html += '<div><span style="font-size:3rem;">'+zA.emoji+'</span><div style="font-weight:700;margin-top:0.3rem;">'+eA+' '+zA.animal+'</div><div style="color:var(--graphite);font-size:0.9rem;">'+ya+' <span class="chinese-char">'+zA.cn+'</span></div></div>';
      html += '<div style="font-size:2rem;color:var(--imperial-gold);">&amp;</div>';
      html += '<div><span style="font-size:3rem;">'+zB.emoji+'</span><div style="font-weight:700;margin-top:0.3rem;">'+eB+' '+zB.animal+'</div><div style="color:var(--graphite);font-size:0.9rem;">'+yb+' <span class="chinese-char">'+zB.cn+'</span></div></div>';
      html += '</div></div>';

      relations.forEach(r => {
        html += '<div style="background:var(--parchment);border-radius:8px;padding:1.2rem 1.5rem;margin-bottom:1rem;border-left:4px solid var(--imperial-gold);">';
        html += '<div style="margin-bottom:0.5rem;"><span class="article-tag '+r.cls+'" style="font-size:0.8rem;">'+r.icon+' '+r.label+'</span></div>';
        html += '<p style="margin:0;color:var(--graphite);line-height:1.6;">'+r.desc+'</p>';
        html += '</div>';
      });

      html += '<p style="margin-top:1.5rem;font-size:0.9rem;color:var(--graphite);text-align:center;">For a comprehensive analysis, a full <a href="' + basePath + '/bazi/">BaZi chart</a> comparison is recommended.</p>';

      compatResult.innerHTML = html;
      compatResult.classList.add('show');
      compatResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  /* --- Social Share URL Population --- */
  document.querySelectorAll('.share-buttons').forEach(container => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    container.querySelectorAll('a[data-share]').forEach(btn => {
      const type = btn.dataset.share;
      switch (type) {
        case 'twitter':
          btn.href = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title; break;
        case 'facebook':
          btn.href = 'https://www.facebook.com/sharer/sharer.php?u=' + url; break;
        case 'linkedin':
          btn.href = 'https://www.linkedin.com/shareArticle?mini=true&url=' + url + '&title=' + title; break;
        case 'email':
          btn.href = 'mailto:?subject=' + title + '&body=' + url; break;
      }
    });
  });

  /* --- BaZi Calculator --- */
  const baziForm = document.getElementById('bazi-form');
  const baziResult = document.getElementById('bazi-result');
  const baziCityInput = document.getElementById('bazi-city');
  const citySuggestions = document.getElementById('city-suggestions');
  const unknownTimeCheck = document.getElementById('bazi-unknown-time');

  let citiesData = null;
  let selectedCity = null;

  // Escape HTML special characters to prevent XSS when inserting into innerHTML
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  // Load cities data lazily when BaZi form exists
  if (baziForm) {
    fetch(basePath + '/cities.json')
      .then(r => r.json())
      .then(data => { citiesData = data; })
      .catch(() => { /* cities won't autocomplete, user can still submit */ });

    // Unknown time checkbox toggles hour/minute fields
    if (unknownTimeCheck) {
      unknownTimeCheck.addEventListener('change', () => {
        const hourField = document.getElementById('bazi-hour');
        const minField = document.getElementById('bazi-minute');
        if (unknownTimeCheck.checked) {
          hourField.disabled = true; hourField.value = '';
          minField.disabled = true; minField.value = '';
        } else {
          hourField.disabled = false;
          minField.disabled = false;
        }
      });
    }

    // City autocomplete
    if (baziCityInput && citySuggestions) {
      let acTimeout;
      baziCityInput.addEventListener('input', () => {
        clearTimeout(acTimeout);
        acTimeout = setTimeout(() => {
          const q = baziCityInput.value.trim().toLowerCase();
          if (q.length < 2 || !citiesData) {
            citySuggestions.hidden = true;
            return;
          }
          const matches = citiesData.filter(c =>
            c.c.toLowerCase().includes(q) || c.co.toLowerCase().includes(q)
          ).slice(0, 8);
          if (matches.length === 0) {
            citySuggestions.hidden = true;
            return;
          }
          citySuggestions.innerHTML = matches.map((c, i) => {
            const safe = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
            return '<div class="city-option" data-idx="' + i + '">' + safe(c.c) + ', ' + safe(c.co) + '</div>';
          }).join('');
          citySuggestions.hidden = false;
          citySuggestions._matches = matches;
        }, 200);
      });

      citySuggestions.addEventListener('click', (e) => {
        const opt = e.target.closest('.city-option');
        if (!opt) return;
        const idx = parseInt(opt.dataset.idx);
        const city = citySuggestions._matches[idx];
        selectedCity = city;
        baziCityInput.value = city.c + ', ' + city.co;
        citySuggestions.hidden = true;
      });

      document.addEventListener('click', (e) => {
        if (!baziCityInput.contains(e.target) && !citySuggestions.contains(e.target)) {
          citySuggestions.hidden = true;
        }
      });
    }

    // BaZi form submit
    baziForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const year = parseInt(document.getElementById('bazi-year').value);
      const month = parseInt(document.getElementById('bazi-month').value);
      const day = parseInt(document.getElementById('bazi-day').value);
      const hour = document.getElementById('bazi-hour').value;
      const minute = document.getElementById('bazi-minute').value;
      const sex = document.getElementById('bazi-sex').value;

      if (!year || !month || !day) {
        alert('Please enter your birth year, month, and day.');
        return;
      }

      // Show loading state
      baziResult.innerHTML = '<div class="bazi-loading">Calculating your BaZi chart</div>';
      baziResult.classList.add('show');
      baziResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      const payload = {
        year, month, day,
        hour: hour !== '' ? parseInt(hour) : null,
        minute: minute !== '' ? parseInt(minute) : null,
        lat: selectedCity ? selectedCity.la : null,
        lng: selectedCity ? selectedCity.lo : null,
        tz: selectedCity ? selectedCity.tz : null,
        sex
      };

      try {
        const WORKER_URL = 'https://bazi-calculator.YOUR_SUBDOMAIN.workers.dev';
        const resp = await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!resp.ok) throw new Error('Server error: ' + resp.status);
        const data = await resp.json();
        if (data.error) throw new Error(data.error);
        renderBaziChart(data);
      } catch (err) {
        baziResult.innerHTML = '<div class="bazi-error"><strong>Error:</strong> ' + esc(err.message) +
          '<br><small>The BaZi calculation service may be temporarily unavailable. Please try again later.</small></div>';
      }
    });
  }

  function renderBaziChart(data) {
    if (!baziResult) return;
    const pillars = data.pillars || {};
    const names = ['hour', 'day', 'month', 'year'];
    const labels = ['Hour Pillar', 'Day Pillar', 'Month Pillar', 'Year Pillar'];
    const cnLabels = ['时柱', '日柱', '月柱', '年柱'];

    let html = '';

    // Day Master section
    if (data.dayMaster) {
      const dm = data.dayMaster;
      html += '<div class="bazi-day-master">';
      html += '<h4>Your Day Master (日主)</h4>';
      html += '<span style="font-family:var(--font-chinese);font-size:2.4rem;color:var(--deep-red);">' + esc(dm.stem) + '</span>';
      html += '<p style="margin:0.5rem 0 0;">' + esc(dm.pinyin) + ' — ' + esc(dm.yinYang) + ' ' + esc(dm.element) + '</p>';
      html += '</div>';
    }

    // Four Pillars grid
    html += '<div class="bazi-pillars">';
    names.forEach((name, i) => {
      const p = pillars[name] || {};
      html += '<div class="bazi-pillar">';
      html += '<div class="pillar-label">' + labels[i] + '<br><span style="font-family:var(--font-chinese);">' + cnLabels[i] + '</span></div>';
      if (p.stem) {
        const elClass = p.stemElement ? 'element-' + esc(p.stemElement.toLowerCase()) : '';
        html += '<div class="pillar-stem">' + esc(p.stem) + '</div>';
        html += '<div class="pillar-branch">' + esc(p.branch) + '</div>';
        html += '<div class="pillar-pinyin">' + esc(p.stemPinyin || '') + ' ' + esc(p.branchPinyin || '') + '</div>';
        if (p.stemElement) html += '<span class="pillar-element ' + elClass + '">' + esc(p.stemElement) + '</span>';
        if (p.branchAnimal) html += '<div class="pillar-animal">' + esc(p.branchAnimal) + '</div>';
      } else {
        html += '<div style="color:var(--stone);font-size:0.9rem;padding:1rem 0;">Not available</div>';
      }
      html += '</div>';
    });
    html += '</div>';

    // True Solar Time note
    if (data.trueSolarTime) {
      const tst = data.trueSolarTime;
      html += '<div class="lichun-note lichun-note-ok" style="max-width:100%;">';
      html += '<strong>True Solar Time:</strong> Your birth time was adjusted to ' +
        String(tst.hour).padStart(2, '0') + ':' + String(tst.minute).padStart(2, '0') +
        ' (true solar time) for accurate Hour Pillar calculation.';
      html += '</div>';
    }

    // Reading text
    if (data.rawExcerpt) {
      html += '<div style="margin-top:var(--sp-xl);">';
      html += '<h4 style="font-family:var(--font-display);color:var(--deep-red);margin-bottom:var(--sp-md);">Chart Analysis</h4>';
      html += '<div class="bazi-reading-text">' + esc(data.rawExcerpt.substring(0, 2000)) + '</div>';
      html += '</div>';
    }

    html += '<p style="margin-top:var(--sp-xl);font-size:0.85rem;color:var(--stone);text-align:center;">For a comprehensive reading, consult a qualified BaZi practitioner. <a href="' + basePath + '/directory/">Find one in our directory.</a></p>';

    baziResult.innerHTML = html;
  }
});

/* --- Shop Product Filters --- */
(function() {
  var filters = document.querySelectorAll('.shop-filter-btn');
  var cards = document.querySelectorAll('.product-card[data-category]');
  if (!filters.length) return;

  filters.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filters.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-filter');
      cards.forEach(function(card) {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.classList.remove('product-card--hidden');
        } else {
          card.classList.add('product-card--hidden');
        }
      });
    });
  });
})();

/* --- AdSense Init --- */
(function() {
  var ads = document.querySelectorAll('.adsbygoogle');
  if (ads.length && window.adsbygoogle) {
    ads.forEach(function() {
      try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
    });
  }
})();

/* --- Three-Language Toggle (EN / TC / SC) --- */
(function() {
  var CYCLE = ['en', 'tc', 'sc'];
  var PREFIXES = { en: '', tc: '/zh-hant', sc: '/zh-hans' };

  function setLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('czy-lang', lang);
    /* Update html lang attribute for accessibility */
    var htmlLang = lang === 'en' ? 'en' : (lang === 'tc' ? 'zh-Hant' : 'zh-Hans');
    document.documentElement.setAttribute('lang', htmlLang);
  }

  /* Toggle button cycles: en → tc → sc → en and navigates to language URL */
  var langBtn = document.querySelector('.lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-lang') || 'en';
      var idx = CYCLE.indexOf(current);
      var next = CYCLE[(idx + 1) % 3];
      /* Save preference */
      localStorage.setItem('czy-lang', next);
      /* Navigate to language-specific URL */
      var path = location.pathname;
      /* Strip existing language prefix */
      path = path.replace(/^\/(zh-hant|zh-hans)(\/|$)/, '/');
      /* Build target URL */
      var target = PREFIXES[next] + (path || '/');
      if (target === '') target = '/';
      location.href = target;
    });
  }
})();

/* ===== QR Code Lightbox (Donate page) ===== */
(function() {
  var qrImages = document.querySelectorAll('.donate-qr');
  if (!qrImages.length) return;

  /* Create lightbox overlay once */
  var overlay = document.createElement('div');
  overlay.className = 'qr-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'QR code enlarged view');
  var img = document.createElement('img');
  img.alt = '';
  var actions = document.createElement('div');
  actions.className = 'qr-lightbox-actions';
  var downloadBtn = document.createElement('a');
  downloadBtn.textContent = 'Save Image';
  downloadBtn.setAttribute('download', '');
  downloadBtn.href = '#';
  actions.appendChild(downloadBtn);
  var hint = document.createElement('span');
  hint.className = 'qr-lightbox-hint';
  hint.textContent = 'Long-press image to save \u00B7 Tap background to close';
  overlay.appendChild(img);
  overlay.appendChild(actions);
  overlay.appendChild(hint);
  document.body.appendChild(overlay);

  function openLightbox(src, alt) {
    img.src = src;
    img.alt = alt;
    downloadBtn.href = src;
    downloadBtn.setAttribute('download', src.split('/').pop());
    overlay.style.display = 'flex';
    requestAnimationFrame(function() {
      overlay.classList.add('is-visible');
    });
  }

  function closeLightbox() {
    overlay.classList.remove('is-visible');
    setTimeout(function() { overlay.style.display = 'none'; }, 250);
  }

  overlay.style.display = 'none';
  /* Close only when clicking the backdrop, not the image or actions */
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeLightbox();
  });

  /* Prevent download button click from closing lightbox */
  actions.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  /* Escape key closes */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.style.display !== 'none') closeLightbox();
  });

  /* Attach to each QR image */
  qrImages.forEach(function(qr) {
    qr.addEventListener('click', function() {
      openLightbox(qr.src, qr.alt);
    });
    qr.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(qr.src, qr.alt);
      }
    });
  });
})();

/* ===== Exit-Intent Email Popup ===== */
(function() {
  var popup = document.getElementById('email-popup');
  if (!popup) return;

  var STORAGE_KEY = 'czy-popup-dismissed';
  var SESSION_KEY = 'czy-popup-shown';

  /* Don't show if dismissed in last 7 days or already shown this session */
  var dismissed = localStorage.getItem(STORAGE_KEY);
  if (dismissed && (Date.now() - parseInt(dismissed, 10)) < 7 * 24 * 60 * 60 * 1000) return;
  if (sessionStorage.getItem(SESSION_KEY)) return;

  var closeBtn = document.getElementById('email-popup-close');
  var dismissBtn = document.getElementById('email-popup-dismiss');
  var shown = false;

  function showPopup() {
    if (shown) return;
    shown = true;
    sessionStorage.setItem(SESSION_KEY, '1');
    popup.classList.add('is-visible');
    popup.setAttribute('aria-hidden', 'false');
    var firstInput = popup.querySelector('input[type="email"]');
    if (firstInput) setTimeout(function() { firstInput.focus(); }, 350);
  }

  function hidePopup(remember) {
    popup.classList.remove('is-visible');
    popup.setAttribute('aria-hidden', 'true');
    if (remember) {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', function() { hidePopup(true); });
  if (dismissBtn) dismissBtn.addEventListener('click', function() { hidePopup(true); });

  /* Close on overlay click */
  popup.addEventListener('click', function(e) {
    if (e.target === popup) hidePopup(true);
  });

  /* Close on Escape */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popup.classList.contains('is-visible')) hidePopup(true);
  });

  /* Desktop: exit-intent (cursor leaves viewport top) */
  var exitTriggered = false;
  document.addEventListener('mouseout', function(e) {
    if (exitTriggered) return;
    if (e.clientY <= 0 && e.relatedTarget === null) {
      exitTriggered = true;
      /* Wait until user has been on page 15s minimum */
      if (performance.now() < 15000) {
        setTimeout(showPopup, 15000 - performance.now());
      } else {
        showPopup();
      }
    }
  });

  /* Mobile: show after 45s of inactivity or 60s total on page */
  var isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  if (isMobile) {
    var idleTimer;
    var resetIdle = function() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(showPopup, 45000);
    };
    document.addEventListener('touchstart', resetIdle, { passive: true });
    document.addEventListener('scroll', resetIdle, { passive: true });
    resetIdle();
    /* Fallback: show after 60s regardless */
    setTimeout(function() { if (!shown) showPopup(); }, 60000);
  }
})();

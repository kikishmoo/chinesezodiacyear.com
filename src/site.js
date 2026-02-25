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
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', mainNav.classList.contains('open'));
    });
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove('open');
      }
    });
  }

  /* --- Nav Dropdown Toggle --- */
  document.querySelectorAll('.nav-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = btn.parentElement;
      const wasOpen = dropdown.classList.contains('open');
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
      if (!wasOpen) dropdown.classList.add('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
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

      calcResult.innerHTML = `
        <div class="calc-result-animal">${zodiac.emoji}</div>
        <h3>${zodiac.animal} <span class="chinese-char">${zodiac.cn}</span></h3>
        <p class="calc-result-element ${elementClass}">${element} ${zodiac.animal}</p>
        <p class="mt-md" style="color:var(--graphite);font-size:0.95rem;margin:1rem auto 0;max-width:400px;">
          <strong>Heavenly Stem:</strong> ${stem}<br>
          <strong>Traits:</strong> ${zodiac.traits}
        </p>
        ${lichunNote}
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
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* --- Directory Filter --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const listingCards = document.querySelectorAll('.listing-card[data-category]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      listingCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
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

  /* --- Load More Button --- */
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      const hidden = document.querySelectorAll('.article-card[data-hidden="true"]');
      hidden.forEach((card, i) => {
        if (i < 3) {
          card.style.display = '';
          card.removeAttribute('data-hidden');
          card.classList.add('animate-on-scroll', 'visible');
        }
      });
      if (document.querySelectorAll('.article-card[data-hidden="true"]').length === 0) {
        loadMoreBtn.style.display = 'none';
      }
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

  /* --- Newsletter Form (Beehiiv Integration) --- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      if (!emailInput || !emailInput.value) return;

      const email = emailInput.value;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing\u2026';

      // Beehiiv subscribe via hidden iframe (avoids CORS on static hosting)
      const pubId = '9e7042b6-5250-429a-8f20-97b63322cd64';
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'beehiiv-frame-' + Date.now();
      document.body.appendChild(iframe);

      // Create a temporary form targeting the iframe
      const proxyForm = document.createElement('form');
      proxyForm.method = 'POST';
      proxyForm.action = 'https://embeds.beehiiv.com/forms/' + pubId;
      proxyForm.target = iframe.name;
      proxyForm.style.display = 'none';
      const input = document.createElement('input');
      input.name = 'email';
      input.value = email;
      proxyForm.appendChild(input);
      document.body.appendChild(proxyForm);
      proxyForm.submit();

      setTimeout(() => {
        form.innerHTML = '<p style="color:var(--bright-gold);font-size:1.1rem;">Thank you for subscribing! Check your inbox.</p>';
        try { document.body.removeChild(iframe); document.body.removeChild(proxyForm); } catch(ex) {}
      }, 1500);
    });
  });

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
          citySuggestions.innerHTML = matches.map((c, i) =>
            '<div class="city-option" data-idx="' + i + '">' + c.c + ', ' + c.co + '</div>'
          ).join('');
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
        // TODO: Update this URL once the Cloudflare Worker is deployed
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
        baziResult.innerHTML = '<div class="bazi-error"><strong>Error:</strong> ' + err.message +
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
      html += '<span style="font-family:var(--font-chinese);font-size:2.4rem;color:var(--deep-red);">' + dm.stem + '</span>';
      html += '<p style="margin:0.5rem 0 0;">' + dm.pinyin + ' — ' + dm.yinYang + ' ' + dm.element + '</p>';
      html += '</div>';
    }

    // Four Pillars grid
    html += '<div class="bazi-pillars">';
    names.forEach((name, i) => {
      const p = pillars[name] || {};
      html += '<div class="bazi-pillar">';
      html += '<div class="pillar-label">' + labels[i] + '<br><span style="font-family:var(--font-chinese);">' + cnLabels[i] + '</span></div>';
      if (p.stem) {
        const elClass = p.stemElement ? 'element-' + p.stemElement.toLowerCase() : '';
        html += '<div class="pillar-stem">' + p.stem + '</div>';
        html += '<div class="pillar-branch">' + p.branch + '</div>';
        html += '<div class="pillar-pinyin">' + (p.stemPinyin || '') + ' ' + (p.branchPinyin || '') + '</div>';
        if (p.stemElement) html += '<span class="pillar-element ' + elClass + '">' + p.stemElement + '</span>';
        if (p.branchAnimal) html += '<div class="pillar-animal">' + p.branchAnimal + '</div>';
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
      html += '<div class="bazi-reading-text">' + data.rawExcerpt.substring(0, 2000) + '</div>';
      html += '</div>';
    }

    html += '<p style="margin-top:var(--sp-xl);font-size:0.85rem;color:var(--stone);text-align:center;">For a comprehensive reading, consult a qualified BaZi practitioner. <a href="' + basePath + '/directory/">Find one in our directory.</a></p>';

    baziResult.innerHTML = html;
  }
});

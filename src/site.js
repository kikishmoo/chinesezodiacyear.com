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
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* --- Directory Filter --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const listingCards = document.querySelectorAll('.directory-card[data-category]');
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

/* ============================================
   TRIVIA GAME
   ============================================ */
(function() {
  const triviaGame = document.getElementById('trivia-game');
  if (!triviaGame) return;

  const QUESTIONS = [
    // ===== ZODIAC (20) =====
    { q: "How many animals are in the Chinese zodiac cycle?", o: ["12", "10", "8", "14"], a: 0, e: "The Chinese zodiac consists of 12 animals in a repeating cycle. The system originated during the Qin Dynasty from animal worship traditions." },
    { q: "Which animal is first in the Chinese zodiac cycle?", o: ["Rat", "Dragon", "Ox", "Tiger"], a: 0, e: "The Rat is first. According to the Jade Emperor legend, the clever Rat rode on the Ox's back and jumped ahead at the finish line." },
    { q: "Which zodiac animal is associated with the Earthly Branch '子' (Zǐ)?", o: ["Rat", "Ox", "Tiger", "Rabbit"], a: 0, e: "子 (Zǐ) corresponds to the Rat, the first of the twelve Earthly Branches paired with zodiac animals." },
    { q: "How many years does it take for the full sexagenary (Stem-Branch) cycle to complete?", o: ["60 years", "12 years", "10 years", "100 years"], a: 0, e: "The sexagenary cycle combines 10 Heavenly Stems and 12 Earthly Branches, producing 60 unique combinations before repeating." },
    { q: "In the zodiac race legend, which animal carried the Rat across the river?", o: ["Ox", "Horse", "Dragon", "Tiger"], a: 0, e: "The Ox generously carried the Rat across the river, but the Rat leapt off at the last moment to claim first place." },
    { q: "Which zodiac animal is the only mythical creature in the cycle?", o: ["Dragon", "Phoenix", "Qilin", "Pixiu"], a: 0, e: "The Dragon (龍) is the only mythical animal among the twelve. All others — Rat, Ox, Tiger, Rabbit, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig — are real animals." },
    { q: "What is the Chinese term for one's zodiac birth year recurring (every 12 years)?", o: ["本命年 (Běnmìngnián)", "吉年 (Jínián)", "運年 (Yùnnián)", "生年 (Shēngnián)"], a: 0, e: "本命年 (Běnmìngnián) is when your zodiac animal year returns. It is traditionally considered an unlucky year, and people wear red underwear for protection." },
    { q: "The Earthly Branch '午' (Wǔ) corresponds to which animal?", o: ["Horse", "Goat", "Snake", "Monkey"], a: 0, e: "午 (Wǔ) corresponds to the Horse. The character is associated with midday (noon) and the south direction." },
    { q: "Which two zodiac animals are considered most compatible in traditional matchmaking?", o: ["Dragon and Phoenix (Rooster)", "Rat and Dog", "Tiger and Snake", "Ox and Horse"], a: 0, e: "Dragon and Phoenix (represented by the Rooster) is the classic auspicious pairing (龍鳳呈祥), symbolising perfect harmony in marriage." },
    { q: "The zodiac animal for 2024 is the:", o: ["Dragon", "Rabbit", "Snake", "Tiger"], a: 0, e: "2024 is the Year of the Wood Dragon (甲辰年). The Dragon is the most auspicious zodiac animal, and Dragon years often see higher birth rates." },
    { q: "What animal does the Earthly Branch '卯' (Mǎo) represent?", o: ["Rabbit", "Tiger", "Dragon", "Rat"], a: 0, e: "卯 (Mǎo) represents the Rabbit and is associated with the early morning hours (5-7 AM) and the east direction." },
    { q: "In Chinese zodiac compatibility, which group of three animals is called a 'Harmony Triangle' (三合)?", o: ["Rat, Dragon, Monkey", "Ox, Snake, Pig", "Tiger, Horse, Rooster", "Rabbit, Goat, Rat"], a: 0, e: "Rat-Dragon-Monkey form a Water harmony triangle (三合). The four triangles are: Water (Rat-Dragon-Monkey), Metal (Ox-Snake-Rooster), Wood (Tiger-Horse-Dog), Fire (Rabbit-Goat-Pig)." },
    { q: "Which zodiac animal governs the 'double hour' of 11 PM to 1 AM?", o: ["Rat", "Pig", "Ox", "Tiger"], a: 0, e: "The Rat governs the 子時 (Zǐ shí), 11 PM to 1 AM — the hour that straddles two days, reflecting the Rat's position between old and new cycles." },
    { q: "What colour should people wear during their 本命年 (zodiac birth year) for protection?", o: ["Red", "Gold", "Black", "White"], a: 0, e: "Red is worn during one's 本命年 — especially red underwear or a red waist cord — to ward off the bad luck associated with offending the Tai Sui (太歲)." },
    { q: "The Fire Horse year (丙午年) is considered especially inauspicious for:", o: ["Girls born that year", "Business ventures", "Building houses", "Weddings"], a: 0, e: "In Japanese and Chinese folk belief, girls born in a Fire Horse year (e.g. 1966) are considered willful and bad luck for husbands. Japan's birth rate dropped significantly in 1966." },
    { q: "Which animal is associated with the Earthly Branch '丑' (Chǒu)?", o: ["Ox", "Rat", "Tiger", "Pig"], a: 0, e: "丑 (Chǒu) corresponds to the Ox, associated with the hours of 1-3 AM and the north-northeast direction." },
    { q: "The Cat is NOT in the Chinese zodiac because, according to legend:", o: ["The Rat tricked it and it missed the race", "Cats did not exist in ancient China", "The Jade Emperor disliked cats", "Cats refused to participate"], a: 0, e: "In the most popular version, the Rat promised to wake the Cat for the race but deliberately let it oversleep. This is why cats chase rats to this day." },
    { q: "2026 is the Year of the:", o: ["Horse", "Snake", "Goat", "Dragon"], a: 0, e: "2026 is the Year of the Fire Horse (丙午年). The Fire Horse returns for the first time since 1966." },
    { q: "Which zodiac animal is associated with longevity and wisdom?", o: ["Snake", "Monkey", "Ox", "Rooster"], a: 0, e: "The Snake (蛇) is associated with wisdom and longevity in Chinese culture. It is linked to the Earthly Branch 巳 (Sì) and the element of Fire." },
    { q: "The 'Six Clashes' (六沖) in zodiac compatibility pair opposing animals. Which clashes with the Rat?", o: ["Horse", "Ox", "Tiger", "Rooster"], a: 0, e: "Rat (子) and Horse (午) are directly opposite in the zodiac wheel and form a clash (沖). Other clashes: Ox-Goat, Tiger-Monkey, Rabbit-Rooster, Dragon-Dog, Snake-Pig." },

    // ===== WU XING / FIVE ELEMENTS (15) =====
    { q: "In the Wu Xing generating cycle, which element does Wood produce?", o: ["Fire", "Water", "Metal", "Earth"], a: 0, e: "In the generating (相生) cycle: Wood feeds Fire, Fire creates Earth (ash), Earth bears Metal, Metal collects Water, Water nourishes Wood." },
    { q: "Which element overcomes Water in Wu Xing theory?", o: ["Earth", "Fire", "Metal", "Wood"], a: 0, e: "Earth overcomes Water (土克水) — think of an earthen dam containing a river. This is from the overcoming (相克) cycle." },
    { q: "The five elements theory was systematised during which period?", o: ["Warring States", "Han Dynasty", "Shang Dynasty", "Tang Dynasty"], a: 0, e: "Wu Xing theory was systematised during the Warring States period (475-221 BCE), notably by Zou Yan (鄒衍), though its roots extend earlier." },
    { q: "In Wu Xing, which element is associated with the colour black?", o: ["Water", "Metal", "Wood", "Earth"], a: 0, e: "Water (水) is associated with black (or dark blue), the north direction, winter, and the kidneys in traditional Chinese medicine." },
    { q: "Which element is associated with the season of autumn?", o: ["Metal", "Water", "Earth", "Fire"], a: 0, e: "Metal (金) corresponds to autumn, the west direction, the colour white, and the lungs. It represents contraction and harvest." },
    { q: "The 'generating' cycle in Wu Xing is called:", o: ["相生 (Xiāngshēng)", "相克 (Xiāngkè)", "相合 (Xiānghé)", "相沖 (Xiāngchōng)"], a: 0, e: "相生 (Xiāngshēng) is the generating/nurturing cycle. 相克 (Xiāngkè) is the overcoming/controlling cycle. Together they maintain cosmic balance." },
    { q: "Which organ is associated with the Wood element in TCM?", o: ["Liver", "Heart", "Lungs", "Kidneys"], a: 0, e: "Wood corresponds to the Liver (肝) and Gallbladder. Wood energy governs growth, planning, and the smooth flow of Qi through the body." },
    { q: "Earth (土) is associated with which direction?", o: ["Centre", "North", "East", "West"], a: 0, e: "Earth occupies the centre in Wu Xing cosmology. The other four elements correspond to cardinal directions: Wood-East, Fire-South, Metal-West, Water-North." },
    { q: "Which element does Fire overcome?", o: ["Metal", "Wood", "Earth", "Water"], a: 0, e: "Fire overcomes Metal (火克金) — fire melts metal. In the overcoming cycle: Wood overcomes Earth, Earth overcomes Water, Water overcomes Fire, Fire overcomes Metal, Metal overcomes Wood." },
    { q: "The philosopher who systematised the Five Elements theory was:", o: ["Zou Yan (鄒衍)", "Confucius (孔子)", "Laozi (老子)", "Mozi (墨子)"], a: 0, e: "Zou Yan (鄒衍, c. 305-240 BCE) of the Warring States period is credited with formalising Wu Xing into a comprehensive philosophical system." },
    { q: "In Wu Xing, which element nourishes Earth?", o: ["Fire", "Metal", "Wood", "Water"], a: 0, e: "Fire generates Earth (火生土) — fire creates ash which becomes earth. This is part of the generating (相生) cycle." },
    { q: "Which taste is associated with the Water element?", o: ["Salty", "Sour", "Bitter", "Sweet"], a: 0, e: "Water corresponds to the salty taste. The five tastes: Wood-sour, Fire-bitter, Earth-sweet, Metal-pungent/spicy, Water-salty." },
    { q: "The Heavenly Stem '甲' (Jiǎ) belongs to which element?", o: ["Wood (Yang)", "Fire (Yang)", "Metal (Yang)", "Earth (Yang)"], a: 0, e: "甲 (Jiǎ) is Yang Wood, the first of the ten Heavenly Stems. The stems alternate Yin-Yang through the five elements: 甲乙=Wood, 丙丁=Fire, 戊己=Earth, 庚辛=Metal, 壬癸=Water." },
    { q: "Which planet corresponds to the Metal element?", o: ["Venus (金星)", "Mars (火星)", "Jupiter (木星)", "Mercury (水星)"], a: 0, e: "Venus is 金星 (Jīnxīng, 'Metal Star'). The five visible planets each correspond to an element: Jupiter-Wood, Mars-Fire, Saturn-Earth, Venus-Metal, Mercury-Water." },
    { q: "Earth's associated emotion in Wu Xing is:", o: ["Worry/Pensiveness", "Anger", "Joy", "Grief"], a: 0, e: "Earth corresponds to worry/pensiveness (思). The five emotions: Wood-anger (怒), Fire-joy (喜), Earth-worry (思), Metal-grief (悲), Water-fear (恐)." },

    // ===== DYNASTIES (25) =====
    { q: "Which dynasty is credited with unifying China's writing system, weights, and measures?", o: ["Qin Dynasty", "Han Dynasty", "Zhou Dynasty", "Shang Dynasty"], a: 0, e: "The Qin Dynasty (221-206 BCE) under Qin Shi Huang standardised Chinese script, measurements, currency, and road widths across the newly unified empire." },
    { q: "During which dynasty did the Silk Road trade routes first flourish?", o: ["Han Dynasty", "Tang Dynasty", "Song Dynasty", "Qin Dynasty"], a: 0, e: "The Han Dynasty (206 BCE-220 CE) established the Silk Road after Zhang Qian's diplomatic missions to Central Asia opened trade routes westward." },
    { q: "The Tang Dynasty capital Chang'an was the world's largest city. Which modern city occupies its site?", o: ["Xi'an", "Beijing", "Luoyang", "Nanjing"], a: 0, e: "Chang'an, capital of the Tang Dynasty, corresponds to modern Xi'an in Shaanxi province. At its peak it had over one million residents." },
    { q: "Which dynasty invented movable-type printing?", o: ["Song Dynasty", "Tang Dynasty", "Han Dynasty", "Ming Dynasty"], a: 0, e: "Bi Sheng (畢昇) invented movable ceramic type during the Northern Song Dynasty (around 1040 CE), centuries before Gutenberg." },
    { q: "Oracle bone script, the earliest known Chinese writing, dates from which dynasty?", o: ["Shang Dynasty", "Xia Dynasty", "Zhou Dynasty", "Qin Dynasty"], a: 0, e: "Oracle bone inscriptions (甲骨文) from the Shang Dynasty (c. 1600-1046 BCE) are the earliest verified Chinese writing, used for divination." },
    { q: "The Three Kingdoms period followed the collapse of which dynasty?", o: ["Han Dynasty", "Qin Dynasty", "Jin Dynasty", "Sui Dynasty"], a: 0, e: "The Three Kingdoms (220-280 CE) — Wei, Shu, and Wu — emerged from the collapse of the Eastern Han Dynasty. This era inspired the classic novel Romance of the Three Kingdoms." },
    { q: "Which dynasty built the majority of the Great Wall as it stands today?", o: ["Ming Dynasty", "Qin Dynasty", "Han Dynasty", "Song Dynasty"], a: 0, e: "While Qin Shi Huang initiated the Great Wall, the iconic stone-and-brick wall we see today was primarily built during the Ming Dynasty (1368-1644)." },
    { q: "The Sui Dynasty is best known for constructing:", o: ["The Grand Canal", "The Great Wall", "The Forbidden City", "The Terracotta Army"], a: 0, e: "The Sui Dynasty (581-618) built the Grand Canal (大運河), linking the Yellow River to the Yangtze — the world's longest artificial waterway at over 1,700 km." },
    { q: "Which dynasty saw the invention of paper?", o: ["Han Dynasty", "Shang Dynasty", "Tang Dynasty", "Song Dynasty"], a: 0, e: "Cai Lun (蔡倫) is traditionally credited with improving papermaking during the Eastern Han Dynasty (around 105 CE), though archaeological evidence suggests earlier origins." },
    { q: "The Forbidden City was built during which dynasty?", o: ["Ming Dynasty", "Qing Dynasty", "Yuan Dynasty", "Song Dynasty"], a: 0, e: "The Forbidden City (紫禁城) was built from 1406-1420 under the Yongle Emperor of the Ming Dynasty. It served as the imperial palace for 24 emperors across Ming and Qing." },
    { q: "Which dynasty established the imperial examination system (科舉)?", o: ["Sui Dynasty", "Tang Dynasty", "Han Dynasty", "Song Dynasty"], a: 0, e: "The Sui Dynasty (581-618) formally established the imperial examination (科舉) system. The Tang Dynasty expanded it, and it reached its peak under the Song." },
    { q: "The Yuan Dynasty was founded by:", o: ["Kublai Khan", "Genghis Khan", "Tamerlane", "Attila"], a: 0, e: "Kublai Khan (忽必烈), grandson of Genghis Khan, established the Yuan Dynasty (1271-1368). It was the first non-Han dynasty to rule all of China." },
    { q: "Which period is known as the 'Golden Age' of Chinese poetry?", o: ["Tang Dynasty", "Song Dynasty", "Han Dynasty", "Ming Dynasty"], a: 0, e: "The Tang Dynasty (618-907) is considered the Golden Age of Chinese poetry. It produced legendary poets like Li Bai (李白), Du Fu (杜甫), and Wang Wei (王維)." },
    { q: "The Song Dynasty is renowned for advances in:", o: ["Commerce, technology, and maritime trade", "Military conquest", "Great Wall construction", "Terracotta manufacturing"], a: 0, e: "The Song Dynasty (960-1279) saw breakthroughs in printing, gunpowder, the compass, paper money, and maritime trade. It was economically the most advanced civilisation of its time." },
    { q: "Which dynasty's fall is traditionally dated to 1046 BCE with the Battle of Muye?", o: ["Shang Dynasty", "Xia Dynasty", "Zhou Dynasty", "Qin Dynasty"], a: 0, e: "The Battle of Muye (牧野之戰) in 1046 BCE saw King Wu of Zhou defeat the last Shang king, establishing the Zhou Dynasty." },
    { q: "The 'Warring States' period (戰國) lasted approximately how long?", o: ["250 years", "100 years", "500 years", "50 years"], a: 0, e: "The Warring States period lasted from about 475-221 BCE (~254 years), ending when the Qin state conquered all rivals to unify China." },
    { q: "Which dynasty created the Terracotta Army?", o: ["Qin Dynasty", "Han Dynasty", "Shang Dynasty", "Zhou Dynasty"], a: 0, e: "The Terracotta Army was created for Qin Shi Huang (秦始皇), first emperor of the Qin Dynasty, to protect him in the afterlife. Estimated 8,000+ figures." },
    { q: "Paper money was first used as currency during which dynasty?", o: ["Song Dynasty", "Tang Dynasty", "Ming Dynasty", "Yuan Dynasty"], a: 0, e: "The Song Dynasty introduced 交子 (jiāozi), the world's first government-issued paper money, in Sichuan around 1024 CE." },
    { q: "The Mandate of Heaven (天命) concept originated in which dynasty?", o: ["Zhou Dynasty", "Shang Dynasty", "Qin Dynasty", "Han Dynasty"], a: 0, e: "The Zhou Dynasty developed the Mandate of Heaven (天命) to justify their overthrow of the Shang. It held that Heaven grants authority to virtuous rulers and revokes it from tyrants." },
    { q: "Zheng He's maritime expeditions occurred during which dynasty?", o: ["Ming Dynasty", "Song Dynasty", "Yuan Dynasty", "Tang Dynasty"], a: 0, e: "Admiral Zheng He (鄭和) led seven voyages (1405-1433) under the Ming Dynasty's Yongle Emperor, reaching Southeast Asia, India, Arabia, and East Africa." },
    { q: "The 'Spring and Autumn' period (春秋) is named after:", o: ["A historical chronicle attributed to Confucius", "The two seasons of farming", "A style of poetry", "A type of calendar"], a: 0, e: "The Spring and Autumn period (770-476 BCE) is named after the Spring and Autumn Annals (《春秋》), a chronicle of the state of Lu attributed to Confucius." },
    { q: "Which dynasty saw China's population first exceed 100 million?", o: ["Song Dynasty", "Tang Dynasty", "Ming Dynasty", "Han Dynasty"], a: 0, e: "China's population first exceeded 100 million during the Northern Song Dynasty (around 1100 CE), driven by agricultural innovations like improved rice strains." },
    { q: "The 'Four Great Inventions' of ancient China are paper, printing, gunpowder, and:", o: ["The compass", "Silk", "Porcelain", "The abacus"], a: 0, e: "The Four Great Inventions (四大發明) are papermaking, printing, gunpowder, and the compass. This concept was popularised by Joseph Needham in his study of Chinese science." },
    { q: "Which period saw Confucius, Laozi, Mozi, and other great thinkers flourish simultaneously?", o: ["Spring and Autumn / Warring States", "Han Dynasty", "Tang Dynasty", "Song Dynasty"], a: 0, e: "The 'Hundred Schools of Thought' (百家爭鳴) flourished during the Spring and Autumn and Warring States periods (770-221 BCE), producing Confucianism, Daoism, Legalism, Mohism, and more." },
    { q: "Which dynasty first used bronze vessels extensively for rituals?", o: ["Shang Dynasty", "Zhou Dynasty", "Xia Dynasty", "Qin Dynasty"], a: 0, e: "The Shang Dynasty (c. 1600-1046 BCE) produced elaborate bronze ritual vessels (青銅器) for ancestor worship. Shang bronzes are among the finest ever made." },

    // ===== CALENDAR & ASTRONOMY (18) =====
    { q: "How many Heavenly Stems (天干) are there?", o: ["10", "12", "8", "5"], a: 0, e: "There are 10 Heavenly Stems (甲乙丙丁戊己庚辛壬癸), each associated with a Yin or Yang aspect of the five elements." },
    { q: "How many solar terms (節氣) divide the Chinese agricultural year?", o: ["24", "12", "36", "48"], a: 0, e: "The 24 solar terms (二十四節氣) divide the year based on the sun's position along the ecliptic. They were formalised during the Han Dynasty." },
    { q: "The Taosi archaeological site in Shanxi contained what world-first astronomical feature?", o: ["Large-scale observatory with gnomon", "Star chart carved in jade", "Bronze armillary sphere", "Solar eclipse record"], a: 0, e: "Taosi (陶寺, c. 2300-1900 BCE) contained a gnomon (圭表) observatory — one of the world's earliest large-scale facilities for measuring solar positions." },
    { q: "What solar term marks the beginning of spring in the Chinese calendar?", o: ["立春 (Lìchūn)", "春分 (Chūnfēn)", "雨水 (Yǔshuǐ)", "驚蟄 (Jīngzhé)"], a: 0, e: "立春 (Lìchūn, 'Start of Spring') usually falls around February 3-5. It marks the beginning of the solar year and the first of 24 solar terms." },
    { q: "The Chinese calendar is best described as:", o: ["Lunisolar", "Purely lunar", "Purely solar", "Sidereal"], a: 0, e: "The Chinese calendar is lunisolar (陰陽曆) — months follow the moon's phases while the year aligns with the solar cycle through intercalary months." },
    { q: "An intercalary month (閏月) is added to the Chinese calendar roughly every:", o: ["3 years", "2 years", "5 years", "4 years"], a: 0, e: "An intercalary (leap) month is added approximately every 2-3 years (7 times in 19 years, following the Metonic cycle) to keep the lunisolar calendar aligned with the seasons." },
    { q: "Which Heavenly Stem is '丙' (Bǐng)?", o: ["Yang Fire", "Yang Wood", "Yang Metal", "Yang Water"], a: 0, e: "丙 (Bǐng) is Yang Fire, the third Heavenly Stem. In 2026, the stem is 丙 and the branch is 午 (Horse), making it a Fire Horse year (丙午)." },
    { q: "The Dunhuang star chart, one of the world's oldest complete star maps, dates from the:", o: ["Tang Dynasty", "Han Dynasty", "Song Dynasty", "Ming Dynasty"], a: 0, e: "The Dunhuang star chart (敦煌星圖) dates from the Tang Dynasty (c. 700 CE). It maps over 1,300 stars in 257 asterisms." },
    { q: "What is the first Earthly Branch?", o: ["子 (Zǐ)", "丑 (Chǒu)", "寅 (Yín)", "甲 (Jiǎ)"], a: 0, e: "子 (Zǐ) is the first Earthly Branch, associated with the Rat, midnight, and the north direction. Note: 甲 (Jiǎ) is a Heavenly Stem, not a Branch." },
    { q: "The winter solstice solar term is called:", o: ["冬至 (Dōngzhì)", "大寒 (Dàhán)", "小雪 (Xiǎoxuě)", "立冬 (Lìdōng)"], a: 0, e: "冬至 (Dōngzhì, 'Winter Extreme') marks the shortest day. It was historically as important as New Year, with family gatherings and eating tangyuan (湯圓)." },
    { q: "The Shoushi Calendar (授時曆), remarkably accurate for its era, was created during:", o: ["Yuan Dynasty", "Song Dynasty", "Ming Dynasty", "Tang Dynasty"], a: 0, e: "The Shoushi Calendar was created by Guo Shoujing (郭守敬) in 1281 during the Yuan Dynasty. It calculated the tropical year to 365.2425 days — the same as the Gregorian calendar, 300 years earlier." },
    { q: "How many Earthly Branches (地支) exist?", o: ["12", "10", "8", "24"], a: 0, e: "There are 12 Earthly Branches (子丑寅卯辰巳午未申酉戌亥), each paired with a zodiac animal, a compass direction, and a two-hour period." },
    { q: "The solar term '清明' (Qīngmíng) is associated with:", o: ["Tomb-sweeping and ancestor veneration", "The autumn harvest", "Planting rice", "Dragon boat races"], a: 0, e: "清明 (Qīngmíng, 'Pure Brightness') falls around April 4-5. It is the day for sweeping ancestral tombs and has been observed since the Zhou Dynasty." },
    { q: "Chinese months traditionally begin on:", o: ["The new moon (朔)", "The full moon (望)", "The first quarter moon", "The spring equinox"], a: 0, e: "Each Chinese month starts on the day of the new moon (朔 shuò). The full moon (望 wàng) typically falls on the 15th. This is why the Mid-Autumn Festival is on the 15th day of the 8th month." },
    { q: "The ancient Chinese divided the sky into how many 'lunar mansions' (宿)?", o: ["28", "24", "12", "36"], a: 0, e: "The 28 lunar mansions (二十八宿) are sections of the sky through which the moon passes. They were grouped into four directional quadrants represented by four mythical beasts." },
    { q: "The Four Symbols (四象) that guard the cardinal directions are:", o: ["Azure Dragon, White Tiger, Vermillion Bird, Black Tortoise", "Dragon, Phoenix, Tiger, Turtle", "Rat, Horse, Rabbit, Rooster", "Qilin, Dragon, Phoenix, Pixiu"], a: 0, e: "The Four Symbols are: Azure Dragon (青龍, East), White Tiger (白虎, West), Vermillion Bird (朱雀, South), and Black Tortoise (玄武, North)." },
    { q: "Which solar term means 'Awakening of Insects'?", o: ["驚蟄 (Jīngzhé)", "小滿 (Xiǎomǎn)", "芒種 (Mángzhòng)", "穀雨 (Gǔyǔ)"], a: 0, e: "驚蟄 (Jīngzhé, 'Awakening of Insects') falls around March 5-6. Spring thunder 'startles' hibernating creatures awake, marking the revival of nature." },
    { q: "The gnomon (圭表) measures time by tracking:", o: ["The length of a shadow cast by a vertical pole", "The position of stars at night", "Water flow through a vessel", "Sand through an hourglass"], a: 0, e: "A gnomon (圭表) uses a vertical pole (表 biǎo) and a horizontal scale (圭 guī) to measure the sun's shadow length, determining solstices, equinoxes, and the length of the year." },

    // ===== FENG SHUI (15) =====
    { q: "What does 'feng shui' (風水) literally translate to?", o: ["Wind-water", "Mountain-river", "Heaven-earth", "Yin-yang"], a: 0, e: "Feng shui (風水) literally means 'wind-water.' The practice is over 3,500 years old and was used in ancient city planning for capitals like Chang'an and Luoyang." },
    { q: "The luopan (羅盤) is the primary tool of which practice?", o: ["Feng shui", "BaZi", "Qi Men Dun Jia", "Acupuncture"], a: 0, e: "The luopan is the feng shui compass, containing concentric rings encoding cosmological data used by Compass School practitioners." },
    { q: "The two main classical schools of feng shui are:", o: ["Form School and Compass School", "Yin School and Yang School", "Heaven School and Earth School", "Mountain School and Water School"], a: 0, e: "Form School (形勢派) studies landscape shapes and water courses. Compass School (理氣派) uses the luopan to analyse directional energy. Both pre-date the Qing Dynasty." },
    { q: "In feng shui, the ideal site has mountains behind and water in front. This is called:", o: ["藏風聚氣 (storing wind, gathering qi)", "龍虎相爭 (dragon-tiger contest)", "天圓地方 (round heaven, square earth)", "陰陽平衡 (yin-yang balance)"], a: 0, e: "藏風聚氣 means the mountains behind block harsh winds while water in front collects beneficial qi. This principle was articulated in Guo Pu's 《葬書》(Book of Burial)." },
    { q: "The 'Bright Hall' (明堂) in feng shui refers to:", o: ["The open space in front of a site", "The main entrance of a building", "A ceremonial room", "The roof design"], a: 0, e: "明堂 (Míng Táng) is the open area in front of a site where qi gathers. A spacious, gentle bright hall is considered auspicious for wealth accumulation." },
    { q: "Which ancient text is considered the foundation of feng shui theory?", o: ["《葬書》(Book of Burial) by Guo Pu", "《易經》(I Ching)", "《道德經》(Dao De Jing)", "《論語》(Analerta)"], a: 0, e: "Guo Pu's 《葬書》(Zàng Shū, Book of Burial, c. 4th century CE) is the foundational text of feng shui, establishing the relationship between landscape, qi, and fortune." },
    { q: "The 'Dragon Veins' (龍脈) in feng shui refer to:", o: ["Mountain ranges carrying earth qi", "Underground water channels", "Ley lines between temples", "Lines on a luopan"], a: 0, e: "Dragon Veins (龍脈) are mountain ridges and ranges through which earth qi flows, like blood through veins. Tracing the dragon vein is essential to Form School feng shui." },
    { q: "What are the 'Four Celestial Animals' of a feng shui site?", o: ["Black Tortoise, Azure Dragon, White Tiger, Red Phoenix", "Dragon, Tiger, Phoenix, Turtle", "Rat, Ox, Tiger, Rabbit", "Qilin, Dragon, Pixiu, Phoenix"], a: 0, e: "A classical feng shui site is guarded by: Black Tortoise (mountain behind), Azure Dragon (hills to left), White Tiger (hills to right), Red Phoenix (open space ahead)." },
    { q: "In feng shui, 'sha qi' (煞氣) refers to:", o: ["Harmful or attacking energy", "Beneficial energy", "Stagnant energy", "Neutral energy"], a: 0, e: "煞氣 (Shā Qì) is harmful energy created by sharp angles, straight roads pointing at a building, or other aggressive landscape features. Feng shui seeks to avoid or redirect it." },
    { q: "The compass direction system used in feng shui divides space into how many sectors?", o: ["8 (or 24 mountains)", "4", "12", "16"], a: 0, e: "Basic feng shui uses 8 directions (the Ba Gua sectors). Advanced practice uses the '24 Mountains' (二十四山), subdividing each of the 8 directions into 3 sub-sectors." },
    { q: "Which direction does the 'sitting' (坐) of a building face in feng shui terminology?", o: ["The back of the building", "The front entrance", "The left side", "The roof peak"], a: 0, e: "In feng shui, 坐 (zuò, sitting) refers to the back of the building, while 向 (xiàng, facing) is the front. The sitting-facing axis is fundamental to Compass School analysis." },
    { q: "Flying Star feng shui (玄空飛星) tracks energy changes over:", o: ["Time periods of 20 years", "12-year zodiac cycles", "60-year sexagenary cycles", "Annual seasons only"], a: 0, e: "Flying Star (玄空飛星) feng shui divides time into 20-year periods (運). The current Period 9 began in 2024, bringing Fire energy prominence." },
    { q: "What is 'qi' (氣) in the context of feng shui?", o: ["Vital life force or energy flowing through the landscape", "A type of compass reading", "A building material", "A mathematical formula"], a: 0, e: "氣 (Qì) is the vital life energy that permeates all things. Feng shui seeks to harness beneficial qi flow and avoid areas where qi stagnates or scatters." },
    { q: "The ideal feng shui water flow in front of a property should be:", o: ["Slow, curved, and embracing the site", "Fast and straight", "Underground only", "Flowing away from the site"], a: 0, e: "Auspicious water should curve gently and appear to embrace the site (有情水). Fast, straight water carries qi away too quickly (無情水)." },
    { q: "Which ancient city was designed according to feng shui principles, with its back to a mountain and facing a river?", o: ["Chang'an (長安)", "Babylon", "Athens", "Rome"], a: 0, e: "Chang'an (modern Xi'an) was sited with the Qinling Mountains behind (Black Tortoise) and the Wei River ahead, following classical feng shui landform principles." },

    // ===== BAZI (12) =====
    { q: "BaZi (八字) literally means 'eight characters.' What are these eight characters?", o: ["Four Heavenly Stems + four Earthly Branches", "Eight trigrams", "Eight celestial animals", "Eight compass directions"], a: 0, e: "BaZi consists of four pillars (year, month, day, hour), each containing one Heavenly Stem and one Earthly Branch — totalling eight characters." },
    { q: "Which pillar in BaZi represents the 'Day Master' (日主)?", o: ["Day Pillar", "Year Pillar", "Month Pillar", "Hour Pillar"], a: 0, e: "The Day Pillar's Heavenly Stem is the Day Master (日主/日元), representing the self. It is the reference point for interpreting the entire chart." },
    { q: "BaZi destiny analysis was significantly developed by which Tang Dynasty figure?", o: ["Li Xuzhong (李虛中)", "Li Bai (李白)", "Han Yu (韓愈)", "Wu Zetian (武則天)"], a: 0, e: "Li Xuzhong (李虛中) of the Tang Dynasty is credited with developing the three-pillar (year, month, day) method of destiny analysis, the precursor to modern BaZi." },
    { q: "The 'Ten Gods' (十神) system in BaZi analyses relationships between:", o: ["The Day Master and other stems", "Ten planets", "Ten zodiac animals", "Ten compass directions"], a: 0, e: "The Ten Gods (十神) describe the relationship between the Day Master and each of the other Heavenly Stems: e.g., 正官 (Direct Officer), 偏財 (Indirect Wealth), etc." },
    { q: "Who refined the BaZi system by adding the Hour Pillar, creating the four-pillar method?", o: ["Xu Ziping (徐子平)", "Li Xuzhong (李虛中)", "Shao Yong (邵雍)", "Guo Pu (郭璞)"], a: 0, e: "Xu Ziping (徐子平) of the Song Dynasty added the Hour Pillar and shifted the Day Master to the centre of analysis. Modern BaZi is sometimes called 'Ziping method' (子平法) in his honour." },
    { q: "In BaZi, the Year Pillar primarily represents:", o: ["Ancestors and early childhood", "Career", "Spouse", "Children"], a: 0, e: "The Year Pillar represents ancestors, grandparents, and ages 1-16. Month = parents/ages 17-32, Day = self and spouse, Hour = children and old age." },
    { q: "A 'strong' Day Master in BaZi means:", o: ["The Day Master element is well-supported by other chart elements", "The person is physically strong", "The birth date is auspicious", "The year pillar is dominant"], a: 0, e: "A strong Day Master has ample support from the same element or its generating element in the chart. Strong Day Masters generally benefit from elements that control or drain them." },
    { q: "How many possible combinations exist in BaZi's sexagenary pillar system?", o: ["60 per pillar", "12 per pillar", "10 per pillar", "120 per pillar"], a: 0, e: "Each pillar has 60 possible Stem-Branch combinations. With four pillars, the total theoretical combinations exceed 12 million unique charts." },
    { q: "The 'Luck Pillars' (大運) in BaZi change every:", o: ["10 years", "12 years", "5 years", "1 year"], a: 0, e: "Luck Pillars (大運 Dà Yùn) change every 10 years and represent the broader energetic climate of each life decade. They are derived from the Month Pillar." },
    { q: "What does 'Eating God' (食神) represent in BaZi's Ten Gods?", o: ["Creative output and enjoyment", "A food deity", "Physical appetite", "Career authority"], a: 0, e: "食神 (Shí Shén, Eating God) represents creativity, artistic talent, and enjoyment of life. It is the element that the Day Master generates on the same polarity (Yin-Yin or Yang-Yang)." },
    { q: "In BaZi, which of the Four Pillars is considered most influential for determining one's zodiac animal?", o: ["Year Pillar", "Day Pillar", "Month Pillar", "Hour Pillar"], a: 0, e: "The Year Pillar's Earthly Branch determines one's zodiac animal. However, advanced BaZi practitioners consider the Day Pillar (Day Master) as the true 'self'." },
    { q: "The concept '用神' (Yòng Shén) in BaZi refers to:", o: ["The most needed element to balance the chart", "A patron deity", "The strongest element in the chart", "The zodiac animal spirit"], a: 0, e: "用神 (Yòng Shén, 'Useful God') is the element the chart most needs for balance. Identifying the Yòng Shén is the most critical step in BaZi interpretation." },

    // ===== SPRING FESTIVAL (15) =====
    { q: "The character 年 (nián) originally meant what in classical Chinese?", o: ["Grain ripening / harvest", "A fearsome beast", "New beginning", "Winter solstice"], a: 0, e: "According to the Shuowen Jiezi (《說文解字》), 年 means 'grain ripening' (穀熟也). The Nian beast story is a modern invention (earliest source: 1933)." },
    { q: "桃符 (peachwood charms) are the historical predecessors of which Spring Festival tradition?", o: ["Spring couplets (春聯)", "Red envelopes", "Firecrackers", "Lanterns"], a: 0, e: "桃符 were inscribed with protective deity names (神荼 and 郁壘) and hung on doors. They evolved into spring couplets (春聯) by the Ming Dynasty." },
    { q: "The tradition of 守歲 (staying up on New Year's Eve) is documented since which dynasty?", o: ["Jin Dynasty", "Han Dynasty", "Tang Dynasty", "Song Dynasty"], a: 0, e: "守歲 (shǒu suì) — staying awake through New Year's Eve — has been documented since the Jin Dynasty (266-420 CE)." },
    { q: "Burning bamboo to ward off mountain spirits was the precursor to what Spring Festival tradition?", o: ["Firecrackers (爆竹)", "Bonfire festivals", "Incense burning", "Dragon dance"], a: 0, e: "Burning bamboo (爆竹 literally means 'exploding bamboo') to drive away 山臊/山魈 mountain spirits is documented in the 6th-century《荊楚歲時記》." },
    { q: "The Spring Festival celebration traditionally lasts how many days?", o: ["15 days", "7 days", "3 days", "30 days"], a: 0, e: "The Spring Festival lasts 15 days, from New Year's Day (正月初一) to the Lantern Festival (元宵節) on the 15th of the first lunar month." },
    { q: "What food is traditionally eaten during the Lantern Festival (元宵節)?", o: ["Tangyuan (湯圓) / Yuanxiao (元宵)", "Dumplings (餃子)", "Nian Gao (年糕)", "Spring rolls"], a: 0, e: "Tangyuan (湯圓) — glutinous rice balls in sweet soup — symbolise family unity and completeness. 'Tangyuan' sounds like 團圓 (tuányuán, reunion)." },
    { q: "Red envelopes (紅包) traditionally contain:", o: ["Money", "Written blessings", "Candy", "Seeds"], a: 0, e: "紅包 (hóngbāo) contain money and are given to children and unmarried younger relatives. The amount should be even numbers (but not 4, which sounds like death)." },
    { q: "The character '福' (fú, fortune) is often hung upside-down on doors because:", o: ["倒 (dào, upside-down) sounds like 到 (dào, to arrive)", "It looks more decorative", "It confuses evil spirits", "It's an ancient printing mistake"], a: 0, e: "Hanging 福 upside-down is a visual pun: 福倒了 (fú dào le) sounds like 福到了 (fú dào le, 'fortune has arrived')." },
    { q: "Which dish is essential for the New Year's Eve reunion dinner (年夜飯) because its name sounds like 'surplus'?", o: ["Fish (魚 yú)", "Chicken (雞 jī)", "Duck (鴨 yā)", "Tofu (豆腐 dòufu)"], a: 0, e: "Fish (魚 yú) is essential because it sounds like 餘 (yú, surplus/abundance). The saying 年年有餘 means 'may there be abundance year after year.'" },
    { q: "The Kitchen God (灶神) is sent off to heaven on which date?", o: ["The 23rd or 24th of the 12th lunar month", "New Year's Eve", "The 1st of the 1st month", "The 15th of the 1st month"], a: 0, e: "On 小年 (Little New Year, 12th month 23rd/24th), families offer sweet foods to the Kitchen God so he reports only good things to the Jade Emperor." },
    { q: "年糕 (Nián Gāo, New Year cake) symbolises:", o: ["Rising higher each year (年年高升)", "Sweet family life", "A bountiful harvest", "Longevity"], a: 0, e: "年糕 is a pun: 糕 (gāo, cake) sounds like 高 (gāo, high/tall). Eating it symbolises 年年高 — rising higher in fortune, status, or achievement each year." },
    { q: "The 'God of Wealth' (財神) is welcomed on which day of the Spring Festival?", o: ["The 5th day (破五)", "New Year's Day", "The 3rd day", "The 15th day"], a: 0, e: "The 5th day (正月初五, 破五 Pò Wǔ) is when businesses traditionally reopen and welcome the God of Wealth (迎財神) with firecrackers." },
    { q: "Which Spring Festival tradition involves children wearing new clothes?", o: ["It is a universal tradition throughout the festival", "Only on the 3rd day", "Only during dragon dances", "Only at temple fairs"], a: 0, e: "Wearing new clothes — from head to toe — during Spring Festival symbolises a fresh start. Old clothes represent old-year troubles to be discarded." },
    { q: "Dumplings (餃子) are shaped like ancient Chinese:", o: ["Gold ingots (元寶)", "Coins", "Moons", "Fish"], a: 0, e: "餃子 are shaped like yuanbao (元寶), gold or silver ingots used as currency in imperial China. Eating them symbolises welcoming wealth in the new year." },
    { q: "The Spring Festival's official name in Chinese is:", o: ["春節 (Chūn Jié)", "新年 (Xīn Nián)", "過年 (Guò Nián)", "元旦 (Yuán Dàn)"], a: 0, e: "The official name is 春節 (Chūn Jié, Spring Festival). 新年 means 'New Year' generally, 過年 is colloquial for 'celebrating the New Year,' and 元旦 now refers to January 1st." },

    // ===== LITERATURE & PHILOSOPHY (20) =====
    { q: "Which text is considered the foundational classic of Daoist philosophy?", o: ["Dao De Jing (道德經)", "Zhuangzi (莊子)", "Yi Jing (易經)", "Liezi (列子)"], a: 0, e: "The Dao De Jing (道德經), attributed to Laozi, is the foundational text of Daoism. Its 81 chapters explore the Dao, De (virtue), and Wu Wei (non-action)." },
    { q: "The concept of 無為 (Wú Wéi) is best translated as:", o: ["Effortless action / non-forcing", "Complete inaction", "Meditation technique", "Moral cultivation"], a: 0, e: "無為 means 'effortless action' or 'non-forcing' — acting in harmony with the natural flow rather than through forceful effort. It does NOT mean doing nothing." },
    { q: "The Eight Immortals (八仙) are figures from which tradition?", o: ["Daoism", "Buddhism", "Confucianism", "Chinese folk religion only"], a: 0, e: "The Eight Immortals (八仙 Bāxiān) are legendary Daoist figures, each with distinct supernatural powers. They appear in literature from the Tang-Song period onward." },
    { q: "《水滸傳》(Water Margin) features how many heroic outlaws?", o: ["108", "36", "72", "64"], a: 0, e: "Water Margin by Shi Nai'an features 108 heroes of Liangshan Marsh — 36 Heavenly Spirits and 72 Earthly Fiends." },
    { q: "Sima Qian's 《史記》(Records of the Grand Historian) was written during which dynasty?", o: ["Western Han", "Eastern Han", "Qin", "Tang"], a: 0, e: "Sima Qian (司馬遷) completed the Shiji around 94 BCE during the Western Han Dynasty. It is the first comprehensive Chinese historical text." },
    { q: "The 'Four Books' (四書) of Confucianism include the Analerta, Mencius, Great Learning, and:", o: ["Doctrine of the Mean (中庸)", "Book of Changes (易經)", "Book of Songs (詩經)", "Spring and Autumn Annals (春秋)"], a: 0, e: "The Four Books (四書): 《論語》(Analerta), 《孟子》(Mencius), 《大學》(Great Learning), 《中庸》(Doctrine of the Mean). Zhu Xi compiled them in the Song Dynasty as the core Confucian curriculum." },
    { q: "Which of the 'Four Great Classical Novels' features the Monkey King?", o: ["Journey to the West (西遊記)", "Romance of the Three Kingdoms (三國演義)", "Dream of the Red Chamber (紅樓夢)", "Water Margin (水滸傳)"], a: 0, e: "Journey to the West (《西遊記》) by Wu Cheng'en features Sun Wukong (孫悟空), the Monkey King, who accompanies the monk Xuanzang on his pilgrimage to India." },
    { q: "The Yi Jing (易經) uses a system of how many hexagrams?", o: ["64", "8", "32", "128"], a: 0, e: "The Yi Jing (I Ching) contains 64 hexagrams (六十四卦), each composed of 6 lines (either broken or unbroken). The 8 trigrams (八卦) combine in pairs to form them." },
    { q: "Confucius emphasised which virtue as the foundation of social harmony?", o: ["仁 (Rén, benevolence)", "勇 (Yǒng, courage)", "智 (Zhì, wisdom)", "信 (Xìn, trust)"], a: 0, e: "仁 (Rén, benevolence/humaneness) is the supreme Confucian virtue. Confucius taught that all proper social relationships flow from cultivating Rén within oneself." },
    { q: "《三字經》(Three Character Classic) was traditionally the first text taught to:", o: ["Children beginning their education", "Imperial examination candidates", "Buddhist monks", "Military officers"], a: 0, e: "The Three Character Classic (《三字經》) was the standard primer for children's education. Its rhythmic three-character verses made memorisation easy." },
    { q: "Li Bai (李白) is most celebrated as a poet of which dynasty?", o: ["Tang Dynasty", "Song Dynasty", "Han Dynasty", "Ming Dynasty"], a: 0, e: "Li Bai (李白, 701-762) is the greatest Romantic poet of the Tang Dynasty. Known as the 'Immortal of Poetry' (詩仙), his works celebrate nature, freedom, and wine." },
    { q: "Du Fu (杜甫) is known by which honourific title?", o: ["詩聖 (Poet Sage)", "詩仙 (Poet Immortal)", "詩魔 (Poet Demon)", "詩佛 (Poet Buddha)"], a: 0, e: "Du Fu (杜甫, 712-770) is called the 'Poet Sage' (詩聖) for his deep social consciousness and mastery of regulated verse. His works document the An Lushan Rebellion's devastation." },
    { q: "The 'Five Classics' (五經) predate the Four Books and include the Book of Songs, Book of Documents, Book of Rites, Book of Changes, and:", o: ["Spring and Autumn Annals (春秋)", "Analerta (論語)", "Dao De Jing (道德經)", "Art of War (孫子兵法)"], a: 0, e: "The Five Classics (五經): 《詩經》(Songs), 《書經》(Documents), 《禮記》(Rites), 《易經》(Changes), 《春秋》(Spring and Autumn Annals). A sixth — Music — was lost." },
    { q: "Dream of the Red Chamber (紅樓夢) was written by:", o: ["Cao Xueqin (曹雪芹)", "Luo Guanzhong (羅貫中)", "Wu Cheng'en (吳承恩)", "Pu Songling (蒲松齡)"], a: 0, e: "Cao Xueqin (曹雪芹, c. 1715-1763) wrote most of 紅樓夢. It is considered the pinnacle of Chinese fiction, depicting the decline of a noble family." },
    { q: "Sun Tzu's 《孫子兵法》(Art of War) contains how many chapters?", o: ["13", "36", "7", "24"], a: 0, e: "The Art of War contains 13 chapters covering strategy, terrain, espionage, and other military topics. It remains studied in military academies and business schools worldwide." },
    { q: "Which philosopher argued that human nature is inherently good (性善)?", o: ["Mencius (孟子)", "Xunzi (荀子)", "Han Feizi (韓非子)", "Mozi (墨子)"], a: 0, e: "Mencius (孟子, c. 372-289 BCE) argued that all humans are born with innate goodness (性善說). His rival Xunzi (荀子) countered that human nature is inherently flawed (性惡說)." },
    { q: "The 'Strange Tales from a Chinese Studio' (《聊齋志異》) collects stories about:", o: ["Fox spirits, ghosts, and supernatural beings", "Historical battles", "Imperial court politics", "Travel adventures"], a: 0, e: "Pu Songling's 《聊齋志異》(c. 1679) collects nearly 500 tales of fox spirits, ghosts, and the supernatural. It uses fantasy to critique social injustice." },
    { q: "Which text begins with the famous line '道可道，非常道' (The Way that can be told is not the eternal Way)?", o: ["Dao De Jing (道德經)", "Zhuangzi (莊子)", "Yi Jing (易經)", "Analerta (論語)"], a: 0, e: "The opening line of the Dao De Jing establishes that the true Dao transcends language and conceptual understanding." },
    { q: "The concept of '氣' (Qì) in Chinese philosophy refers to:", o: ["Vital energy or life force pervading all things", "A type of martial arts technique", "A musical instrument", "A unit of measurement"], a: 0, e: "氣 (Qì) is the fundamental concept of vital energy that permeates the universe. It underpins Chinese medicine, martial arts, feng shui, and cosmology." },
    { q: "Zhuangzi's famous 'Butterfly Dream' parable questions:", o: ["The nature of reality and identity", "The afterlife", "The meaning of loyalty", "The importance of education"], a: 0, e: "In the parable, Zhuangzi dreams he is a butterfly and upon waking cannot determine whether he is a man who dreamed of being a butterfly, or a butterfly now dreaming of being a man." },

    // ===== MARTIAL ARTS (15) =====
    { q: "The character 武 (wǔ, martial) is composed of which two components?", o: ["止 (stop) + 戈 (weapon)", "力 (force) + 刀 (blade)", "人 (person) + 弓 (bow)", "手 (hand) + 矛 (spear)"], a: 0, e: "武 combines 止 (to stop) and 戈 (a weapon), embodying the paradox that the highest martial achievement is the ability to stop conflict." },
    { q: "Xingyiquan (形意拳) directly maps its five core techniques to which system?", o: ["Wu Xing (Five Elements)", "Ba Gua (Eight Trigrams)", "Twelve Zodiac Animals", "Yin-Yang theory"], a: 0, e: "Xingyiquan's five fist techniques correspond to Metal (splitting), Water (drilling), Wood (crushing), Fire (pounding), and Earth (crossing)." },
    { q: "Taijiquan (太極拳) is philosophically rooted in:", o: ["The interplay of Yin and Yang", "Buddhist meditation", "Legalist discipline", "Confucian ritual"], a: 0, e: "Taijiquan embodies the Daoist principle of Yin-Yang harmony — yielding overcomes force, softness transforms hardness. The taiji symbol (☯) represents this balance." },
    { q: "The Shaolin Temple (少林寺) is located on which sacred mountain?", o: ["Song Shan (嵩山)", "Wudang Shan (武當山)", "Emei Shan (峨眉山)", "Hua Shan (華山)"], a: 0, e: "The Shaolin Temple sits on Song Shan (嵩山) in Henan province. It is traditionally considered the birthplace of Chan (Zen) Buddhism and Shaolin martial arts." },
    { q: "Wudang Mountain (武當山) is traditionally associated with:", o: ["Internal martial arts and Daoism", "Shaolin kung fu", "Confucian academies", "Buddhist pilgrimage"], a: 0, e: "Wudang Shan is the traditional home of internal martial arts (內家拳) including Taijiquan, and is a major centre of Daoist practice and worship." },
    { q: "Baguazhang (八卦掌) practitioners are known for:", o: ["Walking in circles", "Standing meditation", "Jumping kicks", "Weapon forms only"], a: 0, e: "Baguazhang (Eight Trigram Palm) is characterised by constant circle-walking (走圈), with practitioners changing direction and palm techniques while circling." },
    { q: "The concept of 'internal' (內家) martial arts emphasises:", o: ["Qi cultivation, relaxation, and internal power", "External muscle strength", "Acrobatic techniques", "Weapon proficiency"], a: 0, e: "Internal martial arts (內家拳) — including Taijiquan, Xingyiquan, and Baguazhang — emphasise qi cultivation, mental focus, and using softness to overcome hardness." },
    { q: "Which legendary figure is traditionally credited with founding Shaolin martial arts?", o: ["Bodhidharma (達摩)", "Zhang Sanfeng (張三豐)", "Yue Fei (岳飛)", "Guan Yu (關羽)"], a: 0, e: "Bodhidharma (達摩, c. 5th-6th century) is traditionally credited with teaching exercises to Shaolin monks that evolved into kung fu, though this is debated by historians." },
    { q: "The 'Eighteen Arms of Wushu' (十八般武藝) refers to:", o: ["Eighteen traditional weapon categories", "Eighteen body techniques", "Eighteen pressure points", "Eighteen training stages"], a: 0, e: "The Eighteen Arms (十八般武藝) are the traditional weapon categories of Chinese martial arts, including sword (劍), sabre (刀), spear (槍), staff (棍), and others." },
    { q: "Wing Chun (詠春拳) is traditionally attributed to:", o: ["A woman named Yim Wing-chun", "A Shaolin monk", "A Wudang priest", "A military general"], a: 0, e: "According to legend, Wing Chun was created by the Buddhist nun Ng Mui (五枚) and named after her student Yim Wing-chun (嚴詠春). Bruce Lee studied Wing Chun under Ip Man." },
    { q: "The Jian (劍) and Dao (刀) differ primarily in that:", o: ["Jian is double-edged; Dao is single-edged", "Jian is longer", "Dao is a polearm", "They are identical"], a: 0, e: "The Jian (劍) is a straight, double-edged sword — the 'gentleman of weapons.' The Dao (刀) is a curved, single-edged sabre — the 'marshal of weapons.'" },
    { q: "Qigong (氣功) can be translated as:", o: ["Energy cultivation / breath work", "Fighting technique", "Weapon training", "Meditation only"], a: 0, e: "Qigong (氣功) means 'energy work' or 'breath cultivation.' It encompasses breathing exercises, gentle movement, and meditation to cultivate and balance qi." },
    { q: "Zhang Sanfeng (張三豐) is legendarily credited with creating:", o: ["Taijiquan", "Shaolin Kung Fu", "Wing Chun", "Xingyiquan"], a: 0, e: "The Daoist immortal Zhang Sanfeng is traditionally credited with creating Taijiquan, inspired by observing a fight between a crane and a snake on Wudang Mountain." },
    { q: "Drunken Boxing (醉拳) mimics the movements of:", o: ["An intoxicated person", "A sleeping person", "A falling leaf", "An animal"], a: 0, e: "Drunken Boxing (醉拳) uses deceptive stumbling, swaying, and falling movements that disguise powerful strikes. The practitioner appears drunk but is in complete control." },
    { q: "The term '功夫' (Gōngfu / Kung Fu) originally meant:", o: ["Skill achieved through hard work and time", "Fighting ability", "A specific martial art style", "Physical strength"], a: 0, e: "功夫 literally means 'skill achieved through effort over time.' It can refer to mastery of any discipline — tea-making, calligraphy, or cooking — not just martial arts." },

    // ===== WUXIA (12) =====
    { q: "Jin Yong (金庸) is considered the greatest wuxia novelist. His real name was:", o: ["Louis Cha Leung-yung (查良鏞)", "Gu Long (古龍)", "Liang Yusheng (梁羽生)", "Xiong Yaohua (熊耀華)"], a: 0, e: "Jin Yong's real name was Louis Cha Leung-yung (查良鏞, 1924-2018). He wrote 15 novels that define modern wuxia, selling over 300 million copies." },
    { q: "Jin Yong's 'Condor Trilogy' begins with which novel?", o: ["The Legend of the Condor Heroes (射鵰英雄傳)", "The Return of the Condor Heroes (神鵰俠侶)", "The Heaven Sword and Dragon Sabre (倚天屠龍記)", "A Hero Born"], a: 0, e: "The Condor Trilogy: 《射鵰英雄傳》(Legend of the Condor Heroes), 《神鵰俠侶》(Return of the Condor Heroes), 《倚天屠龍記》(Heaven Sword and Dragon Sabre)." },
    { q: "Gu Long's (古龍) wuxia style is best characterised as:", o: ["Noir, poetic, and psychologically intense", "Epic historical romance", "Comedy and satire", "Military strategy focused"], a: 0, e: "Gu Long (1938-1985) pioneered a noir, hardboiled wuxia style with short poetic sentences, psychological depth, and detective-like plots — a stark contrast to Jin Yong's epic storytelling." },
    { q: "The concept of '江湖' (Jiānghú) in wuxia literally means:", o: ["Rivers and lakes", "Martial world", "Outlaw territory", "Hidden realm"], a: 0, e: "江湖 literally means 'rivers and lakes' but refers to the martial arts underworld — a parallel society of fighters, outlaws, sects, and wandering heroes operating outside state control." },
    { q: "Liang Yusheng (梁羽生) is credited as the founder of:", o: ["The 'New School' of wuxia fiction", "Wuxia cinema", "Classical wuxia poetry", "Martial arts manuals"], a: 0, e: "Liang Yusheng (1924-2009) published 《龍虎鬥京華》in 1954, inaugurating the 'New School' (新派) of wuxia that combined historical settings with modern narrative techniques." },
    { q: "Which wuxia film by Ang Lee won the Academy Award for Best Foreign Language Film?", o: ["Crouching Tiger, Hidden Dragon (2000)", "Hero (2002)", "House of Flying Daggers (2004)", "The Grandmaster (2013)"], a: 0, e: "Crouching Tiger, Hidden Dragon (《臥虎藏龍》, 2000) won the Oscar for Best Foreign Language Film and was nominated for 10 total, bringing wuxia to global audiences." },
    { q: "The 'Five Greats' (五絕) in Jin Yong's Condor Heroes are masters of:", o: ["Supreme martial arts, each representing a direction", "The five elements", "Five weapons", "Five philosophies"], a: 0, e: "The Five Greats — East Heretic, West Venom, South Emperor, North Beggar, and Central Divine — are the supreme martial artists, each associated with a cardinal direction and the centre." },
    { q: "King Hu's (胡金銓) groundbreaking wuxia film 'A Touch of Zen' (1971) won a prize at:", o: ["Cannes Film Festival", "Venice Film Festival", "Berlin Film Festival", "Sundance"], a: 0, e: "A Touch of Zen (《俠女》) won the Grand Prix at Cannes in 1975. King Hu pioneered the wuxia film genre with innovative wire work and poetic cinematography." },
    { q: "Chu Liuxiang (楚留香) is a famous character created by:", o: ["Gu Long (古龍)", "Jin Yong (金庸)", "Liang Yusheng (梁羽生)", "Wen Rui'an (溫瑞安)"], a: 0, e: "Chu Liuxiang (楚留香), the 'Fragrant Knight,' is Gu Long's suave, gentlemanly thief-detective. The character has been adapted into numerous TV series and films." },
    { q: "The Shaw Brothers studio was important to wuxia because:", o: ["They produced hundreds of martial arts films in Hong Kong", "They published wuxia novels", "They founded a martial arts school", "They invented wire-fu techniques"], a: 0, e: "Shaw Brothers (邵氏兄弟) produced over 1,000 films from the 1950s-80s, establishing Hong Kong as the world capital of martial arts cinema." },
    { q: "Zhang Yimou's 'Hero' (2002) is notable for its use of:", o: ["Colour symbolism tied to different narrative perspectives", "Black-and-white cinematography", "Animation sequences", "Documentary-style filming"], a: 0, e: "Hero (《英雄》) uses distinct colour palettes — red, blue, white, green — for each retelling of events, creating a visually stunning meditation on truth and sacrifice." },
    { q: "The wuxia concept of '俠' (xiá) is best defined as:", o: ["A righteous person who uses martial skill to help the weak", "A professional soldier", "An imperial guard", "A wandering monk"], a: 0, e: "俠 (xiá) denotes a chivalrous hero who uses martial skill to defend the oppressed and uphold justice, often operating outside or against corrupt authority." },

    // ===== FOLK ARTS (12) =====
    { q: "Southern lion dance (南獅) is historically connected to which institutions in Guangdong?", o: ["Martial arts schools (武館)", "Buddhist temples", "Imperial courts", "Trading guilds"], a: 0, e: "Southern lion dance (南獅) was traditionally maintained by martial arts schools (武館) in Canton. The lion's movements are grounded in southern kung fu techniques." },
    { q: "英歌舞 (Yīnggē dance) is a folk art tradition from which region?", o: ["Chaoshan (潮汕)", "Beijing", "Sichuan", "Shanghai"], a: 0, e: "Yingge dance (英歌舞) is a vigorous folk performance art from the Chaoshan region of Guangdong, featuring rhythmic drumming and martial arts-inspired choreography." },
    { q: "Chinese paper cutting (剪紙) is traditionally used for:", o: ["Window decorations and festival celebrations", "Writing letters", "Wrapping gifts", "Religious scripture copying"], a: 0, e: "Paper cutting (剪紙) is used to decorate windows (窗花), doors, and walls during festivals, especially Spring Festival. UNESCO recognised it as Intangible Cultural Heritage in 2009." },
    { q: "Beijing Opera (京劇) uses how many main role types?", o: ["Four: Sheng, Dan, Jing, Chou", "Two: Male and Female", "Six: one per emotion", "Three: Hero, Villain, Clown"], a: 0, e: "Beijing Opera has four main roles: 生 (Shēng, male), 旦 (Dàn, female), 淨 (Jìng, painted-face), 丑 (Chǒu, clown). Each has distinct singing styles and makeup." },
    { q: "The dragon dance (舞龍) typically requires how many performers?", o: ["9 or more, sometimes over 50", "2", "4", "6"], a: 0, e: "A standard dragon dance team has at least 9 performers holding the dragon on poles. Festival dragons can be over 100 metres long with 50+ handlers." },
    { q: "Chinese calligraphy's 'Four Treasures of the Study' (文房四寶) are:", o: ["Brush, ink, paper, inkstone", "Brush, pen, scroll, seal", "Paper, silk, jade, gold", "Book, lamp, desk, chair"], a: 0, e: "The Four Treasures (文房四寶): 筆 (brush), 墨 (ink stick), 紙 (paper), 硯 (inkstone). Together they represent the scholar's essential tools." },
    { q: "Shadow puppetry (皮影戲) originated during approximately which dynasty?", o: ["Han Dynasty", "Tang Dynasty", "Song Dynasty", "Ming Dynasty"], a: 0, e: "Shadow puppetry (皮影戲) is traditionally said to have originated during the Han Dynasty when Emperor Wu's court magician created shadow figures to console the grieving emperor." },
    { q: "Chinese knot-tying (中國結) symbolises:", o: ["Good luck, prosperity, and unity", "Mourning", "Military rank", "Academic achievement"], a: 0, e: "Chinese decorative knots (中國結) are tied from a single cord and symbolise good fortune, prosperity, and togetherness. The word 結 (jié, knot) sounds like 吉 (jí, auspicious)." },
    { q: "Porcelain is called 'china' in English because:", o: ["China was the first and greatest producer of porcelain", "The word 'china' means 'porcelain' in Chinese", "A British merchant named it", "It was discovered in the China Sea"], a: 0, e: "China pioneered true porcelain during the Han Dynasty and perfected it in the Tang and Song. 'China' became synonymous with fine ceramic ware in Europe." },
    { q: "The erhu (二胡) is a Chinese instrument with how many strings?", o: ["Two", "Four", "One", "Six"], a: 0, e: "The erhu (二胡) has two strings (二 means 'two'). It is a bowed string instrument often called the 'Chinese violin,' capable of deeply expressive melodies." },
    { q: "Cloisonné (景泰藍) enamelware is named after which Ming Dynasty reign period?", o: ["Jingtai (景泰)", "Yongle (永樂)", "Hongwu (洪武)", "Xuande (宣德)"], a: 0, e: "Cloisonné is called 景泰藍 (Jǐngtài Lán) because the technique was perfected during the Jingtai reign (1450-1457) and characteristically featured blue (藍) enamel." },
    { q: "The art of seal carving (篆刻) combines which two disciplines?", o: ["Calligraphy and sculpture", "Painting and pottery", "Poetry and music", "Weaving and dyeing"], a: 0, e: "Seal carving (篆刻 zhuànkè) combines calligraphic artistry with sculptural skill. Artists carve characters into stone, creating personal seals used to sign paintings and documents." },

    // ===== TEA CULTURE (10) =====
    { q: "The classic text 《茶經》(The Classic of Tea) was written by:", o: ["Lu Yu (陸羽)", "Shen Nong (神農)", "Li Bai (李白)", "Su Shi (蘇軾)"], a: 0, e: "Lu Yu (陸羽, 733-804) wrote 《茶經》during the Tang Dynasty. It is the world's first comprehensive treatise on tea cultivation, preparation, and appreciation." },
    { q: "According to legend, tea was discovered by:", o: ["Shen Nong (神農)", "The Yellow Emperor", "Confucius", "Laozi"], a: 0, e: "Legend says the mythical emperor Shen Nong (神農) discovered tea around 2737 BCE when leaves blew into his boiling water. He is the patron saint of agriculture and medicine." },
    { q: "The six main categories of Chinese tea are:", o: ["Green, White, Yellow, Oolong, Red (Black), Dark (Pu-erh)", "Green, Black, Herbal, Fruit, Flower, Spiced", "Dragon Well, Tieguanyin, Pu-erh, Jasmine, Chrysanthemum, Lapsang", "Spring, Summer, Autumn, Winter, Morning, Evening"], a: 0, e: "The six categories are based on oxidation level: Green (綠茶, unoxidised), White (白茶), Yellow (黃茶), Oolong (烏龍茶, partially), Red/Black (紅茶, fully), Dark/Pu-erh (黑茶, post-fermented)." },
    { q: "Gongfu tea ceremony (功夫茶) originated in which region?", o: ["Fujian and Chaoshan (潮汕)", "Beijing", "Sichuan", "Yunnan"], a: 0, e: "Gongfu cha (功夫茶) originated in the Fujian-Guangdong Chaoshan region. '功夫' here means 'skill and effort' — the ceremony uses small cups and precise brewing techniques." },
    { q: "Dragon Well (龍井) tea is a famous variety from:", o: ["Hangzhou, Zhejiang", "Wuyi Mountains, Fujian", "Yunnan Province", "Anhui Province"], a: 0, e: "Longjing (龍井, Dragon Well) is China's most famous green tea, grown near the West Lake in Hangzhou. It is pan-fired in a wok, producing flat, smooth leaves." },
    { q: "Pu-erh tea (普洱茶) is unique because it:", o: ["Undergoes microbial fermentation and improves with age", "Is the most caffeinated tea", "Must be drunk immediately", "Is always flavoured with flowers"], a: 0, e: "Pu-erh (普洱茶) from Yunnan undergoes post-fermentation. Like wine, quality Pu-erh improves with age — vintage cakes can sell for tens of thousands of dollars." },
    { q: "In traditional Chinese tea culture, what does 'pouring tea' for someone symbolise?", o: ["Respect and gratitude", "Apology", "Challenge", "Farewell"], a: 0, e: "Pouring tea shows respect. In Cantonese dim sum culture, tapping two fingers on the table after someone pours tea is a gesture of thanks (叩手禮), said to originate from Emperor Qianlong." },
    { q: "Yixing (宜興) teapots are prized because they are made from:", o: ["Purple clay (紫砂) that absorbs tea flavour over time", "Pure gold", "Jade", "Bamboo"], a: 0, e: "Yixing purple clay (紫砂 zǐshā) teapots are porous and absorb tea oils over decades of use. A well-seasoned pot can produce flavourful tea with just hot water." },
    { q: "The 'tea horse road' (茶馬古道) was an ancient trade route exchanging tea for:", o: ["Horses from Tibet", "Silk from Central Asia", "Spices from India", "Gold from Mongolia"], a: 0, e: "The Tea Horse Road (茶馬古道) connected Yunnan/Sichuan to Tibet, exchanging Chinese tea for Tibetan horses. Some routes extended to Southeast Asia and India." },
    { q: "What does '品茶' (pǐn chá) mean?", o: ["To savour/appreciate tea", "To sell tea", "To grow tea", "To brew tea quickly"], a: 0, e: "品茶 means to mindfully taste and appreciate tea — savouring the colour, aroma, flavour, and aftertaste. It implies a contemplative, almost meditative approach." },

    // ===== DAOISM & YI JING (12) =====
    { q: "How many trigrams (卦) are in the Ba Gua system?", o: ["8", "12", "64", "6"], a: 0, e: "The Ba Gua (八卦) consists of 8 trigrams, each made of 3 lines (broken or unbroken). When combined in pairs they form the 64 hexagrams of the Yi Jing." },
    { q: "The Daoist concept of '道' (Dào) is best understood as:", o: ["The fundamental, nameless source and principle of all reality", "A specific god", "A type of meditation", "A moral code"], a: 0, e: "道 (Dào) is the ineffable, formless source from which all things arise. It cannot be fully defined in words — hence Laozi's opening: '道可道，非常道.'" },
    { q: "Yin and Yang represent:", o: ["Complementary opposites in dynamic balance", "Good and evil", "Male and female only", "Light and darkness only"], a: 0, e: "Yin (陰) and Yang (陽) are complementary forces — each contains the seed of the other. They describe all dualities: dark/light, cold/hot, passive/active, receptive/creative." },
    { q: "The Taiji (太極) symbol represents:", o: ["The dynamic interplay of Yin and Yang", "The sun", "The zodiac wheel", "The five elements"], a: 0, e: "The Taiji (☯) shows Yin and Yang flowing into each other, each containing a dot of the other — symbolising that all opposites are interconnected and interdependent." },
    { q: "Zhuangzi's parable of 'Cook Ding' (庖丁解牛) illustrates:", o: ["Mastery through Wu Wei — effortless skill", "The importance of sharp tools", "The value of hard work", "How to prepare a feast"], a: 0, e: "Cook Ding butchers an ox with perfect ease because he follows the natural structure. His knife never dulls because it moves through gaps. This illustrates Wu Wei — effortless mastery in harmony with nature." },
    { q: "The 'Three Treasures' (三寶) of Daoism according to Laozi are:", o: ["Compassion, frugality, humility", "Wisdom, courage, strength", "Heaven, Earth, Humanity", "Gold, jade, silk"], a: 0, e: "In Chapter 67 of the Dao De Jing, Laozi names his Three Treasures: 慈 (cí, compassion), 儉 (jiǎn, frugality), and 不敢為天下先 (not daring to be first in the world / humility)." },
    { q: "The I Ching (易經) was traditionally used for:", o: ["Divination and philosophical reflection", "Tax collection", "Military drill", "Musical composition"], a: 0, e: "The I Ching (易經, Book of Changes) is one of the oldest divination systems in the world. Over millennia it evolved into a profound philosophical text studied by Confucians and Daoists alike." },
    { q: "The trigram '☰' (三 unbroken lines) represents:", o: ["Heaven (乾 Qián)", "Earth (坤 Kūn)", "Water (坎 Kǎn)", "Fire (離 Lí)"], a: 0, e: "☰ (three unbroken Yang lines) represents Heaven/乾 (Qián) — the creative, strong, initiating force. Its complement ☷ (three broken Yin lines) represents Earth/坤 (Kūn)." },
    { q: "The Daoist practice of 'nourishing life' (養生) encompasses:", o: ["Diet, exercise, meditation, and breath work for longevity", "Only herbal medicine", "Only martial arts", "Only fasting"], a: 0, e: "養生 (Yǎngshēng) is a holistic Daoist approach to health combining diet, qigong, meditation, herbal remedies, and seasonal living to cultivate vitality and longevity." },
    { q: "Which Daoist text features the 'Free and Easy Wandering' (逍遙遊) chapter?", o: ["Zhuangzi (莊子)", "Dao De Jing (道德經)", "Liezi (列子)", "Baopuzi (抱朴子)"], a: 0, e: "The first chapter of the Zhuangzi (《莊子》), 'Free and Easy Wandering' (逍遙遊), uses the parable of the giant Peng bird to explore absolute freedom and perspective." },
    { q: "The concept of 'De' (德) in Daoism means:", o: ["Virtue, power, or inherent character", "Money or wealth", "Knowledge", "Authority"], a: 0, e: "德 (Dé) means virtue, moral force, or inherent power. In Daoism, De is the manifestation of Dao in each individual thing — its natural character and potency." },
    { q: "Daoist alchemy (煉丹術) had two branches:", o: ["External alchemy (waidan) and internal alchemy (neidan)", "Gold alchemy and silver alchemy", "Plant alchemy and animal alchemy", "Fire alchemy and water alchemy"], a: 0, e: "External alchemy (外丹 wàidān) sought physical elixirs of immortality. Internal alchemy (內丹 nèidān) used meditation and breath work to refine qi within the body." },

    // ===== TCM / TRADITIONAL CHINESE MEDICINE (10) =====
    { q: "The foundational text of Traditional Chinese Medicine is:", o: ["《黃帝內經》(Huangdi Neijing)", "《本草綱目》(Bencao Gangmu)", "《傷寒論》(Shanghan Lun)", "《茶經》(Cha Jing)"], a: 0, e: "The Huangdi Neijing (《黃帝內經》, Yellow Emperor's Classic of Internal Medicine), compiled around the 2nd century BCE, lays out the theoretical foundation of TCM." },
    { q: "Li Shizhen's 《本草綱目》(Compendium of Materia Medica) catalogues approximately:", o: ["1,892 medicinal substances", "500 herbs", "100 minerals", "3,000 drugs"], a: 0, e: "Li Shizhen (李時珍, 1518-1593) spent 27 years compiling the Bencao Gangmu, documenting 1,892 drugs with 11,096 prescriptions. It remains a foundational pharmacological reference." },
    { q: "Acupuncture works by stimulating points along:", o: ["Meridians (經絡) through which qi flows", "Blood vessels", "Nerve clusters only", "Muscle fibres"], a: 0, e: "Acupuncture stimulates specific points along meridians (經絡 jīngluò) — pathways through which qi circulates. There are 12 primary meridians corresponding to major organs." },
    { q: "The 'Four Diagnostic Methods' (四診) in TCM are:", o: ["Observation, listening/smelling, inquiry, palpation", "Blood test, urine test, X-ray, surgery", "Herbal, acupuncture, massage, exercise", "Spring, summer, autumn, winter diagnosis"], a: 0, e: "The Four Diagnostic Methods: 望 (observation), 聞 (listening/smelling), 問 (inquiry), 切 (palpation/pulse-taking). Pulse diagnosis alone distinguishes 28 different pulse types." },
    { q: "How many primary meridians does the human body have according to TCM?", o: ["12", "8", "24", "6"], a: 0, e: "There are 12 primary meridians (十二正經), each associated with a major organ. There are also 8 extraordinary meridians (奇經八脈) including the Ren and Du channels." },
    { q: "Hua Tuo (華佗) was a famous physician who pioneered:", o: ["Surgical anaesthesia using mafeisan (麻沸散)", "Acupuncture theory", "Herbal classification", "Pulse diagnosis"], a: 0, e: "Hua Tuo (c. 140-208 CE) was a legendary Eastern Han physician who developed mafeisan (麻沸散), an herbal anaesthetic for surgery — centuries before Western anaesthesia." },
    { q: "The TCM concept of '寒' (hán) and '熱' (rè) refers to:", o: ["Cold and hot patterns of disease/constitution", "Room temperature during treatment", "Seasons for treatment", "Types of herbs only"], a: 0, e: "寒 (cold) and 熱 (hot) are fundamental diagnostic categories in TCM. Cold patterns show pale complexion, cold limbs, and clear fluids. Hot patterns show redness, fever, and dark fluids." },
    { q: "Zhang Zhongjing's 《傷寒論》(Treatise on Cold Damage) is significant because:", o: ["It established systematic diagnosis and herbal prescription methods", "It was the first text on surgery", "It introduced acupuncture", "It catalogued all known diseases"], a: 0, e: "Zhang Zhongjing (張仲景, c. 150-219 CE) wrote 《傷寒論》which established the Six Meridian diagnosis system and systematic prescription methodology still used today." },
    { q: "Moxibustion (艾灸) involves:", o: ["Burning dried mugwort near or on acupuncture points", "Applying hot stones", "Drinking herbal tea", "Needle insertion"], a: 0, e: "Moxibustion (艾灸 àijiǔ) burns dried mugwort (艾草 àicǎo) to warm acupuncture points and stimulate qi flow. It is often used alongside acupuncture." },
    { q: "The concept of 'Qi stagnation' (氣滯) in TCM can cause:", o: ["Pain, bloating, emotional irritability", "Excessive energy", "Weight loss", "Improved circulation"], a: 0, e: "When qi (氣) stagnates, it causes distension, pain, and emotional symptoms like irritability or depression. The TCM principle states: '不通則痛' (where there is blockage, there is pain)." },

    // ===== HANFU & CULTURAL IDENTITY (8) =====
    { q: "The defining structural feature of Hanfu is:", o: ["Cross-collar, right-side wrapping (交領右衽)", "Mandarin collar", "Side-button closure", "Wrap-around sash only"], a: 0, e: "Hanfu's defining feature is the cross-collar wrapping to the right (交領右衽 jiāolǐng yòurèn). This right-over-left wrapping distinguished Chinese dress for millennia." },
    { q: "The term 漢字文化圈 (Hànzì Wénhuà Quān) refers to:", o: ["The East Asian cultural sphere using Chinese characters", "A calligraphy school", "A type of feng shui compass", "An ancient trade route"], a: 0, e: "漢字文化圈 (Sinosphere / Chinese character cultural sphere) refers to the civilisations — China, Japan, Korea, Vietnam — that adopted Chinese writing, Confucian governance, and cultural practices." },
    { q: "The Shenyi (深衣) is a type of Hanfu characterised by:", o: ["A one-piece wrapped garment connecting top and skirt", "A short jacket", "Trousers only", "A sleeveless vest"], a: 0, e: "The Shenyi (深衣, 'deep garment') connects the upper and lower sections into one wrapped piece. It was standard formal wear from the Zhou Dynasty onward." },
    { q: "The modern Hanfu revival movement began primarily in:", o: ["The early 2000s", "The 1950s", "The 1980s", "The 1920s"], a: 0, e: "The modern Hanfu revival began around 2003, driven by online communities promoting traditional Han Chinese clothing as cultural heritage. It has since become a major cultural movement." },
    { q: "The Ruqun (襦裙) style of Hanfu consists of:", o: ["A short jacket paired with a long skirt", "A full-length robe", "Trousers and a tunic", "A cape and dress"], a: 0, e: "Ruqun (襦裙) pairs a short jacket (襦 rú) with a high-waisted skirt (裙 qún). It was the most common women's outfit across multiple dynasties." },
    { q: "What is the significance of the colour yellow in imperial Chinese dress?", o: ["It was reserved exclusively for the emperor", "It represented mourning", "It was worn by scholars", "It symbolised youth"], a: 0, e: "Bright yellow (明黃) was reserved exclusively for the emperor from the Tang Dynasty onward. Wearing it without authorisation was a capital offence." },
    { q: "The 'Chinamaxxing' trend refers to:", o: ["Young people worldwide embracing Chinese cultural aesthetics and lifestyle", "A Chinese exercise programme", "A cooking show", "A martial arts competition"], a: 0, e: "Chinamaxxing is a social media trend where young people — both Chinese and non-Chinese — enthusiastically adopt Chinese cultural elements: hanfu, tea ceremony, calligraphy, and traditional aesthetics." },
    { q: "Traditional Chinese wedding attire is predominantly:", o: ["Red", "White", "Gold", "Blue"], a: 0, e: "Red is the dominant colour in traditional Chinese weddings, symbolising good fortune, joy, and prosperity. White is associated with mourning in Chinese culture." }
  ];

  const TOTAL = 10;
  const TIMER_SECONDS = 22;
  const CIRCUMFERENCE = 2 * Math.PI * 20; // ~125.66, matches SVG circle r=20
  let currentQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let answered = false;
  let timerInterval = null;
  let timeLeft = TIMER_SECONDS;

  const els = {
    game: triviaGame,
    start: document.getElementById('trivia-start'),
    result: document.getElementById('trivia-result'),
    question: document.getElementById('trivia-question'),
    options: document.getElementById('trivia-options'),
    feedback: document.getElementById('trivia-feedback'),
    next: document.getElementById('trivia-next'),
    current: document.getElementById('trivia-current'),
    total: document.getElementById('trivia-total'),
    progressFill: document.getElementById('trivia-progress-fill'),
    scoreIcon: document.getElementById('trivia-score-icon'),
    scoreTitle: document.getElementById('trivia-score-title'),
    scoreText: document.getElementById('trivia-score-text'),
    scoreFill: document.getElementById('trivia-score-fill'),
    highScore: document.getElementById('trivia-high-score'),
    restart: document.getElementById('trivia-restart'),
    begin: document.getElementById('trivia-begin'),
    timer: document.getElementById('trivia-timer'),
    timerCircle: document.getElementById('trivia-timer-circle'),
    timerText: document.getElementById('trivia-timer-text')
  };

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* --- Timer --- */
  function startTimer() {
    stopTimer();
    timeLeft = TIMER_SECONDS;
    updateTimerDisplay();
    if (els.timer) els.timer.style.display = '';
    timerInterval = setInterval(function() {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        stopTimer();
        timeExpired();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    if (!els.timerCircle || !els.timerText) return;
    var pct = timeLeft / TIMER_SECONDS;
    var offset = CIRCUMFERENCE * (1 - pct);
    els.timerCircle.style.strokeDashoffset = offset;
    els.timerText.textContent = timeLeft;

    // Warning / danger states
    els.timerCircle.classList.remove('warning', 'danger');
    if (timeLeft <= 5) {
      els.timerCircle.classList.add('danger');
    } else if (timeLeft <= 10) {
      els.timerCircle.classList.add('warning');
    }
  }

  function timeExpired() {
    if (answered) return;
    answered = true;
    var q = currentQuestions[currentIndex];

    // Disable all buttons and highlight correct answer
    var buttons = els.options.querySelectorAll('.trivia-option');
    buttons.forEach(function(b) {
      b.disabled = true;
      var bIdx = parseInt(b.getAttribute('data-idx'));
      if (bIdx === q.a) b.classList.add('correct');
    });

    // Show feedback
    els.feedback.hidden = false;
    els.feedback.className = 'trivia-feedback wrong-feedback';
    els.feedback.innerHTML = '<strong>Time\'s up!</strong> The answer is: <em>' + q.o[q.a] + '</em>. ' + q.e;

    // Show next or finish
    if (currentIndex < TOTAL - 1) {
      els.next.hidden = false;
      els.next.textContent = 'Next Question';
    } else {
      els.next.hidden = false;
      els.next.textContent = 'See Results';
    }
  }

  function startGame() {
    currentQuestions = shuffle(QUESTIONS).slice(0, TOTAL);
    currentIndex = 0;
    score = 0;
    answered = false;
    els.start.hidden = true;
    els.result.hidden = true;
    els.game.hidden = false;
    els.total.textContent = TOTAL;
    showQuestion();
  }

  function showQuestion() {
    answered = false;
    const q = currentQuestions[currentIndex];
    els.current.textContent = currentIndex + 1;
    els.progressFill.style.width = ((currentIndex + 1) / TOTAL * 100) + '%';
    els.question.textContent = q.q;
    els.feedback.hidden = true;
    els.next.hidden = true;

    // Shuffle options while tracking correct answer
    const indices = [0, 1, 2, 3];
    const shuffled = shuffle(indices);

    els.options.innerHTML = '';
    shuffled.forEach(function(origIdx) {
      const btn = document.createElement('button');
      btn.className = 'trivia-option';
      btn.textContent = q.o[origIdx];
      btn.setAttribute('data-idx', origIdx);
      btn.addEventListener('click', function() { selectAnswer(origIdx, btn); });
      els.options.appendChild(btn);
    });

    // Start countdown timer
    startTimer();
  }

  function selectAnswer(idx, btn) {
    if (answered) return;
    answered = true;
    stopTimer();
    const q = currentQuestions[currentIndex];
    const isCorrect = idx === q.a;
    if (isCorrect) score++;

    // Mark all buttons
    const buttons = els.options.querySelectorAll('.trivia-option');
    buttons.forEach(function(b) {
      b.disabled = true;
      const bIdx = parseInt(b.getAttribute('data-idx'));
      if (bIdx === q.a) b.classList.add('correct');
      else if (b === btn && !isCorrect) b.classList.add('wrong');
    });

    // Show feedback
    els.feedback.hidden = false;
    els.feedback.className = 'trivia-feedback ' + (isCorrect ? 'correct-feedback' : 'wrong-feedback');
    els.feedback.innerHTML = (isCorrect ? '<strong>Correct!</strong> ' : '<strong>Incorrect.</strong> The answer is: <em>' + q.o[q.a] + '</em>. ') + q.e;

    // Show next or finish
    if (currentIndex < TOTAL - 1) {
      els.next.hidden = false;
      els.next.textContent = 'Next Question';
    } else {
      els.next.hidden = false;
      els.next.textContent = 'See Results';
    }
  }

  function nextQuestion() {
    if (currentIndex < TOTAL - 1) {
      currentIndex++;
      showQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    stopTimer();
    if (els.timer) els.timer.style.display = 'none';
    els.game.hidden = true;
    els.result.hidden = false;
    const pct = Math.round(score / TOTAL * 100);
    els.scoreFill.style.width = pct + '%';

    let icon, title;
    if (pct === 100) { icon = '🏆'; title = 'Perfect Score — Scholar of the Imperial Academy!'; }
    else if (pct >= 80) { icon = '🎓'; title = 'Excellent — Worthy of a Jinshi Degree!'; }
    else if (pct >= 60) { icon = '📚'; title = 'Well Done — A Diligent Student of the Classics'; }
    else if (pct >= 40) { icon = '🔖'; title = 'Not Bad — Keep Studying the Ancient Texts'; }
    else { icon = '📜'; title = 'The Journey of a Thousand Li Begins with a Single Step'; }

    els.scoreIcon.textContent = icon;
    els.scoreTitle.textContent = title;
    els.scoreText.textContent = 'You scored ' + score + ' out of ' + TOTAL + ' (' + pct + '%)';

    // High score
    const key = 'czy-trivia-high';
    const prev = parseInt(localStorage.getItem(key) || '0');
    if (score > prev) {
      localStorage.setItem(key, score);
      els.highScore.textContent = 'New high score!';
    } else {
      els.highScore.textContent = 'High score: ' + Math.max(prev, score) + '/' + TOTAL;
    }
  }

  // Event listeners
  els.begin.addEventListener('click', startGame);
  els.next.addEventListener('click', nextQuestion);
  els.restart.addEventListener('click', startGame);

  // Initial state — show start screen, hide game and result
  els.game.hidden = true;
  els.result.hidden = true;
  els.start.hidden = false;
  if (els.timer) els.timer.style.display = 'none';
})();

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

  function setLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('czy-lang', lang);
    /* Update html lang attribute for accessibility */
    var htmlLang = lang === 'en' ? 'en' : (lang === 'tc' ? 'zh-Hant' : 'zh-Hans');
    document.documentElement.setAttribute('lang', htmlLang);
  }

  /* Toggle button cycles: en → tc → sc → en */
  var langBtn = document.querySelector('.lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-lang') || 'en';
      var idx = CYCLE.indexOf(current);
      var next = CYCLE[(idx + 1) % 3];
      setLang(next);
    });
  }
})();

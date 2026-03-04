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
    { q: "How many animals are in the Chinese zodiac cycle?", q_tc: "中國生肖共有多少種動物？", q_sc: "中国生肖共有多少种动物？", o: ["12", "10", "8", "14"], o_tc: ["12", "10", "8", "14"], o_sc: ["12", "10", "8", "14"], a: 0, e: "The Chinese zodiac consists of 12 animals in a repeating cycle. The system originated during the Qin Dynasty from animal worship traditions.", e_tc: "中國生肖由十二種動物組成，循環往復。該體系起源於秦朝的動物崇拜傳統。", e_sc: "中国生肖由十二种动物组成，循环往复。该体系起源于秦朝的动物崇拜传统。" },
    { q: "Which animal is first in the Chinese zodiac cycle?", q_tc: "中國生肖中排名第一的是哪種動物？", q_sc: "中国生肖中排名第一的是哪种动物？", o: ["Rat", "Dragon", "Ox", "Tiger"], o_tc: ["鼠", "龍", "牛", "虎"], o_sc: ["鼠", "龙", "牛", "虎"], a: 0, e: "The Rat is first. According to the Jade Emperor legend, the clever Rat rode on the Ox's back and jumped ahead at the finish line.", e_tc: "鼠排名第一。根據玉皇大帝的傳說，聰明的老鼠騎在牛背上，在終點線前跳下搶先到達。", e_sc: "鼠排名第一。根据玉皇大帝的传说，聪明的老鼠骑在牛背上，在终点线前跳下抢先到达。" },
    { q: "Which zodiac animal is associated with the Earthly Branch '子' (Zǐ)?", q_tc: "哪個生肖動物與地支「子」相對應？", q_sc: "哪个生肖动物与地支\u201c子\u201d相对应？", o: ["Rat", "Ox", "Tiger", "Rabbit"], o_tc: ["鼠", "牛", "虎", "兔"], o_sc: ["鼠", "牛", "虎", "兔"], a: 0, e: "子 (Zǐ) corresponds to the Rat, the first of the twelve Earthly Branches paired with zodiac animals.", e_tc: "子對應的是鼠，是十二地支配生肖中的第一個。", e_sc: "子对应的是鼠，是十二地支配生肖中的第一个。" },
    { q: "How many years does it take for the full sexagenary (Stem-Branch) cycle to complete?", q_tc: "干支紀年的完整循環需要多少年？", q_sc: "干支纪年的完整循环需要多少年？", o: ["60 years", "12 years", "10 years", "100 years"], o_tc: ["60年", "12年", "10年", "100年"], o_sc: ["60年", "12年", "10年", "100年"], a: 0, e: "The sexagenary cycle combines 10 Heavenly Stems and 12 Earthly Branches, producing 60 unique combinations before repeating.", e_tc: "干支循環由十天干與十二地支組合而成，共產生六十個獨特組合後才會重複。", e_sc: "干支循环由十天干与十二地支组合而成，共产生六十个独特组合后才会重复。" },
    { q: "In the zodiac race legend, which animal carried the Rat across the river?", q_tc: "在生肖賽跑的傳說中，哪種動物馱老鼠過了河？", q_sc: "在生肖赛跑的传说中，哪种动物驮老鼠过了河？", o: ["Ox", "Horse", "Dragon", "Tiger"], o_tc: ["牛", "馬", "龍", "虎"], o_sc: ["牛", "马", "龙", "虎"], a: 0, e: "The Ox generously carried the Rat across the river, but the Rat leapt off at the last moment to claim first place.", e_tc: "牛慷慨地馱著老鼠過河，但老鼠在最後一刻跳下，搶先奪得了第一名。", e_sc: "牛慷慨地驮着老鼠过河，但老鼠在最后一刻跳下，抢先夺得了第一名。" },
    { q: "Which zodiac animal is the only mythical creature in the cycle?", q_tc: "哪個生肖動物是十二生肖中唯一的神話生物？", q_sc: "哪个生肖动物是十二生肖中唯一的神话生物？", o: ["Dragon", "Phoenix", "Qilin", "Pixiu"], o_tc: ["龍", "鳳凰", "麒麟", "貔貅"], o_sc: ["龙", "凤凰", "麒麟", "貔貅"], a: 0, e: "The Dragon (龍) is the only mythical animal among the twelve. All others — Rat, Ox, Tiger, Rabbit, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig — are real animals.", e_tc: "龍是十二生肖中唯一的神話動物。其餘的鼠、牛、虎、兔、蛇、馬、羊、猴、雞、狗、豬都是真實存在的動物。", e_sc: "龙是十二生肖中唯一的神话动物。其余的鼠、牛、虎、兔、蛇、马、羊、猴、鸡、狗、猪都是真实存在的动物。" },
    { q: "What is the Chinese term for one's zodiac birth year recurring (every 12 years)?", q_tc: "每十二年一輪的生肖年重逢，中文稱為什麼？", q_sc: "每十二年一轮的生肖年重逢，中文称为什么？", o: ["本命年 (Běnmìngnián)", "吉年 (Jínián)", "運年 (Yùnnián)", "生年 (Shēngnián)"], o_tc: ["本命年", "吉年", "運年", "生年"], o_sc: ["本命年", "吉年", "运年", "生年"], a: 0, e: "本命年 (Běnmìngnián) is when your zodiac animal year returns. It is traditionally considered an unlucky year, and people wear red underwear for protection.", e_tc: "本命年是指自己所屬生肖年再次到來的年份。傳統上被認為是不吉利的一年，人們會穿紅色內衣來避邪。", e_sc: "本命年是指自己所属生肖年再次到来的年份。传统上被认为是不吉利的一年，人们会穿红色内衣来避邪。" },
    { q: "The Earthly Branch '午' (Wǔ) corresponds to which animal?", q_tc: "地支「午」對應哪種動物？", q_sc: "地支\u201c午\u201d对应哪种动物？", o: ["Horse", "Goat", "Snake", "Monkey"], o_tc: ["馬", "羊", "蛇", "猴"], o_sc: ["马", "羊", "蛇", "猴"], a: 0, e: "午 (Wǔ) corresponds to the Horse. The character is associated with midday (noon) and the south direction.", e_tc: "午對應的是馬。這個字與正午及南方方位相關聯。", e_sc: "午对应的是马。这个字与正午及南方方位相关联。" },
    { q: "Which two zodiac animals are considered most compatible in traditional matchmaking?", q_tc: "在傳統婚配中，哪兩個生肖被認為最相配？", q_sc: "在传统婚配中，哪两个生肖被认为最相配？", o: ["Dragon and Phoenix (Rooster)", "Rat and Dog", "Tiger and Snake", "Ox and Horse"], o_tc: ["龍與鳳（雞）", "鼠與狗", "虎與蛇", "牛與馬"], o_sc: ["龙与凤（鸡）", "鼠与狗", "虎与蛇", "牛与马"], a: 0, e: "Dragon and Phoenix (represented by the Rooster) is the classic auspicious pairing (龍鳳呈祥), symbolising perfect harmony in marriage.", e_tc: "龍與鳳（以雞代表）是經典的吉祥配對（龍鳳呈祥），象徵婚姻中的完美和諧。", e_sc: "龙与凤（以鸡代表）是经典的吉祥配对（龙凤呈祥），象征婚姻中的完美和谐。" },
    { q: "The zodiac animal for 2024 is the:", q_tc: "2024年的生肖是：", q_sc: "2024年的生肖是：", o: ["Dragon", "Rabbit", "Snake", "Tiger"], o_tc: ["龍", "兔", "蛇", "虎"], o_sc: ["龙", "兔", "蛇", "虎"], a: 0, e: "2024 is the Year of the Wood Dragon (甲辰年). The Dragon is the most auspicious zodiac animal, and Dragon years often see higher birth rates.", e_tc: "2024年是甲辰年，即木龍年。龍是最吉祥的生肖動物，龍年的出生率通常會上升。", e_sc: "2024年是甲辰年，即木龙年。龙是最吉祥的生肖动物，龙年的出生率通常会上升。" },
    { q: "What animal does the Earthly Branch '卯' (Mǎo) represent?", q_tc: "地支「卯」代表哪種動物？", q_sc: "地支\u201c卯\u201d代表哪种动物？", o: ["Rabbit", "Tiger", "Dragon", "Rat"], o_tc: ["兔", "虎", "龍", "鼠"], o_sc: ["兔", "虎", "龙", "鼠"], a: 0, e: "卯 (Mǎo) represents the Rabbit and is associated with the early morning hours (5-7 AM) and the east direction.", e_tc: "卯代表兔，與清晨時辰（早上五至七點）及東方方位相關聯。", e_sc: "卯代表兔，与清晨时辰（早上五至七点）及东方方位相关联。" },
    { q: "In Chinese zodiac compatibility, which group of three animals is called a 'Harmony Triangle' (三合)?", q_tc: "在生肖相合中，哪三種動物構成「三合」？", q_sc: "在生肖相合中，哪三种动物构成\u201c三合\u201d？", o: ["Rat, Dragon, Monkey", "Ox, Snake, Pig", "Tiger, Horse, Rooster", "Rabbit, Goat, Rat"], o_tc: ["鼠、龍、猴", "牛、蛇、豬", "虎、馬、雞", "兔、羊、鼠"], o_sc: ["鼠、龙、猴", "牛、蛇、猪", "虎、马、鸡", "兔、羊、鼠"], a: 0, e: "Rat-Dragon-Monkey form a Water harmony triangle (三合). The four triangles are: Water (Rat-Dragon-Monkey), Metal (Ox-Snake-Rooster), Wood (Tiger-Horse-Dog), Fire (Rabbit-Goat-Pig).", e_tc: "鼠、龍、猴組成水局三合。四組三合分別為：水局（鼠、龍、猴）、金局（牛、蛇、雞）、木局（虎、馬、狗）、火局（兔、羊、豬）。", e_sc: "鼠、龙、猴组成水局三合。四组三合分别为：水局（鼠、龙、猴）、金局（牛、蛇、鸡）、木局（虎、马、狗）、火局（兔、羊、猪）。" },
    { q: "Which zodiac animal governs the 'double hour' of 11 PM to 1 AM?", q_tc: "哪個生肖動物主管晚上十一點至凌晨一點的時辰？", q_sc: "哪个生肖动物主管晚上十一点至凌晨一点的时辰？", o: ["Rat", "Pig", "Ox", "Tiger"], o_tc: ["鼠", "豬", "牛", "虎"], o_sc: ["鼠", "猪", "牛", "虎"], a: 0, e: "The Rat governs the 子時 (Zǐ shí), 11 PM to 1 AM — the hour that straddles two days, reflecting the Rat's position between old and new cycles.", e_tc: "鼠主管子時，即晚上十一點至凌晨一點——這個時辰橫跨兩天之交，反映了鼠在新舊循環之間的地位。", e_sc: "鼠主管子时，即晚上十一点至凌晨一点——这个时辰横跨两天之交，反映了鼠在新旧循环之间的地位。" },
    { q: "What colour should people wear during their 本命年 (zodiac birth year) for protection?", q_tc: "本命年應該穿什麼顏色來避邪？", q_sc: "本命年应该穿什么颜色来避邪？", o: ["Red", "Gold", "Black", "White"], o_tc: ["紅色", "金色", "黑色", "白色"], o_sc: ["红色", "金色", "黑色", "白色"], a: 0, e: "Red is worn during one's 本命年 — especially red underwear or a red waist cord — to ward off the bad luck associated with offending the Tai Sui (太歲).", e_tc: "本命年要穿紅色——尤其是紅色內衣或紅腰繩——以驅除犯太歲帶來的厄運。", e_sc: "本命年要穿红色——尤其是红色内衣或红腰绳——以驱除犯太岁带来的厄运。" },
    { q: "The Fire Horse year (丙午年) is considered especially inauspicious for:", q_tc: "丙午年（火馬年）被認為對以下哪類人尤為不利？", q_sc: "丙午年（火马年）被认为对以下哪类人尤为不利？", o: ["Girls born that year", "Business ventures", "Building houses", "Weddings"], o_tc: ["該年出生的女孩", "經商創業", "蓋房建屋", "結婚嫁娶"], o_sc: ["该年出生的女孩", "经商创业", "盖房建屋", "结婚嫁娶"], a: 0, e: "In Japanese and Chinese folk belief, girls born in a Fire Horse year (e.g. 1966) are considered willful and bad luck for husbands. Japan's birth rate dropped significantly in 1966.", e_tc: "在日本和中國的民間信仰中，丙午年（如1966年）出生的女孩被認為性格剛烈，會剋夫。日本1966年的出生率因此大幅下降。", e_sc: "在日本和中国的民间信仰中，丙午年（如1966年）出生的女孩被认为性格刚烈，会克夫。日本1966年的出生率因此大幅下降。" },
    { q: "Which animal is associated with the Earthly Branch '丑' (Chǒu)?", q_tc: "哪種動物與地支「丑」相對應？", q_sc: "哪种动物与地支\u201c丑\u201d相对应？", o: ["Ox", "Rat", "Tiger", "Pig"], o_tc: ["牛", "鼠", "虎", "豬"], o_sc: ["牛", "鼠", "虎", "猪"], a: 0, e: "丑 (Chǒu) corresponds to the Ox, associated with the hours of 1-3 AM and the north-northeast direction.", e_tc: "丑對應的是牛，與凌晨一至三點的時辰及東北偏北方位相關聯。", e_sc: "丑对应的是牛，与凌晨一至三点的时辰及东北偏北方位相关联。" },
    { q: "The Cat is NOT in the Chinese zodiac because, according to legend:", q_tc: "根據傳說，貓沒有入選十二生肖的原因是：", q_sc: "根据传说，猫没有入选十二生肖的原因是：", o: ["The Rat tricked it and it missed the race", "Cats did not exist in ancient China", "The Jade Emperor disliked cats", "Cats refused to participate"], o_tc: ["老鼠騙了牠，牠錯過了比賽", "古代中國沒有貓", "玉皇大帝不喜歡貓", "貓拒絕參加"], o_sc: ["老鼠骗了它，它错过了比赛", "古代中国没有猫", "玉皇大帝不喜欢猫", "猫拒绝参加"], a: 0, e: "In the most popular version, the Rat promised to wake the Cat for the race but deliberately let it oversleep. This is why cats chase rats to this day.", e_tc: "在最廣為流傳的版本中，老鼠答應叫貓起床參加比賽，卻故意讓牠睡過了頭。這就是為什麼貓至今仍追著老鼠跑的原因。", e_sc: "在最广为流传的版本中，老鼠答应叫猫起床参加比赛，却故意让它睡过了头。这就是为什么猫至今仍追着老鼠跑的原因。" },
    { q: "2026 is the Year of the:", q_tc: "2026年的生肖是：", q_sc: "2026年的生肖是：", o: ["Horse", "Snake", "Goat", "Dragon"], o_tc: ["馬", "蛇", "羊", "龍"], o_sc: ["马", "蛇", "羊", "龙"], a: 0, e: "2026 is the Year of the Fire Horse (丙午年). The Fire Horse returns for the first time since 1966.", e_tc: "2026年是丙午年，即火馬年。這是自1966年以來火馬年首次到來。", e_sc: "2026年是丙午年，即火马年。这是自1966年以来火马年首次到来。" },
    { q: "Which zodiac animal is associated with longevity and wisdom?", q_tc: "哪個生肖動物與長壽和智慧相關聯？", q_sc: "哪个生肖动物与长寿和智慧相关联？", o: ["Snake", "Monkey", "Ox", "Rooster"], o_tc: ["蛇", "猴", "牛", "雞"], o_sc: ["蛇", "猴", "牛", "鸡"], a: 0, e: "The Snake (蛇) is associated with wisdom and longevity in Chinese culture. It is linked to the Earthly Branch 巳 (Sì) and the element of Fire.", e_tc: "蛇在中國文化中與智慧和長壽相關聯，對應地支巳，五行屬火。", e_sc: "蛇在中国文化中与智慧和长寿相关联，对应地支巳，五行属火。" },
    { q: "The 'Six Clashes' (六沖) in zodiac compatibility pair opposing animals. Which clashes with the Rat?", q_tc: "生肖相合中的「六沖」是指對立的生肖配對。哪個生肖與鼠相沖？", q_sc: "生肖相合中的\u201c六冲\u201d是指对立的生肖配对。哪个生肖与鼠相冲？", o: ["Horse", "Ox", "Tiger", "Rooster"], o_tc: ["馬", "牛", "虎", "雞"], o_sc: ["马", "牛", "虎", "鸡"], a: 0, e: "Rat (子) and Horse (午) are directly opposite in the zodiac wheel and form a clash (沖). Other clashes: Ox-Goat, Tiger-Monkey, Rabbit-Rooster, Dragon-Dog, Snake-Pig.", e_tc: "鼠（子）與馬（午）在生肖輪盤上直接對立，形成相沖。其他相沖組合：牛與羊、虎與猴、兔與雞、龍與狗、蛇與豬。", e_sc: "鼠（子）与马（午）在生肖轮盘上直接对立，形成相冲。其他相冲组合：牛与羊、虎与猴、兔与鸡、龙与狗、蛇与猪。" },

    // ===== WU XING / FIVE ELEMENTS (15) =====
    { q: "In the Wu Xing generating cycle, which element does Wood produce?", q_tc: "在五行相生的循環中，木生什麼？", q_sc: "在五行相生的循环中，木生什么？", o: ["Fire", "Water", "Metal", "Earth"], o_tc: ["火", "水", "金", "土"], o_sc: ["火", "水", "金", "土"], a: 0, e: "In the generating (相生) cycle: Wood feeds Fire, Fire creates Earth (ash), Earth bears Metal, Metal collects Water, Water nourishes Wood.", e_tc: "在相生循環中：木生火、火生土（灰燼化為土）、土生金、金生水、水生木。", e_sc: "在相生循环中：木生火、火生土（灰烬化为土）、土生金、金生水、水生木。" },
    { q: "Which element overcomes Water in Wu Xing theory?", q_tc: "在五行學說中，哪個元素克水？", q_sc: "在五行学说中，哪个元素克水？", o: ["Earth", "Fire", "Metal", "Wood"], o_tc: ["土", "火", "金", "木"], o_sc: ["土", "火", "金", "木"], a: 0, e: "Earth overcomes Water (土克水) — think of an earthen dam containing a river. This is from the overcoming (相克) cycle.", e_tc: "土克水——就像土壩攔住河水一樣。這來自五行相克的循環。", e_sc: "土克水——就像土坝拦住河水一样。这来自五行相克的循环。" },
    { q: "The five elements theory was systematised during which period?", q_tc: "五行學說是在哪個時期被系統化的？", q_sc: "五行学说是在哪个时期被系统化的？", o: ["Warring States", "Han Dynasty", "Shang Dynasty", "Tang Dynasty"], o_tc: ["戰國時期", "漢朝", "商朝", "唐朝"], o_sc: ["战国时期", "汉朝", "商朝", "唐朝"], a: 0, e: "Wu Xing theory was systematised during the Warring States period (475-221 BCE), notably by Zou Yan (鄒衍), though its roots extend earlier.", e_tc: "五行學說在戰國時期（公元前475-221年）被系統化，尤以鄒衍的貢獻最為突出，但其淵源可追溯至更早的時代。", e_sc: "五行学说在战国时期（公元前475-221年）被系统化，尤以邹衍的贡献最为突出，但其渊源可追溯至更早的时代。" },
    { q: "In Wu Xing, which element is associated with the colour black?", q_tc: "在五行中，哪個元素與黑色相對應？", q_sc: "在五行中，哪个元素与黑色相对应？", o: ["Water", "Metal", "Wood", "Earth"], o_tc: ["水", "金", "木", "土"], o_sc: ["水", "金", "木", "土"], a: 0, e: "Water (水) is associated with black (or dark blue), the north direction, winter, and the kidneys in traditional Chinese medicine.", e_tc: "水對應黑色（或深藍色）、北方、冬季，在中醫中則對應腎臟。", e_sc: "水对应黑色（或深蓝色）、北方、冬季，在中医中则对应肾脏。" },
    { q: "Which element is associated with the season of autumn?", q_tc: "哪個元素與秋季相對應？", q_sc: "哪个元素与秋季相对应？", o: ["Metal", "Water", "Earth", "Fire"], o_tc: ["金", "水", "土", "火"], o_sc: ["金", "水", "土", "火"], a: 0, e: "Metal (金) corresponds to autumn, the west direction, the colour white, and the lungs. It represents contraction and harvest.", e_tc: "金對應秋季、西方、白色以及肺臟，象徵收斂與收穫。", e_sc: "金对应秋季、西方、白色以及肺脏，象征收敛与收获。" },
    { q: "The 'generating' cycle in Wu Xing is called:", q_tc: "五行中的「生」的循環稱為：", q_sc: "五行中的\u201c生\u201d的循环称为：", o: ["相生 (Xiāngshēng)", "相克 (Xiāngkè)", "相合 (Xiānghé)", "相沖 (Xiāngchōng)"], o_tc: ["相生", "相克", "相合", "相沖"], o_sc: ["相生", "相克", "相合", "相冲"], a: 0, e: "相生 (Xiāngshēng) is the generating/nurturing cycle. 相克 (Xiāngkè) is the overcoming/controlling cycle. Together they maintain cosmic balance.", e_tc: "相生是滋生、養育的循環；相克是制約、克制的循環。兩者共同維持宇宙的平衡。", e_sc: "相生是滋生、养育的循环；相克是制约、克制的循环。两者共同维持宇宙的平衡。" },
    { q: "Which organ is associated with the Wood element in TCM?", q_tc: "在中醫理論中，木對應哪個臟器？", q_sc: "在中医理论中，木对应哪个脏器？", o: ["Liver", "Heart", "Lungs", "Kidneys"], o_tc: ["肝", "心", "肺", "腎"], o_sc: ["肝", "心", "肺", "肾"], a: 0, e: "Wood corresponds to the Liver (肝) and Gallbladder. Wood energy governs growth, planning, and the smooth flow of Qi through the body.", e_tc: "木對應肝與膽。木的能量主管生長、謀劃以及氣在體內的順暢流動。", e_sc: "木对应肝与胆。木的能量主管生长、谋划以及气在体内的顺畅流动。" },
    { q: "Earth (土) is associated with which direction?", q_tc: "土對應哪個方位？", q_sc: "土对应哪个方位？", o: ["Centre", "North", "East", "West"], o_tc: ["中央", "北方", "東方", "西方"], o_sc: ["中央", "北方", "东方", "西方"], a: 0, e: "Earth occupies the centre in Wu Xing cosmology. The other four elements correspond to cardinal directions: Wood-East, Fire-South, Metal-West, Water-North.", e_tc: "土在五行宇宙觀中居於中央。其餘四行對應四個方位：木為東、火為南、金為西、水為北。", e_sc: "土在五行宇宙观中居于中央。其余四行对应四个方位：木为东、火为南、金为西、水为北。" },
    { q: "Which element does Fire overcome?", q_tc: "火克哪個元素？", q_sc: "火克哪个元素？", o: ["Metal", "Wood", "Earth", "Water"], o_tc: ["金", "木", "土", "水"], o_sc: ["金", "木", "土", "水"], a: 0, e: "Fire overcomes Metal (火克金) — fire melts metal. In the overcoming cycle: Wood overcomes Earth, Earth overcomes Water, Water overcomes Fire, Fire overcomes Metal, Metal overcomes Wood.", e_tc: "火克金——火能熔化金屬。在相克循環中：木克土、土克水、水克火、火克金、金克木。", e_sc: "火克金——火能熔化金属。在相克循环中：木克土、土克水、水克火、火克金、金克木。" },
    { q: "The philosopher who systematised the Five Elements theory was:", q_tc: "將五行學說系統化的哲學家是：", q_sc: "将五行学说系统化的哲学家是：", o: ["Zou Yan (鄒衍)", "Confucius (孔子)", "Laozi (老子)", "Mozi (墨子)"], o_tc: ["鄒衍", "孔子", "老子", "墨子"], o_sc: ["邹衍", "孔子", "老子", "墨子"], a: 0, e: "Zou Yan (鄒衍, c. 305-240 BCE) of the Warring States period is credited with formalising Wu Xing into a comprehensive philosophical system.", e_tc: "戰國時期的鄒衍（約公元前305-240年）被認為是將五行學說整合為完整哲學體系的人。", e_sc: "战国时期的邹衍（约公元前305-240年）被认为是将五行学说整合为完整哲学体系的人。" },
    { q: "In Wu Xing, which element nourishes Earth?", q_tc: "在五行中，哪個元素生土？", q_sc: "在五行中，哪个元素生土？", o: ["Fire", "Metal", "Wood", "Water"], o_tc: ["火", "金", "木", "水"], o_sc: ["火", "金", "木", "水"], a: 0, e: "Fire generates Earth (火生土) — fire creates ash which becomes earth. This is part of the generating (相生) cycle.", e_tc: "火生土——火產生灰燼，灰燼化為土。這是相生循環的一部分。", e_sc: "火生土——火产生灰烬，灰烬化为土。这是相生循环的一部分。" },
    { q: "Which taste is associated with the Water element?", q_tc: "水對應哪種味道？", q_sc: "水对应哪种味道？", o: ["Salty", "Sour", "Bitter", "Sweet"], o_tc: ["鹹", "酸", "苦", "甘"], o_sc: ["咸", "酸", "苦", "甘"], a: 0, e: "Water corresponds to the salty taste. The five tastes: Wood-sour, Fire-bitter, Earth-sweet, Metal-pungent/spicy, Water-salty.", e_tc: "水對應鹹味。五味分別為：木為酸、火為苦、土為甘、金為辛、水為鹹。", e_sc: "水对应咸味。五味分别为：木为酸、火为苦、土为甘、金为辛、水为咸。" },
    { q: "The Heavenly Stem '甲' (Jiǎ) belongs to which element?", q_tc: "天干「甲」屬於哪個五行？", q_sc: "天干\u201c甲\u201d属于哪个五行？", o: ["Wood (Yang)", "Fire (Yang)", "Metal (Yang)", "Earth (Yang)"], o_tc: ["木（陽）", "火（陽）", "金（陽）", "土（陽）"], o_sc: ["木（阳）", "火（阳）", "金（阳）", "土（阳）"], a: 0, e: "甲 (Jiǎ) is Yang Wood, the first of the ten Heavenly Stems. The stems alternate Yin-Yang through the five elements: 甲乙=Wood, 丙丁=Fire, 戊己=Earth, 庚辛=Metal, 壬癸=Water.", e_tc: "甲為陽木，是十天干之首。天干按陰陽交替對應五行：甲乙為木、丙丁為火、戊己為土、庚辛為金、壬癸為水。", e_sc: "甲为阳木，是十天干之首。天干按阴阳交替对应五行：甲乙为木、丙丁为火、戊己为土、庚辛为金、壬癸为水。" },
    { q: "Which planet corresponds to the Metal element?", q_tc: "哪顆行星對應金？", q_sc: "哪颗行星对应金？", o: ["Venus (金星)", "Mars (火星)", "Jupiter (木星)", "Mercury (水星)"], o_tc: ["金星", "火星", "木星", "水星"], o_sc: ["金星", "火星", "木星", "水星"], a: 0, e: "Venus is 金星 (Jīnxīng, 'Metal Star'). The five visible planets each correspond to an element: Jupiter-Wood, Mars-Fire, Saturn-Earth, Venus-Metal, Mercury-Water.", e_tc: "金星即「金之星」。五顆肉眼可見的行星各對應一行：木星為木、火星為火、土星為土、金星為金、水星為水。", e_sc: "金星即\u201c金之星\u201d。五颗肉眼可见的行星各对应一行：木星为木、火星为火、土星为土、金星为金、水星为水。" },
    { q: "Earth's associated emotion in Wu Xing is:", q_tc: "五行中土對應的情志是：", q_sc: "五行中土对应的情志是：", o: ["Worry/Pensiveness", "Anger", "Joy", "Grief"], o_tc: ["思（憂思）", "怒", "喜", "悲"], o_sc: ["思（忧思）", "怒", "喜", "悲"], a: 0, e: "Earth corresponds to worry/pensiveness (思). The five emotions: Wood-anger (怒), Fire-joy (喜), Earth-worry (思), Metal-grief (悲), Water-fear (恐).", e_tc: "土對應憂思。五志分別為：木為怒、火為喜、土為思、金為悲、水為恐。", e_sc: "土对应忧思。五志分别为：木为怒、火为喜、土为思、金为悲、水为恐。" },
    // ===== DYNASTIES (25) =====
    { q: "Which dynasty is credited with unifying China's writing system, weights, and measures?", q_tc: "哪個朝代統一了中國的文字、度量衡？", q_sc: "哪个朝代统一了中国的文字、度量衡？", o: ["Qin Dynasty", "Han Dynasty", "Zhou Dynasty", "Shang Dynasty"], o_tc: ["秦朝", "漢朝", "周朝", "商朝"], o_sc: ["秦朝", "汉朝", "周朝", "商朝"], a: 0, e: "The Qin Dynasty (221-206 BCE) under Qin Shi Huang standardised Chinese script, measurements, currency, and road widths across the newly unified empire.", e_tc: "秦朝（公元前221-206年）在秦始皇統治下，統一了全國的文字、度量衡、貨幣和車軌寬度。", e_sc: "秦朝（公元前221-206年）在秦始皇统治下，统一了全国的文字、度量衡、货币和车轨宽度。" },
    { q: "During which dynasty did the Silk Road trade routes first flourish?", q_tc: "絲綢之路的貿易路線最早在哪個朝代興盛？", q_sc: "丝绸之路的贸易路线最早在哪个朝代兴盛？", o: ["Han Dynasty", "Tang Dynasty", "Song Dynasty", "Qin Dynasty"], o_tc: ["漢朝", "唐朝", "宋朝", "秦朝"], o_sc: ["汉朝", "唐朝", "宋朝", "秦朝"], a: 0, e: "The Han Dynasty (206 BCE-220 CE) established the Silk Road after Zhang Qian's diplomatic missions to Central Asia opened trade routes westward.", e_tc: "漢朝（公元前206年-公元220年）在張騫出使西域後開通了絲綢之路，打開了通往中亞的貿易路線。", e_sc: "汉朝（公元前206年-公元220年）在张骞出使西域后开通了丝绸之路，打开了通往中亚的贸易路线。" },
    { q: "The Tang Dynasty capital Chang'an was the world's largest city. Which modern city occupies its site?", q_tc: "唐朝首都長安曾是世界上最大的城市，現今哪座城市位於其遺址上？", q_sc: "唐朝首都长安曾是世界上最大的城市，现今哪座城市位于其遗址上？", o: ["Xi'an", "Beijing", "Luoyang", "Nanjing"], o_tc: ["西安", "北京", "洛陽", "南京"], o_sc: ["西安", "北京", "洛阳", "南京"], a: 0, e: "Chang'an, capital of the Tang Dynasty, corresponds to modern Xi'an in Shaanxi province. At its peak it had over one million residents.", e_tc: "唐朝首都長安即今日陝西省的西安，鼎盛時期人口超過百萬。", e_sc: "唐朝首都长安即今日陕西省的西安，鼎盛时期人口超过百万。" },
    { q: "Which dynasty invented movable-type printing?", q_tc: "活字印刷術是在哪個朝代發明的？", q_sc: "活字印刷术是在哪个朝代发明的？", o: ["Song Dynasty", "Tang Dynasty", "Han Dynasty", "Ming Dynasty"], o_tc: ["宋朝", "唐朝", "漢朝", "明朝"], o_sc: ["宋朝", "唐朝", "汉朝", "明朝"], a: 0, e: "Bi Sheng (畢昇) invented movable ceramic type during the Northern Song Dynasty (around 1040 CE), centuries before Gutenberg.", e_tc: "畢昇在北宋時期（約1040年）發明了膠泥活字印刷術，比古騰堡早了幾百年。", e_sc: "毕昇在北宋时期（约1040年）发明了胶泥活字印刷术，比古腾堡早了几百年。" },
    { q: "Oracle bone script, the earliest known Chinese writing, dates from which dynasty?", q_tc: "甲骨文是已知最早的中國文字，起源於哪個朝代？", q_sc: "甲骨文是已知最早的中国文字，起源于哪个朝代？", o: ["Shang Dynasty", "Xia Dynasty", "Zhou Dynasty", "Qin Dynasty"], o_tc: ["商朝", "夏朝", "周朝", "秦朝"], o_sc: ["商朝", "夏朝", "周朝", "秦朝"], a: 0, e: "Oracle bone inscriptions (甲骨文) from the Shang Dynasty (c. 1600-1046 BCE) are the earliest verified Chinese writing, used for divination.", e_tc: "商朝（約公元前1600-1046年）的甲骨文是目前已證實最早的中國文字，用於占卜。", e_sc: "商朝（约公元前1600-1046年）的甲骨文是目前已证实最早的中国文字，用于占卜。" },
    { q: "The Three Kingdoms period followed the collapse of which dynasty?", q_tc: "三國時期是在哪個朝代滅亡後出現的？", q_sc: "三国时期是在哪个朝代灭亡后出现的？", o: ["Han Dynasty", "Qin Dynasty", "Jin Dynasty", "Sui Dynasty"], o_tc: ["漢朝", "秦朝", "晉朝", "隋朝"], o_sc: ["汉朝", "秦朝", "晋朝", "隋朝"], a: 0, e: "The Three Kingdoms (220-280 CE) — Wei, Shu, and Wu — emerged from the collapse of the Eastern Han Dynasty. This era inspired the classic novel Romance of the Three Kingdoms.", e_tc: "三國（220-280年）——魏、蜀、吳——在東漢滅亡後崛起，這段歷史啟發了經典小說《三國演義》。", e_sc: "三国（220-280年）——魏、蜀、吴——在东汉灭亡后崛起，这段历史启发了经典小说《三国演义》。" },
    { q: "Which dynasty built the majority of the Great Wall as it stands today?", q_tc: "現存的萬里長城大部分是哪個朝代修建的？", q_sc: "现存的万里长城大部分是哪个朝代修建的？", o: ["Ming Dynasty", "Qin Dynasty", "Han Dynasty", "Song Dynasty"], o_tc: ["明朝", "秦朝", "漢朝", "宋朝"], o_sc: ["明朝", "秦朝", "汉朝", "宋朝"], a: 0, e: "While Qin Shi Huang initiated the Great Wall, the iconic stone-and-brick wall we see today was primarily built during the Ming Dynasty (1368-1644).", e_tc: "雖然秦始皇最早修築長城，但我們今天看到的磚石長城主要是明朝（1368-1644年）修建的。", e_sc: "虽然秦始皇最早修筑长城，但我们今天看到的砖石长城主要是明朝（1368-1644年）修建的。" },
    { q: "The Sui Dynasty is best known for constructing:", q_tc: "隋朝最著名的建設成就是：", q_sc: "隋朝最著名的建设成就是：", o: ["The Grand Canal", "The Great Wall", "The Forbidden City", "The Terracotta Army"], o_tc: ["大運河", "萬里長城", "紫禁城", "兵馬俑"], o_sc: ["大运河", "万里长城", "紫禁城", "兵马俑"], a: 0, e: "The Sui Dynasty (581-618) built the Grand Canal (大運河), linking the Yellow River to the Yangtze — the world's longest artificial waterway at over 1,700 km.", e_tc: "隋朝（581-618年）開鑿了大運河，連接黃河與長江，全長超過1,700公里，是世界上最長的人工水道。", e_sc: "隋朝（581-618年）开凿了大运河，连接黄河与长江，全长超过1,700公里，是世界上最长的人工水道。" },
    { q: "Which dynasty saw the invention of paper?", q_tc: "造紙術是在哪個朝代發明的？", q_sc: "造纸术是在哪个朝代发明的？", o: ["Han Dynasty", "Shang Dynasty", "Tang Dynasty", "Song Dynasty"], o_tc: ["漢朝", "商朝", "唐朝", "宋朝"], o_sc: ["汉朝", "商朝", "唐朝", "宋朝"], a: 0, e: "Cai Lun (蔡倫) is traditionally credited with improving papermaking during the Eastern Han Dynasty (around 105 CE), though archaeological evidence suggests earlier origins.", e_tc: "蔡倫被認為在東漢時期（約公元105年）改良了造紙術，但考古證據顯示造紙的起源可能更早。", e_sc: "蔡伦被认为在东汉时期（约公元105年）改良了造纸术，但考古证据显示造纸的起源可能更早。" },
    { q: "The Forbidden City was built during which dynasty?", q_tc: "紫禁城是在哪個朝代建造的？", q_sc: "紫禁城是在哪个朝代建造的？", o: ["Ming Dynasty", "Qing Dynasty", "Yuan Dynasty", "Song Dynasty"], o_tc: ["明朝", "清朝", "元朝", "宋朝"], o_sc: ["明朝", "清朝", "元朝", "宋朝"], a: 0, e: "The Forbidden City (紫禁城) was built from 1406-1420 under the Yongle Emperor of the Ming Dynasty. It served as the imperial palace for 24 emperors across Ming and Qing.", e_tc: "紫禁城於1406至1420年間在明朝永樂帝時期建成，先後作為明、清兩朝共24位皇帝的皇宮。", e_sc: "紫禁城于1406至1420年间在明朝永乐帝时期建成，先后作为明、清两朝共24位皇帝的皇宫。" },
    { q: "Which dynasty established the imperial examination system (科舉)?", q_tc: "科舉制度是哪個朝代創立的？", q_sc: "科举制度是哪个朝代创立的？", o: ["Sui Dynasty", "Tang Dynasty", "Han Dynasty", "Song Dynasty"], o_tc: ["隋朝", "唐朝", "漢朝", "宋朝"], o_sc: ["隋朝", "唐朝", "汉朝", "宋朝"], a: 0, e: "The Sui Dynasty (581-618) formally established the imperial examination (科舉) system. The Tang Dynasty expanded it, and it reached its peak under the Song.", e_tc: "隋朝（581-618年）正式創立了科舉制度，唐朝加以擴展，至宋朝達到鼎盛。", e_sc: "隋朝（581-618年）正式创立了科举制度，唐朝加以扩展，至宋朝达到鼎盛。" },
    { q: "The Yuan Dynasty was founded by:", q_tc: "元朝的建立者是：", q_sc: "元朝的建立者是：", o: ["Kublai Khan", "Genghis Khan", "Tamerlane", "Attila"], o_tc: ["忽必烈", "成吉思汗", "帖木兒", "阿提拉"], o_sc: ["忽必烈", "成吉思汗", "帖木儿", "阿提拉"], a: 0, e: "Kublai Khan (忽必烈), grandson of Genghis Khan, established the Yuan Dynasty (1271-1368). It was the first non-Han dynasty to rule all of China.", e_tc: "忽必烈是成吉思汗的孫子，他建立了元朝（1271-1368年），這是第一個統治全中國的非漢族朝代。", e_sc: "忽必烈是成吉思汗的孙子，他建立了元朝（1271-1368年），这是第一个统治全中国的非汉族朝代。" },
    { q: "Which period is known as the 'Golden Age' of Chinese poetry?", q_tc: "哪個朝代被譽為中國詩歌的「黃金時代」？", q_sc: "哪个朝代被誉为中国诗歌的「黄金时代」？", o: ["Tang Dynasty", "Song Dynasty", "Han Dynasty", "Ming Dynasty"], o_tc: ["唐朝", "宋朝", "漢朝", "明朝"], o_sc: ["唐朝", "宋朝", "汉朝", "明朝"], a: 0, e: "The Tang Dynasty (618-907) is considered the Golden Age of Chinese poetry. It produced legendary poets like Li Bai (李白), Du Fu (杜甫), and Wang Wei (王維).", e_tc: "唐朝（618-907年）被認為是中國詩歌的黃金時代，誕生了李白、杜甫、王維等傳奇詩人。", e_sc: "唐朝（618-907年）被认为是中国诗歌的黄金时代，诞生了李白、杜甫、王维等传奇诗人。" },
    { q: "The Song Dynasty is renowned for advances in:", q_tc: "宋朝以哪方面的進步而聞名？", q_sc: "宋朝以哪方面的进步而闻名？", o: ["Commerce, technology, and maritime trade", "Military conquest", "Great Wall construction", "Terracotta manufacturing"], o_tc: ["商業、科技與海上貿易", "軍事征服", "長城修建", "陶俑製造"], o_sc: ["商业、科技与海上贸易", "军事征服", "长城修建", "陶俑制造"], a: 0, e: "The Song Dynasty (960-1279) saw breakthroughs in printing, gunpowder, the compass, paper money, and maritime trade. It was economically the most advanced civilisation of its time.", e_tc: "宋朝（960-1279年）在印刷術、火藥、指南針、紙幣和海上貿易方面取得了重大突破，是當時經濟最發達的文明。", e_sc: "宋朝（960-1279年）在印刷术、火药、指南针、纸币和海上贸易方面取得了重大突破，是当时经济最发达的文明。" },
    { q: "Which dynasty's fall is traditionally dated to 1046 BCE with the Battle of Muye?", q_tc: "哪個朝代的滅亡傳統上以公元前1046年的牧野之戰為標誌？", q_sc: "哪个朝代的灭亡传统上以公元前1046年的牧野之战为标志？", o: ["Shang Dynasty", "Xia Dynasty", "Zhou Dynasty", "Qin Dynasty"], o_tc: ["商朝", "夏朝", "周朝", "秦朝"], o_sc: ["商朝", "夏朝", "周朝", "秦朝"], a: 0, e: "The Battle of Muye (牧野之戰) in 1046 BCE saw King Wu of Zhou defeat the last Shang king, establishing the Zhou Dynasty.", e_tc: "公元前1046年的牧野之戰中，周武王擊敗了商朝末代君主，建立了周朝。", e_sc: "公元前1046年的牧野之战中，周武王击败了商朝末代君主，建立了周朝。" },
    { q: "The 'Warring States' period (戰國) lasted approximately how long?", q_tc: "戰國時期大約持續了多長時間？", q_sc: "战国时期大约持续了多长时间？", o: ["250 years", "100 years", "500 years", "50 years"], o_tc: ["250年", "100年", "500年", "50年"], o_sc: ["250年", "100年", "500年", "50年"], a: 0, e: "The Warring States period lasted from about 475-221 BCE (~254 years), ending when the Qin state conquered all rivals to unify China.", e_tc: "戰國時期從約公元前475年持續到公元前221年（約254年），以秦國統一六國告終。", e_sc: "战国时期从约公元前475年持续到公元前221年（约254年），以秦国统一六国告终。" },
    { q: "Which dynasty created the Terracotta Army?", q_tc: "兵馬俑是哪個朝代製造的？", q_sc: "兵马俑是哪个朝代制造的？", o: ["Qin Dynasty", "Han Dynasty", "Shang Dynasty", "Zhou Dynasty"], o_tc: ["秦朝", "漢朝", "商朝", "周朝"], o_sc: ["秦朝", "汉朝", "商朝", "周朝"], a: 0, e: "The Terracotta Army was created for Qin Shi Huang (秦始皇), first emperor of the Qin Dynasty, to protect him in the afterlife. Estimated 8,000+ figures.", e_tc: "兵馬俑是為秦朝始皇帝秦始皇製作的陪葬品，用以在來世護衛他，估計有八千多個陶俑。", e_sc: "兵马俑是为秦朝始皇帝秦始皇制作的陪葬品，用以在来世护卫他，估计有八千多个陶俑。" },
    { q: "Paper money was first used as currency during which dynasty?", q_tc: "紙幣最早在哪個朝代被用作貨幣？", q_sc: "纸币最早在哪个朝代被用作货币？", o: ["Song Dynasty", "Tang Dynasty", "Ming Dynasty", "Yuan Dynasty"], o_tc: ["宋朝", "唐朝", "明朝", "元朝"], o_sc: ["宋朝", "唐朝", "明朝", "元朝"], a: 0, e: "The Song Dynasty introduced 交子 (jiāozi), the world's first government-issued paper money, in Sichuan around 1024 CE.", e_tc: "宋朝於約1024年在四川發行了交子，這是世界上最早由政府發行的紙幣。", e_sc: "宋朝于约1024年在四川发行了交子，这是世界上最早由政府发行的纸币。" },
    { q: "The Mandate of Heaven (天命) concept originated in which dynasty?", q_tc: "「天命」的概念起源於哪個朝代？", q_sc: "「天命」的概念起源于哪个朝代？", o: ["Zhou Dynasty", "Shang Dynasty", "Qin Dynasty", "Han Dynasty"], o_tc: ["周朝", "商朝", "秦朝", "漢朝"], o_sc: ["周朝", "商朝", "秦朝", "汉朝"], a: 0, e: "The Zhou Dynasty developed the Mandate of Heaven (天命) to justify their overthrow of the Shang. It held that Heaven grants authority to virtuous rulers and revokes it from tyrants.", e_tc: "周朝提出了「天命」的概念來為推翻商朝正名，認為上天會將統治權授予有德之君，並從暴君手中收回。", e_sc: "周朝提出了「天命」的概念来为推翻商朝正名，认为上天会将统治权授予有德之君，并从暴君手中收回。" },
    { q: "Zheng He's maritime expeditions occurred during which dynasty?", q_tc: "鄭和下西洋發生在哪個朝代？", q_sc: "郑和下西洋发生在哪个朝代？", o: ["Ming Dynasty", "Song Dynasty", "Yuan Dynasty", "Tang Dynasty"], o_tc: ["明朝", "宋朝", "元朝", "唐朝"], o_sc: ["明朝", "宋朝", "元朝", "唐朝"], a: 0, e: "Admiral Zheng He (鄭和) led seven voyages (1405-1433) under the Ming Dynasty's Yongle Emperor, reaching Southeast Asia, India, Arabia, and East Africa.", e_tc: "鄭和在明朝永樂帝時期率領了七次遠航（1405-1433年），到達東南亞、印度、阿拉伯和東非。", e_sc: "郑和在明朝永乐帝时期率领了七次远航（1405-1433年），到达东南亚、印度、阿拉伯和东非。" },
    { q: "The 'Spring and Autumn' period (春秋) is named after:", q_tc: "「春秋」時期的名稱來自於：", q_sc: "「春秋」时期的名称来自于：", o: ["A historical chronicle attributed to Confucius", "The two seasons of farming", "A style of poetry", "A type of calendar"], o_tc: ["相傳由孔子編撰的一部史書", "兩個農耕季節", "一種詩歌風格", "一種曆法"], o_sc: ["相传由孔子编撰的一部史书", "两个农耕季节", "一种诗歌风格", "一种历法"], a: 0, e: "The Spring and Autumn period (770-476 BCE) is named after the Spring and Autumn Annals (《春秋》), a chronicle of the state of Lu attributed to Confucius.", e_tc: "春秋時期（公元前770-476年）得名於《春秋》，這是一部記載魯國歷史的編年史，相傳由孔子編撰。", e_sc: "春秋时期（公元前770-476年）得名于《春秋》，这是一部记载鲁国历史的编年史，相传由孔子编撰。" },
    { q: "Which dynasty saw China's population first exceed 100 million?", q_tc: "中國人口最早在哪個朝代突破一億？", q_sc: "中国人口最早在哪个朝代突破一亿？", o: ["Song Dynasty", "Tang Dynasty", "Ming Dynasty", "Han Dynasty"], o_tc: ["宋朝", "唐朝", "明朝", "漢朝"], o_sc: ["宋朝", "唐朝", "明朝", "汉朝"], a: 0, e: "China's population first exceeded 100 million during the Northern Song Dynasty (around 1100 CE), driven by agricultural innovations like improved rice strains.", e_tc: "中國人口在北宋時期（約1100年）首次突破一億，這得益於改良稻種等農業創新。", e_sc: "中国人口在北宋时期（约1100年）首次突破一亿，这得益于改良稻种等农业创新。" },
    { q: "The 'Four Great Inventions' of ancient China are paper, printing, gunpowder, and:", q_tc: "中國古代「四大發明」是造紙術、印刷術、火藥和：", q_sc: "中国古代「四大发明」是造纸术、印刷术、火药和：", o: ["The compass", "Silk", "Porcelain", "The abacus"], o_tc: ["指南針", "絲綢", "瓷器", "算盤"], o_sc: ["指南针", "丝绸", "瓷器", "算盘"], a: 0, e: "The Four Great Inventions (四大發明) are papermaking, printing, gunpowder, and the compass. This concept was popularised by Joseph Needham in his study of Chinese science.", e_tc: "四大發明是造紙術、印刷術、火藥和指南針。這一概念由李約瑟在研究中國科學時推廣開來。", e_sc: "四大发明是造纸术、印刷术、火药和指南针。这一概念由李约瑟在研究中国科学时推广开来。" },
    { q: "Which period saw Confucius, Laozi, Mozi, and other great thinkers flourish simultaneously?", q_tc: "孔子、老子、墨子等偉大思想家同時活躍於哪個時期？", q_sc: "孔子、老子、墨子等伟大思想家同时活跃于哪个时期？", o: ["Spring and Autumn / Warring States", "Han Dynasty", "Tang Dynasty", "Song Dynasty"], o_tc: ["春秋戰國時期", "漢朝", "唐朝", "宋朝"], o_sc: ["春秋战国时期", "汉朝", "唐朝", "宋朝"], a: 0, e: "The 'Hundred Schools of Thought' (百家爭鳴) flourished during the Spring and Autumn and Warring States periods (770-221 BCE), producing Confucianism, Daoism, Legalism, Mohism, and more.", e_tc: "「百家爭鳴」興盛於春秋戰國時期（公元前770-221年），產生了儒家、道家、法家、墨家等各家學說。", e_sc: "「百家争鸣」兴盛于春秋战国时期（公元前770-221年），产生了儒家、道家、法家、墨家等各家学说。" },
    { q: "Which dynasty first used bronze vessels extensively for rituals?", q_tc: "哪個朝代最早大量使用青銅器進行祭祀？", q_sc: "哪个朝代最早大量使用青铜器进行祭祀？", o: ["Shang Dynasty", "Zhou Dynasty", "Xia Dynasty", "Qin Dynasty"], o_tc: ["商朝", "周朝", "夏朝", "秦朝"], o_sc: ["商朝", "周朝", "夏朝", "秦朝"], a: 0, e: "The Shang Dynasty (c. 1600-1046 BCE) produced elaborate bronze ritual vessels (青銅器) for ancestor worship. Shang bronzes are among the finest ever made.", e_tc: "商朝（約公元前1600-1046年）製作了精美的青銅禮器用於祭祀祖先，商朝青銅器堪稱古代青銅工藝的巔峰之作。", e_sc: "商朝（约公元前1600-1046年）制作了精美的青铜礼器用于祭祀祖先，商朝青铜器堪称古代青铜工艺的巅峰之作。" },

    // ===== CALENDAR & ASTRONOMY (18) =====
    { q: "How many Heavenly Stems (天干) are there?", q_tc: "天干共有幾個？", q_sc: "天干共有几个？", o: ["10", "12", "8", "5"], o_tc: ["10個", "12個", "8個", "5個"], o_sc: ["10个", "12个", "8个", "5个"], a: 0, e: "There are 10 Heavenly Stems (甲乙丙丁戊己庚辛壬癸), each associated with a Yin or Yang aspect of the five elements.", e_tc: "天干共有十個（甲乙丙丁戊己庚辛壬癸），每個對應五行中一個元素的陰或陽面。", e_sc: "天干共有十个（甲乙丙丁戊己庚辛壬癸），每个对应五行中一个元素的阴或阳面。" },
    { q: "How many solar terms (節氣) divide the Chinese agricultural year?", q_tc: "中國農曆年共分為多少個節氣？", q_sc: "中国农历年共分为多少个节气？", o: ["24", "12", "36", "48"], o_tc: ["24個", "12個", "36個", "48個"], o_sc: ["24个", "12个", "36个", "48个"], a: 0, e: "The 24 solar terms (二十四節氣) divide the year based on the sun's position along the ecliptic. They were formalised during the Han Dynasty.", e_tc: "二十四節氣根據太陽在黃道上的位置劃分一年，於漢朝正式確立。", e_sc: "二十四节气根据太阳在黄道上的位置划分一年，于汉朝正式确立。" },
    { q: "The Taosi archaeological site in Shanxi contained what world-first astronomical feature?", q_tc: "山西陶寺遺址包含了什麼世界首創的天文設施？", q_sc: "山西陶寺遗址包含了什么世界首创的天文设施？", o: ["Large-scale observatory with gnomon", "Star chart carved in jade", "Bronze armillary sphere", "Solar eclipse record"], o_tc: ["大型圭表觀象台", "玉石星圖", "青銅渾天儀", "日食記錄"], o_sc: ["大型圭表观象台", "玉石星图", "青铜浑天仪", "日食记录"], a: 0, e: "Taosi (陶寺, c. 2300-1900 BCE) contained a gnomon (圭表) observatory — one of the world's earliest large-scale facilities for measuring solar positions.", e_tc: "陶寺（約公元前2300-1900年）設有圭表觀象台，是世界上最早的大型太陽位置測量設施之一。", e_sc: "陶寺（约公元前2300-1900年）设有圭表观象台，是世界上最早的大型太阳位置测量设施之一。" },
    { q: "What solar term marks the beginning of spring in the Chinese calendar?", q_tc: "中國曆法中哪個節氣標誌著春天的開始？", q_sc: "中国历法中哪个节气标志着春天的开始？", o: ["立春 (Lìchūn)", "春分 (Chūnfēn)", "雨水 (Yǔshuǐ)", "驚蟄 (Jīngzhé)"], o_tc: ["立春", "春分", "雨水", "驚蟄"], o_sc: ["立春", "春分", "雨水", "惊蛰"], a: 0, e: "立春 (Lìchūn, 'Start of Spring') usually falls around February 3-5. It marks the beginning of the solar year and the first of 24 solar terms.", e_tc: "立春通常在2月3日至5日之間，標誌著太陽年的開始，也是二十四節氣中的第一個。", e_sc: "立春通常在2月3日至5日之间，标志着太阳年的开始，也是二十四节气中的第一个。" },
    { q: "The Chinese calendar is best described as:", q_tc: "中國曆法最準確的描述是：", q_sc: "中国历法最准确的描述是：", o: ["Lunisolar", "Purely lunar", "Purely solar", "Sidereal"], o_tc: ["陰陽曆（農曆）", "純陰曆", "純陽曆", "恆星曆"], o_sc: ["阴阳历（农历）", "纯阴历", "纯阳历", "恒星历"], a: 0, e: "The Chinese calendar is lunisolar (陰陽曆) — months follow the moon's phases while the year aligns with the solar cycle through intercalary months.", e_tc: "中國曆法屬於陰陽曆——月份依據月亮的盈虧變化，而年份則透過閏月與太陽週期保持一致。", e_sc: "中国历法属于阴阳历——月份依据月亮的盈亏变化，而年份则通过闰月与太阳周期保持一致。" },
    { q: "An intercalary month (閏月) is added to the Chinese calendar roughly every:", q_tc: "中國曆法大約每隔多久加入一個閏月？", q_sc: "中国历法大约每隔多久加入一个闰月？", o: ["3 years", "2 years", "5 years", "4 years"], o_tc: ["3年", "2年", "5年", "4年"], o_sc: ["3年", "2年", "5年", "4年"], a: 0, e: "An intercalary (leap) month is added approximately every 2-3 years (7 times in 19 years, following the Metonic cycle) to keep the lunisolar calendar aligned with the seasons.", e_tc: "閏月大約每2至3年加入一次（19年中加7次，遵循默冬章），以使陰陽曆與季節保持同步。", e_sc: "闰月大约每2至3年加入一次（19年中加7次，遵循默冬章），以使阴阳历与季节保持同步。" },
    { q: "Which Heavenly Stem is '丙' (Bǐng)?", q_tc: "天干「丙」對應的是什麼？", q_sc: "天干「丙」对应的是什么？", o: ["Yang Fire", "Yang Wood", "Yang Metal", "Yang Water"], o_tc: ["陽火", "陽木", "陽金", "陽水"], o_sc: ["阳火", "阳木", "阳金", "阳水"], a: 0, e: "丙 (Bǐng) is Yang Fire, the third Heavenly Stem. In 2026, the stem is 丙 and the branch is 午 (Horse), making it a Fire Horse year (丙午).", e_tc: "丙為陽火，是第三個天干。2026年天干為丙、地支為午（馬），因此是丙午火馬年。", e_sc: "丙为阳火，是第三个天干。2026年天干为丙、地支为午（马），因此是丙午火马年。" },
    { q: "The Dunhuang star chart, one of the world's oldest complete star maps, dates from the:", q_tc: "敦煌星圖是世界上最古老的完整星圖之一，繪製於：", q_sc: "敦煌星图是世界上最古老的完整星图之一，绘制于：", o: ["Tang Dynasty", "Han Dynasty", "Song Dynasty", "Ming Dynasty"], o_tc: ["唐朝", "漢朝", "宋朝", "明朝"], o_sc: ["唐朝", "汉朝", "宋朝", "明朝"], a: 0, e: "The Dunhuang star chart (敦煌星圖) dates from the Tang Dynasty (c. 700 CE). It maps over 1,300 stars in 257 asterisms.", e_tc: "敦煌星圖繪製於唐朝（約公元700年），記錄了257個星官中的1,300多顆恆星。", e_sc: "敦煌星图绘制于唐朝（约公元700年），记录了257个星官中的1,300多颗恒星。" },
    { q: "What is the first Earthly Branch?", q_tc: "十二地支中排第一的是什麼？", q_sc: "十二地支中排第一的是什么？", o: ["子 (Zǐ)", "丑 (Chǒu)", "寅 (Yín)", "甲 (Jiǎ)"], o_tc: ["子", "丑", "寅", "甲"], o_sc: ["子", "丑", "寅", "甲"], a: 0, e: "子 (Zǐ) is the first Earthly Branch, associated with the Rat, midnight, and the north direction. Note: 甲 (Jiǎ) is a Heavenly Stem, not a Branch.", e_tc: "子是第一個地支，對應生肖鼠、子時（午夜）和北方。注意：甲是天干，不是地支。", e_sc: "子是第一个地支，对应生肖鼠、子时（午夜）和北方。注意：甲是天干，不是地支。" },
    { q: "The winter solstice solar term is called:", q_tc: "冬至節氣的名稱是：", q_sc: "冬至节气的名称是：", o: ["冬至 (Dōngzhì)", "大寒 (Dàhán)", "小雪 (Xiǎoxuě)", "立冬 (Lìdōng)"], o_tc: ["冬至", "大寒", "小雪", "立冬"], o_sc: ["冬至", "大寒", "小雪", "立冬"], a: 0, e: "冬至 (Dōngzhì, 'Winter Extreme') marks the shortest day. It was historically as important as New Year, with family gatherings and eating tangyuan (湯圓).", e_tc: "冬至是一年中白晝最短的一天。歷史上冬至的重要性不亞於新年，家人團聚並吃湯圓。", e_sc: "冬至是一年中白昼最短的一天。历史上冬至的重要性不亚于新年，家人团聚并吃汤圆。" },
    { q: "The Shoushi Calendar (授時曆), remarkably accurate for its era, was created during:", q_tc: "《授時曆》在其時代極為精確，創制於：", q_sc: "《授时历》在其时代极为精确，创制于：", o: ["Yuan Dynasty", "Song Dynasty", "Ming Dynasty", "Tang Dynasty"], o_tc: ["元朝", "宋朝", "明朝", "唐朝"], o_sc: ["元朝", "宋朝", "明朝", "唐朝"], a: 0, e: "The Shoushi Calendar was created by Guo Shoujing (郭守敬) in 1281 during the Yuan Dynasty. It calculated the tropical year to 365.2425 days — the same as the Gregorian calendar, 300 years earlier.", e_tc: "《授時曆》由郭守敬於1281年元朝時期編制，計算出回歸年為365.2425天——與格里曆相同，但早了三百年。", e_sc: "《授时历》由郭守敬于1281年元朝时期编制，计算出回归年为365.2425天——与格里历相同，但早了三百年。" },
    { q: "How many Earthly Branches (地支) exist?", q_tc: "地支共有幾個？", q_sc: "地支共有几个？", o: ["12", "10", "8", "24"], o_tc: ["12個", "10個", "8個", "24個"], o_sc: ["12个", "10个", "8个", "24个"], a: 0, e: "There are 12 Earthly Branches (子丑寅卯辰巳午未申酉戌亥), each paired with a zodiac animal, a compass direction, and a two-hour period.", e_tc: "地支共有十二個（子丑寅卯辰巳午未申酉戌亥），每個對應一個生肖動物、一個方位和一個時辰。", e_sc: "地支共有十二个（子丑寅卯辰巳午未申酉戌亥），每个对应一个生肖动物、一个方位和一个时辰。" },
    { q: "The solar term '清明' (Qīngmíng) is associated with:", q_tc: "節氣「清明」與什麼活動有關？", q_sc: "节气「清明」与什么活动有关？", o: ["Tomb-sweeping and ancestor veneration", "The autumn harvest", "Planting rice", "Dragon boat races"], o_tc: ["掃墓祭祖", "秋收", "插秧", "龍舟競渡"], o_sc: ["扫墓祭祖", "秋收", "插秧", "龙舟竞渡"], a: 0, e: "清明 (Qīngmíng, 'Pure Brightness') falls around April 4-5. It is the day for sweeping ancestral tombs and has been observed since the Zhou Dynasty.", e_tc: "清明通常在4月4日至5日，是掃墓祭祖的日子，自周朝以來一直沿襲至今。", e_sc: "清明通常在4月4日至5日，是扫墓祭祖的日子，自周朝以来一直沿袭至今。" },
    { q: "Chinese months traditionally begin on:", q_tc: "中國傳統月份從哪一天開始？", q_sc: "中国传统月份从哪一天开始？", o: ["The new moon (朔)", "The full moon (望)", "The first quarter moon", "The spring equinox"], o_tc: ["朔日（新月）", "望日（滿月）", "上弦月", "春分"], o_sc: ["朔日（新月）", "望日（满月）", "上弦月", "春分"], a: 0, e: "Each Chinese month starts on the day of the new moon (朔 shuò). The full moon (望 wàng) typically falls on the 15th. This is why the Mid-Autumn Festival is on the 15th day of the 8th month.", e_tc: "每個中國月份從朔日（新月）開始，望日（滿月）通常在十五。這就是中秋節定在八月十五的原因。", e_sc: "每个中国月份从朔日（新月）开始，望日（满月）通常在十五。这就是中秋节定在八月十五的原因。" },
    { q: "The ancient Chinese divided the sky into how many 'lunar mansions' (宿)?", q_tc: "古代中國將天空劃分為多少個星宿？", q_sc: "古代中国将天空划分为多少个星宿？", o: ["28", "24", "12", "36"], o_tc: ["28個", "24個", "12個", "36個"], o_sc: ["28个", "24个", "12个", "36个"], a: 0, e: "The 28 lunar mansions (二十八宿) are sections of the sky through which the moon passes. They were grouped into four directional quadrants represented by four mythical beasts.", e_tc: "二十八宿是月亮運行軌跡經過的天區，分為四個方位象限，分別由四種神獸代表。", e_sc: "二十八宿是月亮运行轨迹经过的天区，分为四个方位象限，分别由四种神兽代表。" },
    { q: "The Four Symbols (四象) that guard the cardinal directions are:", q_tc: "守護四方的四象分別是：", q_sc: "守护四方的四象分别是：", o: ["Azure Dragon, White Tiger, Vermillion Bird, Black Tortoise", "Dragon, Phoenix, Tiger, Turtle", "Rat, Horse, Rabbit, Rooster", "Qilin, Dragon, Phoenix, Pixiu"], o_tc: ["青龍、白虎、朱雀、玄武", "龍、鳳、虎、龜", "鼠、馬、兔、雞", "麒麟、龍、鳳、貔貅"], o_sc: ["青龙、白虎、朱雀、玄武", "龙、凤、虎、龟", "鼠、马、兔、鸡", "麒麟、龙、凤、貔貅"], a: 0, e: "The Four Symbols are: Azure Dragon (青龍, East), White Tiger (白虎, West), Vermillion Bird (朱雀, South), and Black Tortoise (玄武, North).", e_tc: "四象為：青龍（東方）、白虎（西方）、朱雀（南方）、玄武（北方）。", e_sc: "四象为：青龙（东方）、白虎（西方）、朱雀（南方）、玄武（北方）。" },
    { q: "Which solar term means 'Awakening of Insects'?", q_tc: "哪個節氣的意思是「驚醒蟄伏的蟲類」？", q_sc: "哪个节气的意思是「惊醒蛰伏的虫类」？", o: ["驚蟄 (Jīngzhé)", "小滿 (Xiǎomǎn)", "芒種 (Mángzhòng)", "穀雨 (Gǔyǔ)"], o_tc: ["驚蟄", "小滿", "芒種", "穀雨"], o_sc: ["惊蛰", "小满", "芒种", "谷雨"], a: 0, e: "驚蟄 (Jīngzhé, 'Awakening of Insects') falls around March 5-6. Spring thunder 'startles' hibernating creatures awake, marking the revival of nature.", e_tc: "驚蟄通常在3月5日至6日，春雷「驚醒」了冬眠的蟲類，象徵萬物復甦。", e_sc: "惊蛰通常在3月5日至6日，春雷「惊醒」了冬眠的虫类，象征万物复苏。" },
    { q: "The gnomon (圭表) measures time by tracking:", q_tc: "圭表是透過追蹤什麼來測量時間的？", q_sc: "圭表是通过追踪什么来测量时间的？", o: ["The length of a shadow cast by a vertical pole", "The position of stars at night", "Water flow through a vessel", "Sand through an hourglass"], o_tc: ["直立桿所投射的影子長度", "夜間星星的位置", "容器中的水流", "沙漏中的沙子"], o_sc: ["直立杆所投射的影子长度", "夜间星星的位置", "容器中的水流", "沙漏中的沙子"], a: 0, e: "A gnomon (圭表) uses a vertical pole (表 biǎo) and a horizontal scale (圭 guī) to measure the sun's shadow length, determining solstices, equinoxes, and the length of the year.", e_tc: "圭表使用直立的表（桿）和水平的圭（尺）來測量日影長度，從而確定冬至、夏至、春分、秋分及一年的長度。", e_sc: "圭表使用直立的表（杆）和水平的圭（尺）来测量日影长度，从而确定冬至、夏至、春分、秋分及一年的长度。" },
    // ===== FENG SHUI (15) =====
    { q: "What does 'feng shui' (風水) literally translate to?", q_tc: "「風水」一詞的字面意思是什麼？", q_sc: "「风水」一词的字面意思是什么？", o: ["Wind-water", "Mountain-river", "Heaven-earth", "Yin-yang"], o_tc: ["風水", "山河", "天地", "陰陽"], o_sc: ["风水", "山河", "天地", "阴阳"], a: 0, e: "Feng shui (風水) literally means 'wind-water.' The practice is over 3,500 years old and was used in ancient city planning for capitals like Chang'an and Luoyang.", e_tc: "風水的字面意思是「風」和「水」。這門學問已有超過三千五百年的歷史，曾用於長安、洛陽等古都的城市規劃。", e_sc: "风水的字面意思是「风」和「水」。这门学问已有超过三千五百年的历史，曾用于长安、洛阳等古都的城市规划。" },
    { q: "The luopan (羅盤) is the primary tool of which practice?", q_tc: "羅盤是哪門學問的主要工具？", q_sc: "罗盘是哪门学问的主要工具？", o: ["Feng shui", "BaZi", "Qi Men Dun Jia", "Acupuncture"], o_tc: ["風水", "八字", "奇門遁甲", "針灸"], o_sc: ["风水", "八字", "奇门遁甲", "针灸"], a: 0, e: "The luopan is the feng shui compass, containing concentric rings encoding cosmological data used by Compass School practitioners.", e_tc: "羅盤是風水專用的指南針，盤面由多層同心圓環組成，刻有理氣派所用的各種宇宙學資料。", e_sc: "罗盘是风水专用的指南针，盘面由多层同心圆环组成，刻有理气派所用的各种宇宙学资料。" },
    { q: "The two main classical schools of feng shui are:", q_tc: "風水的兩大經典流派是：", q_sc: "风水的两大经典流派是：", o: ["Form School and Compass School", "Yin School and Yang School", "Heaven School and Earth School", "Mountain School and Water School"], o_tc: ["形勢派和理氣派", "陰派和陽派", "天派和地派", "山派和水派"], o_sc: ["形势派和理气派", "阴派和阳派", "天派和地派", "山派和水派"], a: 0, e: "Form School (形勢派) studies landscape shapes and water courses. Compass School (理氣派) uses the luopan to analyse directional energy. Both pre-date the Qing Dynasty.", e_tc: "形勢派研究山形地貌與水流走向，理氣派則使用羅盤分析方位能量。兩派均早於清朝便已成形。", e_sc: "形势派研究山形地貌与水流走向，理气派则使用罗盘分析方位能量。两派均早于清朝便已成形。" },
    { q: "In feng shui, the ideal site has mountains behind and water in front. This is called:", q_tc: "在風水中，理想的格局是背山面水，這被稱為：", q_sc: "在风水中，理想的格局是背山面水，这被称为：", o: ["藏風聚氣 (storing wind, gathering qi)", "龍虎相爭 (dragon-tiger contest)", "天圓地方 (round heaven, square earth)", "陰陽平衡 (yin-yang balance)"], o_tc: ["藏風聚氣（藏風聚氣）", "龍虎相爭（龍虎爭鬥）", "天圓地方（天圓地方）", "陰陽平衡（陰陽調和）"], o_sc: ["藏风聚气（藏风聚气）", "龙虎相争（龙虎争斗）", "天圆地方（天圆地方）", "阴阳平衡（阴阳调和）"], a: 0, e: "藏風聚氣 means the mountains behind block harsh winds while water in front collects beneficial qi. This principle was articulated in Guo Pu's 《葬書》(Book of Burial).", e_tc: "藏風聚氣是指背後的山脈擋住凜冽的風，前方的水匯聚有利的氣。此原則出自郭璞的《葬書》。", e_sc: "藏风聚气是指背后的山脉挡住凛冽的风，前方的水汇聚有利的气。此原则出自郭璞的《葬书》。" },
    { q: "The 'Bright Hall' (明堂) in feng shui refers to:", q_tc: "風水中的「明堂」指的是：", q_sc: "风水中的「明堂」指的是：", o: ["The open space in front of a site", "The main entrance of a building", "A ceremonial room", "The roof design"], o_tc: ["宅前的開闊空間", "建築物的正門", "禮儀廳堂", "屋頂的設計"], o_sc: ["宅前的开阔空间", "建筑物的正门", "礼仪厅堂", "屋顶的设计"], a: 0, e: "明堂 (Míng Táng) is the open area in front of a site where qi gathers. A spacious, gentle bright hall is considered auspicious for wealth accumulation.", e_tc: "明堂是宅前的開闊地帶，氣在此匯聚。寬敞平緩的明堂被視為有利於聚財的吉象。", e_sc: "明堂是宅前的开阔地带，气在此汇聚。宽敞平缓的明堂被视为有利于聚财的吉象。" },
    { q: "Which ancient text is considered the foundation of feng shui theory?", q_tc: "哪部古籍被視為風水理論的奠基之作？", q_sc: "哪部古籍被视为风水理论的奠基之作？", o: ["《葬書》(Book of Burial) by Guo Pu", "《易經》(I Ching)", "《道德經》(Dao De Jing)", "《論語》(Analerta)"], o_tc: ["郭璞《葬書》", "《易經》", "《道德經》", "《論語》"], o_sc: ["郭璞《葬书》", "《易经》", "《道德经》", "《论语》"], a: 0, e: "Guo Pu's 《葬書》(Zàng Shū, Book of Burial, c. 4th century CE) is the foundational text of feng shui, establishing the relationship between landscape, qi, and fortune.", e_tc: "郭璞的《葬書》（約公元四世紀）是風水學的奠基典籍，確立了山水地貌、氣與吉凶之間的關係。", e_sc: "郭璞的《葬书》（约公元四世纪）是风水学的奠基典籍，确立了山水地貌、气与吉凶之间的关系。" },
    { q: "The 'Dragon Veins' (龍脈) in feng shui refer to:", q_tc: "風水中的「龍脈」指的是：", q_sc: "风水中的「龙脉」指的是：", o: ["Mountain ranges carrying earth qi", "Underground water channels", "Ley lines between temples", "Lines on a luopan"], o_tc: ["承載地氣的山脈走勢", "地下水道", "寺廟之間的靈脈線", "羅盤上的刻線"], o_sc: ["承载地气的山脉走势", "地下水道", "寺庙之间的灵脉线", "罗盘上的刻线"], a: 0, e: "Dragon Veins (龍脈) are mountain ridges and ranges through which earth qi flows, like blood through veins. Tracing the dragon vein is essential to Form School feng shui.", e_tc: "龍脈是指山脊與山脈的走勢，地氣沿其流動，猶如血液流過血管。追尋龍脈是形勢派風水的核心方法。", e_sc: "龙脉是指山脊与山脉的走势，地气沿其流动，犹如血液流过血管。追寻龙脉是形势派风水的核心方法。" },
    { q: "What are the 'Four Celestial Animals' of a feng shui site?", q_tc: "風水中的「四靈獸」是哪四種？", q_sc: "风水中的「四灵兽」是哪四种？", o: ["Black Tortoise, Azure Dragon, White Tiger, Red Phoenix", "Dragon, Tiger, Phoenix, Turtle", "Rat, Ox, Tiger, Rabbit", "Qilin, Dragon, Pixiu, Phoenix"], o_tc: ["玄武、青龍、白虎、朱雀", "龍、虎、鳳、龜", "鼠、牛、虎、兔", "麒麟、龍、貔貅、鳳"], o_sc: ["玄武、青龙、白虎、朱雀", "龙、虎、凤、龟", "鼠、牛、虎、兔", "麒麟、龙、貔貅、凤"], a: 0, e: "A classical feng shui site is guarded by: Black Tortoise (mountain behind), Azure Dragon (hills to left), White Tiger (hills to right), Red Phoenix (open space ahead).", e_tc: "經典的風水格局由四靈守護：玄武（後方山脈）、青龍（左側丘陵）、白虎（右側丘陵）、朱雀（前方開闊地）。", e_sc: "经典的风水格局由四灵守护：玄武（后方山脉）、青龙（左侧丘陵）、白虎（右侧丘陵）、朱雀（前方开阔地）。" },
    { q: "In feng shui, 'sha qi' (煞氣) refers to:", q_tc: "風水中的「煞氣」指的是：", q_sc: "风水中的「煞气」指的是：", o: ["Harmful or attacking energy", "Beneficial energy", "Stagnant energy", "Neutral energy"], o_tc: ["有害的或帶有攻擊性的能量", "有益的能量", "停滯的能量", "中性的能量"], o_sc: ["有害的或带有攻击性的能量", "有益的能量", "停滞的能量", "中性的能量"], a: 0, e: "煞氣 (Shā Qì) is harmful energy created by sharp angles, straight roads pointing at a building, or other aggressive landscape features. Feng shui seeks to avoid or redirect it.", e_tc: "煞氣是由尖角、直衝建築物的道路或其他帶有攻擊性的地形所產生的有害能量。風水的目的在於避開或化解煞氣。", e_sc: "煞气是由尖角、直冲建筑物的道路或其他带有攻击性的地形所产生的有害能量。风水的目的在于避开或化解煞气。" },
    { q: "The compass direction system used in feng shui divides space into how many sectors?", q_tc: "風水中的方位系統將空間劃分為多少個區域？", q_sc: "风水中的方位系统将空间划分为多少个区域？", o: ["8 (or 24 mountains)", "4", "12", "16"], o_tc: ["八個（或二十四山）", "四個", "十二個", "十六個"], o_sc: ["八个（或二十四山）", "四个", "十二个", "十六个"], a: 0, e: "Basic feng shui uses 8 directions (the Ba Gua sectors). Advanced practice uses the '24 Mountains' (二十四山), subdividing each of the 8 directions into 3 sub-sectors.", e_tc: "基礎風水使用八個方位（八卦方位）。進階風水則使用「二十四山」，將每個方位再細分為三個子區域。", e_sc: "基础风水使用八个方位（八卦方位）。进阶风水则使用「二十四山」，将每个方位再细分为三个子区域。" },
    { q: "Which direction does the 'sitting' (坐) of a building face in feng shui terminology?", q_tc: "風水術語中，建築物的「坐」朝向哪個方位？", q_sc: "风水术语中，建筑物的「坐」朝向哪个方位？", o: ["The back of the building", "The front entrance", "The left side", "The roof peak"], o_tc: ["建築物的背面", "正門入口", "左側", "屋頂尖端"], o_sc: ["建筑物的背面", "正门入口", "左侧", "屋顶尖端"], a: 0, e: "In feng shui, 坐 (zuò, sitting) refers to the back of the building, while 向 (xiàng, facing) is the front. The sitting-facing axis is fundamental to Compass School analysis.", e_tc: "在風水中，「坐」指建築物的背面，「向」指建築物的正面。坐向軸線是理氣派分析的基礎。", e_sc: "在风水中，「坐」指建筑物的背面，「向」指建筑物的正面。坐向轴线是理气派分析的基础。" },
    { q: "Flying Star feng shui (玄空飛星) tracks energy changes over:", q_tc: "玄空飛星風水追蹤的能量變化週期為：", q_sc: "玄空飞星风水追踪的能量变化周期为：", o: ["Time periods of 20 years", "12-year zodiac cycles", "60-year sexagenary cycles", "Annual seasons only"], o_tc: ["每二十年為一運", "十二年生肖週期", "六十年甲子週期", "僅以年度季節為週期"], o_sc: ["每二十年为一运", "十二年生肖周期", "六十年甲子周期", "仅以年度季节为周期"], a: 0, e: "Flying Star (玄空飛星) feng shui divides time into 20-year periods (運). The current Period 9 began in 2024, bringing Fire energy prominence.", e_tc: "玄空飛星風水將時間劃分為二十年一運。目前的九運始於二〇二四年，火氣當旺。", e_sc: "玄空飞星风水将时间划分为二十年一运。目前的九运始于二〇二四年，火气当旺。" },
    { q: "What is 'qi' (氣) in the context of feng shui?", q_tc: "在風水中，「氣」是什麼？", q_sc: "在风水中，「气」是什么？", o: ["Vital life force or energy flowing through the landscape", "A type of compass reading", "A building material", "A mathematical formula"], o_tc: ["流動於天地山水間的生命能量", "一種羅盤讀數", "一種建築材料", "一個數學公式"], o_sc: ["流动于天地山水间的生命能量", "一种罗盘读数", "一种建筑材料", "一个数学公式"], a: 0, e: "氣 (Qì) is the vital life energy that permeates all things. Feng shui seeks to harness beneficial qi flow and avoid areas where qi stagnates or scatters.", e_tc: "氣是充盈萬物的生命能量。風水的目的是引導有利的氣場流動，並避開氣場停滯或渙散的地方。", e_sc: "气是充盈万物的生命能量。风水的目的是引导有利的气场流动，并避开气场停滞或涣散的地方。" },
    { q: "The ideal feng shui water flow in front of a property should be:", q_tc: "風水上，宅前理想的水流應該是：", q_sc: "风水上，宅前理想的水流应该是：", o: ["Slow, curved, and embracing the site", "Fast and straight", "Underground only", "Flowing away from the site"], o_tc: ["緩慢、彎曲、環抱宅地", "快速且筆直", "僅限地下水流", "背離宅地流走"], o_sc: ["缓慢、弯曲、环抱宅地", "快速且笔直", "仅限地下水流", "背离宅地流走"], a: 0, e: "Auspicious water should curve gently and appear to embrace the site (有情水). Fast, straight water carries qi away too quickly (無情水).", e_tc: "吉利的水流應緩緩彎曲，呈環抱之勢（有情水）。快速筆直的水流會將氣帶走過快（無情水）。", e_sc: "吉利的水流应缓缓弯曲，呈环抱之势（有情水）。快速笔直的水流会将气带走过快（无情水）。" },
    { q: "Which ancient city was designed according to feng shui principles, with its back to a mountain and facing a river?", q_tc: "哪座古城是按照風水原則設計的，背靠山脈、面朝河流？", q_sc: "哪座古城是按照风水原则设计的，背靠山脉、面朝河流？", o: ["Chang'an (長安)", "Babylon", "Athens", "Rome"], o_tc: ["長安", "巴比倫", "雅典", "羅馬"], o_sc: ["长安", "巴比伦", "雅典", "罗马"], a: 0, e: "Chang'an (modern Xi'an) was sited with the Qinling Mountains behind (Black Tortoise) and the Wei River ahead, following classical feng shui landform principles.", e_tc: "長安（今西安）背靠秦嶺（玄武方位），前臨渭河，完全遵循經典的風水形勢原則。", e_sc: "长安（今西安）背靠秦岭（玄武方位），前临渭河，完全遵循经典的风水形势原则。" },

    // ===== BAZI (12) =====
    { q: "BaZi (八字) literally means 'eight characters.' What are these eight characters?", q_tc: "八字的字面意思是「八個字」，這八個字指的是什麼？", q_sc: "八字的字面意思是「八个字」，这八个字指的是什么？", o: ["Four Heavenly Stems + four Earthly Branches", "Eight trigrams", "Eight celestial animals", "Eight compass directions"], o_tc: ["四個天干加四個地支", "八個卦象", "八種神獸", "八個方位"], o_sc: ["四个天干加四个地支", "八个卦象", "八种神兽", "八个方位"], a: 0, e: "BaZi consists of four pillars (year, month, day, hour), each containing one Heavenly Stem and one Earthly Branch — totalling eight characters.", e_tc: "八字由四柱（年柱、月柱、日柱、時柱）組成，每柱包含一個天干和一個地支，合計八個字。", e_sc: "八字由四柱（年柱、月柱、日柱、时柱）组成，每柱包含一个天干和一个地支，合计八个字。" },
    { q: "Which pillar in BaZi represents the 'Day Master' (日主)?", q_tc: "八字中哪一柱代表「日主」？", q_sc: "八字中哪一柱代表「日主」？", o: ["Day Pillar", "Year Pillar", "Month Pillar", "Hour Pillar"], o_tc: ["日柱", "年柱", "月柱", "時柱"], o_sc: ["日柱", "年柱", "月柱", "时柱"], a: 0, e: "The Day Pillar's Heavenly Stem is the Day Master (日主/日元), representing the self. It is the reference point for interpreting the entire chart.", e_tc: "日柱的天干即為日主（又稱日元），代表命主本人，是解讀整個命盤的基準點。", e_sc: "日柱的天干即为日主（又称日元），代表命主本人，是解读整个命盘的基准点。" },
    { q: "BaZi destiny analysis was significantly developed by which Tang Dynasty figure?", q_tc: "八字命理學由哪位唐朝人物大力發展？", q_sc: "八字命理学由哪位唐朝人物大力发展？", o: ["Li Xuzhong (李虛中)", "Li Bai (李白)", "Han Yu (韓愈)", "Wu Zetian (武則天)"], o_tc: ["李虛中", "李白", "韓愈", "武則天"], o_sc: ["李虚中", "李白", "韩愈", "武则天"], a: 0, e: "Li Xuzhong (李虛中) of the Tang Dynasty is credited with developing the three-pillar (year, month, day) method of destiny analysis, the precursor to modern BaZi.", e_tc: "唐代的李虛中創立了以年、月、日三柱推命的方法，為現代八字命理學的前身。", e_sc: "唐代的李虚中创立了以年、月、日三柱推命的方法，为现代八字命理学的前身。" },
    { q: "The 'Ten Gods' (十神) system in BaZi analyses relationships between:", q_tc: "八字中「十神」體系分析的是什麼之間的關係？", q_sc: "八字中「十神」体系分析的是什么之间的关系？", o: ["The Day Master and other stems", "Ten planets", "Ten zodiac animals", "Ten compass directions"], o_tc: ["日主與其他天干之間的關係", "十大行星", "十種生肖動物", "十個方位"], o_sc: ["日主与其他天干之间的关系", "十大行星", "十种生肖动物", "十个方位"], a: 0, e: "The Ten Gods (十神) describe the relationship between the Day Master and each of the other Heavenly Stems: e.g., 正官 (Direct Officer), 偏財 (Indirect Wealth), etc.", e_tc: "十神描述的是日主與其他各天干之間的關係，例如正官、偏財等。", e_sc: "十神描述的是日主与其他各天干之间的关系，例如正官、偏财等。" },
    { q: "Who refined the BaZi system by adding the Hour Pillar, creating the four-pillar method?", q_tc: "誰改良了八字體系，加入時柱而創立四柱推命法？", q_sc: "谁改良了八字体系，加入时柱而创立四柱推命法？", o: ["Xu Ziping (徐子平)", "Li Xuzhong (李虛中)", "Shao Yong (邵雍)", "Guo Pu (郭璞)"], o_tc: ["徐子平", "李虛中", "邵雍", "郭璞"], o_sc: ["徐子平", "李虚中", "邵雍", "郭璞"], a: 0, e: "Xu Ziping (徐子平) of the Song Dynasty added the Hour Pillar and shifted the Day Master to the centre of analysis. Modern BaZi is sometimes called 'Ziping method' (子平法) in his honour.", e_tc: "宋代的徐子平加入了時柱，並將日主確立為命理分析的核心。現代八字因此又稱「子平法」，以紀念他的貢獻。", e_sc: "宋代的徐子平加入了时柱，并将日主确立为命理分析的核心。现代八字因此又称「子平法」，以纪念他的贡献。" },
    { q: "In BaZi, the Year Pillar primarily represents:", q_tc: "在八字中，年柱主要代表：", q_sc: "在八字中，年柱主要代表：", o: ["Ancestors and early childhood", "Career", "Spouse", "Children"], o_tc: ["祖先與童年時期", "事業", "配偶", "子女"], o_sc: ["祖先与童年时期", "事业", "配偶", "子女"], a: 0, e: "The Year Pillar represents ancestors, grandparents, and ages 1-16. Month = parents/ages 17-32, Day = self and spouse, Hour = children and old age.", e_tc: "年柱代表祖先、祖父母及一至十六歲。月柱代表父母及十七至三十二歲，日柱代表自己與配偶，時柱代表子女與晚年。", e_sc: "年柱代表祖先、祖父母及一至十六岁。月柱代表父母及十七至三十二岁，日柱代表自己与配偶，时柱代表子女与晚年。" },
    { q: "A 'strong' Day Master in BaZi means:", q_tc: "八字中日主「身強」意味着：", q_sc: "八字中日主「身强」意味着：", o: ["The Day Master element is well-supported by other chart elements", "The person is physically strong", "The birth date is auspicious", "The year pillar is dominant"], o_tc: ["日主五行在命盤中得到其他元素的有力扶助", "此人身體強壯", "出生日期吉利", "年柱力量最強"], o_sc: ["日主五行在命盘中得到其他元素的有力扶助", "此人身体强壮", "出生日期吉利", "年柱力量最强"], a: 0, e: "A strong Day Master has ample support from the same element or its generating element in the chart. Strong Day Masters generally benefit from elements that control or drain them.", e_tc: "身強的日主在命盤中獲得同類五行或生扶五行的充分支持。身強者通常需要克洩耗的五行來取得平衡。", e_sc: "身强的日主在命盘中获得同类五行或生扶五行的充分支持。身强者通常需要克泄耗的五行来取得平衡。" },
    { q: "How many possible combinations exist in BaZi's sexagenary pillar system?", q_tc: "八字的干支系統中，每柱有多少種可能的組合？", q_sc: "八字的干支系统中，每柱有多少种可能的组合？", o: ["60 per pillar", "12 per pillar", "10 per pillar", "120 per pillar"], o_tc: ["每柱六十種", "每柱十二種", "每柱十種", "每柱一百二十種"], o_sc: ["每柱六十种", "每柱十二种", "每柱十种", "每柱一百二十种"], a: 0, e: "Each pillar has 60 possible Stem-Branch combinations. With four pillars, the total theoretical combinations exceed 12 million unique charts.", e_tc: "每柱有六十種干支組合。四柱相乘，理論上可產生超過一千二百萬種不同的命盤。", e_sc: "每柱有六十种干支组合。四柱相乘，理论上可产生超过一千二百万种不同的命盘。" },
    { q: "The 'Luck Pillars' (大運) in BaZi change every:", q_tc: "八字中的「大運」每隔多久轉換一次？", q_sc: "八字中的「大运」每隔多久转换一次？", o: ["10 years", "12 years", "5 years", "1 year"], o_tc: ["十年", "十二年", "五年", "一年"], o_sc: ["十年", "十二年", "五年", "一年"], a: 0, e: "Luck Pillars (大運 Dà Yùn) change every 10 years and represent the broader energetic climate of each life decade. They are derived from the Month Pillar.", e_tc: "大運每十年轉換一次，代表每個十年的整體運勢氣候，由月柱推算而來。", e_sc: "大运每十年转换一次，代表每个十年的整体运势气候，由月柱推算而来。" },
    { q: "What does 'Eating God' (食神) represent in BaZi's Ten Gods?", q_tc: "八字十神中的「食神」代表什麼？", q_sc: "八字十神中的「食神」代表什么？", o: ["Creative output and enjoyment", "A food deity", "Physical appetite", "Career authority"], o_tc: ["創造力與生活享受", "食物之神", "食慾", "事業權威"], o_sc: ["创造力与生活享受", "食物之神", "食欲", "事业权威"], a: 0, e: "食神 (Shí Shén, Eating God) represents creativity, artistic talent, and enjoyment of life. It is the element that the Day Master generates on the same polarity (Yin-Yin or Yang-Yang).", e_tc: "食神代表創造力、藝術才華和生活享受。它是日主所生、且陰陽屬性相同（同陰或同陽）的五行。", e_sc: "食神代表创造力、艺术才华和生活享受。它是日主所生、且阴阳属性相同（同阴或同阳）的五行。" },
    { q: "In BaZi, which of the Four Pillars is considered most influential for determining one's zodiac animal?", q_tc: "在八字中，哪一柱對確定生肖最具影響力？", q_sc: "在八字中，哪一柱对确定生肖最具影响力？", o: ["Year Pillar", "Day Pillar", "Month Pillar", "Hour Pillar"], o_tc: ["年柱", "日柱", "月柱", "時柱"], o_sc: ["年柱", "日柱", "月柱", "时柱"], a: 0, e: "The Year Pillar's Earthly Branch determines one's zodiac animal. However, advanced BaZi practitioners consider the Day Pillar (Day Master) as the true 'self'.", e_tc: "年柱的地支決定一個人的生肖。不過，資深的八字命理師認為日柱（日主）才是真正代表「自我」的柱位。", e_sc: "年柱的地支决定一个人的生肖。不过，资深的八字命理师认为日柱（日主）才是真正代表「自我」的柱位。" },
    { q: "The concept '用神' (Yòng Shén) in BaZi refers to:", q_tc: "八字中「用神」的概念指的是：", q_sc: "八字中「用神」的概念指的是：", o: ["The most needed element to balance the chart", "A patron deity", "The strongest element in the chart", "The zodiac animal spirit"], o_tc: ["命盤中最需要的平衡五行", "守護神", "命盤中最強的五行", "生肖守護靈"], o_sc: ["命盘中最需要的平衡五行", "守护神", "命盘中最强的五行", "生肖守护灵"], a: 0, e: "用神 (Yòng Shén, 'Useful God') is the element the chart most needs for balance. Identifying the Yòng Shén is the most critical step in BaZi interpretation.", e_tc: "用神是命盤中最需要的五行元素，用以達到平衡。確定用神是八字解讀中最關鍵的一步。", e_sc: "用神是命盘中最需要的五行元素，用以达到平衡。确定用神是八字解读中最关键的一步。" },

    // ===== SPRING FESTIVAL (15) =====
    { q: "The character 年 (nián) originally meant what in classical Chinese?", q_tc: "「年」字在古漢語中的本義是什麼？", q_sc: "「年」字在古汉语中的本义是什么？", o: ["Grain ripening / harvest", "A fearsome beast", "New beginning", "Winter solstice"], o_tc: ["穀物成熟／豐收", "一頭可怕的野獸", "新的開始", "冬至"], o_sc: ["谷物成熟／丰收", "一头可怕的野兽", "新的开始", "冬至"], a: 0, e: "According to the Shuowen Jiezi (《說文解字》), 年 means 'grain ripening' (穀熟也). The Nian beast story is a modern invention (earliest source: 1933).", e_tc: "據《說文解字》所載，年的本義是「穀熟也」。年獸的故事實為近代杜撰（最早出處見於一九三三年）。", e_sc: "据《说文解字》所载，年的本义是「谷熟也」。年兽的故事实为近代杜撰（最早出处见于一九三三年）。" },
    { q: "桃符 (peachwood charms) are the historical predecessors of which Spring Festival tradition?", q_tc: "桃符是哪項春節傳統的前身？", q_sc: "桃符是哪项春节传统的前身？", o: ["Spring couplets (春聯)", "Red envelopes", "Firecrackers", "Lanterns"], o_tc: ["春聯", "紅包", "爆竹", "燈籠"], o_sc: ["春联", "红包", "爆竹", "灯笼"], a: 0, e: "桃符 were inscribed with protective deity names (神荼 and 郁壘) and hung on doors. They evolved into spring couplets (春聯) by the Ming Dynasty.", e_tc: "桃符上刻有門神神荼和郁壘的名字，懸掛於門上驅邪。到了明代，桃符逐漸演變為春聯。", e_sc: "桃符上刻有门神神荼和郁垒的名字，悬挂于门上驱邪。到了明代，桃符逐渐演变为春联。" },
    { q: "The tradition of 守歲 (staying up on New Year's Eve) is documented since which dynasty?", q_tc: "守歲的傳統最早記載於哪個朝代？", q_sc: "守岁的传统最早记载于哪个朝代？", o: ["Jin Dynasty", "Han Dynasty", "Tang Dynasty", "Song Dynasty"], o_tc: ["晉朝", "漢朝", "唐朝", "宋朝"], o_sc: ["晋朝", "汉朝", "唐朝", "宋朝"], a: 0, e: "守歲 (shǒu suì) — staying awake through New Year's Eve — has been documented since the Jin Dynasty (266-420 CE).", e_tc: "守歲——除夕夜通宵不眠——最早記載於晉朝（公元二六六至四二〇年）。", e_sc: "守岁——除夕夜通宵不眠——最早记载于晋朝（公元二六六至四二〇年）。" },
    { q: "Burning bamboo to ward off mountain spirits was the precursor to what Spring Festival tradition?", q_tc: "燃燒竹子驅逐山精是哪項春節傳統的前身？", q_sc: "燃烧竹子驱逐山精是哪项春节传统的前身？", o: ["Firecrackers (爆竹)", "Bonfire festivals", "Incense burning", "Dragon dance"], o_tc: ["爆竹", "篝火節", "燒香", "舞龍"], o_sc: ["爆竹", "篝火节", "烧香", "舞龙"], a: 0, e: "Burning bamboo (爆竹 literally means 'exploding bamboo') to drive away 山臊/山魈 mountain spirits is documented in the 6th-century《荊楚歲時記》.", e_tc: "燃燒竹子（爆竹的字面意思就是「爆裂的竹子」）驅趕山臊／山魈的習俗，記載於六世紀的《荊楚歲時記》。", e_sc: "燃烧竹子（爆竹的字面意思就是「爆裂的竹子」）驱赶山臊／山魈的习俗，记载于六世纪的《荆楚岁时记》。" },
    { q: "The Spring Festival celebration traditionally lasts how many days?", q_tc: "春節傳統上持續多少天？", q_sc: "春节传统上持续多少天？", o: ["15 days", "7 days", "3 days", "30 days"], o_tc: ["十五天", "七天", "三天", "三十天"], o_sc: ["十五天", "七天", "三天", "三十天"], a: 0, e: "The Spring Festival lasts 15 days, from New Year's Day (正月初一) to the Lantern Festival (元宵節) on the 15th of the first lunar month.", e_tc: "春節為期十五天，從正月初一到正月十五元宵節。", e_sc: "春节为期十五天，从正月初一到正月十五元宵节。" },
    { q: "What food is traditionally eaten during the Lantern Festival (元宵節)?", q_tc: "元宵節傳統上吃什麼食物？", q_sc: "元宵节传统上吃什么食物？", o: ["Tangyuan (湯圓) / Yuanxiao (元宵)", "Dumplings (餃子)", "Nian Gao (年糕)", "Spring rolls"], o_tc: ["湯圓／元宵", "餃子", "年糕", "春卷"], o_sc: ["汤圆／元宵", "饺子", "年糕", "春卷"], a: 0, e: "Tangyuan (湯圓) — glutinous rice balls in sweet soup — symbolise family unity and completeness. 'Tangyuan' sounds like 團圓 (tuányuán, reunion).", e_tc: "湯圓是以糯米製成的圓子，配甜湯食用，象徵闔家團圓。「湯圓」諧音「團圓」。", e_sc: "汤圆是以糯米制成的圆子，配甜汤食用，象征阖家团圆。「汤圆」谐音「团圆」。" },
    { q: "Red envelopes (紅包) traditionally contain:", q_tc: "紅包裡傳統上裝的是：", q_sc: "红包里传统上装的是：", o: ["Money", "Written blessings", "Candy", "Seeds"], o_tc: ["錢", "祝福字條", "糖果", "種子"], o_sc: ["钱", "祝福字条", "糖果", "种子"], a: 0, e: "紅包 (hóngbāo) contain money and are given to children and unmarried younger relatives. The amount should be even numbers (but not 4, which sounds like death).", e_tc: "紅包裡裝的是錢，贈予兒童和未婚的晚輩。金額應為雙數（但不可為四，因「四」諧音「死」）。", e_sc: "红包里装的是钱，赠予儿童和未婚的晚辈。金额应为双数（但不可为四，因「四」谐音「死」）。" },
    { q: "The character '福' (fú, fortune) is often hung upside-down on doors because:", q_tc: "「福」字常被倒掛在門上，原因是：", q_sc: "「福」字常被倒挂在门上，原因是：", o: ["倒 (dào, upside-down) sounds like 到 (dào, to arrive)", "It looks more decorative", "It confuses evil spirits", "It's an ancient printing mistake"], o_tc: ["「倒」與「到」諧音", "這樣更美觀", "可以迷惑惡靈", "源於古代的印刷錯誤"], o_sc: ["「倒」与「到」谐音", "这样更美观", "可以迷惑恶灵", "源于古代的印刷错误"], a: 0, e: "Hanging 福 upside-down is a visual pun: 福倒了 (fú dào le) sounds like 福到了 (fú dào le, 'fortune has arrived').", e_tc: "倒掛「福」字是一種視覺諧音趣味：「福倒了」聽起來就像「福到了」（福氣來了）。", e_sc: "倒挂「福」字是一种视觉谐音趣味：「福倒了」听起来就像「福到了」（福气来了）。" },
    { q: "Which dish is essential for the New Year's Eve reunion dinner (年夜飯) because its name sounds like 'surplus'?", q_tc: "年夜飯中哪道菜不可或缺，因為它的名字諧音「餘」？", q_sc: "年夜饭中哪道菜不可或缺，因为它的名字谐音「余」？", o: ["Fish (魚 yú)", "Chicken (雞 jī)", "Duck (鴨 yā)", "Tofu (豆腐 dòufu)"], o_tc: ["魚", "雞", "鴨", "豆腐"], o_sc: ["鱼", "鸡", "鸭", "豆腐"], a: 0, e: "Fish (魚 yú) is essential because it sounds like 餘 (yú, surplus/abundance). The saying 年年有餘 means 'may there be abundance year after year.'", e_tc: "魚是年夜飯必備菜餚，因為「魚」諧音「餘」（富餘）。俗語「年年有餘」寓意年年富足。", e_sc: "鱼是年夜饭必备菜肴，因为「鱼」谐音「余」（富余）。俗语「年年有余」寓意年年富足。" },
    { q: "The Kitchen God (灶神) is sent off to heaven on which date?", q_tc: "灶神在哪一天被送上天庭？", q_sc: "灶神在哪一天被送上天庭？", o: ["The 23rd or 24th of the 12th lunar month", "New Year's Eve", "The 1st of the 1st month", "The 15th of the 1st month"], o_tc: ["臘月二十三或二十四", "除夕", "正月初一", "正月十五"], o_sc: ["腊月二十三或二十四", "除夕", "正月初一", "正月十五"], a: 0, e: "On 小年 (Little New Year, 12th month 23rd/24th), families offer sweet foods to the Kitchen God so he reports only good things to the Jade Emperor.", e_tc: "小年（臘月二十三或二十四）這天，家家戶戶以甜食祭祀灶神，祈望他上天向玉皇大帝多報喜事。", e_sc: "小年（腊月二十三或二十四）这天，家家户户以甜食祭祀灶神，祈望他上天向玉皇大帝多报喜事。" },
    { q: "年糕 (Nián Gāo, New Year cake) symbolises:", q_tc: "年糕象徵什麼？", q_sc: "年糕象征什么？", o: ["Rising higher each year (年年高升)", "Sweet family life", "A bountiful harvest", "Longevity"], o_tc: ["年年高升", "甜蜜的家庭生活", "五穀豐登", "長壽"], o_sc: ["年年高升", "甜蜜的家庭生活", "五谷丰登", "长寿"], a: 0, e: "年糕 is a pun: 糕 (gāo, cake) sounds like 高 (gāo, high/tall). Eating it symbolises 年年高 — rising higher in fortune, status, or achievement each year.", e_tc: "年糕是諧音雙關：「糕」與「高」同音。吃年糕寓意「年年高」——每年在財運、地位或成就上步步高升。", e_sc: "年糕是谐音双关：「糕」与「高」同音。吃年糕寓意「年年高」——每年在财运、地位或成就上步步高升。" },
    { q: "The 'God of Wealth' (財神) is welcomed on which day of the Spring Festival?", q_tc: "春節期間在哪一天迎財神？", q_sc: "春节期间在哪一天迎财神？", o: ["The 5th day (破五)", "New Year's Day", "The 3rd day", "The 15th day"], o_tc: ["正月初五（破五）", "正月初一", "正月初三", "正月十五"], o_sc: ["正月初五（破五）", "正月初一", "正月初三", "正月十五"], a: 0, e: "The 5th day (正月初五, 破五 Pò Wǔ) is when businesses traditionally reopen and welcome the God of Wealth (迎財神) with firecrackers.", e_tc: "正月初五（破五）是商家傳統的開業日，人們燃放爆竹迎接財神。", e_sc: "正月初五（破五）是商家传统的开业日，人们燃放爆竹迎接财神。" },
    { q: "Which Spring Festival tradition involves children wearing new clothes?", q_tc: "春節的哪項傳統與孩子穿新衣有關？", q_sc: "春节的哪项传统与孩子穿新衣有关？", o: ["It is a universal tradition throughout the festival", "Only on the 3rd day", "Only during dragon dances", "Only at temple fairs"], o_tc: ["這是春節期間的普遍傳統", "僅在正月初三", "僅在舞龍時", "僅在廟會上"], o_sc: ["这是春节期间的普遍传统", "仅在正月初三", "仅在舞龙时", "仅在庙会上"], a: 0, e: "Wearing new clothes — from head to toe — during Spring Festival symbolises a fresh start. Old clothes represent old-year troubles to be discarded.", e_tc: "春節期間從頭到腳穿新衣象徵萬象更新。舊衣代表舊年的煩惱，應當丟棄。", e_sc: "春节期间从头到脚穿新衣象征万象更新。旧衣代表旧年的烦恼，应当丢弃。" },
    { q: "Dumplings (餃子) are shaped like ancient Chinese:", q_tc: "餃子的形狀像古代中國的：", q_sc: "饺子的形状像古代中国的：", o: ["Gold ingots (元寶)", "Coins", "Moons", "Fish"], o_tc: ["金元寶", "銅錢", "月亮", "魚"], o_sc: ["金元宝", "铜钱", "月亮", "鱼"], a: 0, e: "餃子 are shaped like yuanbao (元寶), gold or silver ingots used as currency in imperial China. Eating them symbolises welcoming wealth in the new year.", e_tc: "餃子的形狀像元寶——古代中國用作貨幣的金銀錠。吃餃子象徵在新的一年迎接財富。", e_sc: "饺子的形状像元宝——古代中国用作货币的金银锭。吃饺子象征在新的一年迎接财富。" },
    { q: "The Spring Festival's official name in Chinese is:", q_tc: "春節的正式中文名稱是：", q_sc: "春节的正式中文名称是：", o: ["春節 (Chūn Jié)", "新年 (Xīn Nián)", "過年 (Guò Nián)", "元旦 (Yuán Dàn)"], o_tc: ["春節", "新年", "過年", "元旦"], o_sc: ["春节", "新年", "过年", "元旦"], a: 0, e: "The official name is 春節 (Chūn Jié, Spring Festival). 新年 means 'New Year' generally, 過年 is colloquial for 'celebrating the New Year,' and 元旦 now refers to January 1st.", e_tc: "正式名稱是「春節」。「新年」泛指新的一年，「過年」是慶祝新年的口語說法，「元旦」現指公曆一月一日。", e_sc: "正式名称是「春节」。「新年」泛指新的一年，「过年」是庆祝新年的口语说法，「元旦」现指公历一月一日。" },
    // ===== LITERATURE & PHILOSOPHY (20) =====
    { q: "Which text is considered the foundational classic of Daoist philosophy?", q_tc: "哪一部經典被視為道家哲學的奠基之作？", q_sc: "哪一部经典被视为道家哲学的奠基之作？", o: ["Dao De Jing (道德經)", "Zhuangzi (莊子)", "Yi Jing (易經)", "Liezi (列子)"], o_tc: ["《道德經》", "《莊子》", "《易經》", "《列子》"], o_sc: ["《道德经》", "《庄子》", "《易经》", "《列子》"], a: 0, e: "The Dao De Jing (道德經), attributed to Laozi, is the foundational text of Daoism. Its 81 chapters explore the Dao, De (virtue), and Wu Wei (non-action).", e_tc: "《道德經》相傳為老子所著，是道家思想的奠基之作。全書共八十一章，探討道、德與無為的哲理。", e_sc: "《道德经》相传为老子所著，是道家思想的奠基之作。全书共八十一章，探讨道、德与无为的哲理。" },
    { q: "The concept of 無為 (Wú Wéi) is best translated as:", q_tc: "「無為」這個概念最恰當的翻譯是：", q_sc: "“无为”这个概念最恰当的翻译是：", o: ["Effortless action / non-forcing", "Complete inaction", "Meditation technique", "Moral cultivation"], o_tc: ["順應自然、不強求", "完全不行動", "冥想技術", "道德修養"], o_sc: ["顺应自然、不强求", "完全不行动", "冥想技术", "道德修养"], a: 0, e: "無為 means 'effortless action' or 'non-forcing' — acting in harmony with the natural flow rather than through forceful effort. It does NOT mean doing nothing.", e_tc: "「無為」意指順應自然、不強求——與自然之道和諧一致地行動，而非以蠻力強為。它絕非「什麼都不做」的意思。", e_sc: "“无为”意指顺应自然、不强求——与自然之道和谐一致地行动，而非以蛮力强为。它绝非“什么都不做”的意思。" },
    { q: "The Eight Immortals (八仙) are figures from which tradition?", q_tc: "八仙是哪一個傳統中的人物？", q_sc: "八仙是哪一个传统中的人物？", o: ["Daoism", "Buddhism", "Confucianism", "Chinese folk religion only"], o_tc: ["道教", "佛教", "儒家", "僅限民間信仰"], o_sc: ["道教", "佛教", "儒家", "仅限民间信仰"], a: 0, e: "The Eight Immortals (八仙 Bāxiān) are legendary Daoist figures, each with distinct supernatural powers. They appear in literature from the Tang-Song period onward.", e_tc: "八仙是道教傳說中的人物，各自擁有獨特的神通法力。他們自唐宋以來便出現在各類文學作品中。", e_sc: "八仙是道教传说中的人物，各自拥有独特的神通法力。他们自唐宋以来便出现在各类文学作品中。" },
    { q: "《水滸傳》(Water Margin) features how many heroic outlaws?", q_tc: "《水滸傳》中共有多少位英雄好漢？", q_sc: "《水浒传》中共有多少位英雄好汉？", o: ["108", "36", "72", "64"], o_tc: ["一百零八位", "三十六位", "七十二位", "六十四位"], o_sc: ["一百零八位", "三十六位", "七十二位", "六十四位"], a: 0, e: "Water Margin by Shi Nai'an features 108 heroes of Liangshan Marsh — 36 Heavenly Spirits and 72 Earthly Fiends.", e_tc: "施耐庵所著的《水滸傳》共有一百零八位梁山好漢——三十六天罡星與七十二地煞星。", e_sc: "施耐庵所著的《水浒传》共有一百零八位梁山好汉——三十六天罡星与七十二地煞星。" },
    { q: "Sima Qian's 《史記》(Records of the Grand Historian) was written during which dynasty?", q_tc: "司馬遷的《史記》成書於哪個朝代？", q_sc: "司马迁的《史记》成书于哪个朝代？", o: ["Western Han", "Eastern Han", "Qin", "Tang"], o_tc: ["西漢", "東漢", "秦朝", "唐朝"], o_sc: ["西汉", "东汉", "秦朝", "唐朝"], a: 0, e: "Sima Qian (司馬遷) completed the Shiji around 94 BCE during the Western Han Dynasty. It is the first comprehensive Chinese historical text.", e_tc: "司馬遷約於公元前九十四年完成《史記》，時值西漢。這是中國第一部紀傳體通史。", e_sc: "司马迁约于公元前九十四年完成《史记》，时值西汉。这是中国第一部纪传体通史。" },
    { q: "The 'Four Books' (四書) of Confucianism include the Analerta, Mencius, Great Learning, and:", q_tc: "儒家「四書」包括《論語》、《孟子》、《大學》和：", q_sc: "儒家“四书”包括《论语》、《孟子》、《大学》和：", o: ["Doctrine of the Mean (中庸)", "Book of Changes (易經)", "Book of Songs (詩經)", "Spring and Autumn Annals (春秋)"], o_tc: ["《中庸》", "《易經》", "《詩經》", "《春秋》"], o_sc: ["《中庸》", "《易经》", "《诗经》", "《春秋》"], a: 0, e: "The Four Books (四書): 《論語》(Analerta), 《孟子》(Mencius), 《大學》(Great Learning), 《中庸》(Doctrine of the Mean). Zhu Xi compiled them in the Song Dynasty as the core Confucian curriculum.", e_tc: "四書為：《論語》、《孟子》、《大學》、《中庸》。南宋朱熹將其編定為儒學核心教材。", e_sc: "四书为：《论语》、《孟子》、《大学》、《中庸》。南宋朱熹将其编定为儒学核心教材。" },
    { q: "Which of the 'Four Great Classical Novels' features the Monkey King?", q_tc: "「四大名著」中哪一部以美猴王為主角？", q_sc: "“四大名著”中哪一部以美猴王为主角？", o: ["Journey to the West (西遊記)", "Romance of the Three Kingdoms (三國演義)", "Dream of the Red Chamber (紅樓夢)", "Water Margin (水滸傳)"], o_tc: ["《西遊記》", "《三國演義》", "《紅樓夢》", "《水滸傳》"], o_sc: ["《西游记》", "《三国演义》", "《红楼梦》", "《水浒传》"], a: 0, e: "Journey to the West (《西遊記》) by Wu Cheng'en features Sun Wukong (孫悟空), the Monkey King, who accompanies the monk Xuanzang on his pilgrimage to India.", e_tc: "吳承恩所著的《西遊記》以孫悟空（美猴王）為主角，講述他護送唐僧玄奘西天取經的故事。", e_sc: "吴承恩所著的《西游记》以孙悟空（美猴王）为主角，讲述他护送唐僧玄奘西天取经的故事。" },
    { q: "The Yi Jing (易經) uses a system of how many hexagrams?", q_tc: "《易經》的卦象系統共有多少卦？", q_sc: "《易经》的卦象系统共有多少卦？", o: ["64", "8", "32", "128"], o_tc: ["六十四卦", "八卦", "三十二卦", "一百二十八卦"], o_sc: ["六十四卦", "八卦", "三十二卦", "一百二十八卦"], a: 0, e: "The Yi Jing (I Ching) contains 64 hexagrams (六十四卦), each composed of 6 lines (either broken or unbroken). The 8 trigrams (八卦) combine in pairs to form them.", e_tc: "《易經》共有六十四卦，每卦由六爻（陰爻或陽爻）組成。八卦兩兩相疊即構成六十四卦。", e_sc: "《易经》共有六十四卦，每卦由六爻（阴爻或阳爻）组成。八卦两两相叠即构成六十四卦。" },
    { q: "Confucius emphasised which virtue as the foundation of social harmony?", q_tc: "孔子認為哪種美德是社會和諧的根本？", q_sc: "孔子认为哪种美德是社会和谐的根本？", o: ["仁 (Rén, benevolence)", "勇 (Yǒng, courage)", "智 (Zhì, wisdom)", "信 (Xìn, trust)"], o_tc: ["仁（仁愛）", "勇（勇氣）", "智（智慧）", "信（誠信）"], o_sc: ["仁（仁爱）", "勇（勇气）", "智（智慧）", "信（诚信）"], a: 0, e: "仁 (Rén, benevolence/humaneness) is the supreme Confucian virtue. Confucius taught that all proper social relationships flow from cultivating Rén within oneself.", e_tc: "「仁」是儒家最高的德行。孔子認為，一切正當的社會關係都源於自身仁德的修養。", e_sc: "“仁”是儒家最高的德行。孔子认为，一切正当的社会关系都源于自身仁德的修养。" },
    { q: "《三字經》(Three Character Classic) was traditionally the first text taught to:", q_tc: "《三字經》傳統上是教給誰的啟蒙讀物？", q_sc: "《三字经》传统上是教给谁的启蒙读物？", o: ["Children beginning their education", "Imperial examination candidates", "Buddhist monks", "Military officers"], o_tc: ["剛開始接受教育的兒童", "參加科舉考試的考生", "佛教僧侶", "軍官"], o_sc: ["刚开始接受教育的儿童", "参加科举考试的考生", "佛教僧侣", "军官"], a: 0, e: "The Three Character Classic (《三字經》) was the standard primer for children's education. Its rhythmic three-character verses made memorisation easy.", e_tc: "《三字經》是傳統兒童啟蒙的標準教材，每句三字、韻律朗朗上口，便於記誦。", e_sc: "《三字经》是传统儿童启蒙的标准教材，每句三字、韵律朗朗上口，便于记诵。" },
    { q: "Li Bai (李白) is most celebrated as a poet of which dynasty?", q_tc: "李白最為人所稱頌的身份是哪個朝代的詩人？", q_sc: "李白最为人所称颂的身份是哪个朝代的诗人？", o: ["Tang Dynasty", "Song Dynasty", "Han Dynasty", "Ming Dynasty"], o_tc: ["唐朝", "宋朝", "漢朝", "明朝"], o_sc: ["唐朝", "宋朝", "汉朝", "明朝"], a: 0, e: "Li Bai (李白, 701-762) is the greatest Romantic poet of the Tang Dynasty. Known as the 'Immortal of Poetry' (詩仙), his works celebrate nature, freedom, and wine.", e_tc: "李白（701-762）是唐代最偉大的浪漫主義詩人，被譽為「詩仙」，其作品歌頌自然、自由與美酒。", e_sc: "李白（701-762）是唐代最伟大的浪漫主义诗人，被誉为“诗仙”，其作品歌颂自然、自由与美酒。" },
    { q: "Du Fu (杜甫) is known by which honourific title?", q_tc: "杜甫被尊稱為什麼？", q_sc: "杜甫被尊称为什么？", o: ["詩聖 (Poet Sage)", "詩仙 (Poet Immortal)", "詩魔 (Poet Demon)", "詩佛 (Poet Buddha)"], o_tc: ["詩聖", "詩仙", "詩魔", "詩佛"], o_sc: ["诗圣", "诗仙", "诗魔", "诗佛"], a: 0, e: "Du Fu (杜甫, 712-770) is called the 'Poet Sage' (詩聖) for his deep social consciousness and mastery of regulated verse. His works document the An Lushan Rebellion's devastation.", e_tc: "杜甫（712-770）因深切的社會關懷和精湛的律詩技藝而被尊為「詩聖」。他的作品記錄了安史之亂的慘烈。", e_sc: "杜甫（712-770）因深切的社会关怀和精湛的律诗技艺而被尊为“诗圣”。他的作品记录了安史之乱的惨烈。" },
    { q: "The 'Five Classics' (五經) predate the Four Books and include the Book of Songs, Book of Documents, Book of Rites, Book of Changes, and:", q_tc: "「五經」早於四書，包括《詩經》、《書經》、《禮記》、《易經》和：", q_sc: "“五经”早于四书，包括《诗经》、《书经》、《礼记》、《易经》和：", o: ["Spring and Autumn Annals (春秋)", "Analerta (論語)", "Dao De Jing (道德經)", "Art of War (孫子兵法)"], o_tc: ["《春秋》", "《論語》", "《道德經》", "《孫子兵法》"], o_sc: ["《春秋》", "《论语》", "《道德经》", "《孙子兵法》"], a: 0, e: "The Five Classics (五經): 《詩經》(Songs), 《書經》(Documents), 《禮記》(Rites), 《易經》(Changes), 《春秋》(Spring and Autumn Annals). A sixth — Music — was lost.", e_tc: "五經為：《詩經》、《書經》、《禮記》、《易經》、《春秋》。原有第六經《樂經》，惜已失傳。", e_sc: "五经为：《诗经》、《书经》、《礼记》、《易经》、《春秋》。原有第六经《乐经》，惜已失传。" },
    { q: "Dream of the Red Chamber (紅樓夢) was written by:", q_tc: "《紅樓夢》的作者是：", q_sc: "《红楼梦》的作者是：", o: ["Cao Xueqin (曹雪芹)", "Luo Guanzhong (羅貫中)", "Wu Cheng'en (吳承恩)", "Pu Songling (蒲松齡)"], o_tc: ["曹雪芹", "羅貫中", "吳承恩", "蒲松齡"], o_sc: ["曹雪芹", "罗贯中", "吴承恩", "蒲松龄"], a: 0, e: "Cao Xueqin (曹雪芹, c. 1715-1763) wrote most of 紅樓夢. It is considered the pinnacle of Chinese fiction, depicting the decline of a noble family.", e_tc: "曹雪芹（約1715-1763）撰寫了《紅樓夢》的大部分篇章。此書被譽為中國小說的巔峰之作，描寫了一個貴族世家的衰落。", e_sc: "曹雪芹（约1715-1763）撰写了《红楼梦》的大部分篇章。此书被誉为中国小说的巅峰之作，描写了一个贵族世家的衰落。" },
    { q: "Sun Tzu's 《孫子兵法》(Art of War) contains how many chapters?", q_tc: "孫子的《孫子兵法》共有多少篇？", q_sc: "孙子的《孙子兵法》共有多少篇？", o: ["13", "36", "7", "24"], o_tc: ["十三篇", "三十六篇", "七篇", "二十四篇"], o_sc: ["十三篇", "三十六篇", "七篇", "二十四篇"], a: 0, e: "The Art of War contains 13 chapters covering strategy, terrain, espionage, and other military topics. It remains studied in military academies and business schools worldwide.", e_tc: "《孫子兵法》共十三篇，涵蓋戰略、地形、用間等軍事課題。至今仍為全球軍事院校和商學院的必讀經典。", e_sc: "《孙子兵法》共十三篇，涵盖战略、地形、用间等军事课题。至今仍为全球军事院校和商学院的必读经典。" },
    { q: "Which philosopher argued that human nature is inherently good (性善)?", q_tc: "哪位哲學家主張人性本善（性善說）？", q_sc: "哪位哲学家主张人性本善（性善说）？", o: ["Mencius (孟子)", "Xunzi (荀子)", "Han Feizi (韓非子)", "Mozi (墨子)"], o_tc: ["孟子", "荀子", "韓非子", "墨子"], o_sc: ["孟子", "荀子", "韩非子", "墨子"], a: 0, e: "Mencius (孟子, c. 372-289 BCE) argued that all humans are born with innate goodness (性善說). His rival Xunzi (荀子) countered that human nature is inherently flawed (性惡說).", e_tc: "孟子（約公元前372-289年）主張人皆生而具有善性（性善說）。其論敵荀子則認為人性本惡（性惡說）。", e_sc: "孟子（约公元前372-289年）主张人皆生而具有善性（性善说）。其论敌荀子则认为人性本恶（性恶说）。" },
    { q: "The 'Strange Tales from a Chinese Studio' (《聊齋志異》) collects stories about:", q_tc: "《聊齋志異》收錄的是關於什麼的故事？", q_sc: "《聊斋志异》收录的是关于什么的故事？", o: ["Fox spirits, ghosts, and supernatural beings", "Historical battles", "Imperial court politics", "Travel adventures"], o_tc: ["狐仙、鬼怪與超自然存在", "歷史戰役", "宮廷政治", "旅行冒險"], o_sc: ["狐仙、鬼怪与超自然存在", "历史战役", "宫廷政治", "旅行冒险"], a: 0, e: "Pu Songling's 《聊齋志異》(c. 1679) collects nearly 500 tales of fox spirits, ghosts, and the supernatural. It uses fantasy to critique social injustice.", e_tc: "蒲松齡的《聊齋志異》（約1679年）收錄了近五百篇狐仙、鬼怪與超自然的故事，以奇幻寓言針砭社會不公。", e_sc: "蒲松龄的《聊斋志异》（约1679年）收录了近五百篇狐仙、鬼怪与超自然的故事，以奇幻寓言针砭社会不公。" },
    { q: "Which text begins with the famous line '道可道，非常道' (The Way that can be told is not the eternal Way)?", q_tc: "哪部經典以「道可道，非常道」這句名言開篇？", q_sc: "哪部经典以“道可道，非常道”这句名言开篇？", o: ["Dao De Jing (道德經)", "Zhuangzi (莊子)", "Yi Jing (易經)", "Analerta (論語)"], o_tc: ["《道德經》", "《莊子》", "《易經》", "《論語》"], o_sc: ["《道德经》", "《庄子》", "《易经》", "《论语》"], a: 0, e: "The opening line of the Dao De Jing establishes that the true Dao transcends language and conceptual understanding.", e_tc: "《道德經》的開篇之語揭示了真正的道超越語言和概念所能表達的範疇。", e_sc: "《道德经》的开篇之语揭示了真正的道超越语言和概念所能表达的范畴。" },
    { q: "The concept of '氣' (Qì) in Chinese philosophy refers to:", q_tc: "中國哲學中的「氣」指的是：", q_sc: "中国哲学中的“气”指的是：", o: ["Vital energy or life force pervading all things", "A type of martial arts technique", "A musical instrument", "A unit of measurement"], o_tc: ["貫穿萬物的生命能量", "一種武術技法", "一種樂器", "一種度量單位"], o_sc: ["贯穿万物的生命能量", "一种武术技法", "一种乐器", "一种度量单位"], a: 0, e: "氣 (Qì) is the fundamental concept of vital energy that permeates the universe. It underpins Chinese medicine, martial arts, feng shui, and cosmology.", e_tc: "「氣」是貫穿宇宙萬物的生命能量，是中醫、武術、風水與宇宙觀的基礎概念。", e_sc: "“气”是贯穿宇宙万物的生命能量，是中医、武术、风水与宇宙观的基础概念。" },
    { q: "Zhuangzi's famous 'Butterfly Dream' parable questions:", q_tc: "莊子著名的「莊周夢蝶」寓言探討的是：", q_sc: "庄子著名的“庄周梦蝶”寓言探讨的是：", o: ["The nature of reality and identity", "The afterlife", "The meaning of loyalty", "The importance of education"], o_tc: ["現實與自我的本質", "死後的世界", "忠誠的意義", "教育的重要性"], o_sc: ["现实与自我的本质", "死后的世界", "忠诚的意义", "教育的重要性"], a: 0, e: "In the parable, Zhuangzi dreams he is a butterfly and upon waking cannot determine whether he is a man who dreamed of being a butterfly, or a butterfly now dreaming of being a man.", e_tc: "在這則寓言中，莊子夢見自己變成蝴蝶，醒來後無法確定自己究竟是夢為蝴蝶的人，還是正在夢為人的蝴蝶。", e_sc: "在这则寓言中，庄子梦见自己变成蝴蝶，醒来后无法确定自己究竟是梦为蝴蝶的人，还是正在梦为人的蝴蝶。" },

    // ===== MARTIAL ARTS (15) =====
    { q: "The character 武 (wǔ, martial) is composed of which two components?", q_tc: "「武」字由哪兩個部件組成？", q_sc: "“武”字由哪两个部件组成？", o: ["止 (stop) + 戈 (weapon)", "力 (force) + 刀 (blade)", "人 (person) + 弓 (bow)", "手 (hand) + 矛 (spear)"], o_tc: ["止（停止）+ 戈（兵器）", "力（力量）+ 刀（刀刃）", "人（人）+ 弓（弓）", "手（手）+ 矛（矛）"], o_sc: ["止（停止）+ 戈（兵器）", "力（力量）+ 刀（刀刃）", "人（人）+ 弓（弓）", "手（手）+ 矛（矛）"], a: 0, e: "武 combines 止 (to stop) and 戈 (a weapon), embodying the paradox that the highest martial achievement is the ability to stop conflict.", e_tc: "「武」由「止」與「戈」組成，蘊含武學最高境界乃止戈為武、化解衝突的深意。", e_sc: "“武”由“止”与“戈”组成，蕴含武学最高境界乃止戈为武、化解冲突的深意。" },
    { q: "Xingyiquan (形意拳) directly maps its five core techniques to which system?", q_tc: "形意拳的五行拳直接對應哪一套體系？", q_sc: "形意拳的五行拳直接对应哪一套体系？", o: ["Wu Xing (Five Elements)", "Ba Gua (Eight Trigrams)", "Twelve Zodiac Animals", "Yin-Yang theory"], o_tc: ["五行", "八卦", "十二生肖", "陰陽學說"], o_sc: ["五行", "八卦", "十二生肖", "阴阳学说"], a: 0, e: "Xingyiquan's five fist techniques correspond to Metal (splitting), Water (drilling), Wood (crushing), Fire (pounding), and Earth (crossing).", e_tc: "形意拳五行拳分別對應金（劈拳）、水（鑽拳）、木（崩拳）、火（炮拳）、土（橫拳）。", e_sc: "形意拳五行拳分别对应金（劈拳）、水（钻拳）、木（崩拳）、火（炮拳）、土（横拳）。" },
    { q: "Taijiquan (太極拳) is philosophically rooted in:", q_tc: "太極拳的哲學根基在於：", q_sc: "太极拳的哲学根基在于：", o: ["The interplay of Yin and Yang", "Buddhist meditation", "Legalist discipline", "Confucian ritual"], o_tc: ["陰陽相互作用", "佛教冥想", "法家紀律", "儒家禮儀"], o_sc: ["阴阳相互作用", "佛教冥想", "法家纪律", "儒家礼仪"], a: 0, e: "Taijiquan embodies the Daoist principle of Yin-Yang harmony — yielding overcomes force, softness transforms hardness. The taiji symbol (☯) represents this balance.", e_tc: "太極拳體現了道家陰陽和諧的理念——以柔克剛、以退為進。太極圖（☯）正是這種平衡的象徵。", e_sc: "太极拳体现了道家阴阳和谐的理念——以柔克刚、以退为进。太极图（☯）正是这种平衡的象征。" },
    { q: "The Shaolin Temple (少林寺) is located on which sacred mountain?", q_tc: "少林寺坐落在哪座名山上？", q_sc: "少林寺坐落在哪座名山上？", o: ["Song Shan (嵩山)", "Wudang Shan (武當山)", "Emei Shan (峨眉山)", "Hua Shan (華山)"], o_tc: ["嵩山", "武當山", "峨眉山", "華山"], o_sc: ["嵩山", "武当山", "峨眉山", "华山"], a: 0, e: "The Shaolin Temple sits on Song Shan (嵩山) in Henan province. It is traditionally considered the birthplace of Chan (Zen) Buddhism and Shaolin martial arts.", e_tc: "少林寺位於河南省嵩山，傳統上被視為禪宗佛教和少林武術的發源地。", e_sc: "少林寺位于河南省嵩山，传统上被视为禅宗佛教和少林武术的发源地。" },
    { q: "Wudang Mountain (武當山) is traditionally associated with:", q_tc: "武當山傳統上與什麼相關聯？", q_sc: "武当山传统上与什么相关联？", o: ["Internal martial arts and Daoism", "Shaolin kung fu", "Confucian academies", "Buddhist pilgrimage"], o_tc: ["內家拳與道教", "少林功夫", "儒家書院", "佛教朝聖"], o_sc: ["内家拳与道教", "少林功夫", "儒家书院", "佛教朝圣"], a: 0, e: "Wudang Shan is the traditional home of internal martial arts (內家拳) including Taijiquan, and is a major centre of Daoist practice and worship.", e_tc: "武當山是內家拳（包括太極拳）的傳統發源地，也是道教修行與信仰的重要聖地。", e_sc: "武当山是内家拳（包括太极拳）的传统发源地，也是道教修行与信仰的重要圣地。" },
    { q: "Baguazhang (八卦掌) practitioners are known for:", q_tc: "八卦掌練習者最著名的特點是：", q_sc: "八卦掌练习者最著名的特点是：", o: ["Walking in circles", "Standing meditation", "Jumping kicks", "Weapon forms only"], o_tc: ["走圈", "站樁", "騰空踢腿", "僅練兵器套路"], o_sc: ["走圈", "站桩", "腾空踢腿", "仅练兵器套路"], a: 0, e: "Baguazhang (Eight Trigram Palm) is characterised by constant circle-walking (走圈), with practitioners changing direction and palm techniques while circling.", e_tc: "八卦掌（八卦掌）的特色在於不斷走圈（走圈），練習者在繞圈時變換方向和掌法。", e_sc: "八卦掌的特色在于不断走圈，练习者在绕圈时变换方向和掌法。" },
    { q: "The concept of 'internal' (內家) martial arts emphasises:", q_tc: "「內家」武術強調的是：", q_sc: "“内家”武术强调的是：", o: ["Qi cultivation, relaxation, and internal power", "External muscle strength", "Acrobatic techniques", "Weapon proficiency"], o_tc: ["氣的修煉、放鬆與內勁", "外在肌肉力量", "雜技技巧", "兵器精通"], o_sc: ["气的修炼、放松与内劲", "外在肌肉力量", "杂技技巧", "兵器精通"], a: 0, e: "Internal martial arts (內家拳) — including Taijiquan, Xingyiquan, and Baguazhang — emphasise qi cultivation, mental focus, and using softness to overcome hardness.", e_tc: "內家拳——包括太極拳、形意拳和八卦掌——注重氣的修煉、意念專注，以柔克剛。", e_sc: "内家拳——包括太极拳、形意拳和八卦掌——注重气的修炼、意念专注，以柔克刚。" },
    { q: "Which legendary figure is traditionally credited with founding Shaolin martial arts?", q_tc: "傳說中哪位人物被認為是少林武術的創始者？", q_sc: "传说中哪位人物被认为是少林武术的创始者？", o: ["Bodhidharma (達摩)", "Zhang Sanfeng (張三豐)", "Yue Fei (岳飛)", "Guan Yu (關羽)"], o_tc: ["達摩", "張三豐", "岳飛", "關羽"], o_sc: ["达摩", "张三丰", "岳飞", "关羽"], a: 0, e: "Bodhidharma (達摩, c. 5th-6th century) is traditionally credited with teaching exercises to Shaolin monks that evolved into kung fu, though this is debated by historians.", e_tc: "達摩（約五至六世紀）相傳曾教授少林僧人強身健體的功法，後演化為少林功夫，但此說法在史學界仍有爭議。", e_sc: "达摩（约五至六世纪）相传曾教授少林僧人强身健体的功法，后演化为少林功夫，但此说法在史学界仍有争议。" },
    { q: "The 'Eighteen Arms of Wushu' (十八般武藝) refers to:", q_tc: "「十八般武藝」指的是：", q_sc: "“十八般武艺”指的是：", o: ["Eighteen traditional weapon categories", "Eighteen body techniques", "Eighteen pressure points", "Eighteen training stages"], o_tc: ["十八種傳統兵器類別", "十八種身法技巧", "十八個穴位", "十八個訓練階段"], o_sc: ["十八种传统兵器类别", "十八种身法技巧", "十八个穴位", "十八个训练阶段"], a: 0, e: "The Eighteen Arms (十八般武藝) are the traditional weapon categories of Chinese martial arts, including sword (劍), sabre (刀), spear (槍), staff (棍), and others.", e_tc: "十八般武藝是中國武術的傳統兵器類別，包括劍、刀、槍、棍等。", e_sc: "十八般武艺是中国武术的传统兵器类别，包括剑、刀、枪、棍等。" },
    { q: "Wing Chun (詠春拳) is traditionally attributed to:", q_tc: "詠春拳傳統上被認為源自：", q_sc: "咏春拳传统上被认为源自：", o: ["A woman named Yim Wing-chun", "A Shaolin monk", "A Wudang priest", "A military general"], o_tc: ["一位名叫嚴詠春的女子", "一位少林僧人", "一位武當道士", "一位軍事將領"], o_sc: ["一位名叫严咏春的女子", "一位少林僧人", "一位武当道士", "一位军事将领"], a: 0, e: "According to legend, Wing Chun was created by the Buddhist nun Ng Mui (五枚) and named after her student Yim Wing-chun (嚴詠春). Bruce Lee studied Wing Chun under Ip Man.", e_tc: "相傳詠春拳由佛門尼姑五枚師太所創，並以其弟子嚴詠春命名。李小龍曾師從葉問學習詠春。", e_sc: "相传咏春拳由佛门尼姑五枚师太所创，并以其弟子严咏春命名。李小龙曾师从叶问学习咏春。" },
    { q: "The Jian (劍) and Dao (刀) differ primarily in that:", q_tc: "劍和刀的主要區別在於：", q_sc: "剑和刀的主要区别在于：", o: ["Jian is double-edged; Dao is single-edged", "Jian is longer", "Dao is a polearm", "They are identical"], o_tc: ["劍為雙刃，刀為單刃", "劍更長", "刀是長柄武器", "兩者完全相同"], o_sc: ["剑为双刃，刀为单刃", "剑更长", "刀是长柄武器", "两者完全相同"], a: 0, e: "The Jian (劍) is a straight, double-edged sword — the 'gentleman of weapons.' The Dao (刀) is a curved, single-edged sabre — the 'marshal of weapons.'", e_tc: "劍為直身雙刃，號稱「百兵之君」；刀為彎身單刃，號稱「百兵之帥」。", e_sc: "剑为直身双刃，号称“百兵之君”；刀为弯身单刃，号称“百兵之帅”。" },
    { q: "Qigong (氣功) can be translated as:", q_tc: "「氣功」可以翻譯為：", q_sc: "“气功”可以翻译为：", o: ["Energy cultivation / breath work", "Fighting technique", "Weapon training", "Meditation only"], o_tc: ["能量修煉／吐納功法", "格鬥技術", "兵器訓練", "僅限冥想"], o_sc: ["能量修炼／吐纳功法", "格斗技术", "兵器训练", "仅限冥想"], a: 0, e: "Qigong (氣功) means 'energy work' or 'breath cultivation.' It encompasses breathing exercises, gentle movement, and meditation to cultivate and balance qi.", e_tc: "「氣功」意為能量修煉或吐納功法，涵蓋呼吸練習、柔和動作與冥想，以培養和調和體內之氣。", e_sc: "“气功”意为能量修炼或吐纳功法，涵盖呼吸练习、柔和动作与冥想，以培养和调和体内之气。" },
    { q: "Zhang Sanfeng (張三豐) is legendarily credited with creating:", q_tc: "傳說中張三豐被認為創立了：", q_sc: "传说中张三丰被认为创立了：", o: ["Taijiquan", "Shaolin Kung Fu", "Wing Chun", "Xingyiquan"], o_tc: ["太極拳", "少林功夫", "詠春拳", "形意拳"], o_sc: ["太极拳", "少林功夫", "咏春拳", "形意拳"], a: 0, e: "The Daoist immortal Zhang Sanfeng is traditionally credited with creating Taijiquan, inspired by observing a fight between a crane and a snake on Wudang Mountain.", e_tc: "道教仙人張三豐相傳在武當山觀察鶴蛇相鬥後受到啟發，創立了太極拳。", e_sc: "道教仙人张三丰相传在武当山观察鹤蛇相斗后受到启发，创立了太极拳。" },
    { q: "Drunken Boxing (醉拳) mimics the movements of:", q_tc: "醉拳模仿的是什麼樣的動作？", q_sc: "醉拳模仿的是什么样的动作？", o: ["An intoxicated person", "A sleeping person", "A falling leaf", "An animal"], o_tc: ["醉酒之人", "熟睡之人", "飄落的樹葉", "動物"], o_sc: ["醉酒之人", "熟睡之人", "飘落的树叶", "动物"], a: 0, e: "Drunken Boxing (醉拳) uses deceptive stumbling, swaying, and falling movements that disguise powerful strikes. The practitioner appears drunk but is in complete control.", e_tc: "醉拳運用迷惑性的踉蹌、搖晃和跌倒動作來掩飾強力的攻擊。習練者看似醉態百出，實則完全掌控全局。", e_sc: "醉拳运用迷惑性的踉跄、摇晃和跌倒动作来掩饰强力的攻击。习练者看似醉态百出，实则完全掌控全局。" },
    { q: "The term '功夫' (Gōngfu / Kung Fu) originally meant:", q_tc: "「功夫」一詞的原意是：", q_sc: "“功夫”一词的原意是：", o: ["Skill achieved through hard work and time", "Fighting ability", "A specific martial art style", "Physical strength"], o_tc: ["經過刻苦磨練而習得的技藝", "搏擊能力", "一種特定的武術門派", "體力"], o_sc: ["经过刻苦磨练而习得的技艺", "搏击能力", "一种特定的武术门派", "体力"], a: 0, e: "功夫 literally means 'skill achieved through effort over time.' It can refer to mastery of any discipline — tea-making, calligraphy, or cooking — not just martial arts.", e_tc: "「功夫」字面意思是經過長時間努力而獲得的技藝。它可以指任何領域的精湛造詣——泡茶、書法或烹飪——並非僅指武術。", e_sc: "“功夫”字面意思是经过长时间努力而获得的技艺。它可以指任何领域的精湛造诣——泡茶、书法或烹饪——并非仅指武术。" },

    // ===== WUXIA (12) =====
    { q: "Jin Yong (金庸) is considered the greatest wuxia novelist. His real name was:", q_tc: "金庸被譽為最偉大的武俠小說家，他的本名是：", q_sc: "金庸被誉为最伟大的武侠小说家，他的本名是：", o: ["Louis Cha Leung-yung (查良鏞)", "Gu Long (古龍)", "Liang Yusheng (梁羽生)", "Xiong Yaohua (熊耀華)"], o_tc: ["查良鏞", "古龍", "梁羽生", "熊耀華"], o_sc: ["查良镛", "古龙", "梁羽生", "熊耀华"], a: 0, e: "Jin Yong's real name was Louis Cha Leung-yung (查良鏞, 1924-2018). He wrote 15 novels that define modern wuxia, selling over 300 million copies.", e_tc: "金庸本名查良鏞（1924-2018），一生創作十五部武俠小說，奠定了現代武俠的格局，總銷量逾三億冊。", e_sc: "金庸本名查良镛（1924-2018），一生创作十五部武侠小说，奠定了现代武侠的格局，总销量逾三亿册。" },
    { q: "Jin Yong's 'Condor Trilogy' begins with which novel?", q_tc: "金庸的「射鵰三部曲」以哪部小說開篇？", q_sc: "金庸的“射雕三部曲”以哪部小说开篇？", o: ["The Legend of the Condor Heroes (射鵰英雄傳)", "The Return of the Condor Heroes (神鵰俠侶)", "The Heaven Sword and Dragon Sabre (倚天屠龍記)", "A Hero Born"], o_tc: ["《射鵰英雄傳》", "《神鵰俠侶》", "《倚天屠龍記》", "《射鵰英雄傳》英譯本"], o_sc: ["《射雕英雄传》", "《神雕侠侣》", "《倚天屠龙记》", "《射雕英雄传》英译本"], a: 0, e: "The Condor Trilogy: 《射鵰英雄傳》(Legend of the Condor Heroes), 《神鵰俠侶》(Return of the Condor Heroes), 《倚天屠龍記》(Heaven Sword and Dragon Sabre).", e_tc: "射鵰三部曲依序為：《射鵰英雄傳》、《神鵰俠侶》、《倚天屠龍記》。", e_sc: "射雕三部曲依序为：《射雕英雄传》、《神雕侠侣》、《倚天屠龙记》。" },
    { q: "Gu Long's (古龍) wuxia style is best characterised as:", q_tc: "古龍的武俠風格最恰當的形容是：", q_sc: "古龙的武侠风格最恰当的形容是：", o: ["Noir, poetic, and psychologically intense", "Epic historical romance", "Comedy and satire", "Military strategy focused"], o_tc: ["黑色、詩意且心理描寫深刻", "宏大的歷史傳奇", "喜劇與諷刺", "側重軍事謀略"], o_sc: ["黑色、诗意且心理描写深刻", "宏大的历史传奇", "喜剧与讽刺", "侧重军事谋略"], a: 0, e: "Gu Long (1938-1985) pioneered a noir, hardboiled wuxia style with short poetic sentences, psychological depth, and detective-like plots — a stark contrast to Jin Yong's epic storytelling.", e_tc: "古龍（1938-1985）開創了黑色硬派的武俠風格，以短句詩化的筆法、深入的心理刻畫和偵探式的情節著稱——與金庸的史詩敘事形成鮮明對比。", e_sc: "古龙（1938-1985）开创了黑色硬派的武侠风格，以短句诗化的笔法、深入的心理刻画和侦探式的情节著称——与金庸的史诗叙事形成鲜明对比。" },
    { q: "The concept of '江湖' (Jiānghú) in wuxia literally means:", q_tc: "武俠中「江湖」的字面意思是：", q_sc: "武侠中“江湖”的字面意思是：", o: ["Rivers and lakes", "Martial world", "Outlaw territory", "Hidden realm"], o_tc: ["江河與湖泊", "武林世界", "法外之地", "隱秘的國度"], o_sc: ["江河与湖泊", "武林世界", "法外之地", "隐秘的国度"], a: 0, e: "江湖 literally means 'rivers and lakes' but refers to the martial arts underworld — a parallel society of fighters, outlaws, sects, and wandering heroes operating outside state control.", e_tc: "「江湖」字面意思是江河與湖泊，但實指武林的地下世界——一個由武者、遊俠、門派和浪跡天涯的英雄組成、不受官府管轄的平行社會。", e_sc: "“江湖”字面意思是江河与湖泊，但实指武林的地下世界——一个由武者、游侠、门派和浪迹天涯的英雄组成、不受官府管辖的平行社会。" },
    { q: "Liang Yusheng (梁羽生) is credited as the founder of:", q_tc: "梁羽生被譽為什麼的開創者？", q_sc: "梁羽生被誉为什么的开创者？", o: ["The 'New School' of wuxia fiction", "Wuxia cinema", "Classical wuxia poetry", "Martial arts manuals"], o_tc: ["「新派」武俠小說", "武俠電影", "古典武俠詩詞", "武術指南"], o_sc: ["“新派”武侠小说", "武侠电影", "古典武侠诗词", "武术指南"], a: 0, e: "Liang Yusheng (1924-2009) published 《龍虎鬥京華》in 1954, inaugurating the 'New School' (新派) of wuxia that combined historical settings with modern narrative techniques.", e_tc: "梁羽生（1924-2009）於1954年發表《龍虎鬥京華》，開創了「新派」武俠小說，將歷史背景與現代敘事手法相結合。", e_sc: "梁羽生（1924-2009）于1954年发表《龙虎斗京华》，开创了“新派”武侠小说，将历史背景与现代叙事手法相结合。" },
    { q: "Which wuxia film by Ang Lee won the Academy Award for Best Foreign Language Film?", q_tc: "李安執導的哪部武俠電影獲得了奧斯卡最佳外語片獎？", q_sc: "李安执导的哪部武侠电影获得了奥斯卡最佳外语片奖？", o: ["Crouching Tiger, Hidden Dragon (2000)", "Hero (2002)", "House of Flying Daggers (2004)", "The Grandmaster (2013)"], o_tc: ["《臥虎藏龍》（2000）", "《英雄》（2002）", "《十面埋伏》（2004）", "《一代宗師》（2013）"], o_sc: ["《卧虎藏龙》（2000）", "《英雄》（2002）", "《十面埋伏》（2004）", "《一代宗师》（2013）"], a: 0, e: "Crouching Tiger, Hidden Dragon (《臥虎藏龍》, 2000) won the Oscar for Best Foreign Language Film and was nominated for 10 total, bringing wuxia to global audiences.", e_tc: "《臥虎藏龍》（2000）榮獲奧斯卡最佳外語片獎，共獲十項提名，將武俠電影推向了全球觀眾。", e_sc: "《卧虎藏龙》（2000）荣获奥斯卡最佳外语片奖，共获十项提名，将武侠电影推向了全球观众。" },
    { q: "The 'Five Greats' (五絕) in Jin Yong's Condor Heroes are masters of:", q_tc: "金庸《射鵰英雄傳》中的「五絕」精通的是：", q_sc: "金庸《射雕英雄传》中的“五绝”精通的是：", o: ["Supreme martial arts, each representing a direction", "The five elements", "Five weapons", "Five philosophies"], o_tc: ["絕頂武學，各據一方", "五行之術", "五種兵器", "五種哲學"], o_sc: ["绝顶武学，各据一方", "五行之术", "五种兵器", "五种哲学"], a: 0, e: "The Five Greats — East Heretic, West Venom, South Emperor, North Beggar, and Central Divine — are the supreme martial artists, each associated with a cardinal direction and the centre.", e_tc: "五絕——東邪、西毒、南帝、北丐、中神通——是天下武功最高的五位宗師，各據東西南北中一方。", e_sc: "五绝——东邪、西毒、南帝、北丐、中神通——是天下武功最高的五位宗师，各据东西南北中一方。" },
    { q: "King Hu's (胡金銓) groundbreaking wuxia film 'A Touch of Zen' (1971) won a prize at:", q_tc: "胡金銓開創性的武俠電影《俠女》（1971）在哪個電影節獲獎？", q_sc: "胡金铨开创性的武侠电影《侠女》（1971）在哪个电影节获奖？", o: ["Cannes Film Festival", "Venice Film Festival", "Berlin Film Festival", "Sundance"], o_tc: ["坎城影展", "威尼斯影展", "柏林影展", "日舞影展"], o_sc: ["戛纳电影节", "威尼斯电影节", "柏林电影节", "圣丹斯电影节"], a: 0, e: "A Touch of Zen (《俠女》) won the Grand Prix at Cannes in 1975. King Hu pioneered the wuxia film genre with innovative wire work and poetic cinematography.", e_tc: "《俠女》於1975年榮獲坎城影展評審團大獎。胡金銓以創新的吊鋼絲技術和詩意的攝影風格開創了武俠電影的新紀元。", e_sc: "《侠女》于1975年荣获戛纳电影节评审团大奖。胡金铨以创新的吊钢丝技术和诗意的摄影风格开创了武侠电影的新纪元。" },
    { q: "Chu Liuxiang (楚留香) is a famous character created by:", q_tc: "楚留香是哪位作家筆下的著名人物？", q_sc: "楚留香是哪位作家笔下的著名人物？", o: ["Gu Long (古龍)", "Jin Yong (金庸)", "Liang Yusheng (梁羽生)", "Wen Rui'an (溫瑞安)"], o_tc: ["古龍", "金庸", "梁羽生", "溫瑞安"], o_sc: ["古龙", "金庸", "梁羽生", "温瑞安"], a: 0, e: "Chu Liuxiang (楚留香), the 'Fragrant Knight,' is Gu Long's suave, gentlemanly thief-detective. The character has been adapted into numerous TV series and films.", e_tc: "楚留香是古龍筆下風度翩翩的盜帥偵探，綽號「盜帥」。這一角色被多次改編為電視劇和電影。", e_sc: "楚留香是古龙笔下风度翩翩的盗帅侦探，绰号“盗帅”。这一角色被多次改编为电视剧和电影。" },
    { q: "The Shaw Brothers studio was important to wuxia because:", q_tc: "邵氏兄弟電影公司對武俠的重要性在於：", q_sc: "邵氏兄弟电影公司对武侠的重要性在于：", o: ["They produced hundreds of martial arts films in Hong Kong", "They published wuxia novels", "They founded a martial arts school", "They invented wire-fu techniques"], o_tc: ["他們在香港製作了數百部武打片", "他們出版武俠小說", "他們創辦了武術學校", "他們發明了威亞技術"], o_sc: ["他们在香港制作了数百部武打片", "他们出版武侠小说", "他们创办了武术学校", "他们发明了威亚技术"], a: 0, e: "Shaw Brothers (邵氏兄弟) produced over 1,000 films from the 1950s-80s, establishing Hong Kong as the world capital of martial arts cinema.", e_tc: "邵氏兄弟自1950年代至80年代製作了超過一千部電影，使香港成為全球武打片的中心。", e_sc: "邵氏兄弟自1950年代至80年代制作了超过一千部电影，使香港成为全球武打片的中心。" },
    { q: "Zhang Yimou's 'Hero' (2002) is notable for its use of:", q_tc: "張藝謀的《英雄》（2002）以什麼手法著稱？", q_sc: "张艺谋的《英雄》（2002）以什么手法著称？", o: ["Colour symbolism tied to different narrative perspectives", "Black-and-white cinematography", "Animation sequences", "Documentary-style filming"], o_tc: ["以色彩象徵不同的敘事視角", "黑白攝影", "動畫片段", "紀錄片式拍攝"], o_sc: ["以色彩象征不同的叙事视角", "黑白摄影", "动画片段", "纪录片式拍摄"], a: 0, e: "Hero (《英雄》) uses distinct colour palettes — red, blue, white, green — for each retelling of events, creating a visually stunning meditation on truth and sacrifice.", e_tc: "《英雄》運用不同的色調——紅、藍、白、綠——呈現每一次對事件的重述，營造出視覺震撼的影像，深刻探討真相與犧牲的主題。", e_sc: "《英雄》运用不同的色调——红、蓝、白、绿——呈现每一次对事件的重述，营造出视觉震撼的影像，深刻探讨真相与牺牲的主题。" },
    { q: "The wuxia concept of '俠' (xiá) is best defined as:", q_tc: "武俠中「俠」的最佳定義是：", q_sc: "武侠中“侠”的最佳定义是：", o: ["A righteous person who uses martial skill to help the weak", "A professional soldier", "An imperial guard", "A wandering monk"], o_tc: ["以武藝行俠仗義、扶弱濟貧之人", "職業軍人", "御前侍衛", "雲遊僧人"], o_sc: ["以武艺行侠仗义、扶弱济贫之人", "职业军人", "御前侍卫", "云游僧人"], a: 0, e: "俠 (xiá) denotes a chivalrous hero who uses martial skill to defend the oppressed and uphold justice, often operating outside or against corrupt authority.", e_tc: "「俠」指以武藝保護弱者、伸張正義的英雄豪傑，他們往往行走於體制之外，甚至與貪腐的權貴對抗。", e_sc: "“侠”指以武艺保护弱者、伸张正义的英雄豪杰，他们往往行走于体制之外，甚至与贪腐的权贵对抗。" },
    // ===== FOLK ARTS (12) =====
    { q: "Southern lion dance (南獅) is historically connected to which institutions in Guangdong?", q_tc: "南獅在歷史上與廣東哪類機構有密切關聯？", q_sc: "南狮在历史上与广东哪类机构有密切关联？", o: ["Martial arts schools (武館)", "Buddhist temples", "Imperial courts", "Trading guilds"], o_tc: ["武館", "佛寺", "皇宮", "商會"], o_sc: ["武馆", "佛寺", "皇宫", "商会"], a: 0, e: "Southern lion dance (南獅) was traditionally maintained by martial arts schools (武館) in Canton. The lion's movements are grounded in southern kung fu techniques.", e_tc: "南獅傳統上由廣東的武館傳承維繫，獅子的動作根植於南派功夫技法。", e_sc: "南狮传统上由广东的武馆传承维系，狮子的动作根植于南派功夫技法。" },
    { q: "英歌舞 (Yīnggē dance) is a folk art tradition from which region?", q_tc: "英歌舞是源自哪個地區的民間藝術？", q_sc: "英歌舞是源自哪个地区的民间艺术？", o: ["Chaoshan (潮汕)", "Beijing", "Sichuan", "Shanghai"], o_tc: ["潮汕", "北京", "四川", "上海"], o_sc: ["潮汕", "北京", "四川", "上海"], a: 0, e: "Yingge dance (英歌舞) is a vigorous folk performance art from the Chaoshan region of Guangdong, featuring rhythmic drumming and martial arts-inspired choreography.", e_tc: "英歌舞是廣東潮汕地區一種剛健有力的民間表演藝術，以富有節奏的鑼鼓和融合武術動作的編排著稱。", e_sc: "英歌舞是广东潮汕地区一种刚健有力的民间表演艺术，以富有节奏的锣鼓和融合武术动作的编排著称。" },
    { q: "Chinese paper cutting (剪紙) is traditionally used for:", q_tc: "中國剪紙傳統上用於：", q_sc: "中国剪纸传统上用于：", o: ["Window decorations and festival celebrations", "Writing letters", "Wrapping gifts", "Religious scripture copying"], o_tc: ["窗花裝飾和節日慶祝", "書寫信件", "包裝禮物", "抄寫宗教經文"], o_sc: ["窗花装饰和节日庆祝", "书写信件", "包装礼物", "抄写宗教经文"], a: 0, e: "Paper cutting (剪紙) is used to decorate windows (窗花), doors, and walls during festivals, especially Spring Festival. UNESCO recognised it as Intangible Cultural Heritage in 2009.", e_tc: "剪紙用於在節日期間裝飾窗戶（窗花）、門和牆壁，尤其在春節期間。聯合國教科文組織於2009年將其列入非物質文化遺產。", e_sc: "剪纸用于在节日期间装饰窗户（窗花）、门和墙壁，尤其在春节期间。联合国教科文组织于2009年将其列入非物质文化遗产。" },
    { q: "Beijing Opera (京劇) uses how many main role types?", q_tc: "京劇有多少種主要行當？", q_sc: "京剧有多少种主要行当？", o: ["Four: Sheng, Dan, Jing, Chou", "Two: Male and Female", "Six: one per emotion", "Three: Hero, Villain, Clown"], o_tc: ["四種：生、旦、淨、丑", "兩種：男和女", "六種：每種情緒一種", "三種：英雄、反派、丑角"], o_sc: ["四种：生、旦、净、丑", "两种：男和女", "六种：每种情绪一种", "三种：英雄、反派、丑角"], a: 0, e: "Beijing Opera has four main roles: 生 (Shēng, male), 旦 (Dàn, female), 淨 (Jìng, painted-face), 丑 (Chǒu, clown). Each has distinct singing styles and makeup.", e_tc: "京劇有四大行當：生（男性角色）、旦（女性角色）、淨（花臉）、丑（丑角）。每種行當都有獨特的唱腔和妝容。", e_sc: "京剧有四大行当：生（男性角色）、旦（女性角色）、净（花脸）、丑（丑角）。每种行当都有独特的唱腔和妆容。" },
    { q: "The dragon dance (舞龍) typically requires how many performers?", q_tc: "舞龍通常需要多少名表演者？", q_sc: "舞龙通常需要多少名表演者？", o: ["9 or more, sometimes over 50", "2", "4", "6"], o_tc: ["9人或以上，有時超過50人", "2人", "4人", "6人"], o_sc: ["9人或以上，有时超过50人", "2人", "4人", "6人"], a: 0, e: "A standard dragon dance team has at least 9 performers holding the dragon on poles. Festival dragons can be over 100 metres long with 50+ handlers.", e_tc: "標準的舞龍隊至少需要9名表演者用桿支撐龍身。節日中的龍可長達100多米，需要50名以上的舞龍手。", e_sc: "标准的舞龙队至少需要9名表演者用杆支撑龙身。节日中的龙可长达100多米，需要50名以上的舞龙手。" },
    { q: "Chinese calligraphy's 'Four Treasures of the Study' (文房四寶) are:", q_tc: "中國書法的「文房四寶」是指：", q_sc: "中国书法的“文房四宝”是指：", o: ["Brush, ink, paper, inkstone", "Brush, pen, scroll, seal", "Paper, silk, jade, gold", "Book, lamp, desk, chair"], o_tc: ["筆、墨、紙、硯", "筆、鋼筆、卷軸、印章", "紙、絲綢、玉、金", "書、燈、桌、椅"], o_sc: ["笔、墨、纸、砚", "笔、钢笔、卷轴、印章", "纸、丝绸、玉、金", "书、灯、桌、椅"], a: 0, e: "The Four Treasures (文房四寶): 筆 (brush), 墨 (ink stick), 紙 (paper), 硯 (inkstone). Together they represent the scholar's essential tools.", e_tc: "文房四寶：筆（毛筆）、墨（墨條）、紙（宣紙）、硯（硯台），是古代文人書齋中不可或缺的書寫工具。", e_sc: "文房四宝：笔（毛笔）、墨（墨条）、纸（宣纸）、砚（砚台），是古代文人书斋中不可或缺的书写工具。" },
    { q: "Shadow puppetry (皮影戲) originated during approximately which dynasty?", q_tc: "皮影戲大約起源於哪個朝代？", q_sc: "皮影戏大约起源于哪个朝代？", o: ["Han Dynasty", "Tang Dynasty", "Song Dynasty", "Ming Dynasty"], o_tc: ["漢朝", "唐朝", "宋朝", "明朝"], o_sc: ["汉朝", "唐朝", "宋朝", "明朝"], a: 0, e: "Shadow puppetry (皮影戲) is traditionally said to have originated during the Han Dynasty when Emperor Wu's court magician created shadow figures to console the grieving emperor.", e_tc: "相傳皮影戲起源於漢代，漢武帝的方士為安慰悲痛的皇帝而創造了影子人偶。", e_sc: "相传皮影戏起源于汉代，汉武帝的方士为安慰悲痛的皇帝而创造了影子人偶。" },
    { q: "Chinese knot-tying (中國結) symbolises:", q_tc: "中國結象徵著：", q_sc: "中国结象征着：", o: ["Good luck, prosperity, and unity", "Mourning", "Military rank", "Academic achievement"], o_tc: ["吉祥、繁榮和團結", "哀悼", "軍階", "學術成就"], o_sc: ["吉祥、繁荣和团结", "哀悼", "军阶", "学术成就"], a: 0, e: "Chinese decorative knots (中國結) are tied from a single cord and symbolise good fortune, prosperity, and togetherness. The word 結 (jié, knot) sounds like 吉 (jí, auspicious).", e_tc: "中國結用一根繩編結而成，象徵吉祥、繁榮與團圓。「結」與「吉」諧音，寓意吉利。", e_sc: "中国结用一根绳编结而成，象征吉祥、繁荣与团圆。“结”与“吉”谐音，寓意吉利。" },
    { q: "Porcelain is called 'china' in English because:", q_tc: "英語中瓷器被稱為「china」是因為：", q_sc: "英语中瓷器被称为“china”是因为：", o: ["China was the first and greatest producer of porcelain", "The word 'china' means 'porcelain' in Chinese", "A British merchant named it", "It was discovered in the China Sea"], o_tc: ["中國是最早也是最出色的瓷器生產國", "「china」在中文裡意為瓷器", "由一位英國商人命名", "因在中國海域被發現"], o_sc: ["中国是最早也是最出色的瓷器生产国", "“china”在中文里意为瓷器", "由一位英国商人命名", "因在中国海域被发现"], a: 0, e: "China pioneered true porcelain during the Han Dynasty and perfected it in the Tang and Song. 'China' became synonymous with fine ceramic ware in Europe.", e_tc: "中國在漢代首創真正的瓷器，並在唐宋時期將其發展至巔峰。「China」一詞在歐洲成為精美瓷器的代名詞。", e_sc: "中国在汉代首创真正的瓷器，并在唐宋时期将其发展至巅峰。“China”一词在欧洲成为精美瓷器的代名词。" },
    { q: "The erhu (二胡) is a Chinese instrument with how many strings?", q_tc: "二胡有幾根弦？", q_sc: "二胡有几根弦？", o: ["Two", "Four", "One", "Six"], o_tc: ["兩根", "四根", "一根", "六根"], o_sc: ["两根", "四根", "一根", "六根"], a: 0, e: "The erhu (二胡) has two strings (二 means 'two'). It is a bowed string instrument often called the 'Chinese violin,' capable of deeply expressive melodies.", e_tc: "二胡有兩根弦（「二」即「兩」之意）。它是一種拉弦樂器，常被稱為「中國小提琴」，能奏出極富表現力的旋律。", e_sc: "二胡有两根弦（“二”即“两”之意）。它是一种拉弦乐器，常被称为“中国小提琴”，能奏出极富表现力的旋律。" },
    { q: "Cloisonné (景泰藍) enamelware is named after which Ming Dynasty reign period?", q_tc: "景泰藍琺瑯器以明朝哪個年號命名？", q_sc: "景泰蓝珐琅器以明朝哪个年号命名？", o: ["Jingtai (景泰)", "Yongle (永樂)", "Hongwu (洪武)", "Xuande (宣德)"], o_tc: ["景泰", "永樂", "洪武", "宣德"], o_sc: ["景泰", "永乐", "洪武", "宣德"], a: 0, e: "Cloisonné is called 景泰藍 (Jǐngtài Lán) because the technique was perfected during the Jingtai reign (1450-1457) and characteristically featured blue (藍) enamel.", e_tc: "景泰藍之所以得名，是因為這項工藝在景泰年間（1450-1457年）臻於完善，且以藍色琺瑯為顯著特色。", e_sc: "景泰蓝之所以得名，是因为这项工艺在景泰年间（1450-1457年）臻于完善，且以蓝色珐琅为显著特色。" },
    { q: "The art of seal carving (篆刻) combines which two disciplines?", q_tc: "篆刻藝術融合了哪兩門學問？", q_sc: "篆刻艺术融合了哪两门学问？", o: ["Calligraphy and sculpture", "Painting and pottery", "Poetry and music", "Weaving and dyeing"], o_tc: ["書法與雕刻", "繪畫與陶藝", "詩歌與音樂", "編織與染色"], o_sc: ["书法与雕刻", "绘画与陶艺", "诗歌与音乐", "编织与染色"], a: 0, e: "Seal carving (篆刻 zhuànkè) combines calligraphic artistry with sculptural skill. Artists carve characters into stone, creating personal seals used to sign paintings and documents.", e_tc: "篆刻將書法的藝術性與雕刻技法相結合。藝術家在石頭上雕刻文字，製作用於書畫和文書簽署的個人印章。", e_sc: "篆刻将书法的艺术性与雕刻技法相结合。艺术家在石头上雕刻文字，制作用于书画和文书签署的个人印章。" },

    // ===== TEA CULTURE (10) =====
    { q: "The classic text 《茶經》(The Classic of Tea) was written by:", q_tc: "經典著作《茶經》的作者是：", q_sc: "经典著作《茶经》的作者是：", o: ["Lu Yu (陸羽)", "Shen Nong (神農)", "Li Bai (李白)", "Su Shi (蘇軾)"], o_tc: ["陸羽", "神農", "李白", "蘇軾"], o_sc: ["陆羽", "神农", "李白", "苏轼"], a: 0, e: "Lu Yu (陸羽, 733-804) wrote 《茶經》during the Tang Dynasty. It is the world's first comprehensive treatise on tea cultivation, preparation, and appreciation.", e_tc: "陸羽（733-804年）於唐代撰寫了《茶經》，這是世界上第一部全面論述茶葉種植、製備和品鑑的專著。", e_sc: "陆羽（733-804年）于唐代撰写了《茶经》，这是世界上第一部全面论述茶叶种植、制备和品鉴的专著。" },
    { q: "According to legend, tea was discovered by:", q_tc: "根據傳說，茶是由誰發現的？", q_sc: "根据传说，茶是由谁发现的？", o: ["Shen Nong (神農)", "The Yellow Emperor", "Confucius", "Laozi"], o_tc: ["神農", "黃帝", "孔子", "老子"], o_sc: ["神农", "黄帝", "孔子", "老子"], a: 0, e: "Legend says the mythical emperor Shen Nong (神農) discovered tea around 2737 BCE when leaves blew into his boiling water. He is the patron saint of agriculture and medicine.", e_tc: "傳說神農大帝約在公元前2737年發現了茶——茶葉被風吹入他正在煮的開水中。神農是農業和醫藥之神。", e_sc: "传说神农大帝约在公元前2737年发现了茶——茶叶被风吹入他正在煮的开水中。神农是农业和医药之神。" },
    { q: "The six main categories of Chinese tea are:", q_tc: "中國茶的六大類是：", q_sc: "中国茶的六大类是：", o: ["Green, White, Yellow, Oolong, Red (Black), Dark (Pu-erh)", "Green, Black, Herbal, Fruit, Flower, Spiced", "Dragon Well, Tieguanyin, Pu-erh, Jasmine, Chrysanthemum, Lapsang", "Spring, Summer, Autumn, Winter, Morning, Evening"], o_tc: ["綠茶、白茶、黃茶、烏龍茶、紅茶、黑茶（普洱）", "綠茶、紅茶、花草茶、果茶、花茶、香料茶", "龍井、鐵觀音、普洱、茉莉花、菊花、正山小種", "春茶、夏茶、秋茶、冬茶、晨茶、暮茶"], o_sc: ["绿茶、白茶、黄茶、乌龙茶、红茶、黑茶（普洱）", "绿茶、红茶、花草茶、果茶、花茶、香料茶", "龙井、铁观音、普洱、茉莉花、菊花、正山小种", "春茶、夏茶、秋茶、冬茶、晨茶、暮茶"], a: 0, e: "The six categories are based on oxidation level: Green (綠茶, unoxidised), White (白茶), Yellow (黃茶), Oolong (烏龍茶, partially), Red/Black (紅茶, fully), Dark/Pu-erh (黑茶, post-fermented).", e_tc: "六大類依據氧化程度劃分：綠茶（未氧化）、白茶、黃茶、烏龍茶（半氧化）、紅茶（全氧化）、黑茶/普洱茶（後發酵）。", e_sc: "六大类依据氧化程度划分：绿茶（未氧化）、白茶、黄茶、乌龙茶（半氧化）、红茶（全氧化）、黑茶/普洱茶（后发酵）。" },
    { q: "Gongfu tea ceremony (功夫茶) originated in which region?", q_tc: "功夫茶起源於哪個地區？", q_sc: "功夫茶起源于哪个地区？", o: ["Fujian and Chaoshan (潮汕)", "Beijing", "Sichuan", "Yunnan"], o_tc: ["福建和潮汕", "北京", "四川", "雲南"], o_sc: ["福建和潮汕", "北京", "四川", "云南"], a: 0, e: "Gongfu cha (功夫茶) originated in the Fujian-Guangdong Chaoshan region. '功夫' here means 'skill and effort' — the ceremony uses small cups and precise brewing techniques.", e_tc: "功夫茶起源於福建與廣東潮汕地區。此處「功夫」意為「技藝和工夫」——沖泡時使用小杯和精確的泡茶技法。", e_sc: "功夫茶起源于福建与广东潮汕地区。此处“功夫”意为“技艺和工夫”——冲泡时使用小杯和精确的泡茶技法。" },
    { q: "Dragon Well (龍井) tea is a famous variety from:", q_tc: "龍井茶是哪裡的名茶？", q_sc: "龙井茶是哪里的名茶？", o: ["Hangzhou, Zhejiang", "Wuyi Mountains, Fujian", "Yunnan Province", "Anhui Province"], o_tc: ["浙江杭州", "福建武夷山", "雲南省", "安徽省"], o_sc: ["浙江杭州", "福建武夷山", "云南省", "安徽省"], a: 0, e: "Longjing (龍井, Dragon Well) is China's most famous green tea, grown near the West Lake in Hangzhou. It is pan-fired in a wok, producing flat, smooth leaves.", e_tc: "龍井是中國最著名的綠茶，產於杭州西湖附近。採用鍋炒工藝，茶葉扁平光滑。", e_sc: "龙井是中国最著名的绿茶，产于杭州西湖附近。采用锅炒工艺，茶叶扁平光滑。" },
    { q: "Pu-erh tea (普洱茶) is unique because it:", q_tc: "普洱茶的獨特之處在於：", q_sc: "普洱茶的独特之处在于：", o: ["Undergoes microbial fermentation and improves with age", "Is the most caffeinated tea", "Must be drunk immediately", "Is always flavoured with flowers"], o_tc: ["經過微生物發酵，且越陳越香", "是咖啡因含量最高的茶", "必須即泡即飲", "總是以花調味"], o_sc: ["经过微生物发酵，且越陈越香", "是咖啡因含量最高的茶", "必须即泡即饮", "总是以花调味"], a: 0, e: "Pu-erh (普洱茶) from Yunnan undergoes post-fermentation. Like wine, quality Pu-erh improves with age — vintage cakes can sell for tens of thousands of dollars.", e_tc: "產自雲南的普洱茶經過後發酵工藝。如同葡萄酒，優質普洱茶越陳越香——陳年茶餅可售價數萬美元。", e_sc: "产自云南的普洱茶经过后发酵工艺。如同葡萄酒，优质普洱茶越陈越香——陈年茶饼可售价数万美元。" },
    { q: "In traditional Chinese tea culture, what does 'pouring tea' for someone symbolise?", q_tc: "在中國傳統茶文化中，為他人「倒茶」象徵什麼？", q_sc: "在中国传统茶文化中，为他人“倒茶”象征什么？", o: ["Respect and gratitude", "Apology", "Challenge", "Farewell"], o_tc: ["尊重與感恩", "道歉", "挑戰", "告別"], o_sc: ["尊重与感恩", "道歉", "挑战", "告别"], a: 0, e: "Pouring tea shows respect. In Cantonese dim sum culture, tapping two fingers on the table after someone pours tea is a gesture of thanks (叩手禮), said to originate from Emperor Qianlong.", e_tc: "斟茶是表達尊敬的方式。在廣東飲茶文化中，別人倒茶後用兩根手指輕叩桌面以示感謝（叩手禮），相傳此禮源自乾隆皇帝。", e_sc: "斟茶是表达尊敬的方式。在广东饮茶文化中，别人倒茶后用两根手指轻叩桌面以示感谢（叩手礼），相传此礼源自乾隆皇帝。" },
    { q: "Yixing (宜興) teapots are prized because they are made from:", q_tc: "宜興茶壺之所以珍貴，是因為它們的材質是：", q_sc: "宜兴茶壶之所以珍贵，是因为它们的材质是：", o: ["Purple clay (紫砂) that absorbs tea flavour over time", "Pure gold", "Jade", "Bamboo"], o_tc: ["紫砂——能隨時間吸收茶香", "純金", "玉石", "竹子"], o_sc: ["紫砂——能随时间吸收茶香", "纯金", "玉石", "竹子"], a: 0, e: "Yixing purple clay (紫砂 zǐshā) teapots are porous and absorb tea oils over decades of use. A well-seasoned pot can produce flavourful tea with just hot water.", e_tc: "宜興紫砂壺質地多孔，經過數十年使用會逐漸吸收茶油。養好的壺只加熱水便能泡出醇香的茶。", e_sc: "宜兴紫砂壶质地多孔，经过数十年使用会逐渐吸收茶油。养好的壶只加热水便能泡出醇香的茶。" },
    { q: "The 'tea horse road' (茶馬古道) was an ancient trade route exchanging tea for:", q_tc: "「茶馬古道」是一條古代貿易路線，用茶葉交換：", q_sc: "“茶马古道”是一条古代贸易路线，用茶叶交换：", o: ["Horses from Tibet", "Silk from Central Asia", "Spices from India", "Gold from Mongolia"], o_tc: ["西藏的馬匹", "中亞的絲綢", "印度的香料", "蒙古的黃金"], o_sc: ["西藏的马匹", "中亚的丝绸", "印度的香料", "蒙古的黄金"], a: 0, e: "The Tea Horse Road (茶馬古道) connected Yunnan/Sichuan to Tibet, exchanging Chinese tea for Tibetan horses. Some routes extended to Southeast Asia and India.", e_tc: "茶馬古道連接雲南/四川與西藏，以中國茶葉換取藏地馬匹。部分路線延伸至東南亞和印度。", e_sc: "茶马古道连接云南/四川与西藏，以中国茶叶换取藏地马匹。部分路线延伸至东南亚和印度。" },
    { q: "What does '品茶' (pǐn chá) mean?", q_tc: "「品茶」是什麼意思？", q_sc: "“品茶”是什么意思？", o: ["To savour/appreciate tea", "To sell tea", "To grow tea", "To brew tea quickly"], o_tc: ["細細品味、欣賞茶", "賣茶", "種茶", "快速泡茶"], o_sc: ["细细品味、欣赏茶", "卖茶", "种茶", "快速泡茶"], a: 0, e: "品茶 means to mindfully taste and appreciate tea — savouring the colour, aroma, flavour, and aftertaste. It implies a contemplative, almost meditative approach.", e_tc: "品茶指用心品味和欣賞茶——細細感受茶的色、香、味與回甘，帶有沉思冥想的意味。", e_sc: "品茶指用心品味和欣赏茶——细细感受茶的色、香、味与回甘，带有沉思冥想的意味。" },

    // ===== DAOISM & YI JING (12) =====
    { q: "How many trigrams (卦) are in the Ba Gua system?", q_tc: "八卦中有多少個卦？", q_sc: "八卦中有多少个卦？", o: ["8", "12", "64", "6"], o_tc: ["8個", "12個", "64個", "6個"], o_sc: ["8个", "12个", "64个", "6个"], a: 0, e: "The Ba Gua (八卦) consists of 8 trigrams, each made of 3 lines (broken or unbroken). When combined in pairs they form the 64 hexagrams of the Yi Jing.", e_tc: "八卦由8個卦組成，每卦由3條線（斷線或連線）構成。兩兩組合便形成《易經》的64個六爻卦。", e_sc: "八卦由8个卦组成，每卦由3条线（断线或连线）构成。两两组合便形成《易经》的64个六爻卦。" },
    { q: "The Daoist concept of '道' (Dào) is best understood as:", q_tc: "道家的「道」最恰當的理解是：", q_sc: "道家的“道”最恰当的理解是：", o: ["The fundamental, nameless source and principle of all reality", "A specific god", "A type of meditation", "A moral code"], o_tc: ["萬物本源、不可名狀的終極法則", "一位特定的神明", "一種冥想方式", "一套道德準則"], o_sc: ["万物本源、不可名状的终极法则", "一位特定的神明", "一种冥想方式", "一套道德准则"], a: 0, e: "道 (Dào) is the ineffable, formless source from which all things arise. It cannot be fully defined in words — hence Laozi's opening: '道可道，非常道.'", e_tc: "「道」是不可言說、無形無象的萬物之源。它無法用語言完全定義——故老子開篇即言：「道可道，非常道。」", e_sc: "“道”是不可言说、无形无象的万物之源。它无法用语言完全定义——故老子开篇即言：“道可道，非常道。”" },
    { q: "Yin and Yang represent:", q_tc: "陰陽代表：", q_sc: "阴阳代表：", o: ["Complementary opposites in dynamic balance", "Good and evil", "Male and female only", "Light and darkness only"], o_tc: ["動態平衡中互補的對立面", "善與惡", "僅指男與女", "僅指光明與黑暗"], o_sc: ["动态平衡中互补的对立面", "善与恶", "仅指男与女", "仅指光明与黑暗"], a: 0, e: "Yin (陰) and Yang (陽) are complementary forces — each contains the seed of the other. They describe all dualities: dark/light, cold/hot, passive/active, receptive/creative.", e_tc: "陰與陽是互補的力量——彼此之中蘊含著對方的種子。它們描述一切對立：暗/明、寒/熱、被動/主動、接受/創造。", e_sc: "阴与阳是互补的力量——彼此之中蕴含着对方的种子。它们描述一切对立：暗/明、寒/热、被动/主动、接受/创造。" },
    { q: "The Taiji (太極) symbol represents:", q_tc: "太極圖代表：", q_sc: "太极图代表：", o: ["The dynamic interplay of Yin and Yang", "The sun", "The zodiac wheel", "The five elements"], o_tc: ["陰陽的動態交融", "太陽", "生肖輪", "五行"], o_sc: ["阴阳的动态交融", "太阳", "生肖轮", "五行"], a: 0, e: "The Taiji (☯) shows Yin and Yang flowing into each other, each containing a dot of the other — symbolising that all opposites are interconnected and interdependent.", e_tc: "太極圖（☯）展現陰陽相互流轉，各含一點對方——象徵一切對立都是相互關聯、相互依存的。", e_sc: "太极图（☯）展现阴阳相互流转，各含一点对方——象征一切对立都是相互关联、相互依存的。" },
    { q: "Zhuangzi's parable of 'Cook Ding' (庖丁解牛) illustrates:", q_tc: "莊子「庖丁解牛」的寓言說明了：", q_sc: "庄子“庖丁解牛”的寓言说明了：", o: ["Mastery through Wu Wei — effortless skill", "The importance of sharp tools", "The value of hard work", "How to prepare a feast"], o_tc: ["通過無為達到的精湛技藝——遊刃有餘", "鋒利工具的重要性", "勤奮的價值", "如何準備盛宴"], o_sc: ["通过无为达到的精湛技艺——游刃有余", "锋利工具的重要性", "勤奋的价值", "如何准备盛宴"], a: 0, e: "Cook Ding butchers an ox with perfect ease because he follows the natural structure. His knife never dulls because it moves through gaps. This illustrates Wu Wei — effortless mastery in harmony with nature.", e_tc: "庖丁解牛遊刃有餘，因為他順應牛體的天然結構。他的刀從不鈍，因為總是遊走於骨節間隙。這正是無為的體現——順應自然而達至精妙。", e_sc: "庖丁解牛游刃有余，因为他顺应牛体的天然结构。他的刀从不钝，因为总是游走于骨节间隙。这正是无为的体现——顺应自然而达至精妙。" },
    { q: "The 'Three Treasures' (三寶) of Daoism according to Laozi are:", q_tc: "老子所說的道家「三寶」是：", q_sc: "老子所说的道家“三宝”是：", o: ["Compassion, frugality, humility", "Wisdom, courage, strength", "Heaven, Earth, Humanity", "Gold, jade, silk"], o_tc: ["慈、儉、不敢為天下先", "智慧、勇氣、力量", "天、地、人", "金、玉、絲"], o_sc: ["慈、俭、不敢为天下先", "智慧、勇气、力量", "天、地、人", "金、玉、丝"], a: 0, e: "In Chapter 67 of the Dao De Jing, Laozi names his Three Treasures: 慈 (cí, compassion), 儉 (jiǎn, frugality), and 不敢為天下先 (not daring to be first in the world / humility).", e_tc: "《道德經》第六十七章中，老子列出三寶：慈（慈悲）、儉（節儉）、不敢為天下先（謙遜）。", e_sc: "《道德经》第六十七章中，老子列出三宝：慈（慈悲）、俭（节俭）、不敢为天下先（谦逊）。" },
    { q: "The I Ching (易經) was traditionally used for:", q_tc: "《易經》傳統上用於：", q_sc: "《易经》传统上用于：", o: ["Divination and philosophical reflection", "Tax collection", "Military drill", "Musical composition"], o_tc: ["占卜和哲學思考", "徵稅", "軍事操練", "音樂創作"], o_sc: ["占卜和哲学思考", "征税", "军事操练", "音乐创作"], a: 0, e: "The I Ching (易經, Book of Changes) is one of the oldest divination systems in the world. Over millennia it evolved into a profound philosophical text studied by Confucians and Daoists alike.", e_tc: "《易經》（又名《周易》）是世界上最古老的占卜體系之一。歷經數千年，它演變為一部深邃的哲學經典，為儒道兩家共同研習。", e_sc: "《易经》（又名《周易》）是世界上最古老的占卜体系之一。历经数千年，它演变为一部深邃的哲学经典，为儒道两家共同研习。" },
    { q: "The trigram '☰' (三 unbroken lines) represents:", q_tc: "卦象「☰」（三條連線）代表：", q_sc: "卦象“☰”（三条连线）代表：", o: ["Heaven (乾 Qián)", "Earth (坤 Kūn)", "Water (坎 Kǎn)", "Fire (離 Lí)"], o_tc: ["天（乾）", "地（坤）", "水（坎）", "火（離）"], o_sc: ["天（乾）", "地（坤）", "水（坎）", "火（离）"], a: 0, e: "☰ (three unbroken Yang lines) represents Heaven/乾 (Qián) — the creative, strong, initiating force. Its complement ☷ (three broken Yin lines) represents Earth/坤 (Kūn).", e_tc: "☰（三條不斷的陽爻）代表天/乾——創造、剛健、主動的力量。與之相對的☷（三條斷開的陰爻）代表地/坤。", e_sc: "☰（三条不断的阳爻）代表天/乾——创造、刚健、主动的力量。与之相对的☷（三条断开的阴爻）代表地/坤。" },
    { q: "The Daoist practice of 'nourishing life' (養生) encompasses:", q_tc: "道家「養生」之道涵蓋：", q_sc: "道家“养生”之道涵盖：", o: ["Diet, exercise, meditation, and breath work for longevity", "Only herbal medicine", "Only martial arts", "Only fasting"], o_tc: ["飲食、運動、冥想和呼吸吐納以求長壽", "僅限草藥", "僅限武術", "僅限辟穀"], o_sc: ["饮食、运动、冥想和呼吸吐纳以求长寿", "仅限草药", "仅限武术", "仅限辟谷"], a: 0, e: "養生 (Yǎngshēng) is a holistic Daoist approach to health combining diet, qigong, meditation, herbal remedies, and seasonal living to cultivate vitality and longevity.", e_tc: "養生是道家整體性的健康理念，結合飲食、氣功、冥想、草藥和順應四時的生活方式，以培養元氣、延年益壽。", e_sc: "养生是道家整体性的健康理念，结合饮食、气功、冥想、草药和顺应四时的生活方式，以培养元气、延年益寿。" },
    { q: "Which Daoist text features the 'Free and Easy Wandering' (逍遙遊) chapter?", q_tc: "哪部道家典籍包含「逍遙遊」篇？", q_sc: "哪部道家典籍包含“逍遥游”篇？", o: ["Zhuangzi (莊子)", "Dao De Jing (道德經)", "Liezi (列子)", "Baopuzi (抱朴子)"], o_tc: ["《莊子》", "《道德經》", "《列子》", "《抱朴子》"], o_sc: ["《庄子》", "《道德经》", "《列子》", "《抱朴子》"], a: 0, e: "The first chapter of the Zhuangzi (《莊子》), 'Free and Easy Wandering' (逍遙遊), uses the parable of the giant Peng bird to explore absolute freedom and perspective.", e_tc: "《莊子》開篇「逍遙遊」以大鵬鳥的寓言探討絕對的自由與視角的轉換。", e_sc: "《庄子》开篇“逍遥游”以大鹏鸟的寓言探讨绝对的自由与视角的转换。" },
    { q: "The concept of 'De' (德) in Daoism means:", q_tc: "道家中「德」的含義是：", q_sc: "道家中“德”的含义是：", o: ["Virtue, power, or inherent character", "Money or wealth", "Knowledge", "Authority"], o_tc: ["德行、內在力量或本性", "金錢或財富", "知識", "權威"], o_sc: ["德行、内在力量或本性", "金钱或财富", "知识", "权威"], a: 0, e: "德 (Dé) means virtue, moral force, or inherent power. In Daoism, De is the manifestation of Dao in each individual thing — its natural character and potency.", e_tc: "「德」意為德行、道德力量或內在潛能。在道家思想中，德是道在萬物中的具體顯現——即事物的本性與內在力量。", e_sc: "“德”意为德行、道德力量或内在潜能。在道家思想中，德是道在万物中的具体显现——即事物的本性与内在力量。" },
    { q: "Daoist alchemy (煉丹術) had two branches:", q_tc: "道家煉丹術分為兩個流派：", q_sc: "道家炼丹术分为两个流派：", o: ["External alchemy (waidan) and internal alchemy (neidan)", "Gold alchemy and silver alchemy", "Plant alchemy and animal alchemy", "Fire alchemy and water alchemy"], o_tc: ["外丹（煉製丹藥）和內丹（體內修煉）", "金丹術和銀丹術", "植物煉丹和動物煉丹", "火煉術和水煉術"], o_sc: ["外丹（炼制丹药）和内丹（体内修炼）", "金丹术和银丹术", "植物炼丹和动物炼丹", "火炼术和水炼术"], a: 0, e: "External alchemy (外丹 wàidān) sought physical elixirs of immortality. Internal alchemy (內丹 nèidān) used meditation and breath work to refine qi within the body.", e_tc: "外丹追求煉製長生不老的丹藥。內丹則通過冥想和呼吸吐納在體內修煉精氣，以達到身心的昇華。", e_sc: "外丹追求炼制长生不老的丹药。内丹则通过冥想和呼吸吐纳在体内修炼精气，以达到身心的升华。" },

    // ===== TCM / TRADITIONAL CHINESE MEDICINE (10) =====
    { q: "The foundational text of Traditional Chinese Medicine is:", q_tc: "中醫的奠基典籍是：", q_sc: "中医的奠基典籍是：", o: ["《黃帝內經》(Huangdi Neijing)", "《本草綱目》(Bencao Gangmu)", "《傷寒論》(Shanghan Lun)", "《茶經》(Cha Jing)"], o_tc: ["《黃帝內經》", "《本草綱目》", "《傷寒論》", "《茶經》"], o_sc: ["《黄帝内经》", "《本草纲目》", "《伤寒论》", "《茶经》"], a: 0, e: "The Huangdi Neijing (《黃帝內經》, Yellow Emperor's Classic of Internal Medicine), compiled around the 2nd century BCE, lays out the theoretical foundation of TCM.", e_tc: "《黃帝內經》（黃帝內經）約編纂於公元前二世紀，奠定了中醫的理論基礎。", e_sc: "《黄帝内经》约编纂于公元前二世纪，奠定了中医的理论基础。" },
    { q: "Li Shizhen's 《本草綱目》(Compendium of Materia Medica) catalogues approximately:", q_tc: "李時珍的《本草綱目》收錄了大約多少種藥物？", q_sc: "李时珍的《本草纲目》收录了大约多少种药物？", o: ["1,892 medicinal substances", "500 herbs", "100 minerals", "3,000 drugs"], o_tc: ["1,892種藥物", "500種草藥", "100種礦物", "3,000種藥物"], o_sc: ["1,892种药物", "500种草药", "100种矿物", "3,000种药物"], a: 0, e: "Li Shizhen (李時珍, 1518-1593) spent 27 years compiling the Bencao Gangmu, documenting 1,892 drugs with 11,096 prescriptions. It remains a foundational pharmacological reference.", e_tc: "李時珍（1518-1593年）耗時27年編纂《本草綱目》，記載了1,892種藥物及11,096個方劑，至今仍是藥學的重要參考文獻。", e_sc: "李时珍（1518-1593年）耗时27年编纂《本草纲目》，记载了1,892种药物及11,096个方剂，至今仍是药学的重要参考文献。" },
    { q: "Acupuncture works by stimulating points along:", q_tc: "針灸通過刺激哪些部位來發揮作用？", q_sc: "针灸通过刺激哪些部位来发挥作用？", o: ["Meridians (經絡) through which qi flows", "Blood vessels", "Nerve clusters only", "Muscle fibres"], o_tc: ["氣運行其中的經絡上的穴位", "血管", "僅限神經叢", "肌肉纖維"], o_sc: ["气运行其中的经络上的穴位", "血管", "仅限神经丛", "肌肉纤维"], a: 0, e: "Acupuncture stimulates specific points along meridians (經絡 jīngluò) — pathways through which qi circulates. There are 12 primary meridians corresponding to major organs.", e_tc: "針灸刺激經絡上的特定穴位——經絡是氣運行的通道。人體有十二條正經，分別對應主要臟腑。", e_sc: "针灸刺激经络上的特定穴位——经络是气运行的通道。人体有十二条正经，分别对应主要脏腑。" },
    { q: "The 'Four Diagnostic Methods' (四診) in TCM are:", q_tc: "中醫的「四診」是：", q_sc: "中医的“四诊”是：", o: ["Observation, listening/smelling, inquiry, palpation", "Blood test, urine test, X-ray, surgery", "Herbal, acupuncture, massage, exercise", "Spring, summer, autumn, winter diagnosis"], o_tc: ["望、聞、問、切", "驗血、驗尿、X光、手術", "草藥、針灸、推拿、運動", "春診、夏診、秋診、冬診"], o_sc: ["望、闻、问、切", "验血、验尿、X光、手术", "草药、针灸、推拿、运动", "春诊、夏诊、秋诊、冬诊"], a: 0, e: "The Four Diagnostic Methods: 望 (observation), 聞 (listening/smelling), 問 (inquiry), 切 (palpation/pulse-taking). Pulse diagnosis alone distinguishes 28 different pulse types.", e_tc: "四診：望（觀察）、聞（聽聲嗅味）、問（問診）、切（切脈）。僅脈診一項就能辨別28種不同的脈象。", e_sc: "四诊：望（观察）、闻（听声嗅味）、问（问诊）、切（切脉）。仅脉诊一项就能辨别28种不同的脉象。" },
    { q: "How many primary meridians does the human body have according to TCM?", q_tc: "根據中醫理論，人體有多少條正經？", q_sc: "根据中医理论，人体有多少条正经？", o: ["12", "8", "24", "6"], o_tc: ["12條", "8條", "24條", "6條"], o_sc: ["12条", "8条", "24条", "6条"], a: 0, e: "There are 12 primary meridians (十二正經), each associated with a major organ. There are also 8 extraordinary meridians (奇經八脈) including the Ren and Du channels.", e_tc: "人體有十二條正經，各對應一個主要臟腑。此外還有奇經八脈，包括任脈和督脈。", e_sc: "人体有十二条正经，各对应一个主要脏腑。此外还有奇经八脉，包括任脉和督脉。" },
    { q: "Hua Tuo (華佗) was a famous physician who pioneered:", q_tc: "華佗是一位著名的醫師，他開創了：", q_sc: "华佗是一位著名的医师，他开创了：", o: ["Surgical anaesthesia using mafeisan (麻沸散)", "Acupuncture theory", "Herbal classification", "Pulse diagnosis"], o_tc: ["使用麻沸散進行外科麻醉", "針灸理論", "草藥分類", "脈診"], o_sc: ["使用麻沸散进行外科麻醉", "针灸理论", "草药分类", "脉诊"], a: 0, e: "Hua Tuo (c. 140-208 CE) was a legendary Eastern Han physician who developed mafeisan (麻沸散), an herbal anaesthetic for surgery — centuries before Western anaesthesia.", e_tc: "華佗（約140-208年）是東漢傳奇名醫，發明了麻沸散——一種用於外科手術的草藥麻醉劑，比西方麻醉術早了數百年。", e_sc: "华佗（约140-208年）是东汉传奇名医，发明了麻沸散——一种用于外科手术的草药麻醉剂，比西方麻醉术早了数百年。" },
    { q: "The TCM concept of '寒' (hán) and '熱' (rè) refers to:", q_tc: "中醫中「寒」和「熱」的概念是指：", q_sc: "中医中“寒”和“热”的概念是指：", o: ["Cold and hot patterns of disease/constitution", "Room temperature during treatment", "Seasons for treatment", "Types of herbs only"], o_tc: ["疾病或體質的寒證與熱證", "治療時的室溫", "治療的季節", "僅指草藥的種類"], o_sc: ["疾病或体质的寒证与热证", "治疗时的室温", "治疗的季节", "仅指草药的种类"], a: 0, e: "寒 (cold) and 熱 (hot) are fundamental diagnostic categories in TCM. Cold patterns show pale complexion, cold limbs, and clear fluids. Hot patterns show redness, fever, and dark fluids.", e_tc: "寒與熱是中醫的基本辨證分類。寒證表現為面色蒼白、四肢冰冷、分泌物清稀；熱證表現為面紅、發熱、分泌物色深。", e_sc: "寒与热是中医的基本辨证分类。寒证表现为面色苍白、四肢冰冷、分泌物清稀；热证表现为面红、发热、分泌物色深。" },
    { q: "Zhang Zhongjing's 《傷寒論》(Treatise on Cold Damage) is significant because:", q_tc: "張仲景的《傷寒論》之所以重要，是因為：", q_sc: "张仲景的《伤寒论》之所以重要，是因为：", o: ["It established systematic diagnosis and herbal prescription methods", "It was the first text on surgery", "It introduced acupuncture", "It catalogued all known diseases"], o_tc: ["確立了系統的辨證論治和方劑學體系", "是第一部外科學著作", "引入了針灸療法", "記錄了所有已知疾病"], o_sc: ["确立了系统的辨证论治和方剂学体系", "是第一部外科学著作", "引入了针灸疗法", "记录了所有已知疾病"], a: 0, e: "Zhang Zhongjing (張仲景, c. 150-219 CE) wrote 《傷寒論》which established the Six Meridian diagnosis system and systematic prescription methodology still used today.", e_tc: "張仲景（約150-219年）所著《傷寒論》確立了六經辨證體系和系統的方劑學方法，沿用至今。", e_sc: "张仲景（约150-219年）所著《伤寒论》确立了六经辨证体系和系统的方剂学方法，沿用至今。" },
    { q: "Moxibustion (艾灸) involves:", q_tc: "艾灸的做法是：", q_sc: "艾灸的做法是：", o: ["Burning dried mugwort near or on acupuncture points", "Applying hot stones", "Drinking herbal tea", "Needle insertion"], o_tc: ["在穴位附近或穴位上燃燒乾艾草", "敷熱石", "飲用草藥茶", "扎針"], o_sc: ["在穴位附近或穴位上燃烧干艾草", "敷热石", "饮用草药茶", "扎针"], a: 0, e: "Moxibustion (艾灸 àijiǔ) burns dried mugwort (艾草 àicǎo) to warm acupuncture points and stimulate qi flow. It is often used alongside acupuncture.", e_tc: "艾灸燃燒乾燥的艾草來溫熱穴位、促進氣的運行，常與針灸配合使用。", e_sc: "艾灸燃烧干燥的艾草来温热穴位、促进气的运行，常与针灸配合使用。" },
    { q: "The concept of 'Qi stagnation' (氣滯) in TCM can cause:", q_tc: "中醫中「氣滯」會導致：", q_sc: "中医中“气滞”会导致：", o: ["Pain, bloating, emotional irritability", "Excessive energy", "Weight loss", "Improved circulation"], o_tc: ["疼痛、腹脹、情緒煩躁", "精力過盛", "體重減輕", "血液循環改善"], o_sc: ["疼痛、腹胀、情绪烦躁", "精力过盛", "体重减轻", "血液循环改善"], a: 0, e: "When qi (氣) stagnates, it causes distension, pain, and emotional symptoms like irritability or depression. The TCM principle states: '不通則痛' (where there is blockage, there is pain).", e_tc: "氣滯時會出現脹滿、疼痛及煩躁或抑鬱等情緒症狀。中醫有云：「不通則痛」——氣血不暢之處便會產生疼痛。", e_sc: "气滞时会出现胀满、疼痛及烦躁或抑郁等情绪症状。中医有云：“不通则痛”——气血不畅之处便会产生疼痛。" },

    // ===== HANFU & CULTURAL IDENTITY (8) =====
    { q: "The defining structural feature of Hanfu is:", q_tc: "漢服的標誌性結構特徵是：", q_sc: "汉服的标志性结构特征是：", o: ["Cross-collar, right-side wrapping (交領右衽)", "Mandarin collar", "Side-button closure", "Wrap-around sash only"], o_tc: ["交領右衽", "立領", "側邊扣合", "僅有腰帶纏繞"], o_sc: ["交领右衽", "立领", "侧边扣合", "仅有腰带缠绕"], a: 0, e: "Hanfu's defining feature is the cross-collar wrapping to the right (交領右衽 jiāolǐng yòurèn). This right-over-left wrapping distinguished Chinese dress for millennia.", e_tc: "漢服的標誌性特徵是交領右衽（衣襟向右掩），這種右壓左的穿法是中華服飾數千年來的顯著標識。", e_sc: "汉服的标志性特征是交领右衽（衣襟向右掩），这种右压左的穿法是中华服饰数千年来的显著标识。" },
    { q: "The term 漢字文化圈 (Hànzì Wénhuà Quān) refers to:", q_tc: "「漢字文化圈」是指：", q_sc: "“汉字文化圈”是指：", o: ["The East Asian cultural sphere using Chinese characters", "A calligraphy school", "A type of feng shui compass", "An ancient trade route"], o_tc: ["使用漢字的東亞文化圈", "一所書法學校", "一種風水羅盤", "一條古代商路"], o_sc: ["使用汉字的东亚文化圈", "一所书法学校", "一种风水罗盘", "一条古代商路"], a: 0, e: "漢字文化圈 (Sinosphere / Chinese character cultural sphere) refers to the civilisations — China, Japan, Korea, Vietnam — that adopted Chinese writing, Confucian governance, and cultural practices.", e_tc: "漢字文化圈指採用漢字書寫、儒家治國理念和中華文化傳統的文明——包括中國、日本、韓國和越南。", e_sc: "汉字文化圈指采用汉字书写、儒家治国理念和中华文化传统的文明——包括中国、日本、韩国和越南。" },
    { q: "The Shenyi (深衣) is a type of Hanfu characterised by:", q_tc: "深衣是漢服的一種，其特點是：", q_sc: "深衣是汉服的一种，其特点是：", o: ["A one-piece wrapped garment connecting top and skirt", "A short jacket", "Trousers only", "A sleeveless vest"], o_tc: ["上衣下裳連為一體的包裹式服裝", "短衫", "僅有褲子", "無袖背心"], o_sc: ["上衣下裳连为一体的包裹式服装", "短衫", "仅有裤子", "无袖背心"], a: 0, e: "The Shenyi (深衣, 'deep garment') connects the upper and lower sections into one wrapped piece. It was standard formal wear from the Zhou Dynasty onward.", e_tc: "深衣（意為「深邃之衣」）將上衣和下裳連為一體。自周代起便是標準的正式服飾。", e_sc: "深衣（意为“深邃之衣”）将上衣和下裳连为一体。自周代起便是标准的正式服饰。" },
    { q: "The modern Hanfu revival movement began primarily in:", q_tc: "現代漢服復興運動主要始於：", q_sc: "现代汉服复兴运动主要始于：", o: ["The early 2000s", "The 1950s", "The 1980s", "The 1920s"], o_tc: ["2000年代初期", "1950年代", "1980年代", "1920年代"], o_sc: ["2000年代初期", "1950年代", "1980年代", "1920年代"], a: 0, e: "The modern Hanfu revival began around 2003, driven by online communities promoting traditional Han Chinese clothing as cultural heritage. It has since become a major cultural movement.", e_tc: "現代漢服復興運動約始於2003年，由網路社群推動，倡導將漢族傳統服飾作為文化遺產加以傳承，現已成為重要的文化運動。", e_sc: "现代汉服复兴运动约始于2003年，由网络社群推动，倡导将汉族传统服饰作为文化遗产加以传承，现已成为重要的文化运动。" },
    { q: "The Ruqun (襦裙) style of Hanfu consists of:", q_tc: "漢服中的襦裙由什麼組成？", q_sc: "汉服中的襦裙由什么组成？", o: ["A short jacket paired with a long skirt", "A full-length robe", "Trousers and a tunic", "A cape and dress"], o_tc: ["短襦搭配長裙", "全身長袍", "褲子和上衣", "披風和連衣裙"], o_sc: ["短襦搭配长裙", "全身长袍", "裤子和上衣", "披风和连衣裙"], a: 0, e: "Ruqun (襦裙) pairs a short jacket (襦 rú) with a high-waisted skirt (裙 qún). It was the most common women's outfit across multiple dynasties.", e_tc: "襦裙由短襦（上衣）和高腰裙搭配而成，是歷朝歷代最常見的女性服飾。", e_sc: "襦裙由短襦（上衣）和高腰裙搭配而成，是历朝历代最常见的女性服饰。" },
    { q: "What is the significance of the colour yellow in imperial Chinese dress?", q_tc: "黃色在中國皇室服飾中有何意義？", q_sc: "黄色在中国皇室服饰中有何意义？", o: ["It was reserved exclusively for the emperor", "It represented mourning", "It was worn by scholars", "It symbolised youth"], o_tc: ["專為皇帝所用", "代表喪服", "為文人所穿", "象徵青春"], o_sc: ["专为皇帝所用", "代表丧服", "为文人所穿", "象征青春"], a: 0, e: "Bright yellow (明黃) was reserved exclusively for the emperor from the Tang Dynasty onward. Wearing it without authorisation was a capital offence.", e_tc: "自唐代起，明黃色專為皇帝所用。未經許可穿著明黃色服飾屬於死罪。", e_sc: "自唐代起，明黄色专为皇帝所用。未经许可穿着明黄色服饰属于死罪。" },
    { q: "The 'Chinamaxxing' trend refers to:", q_tc: "「Chinamaxxing」潮流是指：", q_sc: "“Chinamaxxing”潮流是指：", o: ["Young people worldwide embracing Chinese cultural aesthetics and lifestyle", "A Chinese exercise programme", "A cooking show", "A martial arts competition"], o_tc: ["全球年輕人擁抱中華文化美學和生活方式", "一項中國健身計劃", "一個烹飪節目", "一場武術比賽"], o_sc: ["全球年轻人拥抱中华文化美学和生活方式", "一项中国健身计划", "一个烹饪节目", "一场武术比赛"], a: 0, e: "Chinamaxxing is a social media trend where young people — both Chinese and non-Chinese — enthusiastically adopt Chinese cultural elements: hanfu, tea ceremony, calligraphy, and traditional aesthetics.", e_tc: "Chinamaxxing是一股社交媒體潮流，中外年輕人熱情地擁抱中華文化元素：漢服、茶道、書法和傳統美學。", e_sc: "Chinamaxxing是一股社交媒体潮流，中外年轻人热情地拥抱中华文化元素：汉服、茶道、书法和传统美学。" },
    { q: "Traditional Chinese wedding attire is predominantly:", q_tc: "中國傳統婚禮服飾的主色調是：", q_sc: "中国传统婚礼服饰的主色调是：", o: ["Red", "White", "Gold", "Blue"], o_tc: ["紅色", "白色", "金色", "藍色"], o_sc: ["红色", "白色", "金色", "蓝色"], a: 0, e: "Red is the dominant colour in traditional Chinese weddings, symbolising good fortune, joy, and prosperity. White is associated with mourning in Chinese culture.", e_tc: "紅色是中國傳統婚禮的主色，象徵吉祥、喜慶和繁榮。白色在中國文化中與喪事相關。", e_sc: "红色是中国传统婚礼的主色，象征吉祥、喜庆和繁荣。白色在中国文化中与丧事相关。" },

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
    timerText: document.getElementById('trivia-timer-text'),
    liveScore: document.getElementById('trivia-live-score')
  };

  /* --- Trilingual helpers --- */
  function getLang() {
    return document.documentElement.getAttribute('data-lang') || 'en';
  }
  function qField(q, base) {
    var lang = getLang();
    if (lang === 'tc' && q[base + '_tc']) return q[base + '_tc'];
    if (lang === 'sc' && q[base + '_sc']) return q[base + '_sc'];
    return q[base];
  }
  var L = {
    correct:     { en: 'Correct!',      tc: '正確！',     sc: '正确！' },
    incorrect:   { en: 'Incorrect.',     tc: '答錯了。',   sc: '答错了。' },
    answerIs:    { en: 'The answer is:', tc: '正確答案是：', sc: '正确答案是：' },
    timesUp:     { en: "Time's up!",     tc: '時間到！',   sc: '时间到！' },
    nextQ:       { en: 'Next Question',  tc: '下一題',     sc: '下一题' },
    seeResults:  { en: 'See Results',    tc: '查看結果',   sc: '查看结果' },
    youScored:   { en: function(s,t,p){ return 'You scored ' + s + ' out of ' + t + ' (' + p + '%)'; },
                   tc: function(s,t,p){ return '您答對了 ' + t + ' 題中的 ' + s + ' 題（' + p + '%）'; },
                   sc: function(s,t,p){ return '您答对了 ' + t + ' 题中的 ' + s + ' 题（' + p + '%）'; } },
    newHigh:     { en: 'New high score!',       tc: '新最高分！',       sc: '新最高分！' },
    highScore:   { en: function(s,t){ return 'High score: ' + s + '/' + t; },
                   tc: function(s,t){ return '最高分：' + s + '/' + t; },
                   sc: function(s,t){ return '最高分：' + s + '/' + t; } },
    titles: [
      { min: 100, icon: '🏆', en: 'Perfect Score — Scholar of the Imperial Academy!', tc: '滿分——翰林院學士！', sc: '满分——翰林院学士！' },
      { min: 80,  icon: '🎓', en: 'Excellent — Worthy of a Jinshi Degree!',           tc: '優秀——堪稱進士之才！', sc: '优秀——堪称进士之才！' },
      { min: 60,  icon: '📚', en: 'Well Done — A Diligent Student of the Classics',   tc: '做得好——勤勉的經學學子', sc: '做得好——勤勉的经学学子' },
      { min: 40,  icon: '🔖', en: 'Not Bad — Keep Studying the Ancient Texts',        tc: '不錯——繼續研讀古籍吧', sc: '不错——继续研读古籍吧' },
      { min: 0,   icon: '📜', en: 'The Journey of a Thousand Li Begins with a Single Step', tc: '千里之行，始於足下', sc: '千里之行，始于足下' }
    ]
  };
  function t(key) { return L[key][getLang()] || L[key].en; }

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
    var opts = qField(q, 'o');
    var expl = qField(q, 'e');
    els.feedback.innerHTML = '<strong>' + t('timesUp') + '</strong> ' + t('answerIs') + ' <em>' + opts[q.a] + '</em>. ' + expl;

    // Show next or finish
    if (currentIndex < TOTAL - 1) {
      els.next.hidden = false;
      els.next.textContent = t('nextQ');
    } else {
      els.next.hidden = false;
      els.next.textContent = t('seeResults');
    }
  }

  function startGame() {
    currentQuestions = shuffle(QUESTIONS).slice(0, TOTAL);
    currentIndex = 0;
    score = 0;
    answered = false;
    if (els.liveScore) els.liveScore.textContent = '0';
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
    els.question.textContent = qField(q, 'q');
    els.feedback.hidden = true;
    els.next.hidden = true;

    // Shuffle options while tracking correct answer
    const indices = [0, 1, 2, 3];
    const shuffled = shuffle(indices);
    var opts = qField(q, 'o');

    els.options.innerHTML = '';
    shuffled.forEach(function(origIdx) {
      const btn = document.createElement('button');
      btn.className = 'trivia-option';
      btn.textContent = opts[origIdx];
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
    if (els.liveScore) els.liveScore.textContent = score;

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
    var opts = qField(q, 'o');
    var expl = qField(q, 'e');
    els.feedback.innerHTML = (isCorrect ? '<strong>' + t('correct') + '</strong> ' : '<strong>' + t('incorrect') + '</strong> ' + t('answerIs') + ' <em>' + opts[q.a] + '</em>. ') + expl;

    // Show next or finish
    if (currentIndex < TOTAL - 1) {
      els.next.hidden = false;
      els.next.textContent = t('nextQ');
    } else {
      els.next.hidden = false;
      els.next.textContent = t('seeResults');
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

    var lang = getLang();
    var tier = L.titles[L.titles.length - 1];
    for (var i = 0; i < L.titles.length; i++) {
      if (pct >= L.titles[i].min) { tier = L.titles[i]; break; }
    }

    els.scoreIcon.textContent = tier.icon;
    els.scoreTitle.textContent = tier[lang] || tier.en;
    els.scoreText.textContent = L.youScored[lang](score, TOTAL, pct);

    // High score
    const key = 'czy-trivia-high';
    const prev = parseInt(localStorage.getItem(key) || '0');
    if (score > prev) {
      localStorage.setItem(key, score);
      els.highScore.textContent = t('newHigh');
    } else {
      els.highScore.textContent = L.highScore[lang](Math.max(prev, score), TOTAL);
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

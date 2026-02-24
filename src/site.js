/* ============================================
   ChineseZodiacYear.com — Site JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

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
      const year = parseInt(yearInput.value);
      if (isNaN(year) || year < 1900 || year > 2100) {
        alert('Please enter a valid year between 1900 and 2100.');
        return;
      }
      const zodiac = getZodiac(year);
      const element = getElement(year);
      const stem = getHeavenlyStem(year);
      const elementClass = 'element-' + element.toLowerCase();

      calcResult.innerHTML = `
        <div class="calc-result-animal">${zodiac.emoji}</div>
        <h3>${zodiac.animal} <span class="chinese-char">${zodiac.cn}</span></h3>
        <p class="calc-result-element ${elementClass}">${element} ${zodiac.animal}</p>
        <p class="mt-md" style="color:var(--graphite);font-size:0.95rem;margin:1rem auto 0;max-width:400px;">
          <strong>Heavenly Stem:</strong> ${stem}<br>
          <strong>Traits:</strong> ${zodiac.traits}
        </p>
        <p style="margin-top:1rem;"><a href="/zodiac/" style="font-weight:600;">Read more about the ${zodiac.animal} &rarr;</a></p>
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
    if (href === currentPath || href === currentPath.replace(/\/$/, '') || (currentPath === '/' && href === '/')) {
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

      html += '<p style="margin-top:1.5rem;font-size:0.9rem;color:var(--graphite);text-align:center;">For a comprehensive analysis, a full <a href="/bazi/">BaZi chart</a> comparison is recommended.</p>';

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
});

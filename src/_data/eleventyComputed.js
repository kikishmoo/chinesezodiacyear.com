/**
 * Eleventy Computed Data — Auto-generated internal links
 *
 * Generates contextual "Related" and "Also Explore" links for every page
 * based on the content relationship graph in contentGraph.json.
 *
 * For zodiac animal pages: adds compatible-animal links + matching reading
 * For reading pages: adds link to the specific animal page
 * For encyclopedia pages: adds topic-affinity links
 * For articles: uses category to find related encyclopedia pages
 */
export default {
  autoRelated: function (data) {
    const graph = data.contentGraph;
    if (!graph) return [];

    const currentUrl = data.page?.url;
    if (!currentUrl) return [];

    const links = [];
    const seen = new Set();
    seen.add(currentUrl);

    // Helper: add link if not duplicate
    const addLink = (url, label) => {
      if (!seen.has(url) && label) {
        seen.add(url);
        links.push({ url, label });
      }
    };

    // --- Zodiac animal pages: /zodiac/{animal}/ ---
    const zodiacMatch = currentUrl.match(/^\/zodiac\/(\w+)\/$/);
    if (zodiacMatch) {
      const animal = zodiacMatch[1].toLowerCase();

      // Link to this animal's 2026 reading
      const animalCap = animal.charAt(0).toUpperCase() + animal.slice(1);
      addLink(`/readings/2026-${animal}/`, `2026 ${animalCap} Reading`);

      // San He (Zodiac Trio) compatible animals
      const sanHe = graph.sanHe?.[animal] || [];
      for (const mate of sanHe) {
        const mateCap = mate.charAt(0).toUpperCase() + mate.slice(1);
        addLink(`/zodiac/${mate}/`, `${mateCap} (San He Ally)`);
      }

      // Liu He (Secret Friend)
      const liuHe = graph.liuHe?.[animal];
      if (liuHe) {
        const lhCap = liuHe.charAt(0).toUpperCase() + liuHe.slice(1);
        addLink(`/zodiac/${liuHe}/`, `${lhCap} (Liu He Friend)`);
      }

      // Recent year pages for this animal (closest to current era)
      const animalIdx = graph.zodiacAnimals?.indexOf(animal);
      if (animalIdx >= 0) {
        const recentYears = [2024, 2025, 2026].map(y => y - ((y - 4) % 12 + 12) % 12 + animalIdx)
          .filter(y => y >= 1924 && y <= 2044);
        // Find the closest recent and upcoming years for this animal
        for (let y = 2020; y <= 2032; y++) {
          if (((y - 4) % 12 + 12) % 12 === animalIdx) {
            addLink(`/zodiac-year/${y}/`, `${y} ${animalCap} Year`);
          }
        }
      }

      // Compatibility pair pages for this animal
      const liuHeAnimal = graph.liuHe?.[animal];
      if (liuHeAnimal) {
        const pairSlug = [animal, liuHeAnimal].sort().join('-');
        const lhCap2 = liuHeAnimal.charAt(0).toUpperCase() + liuHeAnimal.slice(1);
        addLink(`/compatibility/${pairSlug}/`, `${animalCap} & ${lhCap2} Compatibility`);
      }
      for (const mate of sanHe) {
        const pairSlug = [animal, mate].sort().join('-');
        const mateCap2 = mate.charAt(0).toUpperCase() + mate.slice(1);
        addLink(`/compatibility/${pairSlug}/`, `${animalCap} & ${mateCap2} Compatibility`);
      }

      // Core related topics
      addLink("/zodiac/", "All Zodiac Animals");
      addLink("/compatibility/", "Compatibility Checker");
      addLink("/wuxing/", "Wu Xing \u2014 Five Elements");
      addLink("/bazi-calculator/", "BaZi Calculator");

      return links;
    }

    // --- Reading pages: /readings/2026-{animal}/ ---
    const readingMatch = currentUrl.match(/^\/readings\/\d{4}-(\w+)\/$/);
    if (readingMatch) {
      const animal = readingMatch[1].toLowerCase();
      const animalCap = animal.charAt(0).toUpperCase() + animal.slice(1);

      // Link to this animal's encyclopedia page
      addLink(`/zodiac/${animal}/`, `${animalCap} \u2014 Personality & Traits`);

      // San He allies' readings
      const sanHe = graph.sanHe?.[animal] || [];
      for (const mate of sanHe) {
        const mateCap = mate.charAt(0).toUpperCase() + mate.slice(1);
        addLink(`/readings/2026-${mate}/`, `2026 ${mateCap} Reading`);
      }

      addLink("/readings/", "All 2026 Readings");
      addLink("/bazi-calculator/", "BaZi Calculator");
      addLink("/wuxing/", "Wu Xing \u2014 Five Elements");

      return links;
    }

    // --- Element sub-pages: /wuxing/{element}/ ---
    const elementMatch = currentUrl.match(/^\/wuxing\/(\w+)\/$/);
    if (elementMatch) {
      addLink("/wuxing/", "Wu Xing \u2014 Five Elements");
      addLink("/bazi/", "BaZi & Four Pillars");
      addLink("/tcm/", "Chinese Medicine");
      addLink("/zodiac/", "Zodiac Animals");
      addLink("/fengshui/", "Feng Shui");
      return links;
    }

    // --- Dynasty sub-pages: /dynasties/{dynasty}/ ---
    const dynastyMatch = currentUrl.match(/^\/dynasties\/(\w+)\/$/);
    if (dynastyMatch) {
      addLink("/dynasties/", "All Dynasties");
      addLink("/calendar/", "Chinese Calendar");
      addLink("/zodiac/", "Zodiac Animals");
      addLink("/bazi/", "BaZi & Four Pillars");
      addLink("/hanfu/", "Hanfu & Silk Road");
      addLink("/spring-festival/", "Spring Festival");
      return links;
    }

    // --- Year pages: /zodiac-year/{year}/ ---
    const yearMatch = currentUrl.match(/^\/zodiac-year\/(\d+)\/$/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1]);
      const animalIdx = ((year - 4) % 12 + 12) % 12;
      const animalNames = graph.zodiacAnimals || [];
      const animal = animalNames[animalIdx];
      if (animal) {
        const cap = animal.charAt(0).toUpperCase() + animal.slice(1);
        addLink(`/zodiac/${animal}/`, `${cap} \u2014 Full Profile`);
        addLink(`/readings/2026-${animal}/`, `2026 ${cap} Reading`);
        if (year > 1924) addLink(`/zodiac-year/${year - 1}/`, `Chinese Zodiac ${year - 1}`);
        if (year < 2044) addLink(`/zodiac-year/${year + 1}/`, `Chinese Zodiac ${year + 1}`);
        if (year - 12 >= 1924) addLink(`/zodiac-year/${year - 12}/`, `${year - 12} ${cap} Year`);
        if (year + 12 <= 2044) addLink(`/zodiac-year/${year + 12}/`, `${year + 12} ${cap} Year`);
      }
      addLink("/zodiac/", "All Zodiac Animals");
      addLink("/compatibility/", "Compatibility Checker");
      addLink("/wuxing/", "Wu Xing \u2014 Five Elements");
      addLink("/bazi-calculator/", "BaZi Calculator");
      return links;
    }

    // --- Compatibility pair pages: /compatibility/{animal-a}-{animal-b}/ ---
    const compatMatch = currentUrl.match(/^\/compatibility\/([a-z]+)-([a-z]+)\/$/);
    if (compatMatch) {
      const [, animalA, animalB] = compatMatch;
      const capA = animalA.charAt(0).toUpperCase() + animalA.slice(1);
      const capB = animalB.charAt(0).toUpperCase() + animalB.slice(1);
      const isSelf = animalA === animalB;

      // Link to both animal profiles
      addLink(`/zodiac/${animalA}/`, `${capA} — Full Profile`);
      if (!isSelf) addLink(`/zodiac/${animalB}/`, `${capB} — Full Profile`);

      // Link to both animal readings
      addLink(`/readings/2026-${animalA}/`, `2026 ${capA} Reading`);
      if (!isSelf) addLink(`/readings/2026-${animalB}/`, `2026 ${capB} Reading`);

      // Link to San He allies' compatibility pages for animalA
      const sanHeA = graph.sanHe?.[animalA] || [];
      for (const ally of sanHeA) {
        const allyKey = [animalA, ally].sort().join('-');
        if (allyKey !== `${animalA}-${animalB}` && allyKey !== `${animalB}-${animalA}`) {
          const allyCap = ally.charAt(0).toUpperCase() + ally.slice(1);
          addLink(`/compatibility/${allyKey}/`, `${capA} & ${allyCap}`);
        }
      }

      addLink("/compatibility/", "Full Compatibility Chart");
      addLink("/bazi-calculator/", "BaZi Calculator");
      addLink("/wuxing/", "Wu Xing \u2014 Five Elements");
      return links;
    }

    // --- Encyclopedia + other pages: use topic affinity ---
    const affinity = graph.topicAffinity?.[currentUrl];
    if (affinity) {
      for (const topic of affinity) {
        const url = `/${topic}/`;
        const label = graph.pageLabels?.[url];
        addLink(url, label);
      }
      return links;
    }

    // --- Article pages: use category to find related topics ---
    const category = data.category;
    if (category && category !== "encyclopedia" && category !== "readings") {
      const categoryMapping = {
        zodiac: ["/zodiac/", "/compatibility/", "/readings/", "/wuxing/"],
        culture: ["/spring-festival/", "/folk-arts/", "/dynasties/", "/hanfu/"],
        fengshui: ["/fengshui/", "/wuxing/", "/bazi/", "/yijing/"],
        bazi: ["/bazi/", "/bazi-calculator/", "/wuxing/", "/calendar/"],
        business: ["/directory/", "/shop/", "/zodiac/"],
      };
      const related = categoryMapping[category] || [];
      for (const url of related) {
        const label = graph.pageLabels?.[url];
        addLink(url, label);
      }
    }

    return links;
  },

  autoFaq: function (data) {
    const currentUrl = data.page?.url;
    if (!currentUrl) return null;

    // --- Zodiac animal pages: /zodiac/{animal}/ ---
    const zodiacMatch = currentUrl.match(/^\/zodiac\/(\w+)\/$/);
    if (zodiacMatch) {
      const animal = zodiacMatch[1].toLowerCase();
      const animalCap = animal.charAt(0).toUpperCase() + animal.slice(1);

      const zodiacData = {
        rat: {
          traits: "Rat people are clever, resourceful, and quick-witted. They are naturally charming, highly adaptable, and possess strong intuition. Rats are ambitious and hardworking, often excelling in social situations due to their keen observational skills.",
          years: "Recent Years of the Rat include 1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020, and 2032. The cycle repeats every 12 years.",
          compatible: "The Rat's San He (Three Harmonies) allies are the Dragon and Monkey, forming the Water trio. The Rat's Liu He (Secret Friend) is the Ox. These signs share complementary energies and natural affinity.",
          element: "The Rat is associated with the fixed element of Water (水). Water represents wisdom, flexibility, and communication — qualities that align with the Rat's clever and adaptable nature.",
          lucky: "Lucky colors for the Rat include blue, gold, and green. Lucky numbers are 2, 3, and 7. The lily and African violet are considered fortunate flowers for Rat people."
        },
        ox: {
          traits: "Ox people are diligent, dependable, and determined. They value hard work, tradition, and integrity. Known for their patience and methodical approach, Ox individuals are strong-willed leaders who achieve goals through steady perseverance.",
          years: "Recent Years of the Ox include 1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021, and 2033. The cycle repeats every 12 years.",
          compatible: "The Ox's San He (Three Harmonies) allies are the Snake and Rooster, forming the Metal trio. The Ox's Liu He (Secret Friend) is the Rat. These signs share complementary energies and natural affinity.",
          element: "The Ox is associated with the fixed element of Earth (土). Earth represents stability, reliability, and nourishment — qualities that align with the Ox's steadfast and grounded nature.",
          lucky: "Lucky colors for the Ox include white, yellow, and green. Lucky numbers are 1, 4, and 9. The tulip and evergreen are considered fortunate plants for Ox people."
        },
        tiger: {
          traits: "Tiger people are brave, competitive, and confident. They are natural leaders with a strong sense of justice and a charismatic presence. Tigers are passionate, adventurous, and unafraid to take risks.",
          years: "Recent Years of the Tiger include 1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022, and 2034. The cycle repeats every 12 years.",
          compatible: "The Tiger's San He (Three Harmonies) allies are the Horse and Dog, forming the Fire trio. The Tiger's Liu He (Secret Friend) is the Pig. These signs share complementary energies and natural affinity.",
          element: "The Tiger is associated with the fixed element of Wood (木). Wood represents growth, vitality, and expansiveness — qualities that align with the Tiger's bold and energetic nature.",
          lucky: "Lucky colors for the Tiger include blue, gray, and orange. Lucky numbers are 1, 3, and 4. The cineraria is considered a fortunate flower for Tiger people."
        },
        rabbit: {
          traits: "Rabbit people are gentle, elegant, and compassionate. They possess refined taste, diplomatic skills, and a keen sense of beauty. Rabbits are thoughtful, cautious, and excel in creating harmonious environments.",
          years: "Recent Years of the Rabbit include 1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023, and 2035. The cycle repeats every 12 years.",
          compatible: "The Rabbit's San He (Three Harmonies) allies are the Goat and Pig, forming the Wood trio. The Rabbit's Liu He (Secret Friend) is the Dog. These signs share complementary energies and natural affinity.",
          element: "The Rabbit is associated with the fixed element of Wood (木). Wood represents grace, flexibility, and cultivation — qualities that align with the Rabbit's gentle and artistic nature.",
          lucky: "Lucky colors for the Rabbit include red, pink, and purple. Lucky numbers are 3, 4, and 6. The plantain lily and jasmine are considered fortunate flowers for Rabbit people."
        },
        dragon: {
          traits: "Dragon people are ambitious, energetic, and charismatic. They are natural-born leaders who inspire others with their confidence and vision. Dragons are creative, fearless, and driven to achieve greatness.",
          years: "Recent Years of the Dragon include 1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024, and 2036. The cycle repeats every 12 years.",
          compatible: "The Dragon's San He (Three Harmonies) allies are the Rat and Monkey, forming the Water trio. The Dragon's Liu He (Secret Friend) is the Rooster. These signs share complementary energies and natural affinity.",
          element: "The Dragon is associated with the fixed element of Earth (土). Earth represents power, stability, and authority — qualities that align with the Dragon's commanding and majestic nature.",
          lucky: "Lucky colors for the Dragon include gold, silver, and white. Lucky numbers are 1, 6, and 7. The bleeding heart and dragon flowers are considered fortunate for Dragon people."
        },
        snake: {
          traits: "Snake people are wise, intuitive, and sophisticated. They are deep thinkers with a mysterious charm and excellent analytical abilities. Snakes are strategic, graceful, and possess a natural elegance.",
          years: "Recent Years of the Snake include 1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025, and 2037. The cycle repeats every 12 years.",
          compatible: "The Snake's San He (Three Harmonies) allies are the Ox and Rooster, forming the Metal trio. The Snake's Liu He (Secret Friend) is the Monkey. These signs share complementary energies and natural affinity.",
          element: "The Snake is associated with the fixed element of Fire (火). Fire represents wisdom, transformation, and illumination — qualities that align with the Snake's perceptive and insightful nature.",
          lucky: "Lucky colors for the Snake include black, red, and yellow. Lucky numbers are 2, 8, and 9. The orchid and cactus are considered fortunate plants for Snake people."
        },
        horse: {
          traits: "Horse people are energetic, free-spirited, and enthusiastic. They are warm-hearted, sociable, and love adventure and travel. Horses are quick-minded, independent, and possess great stamina and drive.",
          years: "Recent Years of the Horse include 1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026, and 2038. The cycle repeats every 12 years.",
          compatible: "The Horse's San He (Three Harmonies) allies are the Tiger and Dog, forming the Fire trio. The Horse's Liu He (Secret Friend) is the Goat. These signs share complementary energies and natural affinity.",
          element: "The Horse is associated with the fixed element of Fire (火). Fire represents passion, dynamism, and vitality — qualities that align with the Horse's energetic and spirited nature.",
          lucky: "Lucky colors for the Horse include yellow, red, and green. Lucky numbers are 2, 3, and 7. The calla lily and jasmine are considered fortunate flowers for Horse people."
        },
        goat: {
          traits: "Goat people are gentle, creative, and empathetic. They have a strong appreciation for art and beauty, and are known for their kindness and generosity. Goats are peaceful, nurturing, and possess rich inner worlds.",
          years: "Recent Years of the Goat include 1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027, and 2039. The cycle repeats every 12 years.",
          compatible: "The Goat's San He (Three Harmonies) allies are the Rabbit and Pig, forming the Wood trio. The Goat's Liu He (Secret Friend) is the Horse. These signs share complementary energies and natural affinity.",
          element: "The Goat is associated with the fixed element of Earth (土). Earth represents nurturing, stability, and creativity — qualities that align with the Goat's gentle and artistic nature.",
          lucky: "Lucky colors for the Goat include green, red, and purple. Lucky numbers are 2, 7, and 9. The carnation and primrose are considered fortunate flowers for Goat people."
        },
        monkey: {
          traits: "Monkey people are intelligent, witty, and versatile. They are natural problem-solvers with boundless curiosity and a great sense of humor. Monkeys are inventive, sociable, and excel at adapting to new situations.",
          years: "Recent Years of the Monkey include 1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028, and 2040. The cycle repeats every 12 years.",
          compatible: "The Monkey's San He (Three Harmonies) allies are the Rat and Dragon, forming the Water trio. The Monkey's Liu He (Secret Friend) is the Snake. These signs share complementary energies and natural affinity.",
          element: "The Monkey is associated with the fixed element of Metal (金). Metal represents cleverness, resourcefulness, and determination — qualities that align with the Monkey's sharp and inventive nature.",
          lucky: "Lucky colors for the Monkey include white, blue, and gold. Lucky numbers are 4, 9, and 0. The chrysanthemum and allium are considered fortunate flowers for Monkey people."
        },
        rooster: {
          traits: "Rooster people are observant, hardworking, and courageous. They are confident, honest, and take pride in their appearance and achievements. Roosters are punctual, organized, and have strong attention to detail.",
          years: "Recent Years of the Rooster include 1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029, and 2041. The cycle repeats every 12 years.",
          compatible: "The Rooster's San He (Three Harmonies) allies are the Ox and Snake, forming the Metal trio. The Rooster's Liu He (Secret Friend) is the Dragon. These signs share complementary energies and natural affinity.",
          element: "The Rooster is associated with the fixed element of Metal (金). Metal represents precision, integrity, and strength — qualities that align with the Rooster's disciplined and meticulous nature.",
          lucky: "Lucky colors for the Rooster include gold, brown, and yellow. Lucky numbers are 5, 7, and 8. The gladiola and cockscomb are considered fortunate flowers for Rooster people."
        },
        dog: {
          traits: "Dog people are loyal, honest, and reliable. They have a strong sense of justice and are always willing to help others. Dogs are faithful, courageous, and make devoted friends and partners.",
          years: "Recent Years of the Dog include 1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030, and 2042. The cycle repeats every 12 years.",
          compatible: "The Dog's San He (Three Harmonies) allies are the Tiger and Horse, forming the Fire trio. The Dog's Liu He (Secret Friend) is the Rabbit. These signs share complementary energies and natural affinity.",
          element: "The Dog is associated with the fixed element of Earth (土). Earth represents loyalty, stability, and trustworthiness — qualities that align with the Dog's faithful and dependable nature.",
          lucky: "Lucky colors for the Dog include red, green, and purple. Lucky numbers are 3, 4, and 9. The rose and oncidium are considered fortunate flowers for Dog people."
        },
        pig: {
          traits: "Pig people are compassionate, generous, and sincere. They have a warm-hearted nature and enjoy the pleasures of life. Pigs are optimistic, trusting, and possess a natural ability to bring people together.",
          years: "Recent Years of the Pig include 1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031, and 2043. The cycle repeats every 12 years.",
          compatible: "The Pig's San He (Three Harmonies) allies are the Rabbit and Goat, forming the Wood trio. The Pig's Liu He (Secret Friend) is the Tiger. These signs share complementary energies and natural affinity.",
          element: "The Pig is associated with the fixed element of Water (水). Water represents generosity, empathy, and adaptability — qualities that align with the Pig's kind and easygoing nature.",
          lucky: "Lucky colors for the Pig include yellow, gray, and brown. Lucky numbers are 2, 5, and 8. The hydrangea and daisy are considered fortunate flowers for Pig people."
        }
      };

      const info = zodiacData[animal];
      if (!info) return null;

      return [
        { q: `What are the personality traits of the ${animalCap} in Chinese zodiac?`, a: info.traits },
        { q: `What years are the Year of the ${animalCap}?`, a: info.years },
        { q: `Who is the ${animalCap} most compatible with in Chinese zodiac?`, a: info.compatible },
        { q: `What element is the ${animalCap} associated with?`, a: info.element },
        { q: `What are lucky colors and numbers for the ${animalCap}?`, a: info.lucky }
      ];
    }

    // --- BaZi page ---
    if (currentUrl === "/bazi/") {
      return [
        { q: "What is BaZi in Chinese astrology?", a: "BaZi (八字), also called the Four Pillars of Destiny, is a classical Chinese destiny analysis system that uses the year, month, day, and hour of birth to construct a chart of eight characters (Heavenly Stems and Earthly Branches). It was systematized by Xu Ziping during the Song Dynasty." },
        { q: "What are the Four Pillars of Destiny?", a: "The Four Pillars are the Year Pillar (representing social identity and ancestors), Month Pillar (career and parents), Day Pillar (self and spouse), and Hour Pillar (children and aspirations). Each pillar consists of one Heavenly Stem and one Earthly Branch." },
        { q: "How is BaZi different from Western astrology?", a: "BaZi uses the Chinese lunisolar calendar and a system of Heavenly Stems and Earthly Branches rather than star constellations. It focuses on the Five Elements (Wu Xing) interactions rather than planetary positions, and the Day Master (Day Pillar Stem) is the primary identity marker, not the year sign." },
        { q: "What is a Day Master in BaZi?", a: "The Day Master (日主) is the Heavenly Stem of your Day Pillar. It represents your core identity and is the reference point for analyzing all other elements in your chart. There are ten possible Day Masters corresponding to the ten Heavenly Stems." }
      ];
    }

    // --- Feng Shui page ---
    if (currentUrl === "/fengshui/") {
      return [
        { q: "What is feng shui?", a: "Feng shui (風水, literally 'wind-water') is the ancient Chinese practice of harmonizing people with their environment. It originated in the Warring States period and was formalized by Guo Pu in his text Zangshu (Book of Burial) during the Jin Dynasty. Classical feng shui uses two main schools: the Form School (巒頭), which reads landscape features, and the Compass School (理氣), which uses the Luopan compass." },
        { q: "What are the two main schools of feng shui?", a: "The Form School (巒頭派) analyzes the physical landscape \u2014 mountains, rivers, and terrain shapes \u2014 to assess qi flow. The Compass School (理氣派) uses the Luopan compass and mathematical formulas based on the Eight Trigrams, Flying Stars, and the Lo Shu magic square to determine auspicious orientations." },
        { q: "What is a Luopan compass?", a: "The Luopan (羅盤) is the specialized feng shui compass used by practitioners of the Compass School. It typically has 17 to 36 concentric rings containing the Eight Trigrams, 24 Mountains, Heavenly Stems, Earthly Branches, and star calculations. It was developed during the Song Dynasty." },
        { q: "Is feng shui a science or superstition?", a: "Classical feng shui is a systematic body of knowledge developed over two millennia, with roots in careful observation of landscape, climate, and environmental patterns. Pre-Qing feng shui texts like Guo Pu's Zangshu and Yang Yunsong's works describe empirical methods for assessing terrain. Modern popularized versions often diverge significantly from these classical foundations." }
      ];
    }

    // --- Calendar page ---
    if (currentUrl === "/calendar/") {
      return [
        { q: "How does the Chinese calendar work?", a: "The Chinese calendar is a lunisolar system that tracks both the moon's phases and the sun's position. Months follow the lunar cycle (29 or 30 days), while the solar year is divided into 24 Solar Terms (節氣). A leap month is inserted roughly every three years to keep the calendar aligned with the seasons." },
        { q: "What is the sexagenary cycle?", a: "The sexagenary cycle (干支, G\u0101nzh\u012b) is a 60-year cycle created by combining the 10 Heavenly Stems (天干) with the 12 Earthly Branches (地支). This system has been used continuously since the Shang Dynasty (c. 1600 BCE) for counting years, months, days, and hours." },
        { q: "When does the Chinese zodiac year start?", a: "There are two traditions: the lunisolar Chinese New Year (between January 21 and February 20) marks the popular start, while in BaZi (Four Pillars) astrology, the year begins at Lichun (立春, Start of Spring), typically February 3-5. For zodiac calculations, Lichun is the more precise boundary." }
      ];
    }

    // --- Spring Festival page ---
    if (currentUrl === "/spring-festival/") {
      return [
        { q: "When is Chinese New Year?", a: "Chinese New Year falls on the second new moon after the winter solstice, which places it between January 21 and February 20 on the Gregorian calendar. In 2026, Chinese New Year is January 17, marking the Year of the Fire Horse." },
        { q: "Why is Chinese New Year also called Spring Festival?", a: "The name Spring Festival (春節, Ch\u016bnji\u00e9) became the official designation in 1914 when the Republic of China adopted the Gregorian calendar for civic use and needed to distinguish the traditional New Year from January 1st. The festival has roots in ancient end-of-year sacrificial rites (臘祭) documented as early as the Shang Dynasty." },
        { q: "What is the Nian beast legend?", a: "According to folk tradition, Nian (年) was a fearsome creature that would emerge on New Year's Eve to attack villages. People discovered it feared loud noises, fire, and the color red \u2014 which explains the traditions of firecrackers (爆竹), red decorations, and red paper couplets (春聯) that remain central to the celebration." },
        { q: "How many days is Chinese New Year celebrated?", a: "The traditional celebration spans 15 days, from New Year's Eve (除夕) through the Lantern Festival (元宵節) on the 15th day of the first lunar month. Each day has specific customs: the first three days are for family visits, the fifth day welcomes the God of Wealth, and the fifteenth day features lanterns and tangyuan (sweet rice balls)." }
      ];
    }

    // --- Wu Xing page ---
    if (currentUrl === "/wuxing/") {
      return [
        { q: "What are the Five Elements in Chinese philosophy?", a: "The Five Elements (五行, W\u01d4 X\u00edng) are Wood (木), Fire (火), Earth (土), Metal (金), and Water (水). They represent five phases of qi transformation, not literal physical elements. The concept was developed during the Warring States period and systematized by Zou Yan (c. 305-240 BCE)." },
        { q: "What is the generating cycle of the Five Elements?", a: "In the generating cycle (相生), each element nourishes the next: Wood feeds Fire, Fire creates Earth (ash), Earth bears Metal (ore), Metal collects Water (condensation), and Water nourishes Wood. This cycle represents creation, support, and growth." },
        { q: "What is the overcoming cycle of the Five Elements?", a: "In the overcoming cycle (相剋), each element controls another: Wood parts Earth (roots), Earth dams Water, Water extinguishes Fire, Fire melts Metal, and Metal cuts Wood. This cycle represents regulation and balance, not destruction." }
      ];
    }

    // --- Taoism page ---
    if (currentUrl === "/taoism/") {
      return [
        { q: "What is Taoism?", a: "Taoism (道教/道家) is an indigenous Chinese philosophical and religious tradition centered on the Dao (道, 'the Way') \u2014 the fundamental, nameless source and principle underlying all reality. As a philosophy (道家), it dates to the Warring States period with Laozi and Zhuangzi. As an organized religion (道教), it was established during the Eastern Han Dynasty with the Celestial Masters movement." },
        { q: "What is Wu Wei in Taoism?", a: "Wu Wei (無為, 'non-action' or 'effortless action') is a central Taoist concept describing a state of being in perfect alignment with the natural flow of the Dao. It does not mean passivity, but rather acting without forcing \u2014 like water that finds its way around obstacles without effort. Laozi's Daodejing states: 'The Dao does nothing, yet nothing is left undone.'" },
        { q: "What is the Daodejing?", a: "The Daodejing (道德經, also Tao Te Ching) is the foundational text of Taoism, traditionally attributed to Laozi. It consists of 81 brief chapters totaling roughly 5,000 Chinese characters, divided into the Dao Jing (chapters on the Way) and the De Jing (chapters on Virtue). The oldest known manuscript dates to approximately 300 BCE (Guodian bamboo slips)." }
      ];
    }

    // --- Yi Jing page ---
    if (currentUrl === "/yijing/") {
      return [
        { q: "What is the Yi Jing (I Ching)?", a: "The Yi Jing (易經, Book of Changes) is one of the oldest Chinese classical texts, traditionally attributed to the legendary sage-king Fu Xi (trigrams) and King Wen of Zhou (hexagrams and judgments). It consists of 64 hexagrams, each composed of six lines that are either solid (yang) or broken (yin), accompanied by philosophical commentary." },
        { q: "How are the 64 hexagrams formed?", a: "The 64 hexagrams are formed by stacking two trigrams (three-line figures). There are 8 basic trigrams (八卦, B\u0101gu\u00e0), each representing a natural force: Heaven, Earth, Thunder, Water, Mountain, Wind, Fire, and Lake. Combining any two trigrams produces one of 64 hexagrams, each with its own meaning and interpretation." },
        { q: "How is the Yi Jing used for divination?", a: "Traditional divination uses yarrow stalks (蓍草) through a process of sorting 49 stalks into groups, performing three rounds of division to determine each line. A simpler coin method uses three coins tossed six times. Both methods generate one of the 64 hexagrams with possible changing lines, indicating the current situation and its transformation." }
      ];
    }

    // --- Qi Men Dun Jia page ---
    if (currentUrl === "/qimen/") {
      return [
        { q: "What is Qi Men Dun Jia?", a: "Qi Men Dun Jia (奇門遁甲, 'Mysterious Gates Escaping Technique') is one of the Three Styles (三式) of Chinese esoteric divination, alongside Tai Yi Shen Shu and Liu Ren. Tradition dates it to the Yellow Emperor's era, though historical evidence places its development in the Warring States to Han Dynasty period. It uses a system of nine palaces, eight gates, nine stars, and eight spirits to analyze the flow of qi through time and space." },
        { q: "What are the Eight Gates in Qi Men Dun Jia?", a: "The Eight Gates (八門) are: Open (開門), Rest (休門), Life (生門), Harm (傷門), Scenery (景門), Death (死門), Fright (驚門), and Du (杜門/Block). Each gate has specific associations and is considered auspicious or inauspicious for different activities." }
      ];
    }

    // --- TCM page ---
    if (currentUrl === "/tcm/") {
      return [
        { q: "What is Traditional Chinese Medicine?", a: "Traditional Chinese Medicine (中醫, TCM) is a system of medicine developed over more than two millennia. Its foundational text, the Huangdi Neijing (黃帝內經, Yellow Emperor's Inner Canon), dates to approximately the Warring States period. TCM is based on the concepts of qi (vital energy), yin-yang balance, the Five Elements, and the zang-fu organ system." },
        { q: "What is qi in Chinese medicine?", a: "Qi (氣) in Chinese medicine refers to the vital energy that circulates through the body along pathways called meridians (經絡). There are several types of qi: Yuan Qi (source qi from pre-heaven essence), Ying Qi (nutritive qi from food), Wei Qi (defensive qi protecting against illness), and Zong Qi (chest qi from breathing). Disease arises when qi is deficient, stagnant, or flowing in the wrong direction." },
        { q: "What are meridians in TCM?", a: "Meridians (經絡, J\u012bngu\u00f2) are the network of channels through which qi flows in the body. There are 12 primary meridians, each associated with a major organ, plus 8 extraordinary vessels. The concept was documented in the Huangdi Neijing and further developed in subsequent medical texts like the Nanjing (Classic of Difficulties)." }
      ];
    }

    // --- Tea Culture page ---
    if (currentUrl === "/tea-culture/") {
      return [
        { q: "What is the history of Chinese tea?", a: "Tea drinking in China dates back to at least the Shang Dynasty, initially as a medicinal beverage. It became a cultural practice during the Tang Dynasty, when Lu Yu wrote the Cha Jing (茶經, Classic of Tea, c. 760 CE) \u2014 the world's first comprehensive treatise on tea. By the Song Dynasty, tea culture had become central to scholar-official society, with elaborate whisked tea ceremonies." },
        { q: "What is gongfu tea?", a: "Gongfu tea (工夫茶) is a Chinese tea preparation method that uses small teapots (typically Yixing clay or Chaozhou pottery), multiple short infusions, and careful attention to water temperature and steeping time. The method originated in the Chaoshan region of Guangdong and is designed to extract the fullest flavor from high-quality oolong, pu-erh, and other teas." }
      ];
    }

    // --- Martial Arts page ---
    if (currentUrl === "/martial-arts/") {
      return [
        { q: "What are the main styles of Chinese martial arts?", a: "Chinese martial arts (武術) are broadly divided into internal (內家拳) and external (外家拳) styles. External styles like Shaolin emphasize physical conditioning and explosive power. Internal styles like Taijiquan, Xingyiquan, and Baguazhang focus on qi cultivation, soft techniques, and internal energy. The Shaolin and Wudang traditions represent the two major lineages." },
        { q: "What is the difference between Shaolin and Wudang?", a: "Shaolin (少林) represents the Buddhist martial arts tradition, originating from the Shaolin Temple in Henan Province. It emphasizes external techniques \u2014 speed, power, and acrobatic movement. Wudang (武當) represents the Daoist tradition, originating from Wudang Mountain in Hubei. It emphasizes internal cultivation \u2014 soft, circular movements, qi development, and philosophical alignment with Daoist principles." }
      ];
    }

    // --- Wuxia page ---
    if (currentUrl === "/wuxia/") {
      return [
        { q: "What is wuxia?", a: "Wuxia (武俠, 'martial heroes') is a genre of Chinese fiction about the adventures of martial artists in ancient China. The tradition traces back to Sima Qian's Shiji (Records of the Grand Historian, c. 94 BCE), which includes biographies of knight-errants (遊俠). The genre emphasizes the code of xia (俠) \u2014 righteousness, loyalty, and protecting the weak." },
        { q: "Who are the most famous wuxia authors?", a: "The most celebrated wuxia authors are Jin Yong (金庸, 1924-2018), whose 15 novels including The Legend of the Condor Heroes and The Smiling, Proud Wanderer are considered masterpieces; Gu Long (古龍, 1938-1985), known for his poetic, detective-story style; and Liang Yusheng (梁羽生, 1924-2009), who pioneered the modern wuxia novel with The Crane Startles Kunlun in 1954." }
      ];
    }

    // --- Hanfu page ---
    if (currentUrl === "/hanfu/") {
      return [
        { q: "What is Hanfu?", a: "Hanfu (漢服) refers to the traditional clothing of the Han Chinese people, encompassing styles from the Shang Dynasty (c. 1600 BCE) through the Ming Dynasty (1368-1644). The name means 'Han clothing' and distinguishes it from the Manchu-imposed Qing Dynasty dress. Typical features include cross-collar wrapping to the right (交領右衽), wide sleeves, and a sash tie system." },
        { q: "Why did Hanfu disappear?", a: "Hanfu was effectively banned by the Qing Dynasty's Tifayifu (剃髮易服, 'Shave hair, change clothing') edict of 1645, which required Han Chinese men to adopt the Manchu queue hairstyle and Manchurian clothing. Resistance was met with severe punishment. The modern Hanfu revival movement began around 2003 in mainland China." }
      ];
    }

    // --- Folk Arts page ---
    if (currentUrl === "/folk-arts/") {
      return [
        { q: "What are Chinese lion dances?", a: "Lion dance (舞獅) is a traditional Chinese performance art featuring dancers in elaborate lion costumes. There are two main traditions: the Southern lion (南獅), which originated in Guangdong and features more acrobatic movements, and the Northern lion (北獅), which is more theatrical with shaggy costumes. Lion dances are performed at festivals, business openings, and celebrations to bring good luck and drive away evil spirits." },
        { q: "What is a dragon dance?", a: "Dragon dance (舞龍) involves a team of performers carrying a long, articulated dragon figure on poles. Unlike the lion dance (performed by one or two dancers), dragon dances require a coordinated team \u2014 typically 9 to 15 people. The dragon symbolizes power, dignity, and prosperity in Chinese culture. The tradition dates to the Han Dynasty and is most prominently performed during Chinese New Year and the Lantern Festival." }
      ];
    }

    // --- Chinamaxxing page ---
    if (currentUrl === "/chinamaxxing/") {
      return [
        { q: "What is Chinamaxxing?", a: "Chinamaxxing is a modern trend of deeply engaging with authentic Chinese culture, philosophy, and practices. It goes beyond surface-level appreciation to include serious study of classical texts, Chinese martial arts training, traditional tea ceremony, calligraphy, feng shui consultation, and understanding Chinese metaphysical systems like BaZi and Wu Xing." }
      ];
    }

    // --- Compatibility page ---
    if (currentUrl === "/compatibility/") {
      return [
        { q: "How does Chinese zodiac compatibility work?", a: "Chinese zodiac compatibility is based on the relationships between the twelve Earthly Branches, not the animals themselves. Key positive relationships include San He (三合, Three Harmonies) trios and Liu He (六合, Six Harmonies/Secret Friends) pairs. Negative relationships include Liu Chong (六衝, Six Clashes) and Liu Hai (六害, Six Harms). These relationships originate from the directional and elemental properties of the Earthly Branches." },
        { q: "What are the best zodiac matches?", a: "The strongest matches are the Four Trios (三合): Rat-Dragon-Monkey (Water), Ox-Snake-Rooster (Metal), Tiger-Horse-Dog (Fire), and Rabbit-Goat-Pig (Wood). The Secret Friend (六合) pairs are also highly compatible: Rat-Ox, Tiger-Pig, Rabbit-Dog, Dragon-Rooster, Snake-Monkey, Horse-Goat." },
        { q: "What zodiac signs clash?", a: "The six direct clashes (六衝) are: Rat vs Horse, Ox vs Goat, Tiger vs Monkey, Rabbit vs Rooster, Dragon vs Dog, and Snake vs Pig. These pairs sit directly opposite each other on the zodiac wheel and represent fundamental tension \u2014 though in Chinese metaphysics, clashes can also catalyze growth and transformation." }
      ];
    }

    // --- Dynasties page ---
    if (currentUrl === "/dynasties/") {
      return [
        { q: "How many Chinese dynasties were there?", a: "China's dynastic history spans from the semi-legendary Xia Dynasty (c. 2070 BCE) through the Qing Dynasty (1644-1912). The major dynasties covered on this site (pre-Qing focus) include: Xia, Shang, Zhou (Western and Eastern), Qin, Han, Tang, Song, Yuan, and Ming. Each dynasty contributed significantly to Chinese culture, technology, and philosophical development." },
        { q: "Which Chinese dynasty was the most powerful?", a: "The Tang Dynasty (618-907 CE) is often considered China's golden age \u2014 it was the world's largest and most cosmopolitan empire of its era, with Chang'an as the world's most populous city. The Han Dynasty (206 BCE-220 CE) established the cultural foundation of Chinese civilization and gave the majority ethnic group its name. The Song Dynasty (960-1279) achieved unprecedented advances in technology, commerce, and intellectual life." }
      ];
    }

    // --- Compatibility pair pages: /compatibility/{animal-a}-{animal-b}/ ---
    const compatPairMatch = currentUrl.match(/^\/compatibility\/([a-z]+)-([a-z]+)\/$/);
    if (compatPairMatch) {
      const [, animalA, animalB] = compatPairMatch;
      const capA = animalA.charAt(0).toUpperCase() + animalA.slice(1);
      const capB = animalB.charAt(0).toUpperCase() + animalB.slice(1);
      const isSelf = animalA === animalB;

      const sanHeMapF = {rat:['Dragon','Monkey'],ox:['Snake','Rooster'],tiger:['Horse','Dog'],rabbit:['Goat','Pig'],dragon:['Rat','Monkey'],snake:['Ox','Rooster'],horse:['Tiger','Dog'],goat:['Rabbit','Pig'],monkey:['Rat','Dragon'],rooster:['Ox','Snake'],dog:['Tiger','Horse'],pig:['Rabbit','Goat']};
      const liuHeMapF = {rat:'Ox',ox:'Rat',tiger:'Pig',rabbit:'Dog',dragon:'Rooster',snake:'Monkey',horse:'Goat',goat:'Horse',monkey:'Snake',rooster:'Dragon',dog:'Rabbit',pig:'Tiger'};
      const clashMapF = {rat:'Horse',ox:'Goat',tiger:'Monkey',rabbit:'Rooster',dragon:'Dog',snake:'Pig',horse:'Rat',goat:'Ox',monkey:'Tiger',rooster:'Rabbit',dog:'Dragon',pig:'Snake'};

      const alliesA = (sanHeMapF[animalA] || []).join(' and ');
      const friendA = liuHeMapF[animalA] || '';
      const clashA = clashMapF[animalA] || '';

      const faq = [
        {q: `Are ${capA} and ${capB} compatible in Chinese zodiac?`, a: isSelf ? `Two ${capA} people share identical zodiac energy, offering deep mutual understanding. Same-sign pairings have both strengths (intuitive connection) and challenges (amplified weaknesses). The overall compatibility depends on each person's full BaZi chart, not just the year animal.` : `The ${capA} and ${capB} have a specific classical relationship in the Chinese zodiac Earthly Branch system. Their compatibility depends on whether they form a Harmony, Clash, Harm, or Neutral relationship, plus their elemental interactions. See the full analysis on this page.`},
        {q: `What is the ${capA}'s best zodiac match?`, a: `The ${capA}'s strongest matches are the ${alliesA} (San He/Three Harmony triad) and the ${friendA} (Liu He/Secret Friend). The ${capA} may experience tension with the ${clashA} (Six Clash).`},
      ];

      if (!isSelf) {
        const alliesB = (sanHeMapF[animalB] || []).join(' and ');
        const friendB = liuHeMapF[animalB] || '';
        const clashB = clashMapF[animalB] || '';
        faq.push({q: `What is the ${capB}'s best zodiac match?`, a: `The ${capB}'s strongest matches are the ${alliesB} (San He/Three Harmony triad) and the ${friendB} (Liu He/Secret Friend). The ${capB} may experience tension with the ${clashB} (Six Clash).`});
      }

      faq.push(
        {q: `Does zodiac compatibility determine relationship success?`, a: `No. Zodiac compatibility based on birth year is the most general level of analysis in Chinese astrology. A complete assessment requires examining the full BaZi chart (all four pillars), element balance, and individual character. Many successful relationships exist between supposedly incompatible signs.`},
        {q: `How can I get a more detailed compatibility reading?`, a: `For deeper analysis, use the BaZi Calculator to examine all four pillars (Year, Month, Day, Hour) of both individuals. Alternatively, consult a professional BaZi practitioner or order a premium compatibility reading that analyses the full chart interaction.`}
      );

      return faq;
    }

    // --- Year pages: /zodiac-year/{year}/ --- (autoFaq)
    const yearMatch = currentUrl.match(/^\/zodiac-year\/(\d+)\/$/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1]);
      const animalIdx = ((year - 4) % 12 + 12) % 12;
      const stemIdx = ((year - 4) % 10 + 10) % 10;
      const animalNames = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
      const elementNames = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
      const animal = animalNames[animalIdx];
      const element = elementNames[stemIdx];
      const fixedElements = ['Water','Earth','Wood','Wood','Earth','Fire','Fire','Earth','Metal','Metal','Earth','Water'];
      const fixedEl = fixedElements[animalIdx];
      const sanHeMap = {rat:['Dragon','Monkey'],ox:['Snake','Rooster'],tiger:['Horse','Dog'],rabbit:['Goat','Pig'],dragon:['Rat','Monkey'],snake:['Ox','Rooster'],horse:['Tiger','Dog'],goat:['Rabbit','Pig'],monkey:['Rat','Dragon'],rooster:['Ox','Snake'],dog:['Tiger','Horse'],pig:['Rabbit','Goat']};
      const clashMap = {rat:'Horse',ox:'Goat',tiger:'Monkey',rabbit:'Rooster',dragon:'Dog',snake:'Pig',horse:'Rat',goat:'Ox',monkey:'Tiger',rooster:'Rabbit',dog:'Dragon',pig:'Snake'};
      const liuHeMap = {rat:'Ox',ox:'Rat',tiger:'Pig',rabbit:'Dog',dragon:'Rooster',snake:'Monkey',horse:'Goat',goat:'Horse',monkey:'Snake',rooster:'Dragon',dog:'Rabbit',pig:'Tiger'};
      const key = animal.toLowerCase();
      const allies = sanHeMap[key] || [];
      const clash = clashMap[key] || '';
      const friend = liuHeMap[key] || '';

      return [
        {q: `What Chinese zodiac animal is ${year}?`, a: `${year} is the Year of the ${element} ${animal} in the Chinese zodiac. It is governed by the Heavenly Stem and Earthly Branch combination that produces ${element} energy with ${animal} characteristics.`},
        {q: `What element is the ${animal} in ${year}?`, a: `The ${year} ${animal} is associated with the ${element} element from its Heavenly Stem. The ${animal}'s fixed innate element is ${fixedEl}. Together, these create the ${element} ${animal}'s unique characteristics.`},
        {q: `Who is the ${year} ${animal} most compatible with?`, a: `The ${animal} is most compatible with the ${allies[0]} and ${allies[1]} (San He trio) and the ${friend} (Liu He secret friend). The ${animal} may experience tension with the ${clash} (Six Clash).`},
        {q: `When does the ${year} Chinese zodiac year start?`, a: `In BaZi astrology, the ${year} zodiac year begins at Lichun (Start of Spring), typically February 3-5. People born before Lichun in ${year} belong to the previous year's zodiac animal.`},
        {q: `What are the personality traits of people born in ${year}?`, a: `People born in ${year} are ${element} ${animal}s, combining the ${animal}'s core traits with ${element} elemental energy. See the full ${animal} zodiac profile for detailed personality analysis.`}
      ];
    }

    return null;
  },
};

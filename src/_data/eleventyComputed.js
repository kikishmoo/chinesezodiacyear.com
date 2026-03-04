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

      // Core related topics
      addLink("/zodiac/", "All Zodiac Animals");
      addLink("/compatibility/", "Compatibility Checker");
      addLink("/wuxing/", "Wu Xing \u2014 Five Elements");

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
};

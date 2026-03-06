export default {
  eleventyComputed: {
    breadcrumbs: (data) => {
      const d = data.dynasty;
      if (!d) return [];
      return [
        { label: "Home", url: "/" },
        { label: "Dynasties", url: "/dynasties/" },
        { label: d.name }
      ];
    },
    faq: (data) => {
      const d = data.dynasty;
      if (!d) return [];
      return [
        {
          q: `When was the ${d.name}?`,
          a: `The ${d.name} (${d.nameTc}, ${d.pinyin}) spanned ${d.dates}, with its capital at ${d.capital}.`,
          qTc: `${d.nameTc}是什麼時候？`,
          aTc: `${d.nameTc}（${d.pinyin}）存續時期為${d.dates}，都城位於${d.capital}。`,
          qSc: `${d.nameSc}是什么时候？`,
          aSc: `${d.nameSc}（${d.pinyin}）存续时期为${d.dates}，都城位于${d.capital}。`
        },
        {
          q: `What were the ${d.name}'s key contributions to Chinese culture?`,
          a: `The ${d.name}'s major contributions include: ${d.keyContributions.join('; ')}.`,
          qTc: `${d.nameTc}對中華文化有哪些主要貢獻？`,
          aTc: `${d.nameTc}的主要貢獻包括：${d.keyContributions.join('；')}。`,
          qSc: `${d.nameSc}对中华文化有哪些主要贡献？`,
          aSc: `${d.nameSc}的主要贡献包括：${d.keyContributions.join('；')}。`
        }
      ];
    }
  }
};

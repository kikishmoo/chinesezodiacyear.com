export default {
  eleventyComputed: {
    faq: (data) => {
      const d = data.dynasty;
      if (!d) return [];
      return [
        {
          q: `When was the ${d.name}?`,
          a: `The ${d.name} (${d.nameTc}, ${d.pinyin}) spanned ${d.dates}, with its capital at ${d.capital}.`
        },
        {
          q: `What were the ${d.name}'s key contributions to Chinese culture?`,
          a: `The ${d.name}'s major contributions include: ${d.keyContributions.join('; ')}.`
        }
      ];
    }
  }
};

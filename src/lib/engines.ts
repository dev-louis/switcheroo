import { Engine } from "../../types";

export const engines: Engine[] = [
  {
    engine: "google",
    image: "/engines/google.png",
    url: "https://www.google.com/search?q={searchTerm}",
  },
  {
    engine: "duckduckgo",
    image: "/engines/duckduckgo.png",
    url: "https://duckduckgo.com?q={searchTerm}",
  },
  {
    engine: "ecosia",
    image: "/engines/ecosia.png",
    url: "https://www.ecosia.org/search?q={searchTerm}",
  },
  {
    engine: "bing",
    image: "/engines/bing.png",
    url: "https://www.bing.com/search?q={searchTerm}",
  },
  {
    engine: "chatgpt",
    image: "/engines/chatgpt.png",
    darkImage: "/engines/chatgpt-dark.png",
    url: "https://chat.openai.com?q={searchTerm}",
  },
  {
    engine: "claude",
    image: "/engines/claude.png",
    url: "https://claude.ai/new?q={searchTerm}",
    notes:
      "Unfortunately, as of current Claude has no ability to automatically execute the query. However, we will automatically fill the query for you, then you can simply enter. If you are looking for a more automated experience, please consider using another engine.",
  },
  {
    engine: "unduck",
    image: "/engines/unduck.png",
    url: "https://unduck.link?q={searchTerm}",
    notes:
      "Used to Firefox's 'bangs'? This new engine will provide the same functionality!",
  },
  {
    engine: "github",
    image: "/engines/github.png",
    darkImage: "/engines/github-dark.png",
    url: "https://github.com/search?q={searchTerm}",
  },
];

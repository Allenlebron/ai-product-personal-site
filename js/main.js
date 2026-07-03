/* ═══════════ ZW 编辑大刊站 - 交互与动效 ═══════════ */

/* 外链数据(集中维护;U4/U5 接入)*/
const LINKS = {
  articles: {
    "01": "https://x.com/search?q=from%3Amyzwilpan%20AI%20%E7%BC%96%E7%A8%8B%20%E5%AE%9E%E6%88%98%20%E7%9C%9F%E5%AE%9E%E9%A1%B9%E7%9B%AE&src=typed_query&f=live",
    "02": "https://x.com/search?q=from%3Amyzwilpan%20Codex%20%E5%B7%A5%E4%BD%9C%E6%B5%81%20%E4%BB%8E%E6%83%B3%E6%B3%95%E5%88%B0%E4%BB%A3%E7%A0%81&src=typed_query&f=live",
    "03": "https://x.com/search?q=from%3Amyzwilpan%20Claude%20Code%20Cursor%20%E7%9C%9F%E5%AE%9E%E9%A1%B9%E7%9B%AE%E8%B8%A9%E5%9D%91&src=typed_query&f=live",
    "04": "https://x.com/search?q=from%3Amyzwilpan%20%E5%8F%AF%E5%A4%8D%E5%88%B6%E6%A1%88%E4%BE%8B%20%E4%BA%A7%E5%93%81%E5%A4%8D%E7%9B%98&src=typed_query&f=live",
  },
  social: {
    github: "https://github.com/Allenlebron",
    x: "https://x.com/myzwilpan",
    zhihu: "https://www.zhihu.com/people/wei-xiang-hao-ni-cheng-de-zxiao-jie",
    wechatOfficialAccount: "物联网小黑",
    writing: "#writing",
    xiaohongshu: "#writing",
    douyin:null, bilibili:null, youtube:null,  // SOON
  },
  email: "myzwilpan@gmail.com",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
const hasGSAP = typeof window.gsap !== "undefined";

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-ready"); // 兜底:无 JS 动效也能看到内容

  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  if (hasGSAP && !reduceMotion) {
    /* ── ① Landing 入场:文字逐行浮现 ── */
    const heroItems = gsap.utils.toArray("#hero [data-reveal]");
    gsap.set(heroItems, { opacity: 0, y: 20 });
    gsap.to(heroItems, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      stagger: 0.14, delay: 0.25,
    });

    /* ── 头像:粒子从左聚合 → 揭示清晰头像 → 左缘溶解(见 js/particles.js)── */

    /* ── ② 后续区块:滚动进入时,内容逐项浮现(放慢)── */
    ["#about", "#writing", "#shoot", "#build", "#contact"].forEach((sel) => {
      const section = document.querySelector(sel);
      const items = gsap.utils.toArray(sel + " [data-reveal]");
      if (!section || !items.length) return;
      gsap.set(items, { opacity: 0, y: 30 });
      gsap.to(items, {
        opacity: 1, y: 0, duration: 1.4, ease: "power3.out", stagger: 0.2,
        scrollTrigger: { trigger: section, start: "top 76%" },
      });
    });
  }

  /* ── 导航高亮:当前区块 ── */
  const navMap = { hero:null, about:"ABOUT", writing:"WRITING", shoot:"VIDEO", build:"BUILD", contact:"CONTACT" };
  const links = [...document.querySelectorAll(".nav__links a")];
  const setActive = (label) => {
    links.forEach(a =>
      a.classList.toggle("is-active", !!label && a.textContent.trim() === label));
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(navMap[e.target.id]); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    ["hero","about","writing","shoot","build","contact"].forEach(id => {
      const el = document.getElementById(id); if (el) io.observe(el);
    });
  }

  /* ── 固定导航/装饰反色:仅当"导航线"正落在深色 Shoot 区段内时 ── */
  const shootEl = document.getElementById("shoot");
  if (shootEl) {
    const NAV_LINE = 36; // 约导航条中线
    let raf = 0;
    const syncDark = () => {
      raf = 0;
      const r = shootEl.getBoundingClientRect();
      const overDark = r.top <= NAV_LINE && r.bottom >= NAV_LINE;
      document.body.classList.toggle("theme-shoot", overDark);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(syncDark); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    syncDark();
  }

  /* ── 平滑滚动 ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }
    });
  });
});

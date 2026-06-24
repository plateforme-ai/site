// biome-ignore-all lint/correctness/noUnusedVariables: scripts
// https://github.com/zjffun/reveal.js-mermaid-plugin

function getThemeHref() {
  return document.querySelector('link#theme')?.getAttribute('href') ?? '';
}

function isDarkTheme() {
  return getThemeHref().includes('dark');
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function cssMermaidVar(name) {
  return cssVar(`--mermaid-${name}`);
}

function resolveFontFamily() {
  const dedicated = cssVar('--mermaid-font-family');
  if (dedicated) return dedicated;

  const mainFont = cssVar('--r-main-font');
  if (!mainFont) return '"Geist Mono", monospace';

  const [first, ...rest] = mainFont.split(',');
  const primary = first.trim();
  const quotedPrimary = primary.startsWith('"') || primary.startsWith("'") ? primary : `"${primary}"`;
  const fallbacks = rest.join(',').trim();

  return fallbacks ? `${quotedPrimary}, ${fallbacks}` : quotedPrimary;
}

function buildThemeVariables(fontSize = 24) {
  return {
    darkMode: isDarkTheme(),
    background: cssMermaidVar('background'),
    fontFamily: resolveFontFamily(),
    fontSize,
    primaryColor: cssMermaidVar('primary'),
    primaryTextColor: cssMermaidVar('primary-text'),
    primaryBorderColor: cssMermaidVar('border'),
    secondaryColor: cssMermaidVar('secondary'),
    secondaryTextColor: cssMermaidVar('secondary-text'),
    secondaryBorderColor: cssMermaidVar('border'),
    tertiaryColor: cssMermaidVar('tertiary'),
    tertiaryTextColor: cssMermaidVar('text'),
    tertiaryBorderColor: cssMermaidVar('secondary'),
    noteBkgColor: cssMermaidVar('note-bkg'),
    noteTextColor: cssMermaidVar('note-text'),
    noteBorderColor: cssMermaidVar('note-border'),
    lineColor: cssMermaidVar('line'),
    textColor: cssMermaidVar('text'),
    titleColor: cssMermaidVar('title-color'),
    mainBkg: cssMermaidVar('main-bkg'),
    errorBkgColor: cssMermaidVar('error-bkg'),
    errorTextColor: cssMermaidVar('error-text'),
    critBkgColor: cssMermaidVar('crit-bkg'),
    critBorderColor: cssMermaidVar('crit-border'),
    gridColor: cssMermaidVar('grid'),
    vertLineColor: cssMermaidVar('vert-line'),
    excludeBkgColor: cssMermaidVar('exclude-bkg'),
    sectionBkgColor: cssMermaidVar('section-bkg'),
    sectionBkgColor2: cssMermaidVar('section-bkg-2'),
    altSectionBkgColor: cssMermaidVar('alt-section-bkg'),
    todayLineColor: cssMermaidVar('today-line'),
    taskBkgColor: cssMermaidVar('task-bkg'),
    taskBorderColor: cssMermaidVar('task-border'),
    taskTextColor: cssMermaidVar('task-text'),
    taskTextOutsideColor: cssMermaidVar('task-text-outside'),
    taskTextDarkColor: cssMermaidVar('task-text-dark'),
    taskTextLightColor: cssMermaidVar('task-text-light'),
    taskTextClickableColor: cssMermaidVar('task-text-clickable'),
    activeTaskBkgColor: cssMermaidVar('active-task-bkg'),
    activeTaskBorderColor: cssMermaidVar('active-task-border'),
    doneTaskBkgColor: cssMermaidVar('done-task-bkg'),
    doneTaskBorderColor: cssMermaidVar('done-task-border'),
    nodeBkg: cssMermaidVar('node-bkg'),
    nodeBorder: cssMermaidVar('node-border'),
    nodeTextColor: cssMermaidVar('node-text'),
    clusterBkg: cssMermaidVar('cluster-bkg'),
    clusterBorder: cssMermaidVar('cluster-border'),
    defaultLinkColor: cssMermaidVar('default-link'),
    edgeLabelBackground: cssMermaidVar('edge-label-background'),
    actorBkg: cssMermaidVar('actor-bkg'),
    actorBorder: cssMermaidVar('actor-border'),
    actorTextColor: cssMermaidVar('actor-text'),
    actorLineColor: cssMermaidVar('actor-line'),
    labelBoxBkgColor: cssMermaidVar('label-box-bkg'),
    labelBoxBorderColor: cssMermaidVar('label-box-border'),
    labelTextColor: cssMermaidVar('label-text'),
    activationBkgColor: cssMermaidVar('activation-bkg'),
    activationBorderColor: cssMermaidVar('activation-border'),
    sequenceNumberColor: cssMermaidVar('sequence-number'),
    arrowheadColor: cssMermaidVar('arrowhead'),
  };
}

function buildGanttThemeCSS() {
  const taskRadius = cssVar('--mermaid-gantt-task-radius') || '0';
  const showAxisLabels = cssVar('--mermaid-gantt-show-axis-labels');
  const fontFamily = resolveFontFamily();

  let css = `
    .mermaid-main-font,
    .sectionTitle,
    .taskText,
    .taskTextOutsideLeft,
    .taskTextOutsideRight,
    .titleText,
    .grid .tick text {
      font-family: ${fontFamily};
    }

    rect.task,
    rect.active0,
    rect.active1,
    rect.active2,
    rect.active3,
    rect.done0,
    rect.done1,
    rect.done2,
    rect.done3,
    rect.crit0,
    rect.crit1,
    rect.crit2,
    rect.crit3,
    rect.activeCrit0,
    rect.activeCrit1,
    rect.activeCrit2,
    rect.activeCrit3,
    rect.doneCrit0,
    rect.doneCrit1,
    rect.doneCrit2,
    rect.doneCrit3,
    rect.milestone {
      rx: ${taskRadius};
      ry: ${taskRadius};
    }
  `;

  if (showAxisLabels === '0' || showAxisLabels === 'false' || showAxisLabels === 'none') {
    css += '.grid .tick text { display: none; }';
  }

  return css;
}

function formatGanttMonthAxis(slide) {
  const showAxisLabels = cssVar('--mermaid-gantt-show-axis-labels');
  if (showAxisLabels === '0' || showAxisLabels === 'false' || showAxisLabels === 'none') {
    return;
  }

  slide.querySelectorAll('.mermaid svg g.grid .tick text').forEach((label, index) => {
    label.textContent = `M${index}`;
  });
}

function initMermaid(mermaidConfig, fontSize) {
  const { themeCSS: configThemeCSS = '', ...restConfig } = mermaidConfig;
  const themeCSS = [configThemeCSS, buildGanttThemeCSS()].filter(Boolean).join('\n');

  mermaid.initialize({
    startOnLoad: false,
    ...restConfig,
    themeVariables: buildThemeVariables(fontSize),
    themeCSS,
  });
}

async function refreshMermaid(slide) {
  if (!slide) return;
  const nodes = slide.querySelectorAll('.mermaid');
  nodes.forEach(preserveOriginalCode);
  await mermaid.run({ nodes });
  formatGanttMonthAxis(slide);
}

function refreshAllMermaid(reveal) {
  document.querySelectorAll('.mermaid').forEach(resetMermaidNode);
  refreshMermaid(reveal.getCurrentSlide());
}

function resetMermaidNode(node) {
  preserveOriginalCode(node);
  node.removeAttribute('data-processed');
  node.innerHTML = node.dataset.originalCode;
}

function preserveOriginalCode(node) {
  if (!node.dataset.originalCode) {
    node.dataset.originalCode = node.textContent.trim();
  }
}

function watchThemeChanges(reveal, mermaidConfig, fontSize) {
  let lastHref = getThemeHref();
  let debounceTimer = null;
  const watchedLinks = new WeakSet();

  function applyThemeChange() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const href = getThemeHref();
      if (!href || href === lastHref) return;
      lastHref = href;
      initMermaid(mermaidConfig, fontSize);
      refreshAllMermaid(reveal);
    }, 50);
  }

  function watchLink(link) {
    if (!link || watchedLinks.has(link)) return;
    watchedLinks.add(link);
    link.addEventListener('load', applyThemeChange);
  }

  function scanThemeLink() {
    const link = document.querySelector('link#theme');
    watchLink(link);

    const href = getThemeHref();
    if (!href || href === lastHref) return;

    // Cached stylesheets expose sheet immediately; uncached ones fire load.
    if (link?.sheet) {
      applyThemeChange();
    }
  }

  watchLink(document.querySelector('link#theme'));

  new MutationObserver(scanThemeLink).observe(document.head, { childList: true, subtree: true });
}

RevealMermaid = () => ({
  id: 'mermaid',

  init: (reveal) => {
    const { themeVariables: _, fontSize = 24, ...mermaidConfig } = reveal.getConfig().mermaid || {};

    initMermaid(mermaidConfig, fontSize);
    watchThemeChanges(reveal, mermaidConfig, fontSize);

    Reveal.on('ready', (event) => {
      refreshMermaid(event.currentSlide);
    });

    Reveal.on('slidechanged', (event) => {
      refreshMermaid(event.currentSlide);
    });
  },
});

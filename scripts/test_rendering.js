import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';

// Register global jsdom environment before importing React/testing-library
import 'global-jsdom/register';
import mediaQuery from 'css-mediaquery';

import React from 'react';
import { render, screen, act, cleanup } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProductCompositionDashboard from '../app/components/products/ProductCompositionDashboard.js';
import productStageData from '../data/product_stage_mix.json';

const theme = createTheme();

describe('S05 Suite 9: Responsive Component Rendering', () => {
  let originalGetBoundingClientRect;
  let originalFetch;
  let originalIntersectionObserver;
  let ResizeObserverMock;

  before(() => {
    // Mock ResizeObserver
    ResizeObserverMock = class ResizeObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe(target) {
        // Immediately trigger the callback with the target's current clientRect
        const rect = target.getBoundingClientRect();
        this.callback([{ contentRect: rect }]);
      }
      unobserve() {}
      disconnect() {}
    };
    global.ResizeObserver = ResizeObserverMock;
    originalFetch = global.fetch;
    originalIntersectionObserver = global.IntersectionObserver;
    global.IntersectionObserver = class IntersectionObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {
        this.callback([{ isIntersecting: true }]);
      }
      disconnect() {}
    };
    global.fetch = async () => ({
      ok: true,
      json: async () => productStageData,
    });

    originalGetBoundingClientRect = window.HTMLElement.prototype.getBoundingClientRect;
  });

  after(() => {
    window.HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    delete global.ResizeObserver;
    global.fetch = originalFetch;
    global.IntersectionObserver = originalIntersectionObserver;
  });

  function renderWithWidth(width) {
    // Mock getBoundingClientRect for legacy layout hooks
    window.HTMLElement.prototype.getBoundingClientRect = function () {
      return {
        width: width,
        height: 800,
        top: 0,
        left: 0,
        bottom: 800,
        right: width,
      };
    };

    // Mock matchMedia for MUI CSS media queries
    window.matchMedia = (query) => ({
      matches: mediaQuery.match(query.replace('@media ', ''), { width: `${width}px` }),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    });

    return render(
      <ThemeProvider theme={theme}>
        <ProductCompositionDashboard />
      </ThemeProvider>,
    );
  }

  it('renders at desktop width (1200px) without crashing and displays full tables', async () => {
    let root;
    act(() => {
      root = renderWithWidth(1200);
    });

    // Check header renders
    assert.ok(
      await screen.findByText(/Product attribution explorer/i),
      'Explorer header should render',
    );

    // Check flow switching buttons render
    assert.ok(screen.getByRole('button', { name: /Imports/i }));
    assert.ok(screen.getByRole('button', { name: /Exports/i }));

    // Verify it rendered successfully without runtime errors
    assert.ok(
      root.container.innerHTML.length > 1000,
      'Rendered tree should have substantial content',
    );

    // Desktop view should render both import AND export column percentages
    const percentages = Array.from(root.container.querySelectorAll('span')).filter((el) =>
      el.textContent.match(/^\d+\.\d+%$/),
    );
    assert.equal(
      percentages.length,
      14,
      'Desktop view should render 14 percentages (import and export)',
    );

    root.unmount();
  });

  it('renders at mobile width (375px) without crashing and switches to compact chart logic', async () => {
    let root;
    act(() => {
      root = renderWithWidth(375);
    });

    // Verify header still renders
    assert.ok(
      await screen.findByText(/Product attribution explorer/i),
      'Explorer header should render on mobile',
    );

    // Verify rendering completed
    assert.ok(
      root.container.innerHTML.length > 1000,
      'Rendered tree should have substantial content on mobile',
    );

    // Mobile view should hide the export column (conditional rendering via useMediaQuery)
    const percentages = Array.from(root.container.querySelectorAll('span')).filter((el) =>
      el.textContent.match(/^\d+\.\d+%$/),
    );
    assert.equal(
      percentages.length,
      7,
      'Mobile view should render only 7 percentages (import only, export hidden)',
    );

    root.unmount();
  });
});

import DomesticValueChainFramework from '../app/components/products/DomesticValueChainFramework.js';
import valueChainData from '../data/domestic_value_chain_opportunities.json';

describe('S05 Suite 10: DomesticValueChainFramework Research Preview UI', () => {
  it('renders Research preview labels, curated research links, clickable cited sources, and a dynamic total', () => {
    let root;
    act(() => {
      root = render(
        <ThemeProvider theme={theme}>
          <DomesticValueChainFramework />
        </ThemeProvider>,
      );
    });

    // Labelled Research preview
    assert.ok(
      screen.getAllByText(/Research preview/i).length >= 1,
      'Should display Research preview badge or overline',
    );

    // Curated research links note
    assert.ok(
      screen.getByText(/curated research links/i),
      'Should label metric as curated research links',
    );

    // Clickable source URL link
    const sourceLinks = root.container.querySelectorAll('a[href^="http"]');
    assert.ok(sourceLinks.length > 0, 'Should render clickable external source links');
    for (const linkEl of sourceLinks) {
      assert.equal(linkEl.getAttribute('target'), '_blank');
      assert.equal(linkEl.getAttribute('rel'), 'noopener noreferrer');
    }

    // Dynamic All N lines label
    const expectedNumber = `${valueChainData.metadata.totalEndProductLines}`;
    assert.ok(
      root.container.innerHTML.includes(expectedNumber) ||
        root.container.textContent.includes(expectedNumber),
      `Should derive All ${expectedNumber} lines from metadata`,
    );

    root.unmount();
  });
});

import Masthead from '../app/components/layout/Masthead.js';
import Footer from '../app/components/layout/Footer.js';
import PhoneBrandBrief from '../app/phones/PhoneBrandBrief.js';
import MobilityBrief from '../app/mobility/MobilityBrief.js';
import PetroleumBrief from '../app/petroleum/PetroleumBrief.js';

describe('S05 Suite 11: PhoneBrandBrief Rendering', () => {
  it('renders the h1 hero title, at least one source link, and the consumer brands hub link', () => {
    let root;
    act(() => {
      root = render(
        <ThemeProvider theme={theme}>
          <PhoneBrandBrief />
        </ThemeProvider>,
      );
    });

    // Principal page h1 headline (Masthead also uses h1 for its own title)
    const phoneH1s = Array.from(root.container.querySelectorAll('h1'));
    const phoneBriefH1 = phoneH1s.find((el) => /Your next phone may be made here/i.test(el.textContent));
    assert.ok(phoneBriefH1, 'Should render the phone brief hero h1 headline');

    // At least one external source link
    const sourceLinks = root.container.querySelectorAll('a[href^="http"]');
    assert.ok(sourceLinks.length > 0, 'Should render at least one external source link');

    // Consumer brands hub link to /brands
    const brandsHubLinks = Array.from(root.container.querySelectorAll('a')).filter(
      (a) => a.textContent.includes('Consumer brands hub') || a.textContent.includes('consumer brands hub'),
    );
    assert.ok(brandsHubLinks.length > 0, 'Should render a link to the consumer brands hub');

    root.unmount();
    cleanup();
  });
});

describe('S05 Suite 12: MobilityBrief (/brands) Rendering', () => {
  it('renders the h1 title, all three category chart landmarks, and a source link', () => {
    let root;
    act(() => {
      root = render(
        <ThemeProvider theme={theme}>
          <MobilityBrief />
        </ThemeProvider>,
      );
    });

    // Principal page h1 headline (Masthead also uses h1 for its own title)
    const mobilityH1s = Array.from(root.container.querySelectorAll('h1'));
    const mobilityBriefH1 = mobilityH1s.find((el) => /The brands India buys/i.test(el.textContent));
    assert.ok(mobilityBriefH1, 'Should render the brands hub h1 headline');

    // All three chart section aria-labels
    const phoneChart = root.container.querySelector(
      '[aria-label="Phone brand shipment-share chart"]',
    );
    assert.ok(phoneChart, 'Should render the Smartphones shipment-share chart section');

    const bikeChart = root.container.querySelector(
      '[aria-label="Two-wheelers retail market-share chart"]',
    );
    assert.ok(bikeChart, 'Should render the Two-wheelers retail market-share chart section');

    const carChart = root.container.querySelector(
      '[aria-label="Passenger vehicles retail market-share chart"]',
    );
    assert.ok(carChart, 'Should render the Passenger vehicles retail market-share chart section');

    // At least one external source link
    const sourceLinks = root.container.querySelectorAll('a[href^="http"]');
    assert.ok(sourceLinks.length > 0, 'Should render at least one external source link');

    root.unmount();
    cleanup();
  });
});

describe('S05 Suite 13: Open-Source Contribution Links UI', () => {
  it('renders accessible GitHub, Contribute, and Issues links in Masthead and Footer', () => {
    let root;
    act(() => {
      root = render(
        <ThemeProvider theme={theme}>
          <div>
            <Masthead />
            <Footer />
          </div>
        </ThemeProvider>,
      );
    });

    const repoUrl = 'https://github.com/chandn0/india-trade-dashboard';
    const contributeUrl =
      'https://github.com/chandn0/india-trade-dashboard/blob/main/CONTRIBUTING.md';
    const issuesUrl = 'https://github.com/chandn0/india-trade-dashboard/issues';

    const repoLinks = Array.from(root.container.querySelectorAll(`a[href="${repoUrl}"]`));
    const contributeLinks = Array.from(
      root.container.querySelectorAll(`a[href="${contributeUrl}"]`),
    );
    const issuesLinks = Array.from(root.container.querySelectorAll(`a[href="${issuesUrl}"]`));

    assert.ok(repoLinks.length >= 2, 'Should render GitHub Repository link in Masthead and Footer');
    assert.ok(contributeLinks.length >= 2, 'Should render Contribute link in Masthead and Footer');
    assert.ok(issuesLinks.length >= 1, 'Should render Issues link in Footer');

    for (const link of [...repoLinks, ...contributeLinks, ...issuesLinks]) {
      assert.equal(
        link.getAttribute('target'),
        '_blank',
        'External link must have target="_blank"',
      );
      assert.equal(
        link.getAttribute('rel'),
        'noopener noreferrer',
        'External link must have rel="noopener noreferrer"',
      );
      assert.ok(link.getAttribute('aria-label'), 'External link must have aria-label');
    }

    assert.ok(
      screen.getByText(/Open-source trade analytics/i),
      'Footer should present an open-source participation invitation',
    );

    root.unmount();
  });
});

describe('S05 Suite 14: PetroleumBrief Rendering', () => {
  it('renders the h1 title, the main landmark, and the Sources & method section', () => {
    let root;
    act(() => {
      root = render(
        <ThemeProvider theme={theme}>
          <PetroleumBrief />
        </ThemeProvider>,
      );
    });

    // Principal h1 headline (skip Masthead's h1 which says "India Trade Monitor")
    const h1s = Array.from(root.container.querySelectorAll('h1'));
    const briefH1 = h1s.find((el) => /petroleum import bill/i.test(el.textContent));
    assert.ok(briefH1, 'Should render a page-level h1 with the petroleum brief headline');

    // <main> landmark wrapping the brief content
    const mainEl = root.container.querySelector('main');
    assert.ok(mainEl, 'Should render a <main> landmark element');

    // Sources & method section heading
    const sourcesHeading = Array.from(root.container.querySelectorAll('h5, h2')).find((el) =>
      el.textContent.includes('Sources'),
    );
    assert.ok(sourcesHeading, 'Should render a Sources & method heading');

    // At least one external source link in the Sources section
    const sourceLinks = root.container.querySelectorAll('a[href^="http"]');
    assert.ok(sourceLinks.length > 0, 'Should render at least one external source link');

    root.unmount();
  });
});

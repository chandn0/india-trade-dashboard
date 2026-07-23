import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';

// Register global jsdom environment before importing React/testing-library
import 'global-jsdom/register';
import mediaQuery from 'css-mediaquery';

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProductCompositionDashboard from '../app/components/products/ProductCompositionDashboard.js';

const theme = createTheme();

describe('S05 Suite 9: Responsive Component Rendering', () => {
  let originalGetBoundingClientRect;
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

    originalGetBoundingClientRect = window.HTMLElement.prototype.getBoundingClientRect;
  });

  after(() => {
    window.HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    delete global.ResizeObserver;
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
      </ThemeProvider>
    );
  }

  it('renders at desktop width (1200px) without crashing and displays full tables', () => {
    let root;
    act(() => {
      root = renderWithWidth(1200);
    });

    // Check header renders
    assert.ok(screen.getByText(/Product attribution explorer/i), 'Explorer header should render');
    
    // Check flow switching buttons render
    assert.ok(screen.getByRole('button', { name: /Imports/i }));
    assert.ok(screen.getByRole('button', { name: /Exports/i }));

    // Verify it rendered successfully without runtime errors
    assert.ok(root.container.innerHTML.length > 1000, 'Rendered tree should have substantial content');

    // Desktop view should render both import AND export column percentages
    const percentages = Array.from(root.container.querySelectorAll('span')).filter(el => 
      el.textContent.match(/^\d+\.\d+%$/)
    );
    assert.equal(percentages.length, 14, 'Desktop view should render 14 percentages (import and export)');
    
    root.unmount();
  });

  it('renders at mobile width (375px) without crashing and switches to compact chart logic', () => {
    let root;
    act(() => {
      root = renderWithWidth(375);
    });

    // Verify header still renders
    assert.ok(screen.getByText(/Product attribution explorer/i), 'Explorer header should render on mobile');

    // Verify rendering completed
    assert.ok(root.container.innerHTML.length > 1000, 'Rendered tree should have substantial content on mobile');

    // Mobile view should hide the export column (conditional rendering via useMediaQuery)
    const percentages = Array.from(root.container.querySelectorAll('span')).filter(el => 
      el.textContent.match(/^\d+\.\d+%$/)
    );
    assert.equal(percentages.length, 7, 'Mobile view should render only 7 percentages (import only, export hidden)');
    
    root.unmount();
  });
});

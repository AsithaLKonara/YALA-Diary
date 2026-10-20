import { describe, it, expect } from 'vitest';
import { calculateServicePrice, ServicePricingOptions } from '../pricing';

describe('Food & Beverage Multiple Menu Options Pricing', () => {
  const fnbOptions: ServicePricingOptions = {
    strategyType: 'MENU_OPTIONS',
    menus: [
      {
        id: 'menu_sri_lankan',
        name: 'Sri Lankan Traditional Breakfast',
        description: 'Hoppers, string hoppers, pol sambol, dhal curry, tea',
        price: 15,
      },
      {
        id: 'menu_continental',
        name: 'Continental Breakfast',
        description: 'Eggs, toast, croissant, tropical fruit, coffee',
        price: 18,
      },
      {
        id: 'menu_vegan',
        name: 'Healthy Vegan Bowl',
        description: 'Granola, avocado, tropical fruits, smoothie',
        price: 16,
      },
    ],
  };

  it('calculates price when orders match total guest count across multiple menus', () => {
    // 4 guests: 2 Sri Lankan ($15 ea = $30) + 2 Continental ($18 ea = $36) = $66
    const selectedMenus = {
      menu_sri_lankan: 2,
      menu_continental: 2,
    };

    const res = calculateServicePrice(fnbOptions, 3, 1, undefined, undefined, selectedMenus);
    expect(res.valid).toBe(true);
    expect(res.totalPrice).toBe(66);
    expect(res.lines).toHaveLength(2);
    expect(res.lines[0]).toEqual({
      label: 'Sri Lankan Traditional Breakfast (2 × $15.00)',
      amount: 30,
    });
    expect(res.lines[1]).toEqual({
      label: 'Continental Breakfast (2 × $18.00)',
      amount: 36,
    });
  });

  it('calculates price when single menu is selected for all guests', () => {
    const selectedMenus = {
      menu_vegan: 3,
    };

    const res = calculateServicePrice(fnbOptions, 2, 1, undefined, undefined, selectedMenus);
    expect(res.valid).toBe(true);
    expect(res.totalPrice).toBe(48);
    expect(res.lines).toHaveLength(1);
    expect(res.lines[0].amount).toBe(48);
  });

  it('returns valid: false when no menu items are ordered', () => {
    const selectedMenus = {
      menu_sri_lankan: 0,
      menu_continental: 0,
    };

    const res = calculateServicePrice(fnbOptions, 2, 0, undefined, undefined, selectedMenus);
    expect(res.valid).toBe(false);
    expect(res.totalPrice).toBe(0);
    expect(res.validationError).toBe('Please select at least one menu option.');
  });
});

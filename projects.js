/** Verified against the owner's repositories, not employment or resume claims. */
export const projects = {
  checkout: {
    category: '01 / QUALITY ENGINEERING',
    title: 'Checkout, without surprises.',
    description: 'An exploration of checkout and pincode testing for Riotoys.',
    detail: 'A Python testing project focused on the checkout pincode flow. The repository contains the test script so you can inspect the implementation directly. Related automation explorations include Playwright, Pytest, fixtures, assertions, and page object models.',
    tags: ['Python', 'Checkout testing', 'Pincode validation'],
    url: 'https://github.com/Piyush3355/Riotoys-checkout-pincode-test',
    filter: 'quality',
  },
  retail: {
    category: '02 / DATA & INSIGHTS',
    title: 'Finding the signal.',
    description: 'Retail analytics exploring chip purchase behavior, customer segments, and store-layout performance.',
    detail: 'The analysis compares a trial store with a control store, explores seasonal sales patterns and customer segments, and considers how store layout can influence purchasing. The repository includes the transaction dataset, purchase-behavior data, and an analysis report.',
    tags: ['Retail analytics', 'Customer segmentation', 'Trial vs. control'],
    url: 'https://github.com/Piyush3355/Churn-analysis',
    filter: 'data',
  },
  robotics: {
    category: '03 / WEB EXPERIENCES',
    title: 'Made for curious minds.',
    description: 'IDOSTEP Labs — an e-commerce website for school and college robotics kits.',
    detail: 'A storefront built with HTML, CSS, and vanilla JavaScript for Arduino kits, RoboCars, drones, robot arms, and STEM parts. The project includes category filters, a Three.js hero, checkout, and responsive layouts.',
    tags: ['HTML & CSS', 'JavaScript', 'Three.js', 'Responsive design'],
    url: 'https://github.com/Piyush3355/IDOSTEM-ROBOTICS',
    filter: 'web',
  },
};

/** @param {string} filter */
export function projectCount(filter) {
  return Object.values(projects).filter(project => filter === 'all' || project.filter === filter).length;
}

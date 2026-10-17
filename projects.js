/** Professional details come from Piyush's supplied resume; automation links to his repository. */
export const projects = {
  elefant: {
    category: '01 / E-COMMERCE & LOGISTICS',
    title: 'Elefant.ai — every flow matters.',
    description: 'End-to-end manual and exploratory testing across the Admin, Adloggs, and Rider apps, covering mobile, web, and API workflows.',
    detail: 'Validated checkout flows, address management, and dynamic catalog filtering within Agile sprints. Used Postman to validate order-sync endpoints and documented 30+ reproducible defects in Plane.so with structured severity and priority classifications ahead of sprint releases.',
    tags: ['Manual & exploratory', 'E2E', 'Postman', 'Plane.so', 'Mobile & web'],
    url: 'mailto:piyushpatil.da@gmail.com?subject=Elefant.ai%20QA%20case%20study',
    linkLabel: 'Discuss this project',
    filter: 'quality',
  },
  inbuildify: {
    category: '02 / CONSTRUCTION SAAS',
    title: 'Inbuildify — logic that holds up.',
    description: 'Black-box testing of Lead Management, the Quotation Engine, and CRUD operations in a multi-tenant construction SaaS product.',
    detail: 'Applied boundary value analysis and equivalence partitioning to validate business rules and module behavior. Root cause analysis of critical quotation-engine defects enabled developers to resolve billing accuracy issues 40% faster during sprint review cycles.',
    tags: ['Black-box testing', 'Boundary value analysis', 'Equivalence partitioning', 'CRUD', 'Root cause analysis'],
    url: 'mailto:piyushpatil.da@gmail.com?subject=Inbuildify%20QA%20case%20study',
    linkLabel: 'Discuss this project',
    filter: 'saas',
  },
  automation: {
    category: '03 / AUTOMATION PRACTICE',
    title: 'Repeat less. Test more.',
    description: 'A hands-on Python and Playwright repository exploring repeatable browser automation and core test patterns.',
    detail: 'Practice covers finding elements, click and fill interactions, waiting, assertions, multiple tests, Pytest organization, page object models, data-driven testing, and fixtures. This public learning repository is separate from client work and complements my experience automating login and regression flows.',
    tags: ['Python', 'Playwright', 'Pytest', 'Page object model', 'Fixtures'],
    url: 'https://github.com/Piyush3355/Playwright-Python-learn-For-Automation',
    linkLabel: 'Explore repository',
    filter: 'automation',
  },
};

/** @param {string} filter */
export function projectCount(filter) {
  return Object.values(projects).filter(project => filter === 'all' || project.filter === filter).length;
}

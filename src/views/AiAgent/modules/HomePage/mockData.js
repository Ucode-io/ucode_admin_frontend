export const categories = [
  { 
    id: 'ecommerce', 
    name: 'E-commerce', 
    count: 15, 
    icon: 'ShoppingBag', 
    color: '#F24E1E', 
    gradient: 'linear-gradient(135deg, #F24E1E 0%, #FF7262 100%)'
  },
  { 
    id: 'financial', 
    name: 'Financial Admin', 
    count: 9, 
    icon: 'CreditCard', 
    color: '#0ACF83', 
    gradient: 'linear-gradient(135deg, #0ACF83 0%, #26F2A5 100%)'
  },
  { 
    id: 'education', 
    name: 'Education Center', 
    count: 12, 
    icon: 'GraduationCap', 
    color: '#1ABCFE', 
    gradient: 'linear-gradient(135deg, #1ABCFE 0%, #46D1FF 100%)'
  },
  { 
    id: 'schools', 
    name: 'Schools Management', 
    count: 7, 
    icon: 'School', 
    color: '#A259FF', 
    gradient: 'linear-gradient(135deg, #A259FF 0%, #B782FF 100%)'
  },
  { 
    id: 'saas', 
    name: 'SaaS Dashboard', 
    count: 18, 
    icon: 'LayoutDashboard', 
    color: '#5433FF', 
    gradient: 'linear-gradient(135deg, #5433FF 0%, #20BDFF 100%)'
  },
  { 
    id: 'cms', 
    name: 'CMS & Blogs', 
    count: 10, 
    icon: 'FileText', 
    color: '#FF7262', 
    gradient: 'linear-gradient(135deg, #FF7262 0%, #FF9F93 100%)'
  },
  { 
    id: 'booking', 
    name: 'Booking System', 
    count: 6, 
    icon: 'Calendar', 
    color: '#FFD700', 
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)'
  },
];

export const templates = [
  // E-COMMERCE
  {
    id: 'ecom-1',
    categoryId: 'ecommerce',
    title: 'Modern Shop Admin',
    description: 'A complete admin panel for managing products, orders, and customers with high-conversion analytics.',
    thumbnail: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
    demoType: 'ecommerce'
  },
  {
    id: 'ecom-2',
    categoryId: 'ecommerce',
    title: 'Inventory Master',
    description: 'Focus on inventory tracking, supplier management, and low-stock alerts.',
    thumbnail: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
    demoType: 'analytics'
  },
  
  // FINANCIAL
  {
    id: 'fin-1',
    categoryId: 'financial',
    title: 'Fintech Dashboard',
    description: 'Real-time tracking of assets, transactions, and multi-currency wallets.',
    thumbnail: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    demoType: 'financial'
  },
  {
    id: 'fin-2',
    categoryId: 'financial',
    title: 'Invoicing Pro',
    description: 'Manage invoices, payments, and tax reports efficiently.',
    thumbnail: 'linear-gradient(to top, #0ba360 0%, #3cba92 100%)',
    demoType: 'financial' // Re-using financial type
  },

  // EDUCATION
  {
    id: 'edu-1',
    categoryId: 'education',
    title: 'LMS Platform',
    description: 'Learning Management System for courses, students, and progress tracking.',
    thumbnail: 'linear-gradient(to top, #5f72bd 0%, #9b23ea 100%)',
    demoType: 'education'
  },
  {
    id: 'edu-2',
    categoryId: 'education',
    title: 'Tutor Booking',
    description: 'Schedule sessions with tutors, manage payments, and feedback.',
    thumbnail: 'linear-gradient(to top, #4481eb 0%, #04befe 100%)',
    demoType: 'calendar'
  },

  // SCHOOLS
  {
    id: 'school-1',
    categoryId: 'schools',
    title: 'School ERP',
    description: 'Complete ERP for attendance, grades, timetables, and staff management.',
    thumbnail: 'linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%)',
    demoType: 'education'
  },

  // SAAS
  {
    id: 'saas-1',
    categoryId: 'saas',
    title: 'Subscription Manager',
    description: 'Track MRR, ARR, churn, and user subscriptions in real-time.',
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    demoType: 'analytics'
  },
  {
    id: 'saas-2',
    categoryId: 'saas',
    title: 'Project Management',
    description: 'Agile project management with Kanban boards and sprint tracking.',
    thumbnail: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
    demoType: 'kanban'
  },

    // CMS
  {
    id: 'cms-1',
    categoryId: 'cms',
    title: 'Headless CMS',
    description: 'Content management for modern websites with API support.',
    thumbnail: 'linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)',
    demoType: 'cms'
  },
];

export const samplePrompts = [
  "Create a CRM for a real estate agency with property listings.",
  "Build a SaaS dashboard to track monthly recurring revenue (MRR).",
  "Design an E-commerce admin panel for a fashion brand.",
  "Develop a Booking System for a dental clinic.",
  "Create a Fintech dashboard for crypto portfolio tracking.",
  "Build a CMS for a tech blog with markdown support.",
  "Generate a project management tool with Kanban boards.",
  "Design a school management system for attendance and grades.",
  "Create a customer support portal with ticket tracking.",
  "Build an inventory management system for a warehouse.",
  "Develop a fitness tracking app dashboard with charts.",
  "Create a restaurant point of sale (POS) system UI.",
];

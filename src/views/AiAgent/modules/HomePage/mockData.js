export const categories = [
  {
    id: 'ecommerce',
    name: 'E-commerce',
    count: 5,
    icon: 'ShoppingBag',
    color: '#F24E1E',
    gradient: 'linear-gradient(135deg, #F24E1E 0%, #FF7262 100%)'
  },
  {
    id: 'financial',
    name: 'Financial Admin',
    count: 1,
    icon: 'CreditCard',
    color: '#0ACF83',
    gradient: 'linear-gradient(135deg, #0ACF83 0%, #26F2A5 100%)'
  },
  {
    id: 'education',
    name: 'Education Center',
    count: 1,
    icon: 'GraduationCap',
    color: '#1ABCFE',
    gradient: 'linear-gradient(135deg, #1ABCFE 0%, #46D1FF 100%)'
  },
  {
    id: 'schools',
    name: 'Schools Management',
    count: 0,
    icon: 'School',
    color: '#A259FF',
    gradient: 'linear-gradient(135deg, #A259FF 0%, #B782FF 100%)'
  },
  {
    id: 'saas',
    name: 'SaaS Dashboard',
    count: 5,
    icon: 'LayoutDashboard',
    color: '#5433FF',
    gradient: 'linear-gradient(135deg, #5433FF 0%, #20BDFF 100%)'
  },
  {
    id: 'cms',
    name: 'CMS & Blogs',
    count: 2,
    icon: 'FileText',
    color: '#FF7262',
    gradient: 'linear-gradient(135deg, #FF7262 0%, #FF9F93 100%)'
  },
  {
    id: 'booking',
    name: 'Booking System',
    count: 2,
    icon: 'Calendar',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)'
  },
];

const recommendedPrompts = [
  {
    title: "TMS Admin Panel",
    prompt:
      "Create a Transport Management System admin panel with real-time fleet tracking, driver assignment, route optimization, and shipment status logs.",
  },
  {
    title: "WMS Admin Panel",
    prompt:
      "Create a Warehouse Management System admin panel with inventory tracking, stock alerts, shelf mapping, and incoming/outgoing shipment logs.",
  },
  {
    title: "Delivery Admin Panel",
    prompt:
      "Create a delivery service admin panel with courier management, delivery zone maps, order dispatching system, and customer feedback analytics.",
  },
  {
    title: "Supply Chain Admin Panel",
    prompt:
      "Create a supply chain admin panel with vendor management, procurement tracking, and global logistics monitoring.",
  },
  {
    title: "CRM Admin Panel",
    prompt:
      "Create a CRM admin panel with sales pipelines, lead management, customer activity history, and sales team performance charts.",
  },
  {
    title: "ERP Admin Panel",
    prompt:
      "Create a full-scale ERP admin panel with modular views for finance, manufacturing, human resources, and internal resource planning.",
  },
  {
    title: "Billing Admin Panel",
    prompt:
      "Create a billing and invoicing admin panel with payment gateway status, automated invoice generation, tax reports, and subscription management.",
  },
  {
    title: "POS Admin Panel",
    prompt:
      "Create a Point of Sale admin panel for retail with daily sales reports, inventory sync, store manager permissions, and discount controls.",
  },
  {
    title: "LMS Admin Panel",
    prompt:
      "Create a Learning Management System admin panel with course creation tools, student enrollment stats, grading systems, and video content hosting.",
  },
  {
    title: "CMS Admin Panel",
    prompt:
      "Create a Content Management System admin panel with a blog post editor, media library, SEO settings, and user role permissions.",
  },
  {
    title: "Social Media Admin Panel",
    prompt:
      "Create a social platform admin panel with user moderation, content reporting, engagement analytics, and ad campaign management.",
  },
  {
    title: "Healthcare Admin Panel",
    prompt:
      "Create a clinic admin panel with patient scheduling, doctor availability calendars, electronic health records (EHR), and billing.",
  },
  {
    title: "Booking Admin Panel",
    prompt:
      "Create a booking system admin panel for hotels or services with occupancy calendars, reservation management, and pricing rules.",
  },
  {
    title: "Support Admin Panel",
    prompt:
      "Create a helpdesk admin panel with support ticket queues, SLA tracking, live chat monitoring, and agent performance KPIs.",
  },
  {
    title: "SaaS Admin Panel",
    prompt:
      "Create a SaaS multi-tenant admin panel with user subscription tiers, API usage monitoring, server health stats, and account settings.",
  },
  {
    title: "App Analytics Admin Panel",
    prompt:
      "Create a mobile app admin panel with user retention charts, crash reports, heatmaps, and push notification management.",
  },
];

export const templates = [
  // E-COMMERCE (includes Logistics/Supply Chain)
  {
    id: 'tms-1',
    categoryId: 'ecommerce',
    title: 'TMS Admin Panel',
    description: 'Create a Transport Management System admin panel with real-time fleet tracking, driver assignment, route optimization, and shipment status logs.',
    thumbnail: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
    demoType: 'ecommerce'
  },
  {
    id: 'wms-1',
    categoryId: 'ecommerce',
    title: 'WMS Admin Panel',
    description: 'Create a Warehouse Management System admin panel with inventory tracking, stock alerts, shelf mapping, and incoming/outgoing shipment logs.',
    thumbnail: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
    demoType: 'ecommerce'
  },
  {
    id: 'delivery-1',
    categoryId: 'ecommerce',
    title: 'Delivery Admin Panel',
    description: 'Create a delivery service admin panel with courier management, delivery zone maps, order dispatching system, and customer feedback analytics.',
    thumbnail: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
    demoType: 'ecommerce'
  },
  {
    id: 'supply-1',
    categoryId: 'ecommerce',
    title: 'Supply Chain Admin',
    description: 'Create a supply chain admin panel with vendor management, procurement tracking, and global logistics monitoring.',
    thumbnail: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
    demoType: 'ecommerce'
  },
  {
    id: 'pos-1',
    categoryId: 'ecommerce',
    title: 'POS Admin Panel',
    description: 'Create a Point of Sale admin panel for retail with daily sales reports, inventory sync, store manager permissions, and discount controls.',
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    demoType: 'ecommerce'
  },

  // SAAS (includes CRM, ERP, Support)
  {
    id: 'crm-1',
    categoryId: 'saas',
    title: 'CRM Admin Panel',
    description: 'Create a CRM admin panel with sales pipelines, lead management, customer activity history, and sales team performance charts.',
    thumbnail: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    demoType: 'kanban'
  },
  {
    id: 'erp-1',
    categoryId: 'saas',
    title: 'ERP Admin Panel',
    description: 'Create a full-scale ERP admin panel with modular views for finance, manufacturing, human resources, and internal resource planning.',
    thumbnail: 'linear-gradient(to top, #0ba360 0%, #3cba92 100%)',
    demoType: 'analytics'
  },
  {
    id: 'support-1',
    categoryId: 'saas',
    title: 'Support Admin Panel',
    description: 'Create a helpdesk admin panel with support ticket queues, SLA tracking, live chat monitoring, and agent performance KPIs.',
    thumbnail: 'linear-gradient(to top, #5f72bd 0%, #9b23ea 100%)',
    demoType: 'kanban'
  },
  {
    id: 'saas-1',
    categoryId: 'saas',
    title: 'SaaS Admin Panel',
    description: 'Create a SaaS multi-tenant admin panel with user subscription tiers, API usage monitoring, server health stats, and account settings.',
    thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    demoType: 'analytics'
  },
  {
    id: 'app-1',
    categoryId: 'saas',
    title: 'App Analytics Panel',
    description: 'Create a mobile app admin panel with user retention charts, crash reports, heatmaps, and push notification management.',
    thumbnail: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    demoType: 'analytics'
  },

  // FINANCIAL
  {
    id: 'billing-1',
    categoryId: 'financial',
    title: 'Billing Admin Panel',
    description: 'Create a billing and invoicing admin panel with payment gateway status, automated invoice generation, tax reports, and subscription management.',
    thumbnail: 'linear-gradient(to top, #4481eb 0%, #04befe 100%)',
    demoType: 'financial'
  },

  // EDUCATION
  {
    id: 'lms-1',
    categoryId: 'education',
    title: 'LMS Admin Panel',
    description: 'Create a Learning Management System admin panel with course creation tools, student enrollment stats, grading systems, and video content hosting.',
    thumbnail: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
    demoType: 'education'
  },

  // CMS
  {
    id: 'cms-1',
    categoryId: 'cms',
    title: 'CMS Admin Panel',
    description: 'Create a Content Management System admin panel with a blog post editor, media library, SEO settings, and user role permissions.',
    thumbnail: 'linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)',
    demoType: 'cms'
  },
  {
    id: 'social-1',
    categoryId: 'cms',
    title: 'Social Media Admin',
    description: 'Create a social platform admin panel with user moderation, content reporting, engagement analytics, and ad campaign management.',
    thumbnail: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
    demoType: 'feed'
  },

  // BOOKING
  {
    id: 'healthcare-1',
    categoryId: 'booking',
    title: 'Healthcare Admin',
    description: 'Create a clinic admin panel with patient scheduling, doctor availability calendars, electronic health records (EHR), and billing.',
    thumbnail: 'linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%)',
    demoType: 'calendar'
  },
  {
    id: 'booking-1',
    categoryId: 'booking',
    title: 'Booking Admin Panel',
    description: 'Create a booking system admin panel for hotels or services with occupancy calendars, reservation management, and pricing rules.',
    thumbnail: 'linear-gradient(to top, #ff0844 0%, #ffb199 100%)',
    demoType: 'calendar'
  },
];

export const samplePrompts = recommendedPrompts.map(p => p.prompt);

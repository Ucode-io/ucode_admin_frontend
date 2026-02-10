import {useRef} from "react";

export const usePromptContainer = () => {

  const inputRef = useRef(null);

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

  return {
    recommendedPrompts,
    inputRef,
  }
}
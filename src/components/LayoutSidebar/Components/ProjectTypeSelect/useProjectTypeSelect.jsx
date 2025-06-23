import { useForm } from "react-hook-form";
import {
  PMSManagementOptions,
  HRManagementOptions,
  CRMManagementOptions,
  FinanceManagementOptions,
  TaskManagerOptions,
  EcommerceOptions,
  LMSOptions,
  DocumentManagementOptions,
  CustomerSupportOptions,
  MarketingAutomationOptions,
  InventoryManagementOptions,
  ITHelpdeskOptions,
  ConstructionProjectOptions,
} from "./constants";
import { useMcpCellMutation } from "@/services/mcp";

export const useProjectTypeSelect = ({
  handleSuccess,
  handleError,
  handleClose,
  appendMessage,
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm();

  const cellMcpMutation = useMcpCellMutation({
    onSuccess: (data) => {
      appendMessage({
        text: `Project Type: ${watch("project_type")}\nManagement System: ${watch("management_system")}
        `,
      });
      handleSuccess(data);
    },
    onError: (error) => {
      handleError(error?.data?.message || error?.data);
    },
  });

  const onSubmit = (data) => {
    cellMcpMutation.mutate(data);
  };

  const onCancel = () => {
    reset();
    handleClose();
  };

  const projectTypeOptions = [
    {
      label: "Project Management System",
      value: "Project Management System",
    },
    { label: "HR (Human Resources)", value: "HR (Human Resources)" },
    {
      label: "CRM (Customer Relationship Management)",
      value: "CRM (Customer Relationship Management)",
    },
    { label: "Finance", value: "Finance" },
    { label: "Task Manager", value: "Task Manager" },
    { label: "E-commerce", value: "E-commerce" },
    {
      label: "Learning Management System (LMS)",
      value: "Learning Management System (LMS)",
    },
    { label: "Document Management", value: "Document Management" },
    { label: "Customer Support", value: "Customer Support" },
    { label: "Marketing Automation", value: "Marketing Automation" },
    { label: "Inventory Management", value: "Inventory Management" },
    { label: "IT Helpdesk / DevOps", value: "IT Helpdesk / DevOps" },
    { label: "Construction Project", value: "Construction Project" },
  ];

  const getManagementOptions = (projectType) => {
    switch (projectType) {
      case "Project Management System": {
        return PMSManagementOptions;
      }
      case "HR (Human Resources)": {
        return HRManagementOptions;
      }
      case "CRM (Customer Relationship Management)": {
        return CRMManagementOptions;
      }
      case "Finance": {
        return FinanceManagementOptions;
      }
      case "Task Manager": {
        return TaskManagerOptions;
      }
      case "E-commerce": {
        return EcommerceOptions;
      }
      case "Learning Management System (LMS)": {
        return LMSOptions;
      }
      case "Document Management": {
        return DocumentManagementOptions;
      }
      case "Customer Support": {
        return CustomerSupportOptions;
      }
      case "Marketing Automation": {
        return MarketingAutomationOptions;
      }
      case "Inventory Management": {
        return InventoryManagementOptions;
      }
      case "IT Helpdesk / DevOps": {
        return ITHelpdeskOptions;
      }
      case "Construction Project": {
        return ConstructionProjectOptions;
      }
      default: {
        return null;
      }
    }
  };

  return {
    control,
    errors,
    onSubmit,
    onCancel,
    handleSubmit,
    projectTypeOptions,
    getManagementOptions,
    watch,
    setValue,
    isLoading: cellMcpMutation.isLoading,
  };
};

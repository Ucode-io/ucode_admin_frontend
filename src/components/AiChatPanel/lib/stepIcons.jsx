import {
  Cpu,
  Sparkles,
  Brain,
  ScanSearch,
  Database,
  Columns,
  Link as LinkIcon,
  Folder,
  PlusCircle,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Circle,
} from "lucide-react";

/** Maps SSE `icon` names (Lucide) to components. Keep a default for new values. */
const ICONS = {
  cpu: Cpu,
  sparkles: Sparkles,
  brain: Brain,
  "scan-search": ScanSearch,
  database: Database,
  columns: Columns,
  link: LinkIcon,
  folder: Folder,
  "plus-circle": PlusCircle,
  "alert-triangle": AlertTriangle,
  "alert-circle": AlertCircle,
  "check-circle": CheckCircle,
};

export const StepIcon = ({ icon, size = 16, ...props }) => {
  const Cmp = ICONS[icon] || Circle;
  return <Cmp size={size} {...props} />;
};

export default StepIcon;

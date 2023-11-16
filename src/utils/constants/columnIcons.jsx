import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AppsIcon from "@mui/icons-material/Apps";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ColorizeIcon from "@mui/icons-material/Colorize";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EmailIcon from "@mui/icons-material/Email";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FunctionsIcon from "@mui/icons-material/Functions";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import LinkIcon from "@mui/icons-material/Link";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import MapIcon from "@mui/icons-material/Map";
import PasswordIcon from "@mui/icons-material/Password";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

export const columnIcons = (type) => {
  switch (type) {
    case "SINGLE_LINE":
      return <TextFieldsIcon />;
    case "MULTI_LINE":
      return <FormatAlignJustifyIcon />;
    case "NUMBER":
      return <LooksOneIcon />;
    case "MULTISELECT":
      return <ArrowDropDownCircleIcon />;
    case "PHOTO":
      return <PhotoSizeSelectActualIcon />;
    case "VIDEO":
      return <PlayCircleIcon />;
    case "FILE":
      return <InsertDriveFileIcon />;
    case "FORMULA":
      return <FunctionsIcon />;
    case "PHONE":
      return <LocalPhoneIcon />;
    case "INTERNATION_PHONE":
      return <LocalPhoneIcon />;
    case "EMAIL":
      return <EmailIcon />;
    case "ICON":
      return <AppsIcon />;
    case "BARCODE":
      return <QrCodeScannerIcon />;
    case "QRCODE":
      return <QrCode2Icon />;
    case "COLOR":
      return <ColorizeIcon />;
    case "PASSWORD":
      return <PasswordIcon />;
    case "PICK_LIST":
      return <ChecklistIcon />;
    case "DATE":
      return <DateRangeIcon />;
    case "TIME":
      return <AccessTimeIcon />;
    case "DATE_TIME":
      return <InsertInvitationIcon />;
    case "CHECKBOX":
      return <CheckBoxIcon />;
    case "MAP":
      return <MapIcon />;
    case "SWITCH":
      return <ToggleOffIcon />;
    case "FLOAT_NOLIMIT":
      return <LooksOneIcon />;
    case "DATE_TIME_WITHOUT_TIME_ZONE":
      return <InsertInvitationIcon />;
    default:
      return <LinkIcon />;

    // SINGLE_LINE: <TextFieldsIcon />,
    // MULTI_LINE: <FormatAlignJustifyIcon />,
    // NUMBER: <LooksOneIcon />,
    // MULTISELECT: <ArrowDropDownCircleIcon />,
    // PHOTO: <PhotoSizeSelectActualIcon />,
    // VIDEO: <PlayCircleIcon />,
    // FILE: <InsertDriveFileIcon />,
    // FORMULA: <FunctionsIcon />,
    // PHONE: <LocalPhoneIcon />,
    // INTERNATION_PHONE: <LocalPhoneIcon />,
    // EMAIL: <EmailIcon />,
    // ICON: <AppsIcon />,
    // BARCODE: <QrCodeScannerIcon />,
    // QRCODE: <QrCode2Icon />,
    // COLOR: <ColorizeIcon />,
    // PASSWORD: <PasswordIcon />,
    // PICK_LIST: <ChecklistIcon />,
    // DATE: <DateRangeIcon />,
    // TIME: <AccessTimeIcon />,
    // DATE_TIME: <InsertInvitationIcon />,
    // CHECKBOX: <CheckBoxIcon />,
    // MAP: <MapIcon />,
    // SWITCH: <ToggleOffIcon />,
    // FLOAT_NOLIMIT: <LooksOneIcon />,
    // DATE_TIME_WITHOUT_TIME_ZONE: <InsertInvitationIcon />,
  }
};

import { Card, CardContent, Typography, Button, Chip, Box } from '@mui/material';
import { format } from 'date-fns';
import { BiTrash } from 'react-icons/bi';

const parseUserAgent = (userAgent) => {
  const osRegex = /\(([^)]+)\)/;
  const osMatch = userAgent.match(osRegex);

  let osInfo = "Unknown OS";
  if (osMatch) {
    const parts = osMatch[1].split(";").map(part => part.trim());

    osInfo = parts.filter(part => 
      part.includes("Windows") || 
      part.includes("Mac OS X") || 
      part.includes("Linux") || 
      part.includes("Android") || 
      part.includes("CPU") || 
      part.includes("Intel")
    ).map(part => {
      // Убираем номера версий, такие как X 10_15_7 или 10.0; Win64
      return part.replace(/ X [\d_]+| \d+(\.\d+)*(; .+)?/g, "").trim();
    }).join("; ");
  }

  let deviceType = "Unknown Device";
  let browser = "Unknown Browser";

  if (userAgent.includes("Macintosh")) {
    deviceType = "MacBook";
  } else if (userAgent.includes("iPhone")) {
    deviceType = "iPhone";
  } else if (userAgent.includes("Android")) {
    deviceType = "Android Device";
  }

  if (userAgent.includes("Chrome")) {
    browser = "Google Chrome";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari";
  } else if (userAgent.includes("Firefox")) {
    browser = "Mozilla Firefox";
  }

  return { deviceType, osInfo, browser };
};

export const DeviceCard = ({ device, onDeleteClick }) => {

  const { deviceType, osInfo, browser } = parseUserAgent(device?.data)
  const isCurrentSession = device?.is_current === true;

  return (
    <Card
      sx={{
        padding: 2,
        borderRadius: 1,
        position: 'relative',
        transition: 'transform 0.3s',
        boxShadow: "none",
        border: isCurrentSession
          ? "1px solid #2e7d32"
          : "1px solid rgba(55, 53, 47, 0.09)",
        backgroundColor: isCurrentSession ? "rgba(46, 125, 50, 0.04)" : undefined,
      }}
    >
      <Button 
        variant="contained" 
        color="inherit" 
        onClick={() => onDeleteClick(device?.id)}
        sx={{
          position: 'absolute',
          top: 3,
          right: 0,
          padding: "5px",
          minWidth: "40px",
          backgroundColor: "transparent",
          boxShadow: "none",
          ":hover": {
            backgroundColor: "transparent"
          }
        }}
      >
        <BiTrash size={16} color="red" />
      </Button>
      <CardContent sx={{padding: 0, paddingBottom: "0 !important"}}>
        <Box display="flex" alignItems="center" gap={1} paddingRight="40px">
          <Typography
            sx={{
              fontWeight: 400,
              color: "rgb(29, 27, 22)",
            }}
            variant="h6"
          >
            {deviceType}
          </Typography>
          {isCurrentSession && (
            <Chip
              label="Current session"
              color="success"
              size="small"
              sx={{ height: "22px", fontSize: "12px" }}
            />
          )}
        </Box>
        <Typography marginBottom={1}>
          {osInfo} {browser}
        </Typography>
        <Typography fontSize="14px" marginBottom={1}>
          <strong>IP:</strong> {device.ip}
        </Typography>
        <Typography fontSize="14px">
          <strong>Created at: </strong>{format(new Date(device.created_at), "MMMM d, yyyy 'at' kk:mm")}
        </Typography>
      </CardContent>
  </Card>
  );
};

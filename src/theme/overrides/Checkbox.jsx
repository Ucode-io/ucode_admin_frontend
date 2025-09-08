import { Icon } from '@iconify/react';

const ICON_MEDIUM = { width: 24, height: 24 };
const ICON_SMALL = { width: 20, height: 20 };

export default function Checkbox(theme) {
  return {
    MuiCheckbox: {
      defaultProps: {
        // Кастомные иконки
        icon: (
          <span
            style={{
              width: 20,
              height: 20,
              border: "1px solid #D0D5DD",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              transition: "all 0.2s ease",
            }}
          />
        ),
        checkedIcon: (
          <span
            style={{
              width: 20,
              height: 20,
              border: "1px solid #004EEB",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              transition: "all 0.2s ease",
            }}
          >
            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.1667 3.5L5.75 9.91667L2.83333 7"
                stroke="#004EEB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        ),
      },

      styleOverrides: {
        root: {
          padding: theme.spacing(0.5),
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "transparent",
            "& .MuiSvgIcon-root": {
              display: "none",
            },
          },
          '& svg[font-size="small"]': { ...ICON_SMALL },
          "&.Mui-checked.Mui-disabled, &.Mui-disabled": {
            opacity: 0.5,
            pointerEvents: "none",
          },
        },
      },
    },
  };
}

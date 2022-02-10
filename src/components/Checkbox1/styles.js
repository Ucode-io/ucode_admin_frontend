import styled from "styled-components"
import Checkbox from "@material-ui/core/Checkbox"
import { FormControlLabel } from "@material-ui/core"

export const StyledCheckbox = styled(Checkbox)`
  &.Mui-checked {
    color: ${({ theme }) => theme.palette.primary[600]};
  }
  & input:focus {
    opacity: 0;
  }
`
export const StyledFormControlLabel = styled(FormControlLabel)`
  .MuiTypography-root {
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: -0.006em;
    text-align: left;
    color: rgba(0, 0, 0, 0.85);
  }
`

import { Tab, Tabs, withStyles, makeStyles } from "@material-ui/core"
import { useMemo } from "react"

export const StyledTabs = withStyles((props) => {
  return {
    indicator: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "#0D72F6",
      height: "3px",
      // "& > span": {
      //   maxWidth: 130,
      //   width: "100%",
      //   backgroundColor: "#0D72F6",
      // },
    },
    scroller: {
      height: 56,
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
    },
  }
})((props) => <Tabs {...props} />)

// const useStyles = makeStyles({
//   indicator: {
//     display: "flex",
//     justifyContent: "center",
//     backgroundColor: "transparent",
//     height: "3px",
//     "& > span": {
//       maxWidth: 130,
//       width: "100%",
//       backgroundColor: "#0D72F6",
//     },
//   },
//   scroller: {
//     height: (props) => props.scrollerHeight ?? 'auto',
//     justifyContent: 'center',
//     display: 'flex',
//     flexDirection: 'column'
//   }
// });
//
// export const StyledTabs = (props) => {
//   const classes = useStyles({ height: props.scrollerHeight });
//
//   return <Tabs {...props} TabIndicatorProps={{ children: <span /> }} className={classes} />
// }

export const StyledTab = withStyles((theme) => ({
  root: {
    color: "#6E8BB7",
    textTransform: "none",
    opacity: "1",
    minWidth: "auto",
    maxWidth: "none",
    padding: "0 4px",
    marginRight: "20px",
  },
}))((props) => <Tab disableRipple {...props} />)

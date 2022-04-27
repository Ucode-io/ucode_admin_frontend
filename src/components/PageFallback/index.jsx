

import { Skeleton } from "@mui/material"

const PageFallback = () => {
  return (
    <div className="FallbackPage">
      <Skeleton variant="rectangular" width={"100%"} height={56} />
      <div style={{ padding: "20px" }}>
        <Skeleton
          variant="rectangular"
          width={"100%"}
          height={"calc(100vh - 96px)"}
        />
      </div>
    </div>
  )
}

export default PageFallback

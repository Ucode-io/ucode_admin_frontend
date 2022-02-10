import Skeleton from "@material-ui/lab/Skeleton"

export default function CustomSkeleton() {
  return (
    <div>
      <Skeleton variant="rect" width="100%" height={64} animation="wave" />
      <div className="p-4 w-full grid grid-cols-2 gap-4 box-border">
        <div>
          <Skeleton variant="rect" width="100%" height={500} animation="wave" />
        </div>
        <div>
          <Skeleton variant="rect" width="100%" height={500} animation="wave" />
        </div>
      </div>
    </div>
  )
}

import React from "react"
import Skeleton from '@material-ui/lab/Skeleton';

function LoaderComponent({isLoader = true}) {
  if(!isLoader) return null
  const skeletonArray = Array(8).fill('');

  return (
    <div className="w-full">
      {
        isLoader && skeletonArray.map((_,index)=>(
          <Skeleton height={70} key={index}/>
        ))
      }
    </div>
  )
}

export default LoaderComponent
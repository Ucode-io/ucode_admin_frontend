import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarHalfIcon from '@material-ui/icons/StarHalf';

export default function FiveStar({ value = 3.8, size = 24 }) {
  const data = [0, 1, 2, 3, 4]

  const defineType = (elm) => {
    if (elm < value && elm + 1 > value) {
      return <StarHalfIcon key={elm} className='fill-current text-yellow-600' style={{ fontSize: size }} />
    } else if (elm < value) {
      return <StarIcon key={elm} className='fill-current text-yellow-600' style={{ fontSize: size }} />
    } else {
      return <StarBorderIcon key={elm} className='fill-current text-lightgray-1' style={{ fontSize: size }} />
    }
  }

  return (
    <div className='flex items-center'>
      {data.map(elm => defineType(elm))}
    </div>
  )
}
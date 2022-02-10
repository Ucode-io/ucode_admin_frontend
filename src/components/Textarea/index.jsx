import './index.scss'
export default function TextArea({className, style, error, size = 3, ...rest}) {
  return (
    <div
        className={`
            border
            bg-white
            flex
            space-x-2
            items-center
            rounded-lg
            text-body
            px-2
            p-1
            w-full
            font-smaller
            focus-within:ring-1
            focus-within:outline-none
            transition
            focus-within:border-blue-700
            ${error ? 'border-red-600' : 'border-gray-200'}
            ${className}
        `}
        style={style}
    >
        <textarea
          className="w-full outline-none"
          style={{height: size * 24}}
          type="text"
          {...rest}
        ></textarea>
    </div>
  );
}

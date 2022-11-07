const convertToKbytes = (bytes) => {
    return (bytes * 0.000001).toString().substring(0, 5)
}

export default convertToKbytes

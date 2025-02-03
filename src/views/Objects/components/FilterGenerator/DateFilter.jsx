import CRangePickerNewWithoutTime from "../../../../components/DatePickers/CRangePickerNewWithoutTime";

const DateFilterWithoutTimeZ = ({onChange, value, placeholder, field}) => {
  return (
    <>
      <CRangePickerNewWithoutTime
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

export default DateFilterWithoutTimeZ;

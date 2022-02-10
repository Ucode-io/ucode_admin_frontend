import Modal from "../../../../components/Modal";
import { useTranslation } from "react-i18next";
import CloseIcon from "@material-ui/icons/Close";
import numberToPrice from "../../../../helpers/numberToPrice";
import Switch from "../../../../components/Switch";
import Button from "../../../../components/Button";

export default function ProductModal({
  open,
  onClose,
  categories,
  products,
  onSubmit,
  switchCategory,
  categoryId,
  setCheckedProducts,
  checkedProducts,
  ...props
}) {
  const { t } = useTranslation();

  const onChange = (id) => {
    const product = checkedProducts.find((item) => item === id);
    if (product) {
      setCheckedProducts((prev) => [...prev.filter((item) => item !== id)]);
    } else {
      setCheckedProducts((prev) => [...prev, id]);
    }
  };

  return (
    <Modal
      title={null}
      footer={null}
      open={open}
      onClose={onClose}
      {...props}
      style={{ padding: "0" }}
      width={600}
      header={
        <div className="flex justify-between items-center px-4 py-3 text-md font-medium">
          Добавить продукт
          <span className="cursor-pointer" onClick={onClose}>
            <CloseIcon />
          </span>
        </div>
      }
    >
      <div className="px-4 pb-4">
        <div className="flex">
          {categories.map((item) => (
            <div
              onClick={() => switchCategory(item.id)}
              className={`mr-2 text-sm px-3 cursor-pointer py-1 border rounded-md ${
                item.id === categoryId ? "bg-gray-100" : ""
              }`}
            >
              {item.name.ru}
            </div>
          ))}
        </div>
        <div
          className="mt-4"
          style={{ maxHeight: "300px", overflow: "auto", marginRight: "-10px" }}
        >
          {products.map((el) => (
            <div className="pb-2 flex justify-between" key={el.id}>
              <span>
                {el.name.ru} ({numberToPrice(el.price, "сум")})
              </span>
              <span>
                <Switch
                  id={el.id}
                  color="primary"
                  checked={checkedProducts.includes(el.id)}
                  onChange={() => onChange(el.id)}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t p-4">
        <Button
          classNameParent="w-full"
          size="large"
          shape="outlined"
          style={{ width: "100%" }}
          onClick={() => {
            onClose();
          }}
          borderColor="bordercolor"
        >
          {t("cancel")}
        </Button>
        <Button
          classNameParent="w-full"
          size="large"
          style={{ width: "100%" }}
          onClick={onClose}
        >
          {t("save")}
        </Button>
      </div>
    </Modal>
  );
}

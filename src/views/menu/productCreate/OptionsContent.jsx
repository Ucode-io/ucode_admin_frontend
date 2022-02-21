import { useState, useEffect } from "react";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "../../../components/Button/IconButton";
import AddOptionModal from "./modals/AddOption";
import DeleteIcon from "@material-ui/icons/Delete";
import { useTranslation } from "react-i18next";
import { RadioGroup, Radio } from "../../../components/Radio";
import AddIngredientModal from "./modals/AddIngredient";
import numberToPrice from "../../../helpers/numberToPrice";

const lang = "ru";

export default function OptionsContent({
  options: initialOptions,
  onOptionsChange,
  ingredients,
  saveLoading,
}) {
  const { t } = useTranslation();

  const [options, setOptions] = useState(initialOptions);
  const [optionModal, setOptionModal] = useState(null);
  const [ingredientModal, setIngredientModal] = useState(null);

  useEffect(() => {
    onOptionsChange(options);
  }, [options]);

  const onModalSubmit = (values) => {
    if (optionModal.initialValues) {
      handleUpdateOption(values);
    } else {
      handleAddOption(values);
    }
  };

  const onModalSubmitIngredients = (values) => {
    console.log("values==>", values);
    // if (optionModal.initialValues) {
    values.ingredients.forEach((item) => {
      handleAddOption(item);
    });
    // } else {
    //   values.forEach((item) => {
    //     handleAddOption(item)
    //   })
    // }
  };

  console.log(options);
  const handleAddOption = ({ name, price }) => {
    if (optionModal || ingredientModal) {
      if (
        optionModal?.name === "child_option" ||
        ingredientModal?.name === "child_option"
      ) {
        setOptions((old) =>
          old.map((elm, i) =>
            i === optionModal?.parentIndex || i === ingredientModal?.parentIndex
              ? {
                  ...elm,

                  child_options: [
                    ...elm.child_options,
                    {
                      name,
                      price,
                      is_required: optionModal ? true : false,
                      is_default:
                        options.length === 1 &&
                        options[0].child_options.length === 0
                          ? true
                          : false,
                    },
                  ],
                }
              : elm,
          ),
        );
      } else {
        setOptions((old) => [
          ...old,
          {
            name,
            price,
            child_options: [],
            is_default: options && options.length === 0 ? true : false,
          },
        ]);
      }
    }
  };

  const handleUpdateOption = ({ name, price }) => {
    if (optionModal || ingredientModal) {
      if (
        optionModal?.name === "child_option" ||
        ingredientModal?.name === "child_option"
      ) {
        setOptions((prev) =>
          prev.map((elm, i) =>
            i === optionModal?.parentIndex || i === ingredientModal?.parentIndex
              ? {
                  ...elm,
                  child_options: elm.child_options.map((el, j) =>
                    j === optionModal?.index || j === ingredientModal?.index
                      ? { name, price, is_required: optionModal ? true : false }
                      : el,
                  ),
                }
              : elm,
          ),
        );
      } else {
        setOptions((prev) =>
          prev.map((elm, i) =>
            i === optionModal?.index || i === ingredientModal?.index
              ? { ...elm, name, price }
              : elm,
          ),
        );
      }
    }
  };

  const handleRemoveOption = (index) => {
    setOptions((old) => old.filter((el, i) => i !== index));
  };

  const handleRemoveOptionChild = (index, parentIndex) => {
    setOptions((old) =>
      old.map((elm, i) =>
        i === parentIndex
          ? {
              ...elm,
              child_options: elm.child_options.filter((el, j) => j !== index),
            }
          : elm,
      ),
    );
  };

  const handleCheck = (name, index, parentIndex) => {
    if (name === "child_option") {
      setOptions((prev) =>
        prev.map((elm, i) =>
          i === parentIndex
            ? {
                ...elm,
                child_options: elm.child_options.map((el, j) =>
                  j === index
                    ? { ...el, is_default: true }
                    : { ...el, is_default: false },
                ),
              }
            : elm,
        ),
      );
    } else {
      setOptions((prev) =>
        prev.map((elm, i) =>
          i === index
            ? {
                ...elm,
                child_options: elm.child_options.map((el, j) => ({
                  ...el,
                  is_default: j === 0 && el.is_required ? true : false,
                })),
                is_default: true,
              }
            : {
                ...elm,
                is_default: false,
                child_options: elm.child_options.map((el, j) => ({
                  ...el,
                  is_default: false,
                })),
              },
        ),
      );
    }
  };

  const OptionContent = ({ element, index, children }) => (
    <div className="border rounded-md">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <div>
          <Radio
            value={index}
            checked={element.is_default ?? false}
            className="items-baseline"
          >
            <div>
              <div className="text-lg font-semibold">{element.name[lang]}</div>
              <div className="text-sm">
                {numberToPrice(element.price, "сум")}
              </div>
            </div>
          </Radio>
        </div>
        <div className="flex gap-2">
          <Button
            shape="outlined"
            icon={EditIcon}
            style={{
              padding: "8px",
            }}
            size="small"
            borderColor="bordercolor"
            onClick={() =>
              setOptionModal({
                initialValues: options[index],
                name: "option",
                index,
              })
            }
          ></Button>
          <Button
            shape="outlined"
            icon={DeleteIcon}
            style={{
              padding: "8px",
            }}
            color="red"
            size="small"
            borderColor="bordercolor"
            onClick={() => handleRemoveOption(index)}
          ></Button>
        </div>
      </div>
      <span className="font-semibold text-sm block mb-3 mt-2 px-3">
        Вариант:
      </span>
      <RadioGroup
        className="px-3"
        onChange={(val) => handleCheck("child_option", val, index)}
      >
        <div className="flex flex-col gap-4">
          {element.child_options.map((elm, i) =>
            elm.is_required ? (
              <OptionChildContent
                element={elm}
                index={i}
                parentIndex={index}
                key={i}
              />
            ) : (
              ""
            ),
          )}

          <IconButton
            icon={
              <span className="flex items-center">
                <AddIcon fontSize="small" />
                <span className="text-sm block ml-2 font-medium">
                  {t("add.option")}
                </span>
              </span>
            }
            style={{ width: "100%", height: "100%" }}
            className="w-full mb-3 h-9"
            onClick={() =>
              setOptionModal({ name: "child_option", parentIndex: index })
            }
          />
        </div>
      </RadioGroup>
      <span className="font-semibold text-sm block mb-3 mt-2 px-3">
        Ингридиенты:
      </span>
      <RadioGroup
        className="px-3"
        onChange={(val) => handleCheck("child_option", val, index)}
      >
        <div className="flex flex-col gap-4">
          {element.child_options.map((elm, i) =>
            !elm.is_required ? (
              <OptionChildContent
                element={elm}
                index={i}
                parentIndex={index}
                key={i}
                isIngredient={true}
              />
            ) : (
              ""
            ),
          )}

          <IconButton
            icon={
              <span className="flex items-center">
                <AddIcon fontSize="small" />
                <span className="text-sm block ml-2 font-medium">
                  {t("Добавить ингридиент")}
                </span>
              </span>
            }
            color="green"
            style={{ width: "100%", height: "100%" }}
            className="w-full mb-3 h-9"
            onClick={() =>
              setIngredientModal({ name: "child_option", parentIndex: index })
            }
          />
        </div>
      </RadioGroup>
      {children}
    </div>
  );

  const OptionChildContent = ({
    element,
    index,
    parentIndex,
    children,
    isIngredient = false,
  }) => (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Radio
            value={index}
            hide={element.is_required}
            checked={element.is_default ?? false}
          >
            <div className="text-sm">
              {element.name[lang]} (+ {numberToPrice(element.price, "сум")} )
            </div>
          </Radio>
        </div>
        <div className="flex gap-2">
          {!isIngredient && (
            <IconButton
              icon={<EditIcon />}
              onClick={() =>
                setOptionModal({
                  initialValues: options[parentIndex].child_options[index],
                  name: "child_option",
                  index,
                  parentIndex,
                })
              }
            />
          )}
          <IconButton
            icon={<CloseIcon />}
            color="red"
            onClick={() => handleRemoveOptionChild(index, parentIndex)}
          />
        </div>
      </div>

      {children}
    </div>
  );

  return (
    <div className="w-full">
      <Card
        title={t("list.of.options")}
        extra={
          <Button
            shape="filled"
            icon={AddIcon}
            onClick={() => setOptionModal({ name: "option" })}
          >
            {t("add")}
          </Button>
        }
      >
        <RadioGroup
          id="options-list"
          onChange={(val) => handleCheck("option", val)}
        >
          <div className="flex w-full">
            <div className="grid grid-cols-3 gap-4" style={{ width: "96%" }}>
              {options.map((elm, i) => (
                <div>
                  <OptionContent element={elm} index={i} key={i} />
                </div>
              ))}
            </div>
            {/* <div className="flex justify-end" style={{ width: "4%" }}>
              {options.length >= 10 ? (
                <></>
              ) : options.length > 0 ? (
                <IconButton
                  icon={<AddIcon />}
                  onClick={() => setOptionModal({ name: "option" })}
                />
              ) : (
                <Button
                  shape="filled"
                  icon={AddIcon}
                  onClick={() => setOptionModal({ name: "option" })}
                >
                  {t("add")}
                </Button>
              )}
            </div> */}
          </div>
        </RadioGroup>
      </Card>

      <AddOptionModal
        title={null}
        footer={null}
        open={optionModal}
        initialValues={optionModal?.initialValues}
        onClose={() => setOptionModal(null)}
        onSubmit={onModalSubmit}
      />
      <AddIngredientModal
        title={null}
        footer={null}
        open={ingredientModal}
        initialValues={ingredientModal?.initialValues}
        onClose={() => setIngredientModal(null)}
        onSubmit={onModalSubmitIngredients}
        ingredients={ingredients}
      />
    </div>
  );
}

import { useForm } from "react-hook-form";
import FormElementGenerator from "../../../../../../components/ElementGenerators/FormElementGenerator";
import cls from "../styles.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import SecondaryButton from "../../../../../../components/Buttons/SecondaryButton";
import PrimaryButton from "../../../../../../components/Buttons/PrimaryButton";
import { Add } from "@mui/icons-material";

const SettingsTab = () => {
  const { control } = useForm();

  return (
    <div className={cls.modal_main}>
      <div className={cls.main_box}>
        <div className={cls.left}>
          <div className={cls.slug}>
            <span>Когда </span>
            <span>Клиника/Запись</span>
          </div>
          <div className={cls.action}>
            <FormElementGenerator
              options={[
                { label: "1234", value: "1234" },
                { label: "12345", value: "12345" },
              ]}
              field={"PICK_LIST"}
              control={control}
              disableHelperText
            />
          </div>
          <div className={cls.terms}>
            <span>Условия</span>
            <div className={cls.wrapper}>
              <div className={cls.terms_current}>
                <FormElementGenerator
                  options={[
                    { label: "1234", value: "1234" },
                    { label: "12345", value: "12345" },
                  ]}
                  field={"PICK_LIST"}
                  control={control}
                  disableHelperText
                />
              </div>
              <div className={cls.terms_action}>
                <FormElementGenerator
                  options={[
                    { label: "1234", value: "1234" },
                    { label: "12345", value: "12345" },
                  ]}
                  field={"PICK_LIST"}
                  control={control}
                  disableHelperText
                />
              </div>
              <div className={cls.terms_fn}>
                <FormElementGenerator
                  options={[
                    { label: "1234", value: "1234" },
                    { label: "12345", value: "12345" },
                  ]}
                  field={"PICK_LIST"}
                  control={control}
                  disableHelperText
                />
                {/* </div> */}
                {/* <div className={cls.terms_prev}> */}
                <FormElementGenerator
                  options={[
                    { label: "1234", value: "1234" },
                    { label: "12345", value: "12345" },
                  ]}
                  field={"PICK_LIST"}
                  control={control}
                  disableHelperText
                />
              </div>
              <div className={cls.terms_delete}>
                <DeleteIcon htmlColor="#F76659" />
              </div>
            </div>
          </div>
          <div className={cls.splitter}>
            <div></div>
            <div>OR</div>
            <div></div>
          </div>
          <div className={cls.btns}>
            <SecondaryButton className={cls.btn}>
              <Add />
              Добавить условия
            </SecondaryButton>
            <SecondaryButton className={cls.btn}>
              <Add />
              Добавить группу
            </SecondaryButton>
          </div>
        </div>
        <div className={cls.right}>right</div>
      </div>
      <div className={cls.save_btn}>
        <PrimaryButton>Сохранить</PrimaryButton>
      </div>
    </div>
  );
};

export default SettingsTab;

import styles from "./style.module.scss";
import HFTextField from "../../../../../../components/FormElements/HFTextField";
import FRow from "../../../../../../components/FormElements/FRow";
import HFSelect from "../../../../../../components/FormElements/HFSelect";
import HFSwitch from "../../../../../../components/FormElements/HFSwitch";

const InventoryBarcodeAttributes = ({ control }) => {
  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Settings</h2>
      </div>
      <div className="p-2">
        <FRow label={"Actions"}>
          <HFSelect
            name="attributes.action"
            control={control}
            fullWidth
            options={[
              {
                icon: "table-cells.svg",
                label: "Table",
                value: "TABLE",
              },
              {
                icon: "square.svg",
                label: "Card",
                value: "CARD",
              },
            ]}
          />
        </FRow>
        <FRow label={"Automatic"}>
          <HFSwitch control={control} name={"attributes.automatic"} />
        </FRow>
        <FRow label="Length">
          <HFTextField
            type="number"
            name="attributes.length"
            control={control}
            fullWidth
          />
        </FRow>
      </div>
    </>
  );
};

export default InventoryBarcodeAttributes;

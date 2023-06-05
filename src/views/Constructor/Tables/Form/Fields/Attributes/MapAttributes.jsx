import FRow from "../../../../../../components/FormElements/FRow";
import HFTextField from "../../../../../../components/FormElements/HFTextField";
import styles from "./style.module.scss";

const MapAttributes = ({ control }) => {
  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Settings</h2>
      </div>
      <div className="p-2">
        <FRow label="Lattitude">
          <HFTextField name="attributes.lat" control={control} fullWidth />
        </FRow>
        <FRow label="Longitude">
          <HFTextField name="attributes.long" control={control} fullWidth />
        </FRow>
      </div>
    </>
  );
};

export default MapAttributes;

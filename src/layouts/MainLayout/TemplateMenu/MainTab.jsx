import {Grid} from "@mui/material";
import React from "react";
import FRow from "../../../components/FormElements/FRow";
import HFTextEditor from "../../../components/FormElements/HFTextEditor";
import HFTextField from "../../../components/FormElements/HFTextField";
import PhotoUpload from "./PhotoUpload";

function MainTab({control}) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={7}>
        <FRow label="Name">
          <HFTextField control={control} name="name" placeholder={"Name"} />
        </FRow>

        <FRow label="Description">
          <HFTextEditor
            control={control}
            name="description"
            placeholder={"Description"}
            radius="0px"
          />
        </FRow>
      </Grid>

      <Grid item xs={5}>
        <PhotoUpload control={control} name={"image"} />
      </Grid>
    </Grid>
  );
}

export default MainTab;

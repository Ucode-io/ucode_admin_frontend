import {Box, Button, CircularProgress, Modal} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useEnvironmentListQuery} from "../../../../services/environmentService";
import {store} from "../../../../store";
import httpsRequestV2 from "../../../../utils/httpsRequestV2";
import EnvironmentsTable from "./EnvironmentsTable";
import HistoriesTable from "./HistoriesTable";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../../store/alert/alert.thunk";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "0",
  boxShadow: 24,
  borderRadius: "8px",
  outline: "none",
};

export default function EnvironmentModal({open, handleClose}) {
  const company = store.getState().company;
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedMigrate, setSelectedMigrate] = useState(null);
  const [versions, setVersions] = useState([]);
  const [versionLoading, setVersionLoading] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState([]);
  const companyStore = store.getState().company;
  const environmentId = companyStore.environmentId;
  const [selectedIds, setSelectedIds] = useState([]);
  const dispatch = useDispatch();

  const updateVersions = () => {
    const selectedVersionsIds = selectedVersions.map((version) => version.id);

    httpsRequestV2
      .put(`/version/history/${selectedEnvironment}`, {
        env_id: environmentId,
        ids: selectedIds,
        project_id: company.projectId,
      })
      .then((res) => {
        dispatch(showAlert("Successfully updated", "success"));
        handleClose();
      });
  };

  const updateMigrate = () => {
    httpsRequestV2
      .post("/version/migrate", {
        histories: selectedVersions,
      })
      .then((res) => {
        updateVersions();
      });
  };
  const updateDown = () => {
    httpsRequestV2
      .post(
        `/version/history/migrate/${selectedMigrate.toLowerCase()}/${selectedEnvironment}`,
        {
          data: selectedVersions,
        }
      )
      .then((res) => {
        console.log("ressssss", res);
        setSelectedIds(res?.ids);
        updateVersions();
      });
  };

  const {data: {environments} = [], isLoading: environmentLoading} =
    useEnvironmentListQuery({
      params: {
        project_id: company.projectId,
      },
      onSuccess: (data) => {
        return data;
      },
    });

  useEffect(() => {
    if (selectedMigrate) {
      setVersionLoading(true);
      httpsRequestV2
        .get(
          `/version/history/${selectedEnvironment}?type=${selectedMigrate}&limit=100&offset=1`,
          {}
        )
        .then((res) => {
          setVersions(res.histories);
        })
        .finally(() => {
          setVersionLoading(false);
        });
    }
  }, [selectedMigrate]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Box>
          {environmentLoading || versionLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
                height: "100%",
                width: "100%",
              }}>
              <CircularProgress />
            </Box>
          ) : selectedMigrate ? (
            <HistoriesTable
              histories={versions}
              setSelectedEnvironment={setSelectedEnvironment}
              selectedVersions={selectedVersions}
              setSelectedMigrate={setSelectedMigrate}
              setSelectedVersions={setSelectedVersions}
              handleClose={handleClose}
            />
          ) : (
            <EnvironmentsTable
              setSelectedEnvironment={setSelectedEnvironment}
              environments={environments}
              selectedEnvironment={selectedEnvironment}
              handleClose={handleClose}
              setSelectedMigrate={setSelectedMigrate}
              selectedMigrate={selectedMigrate}
              company={company}
            />
          )}
        </Box>

        {selectedMigrate && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              padding: "10px 15px",
              borderTop: "1px solid #e5e9eb",
            }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setSelectedVersions([])}>
              Cancel
            </Button>

            {selectedVersions?.length ? (
              <Button
                variant="outlined"
                color="success"
                onClick={() => {
                  selectedMigrate === "miggrate"
                    ? updateMigrate()
                    : updateDown();
                }}>
                Miggrate
              </Button>
            ) : null}
          </Box>
        )}
      </Box>
    </Modal>
  );
}

// import SimpleLoader from "components/Loaders/SimpleLoader";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Handle, Position } from "reactflow";
import DefaultNodeCard from "../IconCard/DefaultNodeCard";
import FinishNodeForm from "../NodeForms/FinishNodeForm";

const STYLE_PROPS_TARGET = {
  width: 8,
  height: 28,
  borderRadius: 2,
};

const FinishNode = ({ data }) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState("success");
  const [loader, setLoader] = useState(false);
  const { setValue: setParentFormValue, getValues: getParentValues } =
    useFormContext();
  const nodes = getParentValues().steps;
  const index = nodes?.findIndex((node) => node?.ui_component?.id === data?.id);
  const callback_type = getParentValues(`steps.${index}.config.callback_type`);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const openCreateDrawer = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => {
    setDrawerIsOpen(false);
  };

  // useEffect(() => {
  //   if (!queryStore.queryRightSidebarIsOpen) {
  //     onClose();
  //   }
  // }, [queryStore.queryRightSidebarIsOpen]);
  return (
    <>
      {loader ? (
        <></>
      ) : (
        // <SimpleLoader />
        <>
          <div className="text-updater-node" onClick={openCreateDrawer}>
            {callback_type === "success" ? (
              <Handle
                type="target"
                id="successFinishNoded"
                style={{
                  ...STYLE_PROPS_TARGET,
                  background: "#70B362",
                }}
                position={Position.Left}
              />
            ) : (
              <Handle
                type="target"
                id="errorFinish"
                style={{
                  ...STYLE_PROPS_TARGET,
                  background: "#f5644a",
                }}
                position={Position.Left}
              />
            )}
            <div>
              <DefaultNodeCard
                color={"#007AFF"}
                icon={data.icon}
                noTitle={true}
                title={data?.label}
              />
            </div>
            <FinishNodeForm
              open={drawerIsOpen}
              closeDrawer={closeDrawer}
              initialValues={drawerIsOpen}
              formIsVisible={drawerIsOpen}
              data={data}
              setType={setType}
              setLoader={setLoader}
              type={type}
              setParentFormValue={setParentFormValue}
              getParentValues={getParentValues}
              index={index}
              callback_type={callback_type}
            />
          </div>
        </>
      )}
    </>
  );
};

export default FinishNode;

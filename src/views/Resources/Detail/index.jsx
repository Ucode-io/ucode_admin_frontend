import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useEnvironmentsListQuery } from "../../../services/environmentService";
import { useResourceConfigureMutation, useResourceCreateMutation, useResourceCreateMutationV2, useResourceEnvironmentGetByIdQuery, useResourceGetByIdQuery, useResourceReconnectMutation, useResourceUpdateMutation } from "../../../services/resourceService";
import { store } from "../../../store";
import ResourceeEnvironments from "./ResourceEnvironment";
import Form from "./Form";
import AllowList from "./AllowList";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const headerStyle = {
  width: '100%', 
  height: '50px', 
  borderBottom: '1px solid #e5e9eb', 
  display: 'flex', 
  alignItems: 'center', 
  // gap: '20px', 
  padding: '15px',
  justifyContent: 'space-between',
}


const ResourceDetail = () => {
  const { projectId, resourceId } = useParams();
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const navigate = useNavigate();
  const company = store.getState().company;
  const authStore = store.getState().auth;
  

  const isEditPage = !!resourceId;

  const { control, reset, handleSubmit, setValue, watch } = useForm();

  const { isLoading } = useResourceGetByIdQuery({
    id: resourceId,
    queryParams: {
      cacheTime: false,
      enabled: isEditPage,
      onSuccess: (res) => {

        reset(res);
        setSelectedEnvironment(
          res.environments?.filter((env) => env.is_configured)
        );
      },
    },
  });

  console.log('selectedEnvironment', selectedEnvironment)


  const { data: projectEnvironments } = useEnvironmentsListQuery({
    params: {
      project_id: projectId,
    },
    queryParams: {
      select: (res) =>
        res.data?.map((env) => ({
          ...env,
          is_configured: false,
        })) ?? [],
    },
  });

  console.log('projectEnvironments', )

  const { isLoading: formLoading } = useResourceEnvironmentGetByIdQuery({
    id: selectedEnvironment?.[0]?.resource_environment_id,
    queryParams: {
      cacheTime: false,
      enabled: Boolean(selectedEnvironment?.[0].resource_environment_id),
      onSuccess: (res) => {
        const isDefault = Boolean(
          res.environments?.find((env) => env.id === selectedEnvironment?.[0].id)
            ?.default
        );
        reset({
          ...res,
          default: isDefault,
        });
      },
    },
  });


  const { mutate: createResource, isLoading: createLoading } =
    useResourceCreateMutation({
      onSuccess: () => {
        // successToast();
        navigate(-1);
      },
    });

    const { mutate: createResourceV2, isLoading: createLoadingV2 } =
    useResourceCreateMutationV2({
      onSuccess: () => {
        // successToast();
        navigate(-1);
      },
    });

  const { mutate: configureResource, isLoading: configureLoading } =
    useResourceConfigureMutation({////////////////
      onSuccess: () => {
        // successToast("Successfully configured");
        setSelectedEnvironment(null);
      },
    });

  const { mutate: updateResource, isLoading: updateLoading } =
    useResourceUpdateMutation({
      onSuccess: () => {
        // successToast("Successfully updated");
        setSelectedEnvironment(null);
      },
    });

  const { mutate: reconnectResource, isLoading: reconnectLoading } =
    useResourceReconnectMutation(///////////
      { projectId: projectId },
      {
        onSuccess: () => {
          // successToast();
        },
      }
    );

    const onSubmit = (values) => {
      const computedValues2 = {
        ...values,
        type: values?.resource_type,
        company_id: company?.companyId,
        project_id: projectId,
        resource_id: resourceId,
        user_id:  authStore.userId,
        environment_id: selectedEnvironment?.[0].id,
        is_configured: true,
        id: selectedEnvironment?.[0].resource_environment_id,
      };
      if(values?.resource_type === 4) {

        delete computedValues2.resource_type;
  
        createResourceV2(computedValues2);
      } else if (!isEditPage) createResource(computedValues2);
      
      else {
        if (!selectedEnvironment?.[0].is_configured) {
          configureResource(computedValues2);
        } else {
          updateResource(computedValues2);
        }
      }
  };
  

  useEffect(() => {
    if (!selectedEnvironment?.length) return;

    if (selectedEnvironment?.[0].is_configured) return;

    setValue("credentials", {
      host: "",
      port: "",
      username: "",
      database: "",
    });
    setValue("default", false);
  }, [selectedEnvironment]);

  return (
    <Box sx={{ background: '#fff'}}>
        <form flex={1} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={headerStyle}> 
        <Box sx={{display:'flex', alignItems:'center'}}>
          <Button onClick={() => navigate(-1)} sx={{cursor: 'pointer', width: '16px', height: '30px'}}>
          <KeyboardBackspaceIcon style={{fontSize: '26px'}} />
          </Button>
          <h2>Resource settings</h2>
        </Box>
        <Box >
         {isEditPage && (
           <Button
           sx={{color: '#fff', background: '#38A169', marginRight: '10px'}}
           hidden={!isEditPage}
           color={'success'}
           variant="contained"
           onClick={() => reconnectResource({ id: resourceId })}
           isLoading={reconnectLoading}
         >
           Reconnect
         </Button>
         )}

          {!isEditPage && (
            <Button
            bg="primary"
            type="submit"
            sx={{fontSize: '14px'}}
            hidden={isEditPage}
            isLoading={createLoading}
          >
            Save changes
          </Button>
          )}

        </Box>
      </Box>

      <Box sx={{display: 'flex'}}>
        {isEditPage && (
          <ResourceeEnvironments
            control={control}
            selectedEnvironment={selectedEnvironment}
            setSelectedEnvironment={setSelectedEnvironment}
          />
        )}
        {formLoading || isLoading ? (
          // <SimpleLoader flex={1} />
          <h2>Loader</h2>
        ) : (
          <Form
            control={control}
            selectedEnvironment={selectedEnvironment}
            btnLoading={configureLoading || updateLoading}
            setSelectedEnvironment={setSelectedEnvironment}
            projectEnvironments={projectEnvironments}
            isEditPage={isEditPage}
          />
        )}
        <AllowList />
      </Box>
    </form>
    </Box>
  );
};

export default ResourceDetail;

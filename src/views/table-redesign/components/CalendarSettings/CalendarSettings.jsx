import cls from "./styles.module.scss";
import {useEffect, useMemo} from "react";
import {useTranslation} from "react-i18next";
import listToLanOptions from "../../../../utils/listToLanOptions";
import FRow from "../../../../components/FormElements/FRow";
import HFSelect from "../../../../components/FormElements/HFSelect";
import {Box, Button} from "@chakra-ui/react";
import {Button as MuiButton} from "@mui/material";
import {ChevronLeftIcon} from "@chakra-ui/icons";
import {useForm} from "react-hook-form";
import MaterialUIProvider from "../../../../providers/MaterialUIProvider";
import constructorViewService from "../../../../services/constructorViewService";
import {useQueryClient} from "react-query";

export const CalendarSettings = ({
  onBackClick,
  title,
  columns,
  tableSlug,
  views,
  selectedTabIndex,
  initialValues,
}) => {
  const {i18n} = useTranslation();

  const form = useForm();

  const queryClient = useQueryClient();

  const computedColumns = useMemo(() => {
    return listToLanOptions(columns, "label", "slug", i18n?.language);
  }, [columns]);

  const computedPickListColumns = useMemo(() => {
    const filteredColumns = columns?.filter(
      ({type}) => type === "PICK_LIST" || type === "MULTISELECT"
    );
    return listToLanOptions(filteredColumns, "label", "id", i18n?.language);
  }, [columns]);

  const onSubmit = (values) => {
    const computedValues = {
      ...values,
      ...views?.[selectedTabIndex],
      disable_dates: values.disable_dates,
      time_interval: values.time_interval,
      status_field_slug: values.status_field_slug,
      calendar_from_slug: values.calendar_from_slug,
      calendar_to_slug: values.calendar_to_slug,
    };
    constructorViewService.update(tableSlug, computedValues).then(() => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      console.log("first");
      onBackClick();
    });
  };

  const getInitialValues = (initialValues) => {
    if (initialValues === "NEW")
      return {
        disable_dates: {
          day_slug: "",
          table_slug: "",
          time_from_slug: "",
          time_to_slug: "",
        },
      };
    return {
      disable_dates: {
        day_slug: initialValues?.disable_dates?.day_slug ?? "",
        table_slug: initialValues?.disable_dates?.table_slug ?? "",
        time_from_slug: initialValues?.disable_dates?.time_from_slug ?? "",
        time_to_slug: initialValues?.disable_dates?.time_to_slug ?? "",
      },
      calendar_from_slug: initialValues?.calendar_from_slug ?? "",
      calendar_to_slug: initialValues?.calendar_to_slug ?? "",
      status_field_slug: initialValues?.status_field_slug ?? "",
      time_interval: initialValues?.time_interval ?? 60,
    };
  };

  useEffect(() => {
    form.reset({
      ...getInitialValues(initialValues),
      filters: [],
    });
  }, [initialValues, tableSlug, form]);

  return (
    <div>
      <Box mb="10px">
        <Button
          leftIcon={<ChevronLeftIcon fontSize={22} />}
          colorScheme="gray"
          variant="ghost"
          w="fit-content"
          onClick={onBackClick}>
          <Box color="#475467" fontSize={14} fontWeight={600}>
            {title}
          </Box>
        </Button>
      </Box>
      <div className={cls.section}>
        <div className={cls.sectionBody}>
          <MaterialUIProvider>
            <div className={cls.formRow} onClick={(e) => e.stopPropagation()}>
              <FRow label="Time from">
                <HFSelect
                  options={computedColumns}
                  control={form.control}
                  name="calendar_from_slug"
                  MenuProps={{disablePortal: true}}
                />
              </FRow>
              <FRow label="Time to">
                <HFSelect
                  options={computedColumns}
                  control={form.control}
                  name="calendar_to_slug"
                  MenuProps={{disablePortal: true}}
                />
              </FRow>
            </div>
          </MaterialUIProvider>
          <Box>
            <MuiButton
              fullWidth
              variant="contained"
              onClick={form.handleSubmit(onSubmit)}>
              Save
            </MuiButton>
          </Box>

          {/* <div className={styles.formRow}>
              <FRow label="Time interval">
                <HFSelect
                  options={timeIntervalOptions}
                  control={form.control}
                  name="time_interval"
                />
              </FRow>

              <FRow label="Status field">
                <HFSelect
                  options={computedPickListColumns}
                  control={form.control}
                  name="status_field_slug"
                />
              </FRow>
            </div> */}
        </div>
      </div>
    </div>
  );
};

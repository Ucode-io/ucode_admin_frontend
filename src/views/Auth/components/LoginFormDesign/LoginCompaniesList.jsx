import React, {useEffect} from "react";
import HFSelect from "../../../../components/FormElements/HFSelect";
import DynamicFields from "../DynamicFields";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import classes from "./style.module.scss";
import {useTranslation} from "react-i18next";

function LoginCompaniesList({
  computedProjects,
  computedCompanies,
  computedEnvironments,
  computedClientTypes,
  computedConnections,
  control,
  watch,
  companies,
  selectedCollection,
  setSelectedCollection,
  loading = false,
  handleSubmit = () => {},
  setValue = () => {},
}) {
  const {t} = useTranslation();

  return (
    <>
      <div className={classes.dialogContainer}>
        <h2 className={classes.headerContent}>Multi Company</h2>
        <div className={classes.formArea}>
          {computedCompanies?.length !== 1 && (
            <div className={classes.formRow}>
              <p className={classes.label}>{t("company")}</p>
              <HFSelect
                required
                control={control}
                name="company_id"
                size="large"
                fullWidth
                className={classes.dialogSelect}
                placeholder={t("enter.company")}
                options={computedCompanies}
              />
            </div>
          )}
          {computedProjects?.length !== 1 && (
            <div className={classes.formRow}>
              <p className={classes.label}>{t("project")}</p>
              <HFSelect
                required
                control={control}
                name="project_id"
                size="large"
                fullWidth
                className={classes.dialogSelect}
                placeholder={t("enter.project")}
                options={computedProjects}
              />
            </div>
          )}
          {computedEnvironments?.length !== 1 && (
            <div className={classes.formRow}>
              <p className={classes.label}>{t("Environment")}</p>
              <HFSelect
                required
                control={control}
                name="environment_id"
                size="large"
                fullWidth
                className={classes.dialogSelect}
                placeholder={t("select.environment")}
                options={computedEnvironments}
              />
            </div>
          )}
          {computedClientTypes?.length !== 1 && (
            <div className={classes.formRow}>
              <p className={classes.label}>{t("client_type")}</p>
              <HFSelect
                required
                control={control}
                name="client_type"
                size="large"
                fullWidth
                className={classes.dialogSelect}
                placeholder={t("enter.client_type")}
                options={computedClientTypes}
              />
            </div>
          )}
          {computedConnections.length
            ? computedConnections?.map((connection, idx) => (
                <DynamicFields
                  key={connection?.guid}
                  table={computedConnections}
                  connection={connection}
                  index={idx}
                  control={control}
                  setValue={setValue}
                  watch={watch}
                  options={connection?.options}
                  companies={companies}
                  selectedCollection={selectedCollection}
                  setSelectedCollection={setSelectedCollection}
                />
              ))
            : null}
        </div>
        <div className={classes.footerContent}>
          <PrimaryButton
            className={classes.primaryButton}
            onClick={handleSubmit}
            loader={loading}>
            {t("enter")}
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}

export default LoginCompaniesList;

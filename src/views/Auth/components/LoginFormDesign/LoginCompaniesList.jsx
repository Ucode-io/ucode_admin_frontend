import React, { useState } from "react";
import SearchableSelect from "./SearchableSelect";
import DynamicFields from "../DynamicFields";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import classes from "./style.module.scss";
import { useTranslation } from "react-i18next";

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
  handleSubmit = () => { },
  setValue = () => { },
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className={classes.dialogContainer}>

        <div className={classes.formArea}>
          {computedCompanies?.length !== 1 && (
            <div className={classes.formRow}>
              <p className={classes.label}>{t("company")}</p>
              <SearchableSelect
                required
                control={control}
                name="company_id"
                placeholder={t("enter.company")}
                options={computedCompanies}
              />
            </div>
          )}
          {computedProjects?.length !== 1 && (
            <div className={classes.formRow}>
              <p className={classes.label}>{t("project")}</p>
              <SearchableSelect
                required
                control={control}
                name="project_id"
                placeholder={t("enter.project")}
                options={computedProjects}
              />
            </div>
          )}
          {computedEnvironments?.length !== 1 && (
            <div className={classes.formRow}>
              <p className={classes.label}>{t("Environment")}</p>
              <SearchableSelect
                required
                control={control}
                name="environment_id"
                placeholder={t("select.environment")}
                options={computedEnvironments}
              />
            </div>
          )}
          {computedClientTypes?.length !== 1 && (
            <div className={classes.formRow}>
              <p className={classes.label}>{t("client_type")}</p>
              <SearchableSelect
                required
                control={control}
                name="client_type"
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
            onClick={() => {
              handleSubmit();
              setLoading(true);
            }}
            loader={loading}>
            {t("enter")}
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}

export default LoginCompaniesList;

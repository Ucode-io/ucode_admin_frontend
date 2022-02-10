import Card from "../../components/Card/index"
import Form from "../../components/Form/Index"
import Input from "../../components/Input/index"
import Switch from "../../components/Switch"
import Textarea from "../../components/Textarea/index"
import { useTranslation } from "react-i18next"
import Select from "../../components/Select"
import AutoComplate from "../../components/Select/AutoComplate"

export default function Content({
  formik,
  permissions = [],
  selectedPermissions = [],
  levelsList,
  organizationsList,
  onPermissionChange = function () {},
}) {
  // **** USE-HOOKS ****
  const { t } = useTranslation()

  // **** FUNCTIONS ****
  const onSwitchChange = (value, id) => {
    if (value) {
      onPermissionChange([...selectedPermissions, id])
    } else {
      onPermissionChange(selectedPermissions.filter((el) => el !== id))
    }
  }

  return (
    <div
      className="m-3 grid grid-cols-2 grid-rows-2 gap-4 box-border font-body"
      style={{ fontSize: "14px", lineHeight: "24px" }}
    >
      <div>
        <Card title={t("general.information")} className="row-span-2">
          {/* status */}
          <div className="w-full flex items-baseline">
            <div className="w-1/3">{t("status")}</div>
            <div className="w-2/3">
              <Form.Item name="status" formik={formik}>
                <Switch
                  id="status"
                  color="primary"
                  checked={formik.values.status}
                  onChange={(val) => formik.setFieldValue("status", val)}
                />
              </Form.Item>
            </div>
          </div>

          {/* name */}
          <div className="w-full flex items-baseline">
            <div className="w-1/3">{t("name")}</div>
            <div className="w-2/3">
              <Form.Item name="name" formik={formik}>
                <Input
                  id="name"
                  type="text"
                  {...formik.getFieldProps("name")}
                />
              </Form.Item>
            </div>
          </div>

          {/* organization */}
          <div className="w-full flex items-baseline">
            <div className="w-1/3">{t("organization")}</div>
            <div className="w-2/3">
              <Form.Item name="organization" formik={formik}>
                <AutoComplate
                  url="/organization"
                  onFetched={(res) => res.organizations}
                  queryName="search"
                  onChange={(value) =>
                    formik.setFieldValue("organization", value)
                  }
                  value={formik.values.organization}
                />
              </Form.Item>
            </div>
          </div>

          {/* level */}
          <div className="w-full flex items-baseline">
            <div className="w-1/3">{t("level")}</div>
            <div className="w-2/3">
              <Form.Item name="code" formik={formik}>
                <Select
                  options={levelsList}
                  onChange={(value) => formik.setFieldValue("code", value)}
                  value={formik.values.code}
                />
              </Form.Item>
            </div>
          </div>

          {/* description */}
          <div className="w-full flex items-baseline">
            <div className="w-1/3">{t("description")}</div>
            <div className="w-2/3">
              <Form.Item name="description" formik={formik}>
                <Textarea
                  id="description"
                  {...formik.getFieldProps("description")}
                />
              </Form.Item>
            </div>
          </div>
        </Card>
      </div>
      <div>
        {permissions.length ? (
          <Card title={t("permissions")}>
            {permissions.map(({ id, name }) => (
              <div className="w-full flex items-baseline mb-6" key={id}>
                <div className="w-2/3">{name}</div>
                <div className="w-1/3">
                  <Switch
                    checked={selectedPermissions.includes(id)}
                    onChange={(val) => onSwitchChange(val, id)}
                  />
                </div>
              </div>
            ))}
          </Card>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

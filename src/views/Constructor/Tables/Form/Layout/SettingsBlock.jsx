import FieldsBlock from "./FieldsBlock"
import FieldSettings from "./FieldSettings"
import RelationSettings from "./RelationSettings"

const SettingsBlock = ({
  mainForm,
  layoutForm,
  selectedSettingsTab,
  setSelectedSettingsTab,
  closeSettingsBlock,
  selectedField,
  selectedRelation,
  getRelationFields
}) => {

  if(selectedField) {
    return <FieldSettings field={selectedField} mainForm={mainForm} closeSettingsBlock={closeSettingsBlock}  />
  }

  if(selectedRelation) {
    return <RelationSettings closeSettingsBlock={closeSettingsBlock} relation={selectedRelation} getRelationFields={getRelationFields}  />
  }

  return (
    <FieldsBlock
      mainForm={mainForm}
      layoutForm={layoutForm}
      selectedSettingsTab={selectedSettingsTab}
      setSelectedSettingsTab={setSelectedSettingsTab}
      closeSettingsBlock={closeSettingsBlock}
    />
  )
}

export default SettingsBlock

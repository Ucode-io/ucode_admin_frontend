import useCustomActionsQuery from "../../../../queries/hooks/useCustomActionsQuery"
import ActionButton from "./ActionButton"

const FormCustomActionButton = ({tableSlug, id}) => {
  const { data: { custom_events: customEvents = [] } = {} } =
    useCustomActionsQuery({
      tableSlug,
      queryPayload: { hasId: !!id },
      queryParams: {
        enabled: !!id,
      },
    })

  return (
    <>
      {customEvents?.map((event) => (
        <ActionButton key={event.id} event={event} id={id} />
      ))}
    </>
  )
}

export default FormCustomActionButton

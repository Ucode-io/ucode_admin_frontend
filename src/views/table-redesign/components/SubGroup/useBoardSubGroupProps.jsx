export const useBoardSubGroupProps = ({ viewUpdateMutation, view, fieldsMap }) => {

  const handleUpdateSubGroup = (type, checked) => {

    viewUpdateMutation.mutate({
      ...view,
      attributes: {
        ...view.attributes,
        sub_group_by_id: checked ? type : null,
      },
    });
  }

  return {
    handleUpdateSubGroup,
  }
}

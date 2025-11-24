self.onmessage = function (event) {
  const { tableData, columns } = event.data;

  // Имитация тяжёлой операции combine()
  const combined = tableData.map((row) => {
    return columns.map((col) => ({
      guid: row.guid,
      slug: col.slug,
      value: row[col.slug] ?? null,

      [`${col.slug}_data`]: row[`${col.slug}_data`],

      id: col.id,
      type: col.type,
      enable_multilanguage: col.enable_multilanguage,
      table_slug: col.table_slug,
      table_id: col.table_id,
      relation_type: col.relation_type,
      tabIndex: col.tabIndex,
      required: col.required,
      view_fields: col.view_fields,
      attributes: {
        ...col.attributes,
        required: col.required,
      },
    }));
  });

  self.postMessage(combined);
};

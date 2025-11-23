self.onmessage = function (event) {
  const { tableData, columns } = event.data;

  // Имитация тяжёлой операции combine()
  const combined = tableData.map((row) => {
    return columns.map((col) => ({
      value: row[col.slug] ?? null,
      slug: col.slug,
      guid: row.guid,
      id: col.id,
      type: col.type,
      enable_multilanguage: col.enable_multilanguage,
      table_slug: col.table_slug,
      relation_type: col.relation_type,
      tabIndex: col.tabIndex,
      attributes: {
        ...col.attributes,
        required: col.required,
      },
    }));
  });

  self.postMessage(combined);
};

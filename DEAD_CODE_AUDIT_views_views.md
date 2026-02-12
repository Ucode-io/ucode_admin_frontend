# Dead Code Elimination Audit — src/views/views

**Scope:** `src/views/views` only  
**Entry points (ACTIVE):**  
- `src/router/NewRouter.jsx` imports `Views` from `@/views/views`  
- `src/views/views/index.js` → `Views.jsx`  
- `src/views/views/components/DrawerDetailPage/index.jsx` uses `lazy(() => import("../.."))` (loads parent Views)

**Dynamic imports within views/views (all ACTIVE):**  
- `CellElementGeneratorForRelation.jsx`: `lazy(…CellManyToManyRelationElement)`, `lazy(…CellRelationFormElementForNewColumn)`  
- `DrawerFieldGenerator.jsx`: `lazy(…RelationField)`  
- `Section.jsx`: `lazy(…DrawerFormDetailPage)`  
- `valueOptionGenerator.jsx`: multiple lazy field editors (FormulaCellEditor, HFTextInputField, etc.)

---

## Candidates for deletion

### 1. Orphan files (no static or dynamic imports found)

| File | Reason |
|------|--------|
| **src/views/views/components/ElementGenerators/RelationFormElement-backup.jsx** | No static or dynamic imports found. Backup file, never referenced. |
| **src/views/views/components/ElementGenerators/DentistView.jsx** | No imports from views/views path. `HFDentist` / FormElements use `@/components/ElementGenerators/DentistView`, not views/views. |
| **src/views/views/components/ElementGenerators/ProgrammingLan.jsx** | No imports from views/views path. Only the duplicate under `src/components/ElementGenerators` is used. |
| **src/views/views/components/ElementGenerators/FormElementGenerator.jsx** | All usages import from `@/components/ElementGenerators/FormElementGenerator`. No reference to views/views version. |
| **src/views/views/components/ElementGenerators/CellFormElementGenerator.jsx** | `TableRowForm` / `MultipleUpdateRow` import from `@/components/ElementGenerators`. No reference to views/views version. |
| **src/views/views/components/ElementGenerators/GroupTableDataForm.jsx** | `GroupTableRow` imports from `../ElementGenerators/GroupTableDataForm` (components). No reference to views/views version. |
| **src/views/views/components/ElementGenerators/JsonCellElement.jsx** | No imports to views/views/.../JsonCellElement anywhere. |
| **src/views/views/components/ElementGenerators/FormulaCell.jsx** | No imports to views/views version. ValueGenerator and others use `@/components` version. |
| **src/views/views/components/ElementGenerators/OldCellGenerator.js** | No imports. Only commented-out references inside the file. |
| **src/views/views/components/ElementGenerators/FieldTypesComponents.js** | Exports `fieldTypesComponent`; no file in the repo imports it (checked by name and path). |
| **src/views/views/components/ElementGenerators/CustomImageComponent/index.jsx** | No file imports CustomImageComponent from views/views. Only self-reference in definition. (Keep **CustomImageComponent/style.module.scss** if you retain the folder for future use; otherwise delete the folder.) |

### 2. Recursive cleanup (only used by unused files)

| File | Reason |
|------|--------|
| **src/views/views/components/ElementGenerators/data.js** | Only imported by `DentistView.jsx` in views/views, which is unused. Safe to delete together with DentistView. |
| **src/views/views/components/ElementGenerators/NewCellElementGenerator.jsx** | Only imported by `GroupTableDataForm.jsx` (views/views), which is unused. Safe to delete together with GroupTableDataForm. |

---

## Summary

- **Total candidate files:** 13 (11 orphans + 2 recursive).
- **Index / re-exports:** No `index.js` in `ElementGenerators` re-exports these; the only references to views/views ElementGenerators are explicit paths to `TableDataForm`, `CellElementGeneratorForTableView`, and `CellElementGeneratorForRelation` (all remain active).
- **Router / lazy:** No candidate is used in router config or in any `lazy(() => import(...))` under `src/views/views`.

---

## Recommended next step

1. Review this list and confirm in your repo that nothing else imports these paths (e.g. string-based dynamic imports or test fixtures).
2. If confirmed, say: **"I have verified the list, now proceed with the deletion of these specific files."**
3. After deletion, run the app and tests; a second audit pass can then remove any files that become orphaned by these deletions (e.g. dependencies of `FormElementGenerator.jsx` in views/views).

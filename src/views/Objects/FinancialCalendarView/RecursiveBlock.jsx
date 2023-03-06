import { Collapse } from "@mui/material";
import { get } from "@ngard/tiny-get";
import { useState } from "react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import useTabRouter from "../../../hooks/useTabRouter";
import style from "./style.module.scss";
import RemoveIcon from "@mui/icons-material/Remove";
import { numberWithSpaces } from "../../../utils/formatNumbers";
import { CTableCell, CTableRow } from "../../../components/CTable";

const RecursiveBlock = ({
  row,
  view,
  data = [],
  setData,
  level = 1,
  fieldsMap,
  dataList,
  financeDate,
}) => {
  const { tableSlug } = useParams();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const { navigateToForm } = useTabRouter();
  const children = useMemo(() => {
    return financeDate.filter((el) => el[`${tableSlug}_id`] === row.guid);
  }, [financeDate, row, tableSlug]);

  const switchChildBlock = (e) => {
    e.stopPropagation();
    setChildBlockVisible((prev) => !prev);
  };

  const navigateToEditPage = () => {
    navigateToForm(tableSlug, "EDIT", row);
  };

  return (
    <>
      <CTableRow
        onClick={navigateToEditPage}
        // onClick={switchChildBlock}
        >
        <CTableCell className={style.title} style={{ paddingLeft: 15 * level }}>
          {children?.length ? (
            <span
              className={style.switchIcon}
              isOpen={childBlockVisible}
              onClick={switchChildBlock}
            >
              {!childBlockVisible ? (
                <button className={style.addIcon}>
                  <AddIcon
                    style={{
                      color: "#0E73F6",
                      fontSize: "16px",
                    }}
                  />
                </button>
              ) : (
                <button className={style.addIcon}>
                  <RemoveIcon
                    style={{
                      color: "#0E73F6",
                      fontSize: "16px",
                    }}
                  />
                </button>
              )}
            </span>
          ) : (
            <div className="mr-2"></div>
          )}
          {view?.columns?.map((fieldId) => {
              const fieldSlug = fieldsMap?.[fieldId]?.slug;
              return `${get(row, fieldSlug, "")} `;
            })}
        </CTableCell>

        {row?.amounts.map((item) =>
          level === 1 ? (
            <CTableCell>
              <div style={{display: 'flex'}}>
                <div className={style.priceBlockChild}>
                  {numberWithSpaces(item?.amount) === 0 ? (
                    <span>-</span>
                  ) : (
                    numberWithSpaces(item?.amount)
                  )}
                </div>
                <div className={style.priceBlockChild}>
                  {numberWithSpaces(item?.amount) === 0 ? (
                    <span>-</span>
                  ) : (
                    <span style={{fontSize: '12px', opacity: '0.7'}}>
                      {parseFloat(item?.percentage).toFixed(2) + "%"}
                    </span>
                  )}
                </div>
              </div>
            </CTableCell>
          ) : (
            <CTableCell>
              <div style={{display: 'flex'}}>
                <div className={style.priceBlockChild}>
                  {numberWithSpaces(item?.amount) === 0 ? (
                    <span>-</span>
                  ) : (
                    numberWithSpaces(item?.amount)
                  )}
                </div>
                <div className={style.priceBlockChild}>
                  {numberWithSpaces(item?.amount) === 0 ? (
                    <span >-</span>
                  ) : (
                    <span style={{fontSize: '12px', opacity: '0.7'}}>
                    {parseFloat(item?.percentage).toFixed(2) + "%"}
                  </span>
                  )}
                </div>
              </div>
            </CTableCell>
          )
        )}
      </CTableRow>
          <Collapse in={childBlockVisible} unmountOnExit>
            {children?.map((childRow) => (
              <RecursiveBlock
                key={childRow.guid}
                row={childRow}
                data={data}
                view={view}
                level={level + 1}
                setData={setData}
                fieldsMap={fieldsMap}
                dataList={dataList}
                financeDate={financeDate}
              />
            ))}
          </Collapse>
    </>
  );
};

export default RecursiveBlock;

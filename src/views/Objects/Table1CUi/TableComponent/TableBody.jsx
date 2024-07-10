import React from "react";
import styles from "./style.module.scss";

function TableBody({toggleGroup, openGroups}) {
  return (
    <tbody>
      <tr className={styles.group_row} onClick={() => toggleGroup(1)}>
        <td>
          <div className={styles.td_row}>
            <button className={styles.toggle_btn}>
              {openGroups[1] ? (
                <img src="/img/dropdown_icon.svg" alt="" />
              ) : (
                <img src="/img/right_icon.svg" alt="" />
              )}
            </button>
            <span className={styles.folder_icon}>
              <img src="/img/folder_icon.svg" alt="" />
            </span>
            <p>Товары</p>
          </div>
        </td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      {openGroups[1] && (
        <>
          <tr className={styles.child_row}>
            <td>
              <div className={styles.childTd}>
                <img src="/img/child_icon.svg" alt="" />
                <p>Вилы</p>
              </div>
            </td>
            <td></td>
            <td>ШТ</td>
            <td>18%</td>
          </tr>
          <tr className={styles.child_row}>
            <td>
              <div className={styles.childTd}>
                <img src="/img/child_icon.svg" alt="" />
                <p>Вилы</p>
              </div>
            </td>
            <td></td>
            <td>ШТ</td>
            <td>18%</td>
          </tr>
          <tr className={styles.child_row}>
            <td>
              <div className={styles.childTd}>
                <img src="/img/child_icon.svg" alt="" />
                <p>Вилы</p>
              </div>
            </td>
            <td></td>
            <td>ШТ</td>
            <td>18%</td>
          </tr>
        </>
      )}
      <tr className={styles.group_row} onClick={() => toggleGroup(2)}>
        <td>
          <div className={styles.td_row}>
            <button className={styles.toggle_btn}>
              {openGroups[2] ? (
                <img src="/img/dropdown_icon.svg" alt="" />
              ) : (
                <img src="/img/right_icon.svg" alt="" />
              )}
            </button>
            <span className={styles.folder_icon}>
              <img src="/img/folder_icon.svg" alt="" />
            </span>
            <p>Товары</p>
          </div>
        </td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      {openGroups[2] && (
        <>
          <tr className={styles.child_row}>
            <td>
              <div className={styles.childTd}>
                <img src="/img/child_icon.svg" alt="" />
                <p>Вилы</p>
              </div>
            </td>
            <td></td>
            <td>ШТ</td>
            <td>18%</td>
          </tr>
          <tr className={styles.child_row}>
            <td>
              <div className={styles.childTd}>
                <img src="/img/child_icon.svg" alt="" />
                <p>Вилы</p>
              </div>
            </td>
            <td></td>
            <td>ШТ</td>
            <td>18%</td>
          </tr>
          <tr className={styles.child_row}>
            <td>
              <div className={styles.childTd}>
                <img src="/img/child_icon.svg" alt="" />
                <p>Вилы</p>
              </div>
            </td>
            <td></td>
            <td>ШТ</td>
            <td>18%</td>
          </tr>
        </>
      )}
      <tr className={styles.group_row} onClick={() => toggleGroup(3)}>
        <td>
          <div className={styles.td_row}>
            <button className={styles.toggle_btn}>
              {openGroups[3] ? (
                <img src="/img/dropdown_icon.svg" alt="" />
              ) : (
                <img src="/img/right_icon.svg" alt="" />
              )}
            </button>
            <span className={styles.folder_icon}>
              <img src="/img/folder_icon.svg" alt="" />
            </span>
            <p>Товары</p>
          </div>
        </td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      {openGroups[3] && (
        <>
          <tr className={styles.child_row}>
            <td>
              <div className={styles.childTd}>
                <img src="/img/child_icon.svg" alt="" />
                <p>Вилы</p>
              </div>
            </td>
            <td></td>
            <td>ШТ</td>
            <td>18%</td>
          </tr>
          <tr className={styles.child_row}>
            <td>
              <div className={styles.childTd}>
                <img src="/img/child_icon.svg" alt="" />
                <p>Вилы</p>
              </div>
            </td>
            <td></td>
            <td>ШТ</td>
            <td>18%</td>
          </tr>
          <tr className={styles.child_row}>
            <td>
              <div className={styles.childTd}>
                <img src="/img/child_icon.svg" alt="" />
                <p>Вилы</p>
              </div>
            </td>
            <td></td>
            <td>ШТ</td>
            <td>18%</td>
          </tr>
        </>
      )}
    </tbody>
  );
}

export default TableBody;

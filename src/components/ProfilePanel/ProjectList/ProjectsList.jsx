import { Menu } from "@mui/material";
import styles from "./project.module.scss";
import { useDispatch } from "react-redux";
import ProfileItem from "../ProfileItem";
import { companyActions } from "../../../store/company/company.slice";

const ProjectList = ({
  projectListEl,
  closeProjectList,
  projectVisible,
  projectList,
}) => {
  const dispatch = useDispatch();

  return (
    <Menu
      id="lock-menu"
      anchorEl={projectListEl}
      open={projectVisible}
      onClose={closeProjectList}
      classes={{ list: styles.projectlist, paper: styles.projectpaper }}
    >
      <div className={styles.block}>
        {projectList?.map((item) => (
          <ProfileItem
            children={
              <>
                <p className={styles.projectavatar}>
                  {item?.title?.charAt(0).toUpperCase()}
                </p>
                {item?.title}
              </>
            }
            onClick={() => {
              dispatch(companyActions.setEnvironmentItem({}));
              dispatch(companyActions.setProjectItem(item));
              dispatch(companyActions.setProjectId(item.project_id));
              closeProjectList();
            }}
            className={styles.menuItem}
          />
        ))}
      </div>
    </Menu>
  );
};

export default ProjectList;

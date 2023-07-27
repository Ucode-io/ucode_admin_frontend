import { Menu } from "@mui/material";
import styles from "./project.module.scss";
import { useDispatch, useSelector } from "react-redux";
import ProfileItem from "../ProfileItem";
import { companyActions } from "../../../store/company/company.slice";
import { useQueryClient } from "react-query";
import LayersIcon from "@mui/icons-material/Layers";

const ProjectList = ({
  projectListEl,
  closeProjectList,
  projectVisible,
  projectList,
  setSelected,
  handleProjectNavigate,
}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const permissions = useSelector((state) => state.auth.globalPermissions);

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
              // dispatch(companyActions.setEnvironmentItem({}));
              setSelected(true);
              queryClient.refetchQueries(["ENVIRONMENT"], item.project_id);
              dispatch(companyActions.setProjectItem(item));
              dispatch(companyActions.setProjectId(item.project_id));
              closeProjectList();
            }}
            className={styles.menuItem}
            key={item.project_id}
          />
        ))}
        {permissions?.projects_button && (
          <ProfileItem
            children={
              <LayersIcon
                style={{
                  color: "#747474",
                }}
              />
            }
            text={"Projects"}
            onClick={() => {
              handleProjectNavigate();
              closeProjectList();
            }}
            className={styles.menuItem}
          />
        )}
      </div>
    </Menu>
  );
};

export default ProjectList;

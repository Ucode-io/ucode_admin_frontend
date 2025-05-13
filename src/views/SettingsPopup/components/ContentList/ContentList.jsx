import {Badge, Box, Menu, Skeleton} from "@mui/material";
import {useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {groupedResources} from "../../../../utils/resourceConstants";
import AddIcon from "@mui/icons-material/Add";
import {ResourcesDetail} from "../../modules/ResourcesDetail";
import {useQueryClient} from "react-query";

export const ContentList = ({
  arr,
  onItemClick = () => {},
  additional = null,
  isLoading,
  selectedFieldKey = "name",
  canEdit,
  canDelete,
  handleClose = () => {},
  handleDelete = () => {},
  handleEdit = () => {},
  ...props
}) => {
  if (isLoading) {
    return (
      <Box sx={{marginTop: "36px"}}>
        <Skeleton height="49px" width="100%" />
        <Skeleton height="49px" width="100%" />
        <Skeleton height="49px" width="100%" />
        <Skeleton height="49px" width="100%" />
      </Box>
    );
  }
  const navigate = useNavigate();
  const {appId} = useParams();
  const [openResource, setOpenResource] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [resourceVal, setResourceVal] = useState();

  const clickHandler = (element) => {
    if (element?.id) {
      setResourceVal(element);
      setOpenResource(true);
    } else if (element?.value !== 5 && element?.value !== 8 && !element?.id) {
      setOpenResource(element?.value);
      setSearchParams({tab: "resources", resource_type: element?.value});
    }

    if (element?.value === 5) {
      const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_BASE_DOMAIN;

      const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&redirect_uri=${redirectUri}`;

      window.open(url, "_blank", "noopener,noreferrer");
    } else if (element?.value === 8) {
      const clientId = import.meta.env.VITE_CLIENT_ID_GITLAB;
      const redirectUri = import.meta.env.VITE_BASE_DOMAIN_GITLAB;

      const url = `https://gitlab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=api read_api read_user read_repository write_repository read_registry write_registry admin_mode read_service_ping openid profile email`;

      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      {Boolean(!openResource) ? (
        groupedResources?.map((element) => (
          <Box sx={{padding: "20px 16px 16px"}}>
            <FRLabel children={<>{element?.head}</>} />
            <Box sx={{display: "flex", alignItems: "center", gap: "16px"}}>
              {element?.items?.map((val) => (
                <ResourceButton
                  setResourceVal={setResourceVal}
                  clickHandler={clickHandler}
                  arr={arr}
                  val={val}
                  onItemClick={onItemClick}>
                  {getElementIcon(val?.icon)}
                  <p>{val?.label}</p>
                </ResourceButton>
              ))}
            </Box>
          </Box>
        ))
      ) : (
        <ResourcesDetail
          setResourceVal={setResourceVal}
          resourceVal={resourceVal}
          setOpenResource={setOpenResource}
        />
      )}
    </>
  );
};

const FRLabel = ({children}) => {
  return (
    <Box sx={{color: "#344054", fontWeight: 600, fontSize: "12px"}}>
      {children}
    </Box>
  );
};

const ResourceButton = ({children, val, arr = [], clickHandler = () => {}}) => {
  const computedElements = arr?.filter(
    (el) =>
      el?.type?.toLowerCase() ===
      (val?.type === "CLICK_HOUSE" || val?.type === "SMS"
        ? val?.type
        : val?.label
      )?.toLowerCase()
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [chosenResource, setChosenResource] = useState();
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const [searchParams, setSearchParams] = useSearchParams();
  const handleClose = () => setAnchorEl(null);
  console.log("computedElementscomputedElements", computedElements);
  return (
    <>
      {computedElements?.length === 0 ? (
        <Box
          onClick={() => {
            clickHandler(val);
          }}
          className={"resourceBtn"}>
          {getElementIcon(val?.icon)}
          <p>{val?.label}</p>
        </Box>
      ) : (
        <Badge
          onClick={(e) => {
            handleClick(e);
            setChosenResource(val);
            setSearchParams({tab: "resources"});
          }}
          sx={{marginTop: "20px"}}
          badgeContent={computedElements?.length}
          color="primary">
          <Box className={"resourceDisabled"}>{children}</Box>
        </Badge>
      )}

      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <Box sx={{minWidth: "140px"}}>
          {computedElements?.map((el) => (
            <Box
              key={el?.id}
              onClick={() => {
                clickHandler(el);
                setSearchParams({
                  tab: "resources",
                  resource_type: val?.value,
                  edit: true,
                });
                setChosenResource(val);
              }}
              sx={{
                padding: "5px 15px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                "&:hover": {
                  background: "#efefef",
                },
                cursor: "pointer",
              }}>
              {getElementIcon(chosenResource?.icon)}
              <p>{el?.name ?? el?.settings?.postgres?.connection_name}</p>
            </Box>
          ))}
          <Box
            onClick={() => clickHandler(val)}
            sx={{
              borderTop: "1px solid #efefef",
              cursor: "pointer",
              padding: "5px 15px",
              "&:hover": {
                background: "#efefef",
              },
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}>
            <AddIcon />
            <p>Add resource</p>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

const getElementIcon = (element) => {
  switch (element) {
    case "mongodb":
      return <img src="/img/mongodb.svg" alt="" />;
    case "postgres":
      return <img src="/img/postgres.svg" alt="" />;
    case "restapi":
      return <img src="/img/resapi.svg" alt="" />;
    case "github":
      return <img src="/img/github.svg" alt="" />;
    case "gitlab":
      return <img src="/img/gitlab.svg" alt="" />;
    case "superset":
      return <img src="/img/superset.svg" alt="" />;
    case "clickhouse":
      return <img src="/img/clickhouse.svg" alt="" />;

    default:
      return <img src="/img/mongodb.svg" alt="" />;
  }
};

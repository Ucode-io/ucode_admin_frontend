import {
  Badge,
  Box,
  List,
  ListItem,
  ListItemText,
  Menu,
  Skeleton,
} from "@mui/material";
import {RiPencilFill} from "react-icons/ri";
import DeleteWrapperModal from "../../../../components/DeleteWrapperModal";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import {Delete} from "@mui/icons-material";
import {groupedResources} from "../../../../utils/resourceConstants";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

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
  const clickHandler = (element) => {
    handleClose();
    navigate(`/main/${appId}/resources/${element?.id}/${element.type}`, {
      state: {
        type: element?.type,
      },
    });
  };

  return (
    <div>
      {groupedResources?.map((element) => (
        <Box sx={{padding: "20px 16px 16px"}}>
          <FRLabel children={<>{element?.head}</>} />
          <Box sx={{display: "flex", alignItems: "center", gap: "16px"}}>
            {element?.items?.map((val) => (
              <ResourceButton
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
      ))}
    </div>
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
  const computedElements = arr?.filter((el) => el?.type === val?.type);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [chosenResource, setChosenResource] = useState();
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      {computedElements?.length === 0 ? (
        <Box className={"resourceBtn"}>
          {getElementIcon(val?.icon)}
          <p>{val?.label}</p>
        </Box>
      ) : computedElements?.length === 1 ? (
        <Box
          sx={{marginTop: "20px"}}
          onClick={() => {
            computedElements?.length === 1 &&
              clickHandler(computedElements?.[0]);
          }}
          className={"resourceDisabled"}>
          {children}
        </Box>
      ) : (
        <Badge
          onClick={(e) => {
            handleClick(e);
            setChosenResource(val);
          }}
          sx={{marginTop: "20px"}}
          badgeContent={computedElements?.length}
          color="primary">
          <Box className={"resourceDisabled"}>{children}</Box>
        </Badge>
      )}

      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <Box sx={{width: "120px"}}>
          {computedElements?.map((el) => (
            <Box
              onClick={() => clickHandler(el)}
              sx={{
                padding: "5px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                "&:hover": {
                  background: "#efefef",
                },
                cursor: "pointer",
              }}>
              {getElementIcon(chosenResource?.icon)}
              <p>{el?.name}</p>
            </Box>
          ))}
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

// return (
//   <List {...props}>
//     {arr?.map((row) => {
//       return (
//         <ListItem
//           key={row.id || row.guid || row.name}
//           sx={{ borderBottom: "1px solid #E0E0E0", cursor: "pointer" }}
//           onClick={() => onItemClick(row)}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               width: "100%",
//             }}
//           >
//             <ListItemText>{row?.[selectedFieldKey]}</ListItemText>
//             {(canEdit || canDelete) && (
//               <Box display="flex" alignItems="center" gap="10px">
//                 {canEdit && (
//                   <RiPencilFill
//                     cursor="pointer"
//                     size={13}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleEdit(e, row);
//                     }}
//                     style={{
//                       color: "#475467",
//                     }}
//                   />
//                 )}
//                 {canDelete && (
//                   <Box className="extra_icon">
//                     <DeleteWrapperModal onDelete={() => handleDelete(row)}>
//                       <RectangleIconButton style={{ border: "none" }}>
//                         <Delete
//                           size={13}
//                           style={{
//                             color: "#475467",
//                           }}
//                         />
//                       </RectangleIconButton>
//                     </DeleteWrapperModal>
//                   </Box>
//                 )}
//               </Box>
//             )}
//           </Box>
//         </ListItem>
//       );
//     })}
//   </List>
// );
// };

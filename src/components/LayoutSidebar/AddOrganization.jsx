import {Box, Button, Input} from "@chakra-ui/react";
import {Dialog, Modal} from "@mui/material";
import React, {useState} from "react";
import companyService from "../../services/companyService";
import {useQueryClient} from "react-query";
import AddIcon from "@mui/icons-material/Add";
import companyAuthService from "../../services/auth/companyAuth";

function AddOrganization() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const createCompany = () => {
    setLoading(true);
    companyAuthService
      .create({
        name: text,
      })
      .then(() => {
        setLoading(false);
        queryClient.refetchQueries("COMPANY");
        onClose();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <Button
        mt={"5px"}
        w={"100%"}
        h={"25px"}
        fontSize={"12px"}
        color={"#475466"}
        borderRadius={"4px"}
        border={"1px solid #eee"}
        onClick={handleClick}>
        <AddIcon />
        Add Organization
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <Box w={"400px"} h={"150px"} p={"15px 15px"}>
          <Box fontWeight={"500"} fontSize={"16px"}>
            Organization Name
          </Box>
          <Box w={"100%"}>
            <Input
              placeholder="Name"
              type="text"
              w={"100%"}
              h={"38px"}
              border={"1px solid #787774"}
              borderRadius={"6px"}
              padding="0px 10px"
              mt={"15px"}
              onChange={(e) => setText(e.target.value)}
            />
          </Box>
          <Box w={"100%"} textAlign={"right"}>
            <Button
              onClick={() => {
                createCompany();
              }}
              isLoading={loading}
              bg="#0361cc"
              w={"100px"}
              h={"35px"}
              color={"#fff"}
              fontSize={"14px"}
              margin="8px 0 0 0"
              borderRadius={"6px"}>
              Save
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

export default AddOrganization;

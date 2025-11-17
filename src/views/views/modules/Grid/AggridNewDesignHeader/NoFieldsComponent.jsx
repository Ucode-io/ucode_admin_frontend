import {Box, Image} from "@chakra-ui/react";
import React from "react";
import FieldCreateHeaderComponent from "../FieldCreateHeaderComponent";

function NoFieldsComponent() {

  return (
    <>
      <div className="CTableContainer">
        <div
          className="table"
          style={{
            border: "none",
            borderRadius: 0,
            flexGrow: 1,
            backgroundColor: "#fff",
            height: `calc(100vh - ${130}px)`,
          }}>
          <table id="resizeMe">
            <thead
              style={{
                borderBottom: "1px solid #EAECF0",
                position: "sticky",
                top: 0,
                zIndex: 2,
                height: "32px",
              }}>
              <tr>
                <IndexTh />
                <Th>
                  <FieldCreateHeaderComponent />
                </Th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const Th = ({children}) => {
  return (
    <Box
      h={"32px"}
      width="60%"
      textAlign="center"
      as="th"
      //   bg="#f6f6f6"
      py="2px"
      px="12px"
      borderRight="1px solid #EAECF0"
      position="sticky"
      left={0}
      zIndex={1}>
      {children}
    </Box>
  );
};

const IndexTh = () => {

  return (
    <Box
      dth="45px"
      textAlign="center"
      as="th"
      bg="#f6f6f6"
      py="2px"
      px="12px"
      borderRight="1px solid #EAECF0"
      position="sticky"
      left={0}
      zIndex={1}>
      <Image src="/img/hash.svg" alt="index" mx="auto" />
    </Box>
  );
};

export default NoFieldsComponent;

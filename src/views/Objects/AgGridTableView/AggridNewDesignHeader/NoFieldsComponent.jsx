import {Box, Image} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import FieldCreateHeaderComponent from "../FieldCreateHeaderComponent";

function NoFieldsComponent({}) {
  const {i18n} = useTranslation();

  const [limitOptions, setLimitOptions] = useState([
    {
      value: 10,
      label: `10`,
    },
    {
      value: 20,
      label: `20`,
    },
    {
      value: 30,
      label: `30`,
    },
    {
      value: 40,
      label: `40`,
    },
  ]);

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

const IndexTh = ({}) => {
  const {tableSlug} = useParams();
  const permissions = useSelector((state) => state?.permissions?.permissions);
  const hasPermission = permissions?.[tableSlug]?.delete;
  const [hover, setHover] = useState(false);

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
      zIndex={1}
      onMouseEnter={hasPermission ? () => setHover(true) : null}
      onMouseLeave={hasPermission ? () => setHover(false) : null}>
      <Image src="/img/hash.svg" alt="index" mx="auto" />
    </Box>
  );
};

export default NoFieldsComponent;

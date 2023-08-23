import { GrClose } from "react-icons/gr";
import CodeMirror from "@uiw/react-codemirror";
import ReactJson from "react-json-view";
import { useFieldArray } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import HFSelect from "../../../../FormElements/HFSelect";
import { methods, typeBody } from "../mock/ApiEndpoints";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import InputWithPopUp from "./InputWithPopUp";
import styles from "../style.module.scss";
import QueryBodyTypes from "./QueryBodyTypes";

const QueryForRest = ({ control, form, responseQuery }) => {
  const typeOfAction = form.watch("body.action_type");

  const {
    fields: paramsFields,
    append: paramsAppend,
    remove: paramsRemove,
  } = useFieldArray({
    control,
    name: "body.params",
  });

  const {
    fields: headersFields,
    append: headersAppend,
    remove: headersRemove,
  } = useFieldArray({
    control,
    name: "body.headers",
  });

  const {
    fields: cookiesFields,
    append: cookiesAppend,
    remove: cookiesRemove,
  } = useFieldArray({
    control,
    name: "body.cookies",
  });

  return (
    <>
      <Box display="flex" alignItems="flex-start">
        <Typography
          minWidth="110px"
          mt="5px"
          pr="10px"
          textAlign="end"
          fontWeight="bold"
        >
          Action type
        </Typography>

        <Box display="flex" gap="20px" width="100%">
          <Box minWidth="100px">
            <HFSelect
              options={methods}
              control={control}
              required
              name="body.action_type"
              placeholder={"Select..."}
            />
          </Box>

          <Box
            display="flex"
            width="100%"
            border="1px solid #E2E8F0"
            borderRadius="0.325em"
            paddingX="5px"
          >
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              borderRight={"1px solid #E2E8F0"}
              height="30px"
            >
              <InputWithPopUp
                name={"body.base_url"}
                form={form}
                placeholder={"https://exampe_site.com/api/v2.json"}
              />
            </Box>

            <Box
              width="100%"
              display="flex"
              alignItems="center"
              paddingLeft="10px"
              height="30px"
            >
              <InputWithPopUp
                name={"body.path"}
                form={form}
                placeholder={"?example=1&example=2"}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box>
        {/*URL PARAMETERS START*/}

        <Box display="flex" alignItems="flex-start">
          <Typography
            minWidth="110px"
            mt="5px"
            pr="10px"
            textAlign="end"
            fontWeight="bold"
          >
            URL parametrs
          </Typography>

          <Box width="100%">
            <Box>
              <Box border="1px solid #E2E8F0" borderRadius="0.375rem">
                <Box>
                  {paramsFields.map((param, index) => (
                    <Box
                      borderBottom="1px solid #E2E8F0"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Box
                        width="100%"
                        display="flex"
                        alignItems="center"
                        pl="5px"
                        maxHeight="32px !important"
                      >
                        <InputWithPopUp
                          name={`body.params.${index}.key`}
                          form={form}
                          placeholder={"key"}
                        />
                      </Box>

                      <Box
                        width="100%"
                        display="flex"
                        alignItems="center"
                        borderLeft="1px solid #E2E8F0"
                        pl="5px"
                        maxHeight="32px !important"
                      >
                        <InputWithPopUp
                          name={`body.params.${index}.value`}
                          form={form}
                          placeholder={"value"}
                        />
                      </Box>

                      <Box
                        width="32px"
                        height="32px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderLeft="1px solid #E2E8F0"
                      >
                        <Button
                          variant="unstyled"
                          disabled={paramsFields?.length === 1}
                          className={styles.button}
                          onClick={() => paramsRemove(index)}
                        >
                          <GrClose size="15px" />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box>
                  <Button
                    variant="unstyled"
                    colorScheme="gray"
                    p="7px"
                    onClick={() => paramsAppend({ key: "", value: "" })}
                    color={"#007AFF"}
                  >
                    + Add new
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {/*URL PARAMETERS END*/}

        {/*HEADERS START*/}

        <Box display="flex" alignItems="flex-start" mt="12px">
          <Typography
            minWidth="110px"
            mt="5px"
            pr="10px"
            textAlign="end"
            fontWeight="bold"
          >
            Headers
          </Typography>

          <Box width="100%">
            <Box>
              <Box border="1px solid #E2E8F0" borderRadius="0.375rem">
                <Box>
                  {headersFields.map((header, index) => (
                    <Box
                      borderBottom="1px solid #E2E8F0"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Box
                        width="100%"
                        display="flex"
                        alignItems="center"
                        pl="5px"
                        maxHeight="32px !important"
                      >
                        <InputWithPopUp
                          name={`body.headers.${index}.key`}
                          form={form}
                          placeholder={"key"}
                        />
                      </Box>

                      <Box
                        width="100%"
                        display="flex"
                        alignItems="center"
                        pl="5px"
                        maxHeight="32px !important"
                        borderLeft="1px solid #E2E8F0"
                      >
                        <InputWithPopUp
                          name={`body.headers.${index}.value`}
                          form={form}
                          placeholder={"value"}
                        />
                      </Box>

                      <Box
                        width="32px"
                        height="32px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderLeft="1px solid #E2E8F0"
                      >
                        <Button
                          variant="unstyled"
                          disabled={headersFields?.length === 1}
                          className={styles.button}
                          onClick={() => headersRemove(index)}
                        >
                          <GrClose size="15px" />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box>
                  <Button
                    variant="unstyled"
                    colorScheme="gray"
                    p="7px"
                    onClick={() => headersAppend({ key: "", value: "" })}
                    color={"#007AFF"}
                  >
                    + Add new
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {/*HEADERS END*/}

        {/*COOKIES START*/}
        <Box display="flex" alignItems="flex-start" mt="12px">
          <Typography
            minWidth="110px"
            mt="5px"
            pr="10px"
            textAlign="end"
            fontWeight="bold"
          >
            Cookies
          </Typography>

          <Box width="100%">
            <Box>
              <Box border="1px solid #E2E8F0" borderRadius="0.375rem">
                <Box>
                  {cookiesFields.map((cookie, index) => (
                    <Box
                      borderBottom="1px solid #E2E8F0"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Box
                        width="100%"
                        display="flex"
                        alignItems="center"
                        pl="5px"
                        maxHeight="32px !important"
                      >
                        <InputWithPopUp
                          name={`body.cookies.${index}.key`}
                          form={form}
                          placeholder={"key"}
                        />
                      </Box>

                      <Box
                        width="100%"
                        display="flex"
                        alignItems="center"
                        pl="5px"
                        maxHeight="32px !important"
                        borderLeft="1px solid #E2E8F0"
                      >
                        <InputWithPopUp
                          name={`body.cookies.${index}.value`}
                          form={form}
                          placeholder={"value"}
                        />
                      </Box>

                      <Box
                        width="32px"
                        height="32px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderLeft="1px solid #E2E8F0"
                      >
                        <Button
                          variant="unstyled"
                          disabled={cookiesFields?.length === 1}
                          onClick={() => cookiesRemove(index)}
                          className={styles.button}
                        >
                          <GrClose size="15px" />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box>
                  <Button
                    variant="unstyled"
                    colorScheme="gray"
                    p="7px"
                    onClick={() => cookiesAppend({ key: "", value: "" })}
                    color={"#007AFF"}
                  >
                    + Add new
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {/*HEADERS START*/}

        {typeOfAction === "GET" ? (
          ""
        ) : (
          <Box display="flex" alignItems="flex-start" mt="12px">
            <Typography
              minWidth="110px"
              mt="5px"
              pr="10px"
              textAlign="end"
              fontWeight="bold"
            >
              Body
            </Typography>

            <Box width="100%">
              <Box width="100%" mb="10px">
                <HFSelect
                  options={typeBody}
                  control={control}
                  required
                  name="body.body_type"
                  customOnChange={(e) => form.setValue("body.body", "")}
                />
              </Box>

              <Box width="100%" borderRadius="0.375rem">
                <QueryBodyTypes form={form} control={control} />
              </Box>
            </Box>
          </Box>
        )}

        {responseQuery ? (
          <Box mt={"50px"}>
            <Typography mb="10px">Response</Typography>

            <Box width="100%" borderRadius="0.375rem" overflow="hidden">
              <Tabs>
                <TabList>
                  <Tab>Tree</Tab>
                  <Tab>Raw</Tab>
                </TabList>

                <TabPanel>
                  <ReactJson
                    src={responseQuery}
                    theme="monokai"
                    collapsed={true}
                  />
                </TabPanel>
                <TabPanel>
                  <CodeMirror
                    value={JSON.stringify(responseQuery, null, 2)}
                    height="auto"
                    width="100%"
                    color="#00C387"
                    theme={"dark"}
                  />
                </TabPanel>
              </Tabs>
            </Box>
          </Box>
        ) : (
          ""
        )}
      </Box>
    </>
  );
};

export default QueryForRest;

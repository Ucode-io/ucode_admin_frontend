import { AIMenu, useAIChat } from "@/components/ProfilePanel/AIChat";
import { Button } from "@chakra-ui/react";

export const AIButton = () => {
  const {
    open,
    anchorEl,
    loader,
    setLoader,
    inputValue,
    setInputValue,
    messages,
    messagesEndRef,
    handleClick,
    handleClose,
    handleKeyDown,
    handleSendClick,
    showInput,
    setShowInput,
    handleSuccess,
    handleError,
    onExited,
    appendMessage,
    selectedEntityType,
    handleChangeEntityType,
    setMessages,
    control,
    errors,
    handleSubmit,
    reset,
    setAnchorEl,
    setValue,
    watch,
  } = useAIChat();

  return (
    <>
      <Button
        h="30px"
        ml="auto"
        onClick={handleClick}
        variant="outline"
        colorScheme="gray"
        borderColor="#D0D5DD"
        color="#344054"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap="8px"
        borderRadius="8px"
        fontSize="14px"
        fontWeight={500}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.8332 11.666L8.33321 9.16602M12.5085 2.91602V1.66602M15.7913 4.21657L16.6752 3.33268M15.7913 10.8327L16.6752 11.7166M9.17517 4.21657L8.29128 3.33268M17.0918 7.49935H18.3418M5.10935 17.3899L12.8071 9.69216C13.1371 9.36214 13.3021 9.19714 13.3639 9.00686C13.4183 8.83949 13.4183 8.6592 13.3639 8.49183C13.3021 8.30156 13.1371 8.13655 12.8071 7.80654L12.1927 7.19216C11.8627 6.86214 11.6977 6.69714 11.5074 6.63531C11.34 6.58093 11.1597 6.58093 10.9924 6.63531C10.8021 6.69714 10.6371 6.86214 10.3071 7.19216L2.60935 14.8899C2.27934 15.2199 2.11433 15.3849 2.0525 15.5752C1.99812 15.7425 1.99812 15.9228 2.0525 16.0902C2.11433 16.2805 2.27934 16.4455 2.60935 16.7755L3.22373 17.3899C3.55375 17.7199 3.71875 17.8849 3.90903 17.9467C4.0764 18.0011 4.25669 18.0011 4.42405 17.9467C4.61433 17.8849 4.77934 17.7199 5.10935 17.3899Z"
            stroke="#475467"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>

      <AIMenu
        open={open}
        anchorEl={anchorEl}
        loader={loader}
        setLoader={setLoader}
        inputValue={inputValue}
        setInputValue={setInputValue}
        messages={messages}
        messagesEndRef={messagesEndRef}
        handleClose={handleClose}
        handleKeyDown={handleKeyDown}
        handleSendClick={handleSendClick}
        showInput={showInput}
        setShowInput={setShowInput}
        handleSuccess={handleSuccess}
        handleError={handleError}
        onExited={onExited}
        appendMessage={appendMessage}
        selectedEntityType={selectedEntityType}
        handleChangeEntityType={handleChangeEntityType}
        setMessages={setMessages}
        control={control}
        errors={errors}
        handleSubmit={handleSubmit}
        reset={reset}
        setValue={setValue}
        watch={watch}
      />
    </>
  );
};
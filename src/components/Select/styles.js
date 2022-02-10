import styled from 'styled-components'

export const ClearValueButton = styled.button`
  background: transparent;
  border: 0;
  outline: 0;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 4;
`
export const StatusMenuContainer = styled.button`
  border: 0;
  outline: 0;
  display: flex;
  border: 1px solid #e5e9eb;
  border-radius: 6px;
  height: 40px;
  align-items: center;
  font-size: 14px;
  padding: 0 10px;
  position: relative;
  min-width: 150px;
  width: 100%;
  border-color: ${({ theme, openMenu }) =>
    openMenu ? theme.palette.primary[500] : '#e5e9eb'};
  box-shadow: 0 0 0 1px
    ${({ theme, openMenu }) =>
      openMenu ? theme.palette.primary[500] : 'transparent'};
  &:hover {
    border-color: ${({ theme }) => theme.palette.primary[500]};
  }
  &:focus {
    border-color: ${({ theme }) => theme.palette.primary[500]};
  }
  background: ${({ hasValue, theme }) =>
    hasValue ? theme.palette.primary[600] : '#fff'};
  color: ${({ hasValue }) => (hasValue ? '#fff' : 'rgba(0, 0, 0, 0.5)')};
  & > span svg,
  & > span svg path {
    ${({ hasValue }) => hasValue && `fill: #fff;`}
    ${({ hasValue }) => hasValue && `fill-opacity: 1;`}
  }

  & > span:nth-child(1) {
    margin-right: 10px;
  }
`
export const StatusMenuList = styled.div`
  top: 100%;
  ${({ position }) => position || 'left'}: 0;
  border-radius: 12px;
  box-shadow: 0px 10px 40px rgb(0 0 0 / 10%);
  margin-bottom: 8px;
  margin-top: 6px;
  position: absolute;
  width: max-content;
  min-width: 100%;
  max-width: 300px;
  z-index: 1;
  box-sizing: border-box;
  align-items: center;
  padding: 4px 0;
  padding: ${({ noOptions }) => (noOptions ? '0' : '4px 0')};
  overflow: hidden;
  box-sizing: border-box;
  overflow-x: hidden;
  color: #9aa6ac;
  background: #fff;
  & > div {
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background: #fff;
      border-radius: 4px;
      margin: 2px 0;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #e8e8e8;
      border-radius: 4px;
    }
    & > button {
      width: 100%;
      background: #fff;
      border: 0;
      outline: 0;
      color: ${({ noOptions }) => (noOptions ? 'hsl(0, 0%, 60%)' : '#000')};
      justify-content: ${({ noOptions }) =>
        noOptions ? 'center' : 'flex-start'};
      cursor: pointer;
      display: flex;
      font-size: 14px;
      padding: 8px 12px;
      line-height: 24px;
      /* border-radius: 12px 12px 0 0; */
      height: 40px;
      box-shadow: ${({ noOptions }) =>
        noOptions ? 'none' : 'inset 0px -1px 0px rgb(0 0 0 / 7%)'};
    }
  }
`
export const SelectArrow = styled.span`
  margin-left: auto;

  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.4);
    color: #fff;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 20px;
    border-radius: 50%;
  }
`
export const StatusMenuOptionContainer = styled.div`
  min-height: 40px;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  padding: 0 12px;
  width: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  box-sizing: border-box;
  line-height: 24px;
  box-shadow: inset 0px -1px 0px rgb(0 0 0 / 7%);
  &:nth-last-child(1) {
    box-shadow: none;
  }
`

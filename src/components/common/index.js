import { Box } from '@material-ui/core'
import styled from 'styled-components'
import { breakpoints } from 'theme/breakpoint'

export const Title = styled.h1`
    font-weight: ${(props) => props.fontWeight || 600};
    font-size: ${(props) => (props.main ? 64 : props.fontSize || 36)}px;
    line-height: ${(props) => props.lineHeight || 1.25};
    text-align: ${(props) => (props.left ? 'left' : 'center')};
    color: ${(props) =>
        props.color
            ? props.color
            : props.white
            ? props.theme.palette.white
            : '#000'};
    max-width: ${(props) => props.maxWidth || '100%'};
    margin: ${(props) =>
        props.section
            ? '64px auto 48px'
            : props.my
            ? `${props.my || 0}px 0`
            : props.mt || props.mb
            ? `${props.mt || 0}px 0 ${props.mb || 0}px`
            : '0'};
    @media ${breakpoints.ml} {
        margin: ${(props) =>
            props.section
                ? '32px auto 20px'
                : props.my
                ? `${props.my || 0}px 0`
                : props.mt || props.mb
                ? `${props.mt || 0}px 0 ${props.mb || 0}px`
                : '0'};
        font-size: ${(props) =>
            props?.smFontSize || (props.main ? 48 : props.fontSize || 24)}px;
    }
`
export const Leading = styled.p`
    font-weight: ${(props) => props.fontWeight || 400};
    font-size: ${(props) => props.fontSize || 20}px;
    line-height: ${(props) => props.lineHeight || 1.25};
    text-align: ${(props) => (props.centered ? 'center' : 'left')};
    color: ${(props) =>
        props.color
            ? props.color
            : props.white
            ? props.theme.palette.white
            : '#000'};
    max-width: ${(props) => props.maxWidth || '460px'};
    margin: ${(props) =>
        props.my
            ? `${props.my}px 0`
            : props.mt || props.mb
            ? `${props.mt || 0}px  0 ${props.mb || 0}px`
            : '0'};
`

export const SectionTitle = styled.h3`
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    color: #212529;
    margin-bottom: 24px;
`

export const Tag = styled(Box)`
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    display: ${({ inline }) => `${inline ? 'inline-flex' : 'flex'}`};
    align-items: center;
    justify-content: ${({ bold, centered }) =>
        `${bold || centered ? 'center' : 'space-between'}`};
    width: ${({ inline }) => `${inline ? 'auto' : '100%'}`};
    min-height: ${({ height }) => `${height || 24}px`};
    border-radius: 6px;
    padding: 0 12px;
    white-space: ${({ nowrap }) => (nowrap ? 'nowrap' : 'normal')};
    background: ${({ primary, error, warning, neutral, bold }) =>
        `${
            primary
                ? `rgba(64, 148, 247, ${bold ? 1 : 0.15})`
                : error
                ? `rgba(235, 33, 33, ${bold ? 1 : 0.15})`
                : warning
                ? `rgba(228, 178, 0, ${bold ? 1 : 0.15})`
                : neutral
                ? `rgba(0, 179, 218, ${bold ? 1 : 0.15})`
                : '#F4F4F4'
        }`};
    color: ${({ primary, error, warning, neutral, bold }) =>
        `${
            bold
                ? '#fff'
                : primary
                ? '#2F54EB'
                : error
                ? '#EB2121'
                : warning
                ? '#EB952F'
                : neutral
                ? '#00B3DA'
                : 'rgba(0, 0, 0, 0.6)'
        }`};
    svg {
        margin-right: 8px;
    }
`

export const TruncatedText = styled.p`
    display: -webkit-box;
    max-width: 100%;
    font-size: ${(props) => props.fontSize || 16}px;
    line-height: ${(props) => props.lineHeight || 1.25};
    max-height: ${({ fontSize, lineLimit, lineHeight }) =>
        `calc(${fontSize || 16}px * ${lineHeight || 1.25} * ${
            lineLimit || 1
        })`};
    -webkit-line-clamp: ${({ lineLimit }) => lineLimit || 1};
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`

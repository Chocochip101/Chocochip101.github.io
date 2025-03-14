import styled from '@emotion/styled';
import React from 'react';

const TooltipWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    :hover {
        .tooltip {
            visibility: visible;
        }
    }
`;

const TooltipBox = styled.div<{ isCopied?: boolean }>`
    visibility: hidden;
    position: absolute;
    bottom: -36px;
    padding: 4px 10px;
    border-radius: 6px;
    background-color: ${({isCopied}) =>
            isCopied ? 'rgba(0, 255, 0, 0.2)' : 'rgba(113, 119, 132, 0.2)'};
    color: ${({theme, isCopied}) =>
            isCopied ? '#008000' : theme.colors.bluegray[500]};
    ${({theme}) => theme.fonts.type.caption2};
    text-align: center;
    transition: background-color 0.2s ease, color 0.2s ease;
`;

interface TooltipProps {
    children: React.ReactNode;
    tip: string;
    width?: number;
    isCopied?: boolean;
}

const Tooltip = ({width, children, tip, isCopied}: TooltipProps) => {
    return (
        <TooltipWrapper>
            {children}
            <TooltipBox style={{width}} className="tooltip" isCopied={isCopied}>
                {tip}
            </TooltipBox>
        </TooltipWrapper>
    );
};

export default Tooltip;
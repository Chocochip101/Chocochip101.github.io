import styled from '@emotion/styled';
import React from 'react';
import Icon, {IconProps} from '../Common/Icon';

const ButtonLayer = styled.button<{ isCopied?: boolean }>`
    padding: 10px;
    background-color: ${({isCopied}) =>
            isCopied ? 'rgba(0, 255, 0, 0.2)' : 'transparent'};

    :hover {
        background-color: ${({theme, isCopied}) =>
                isCopied ? 'rgba(0, 255, 0, 0.2)' : theme.colors.light[100]};
        border-radius: 8px;
    }

    transition: background-color 0.2s ease;
`;

interface IconButtonProps extends IconProps {
    onClick?: () => void;
    isCopied?: boolean;
}

const IconButton = ({icon, size, onClick, isCopied}: IconButtonProps) => {
    return (
        <ButtonLayer onClick={onClick} isCopied={isCopied}>
            <Icon size={size} icon={icon}/>
        </ButtonLayer>
    );
};

export default IconButton;
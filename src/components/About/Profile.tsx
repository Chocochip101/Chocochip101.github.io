import * as React from 'react';
import styled from '@emotion/styled';
import {GatsbyImage, IGatsbyImageData} from 'gatsby-plugin-image';
import {mediaQuery} from "theme/breakpoints";

type ProfileProps = {
    imageData: IGatsbyImageData;
    name: string;
    role: string;
    website: string;
    url: string;
};

const ProfileContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    gap: 10%;
`;

const ProfileImage = styled(GatsbyImage)`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-top: 20px;
    margin-bottom: 20px;
`;

const ProfileWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: left;
    margin-top: 20px;
    margin-bottom: 20px;
    
    ${mediaQuery.sm} {
        padding-bottom: 60px;
    }
`;

const ProfileName = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 8px;
`;

const ProfileRole = styled.p`
    font-size: 1rem;
    color: ${({theme}) => theme.lightTheme.text.light[500]};
    margin-bottom: 16px;
`;

const ProfileLink = styled.a`
    font-size: 1rem;
    color: ${({theme}) => theme.colors.primary[100]};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const Profile = ({imageData, name, role, website, url}: ProfileProps) => {
    return (
        <ProfileContainer>
            <ProfileImage image={imageData} alt={name}/>
            <ProfileWrapper>
                <ProfileName>{name}</ProfileName>
                <ProfileRole>{role}</ProfileRole>
                <ProfileLink href={url}>{website}</ProfileLink>
            </ProfileWrapper>
        </ProfileContainer>
    );
};

export default Profile;

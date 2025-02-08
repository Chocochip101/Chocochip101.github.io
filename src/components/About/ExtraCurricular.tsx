import * as React from 'react';
import styled from '@emotion/styled';

const ExtraCurricularSection = styled.section`
    padding: 20px 20px;
`;

const ExtraCurricularTitle = styled.h2`
    font-size: 2rem;
    margin-bottom: 30px;
    font-weight: bold;
`;

const ExtraCurricularItem = styled.div`
    margin-bottom: 12px;
    padding: 10px;
    background: ${({theme}) => theme.lightTheme.backgroundColor};
    border-radius: 8px;
`;

const ExtraCurricularHeader = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
    line-height: 190%;
`;

const ActivityName = styled.h3`
    font-size: 1.5rem;
    font-weight: bold;
`;

const Role = styled.p`
    font-size: 1.2rem;
    color: ${({theme}) => theme.lightTheme.text.dark};
`;

const Organizer = styled.p`
    font-size: 1rem;
    color: ${({theme}) => theme.lightTheme.text.dark};
`;

const Duration = styled.p`
    font-size: 1rem;
    color: ${({theme}) => theme.lightTheme.text.light[500]};
`;

const ExtraCurricularDetails = styled.ul`
    list-style: none;
    padding: 0;
    margin-top: 12px;

    & li {
        font-size: 1rem;
        margin-bottom: 6px;
        color: ${({theme}) => theme.lightTheme.text.dark};
    }
`;

const ExtraCurricular = () => {
    const activities = [
        {
            name: "AUSG (AWSKRUG University Student Group)",
            role: "7th Member",
            organizer: "AWSKRUG",
            duration: "May.2023 - Present",
            description: [
                "AUSGCON 2024 staff and task force (TF) member.",
                "Speaker at AWS Community Day 2023, sharing insights on AWS Kendra.",
            ],
        }
    ];

    return (
        <ExtraCurricularSection>
            <ExtraCurricularTitle>Extra Curricular</ExtraCurricularTitle>
            {activities.map((activity, index) => (
                <ExtraCurricularItem key={index}>
                    <ExtraCurricularHeader>
                        <ActivityName>{activity.name}</ActivityName>
                        <Role>{activity.role}</Role>
                        <Duration>{activity.duration}</Duration>
                        <Organizer>Organized By {activity.organizer}</Organizer>
                    </ExtraCurricularHeader>
                    <ExtraCurricularDetails>
                        {activity.description.map((desc, idx) => (
                            <li key={idx}>{desc}</li>
                        ))}
                    </ExtraCurricularDetails>
                </ExtraCurricularItem>
            ))}
        </ExtraCurricularSection>
    );
};

export default ExtraCurricular;

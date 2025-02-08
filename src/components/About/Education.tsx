import * as React from 'react';
import styled from '@emotion/styled';

const EducationSection = styled.section`
    padding: 20px 20px;
`;

const EducationTitle = styled.h2`
    font-size: 2rem;
    margin-bottom: 30px;
    font-weight: bold;
`;

const EducationItem = styled.div`
    margin-bottom: 12px;
    padding: 10px;
    background: ${({ theme }) => theme.lightTheme.backgroundColor};
    border-radius: 8px;
`;

const EducationHeader = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
    line-height: 190%;
`;

const OrganizationName = styled.h3`
    font-size: 1.5rem;
    font-weight: bold;
`;

const Position = styled.p`
    font-size: 1.2rem;
    color: ${({ theme }) => theme.lightTheme.text.dark};
`;

const Organization = styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.lightTheme.text.dark};
`;

const Duration = styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.lightTheme.text.light[500]};
`;

const EducationDetails = styled.ul`
    list-style: none;
    padding: 0;
    margin-top: 12px;

    & li {
        font-size: 1rem;
        margin-bottom: 6px;
        color: ${({ theme }) => theme.lightTheme.text.dark};
    }
`;

const Education = () => {
    const activities = [
        {
            organization: "Woowa Tech Course 6th",
            position: "Backend Developer",
            organized: "Woowa Bros",
            duration: "Jan.2024 - Nov.2024",
            description: [
            ],
        },
        {
            organization: "Softeer Bootcamp 2nd",
            position: "Backend Developer",
            organized: "Hyundai Motors",
            duration: "Jul.2023 - Aug.2023",
            description: [
            ],
        },
        {
            organization: "Software Maestro 13th",
            position: "Backend Developer",
            organized: "Ministry of Science and ICT",
            duration: "Apr.2022 - Nov.2022",
            description: [
            ],
        },
    ];

    return (
        <EducationSection>
            <EducationTitle>Educations</EducationTitle>
            {activities.map((activity, index) => (
                <EducationItem key={index}>
                    <EducationHeader>
                        <OrganizationName>{activity.organization}</OrganizationName>
                        <Position>{activity.position}</Position>
                        <Duration>{activity.duration}</Duration>
                        <Organization>Organized By {activity.organized}</Organization>
                    </EducationHeader>
                    <EducationDetails>
                        {activity.description.map((desc, idx) => (
                            <li key={idx}>{desc}</li>
                        ))}
                    </EducationDetails>
                </EducationItem>
            ))}
        </EducationSection>
    );
};

export default Education;

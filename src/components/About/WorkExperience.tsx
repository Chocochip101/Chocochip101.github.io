import * as React from 'react';
import styled from '@emotion/styled';

const ExperienceSection = styled.section`
    padding: 20px 20px;
`;

const ExperienceTitle = styled.h2`
    font-size: 2rem;
    margin-bottom: 30px;
    font-weight: bold;
`;

const ExperienceItem = styled.div`
    margin-bottom: 12px;
    padding: 10px;
    background: ${({theme}) => theme.lightTheme.backgroundColor};
    border-radius: 8px;
`;

const ExperienceHeader = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
    line-height: 190%;
`;

const CompanyName = styled.h3`
    font-size: 1.5rem;
    font-weight: bold;
`;

const Role = styled.p`
    font-size: 1.2rem;
    color: ${({theme}) => theme.lightTheme.text.dark};
`;

const Period = styled.p`
    font-size: 1rem;
    color: ${({theme}) => theme.lightTheme.text.light[500]};
`;

const Location = styled.p`
    font-size: 1rem;
    color: ${({theme}) => theme.lightTheme.text.light[500]};
`;

const ExperienceDetails = styled.ul`
    list-style: none;
    padding: 0;
    margin-top: 12px;

    & li {
        font-size: 1rem;
        margin-bottom: 6px;
        color: ${({theme}) => theme.lightTheme.text.dark};
    }
`;

const WorkExperience = () => {
    const experiences = [
        {
            company: "ABLY Corporation",
            role: "Backend Developer",
            period: "Jan.2025 - Present",
            location: "Seoul, Korea",
            team: "Foundation Team",
            techStack: ["Python", "Django", "Django Rest Framework", "AWS", "MySQL"],
        },
    ];

    return (
        <ExperienceSection>
            <ExperienceTitle>Work Experience</ExperienceTitle>
            {experiences.map((exp, index) => (
                <ExperienceItem key={index}>
                    <ExperienceHeader>
                        <CompanyName>{exp.company}</CompanyName>
                        <Role>{exp.role}</Role>
                        <Period>{exp.period}</Period>
                        <Location>{exp.location}</Location>
                    </ExperienceHeader>
                    <ExperienceDetails>
                        <li><strong>Team:</strong> {exp.team}</li>
                        <li><strong>Tech Stack:</strong> {exp.techStack.join(", ")}</li>
                    </ExperienceDetails>
                </ExperienceItem>
            ))}
        </ExperienceSection>
    );
};

export default WorkExperience;

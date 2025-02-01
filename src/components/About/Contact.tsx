import * as React from 'react';
import styled from '@emotion/styled';
import {FaEnvelope, FaGithub, FaLinkedin} from 'react-icons/fa';

interface ContactProps {
    github: string;
    email: string;
    linkedin: string;
}

const ContactSection = styled.section`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: left;
    width: 100%;
    padding: 20px 20px;
`;

const ContactTitle = styled.h2`
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
`;

const ContactList = styled.ul`
    list-style: none;
    padding: 0;
    display: flex;
    gap: 20px;

    & a {
        color: ${({theme}) => theme.colors.primary[100]};
        font-size: 2rem;
        transition: color 0.3s ease;

        &:hover {
            color: ${({theme}) => theme.colors.primary[200]};
        }
    }
`;

const Contact = ({github, email, linkedin}: ContactProps) => {
    return (
        <ContactSection>
            <ContactTitle>Contact</ContactTitle>
            <ContactList>
                <li>
                    <a href={`https://${github}`} target="_blank" rel="noopener noreferrer">
                        <FaGithub/>
                    </a>
                </li>
                <li>
                    <a href={`mailto:${email}`}>
                        <FaEnvelope/>
                    </a>
                </li>
                <li>
                    <a href={`https://${linkedin}`} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin/>
                    </a>
                </li>
            </ContactList>
        </ContactSection>
    );
};

export default Contact;

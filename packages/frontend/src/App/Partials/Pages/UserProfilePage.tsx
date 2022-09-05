import React from 'react';
import { Redirect, useLocation, useParams } from 'react-router';
import { Container, Row, Col } from 'reactstrap';
import { useUser } from '../../Hooks';

export interface UserProfilePageProps {

}

export const UserProfilePage: React.FunctionComponent<UserProfilePageProps> = () => {
    const params = useParams<{username: string}>();

    const { user } = useUser();

    console.log(user)

    if (!params.username) return <Redirect to="/" />

    return (
        <>
            <section className="section section-profile">
                <Container>
                    <Row>
                        <Col>
                            <h2>{params.username}</h2>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
}
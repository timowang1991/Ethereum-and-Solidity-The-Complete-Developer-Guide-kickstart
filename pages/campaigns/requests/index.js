import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);

        const requestCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();

        const requests = await Promise.all(
            Array(requestCount).fill().map((element, index) => 
                campaign.methods.requests(index).call()
            )
        );

        return {
            address,
            requests,
            requestCount,
            approversCount
        };
    }

    renderRows() {
        const { requests, address, approversCount } = this.props
        return requests.map((request, index) => 
            <RequestRow
                key={index}
                id={index}
                request={request}
                address={address}
                approversCount={approversCount}
            />
        );
    }

    render() {
        const { address } = this.props;
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <Layout>
                <h3>Requests</h3>
                <Link route={`/campaigns/${address}/requests/new`}>
                    <a><Button primary>Add Request</Button></a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount (Ether)</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
            </Layout>
        )
    }
}

export default RequestIndex;

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  Button,
  Card,
  Flex,
  Input,
  List,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VkeeOffer } from "../types/app";
import { DcatCatalog, VkeeAngebotstyp } from "../types/dataspace";

interface FederatedCatalogExplorerProps {}

const FederatedCatalogExplorer: React.FC<
  FederatedCatalogExplorerProps
> = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<Error | null>(null);

  const [seed, setSeed] = useState(1);
  const reset = () => {
    setSeed(Math.random());
  };

  const [federatedCatalog, setFederatedCatalog] = useState<DcatCatalog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [offers, setOffers] = useState<VkeeOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<VkeeOffer[]>([]);

  useEffect(() => {
    const fetchFederatedCatalog = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post<DcatCatalog[]>(
          `${
            import.meta.env.VITE_MY_EDC_CONNECTOR_MANAGEMENT_URL
          }/federatedcatalog`,
          {}
        );

        setFederatedCatalog(response.data);
      } catch (err) {
        setError(err as Error);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFederatedCatalog();
  }, [seed]);

  useEffect(() => {
    if (!searchTerm) {
      // no search term, show all offers
      setFilteredOffers(offers);
      return;
    } else {
      const filtered = offers.filter((offer) =>
        JSON.stringify(offer).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOffers(filtered);
    }
  }, [searchTerm, offers]);

  const extractOffersFromCatalog = (catalog: DcatCatalog) => {
    const offers: VkeeOffer[] = [];
    // check if the dataset is an array or a single object
    const datasets = Array.isArray(catalog["http://www.w3.org/ns/dcat#dataset"])
      ? catalog["http://www.w3.org/ns/dcat#dataset"]
      : [catalog["http://www.w3.org/ns/dcat#dataset"]];

    // create an offer for each dataset
    datasets.forEach((ds) => {
      offers.push({
        assetId: ds.id,
        name: ds.name,
        contenttype: ds["contenttype"] as string,
        description: ds["description"] as string,
        participantId: catalog.participantId,
        connectorUrl: catalog.originator,
      });
    });

    return offers;
  };

  useEffect(() => {
    const offers: VkeeOffer[] = [];
    for (const catalog of federatedCatalog) {
      offers.push(...extractOffersFromCatalog(catalog));
    }
    setOffers(offers);
  }, [federatedCatalog]);

  const handleUseOffer = (offer: VkeeOffer) => {
    console.log("Use offer", offer);

    const e = new URLSearchParams({
      datasetId: offer.assetId,
      counterPartyId: offer.participantId,
      counterPartyAddress: offer.connectorUrl,
    });

    navigate("negotiation?" + e.toString());
  };

  const renderCatalogExplorerHeader = () => {
    return (
      <Flex vertical gap={"small"}>
        <Flex justify="space-between">
          <Typography.Title style={{ margin: 0 }} level={3}>
            Catalog Explorer
          </Typography.Title>
          <Button size="small" onClick={reset}>
            Refresh
          </Button>
        </Flex>
        <Row>
          <Typography.Text type="secondary">
            Here you will find an overview of the data and services available to
            you in the energy data space.
          </Typography.Text>
        </Row>
      </Flex>
    );
  };

  const renderCatalogExplorer = () => {
    if (loading) {
      return <Skeleton.Input block active />;
    }

    if (error) {
      return <Alert message={error.message} type="error" />;
    }

    return (
      <Flex vertical gap={"small"}>
        <Row>
          <Input.Search
            placeholder="Filter by keywords"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Row>

        <Row>
          <List
            style={{ width: "100%" }}
            dataSource={filteredOffers}
            renderItem={(offer: VkeeOffer) => {
              return (
                <List.Item style={{ width: "100%" }}>
                  <Card
                    style={{ width: "100%", backgroundColor: "#f0f2f5" }}
                    title={
                      <Flex justify="space-between">
                        <Typography.Text strong>{offer.name}</Typography.Text>
                        {offer.contenttype === VkeeAngebotstyp.ANLAGENSTEUERUNG ? (
                          <Tag color="green">Control interface</Tag>
                        ) : (
                          <Tag color="blue">Generic Offer</Tag>
                        )}
                      </Flex>
                    }
                  >
                    <Card.Grid
                      hoverable={false}
                      style={{ width: "100%", height: 100 }}
                    >
                      <Space direction="vertical">
                        <Space direction="vertical">
                          <Typography.Paragraph
                            ellipsis={{ rows: 3 }}
                            type="secondary"
                          >
                            {offer.description
                              ? offer.description
                              : "No detailed description available"}
                          </Typography.Paragraph>
                        </Space>
                      </Space>
                    </Card.Grid>

                    <Card.Grid hoverable={false} style={{ width: "100%" }}>
                      <Flex justify="space-between">
                        <Space direction="vertical">
                          <Space direction="horizontal">
                            <Typography.Text strong>Asset ID:</Typography.Text>
                            <Typography.Text type="secondary">
                              {offer.assetId}
                            </Typography.Text>
                          </Space>
                          <Space direction="horizontal">
                            <Typography.Text strong>Provider:</Typography.Text>
                            <Typography.Text type="secondary">
                              {offer.connectorUrl}
                            </Typography.Text>
                          </Space>
                        </Space>

                        <Space direction="vertical">
                          {offer.contenttype ===
                          VkeeAngebotstyp.ANLAGENSTEUERUNG ? (
                            <Button
                              type="primary"
                              onClick={() => handleUseOffer(offer)}
                            >
                              Pair with EMS
                            </Button>
                          ) : (
                            <Button disabled>Negotiate</Button>
                          )}
                        </Space>
                      </Flex>
                    </Card.Grid>
                  </Card>
                </List.Item>
              );
            }}
          />
        </Row>
      </Flex>
    );
  };

  return (
    <Flex vertical gap={"small"}>
      {renderCatalogExplorerHeader()}
      {renderCatalogExplorer()}
    </Flex>
  );
};

export default FederatedCatalogExplorer;

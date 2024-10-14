import React from "react";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
} from "reactstrap";
import {
  FaBoxOpen,
  FaTruck,
  FaCheck,
  FaTimesCircle,
  FaSync,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// core components
import { chartExample1 } from "../../variables/charts.js";

function OrderCategoryCards() {
  const [bigChartData, setbigChartData] = React.useState("data1");
  const setBgChartData = (name) => {
    setbigChartData(name);
  };
  const navigate = useNavigate();

  const orderCategories = [
    {
      name: "Processing",
      dispalyName: "Processing",
      orderCount: 25,
      icon: <FaSync className="me-2" />,
    },
    {
      name: "VendorReady",
      dispalyName: "Vendor Ready",
      orderCount: 12,
      icon: <FaTruck className="me-2" />,
    },
    {
      name: "PartiallyDelivered",
      dispalyName: "Partially Delivered",
      orderCount: 8,
      icon: <FaBoxOpen className="me-2" />,
    },
    {
      name: "Delivered",
      dispalyName: "Delivered",
      orderCount: 45,
      icon: <FaCheck className="me-2" />,
    },
    {
      name: "Canceled",
      dispalyName: "Canceled",
      orderCount: 5,
      icon: <FaTimesCircle className="me-2" />,
    },
    {
      name: "Discarded",
      dispalyName: "Discarded",
      orderCount: 0,
      icon: <FaTimesCircle className="me-2" />,
    },
  ];

  return (
    <div className="content">
      <Row>
        {orderCategories.map((category) => (
          <Col md="4" key={category.name}>
            <Card className="mb-3">
              <CardHeader>
                <CardTitle tag="h3">
                  {category.icon}
                  {" " + category.dispalyName}
                </CardTitle>
                <h5 className="text-muted">
                  Total Orders: {category.orderCount}
                </h5>
              </CardHeader>
              <CardBody>
                <Button
                  color="primary"
                  onClick={() => navigate(`/admin/orders/${category.name}`)}
                >
                  Manage Orders
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      <Card className="card-chart">
        <CardHeader>
          <Row>
            <Col className="text-left" sm="6">
              <h5 className="card-category">Total amount of</h5>
              <CardTitle tag="h2">Orders</CardTitle>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <div className="chart-area">
            <Line
              data={chartExample1[bigChartData]}
              options={chartExample1.options}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default OrderCategoryCards;

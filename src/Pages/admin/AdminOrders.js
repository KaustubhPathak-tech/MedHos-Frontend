import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Home.css";
import { getAdminOrders, updateOrderStatus } from "../../actions/auth"; // Import updateOrderStatus action
import { Button } from "@mui/material";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown, Space, Tooltip } from "antd";

const AdminOrders = () => {
  const order = JSON.parse(localStorage.getItem("orders"));
  const user = useSelector((state) => state.fetch_current_userReducer);
  const dispatch = useDispatch();
  const medicine = JSON.parse(localStorage.getItem("Medicines"));
  var [selectedOrderId, setSelectedOrderId] = useState(""); // Store the selected order ID

  const handleStatusChange = async (newStatus) => {
    console.log("newStatus", newStatus);
    console.log("selectedOrderId", selectedOrderId);
    if (selectedOrderId) {
      // Ensure a valid order ID is selected
      try {
        // Dispatch an action to update the order status in the backend
        await dispatch(
          updateOrderStatus({ orderId: selectedOrderId, newStatus })
        );

        selectOrder = "";
        // Refresh the order list after updating the status
        // dispatch(getOrder({ userId: user?.user?.id }));
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    }
  };
  const items = [
    {
      key: "1",
      label: (
        <Button
          onClick={() => {
            handleStatusChange("shipped");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }}
        >
          Shipped
        </Button>
      ), // Pass the desired status to handleStatusChange
    },
    {
      key: "2",
      label: (
        <Button
          onClick={() => {
            handleStatusChange("out for delivery");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }}
        >
          Out for delivery
        </Button>
      ),
    },
    {
      key: "3",
      label: (
        <Button
          onClick={() => {
            handleStatusChange("delivered");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }}
        >
          Delivered
        </Button>
      ),
    },
    {
      key: "4",
      danger: false,
      label: (
        <Button
          onClick={() => {
            handleStatusChange("cancelled");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }}
        >
          Cancelled
        </Button>
      ),
    },
  ];
  const selectOrder = async (orderId) => {
    await setSelectedOrderId(orderId);
  };

  useEffect(() => {
    dispatch(getAdminOrders());
  }, [dispatch, getAdminOrders, user]);

  return (
    <div id="adminOrders" style={{ marginTop: "5%" }}>
      <h4>Orders</h4>
      <div className="row">
        <div className="col-12">
          <table className="table table-hover" id="Ordertable">
            <thead>
              <tr>
                <th scope="col">Order Id</th>
                <th scope="col">User Id</th>
                <th scope="col">Order Items</th>
                <th scope="col">Shipping Address</th>
                <th scope="col">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {order?.order?.map((item) => (
                <tr key={item.orderId}>
                  <th scope="row"># {item.orderId}</th>
                  <td>{item.user}</td>
                  <td>
                    {item.orderItems.map((item) => (
                      <div key={item.medicineId}>
                        {medicine?.data
                          .filter((med) => med._id === item.medicineId)
                          .map((med) => med.name)}{" "}
                        x {item.qty}
                      </div>
                    ))}
                  </td>
                  <td>{item.shippingAddress}</td>
                  <td>
                    {item.status}&nbsp;&nbsp;&nbsp;&nbsp;
                    <Dropdown
                      menu={{
                        items,
                      }}
                      trigger={["click"]}
                      onMouseOver={() => selectOrder(item.orderId)} // Store the selected order ID
                      onClick={() => {selectOrder(item.orderId)}} // Store the selected order ID
                    >
                      <Tooltip title="Update Status" placement="top">
                        <a onClick={(e) => e.preventDefault()}>
                          <Space>
                            <DownOutlined orderId={item.orderId} />
                          </Space>
                        </a>
                      </Tooltip>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

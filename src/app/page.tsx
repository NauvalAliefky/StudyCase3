"use client";
import React, { useState } from "react";
import { Button, Space, Table, Tag, Modal, Form, Input, message, Select, Menu, notification } from "antd";
import type { MenuProps, TableProps } from "antd";
import '@ant-design/v5-patch-for-react-19';
import "@/styles/globals.css";

export default function Page() {
  interface DataType {
    key: string;
    product: string;
    category: string;
    price: string;
    stock: string;
    description: string;
    status: string;
  }
  const handleSaveProduct = async () => {
    try {
      const values = await form.validateFields();
  
      if (isEditMode && editingProduct) {
        await fetch(`http://localhost:3000/products/${editingProduct.key}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        message.success("Product updated successfully!");
        setData((prevData) =>
          prevData.map((item) =>
            item.key === editingProduct.key ? { ...values, key: item.key } : item
          )
        );
      } else {
        const response = await fetch("http://localhost:3000/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
  
        const newProduct = await response.json();
        setData([...data, { ...newProduct, key: newProduct.id.toString() }]);
        message.success("Product added successfully!");
      }
  
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to save product.");
    }
  };
  

  const [data, setData] = useState<DataType[]>([
    {
      key: "1",
      product: "Laptop",
      category: "Electronics",
      price: "$1000",
      stock: "20",
      description: "High-performance laptop",
      status: "Available",
    },
  ]);

  const [deletedData, setDeletedData] = useState<DataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DataType | null>(null);
  const [currentTab, setCurrentTab] = useState("products");

  const [form] = Form.useForm();

  const showModal = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
    form.resetFields();
  };

  const showEditModal = (record: DataType) => {
    setIsEditMode(true);
    setEditingProduct(record);
    setIsModalOpen(true);
    form.setFieldsValue(record);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };


  const handleDelete = async (key: string) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you really want to delete this product?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await fetch(`http://localhost:3000/products/${key}`, { method: "DELETE" });
          setData((prevData) => prevData.filter((item) => item.key !== key));
          message.success("Product deleted successfully!");
        } catch (error) {
          console.error("Error deleting product:", error);
          message.error("Failed to delete product.");
        }
      },
    });
  };
  

  const handleRestore = (key: string) => {
    const restoredItem = deletedData.find((item) => item.key === key);
    if (restoredItem) {
      setData([...data, restoredItem]); // Kembalikan ke daftar utama
      setDeletedData((prevDeletedData) =>
        prevDeletedData.filter((item) => item.key !== key)
      );
      message.success("Product restored successfully!");
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    { title: "Product", dataIndex: "product", key: "product" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Available" ? "green" : "volcano"}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showEditModal(record)}>Edit</a>
          <a style={{ color: "red" }} onClick={() => handleDelete(record.key)}>Delete</a>
        </Space>
      ),
    },
  ];

  const deletedColumns: TableProps<DataType>["columns"] = [
    ...columns.filter((col) => col.key !== "action"),
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a style={{ color: "blue" }} onClick={() => handleRestore(record.key)}>Restore</a>
        </Space>
      ),
    },
  ];

  function Navbar() {
    const [currentTab, setCurrentTab] = useState("products");

    const handleMenuClick: MenuProps["onClick"] = (e) => {
      setCurrentTab(e.key);
    };

    const menuItems: MenuProps["items"] = [
      { label: "Product", key: "products" },
      { label: "Product Deleted", key: "deleted" },
      {
        label: <Button type="primary">Login</Button>,
        key: "login",
        style: { marginLeft: "auto" },
      },
    ];

    return (
      <div>
        <Menu mode="horizontal" selectedKeys={[currentTab]} onClick={handleMenuClick} items={menuItems} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px" }}>
          {currentTab === "products" && (
            <>
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h1 className="title" style={{ alignItems: "center" }}>Product Management</h1>
                <Button type="primary" onClick={showModal}>+ Add Product</Button>
              </div>
              <Table columns={columns} dataSource={data} style={{ width: "100%" }} />
            </>
          )}

          {currentTab === "deleted" && (
            <>
              <h1 className="title">Deleted Products</h1>
              <Table columns={deletedColumns} dataSource={deletedData} style={{ width: "100%" }} />
            </>
          )}

          <Modal title={isEditMode ? "Edit Product" : "Add New Product"} open={isModalOpen} onCancel={handleCancel} onOk={handleSaveProduct}>
            <Form form={form} layout="vertical">
              <Form.Item name="product" label="Product Name" rules={[{ required: true, message: "Please enter product name" }]}>
                <Input />
              </Form.Item>
              <Form.Item name="category" label="Category">
                <Input />
              </Form.Item>
              <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please enter price" }]}>
                <Input />
              </Form.Item>
              <Form.Item name="stock" label="Stock" rules={[{ required: true, message: "Please enter stock" }]}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea />
              </Form.Item>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
                <Select placeholder="Select status">
                  <Select.Option value="Available">Available</Select.Option>
                  <Select.Option value="Out Of Stock">Out Of Stock</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }

  return <Navbar />;
};

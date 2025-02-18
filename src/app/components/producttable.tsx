"use client";

import React from "react";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";

interface DataType {
  key: string;
  product: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  status: string[];
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Product",
    dataIndex: "product",
    key: "product",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (_, { status }) => (
      <>
        {status.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "out of stock") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Edit {record.product}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    product: "Laptop",
    category: "Electronics",
    price: 1500,
    stock: 10,
    description: "Powerful gaming laptop",
    status: ["in stock"],
  },
  {
    key: "2",
    product: "Smartphone",
    category: "Electronics",
    price: 900,
    stock: 0,
    description: "Latest model with best camera",
    status: ["out of stock"],
  },
  {
    key: "3",
    product: "Headphones",
    category: "Accessories",
    price: 200,
    stock: 25,
    description: "Noise-canceling wireless headphones",
    status: ["in stock"],
  },
];

const ProductTable: React.FC = () => <Table<DataType> columns={columns} dataSource={data} />;

export default ProductTable;

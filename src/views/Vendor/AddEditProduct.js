import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

function AddEditProduct({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    categoryName: "",
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="name">Product Name</Label>
        <Input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="description">Description</Label>
        <Input
          type="textarea"
          name="description"
          id="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="price">Price</Label>
        <Input
          type="number"
          name="price"
          id="price"
          value={formData.price}
          onChange={handleInputChange}
          step="0.01"
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="stockQuantity">Stock Quantity</Label>
        <Input
          type="number"
          name="stockQuantity"
          id="stockQuantity"
          value={formData.stockQuantity}
          onChange={handleInputChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="categoryName">Category Name</Label>
        <Input
          type="text"
          name="categoryName"
          id="categoryName"
          value={formData.categoryName}
          onChange={handleInputChange}
          required
        />
      </FormGroup>
      <Button type="submit" color="primary">
        {product ? "Update Product" : "Create Product"}
      </Button>{" "}
      <Button color="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </Form>
  );
}

export default AddEditProduct;

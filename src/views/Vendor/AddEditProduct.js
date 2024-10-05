import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import Swal from "sweetalert2"; // Import SweetAlert2
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../config/firebase";

function AddProduct({ product, onSave }) {
  const [productId, setProductId] = useState(product ? product.id : ""); // New state for product ID
  const [name, setName] = useState(product ? product.name : "");
  const [description, setDescription] = useState(
    product ? product.description : ""
  );
  const [categoryName, setCategoryName] = useState(
    product ? product.categoryName : ""
  );
  const [price, setPrice] = useState(product ? product.price : "");
  const [stockQuantity, setStockQuantity] = useState(
    product ? product.stockQuantity : ""
  );
  const [imageUrl, setImageUrl] = useState(product ? product.Imgurl : "");
  const [imageFile, setImageFile] = useState(null); 
  const [message, setMessage] = useState(""); // For feedback

  // Retrieve vendorId from local storage
  const vendorId = localStorage.getItem("vendorId");

    const handleImageUpload = () => {
      return new Promise((resolve, reject) => {
        if (!imageFile) {
          resolve(imageUrl);
          return;
        }

        const storageRef = ref(storage, `product-images/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Error during upload:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadedImageUrl = await handleImageUpload();

      const newProduct = {
        id: productId, // Include productId for editing
        name,
        description,
        categoryName,
        price,
        stockQuantity,
        Imgurl: uploadedImageUrl,
        vendorId, // Include vendorId in the product object
      };

      console.log("Submitting new product:", newProduct); // Debugging log

      const response = await fetch(
        product
          ? `http://127.0.0.1:15240/api/product/updateProduct/${product.id}`
          : "http://127.0.0.1:15240/api/product/createProduct",
        {
          method: product ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        }
      );

      console.log("Response status:", response.status); // Debugging log

      if (response.ok) {
        const createdProduct = await response.json();
        console.log("Product saved successfully:", createdProduct);

        onSave(createdProduct); // Call onSave to update the product list in the parent component
        // Show success alert
        Swal.fire({
          title: "Success!",
          text: "Product submitted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        const errorData = await response.json();
        console.error("Error saving product:", errorData);
      }
    } catch (error) {
      console.error("Error while saving product:", error);
    }
  };

  return (
    <div className="content">
      <Row className="justify-content-center">
        <Col md="6" lg="5">
          <Card>
            <CardHeader>
              <h5 className="title">
                {product ? "Edit Product" : "Create New Product"}
              </h5>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                {/* Product ID Field for Editing */}
                {product && (
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Product ID</label>
                        <Input
                          type="text"
                          placeholder="Enter product ID"
                          value={productId}
                          onChange={(e) => setProductId(e.target.value)}
                          required
                          readOnly // Make it read-only when editing
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Name</label>
                      <Input
                        type="text"
                        placeholder="Enter product name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Description</label>
                      <Input
                        type="textarea"
                        placeholder="Enter product description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Category</label>
                      <Input
                        type="text"
                        placeholder="Enter product category"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <label>Price</label>
                      <Input
                        type="number"
                        placeholder="Enter product price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Stock Quantity</label>
                      <Input
                        type="number"
                        placeholder="Enter stock quantity"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Upload Image</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        required={!product}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <CardFooter>
                  <Button className="btn-fill" color="primary" type="submit">
                    Submit
                  </Button>
                </CardFooter>
              </Form>
            </CardBody>
          </Card>
          {message && <div className="alert alert-info">{message}</div>}{" "}
          {/* Feedback message */}
        </Col>
      </Row>
    </div>
  );
}

export default AddProduct;

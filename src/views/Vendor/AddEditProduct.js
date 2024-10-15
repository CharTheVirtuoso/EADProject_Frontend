import React, { useState } from "react";
import {
  Button,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import Swal from "sweetalert2";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import { FaCheckCircle } from "react-icons/fa";

function AddEditProduct({ product, onSave, onCancel }) {
  const [productId, setProductId] = useState(product ? product.id : "");
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
  const [imageUploaded, setImageUploaded] = useState(false);

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
        id: productId,
        name,
        description,
        categoryName,
        price,
        stockQuantity,
        Imgurl: uploadedImageUrl,
        vendorId,
      };

      console.log("Submitting new product:", newProduct);

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

      console.log("Response status:", response.status);

      if (response.ok) {
        const createdProduct = await response.json();
        console.log("Product saved successfully:", createdProduct);

        onSave(createdProduct);
        Swal.fire({
          title: "Success!",
          text: `${product ? "Product edited" : "Product submitted"} successfully!`,
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        const errorData = await response.json();
        Swal.fire("Error", "Product submission failed. Please try again.", "error");
        console.error("Error saving product:", errorData);
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while saving the product.", "error");
      console.error("Error while saving product:", error);
    }
  };

  return (
    <div className="content">
      <Row className="justify-content-center">
        <Col md="12">
          <CardBody>
            <Form onSubmit={handleSubmit}>
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
                        readOnly
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
                        onChange={(e) => {
                          setImageFile(e.target.files[0]);
                          setImageUploaded(true); 
                        }}
                        required={!product}
                      />
                      {imageUploaded && (
                        <FaCheckCircle color="green" style={{ marginLeft: "10px" }} />
                      )}
                  </FormGroup>
                </Col>
              </Row>
              <Button color="secondary" onClick={onCancel} style={{ marginRight: "10px" }}>
                Cancel
              </Button>
              <Button className="btn-fill" color="primary" type="submit">
                Submit
              </Button>
            </Form>
          </CardBody>
        </Col>
      </Row>
    </div>
  );
}

export default AddEditProduct;

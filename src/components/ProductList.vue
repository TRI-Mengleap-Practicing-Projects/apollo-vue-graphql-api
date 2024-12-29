<script setup>
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref, computed, watchEffect } from 'vue';

// Updated GraphQL Query to Fetch Products including photo
const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      description
      photo {
        id
        filename_download
      }
    }
  }
`;

// GraphQL Mutation to Delete a Product
const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    delete_products_item(id: $id) {
      id
    }
  }
`;

// Updated GraphQL Mutation to Update a Product
const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $name: String, $price: Float, $description: String) {
    update_products_item(id: $id, data: { name: $name, price: $price, description: $description }) {
      id
      name
      price
      description
      photo {
        id
        filename_download
      }
    }
  }
`;

const { result, refetch } = useQuery(GET_PRODUCTS);
const product = computed(() => result.value?.products ?? []);
const { mutate: deleteProductMutation } = useMutation(DELETE_PRODUCT);
const { mutate: updateProductMutation } = useMutation(UPDATE_PRODUCT);

const editingProductId = ref(null);
const editForm = ref({ name: '', price: 0, description: '' });

const getImageUrl = (photo) => {
  if (!photo) return null;
  return `/api/assets/${photo.id}`;
};

const deleteProduct = async (id) => {
  try {
    await deleteProductMutation({ id });
    await refetch();
    console.log(`Product with ID ${id} has been deleted.`);
  } catch (error) {
    console.error('Failed to delete product:', error);
  }
};

const startEditing = (product) => {
  editingProductId.value = product.id;
  editForm.value = { 
    name: product.name, 
    price: product.price, 
    description: product.description 
  };
};

const saveProductChanges = async () => {
  try {
    await updateProductMutation({ 
      id: editingProductId.value, 
      name: editForm.value.name, 
      price: parseFloat(editForm.value.price), 
      description: editForm.value.description 
    });
    await refetch();
    editingProductId.value = null;
    console.log('Product updated successfully');
  } catch (error) {
    console.error('Failed to update product:', error);
  }
};

const cancelEditing = () => {
  editingProductId.value = null;
  editForm.value = { name: '', price: 0, description: '' };
};

watchEffect(() => {
  console.log(product);
});
</script>

<template>
  <div class="container">
    <h1 class="title">All Products</h1>
    <div class="products-grid">
      <div v-for="product in product" :key="product.id" class="product-card">
        <div class="product-image-container" v-if="product.photo">
          <img 
            :src="getImageUrl(product.photo)" 
            :alt="product.name"
            class="product-image"
            @error="$event.target.style.display='none'"
          />
        </div>
        
        <div v-if="editingProductId === product.id" class="edit-form">
          <div class="form-group">
            <label>Product Name</label>
            <input v-model="editForm.name" placeholder="Product Name" class="input-field" />
          </div>
          <div class="form-group">
            <label>Price</label>
            <input v-model="editForm.price" type="number" placeholder="Product Price" class="input-field" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="editForm.description" placeholder="Product Description" class="input-field textarea"></textarea>
          </div>
          <div class="button-group">
            <button @click="saveProductChanges" class="btn save-btn">Save</button>
            <button @click="cancelEditing" class="btn cancel-btn">Cancel</button>
          </div>
        </div>

        <div v-else class="product-details">
          <div class="product-info">
            <h2 class="product-name">{{ product.name }}</h2>
            <div class="product-price">${{ product.price.toFixed(2) }}</div>
            <p class="product-description">{{ product.description }}</p>
            <div class="product-id">ID: {{ product.id }}</div>
          </div>
          <div class="button-group">
            <button @click="startEditing(product)" class="btn edit-btn">Edit</button>
            <button @click="deleteProduct(product.id)" class="btn delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  color: rgb(97, 97, 97);
  background-color: #f0f0f0;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.product-card {
  background: #ffffff;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: scale(1.02);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-details, .edit-form {
  padding: 1rem;
}

.product-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.product-price {
  font-size: 1.25rem;
  color: #28a745;
  margin: 0.5rem 0;
}

.product-description {
  margin: 0.5rem 0;
  color: #555;
}

.product-id {
  font-size: 0.9rem;
  color: #888;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:hover {
  opacity: 0.9;
}

.edit-btn { background: #007bff; color: white; }
.delete-btn { background: #dc3545; color: white; }
.save-btn { background: #28a745; color: white; }
.cancel-btn { background: #6c757d; color: white; }

.input-field {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-top: 0.5rem;
}

.input-field:focus {
  border-color: #007bff;
  outline: none;
}

.textarea {
  height: 100px;
  resize: vertical;
}
</style>
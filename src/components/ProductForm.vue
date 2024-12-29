<script setup>
  import { ref } from 'vue';
  import { useMutation } from '@vue/apollo-composable';
  import gql from 'graphql-tag';
  
  // GraphQL Mutation for Creating Product
  const CREATE_PRODUCT = gql`
    mutation CreateProduct($name: String!, $price: Float!, $description: String) {
      create_products_item(data: {
        name: $name,
        price: $price,
        description: $description
      }) {
        id
        name
      }
    }
  `;
  
  // Form Data
  const form = ref({
    name: '',
    price: '',
    description: '',
  });
  
  const loading = ref(false);
  const success = ref(false);
  const error = ref(null);
  
  // Apollo Mutation
  const { mutate: createProduct } = useMutation(CREATE_PRODUCT);
  
  const submitForm = async () => {
    loading.value = true;
    error.value = null;
    success.value = false;
  
    try {
      const { data } = await createProduct({
        name: form.value.name,
        price: parseFloat(form.value.price),
        description: form.value.description,
      });
  
      console.log('Product created:', data);
      success.value = true;
  
      // Reset Form
      form.value = {
        name: '',
        price: '',
        description: '',
      };
    } catch (err) {
      console.error('Error:', err);
      error.value = 'Failed to create product. Please try again.';
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div>
    <h2>Add New Product</h2>
    <form @submit.prevent="submitForm">
      <!-- Name Field -->
      <div>
        <label for="name">Name:</label>
        <input v-model="form.name" id="name" type="text" required />
      </div>

      <!-- Price Field -->
      <div>
        <label for="price">Price:</label>
        <input v-model="form.price" id="price" type="number" step="0.01" required />
      </div>

      <!-- Description Field -->
      <div>
        <label for="description">Description:</label>
        <textarea v-model="form.description" id="description"></textarea>
      </div>

      <!-- Submit Button -->
      <button type="submit">Create Product</button>
    </form>

    <!-- Loading & Success/Error Message -->
    <div v-if="loading">Creating product...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>
    <div v-if="success" style="color: green;">Product created successfully!</div>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

label {
  font-weight: bold;
}

input,
textarea {
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

button {
  padding: 0.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #45a049;
}
</style>